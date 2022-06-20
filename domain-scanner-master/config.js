if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

module.exports = {
	TIMEZONE: "Asia/Calcutta",
	DAYS_BEFORE_DELETE: 7,
	RECIPIENT_EMAILS: ["ahamadalam66@gmail.com", "mikkel@dintekstforfatter.dk"],

	JWT_SECRET: process.env.JWT_SECRET,
	ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
	DB_HOST: process.env.DB_HOST,
	DB_NAME: process.env.DB_NAME,
	DB_USER: process.env.DB_USER,
	DB_PASSWORD: process.env.DB_PASSWORD,
	SMTP_HOST: process.env.SMTP_HOST,
	SMTP_USER: process.env.SMTP_USER,
	SMTP_PASSWORD: process.env.SMTP_PASSWORD,
};
