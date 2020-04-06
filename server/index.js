const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const mysql = require('mysql');
const users = require('./routes/users');
const orders = require('./routes/orders');

// Express

const app = express();
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

app.use('/users', users);
app.use('/orders', orders);
// app.use('/publishers', publishers);
// app.use('/developers', developers);
// app.use('/reviews', reviews);
// app.use('/transfers', transfers);
// app.use('/payments', payments);
// app.use('/faq', faq);
// app.use('/games', games);
// app.use('/images', images);
// app.use('/carts', carts);

app.listen(4000);

// MySQL

const pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : 'root',
    database        : 'games'
});

pool.getConnection((error, connection) => {
	if (error) {
		if (error.code === 'PROTOCOL_CONNECTION_LOST') {
			console.error('Database connection was closed.')
		}
		if (error.code === 'ER_CON_COUNT_ERROR') {
			console.error('Database has too many connections.')
		}
		if (error.code === 'ECONNREFUSED') {
			console.error('Database connection was refused.')
		}
	}
  
	console.log('Database connection test is successful.')

	if (connection) connection.release();
  
	return;
});

const query = async function(query, ...params) {
	return new Promise((resolve, reject) => {
		pool.getConnection((error, connection) => {
			if (error) resolve(null);

			if (connection) {
				const q = connection.query(query, params, (error, result) => {
					if (error) resolve(null);
					resolve(result);
				});

				q.on('end', function () {
                    connection.release();
                });
			}
		});
	});
}

exports.query = query;