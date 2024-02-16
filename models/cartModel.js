const mongoose = require('mongoose');
const cartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  },
  products:{
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SellerProduct',
    },
    quantity:{type:Number}
  },
isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
})
module.exports = mongoose.model('Cart', cartSchema)