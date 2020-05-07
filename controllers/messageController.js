const debug = require('debug')('members-only:messageController');
const Message = require('../models/message');
const Joi = require('@hapi/joi');

const messageValidationSchema = Joi.object({
  title: Joi.string().trim().alphanum().min(2).max(128).required().messages({
    'string.min': 'length must be at least 2 characters long',
    'string.max': 'length must be less than or equal to 128 characters long',
    'string.alphanum': 'must only contain alpha-numeric characters',
    'string.empty': 'field is required'
  }),
  text: Joi.string().trim().min(2).max(255).required().messages({
    'string.min': 'length must be at least 2 characters long',
    'string.max': 'length must be less than or equal to 255 characters long',
    'string.empty': 'field is required'
  })
});

exports.getMessageForm = (req, res) => {
  if (!req.user) {
    res.redirect('/user/log-in');
  }

  res.render('message-form', { title: 'New Message', errors: {} });
};

exports.postMessageForm = async (req, res, next) => {
  if (!req.user) {
    res.redirect('/user/log-in');
  }

  try {
    const { value, error } = await messageValidationSchema.validate(req.body, {
      abortEarly: false
    });

    if (error) {
      const errors = {};

      error.details.forEach(
        (err) =>
          (errors[err.context.label] = {
            message: err.message
          })
      );

      res.render('message-form', { title: 'New Message', errors });
    } else {
      const message = new Message({ ...value, user: req.user._id });

      await message.save();

      res.redirect('/');
    }
  } catch (err) {
    debug(err);
    next();
  }
};
