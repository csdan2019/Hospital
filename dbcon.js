let mysql = require('mysql');
let pool = mysql.createPool({
	connectionLimit : 10,
	host : 'ui0tj7jn8pyv9lp6.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
	user : 'd10n13m48jj5oa25',
	password : 'b5i8mhku5clfapws',
	database : 'llx1noozm5tshreh'
});

module.exports.pool = pool;
