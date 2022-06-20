const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/api/isLive", async (req, res, next) => {
	try {
		const serverUrl = req.body.serverUrl.trim().replace(/\/+$/, "");

		const url = `${serverUrl}/proxy.php?domain=dk-hostmaster.dk`;
		await axios.get(url, {
			headers: {
				Accept: "application/json",
			},
		});

		res.sendStatus(200);
	} catch (err) {
		console.log(err.message);
		next(err);
	}
});

module.exports = router;
