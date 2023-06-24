const express = require('express')
const fs = require('fs')
const router = express.Router()
const userController = require('../controllers/userController')
const authController = require('./../controllers/authController')

router.param('id', userController.checkId)

router.post('/signup',authController.signup)
router.post('/login',authController.login)

// router.post('/forgotPassword',authController.forgotPassword)
// router.post('/resetPassword',authController.resetPassword)

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.addUser)

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

module.exports = router