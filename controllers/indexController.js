const Message = require('../models/message');
const User = require('../models/user');
const debug = require('debug')('members-only:indexController');

// GET all messages and render home page
exports.getIndex = async (req, res, next) => {
  try {
    const messages = await Message.find().populate('user');

    if (req.user) {
      req.app.locals.currentUser = req.user;
    }

    res.render('index', { title: 'Message Board', messages });
  } catch (err) {
    debug(err);
    next();
  }
};
