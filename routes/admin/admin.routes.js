const express = require('express')
const route = express.Router();
const auth = require('../../middleware/auth')
const Controller = require('../../controllers/admin/admin.controller')
//available routes


route.post('/assign_admin', auth.verifytoken, auth.isAdmin, Controller.assign_admin)
route.post('/login', Controller.admin_login)
route.get('/get-all-profile', auth.verifytoken, auth.isAdmin, Controller.get_all_profile)
module.exports = route;
