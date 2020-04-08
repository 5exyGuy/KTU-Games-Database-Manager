const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mysql = require('mysql');

const users = require('./routes/users');
const orders = require('./routes/orders');
// const carts = require('./routes/carts');
// const payments = require('./routes/payments');
// const transfers = require('./routes/transfers');
// const games = require('./routes/games');
// const developers = require('./routes/developers');
// const publishers = require('./routes/publishers');
// const images = require('./routes/images');
// const reviews = require('./routes/reviews');
// const faq = require('./routes/faq');

server.listen(80);

io.on('connection', (socket) => {
	console.log(`${socket.id} connected`);
	socket.on('vartotojai', (routeName, data, cb) => users.route(routeName, data, cb));
	socket.on('uzsakymai', (routeName, data, cb) => orders.route(routeName, data, cb));
	// socket.on('krepseliai', (routeName, data) => carts.route(socket, routeName, data));
	// socket.on('mokejimai', (routeName, data) => payments.route(socket, routeName, data));
	// socket.on('pervedimai', (routeName, data) => transfers.route(socket, routeName, data));
	// socket.on('zaidimai', (routeName, data) => games.route(socket, routeName, data));
	// socket.on('kurejai', (routeName, data) => developers.route(socket, routeName, data));
	// socket.on('leidejai', (routeName, data) => publishers.route(socket, routeName, data));
	// socket.on('nuotraukos', (routeName, data) => images.route(socket, routeName, data));
	// socket.on('atsiliepimai', (routeName, data) => reviews.route(socket, routeName, data));
	// socket.on('duk', (routeName, data) => faq.route(socket, routeName, data));
});

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
		if (error.code === 'PROTOCOL_CONNECTION_LOST')
			console.error('Database connection was closed.')
		if (error.code === 'ER_CON_COUNT_ERROR')
			console.error('Database has too many connections.')
		if (error.code === 'ECONNREFUSED')
			console.error('Database connection was refused.')
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

				console.log(`SQL -> ${q.sql}`);

				q.on('end', function () {
                    connection.release();
                });
			}
		});
	});
}

exports.query = query;