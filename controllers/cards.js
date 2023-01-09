const Card = require('../models/card');
const {
  NOT_FOUND_ERROR,
  BAD_REQUEST_ERROR,
  INTERNAL_SERVER_ERROR,
} = require('../errors/Errors');

// GET /cards
module.exports.findAllCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      const newCards = [];
      cards.forEach((card) => {
        const cardData = {
          name: card.name,
          link: card.link,
          owner: card.owner,
          likes: card.likes,
          createdAt: card.createdAt,
        };
        newCards.push(cardData);
      });
      res.send(newCards);
    })
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: `На сервере произошла ошибка: ${err.name}` });
    });
};

// POST /cards
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      const cardData = {
        name: card.name,
        link: card.link,
        _id: card._id,
      };
      res.send(cardData);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: `На сервере произошла ошибка: ${err.name}` });
    });
};

// DELETE /cards/:cardId
module.exports.deleteCardById = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(new Error('NotValidId'))
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then(() => res.send({ message: 'Карточка удалена' }));
      }
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: `На сервере произошла ошибка: ${err.name}` });
    });
};

// PUT /cards/:cardId/likes
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then(() => {
      res.send({ message: 'Лайк' });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(NOT_FOUND_ERROR).send({ message: 'Передан несуществующий _id карточки. ' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: `На сервере произошла ошибка: ${err.name}` });
    });
};

// DELETE /cards/:cardId/likes
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then(() => {
      res.send({ message: 'Дизлайк' });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(NOT_FOUND_ERROR).send({ message: 'Передан несуществующий _id карточки. ' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: `На сервере произошла ошибка: ${err.name}` });
    });
};
