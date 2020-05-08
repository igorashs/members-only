const debug = require('debug')('members-only:adminController');
const User = require('../models/user');
const env = require('../.env.config');
const Joi = require('@hapi/joi');

const adminSecretValidationSchema = Joi.object({
  adminSecret: Joi.string().trim().required().equal(env.ADMIN_CODE)
});

exports.postAdminJoin = async (req, res, next) => {
  if (!req.user) {
    res.redirect('/user/log-in');
  }

  try {
    const { error } = await adminSecretValidationSchema.validate(req.body);

    if (error) {
      res.render('profile', { title: 'My Profile', isWrongCode: true });
      debug(error);
    } else {
      await User.findByIdAndUpdate(req.user._id, {
        isAdmin: true
      });

      req.app.locals.currentUser.isAdmin = true;
      res.redirect('/user/profile');
    }
  } catch (err) {
    debug(err);
    next();
  }
};
