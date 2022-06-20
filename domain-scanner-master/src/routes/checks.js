const express = require("express");

const { sequelize, Check } = require("../db");

const router = express.Router();

// GET All checks
router.get("/api/checks", async (req, res, next) => {
	let { range, sort } = req.query;

	try {
		range = JSON.parse(range);
		sort = JSON.parse(sort);

		const { count, rows } = await Check.findAndCountAll({
			offset: range[0],
			limit: range[1] - range[0] + 1,
			order: [[sort[0], sort[1]]],
			raw: true,
		});
		res.setHeader(
			"Content-Range",
			`checks ${range[0]}-${range[0] + rows.length - 1}/${count}`
		);
		res.json(rows);
	} catch (err) {
		next(err);
	}
});

// Delete many checks
router.delete("/api/checks", async (req, res, next) => {
	const { filter } = req.query;
	try {
		const { id } = JSON.parse(filter);
		const data = await Check.destroy({ where: { id } });
		res.json(id);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
