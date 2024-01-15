const httpConstants = require('http2').constants;
const mongoose = require('mongoose');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/badRequestError');
const User = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(httpConstants.HTTP_STATUS_OK).send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(user); // работает - выдает карточку
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`Некорректный _id: ${req.params.userId}`)); // работает
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next (new NotFoundError (`Пользователь по указанному _id: ${req.params.userId} не найден`));// меняю цифру 1 цифру (24 символа)
      } else {
        next(err);
      }
    });
};

// orFail должен возвращать 404, то есть notFound,
// CastError должен обрабатываться в catch и возвращать 400.
// В случае если ошибка непредвиденная, надо возвращать 500

module.exports.addUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
  .then((user) => {
    res.status(httpConstants.HTTP_STATUS_CREATED).send(user);
  })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.editUserData = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidators: true })
    .orFail()
    .then((user) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next (new NotFoundError ('Произошла ошибка. Пользователь с id не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.editUserAvatar = (req, res, next) => {
    User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: 'true', runValidators: true })
      .orFail()
      .then((user) => res.status(httpConstants.HTTP_STATUS_OK).send(user))
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          next(new BadRequestError(err.message));
        } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
          next (new NotFoundError ('Произошла ошибка. Пользователь с id не найден'));
        } else {
          next(err);
        }
      });
};