let mysql = require('mysql');
let pool = mysql.createPool({
	connectionLimit : 10,
	host : 'classmysql.engr.oregonstate.edu',
	user : 'cs340_tonthada',
	password : '8034',
	database : 'cs340_tonthada'
});

module.exports.pool = pool;
