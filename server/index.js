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
// app.use('/cart', cart);

app.listen(4000);

// MySQL

const pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : 'root',
    database        : 'games'
});

module.exports = pool;