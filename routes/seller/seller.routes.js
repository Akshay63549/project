const express = require('express')
const route = express.Router();
const auth = require('../../middleware/auth')
const Controller = require('../../controllers/seller/seller.controller')
//available routes

// 1.Assign seller
route.post('/assign_seller', auth.verifytoken, auth.isAdmin, Controller.assign_seller)
// 2.Seller Login
route.post('/login', Controller.seller_login)
module.exports = route;
