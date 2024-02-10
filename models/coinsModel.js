const mongoose = require('mongoose');
const coinsSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  },
isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
})
module.exports = mongoose.model('Coins', coinsSchema)