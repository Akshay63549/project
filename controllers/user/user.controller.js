const User = require('../../models/userModel')
const bcryptjs = require('bcryptjs')
const config = require('../../config/config')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer')
const { For_FindOne, For_Create, For_FindByIdAndUpdate, For_FindOneAndUpdate, For_FindById} = require('../../utils/mongooseUtils')

//........................................functions............................................................
//bcrypt password
const securePassword = async (password) => {
  try {

    const passwordHash = await bcryptjs.hash(password, 10)
    return passwordHash;

  } catch (error) {
    res.status(400).send(error.message)

  }
}

//create auth-token
const createToken = async (id) => {
  try {
    const token = await jwt.sign({ _id: id }, config.JWT_SECRET)
    return token;
  } catch (error) {
    res.status(400).send('please enter valid token')
  }
}

//resend password mail
const sendmail = async (name, email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: config.NODEMAILER_HOST,
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: config.NODEMAILER_AUTH_USERNAME,
        pass: config.NODEMAILER_AUTH_PASSWORD // naturally, replace both with your real credentials or an application-specific password
      }
    });
    var mailOptions = {
      from: config.NODEMAILER_AUTH_USERNAME,
      to: email,
      subject: 'For Reset password',
      html: `<p>Hi ${name}, Your Otp is</p>${otp}`
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return err;
      } else {
        return info
      }
    });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message })
  }

}

//verify mail
const verifyMail = async (userName, userEmail, userId) => {
  try {
    const transporter = nodemailer.createTransport({
      host: config.NODEMAILER_HOST,
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: config.NODEMAILER_AUTH_USERNAME,
        pass: config.NODEMAILER_AUTH_PASSWORD // naturally, replace both with your real credentials or an application-specific password
      }
    });
    var mailOptions = {
      from: config.NODEMAILER_AUTH_USERNAME,
      to: userEmail,
      subject: 'Verify Mail',
      html: 'hello ' + userName + ' <p><a href="' + process.env.BASEURL + '/api/user/verify/' + userId + '">click here </a>to verify yor mail</p>'
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return err;
      } else {
        retur
      }
    });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message })
  }

}

// Function to generate a random numeric OTP of given length
function generateNumericOTP(length) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    otp += digits[randomIndex];
  }
  return otp;
}

const generateUniqueReferralCode=async(length)=> {
  let isUnique = false;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let referralCode = '';
  while (!isUnique) {
      referralCode = ''; // Reset referralCode on each iteration
      for (let i = 0; i < length; i++) {
          referralCode += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      // Check if the referral code already exists in the database
      const existingUser = await For_FindOne(User,{ referralCode: referralCode })
      if (!existingUser) {
          isUnique = true; // Set the flag to true if the code is unique
      }
  }

  return referralCode;
}

//-----------------------------------------------------------------------------------------------------------------------------------------------
//Register User
exports.register_user = async (req, res) => {
  // // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors?.errors[0]?.msg });
    // return res.status(400).json({ errors: errors.array() });
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    const secPass = await bcryptjs.hash(req.body.password, salt);
    let checkUser = await For_FindOne(User,{ email: req.body.email })
    if (checkUser) {
      return res.status(400).send({ error: 'Email Already Exists' });
    }
const referralCode =await generateUniqueReferralCode(8);
    // Create a new user
    const data = {
      name: req.body.name,
      email: req.body.email,
      password: secPass,
      referralCode
    }
 const user = await For_Create(User,data)
    res.json({ user })
    verifyMail(user.name, user.email, user._id)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}

//Verify User
exports.verifyUser = async (req, res) => {
  try {
    const id = req.params.id
    const result = await For_FindByIdAndUpdate(User,id,{ isPublished: true })
    const message = "email verified successfully"
    res.redirect(process.env.FRONTENDURL + '/sign-in?message=' + message + '');
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error")
  }

}

//Send Verification Mail
exports.sendVerificationMail = async (req, res) => {
  try {
    const email = req.body.email
    const user = await For_FindOne(User,{ email: email })
    if (user) {
      verifyMail(user.name, user.email, user._id)
      res.status(200).send({ success: true, message: 'send verification mail successfully' })
    }
    else {
      res.status(500).send({ success: false, message: 'User Not Exist' })
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}

//Login Method
exports.user_login = async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password
    const userData =await For_FindOne(User,{ email: email })
    if(!userData){
    return  res.status(500).send({ success: false, message: 'login details are incorrect' })
    }
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
            message: 'user Details',
            data: userResult
          }
          res.status(200).send(response)
        } else {
      return   res.status(500).send({ success: false, message: 'You have not verified your email, please go to your email to verify using the link.' })
        }
      } else {
     return  res.status(500).send({ success: false, message: 'login details are incorrect' })
      }

  } catch (error) {
    res.status(500).send(error.message)
  }
}

//Update password
exports.update_profile = async (req, res) => {
  try {
    const user_id = req.user._id
    const { name,phone } = req.body
    const userData = await For_FindByIdAndUpdate(User,user_id,{name:name,phone:phone})
    res.status(200).send({ success: true, message: 'Your profile has been updated' })
  } catch (error) {
    res.status(500).send({success: false, message: 'Your profile has not updated'} )
  }
}

//Forget password
exports.forget_password = async (req, res) => {
  try {
    const email = req.body.email
    const userData = await For_FindOne(User,{ email: email })
    if (userData) {
      // Generate a 4-digit OTP.
      const otp = generateNumericOTP(4);
      await For_FindOneAndUpdate(User,email,otp)
      sendmail(userData.name, userData.email, otp)
      res.status(200).send({ success: true, message: 'Please check your Inbox of mail and Reset your password' })
    } else {
      res.status(500).send({ success: false, message: 'this email does not exist' })
    }

  } catch (error) {
    res.status(500).send({ success: false, msg: error.message })

  }
}

//Reset password
exports.reset_password = async (req, res) => {
  try {
    const otp = req.body.otp
    const email = req.body.email
    const OtpData = await For_FindOne(User,{email,otp})
    if (OtpData) {
      const password = req.body.password;
      const newPassword = await securePassword(password)
      const userData = await For_FindByIdAndUpdate(User,OtpData._id,{ password: newPassword, otp: '' })
      res.status(200).send({ success: true, msg: 'User Password Has been  Reset Successfully', data: userData })
    } else {
      res.status(500).send({ success: false, msg: 'Please enter Valid OTP' })
    }

  } catch (error) {
    res.status(500).send({ success: false, msg: error.message })

  }
}

//get profile
exports.get_profile = async (req, res) => {
  try {
    const id = req.user._id
    const userData = await For_FindById(User,id,{},{ select: 'name email phone' })
    res.status(200).send({ success: true, msg: 'user details', data: userData })
  } catch (error) {
    res.status(500).send({ success: false, msg: error.message })
  }
}

//update password
exports.update_password = async (req, res) => {
  try {
    const user_id = req.user._id
    const { oldpassword, password } = req.body
    const userData = await For_FindById(User,user_id)
    if (userData) {
      const passwordmatch = await bcryptjs.compare(oldpassword, userData.password)
      if (passwordmatch) {
        const newPassword = await securePassword(password)
        const userData1 = await For_FindByIdAndUpdate(User,user_id,{password: newPassword})
        res.status(200).send({ success: true, message: 'Your password has been updated' })
      } else {
        res.status(500).send({ success: false, message: 'old password not match' })
      }
    } else {
      res.status(500).send({ success: false, message: 'user not found' })
    }
  } catch (error) {
    res.status(500).send({ success: false, message: error.message })
  }
}





