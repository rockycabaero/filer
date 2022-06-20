const fs = require("fs");
const os = require("os");
const path = require("path");
const { nanoid } = require("nanoid");
const { Parser } = require("json2csv");
const nodemailer = require("nodemailer");
const moment = require("moment-timezone");

const { Domain, Detail } = require("./db");
const {
	TIMEZONE,
	RECIPIENT_EMAILS,
	SMTP_HOST,
	SMTP_USER,
	SMTP_PASSWORD,
} = require("../config");

const generateFileName = () => {
	const filename =
		moment().tz(TIMEZONE).format("YYYY-MM-DD") + "-" + nanoid() + ".csv";

	return path.resolve(os.tmpdir(), filename);
};

class Report {
	constructor(check) {
		this.check = check;
		this.data = null;
		this.filename = generateFileName();
		this.fields = [
			"domain",
			"domain_rating",
			"domain_refs",
			"status",
			"timestamp",
		];
	}

	async fetchData() {
		this.data = await Detail.findAll({
			attributes: this.fields,
			where: { check_id: this.check.id, status: 404 },
			raw: true,
		});
	}

	async generate() {
		const parser = new Parser({ fields: this.fields });
		const csv = parser.parse(this.data);
		fs.writeFileSync(this.filename, csv, "utf8");
	}

	async send() {
		const transporter = nodemailer.createTransport({
			host: SMTP_HOST,
			secure: false,
			auth: {
				user: SMTP_USER,
				pass: SMTP_PASSWORD,
			},
		});

		await transporter.sendMail({
			from: `"Domain Scanner" <${SMTP_USER}>`,
			to: RECIPIENT_EMAILS,
			subject: "Domain Scan Daily Report",
			text: `Hi Mikkel, here are the reports of the scan on date ${moment(
				this.check.timestamp
			)
				.tz(TIMEZONE)
				.format("D MMM YYYY")}.`,
			html: `<p>Hi <b>Mikkel</b>, here are the reports of the scan on date ${moment(
				this.check.timestamp
			)
				.tz(TIMEZONE)
				.format("D MMM YYYY")}.</p>`,
			attachments: [
				{
					filename: this.filename,
					path: this.filename,
					contentType: "text/csv",
				},
			],
		});

		console.log("Report sent");
	}
}

module.exports = Report;
