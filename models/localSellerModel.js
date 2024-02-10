const mongoose = require('mongoose');
const localSellerSchema = mongoose.Schema({
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
module.exports = mongoose.model('LocalSeller', localSellerSchema)
