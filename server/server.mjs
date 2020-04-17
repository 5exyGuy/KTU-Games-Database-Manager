import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import pg from 'pg';
import * as users from './routes/users.mjs';
import * as orders from './routes/orders.mjs';
// import * as carts from './routes/carts.mjs';
// import * as payments from './routes/payments.mjs';
// import * as transfers from './routes/transfers.mjs';
// import * as games from './routes/games.mjs';
// import * as developers from './routes/developers.mjs';
// import * as publishers from './routes/publishers.mjs';
// import * as images from './routes/images.mjs';
// import * as reviews from './routes/reviews.mjs';
// import * as faq from './routes/faq.mjs';

const app = express();
const server = new http.Server(app);
const io = socketIO(server);

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
const pool = new pg.Pool({
	user: 'postgres',
	password: 'root',
	host: 'localhost',
	database: 'games',
	port: 5432
});

export { pool };