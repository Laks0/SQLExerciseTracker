const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

const connection = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USERNAME,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
	port: process.env.DB_PORT
});

connection.connect(err => {
	if (err) {
		console.error("ERROR IN SQL CONNECTION");
		console.error(err.message);
		return;
	}
	console.log("Connected to database");
});

class DbHandler {
	async createUser(name) {
		try {
			const promise = await new Promise((resolve, reject) => {
				const query = "INSERT INTO users (id, name) VALUES (NULL, ?);"

				connection.query(query, [name], (err, result) => {
					if (err) reject(new Error(err.message));
					resolve(result.insertId);
				});
			});

			return promise;
		} catch (err) {
			console.error(err);
		}
	}

	async getAllUsers() {
		try {
			const promise = await new Promise((resolve, reject) => {
				const query = "SELECT * FROM users;";

				connection.query(query, (err, results) => {
					if (err) reject(new Error(err.message));
					resolve(results);
				});
			});

			return promise;

		} catch (err) {
			console.error(err);
		}
	}

	async removeUserById(id) {
		try {
			const promise = await new Promise ((resolve, reject) => {
				const query = "DELETE FROM users WHERE id = ?;";

				connection.query(query, [id], (err, result) => {
					if (err) reject(new Error(err.message));
					resolve(result.affectedRows);
				});
			});

			return promise;
		} catch (err) {
			console.error(err);
		}
	}
}

module.exports = DbHandler;
