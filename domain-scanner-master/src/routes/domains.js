const express = require("express");
const { Op } = require("sequelize");

const { sequelize, Domain } = require("../db");

const router = express.Router();

router.get("/api/domains/all", async (req, res, next) => {
	try {
		const data = await Domain.findAll({ raw: true });
		res.json(data);
	} catch (err) {
		next(err);
	}
});

router.post("/api/domains/all", async (req, res, next) => {
	try {
		await sequelize.transaction(async (t) => {
			let { domainList } = req.body.data;
			domainList = domainList.map((domain) => ({ domain_name: domain }));

			const deleted = await Domain.destroy(
				{ truncate: true },
				{ transaction: t }
			);
			const inserted = await Domain.bulkCreate(domainList, { transaction: t });

			res.json({ message: "Successfully saved data" });
		});
	} catch (err) {
		next(err);
	}
});

// GET All domains
router.get("/api/domains", async (req, res, next) => {
	let { filter, range, sort } = req.query;

	filter = JSON.parse(filter);
	range = JSON.parse(range);
	sort = JSON.parse(sort);

	const filters = {};

	if (filter["q"]) {
		filters.domain_name = {
			[Op.like]: `%${filter["q"]}%`,
		};
	}

	const { count, rows } = await Domain.findAndCountAll({
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
});

// GET one domain
router.get("/api/domains/:id", async (req, res, next) => {
	try {
		const data = await Domain.findByPk(req.params.id, { raw: true });
		res.json(data);
	} catch (err) {
		next(err);
	}
});

// Create domain
router.post("/api/domains", async (req, res, next) => {
	try {
		const { domain_name, domain_rating, domain_refs } = req.body;
		const data = await Domain.create(
			{ domain_name, domain_rating, domain_refs },
			{ raw: true }
		);
		res.json(data);
	} catch (err) {
		next(err);
	}
});

// Update domain
router.put("/api/domains/:id", async (req, res, next) => {
	try {
		const { domain_name, domain_rating, domain_refs } = req.body;
		const data = await Domain.update(
			{ domain_name, domain_rating, domain_refs },
			{ where: { id: req.params.id } }
		);
		res.json({ id: req.params.id });
	} catch (err) {
		next(err);
	}
});

// Delete a domain
router.delete("/api/domains/:id", async (req, res, next) => {
	try {
		const data = await Domain.destroy({ where: { id: req.params.id } });
		res.json({ id: req.params.id });
	} catch (err) {
		next(err);
	}
});

// Delete many domain
router.delete("/api/domains", async (req, res, next) => {
	const { filter } = req.query;
	const { id } = JSON.parse(filter);
	try {
		const data = await Domain.destroy({ where: { id } });
		res.json(id);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
