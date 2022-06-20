const express = require("express");
const { Op } = require("sequelize");

const { sequelize, Server } = require("../db");

const router = express.Router();

// GET All domains
router.get("/api/servers", async (req, res, next) => {
	let { range, sort } = req.query;
	range = JSON.parse(range);
	sort = JSON.parse(sort);

	const { count, rows } = await Server.findAndCountAll({
		offset: range[0],
		limit: range[1] - range[0] + 1,
		order: [[sort[0], sort[1]]],
		raw: true,
	});
	res.setHeader(
		"Content-Range",
		`servers ${range[0]}-${range[0] + rows.length - 1}/${count}`
	);
	res.json(rows);
});

// GET one server
router.get("/api/servers/:id", async (req, res, next) => {
	try {
		const data = await Server.findByPk(req.params.id, { raw: true });
		res.json(data);
	} catch (err) {
		next(err);
	}
});

// Create server
router.post("/api/servers", async (req, res, next) => {
	try {
		const data = await Server.create(
			{ server_name: req.body.server_name },
			{ raw: true }
		);
		res.json(data);
	} catch (err) {
		next(err);
	}
});

// Update server
router.put("/api/servers/:id", async (req, res, next) => {
	try {
		const data = await Server.update(
			{
				server_name: req.body.server_name,
			},
			{ where: { id: req.params.id } }
		);
		res.json({ id: req.params.id });
	} catch (err) {
		next(err);
	}
});

// Delete a server
router.delete("/api/servers/:id", async (req, res, next) => {
	try {
		const data = await Server.destroy({ where: { id: req.params.id } });
		res.json({ id: req.params.id });
	} catch (err) {
		next(err);
	}
});

// Delete many server
router.delete("/api/servers", async (req, res, next) => {
	const { filter } = req.query;
	const { id } = JSON.parse(filter);
	try {
		const data = await Server.destroy({ where: { id } });
		res.json(id);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
