const { v4: uuidv4 } = require("uuid");

const { Server, Detail } = require("../db");
const ScannerServer = require("./Server");
const { createNewCheck } = require("../api");

class Scanner {
	constructor() {
		this.active = true;
		this.scanning = false;
		this.checkId = null;
		this.serverList = new Map();
		this.domainList = [];
		this.total = 0;
		this.done = 0;
		this.complete = false;
		this.serverDetails = [];
	}

	async addServers() {
		const _servers = await Server.findAll({ raw: true });

		_servers.forEach((row) => this.addServer(row.server_name.trim()));
	}

	async init() {
		const { checkId, domainList, total } = await createNewCheck();

		this.checkId = checkId;
		this.domainList = domainList;
		this.total = total;
	}

	async start() {
		this.scanning = true;
		this.done = 0;
		await this.addServers();
		await this.init();
		this.serverList.forEach((server) => server.start());
	}

	async resume({ checkId, done, total }) {
		this.scanning = true;
		await this.addServers();

		const _details = await Detail.findAll({
			attributes: ["domain"],
			where: { check_id: checkId, checked: false },
			raw: true,
		});

		const _domains = _details.map((row) => row.domain);

		this.domainList = _domains;
		this.checkId = checkId;
		this.done = done;
		this.total = total;

		this.serverList.forEach((server) => server.start());
	}

	stop() {
		this.scanning = false;
		this.serverList.forEach((server) => server.stop());
	}

	onSave() {
		this.done = this.done + 1;

		if (this.domainList.length === 0 && this.serverList.size === 0) {
			this.onComplete();
		}
	}

	onComplete() {
		this.complete = true;
		this.scanning = false;
		console.log("Scan completed");
		console.log(this.serverDetails);
	}

	activate() {
		this.active = true;
	}

	deactivate() {
		this.active = false;
		this.scanning = false;
	}

	addServer(serverAddress) {
		const serverId = uuidv4();
		const server = new ScannerServer({
			id: serverId,
			scanner: this,
			serverAddress,
		});

		this.serverList.set(serverId, server);

		return { serverId };
	}

	removeServer(serverId) {
		this.serverList.get(serverId).stop();
		this.serverList.delete(serverId);
	}

	getStatus() {
		if (!this.scanning) {
			return {
				active: this.active,
				status: "idle",
				data: null,
			};
		}

		return {
			active: this.active,
			status: "scanning",
			data: {
				total: this.total,
				scanned: this.done,
				startTimestamp: this.startTimestamp,
			},
		};
	}
}

module.exports = Scanner;
