const LocalSeller =require('../../models/localSellerModel')
const User =require('../../models/userModel')
var ObjectId = require('mongoose').Types.ObjectId; 
const bcryptjs = require('bcryptjs')
const config = require('../../config/config')
const jwt = require('jsonwebtoken')
const { For_FindById, For_FindOne,For_Create} = require('../../utils/mongooseUtils');

//functions
//create auth-token
const createToken = async (id) => {
  try {
    const token = await jwt.sign({ _id: id }, config.JWT_SECRET)
    return token;
  } catch (error) {
    res.status(400).send('please enter valid token')
  }
}

//add local_seller
exports.assign_local_seller=async(req,res)=>{
    try {
      const checkuser = await For_FindById(User,{_id:req.body.user },{},{ select: '_id' })
    if (checkuser) {
      let checklocalseller = await For_FindOne(LocalSeller,{user:new ObjectId(req.body.user)})
       if (checklocalseller) {
        return res.status(200).json({ error: "This user are already assign by admin" })  
       } 
       else {
         // assign new localseller 
 const localseller = await For_Create(LocalSeller,{ user:req.body.user})
     res.json({ localseller })
       }
    }         
    else{
        return res.status(400).json({ error: "Sorry user not exists" })
    }
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error");
    }
}

//local_seller login
exports.local_seller_login = async (req, res) => {
    try {
      const email = req.body.email
      const password = req.body.password
      let checklocalseller = await For_FindOne(LocalSeller, {}, { populate: { path: "user", select: "email" } });
      let userData = await For_FindOne(User, { email: email });
      if (userData && checklocalseller?.user?.email === email) {
        const passwordmatch = await bcryptjs.compare(password, userData.password)
        if (passwordmatch) {
          if (userData.isPublished) {
            const tokenData = await createToken(userData._id)
            const userResult = {
              token: tokenData,
              id: userData._id,
              name: userData.name,
              email: userData.email
            }
            const response = {
              success: true,
              message: 'localSeller Details',
              data: userResult
            }
            res.status(200).send(response)
          } else {
            res.status(500).send({ success: false, message: 'You have not verified your email, please go to your email to verify using the link.' })
          }
        } else {
          res.status(500).send({ success: false, message: 'login details are incorrect' })
        }
      } else {
        res.status(500).send({ success: false, message: 'login details are incorrect' })
      }
    } catch (error) {
      res.status(500).send(error.message)
    }
  }