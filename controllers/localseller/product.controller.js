const LocalProduct = require('../../models/localProductModel')
const bcryptjs = require('bcryptjs')
const config = require('../../config/config')
const jwt = require('jsonwebtoken')
const { For_FindOne, For_Create, For_FindByIdAndUpdate, For_FindOneAndUpdate, For_FindById} = require('../../utils/mongooseUtils')



exports.Add_Product=async(req,res)=>{
try {
    const seller = req.user._id
    const product = await For_Create(LocalProduct,{...req.body,seller})
    res.status(200).send({message:"Add Product Successfully",data:product,success:true })
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}
}