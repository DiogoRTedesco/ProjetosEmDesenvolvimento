const dotenv = require('dotenv')

dotenv.config()
module.exports = {
	development: {
		dialect: 'mssql',
		host: process.env.DB_HOST,
		port: 1433,
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		options: {
			enableArithAbort: true,
			trustServerCertificate: true
		},
		define: {
			timestamps: true
		}
	}
};