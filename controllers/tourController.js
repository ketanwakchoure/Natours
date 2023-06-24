const fs = require('fs')
const APIErrors = require('../util/APIErrors')
const Tour = require('./../models/tour')
const APIFeatures = require('./../util/APIFeature')
const catchAsync = require('./../util/catchAsync')

exports.checkBody = (req, res, next) => {
  if(!req.body || !req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "Failed",
      message: "Request body not in correct format."
    })
  }
  next()
}

exports.getAllTours = catchAsync (async (req, res, next) => {
  const feature = new APIFeatures(Tour.find(),req.query)
    feature
      .filter()
      .limitFields()
      .sort()
      .paginate()

  const tours = await feature.query

  console.log(tours)

  res.status(200).json({
    status: 'Success!!',
    tours: tours
  })
})

exports.getTour = catchAsync( async (req, res, next) => {
  const id = req.params.id
  const tour = await Tour.findOne({_id: id})
  if(!tour) {
    return next(new APIErrors('Tour not found', 404))
  }
  console.log(tour)
  res.status(200).json({
    status: 'Success!!',
    tours: tour
  })
})

exports.updateTour = catchAsync( async (req, res, next) => {
  const id = req.params.id
  const tour = await Tour.findOneAndUpdate({_id: id},req.body,{new: true, runValidators: true})
  if(!tour) {
    return next(new APIErrors('Tour not found', 404))
  }
  res.status(200).json({
    status: 'Success!!',
    tours: tour
  })
})

exports.deleteTour = catchAsync (async (req, res, next) => {
  const id = req.params.id
  const tour = await Tour.findByIdAndDelete(id)
  if(!tour) {
    return next(new APIErrors('Tour not found', 404))
  }
  res.status(204).send()
})

exports.addTour = catchAsync( async (req, res,next) => {
  const newTour = await Tour.create(req.body)

  res.status(200).json({
    status: 'Success!!',
    body: newTour
  })
})

exports.getTourStats = catchAsync( async (req, res, next) => {
  const tourStats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: 'ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $avg: '$price' },
        maxPrice: { $avg: '$price' }
      }
    },
    {
      $sort: {
        avgPrice: 1
      }
    },
    {
      $match: {
        _id: { $ne: 'EASY' }
      }
    }
  ])

res.status(200).json({
  status: 'Success!!',
  body: tourStats
})
})

exports.getMonthlyPlan = catchAsync( async (req, res, next) => {
  const year = req.params.year * 1 // 2021

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ])

  console.log(plan)

  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  })
})