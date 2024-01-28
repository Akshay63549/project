const express = require('express')
const route = express.Router();
const auth = require('../../middleware/auth')
const Controller = require('../../controllers/reseller/reseller.controller')
//available routes

// 1.Assign reseller
route.post('/assign_reseller', auth.verifytoken, auth.isAdmin, Controller.assign_reseller)
// 2.Reseller Login
route.post('/login', Controller.reseller_login)
module.exports = route;
