const mongoose = require('mongoose');
const tsSchema = mongoose.Schema({
image:{
    type:String,
    required:true,
},
name:{
    type:String,
    required:true,
}
}, {
timestamps: true,
})
module.exports = mongoose.model('Ts', tsSchema)