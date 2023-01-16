const User = require('../models/user');
const { NotFoundError, BadRequestError } = require('../errors/Errors');

// GET /users
module.exports.findAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      const newUsers = [];
      users.forEach((user) => {
        const userData = {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
        };
        newUsers.push(userData);
      });
      res.send(newUsers);
    })
    .catch((err) => {
      next(err);
    });
};

// GET /users/me
module.exports.findMyProfile = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      const userData = {
        name: user.name,
        about: user.about,
        email: user.email,
        avatar: user.avatar,
        _id: user._id,
      };
      res.send(userData);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
        return;
      }
      next(err);
    });
};

// GET /users/:_id
module.exports.findByIdUser = (req, res, next) => {
  User.findById(req.params._id)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      const userData = {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      };
      res.send(userData);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
        return;
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

// PATCH /users/me
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => {
      const userData = {
        name: user.name,
        about: user.about,
      };

      res.send(userData);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

// PATH /users/me/avatar
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => {
      const userData = {
        avatar: user.avatar,
      };

      res.send(userData);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};
