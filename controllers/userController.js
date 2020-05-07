const debug = require('debug')('members-only:userController');
const User = require('../models/user');
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const nameMessages = {
  'string.min': 'length must be at least 2 characters long',
  'string.max': 'length must be less than or equal to 100 characters long',
  'string.alphanum': 'must only contain alpha-numeric characters',
  'string.empty': 'field is required'
};

const userValidationSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .alphanum()
    .min(2)
    .max(100)
    .required()
    .messages(nameMessages),
  lastName: Joi.string()
    .trim()
    .alphanum()
    .min(2)
    .max(100)
    .required()
    .messages(nameMessages),
  username: Joi.string()
    .trim()
    .alphanum()
    .min(2)
    .max(100)
    .required()
    .messages(nameMessages),
  password: Joi.string()
    .required()
    .ruleset.pattern(/^[a-zA-Z0-9\_\.]{3,30}$/)
    .message(
      'allowed values are alpha-numeric characters, . and _, min 3 to 30 length'
    ),
  repeatPassword: Joi.string()
    .required()
    .valid(Joi.ref('password'))
    .messages({ 'any.only': "passwords don't match" })
});

exports.getUserCreate = (req, res) => {
  if (res.locals.currentUser) {
    res.redirect('/');
  } else {
    res.render('sign-up-form', { title: 'Create a new user', errors: {} });
  }
};

exports.postUserCreate = async (req, res, next) => {
  try {
    const { value, error } = await userValidationSchema.validate(req.body, {
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

      res.render('sign-up-form', {
        title: 'Create a new user',
        user: value,
        errors
      });
    } else {
      try {
        const checkUser = await User.findOne(
          { username: value.username },
          'username'
        );

        if (checkUser) {
          res.render('sign-up-form', {
            title: 'Create a new user',
            user: value,
            errors: {
              username: { message: 'user with this username already exists' }
            }
          });
        } else {
          const hashedPass = await bcrypt.hash(value.password, 10);
          const user = new User({ ...value, password: hashedPass });

          await user.save();

          res.redirect(`/user/log-in?newUserName=${user.firstName}`);
        }
      } catch (err) {
        debug(err);
        next();
      }
    }
  } catch (err) {
    debug(err);
    next();
  }
};

module.exports.getUserLogin = (req, res) => {
  if (res.locals.currentUser) {
    res.redirect('/');
  } else {
    const newUserName = req.query.newUserName ? req.query.newUserName : null;
    res.render('log-in-form', { title: 'Log In', errors: {}, newUserName });
  }
};

module.exports.postUserLogin = (req, res, next) => {
  passport.authenticate('local', {
    failureRedirect: '/user/log-in',
    successRedirect: '/'
  })(req, res, next);
};

module.exports.getLogout = (req, res, next) => {
  req.logout();
  res.redirect('/');
};
