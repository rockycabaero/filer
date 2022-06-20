const express = require("express");
const { Op } = require("sequelize");
const moment = require("moment-timezone");

const { TIMEZONE } = require("../../config");

const { sequelize, Detail, Domain } = require("../db");

const router = express.Router();

router.get("/api/details", async (req, res, next) => {
	try {
		let { filter, range, sort } = req.query;

		filter = JSON.parse(filter);
		range = JSON.parse(range);
		sort = JSON.parse(sort);

		const now = moment(filter["date"]).tz(TIMEZONE);
		const start = now.startOf("day").toISOString();
		const end = now.endOf("day").toISOString();

		const filters = {
			timestamp: {
				[Op.gte]: start,
				[Op.lte]: end,
			},
			checked: true,
		};

		if (filter["q"]) {
			filters.domain = {
				[Op.like]: `%${filter["q"]}%`,
			};
		}

		switch (filter["select"]) {
			case "active":
				filters.public_domain_status = "A";
				break;

			case "deactivated":
				filters.public_domain_status = "H";
				break;

			case "blocked":
				filters.public_domain_status = "B";
				break;

			case "reserved":
				filters.public_domain_status = "I";
				break;

			case "waiting_list":
				filters.public_domain_status = "W";
				break;

			case "available":
				filters.status = 404;
				break;

			case "delete_date":
				filters.public_deletedate = { [Op.not]: "" };
				break;

			case "delete_date_or_available":
				filters[Op.or] = [
					{ status: 404 },
					{ public_deletedate: { [Op.not]: "" } },
				];
				break;

			case "bad_domain":
				filters.status = 400;
				break;
		}

		const { count, rows } = await Detail.findAndCountAll({
			where: filters,
			offset: range[0],
			limit: range[1] - range[0] + 1,
			order: [[sort[0], sort[1]]],
			raw: true,
		});

		res.setHeader(
			"Content-Range",
			`domains ${range[0]}-${range[0] + rows.length - 1}/${count}`
		);

		res.json(rows);
	} catch (err) {
		next(err);
	}
});

router.delete("/api/details", async (req, res, next) => {
	const { filter } = req.query;
	const { id } = JSON.parse(filter);

	try {
		// const domains = await Detail.findAll({
		// 	attributes: ["domain"],
		// 	where: { id },
		// 	raw: true,
		// });

		// const domain_name = domains.map((item) => item.domain);

		// await sequelize.transaction(async (t) => {
		// 	await Detail.destroy({ where: { id } });
		// 	await Domain.destroy({ where: { domain_name } });
		// 	res.json(id);
		// });
		const data = await Detail.destroy({ where: { id } });
		res.json(id);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
