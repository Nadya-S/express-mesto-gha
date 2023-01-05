const express = require('express');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { NOT_FOUND_ERROR } = require('./errors/Errors');

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '63ad8d5c4396a02df9dca115',
  };

  next();
});

app.use(express.json());
app.use('/', userRouter);
app.use('/', cardRouter);
app.use('*', (req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: 'Путь не найден.' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
