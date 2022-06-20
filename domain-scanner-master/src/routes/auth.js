const express = require("express");
const jwt = require("jsonwebtoken");

if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const router = express.Router();

router.post("/api/auth/login", (req, res, next) => {
	const { username, password } = req.body;

	if (username === "admin" && password === process.env.ADMIN_PASSWORD) {
		const token = jwt.sign({ username: "admin" }, process.env.JWT_SECRET);
		return res.json(token);
	}
	res.status(401).json({ message: "Invalid username or password" });
});

module.exports = router;
