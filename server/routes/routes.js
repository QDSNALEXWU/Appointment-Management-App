const express = require('express')
const router = express.Router()
const checkToken = require('../middleware/checkToken.js')
var controller = require('../controller/controllers.js');


// user routes
router.post('/register', controller.Register)

router.post('/login', controller.Login)

router.get('/user', checkToken, controller.User)

router.post('/delUser', checkToken, controller.delUser)

//router.post('/updateUser', checkToken, controller.Update)

// professional routes
router.post('/professional', controller.addProfessional)

//router.post('/delPro', controller.delProfessional)

router.get('/professional', controller.getProfessionals)

// appointments routes
router.post('/appointments', controller.addAppointment)

router.post('/delApps', controller.delAppointment)

router.get('/appointments', controller.getAppointments)



module.exports = router
