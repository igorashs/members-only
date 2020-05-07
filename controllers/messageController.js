const Message = require('../models/message');

exports.getMessageForm = (req, res) => {
  if (!req.user) {
    res.redirect('/user/log-in');
  }

  res.render('message-form', { title: 'New Message', errors: {} });
};
