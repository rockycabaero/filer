const { Sequelize, DataTypes } = require("sequelize");

const host = process.env.DB_HOST;
const database = process.env.DB_NAME;
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

const sequelize = new Sequelize(database, username, password, {
	host,
	dialect: "mysql",
	logging: false,
});

const Model = Sequelize.Model;
class Domain extends Model {}
class Server extends Model {}
class Detail extends Model {}
class Check extends Model {}

Domain.init(
	{
		domain_name: DataTypes.STRING,
		domain_rating: DataTypes.INTEGER,
		domain_refs: DataTypes.INTEGER,
	},
	{
		sequelize,
		createdAt: false,
		updatedAt: false,
		tableName: "domains",
	}
);

Server.init(
	{
		server_name: DataTypes.STRING,
	},
	{
		sequelize,
		createdAt: false,
		updatedAt: false,
		tableName: "servers",
	}
);

Detail.init(
	{
		public_domain_status: DataTypes.STRING,
		domain: DataTypes.STRING,
		createddate: DataTypes.STRING,
		domain_type: DataTypes.STRING,
		paiduntildate: DataTypes.STRING,
		periodqty: DataTypes.INTEGER,
		public_deletedate: DataTypes.STRING,
		status: DataTypes.INTEGER,
		timestamp: DataTypes.DATE,
		check_id: DataTypes.INTEGER,
		checked: DataTypes.BOOLEAN,
		domain_rating: DataTypes.INTEGER,
		domain_refs: DataTypes.INTEGER,
	},
	{
		sequelize,
		createdAt: false,
		updatedAt: false,
		tableName: "details",
	}
);

Check.init(
	{
		success_count: DataTypes.INTEGER,
		bad_domain_count: DataTypes.INTEGER,
		not_found_count: DataTypes.INTEGER,
		total_domain_count: DataTypes.INTEGER,
		completed: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		email_sent: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		end_time: DataTypes.DATE,
		timestamp: DataTypes.DATE,
	},
	{
		sequelize,
		createdAt: false,
		updatedAt: false,
		tableName: "checks",
	}
);

Detail.belongsTo(Check, {
	foreignKey: "check_id",
	onDelete: "cascade",
});

module.exports = {
	sequelize,
	Domain,
	Server,
	Detail,
	Check,
};
