let mysql = require('mysql');
let pool = mysql.createPool({
	connectionLimit : 10,
	host : 'nkpl8b2jg68m87ht.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
	user : 'emz9brlh70p8cpot	',
	password : 'n49u0hsw7ich0mxp',
	database : 'g96cthu7a4gm7clz'
});

module.exports.pool = pool;
