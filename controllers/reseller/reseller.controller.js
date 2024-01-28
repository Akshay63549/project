const Reseller =require('../../models/resellerModel')
const User =require('../../models/userModel')
var ObjectId = require('mongoose').Types.ObjectId; 
const bcryptjs = require('bcryptjs')
const config = require('../../config/config')
const jwt = require('jsonwebtoken')
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

//add reseller
exports.assign_reseller=async(req,res)=>{
    try {
        let checkuser=await User.findById({_id:req.body.user })
    if (checkuser) {
       let checkReseller=await Reseller.findOne({user:new ObjectId(req.body.user)})
       if (checkReseller) {
        return res.status(200).json({ error: "This user are already assign by admin" })  
       } 
       else {
         // assign new reseller 
         let reseller = await Reseller.create({
            user:req.body.user
            });
     res.json({ reseller })
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

//reseller login
exports.reseller_login = async (req, res) => {
    try {
      const email = req.body.email
      const password = req.body.password
      const checkreseller = await Reseller.findOne().populate('user', 'email');
      const userData = await User.findOne({ email: email })
      if (userData && checkreseller?.user?.email === email) {
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
              message: 'reseller Details',
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