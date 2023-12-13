const mysql = require('mysql');
const logger = require("../util/logger");

const pool = mysql.createPool({
	host: process.env.windows_cloud_host || "localhost",
	database: process.env.windows_cloud_db || "windows_11_cloud",
	user: process.env.windows_cloud_user || "root",
	password: JSON.parse(process.env.windows_cloud_password) || "",
	connectionLimit: 10, // Adjust the limit as needed
  });

module.exports = pool;