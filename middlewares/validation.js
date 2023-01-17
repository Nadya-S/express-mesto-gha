const { celebrate, Joi } = require('celebrate');

// eslint-disable-next-line no-useless-escape
module.exports.regExeLink = /^(http|https)\:\/\/(www\.)?[a-z0-9\-]*\.[a-z]*[a-zA-Z0-9\-\/]*[a-z0-9\.*\/\-\_\~\:\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]*\#?$/;

module.exports.idValidator = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
});

module.exports.loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.createUserValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(this.regExeLink),
  }),
});

module.exports.updateProfileValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

module.exports.updateAvatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(this.regExeLink),
  }),
});

module.exports.createCardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(this.regExeLink),
  }),
});
