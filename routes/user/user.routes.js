const express = require('express')
const route = express.Router();
const auth = require('../../middleware/auth')
const { body } = require('express-validator');

const validate = [
  body('name', 'name between 3 to 20 characters').isLength({ min: 3, max: 20 }),
  body('email', 'enter a valid email').isEmail(),
  body('password', 'password between 5 to 30 characters').isLength({ min: 5, max: 30 })]
const controller = require('../../controllers/user/user.controller')

// available routes
// 1.Register user
route.post('/register', validate, controller.register_user)
// 2.Login user
route.post('/login', controller.user_login)
// 3.update user
route.put('/update-profile', auth.verifytoken, controller.update_profile)
// 4.Forget password api
route.post('/forgetpassword', controller.forget_password)
// 5.reset password api
route.post('/resetpassword', controller.reset_password)
// 6.send verification mail
route.post('/sendmail', controller.sendVerificationMail)
// 7.verify user
route.get('/verify/:id', controller.verifyUser)
// 8.get_profile
route.get('/getprofile', auth.verifytoken, controller.get_profile)
//9. update password
route.put('/updatepassword', auth.verifytoken, controller.update_password)
module.exports = route;
