const express = require("express");

const { Check } = require("../db");

const router = express.Router();

let scanner = null;

router.post("/api/actions/start", async (req, res, next) => {
	try {
		await scanner.activate();
		res.json({ message: "Scanner Activated" });
	} catch (err) {
		next(err);
	}
});

router.post("/api/actions/stop", async (req, res, next) => {
	try {
		await scanner.deactivate();
		res.json({ message: "Scanner Deactivated" });
	} catch (err) {
		next(err);
	}
});

router.get("/api/actions/last", async (req, res, next) => {
	try {
		const lastCheck = await Check.findOne({
			order: [["timestamp", "DESC"]],
			limit: 1,
			raw: true,
		});
		res.json({ timestamp: lastCheck.timestamp });
	} catch (err) {
		next(err);
	}
});

module.exports = (_scanner) => {
	scanner = _scanner;
	return router;
};
