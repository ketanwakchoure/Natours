const express = require('express')
const router = express.Router()
const tourController = require('../controllers/tourController')
const authController = require('../controllers/authController')

router
  .route('/monthly-plan/:year')
  .get(tourController.getMonthlyPlan)

router
  .route('/tour-stat')
  .get(tourController.getTourStats)

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.addTour)

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(authController.protect, authController.restrict('admin', 'lead-guide'), tourController.deleteTour)

  module.exports = router