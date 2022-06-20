const moment = require("moment");

const { Detail } = require("../db");

const getFormatedDate = (dateString) =>
	!!dateString && moment(dateString).isValid()
		? moment(dateString, "YYYYMMDD HH:mm:ss").format("YYYY-MM-DD")
		: null;

class DatabaseController {
	constructor({ scanner, server }) {
		this.scanner = scanner;
		this.server = server;
	}
	save(detail) {
		if (detail.status === 200) {
			this.saveSuccessDetail(detail);
		} else {
			this.saveFailureDetail(detail);
		}
	}

	saveSuccessDetail({
		public_domain_status,
		domain,
		createddate,
		domain_type,
		paiduntildate,
		periodqty,
		public_deletedate,
		status,
	}) {
		try {
			Detail.update(
				{
					public_domain_status,
					createddate: getFormatedDate(createddate),
					domain_type,
					paiduntildate: getFormatedDate(paiduntildate),
					periodqty,
					public_deletedate: getFormatedDate(public_deletedate),
					timestamp: moment().toISOString(),
					status,
					checked: true,
				},
				{
					where: { domain, check_id: this.scanner.checkId },
				}
			);
			this.server.onSave();
		} catch (err) {
			this.scanner.domainList.push(domain);
		}
	}

	async saveFailureDetail({ domain, status }) {
		try {
			Detail.update(
				{
					status,
					checked: true,
					timestamp: moment().toISOString(),
				},
				{
					where: { domain, check_id: this.scanner.checkId },
				}
			);
			this.server.onSave();
		} catch (err) {
			this.scanner.domainList.push(domain);
		}
	}
}

module.exports = DatabaseController;
