const mongoose = require('mongoose');
const sellerSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  suspended:  {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
})
module.exports = mongoose.model('Seller', sellerSchema)
