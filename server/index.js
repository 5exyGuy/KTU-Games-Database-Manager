import express from 'express';
import bodyParser from  'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import users from './routes/users.js';
import orders from './routes/orders.js';

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