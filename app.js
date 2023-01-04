const express = require('express');
// const path = require('path');
const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '63ad8d5c4396a02df9dca115', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(express.json());
app.use('/', userRouter);
app.use('/', cardRouter);
// app.use('*', () => {
//   throw new NotFound('несуществующий путь')
// });

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
  console.log('hhh');
});
// app.use(express.static(path.join(__dirname, 'public')));
// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false
});
