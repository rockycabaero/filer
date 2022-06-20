const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const DatabaseController = require("./DatabaseController");

class Server {
	constructor({ id, scanner, serverAddress }) {
		this.id = id;
		this.actionId = null;
		this.running = false;
		this.failedCount = 0;
		this.successCount = 0;
		this.errorCount = 0;
		this.scanner = scanner;
		this.serverAddress = serverAddress;
		this.databaseController = new DatabaseController({ scanner, server: this });
	}

	start() {
		const actionId = uuidv4();

		this.actionId = actionId;
		this.running = true;

		const run = async () => {
			if (this.actionId === actionId) {
				const domainName = this.scanner.domainList.pop();
				try {
					if (!domainName || this.shouldStop()) {
						this.scanner.removeServer(this.id);
						return;
					}

					await this.execute(domainName);

					setTimeout(run, 1000);
				} catch (err) {
					await this.handleError(err, domainName);
					setTimeout(run, 1000);
				}
			}
		};

		console.log(`${this.serverAddress} Server started`);
		run();
	}

	stop() {
		this.actionId = null;
		this.running = false;
		console.log(`${this.serverAddress} Server stopped`);
		this.scanner.serverDetails.push({
			serverAddress: this.serverAddress,
			successCount: this.successCount,
			errorCount: this.errorCount,
		});
	}

	shouldStop() {
		return (
			!this.scanner.active || !this.scanner.scanning || this.failedCount > 20
		);
	}

	onSave() {
		if (this.scanner.domainList.length === 0) {
			this.scanner.removeServer(this.id);
		}

		this.scanner.onSave();
	}

	async execute(domainName) {
		const url = `${this.serverAddress}/proxy.php?domain=${domainName}`;
		const { data } = await axios.get(url, {
			headers: {
				Accept: "application/json",
			},
			validateStatus: null,
		});

		const { status } = data;

		if (status !== 200 && status !== 400 && status !== 404) {
			throw new Error("Something went wrong");
		}

		data.domain = domainName;

		this.databaseController.save(data);

		this.failedCount = 0;
		this.successCount = this.successCount + 1;
	}

	handleError(err, domainName) {
		console.log(err.message);
		this.scanner.domainList.push(domainName);
		this.failedCount = this.failedCount + 1;
		this.errorCount = this.errorCount + 1;
		console.log(`${this.serverAddress}, Failed Count: ${this.failedCount}`);
	}
}

module.exports = Server;
