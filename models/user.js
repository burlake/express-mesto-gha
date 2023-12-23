const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: {
      value: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
      message: 'Поле является обязательным'
    },
    minlength: [2, 'Минимальная длинна 2 символа'], // минимальная длина имени — 2 символа
    maxlength: [30, 'Максимальная длинна 30 символ'] // а максимальная — 30 символов
  },
  about: { // у пользователя есть occupation — опишем требования в схеме:
    type: String,
    required: {
      value: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
      message: 'Поле является обязательным'
    },
    minlength: [2, 'Минимальная длинна 2 символа'], // минимальная длина имени — 2 символа
    maxlength: [30, 'Максимальная длинна 30 символ'] // а максимальная — 30 символов
  },
  avatar: { // у пользователя есть avatar — опишем требования в схеме:
    type: String,
    required: true, // оно должно быть у каждого пользователя — обязательное поле
    validate: {
      validator(v) {
        return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(v);
      },
      message: 'Введите URL',
    },
  },
}, { versionKey: false, timestamps: true});

module.exports = mongoose.model('user', userSchema);
