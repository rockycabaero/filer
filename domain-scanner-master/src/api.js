const moment = require("moment-timezone");
const { Op } = require("sequelize");

const { sequelize, Check, Detail, Domain } = require("./db");

const { TIMEZONE, DAYS_BEFORE_DELETE } = require("../config");

const BATCH_SIZE = 5000;

exports.createNewCheck = async () => {
	let checkId = null;

	const _domains = await Domain.findAll({ raw: true });

	const domainList = _domains.map((row) => row.domain_name);

	await sequelize.transaction(async (t) => {
		const data = await Check.create(
			{
				total_domain_count: _domains.length,
				timestamp: moment().toISOString(),
			},
			{ transaction: t }
		);

		const { id } = data.get({ plain: true });
		checkId = id;

		const promises = [];

		for (let i = 0; i < _domains.length / BATCH_SIZE; i++) {
			const domainList = _domains.splice(i * BATCH_SIZE, BATCH_SIZE);
			promises.push(
				Detail.bulkCreate(
					domainList.map(({ domain_name, domain_rating, domain_refs }) => ({
						domain: domain_name,
						domain_rating,
						domain_refs,
						check_id: id,
						checked: false,
					})),
					{ transaction: t }
				)
			);
		}

		return Promise.all(promises);
	});

	return { checkId, domainList, total: domainList.length };
};

exports.isScannedToday = async () => {
	const now = moment().tz(TIMEZONE);
	const start = now.startOf("day").toISOString();
	const end = now.endOf("day").toISOString();

	const checked = await Check.findOne({
		where: {
			timestamp: {
				[Op.gte]: start,
				[Op.lt]: end,
			},
		},
		raw: true,
	});

	if (checked) {
		const done = await Detail.count({
			where: {
				check_id: checked.id,
				checked: true,
			},
		});

		return { checkId: checked.id, total: checked.total_domain_count, done };
	}

	return null;
};

exports.deleteOldData = async () => {
	const now = moment().tz(TIMEZONE).subtract(DAYS_BEFORE_DELETE, "days");
	const start = now.startOf("day").toISOString();

	return Check.destroy({
		where: {
			timestamp: {
				[Op.lt]: start,
			},
		},
	});
};
