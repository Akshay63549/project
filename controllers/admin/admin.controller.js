const Admin =require('../../models/adminModel')
const User =require('../../models/userModel')
var ObjectId = require('mongoose').Types.ObjectId; 
const bcryptjs = require('bcryptjs')
const config = require('../../config/config')
const jwt = require('jsonwebtoken');
const { For_Find } = require('../../utils/mongooseUtils');
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


//assign admin
exports.assign_admin=async(req,res)=>{
    try {
        let checkuser=await User.findById({_id:req.body.user })
    if (checkuser) {
       let checkAdmin=await Admin.findOne({user:new ObjectId(req.body.user)})
       if (checkAdmin) {
        return res.status(200).json({ error: "This user are already assign by admin" })  
       } 
       else {
         // assign new admin 
         let admin = await Admin.create({
            user:req.body.user
            });
     res.json({ admin })
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


//admin login
exports.admin_login = async (req, res) => {
    try {
      const email = req.body.email
      const password = req.body.password
      const checkadmin = await Admin.findOne().populate('user', 'email');
      const userData = await User.findOne({ email: email })
      if (userData && checkadmin?.user?.email === email) {
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
              message: 'Admin Details',
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

//get all profile
exports.get_all_profile = async (req, res) => {
  try {
    const userData = await For_Find(User,{},{select:'name email'})
    res.status(200).send({ success: true, msg: 'all user details', data: userData })
  } catch (error) {
    res.status(500).send({ success: false, msg: error.message })
  }
}