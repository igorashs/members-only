const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, max: 100 },
  lastName: { type: String, required: true, max: 100 },
  username: { type: String, required: true, max: 100 },
  password: { type: String, required: true, max: 255 },
  membership: {
    type: String,
    required: true,
    enum: ['default', 'member'],
    default: 'default'
  },
  isAdmin: { type: Boolean, default: false }
});

userSchema.virtual('fullname').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('isMember').get(function () {
  return this.membership === 'member';
});

module.exports = mongoose.model('User', userSchema);
