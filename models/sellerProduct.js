const mongoose = require('mongoose');
const sellerProductSchema = mongoose.Schema({
seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
},
title:{
    type:String,
    reqired:true
},
packsize:{
    type:String,
    reqired:true
},
bulletpoints:{
    type:String,
    reqired:true
},
images:{
    type:String,
    required:true
},
price:{
    type:String,
    required:true
},
discount:{
    type:Number,
    required:true
},
stock:{
    type:Number,
    required:true
},
saleDays:{
    type:String,
    required:true
},
verified:{
    type:Boolean,
    default:false
},
isDeleted: {
    type: Boolean,
    default: false
}
}, {
timestamps: true,
})
module.exports = mongoose.model('SellerProduct', sellerProductSchema)
