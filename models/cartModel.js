const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  },
  products: [{
    _id: false, // Disable _id field for subdocuments
    product: {
      type: String
    },
    quantity: {
      type: Number
    }
  }],
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Cart', cartSchema);

 // type: mongoose.Schema.Types.ObjectId,
        // ref: 'SellerProduct',