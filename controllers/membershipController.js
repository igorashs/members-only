const debug = require('debug')('members-only:membershipController');
const env = require('../.env.config');
const Joi = require('@hapi/joi');
const User = require('../models/user');

const clubSecretValidationSchema = Joi.object({
  clubSecret: Joi.string().trim().required().equal(env.MEMBER_CODE)
});

exports.getJoinMembership = (req, res) => {
  if (!req.user) {
    res.redirect('/user/log-in');
  }

  res.render('join-membership-form', { title: 'Join the club!' });
};

exports.postJoinMembership = async (req, res, next) => {
  if (!req.user) {
    res.redirect('/user/log-in');
  }

  try {
    const { value, error } = await clubSecretValidationSchema.validate(
      req.body
    );

    if (error) {
      res.render('join-membership-form', {
        title: 'Join the club!',
        isWrongCode: true
      });
      debug(error);
    } else {
      await User.findByIdAndUpdate(req.user._id, { membership: 'member' });

      res.redirect('/');
    }
  } catch (err) {
    debug(err);
    next();
  }
};
