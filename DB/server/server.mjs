import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import pg from 'pg';
import * as users from './routes/users.mjs';
import * as faq from './routes/faq.mjs';
import * as developers from './routes/developers.mjs';
import * as payments from './routes/payments.mjs';
import * as groups from './routes/groups.mjs';
import * as reviews from './routes/reviews.mjs';
import * as images from './routes/images.mjs';
import * as games from './routes/games.mjs';
import * as orders from './routes/orders.mjs';

const app = express();
const server = new http.Server(app);
const io = socketIO(server);

server.listen(80);

io.on('connection', (socket) => {
	console.log(`${socket.id} connected`);
	socket.on('vartotojai', (routeName, data, cb) => users.route(routeName, data, cb));
	socket.on('duk', (routeName, data, cb) => faq.route(routeName, data, cb));
	socket.on('kurejai', (routeName, data, cb) => developers.route(routeName, data, cb));
	socket.on('mokejimai', (routeName, data, cb) => payments.route(routeName, data, cb));
	socket.on('grupes', (routeName, data, cb) => groups.route(routeName, data, cb));
	socket.on('atsiliepimai', (routeName, data, cb) => reviews.route(routeName, data, cb));
	socket.on('nuotraukos', (routeName, data, cb) => images.route(routeName, data, cb));
	socket.on('zaidimai', (routeName, data, cb) => games.route(routeName, data, cb));
	socket.on('uzsakymai', (routeName, data, cb) => orders.route(routeName, data, cb));
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