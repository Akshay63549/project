const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone:{
    type:Number
  },
  referralCode:{
    type: String,
    unique: true,
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  otp: {
    type: Number,
  }
}, {
  timestamps: true,
})

module.exports = mongoose.model('User', userSchema)
