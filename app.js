const express = require('express');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const authRouter = require('./routes/auth');
const auth = require('./middlewares/auth');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { NotFoundError } = require('./errors/Errors');
const err = require('./middlewares/err');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();

app.use(helmet());
app.use(limiter);

app.use(express.json());
app.use('/', authRouter);

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);
app.use('*', () => {
  throw new NotFoundError('Путь не найден');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

app.use(errors());
app.use(err);

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
