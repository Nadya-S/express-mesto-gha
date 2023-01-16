const Card = require('../models/card');
const { NotFoundError, BadRequestError, ForbiddenError } = require('../errors/Errors');

// GET /cards
module.exports.findAllCards = (req, res, next) => {
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
      next(err);
    });
};

// POST /cards
module.exports.createCard = (req, res, next) => {
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
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

// DELETE /cards/:_id
module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params._id)
    .orFail(new Error('NotValidId'))
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then(() => res.send({ message: 'Карточка удалена' }));
      } else {
        next(new ForbiddenError('Невозможно удалить чужую карточку'));
      }
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
        return;
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

// PUT /cards/:_id/likes
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then(() => {
      res.send({ message: 'Лайк' });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Передан несуществующий _id карточки'));
        return;
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

// DELETE /cards/:_id/likes
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then(() => {
      res.send({ message: 'Дизлайк' });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Передан несуществующий _id карточки'));
        return;
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};
