let mysql = require('mysql');
let pool = mysql.createPool({
	connectionLimit : 10,
	host : 'localhost',
	user : 'backpack',
	password : 'password',
	database : 'hospitalDB'
});

module.exports.pool = pool;
