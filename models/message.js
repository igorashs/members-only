const mongoose = require('mongoose');
const moment = require('moment');

const messageSchema = new mongoose.Schema({
  title: { type: String, required: true, max: 128 },
  text: { type: String, required: true, max: 255 },
  timestamp: { type: Date, required: true, default: new Date() },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

messageSchema.virtual('timestampFormatted').get(function () {
  return moment(this.timestamp).format('Do MMM YYYY, LT');
});

module.exports = mongoose.model('Message', messageSchema);
