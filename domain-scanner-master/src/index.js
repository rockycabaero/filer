const { Sequelize } = require("sequelize");
const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const cors = require("cors");

const auth = require("./routes/auth");
const domains = require("./routes/domains");
const servers = require("./routes/servers");
const details = require("./routes/details");
const checks = require("./routes/checks");
const actions = require("./routes/actions");
const status = require("./routes/status");
const isLiveRoute = require("./routes/isLive");

const authenticate = require("./middleware/authenticate");

const { sequelize } = require("./db");
const Scanner = require("./scanner");
const { createCronJobs } = require("./cron-jobs");

const scanner = new Scanner();

if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json());

app.use(authenticate);

app.use(auth);
app.use(domains);
app.use(servers);
app.use(details);
app.use(checks);
app.use(isLiveRoute);
app.use(actions(scanner));
app.use(status(scanner));

if (process.env.NODE_ENV === "production") {
	const buildFolder = path.resolve(__dirname, "..", "client", "build");
	const indexFile = path.resolve(buildFolder, "index.html");

	app.use(express.static(buildFolder));

	app.get((req, res, next) => res.sendFile(indexFile));
}

app.use((err, req, res, next) => {
	console.log(err);
	if (err instanceof Sequelize.ConnectionError) {
		return res.status(503).json({ message: "Database connection error." });
	}
	res.status(500).json({ message: "Something went wrong." });
});

const start = async () => {
	await sequelize.sync({ alter: true });
	app.listen(PORT, (err) => {
		if (err) throw err;
		console.log(`Server started on port ${PORT}`);
		createCronJobs(scanner);
	});
};

start();
