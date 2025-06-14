const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const authToken = require('../middlewares/authToken')

router.post('/api/signUp', userController.userSignUp)
router.post('/api/login', userController.userLogin)
router.get('/api/user-details', authToken, userController.userDetails)
router.get('/api/logout', userController.userLogout)

// Subscription route
router.post('/api/susbscribe', userController.userSubscribe)

router.put('/api/update-profile/:userId', userController.updateUser);

module.exports = router 