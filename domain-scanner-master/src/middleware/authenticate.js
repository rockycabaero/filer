const jwt = require("jsonwebtoken");

if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

module.exports = (req, res, next) => {
	try {
		const { path } = req;

		if (path.startsWith("/api/auth")) {
			return next();
		} else if (path.startsWith("/api/status")) {
			return next();
		} else if (path.startsWith("/api")) {
			const token = req.header("authorization").split(" ")[1];
			jwt.verify(token, process.env.JWT_SECRET);
		}

		next();
	} catch (err) {
		return res.status(401).json({ message: "You are not logged in." });
	}
};
