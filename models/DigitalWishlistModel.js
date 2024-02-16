const mongoose = require('mongoose');
const sellerSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
})
module.exports = mongoose.model('DigitalWishlist', sellerSchema)
