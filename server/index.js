const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const pg = require('pg');

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

// PostgreSQL

module.exports = new pg.Pool({
	user: 'postgres',
	password: 'root',
	host: 'localhost',
	database: 'games',
	port: 5432
});