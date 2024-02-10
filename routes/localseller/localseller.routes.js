const express = require('express')
const route = express.Router();
const auth = require('../../middleware/auth')
const Controller = require('../../controllers/localseller/localseller.controller')
//available routes

// 1.Assign seller
route.post('/assign_local_seller', auth.verifytoken, auth.isAdmin, Controller.assign_local_seller)
// 2.Seller Login
route.post('/login', Controller.local_seller_login)
module.exports = route;
