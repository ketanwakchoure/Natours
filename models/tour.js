const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    maxLength: [40,'cannot exceed 40 char'],
    minLength: [5, 'cannot be less than 5 char'],
    validate: {
      validator: function(val) {
        return validator.isAlpha(val)
      },
      message: 'Name should only contain Alphabets.'
    }
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration.']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size.']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'low is 1'],
    max: [5, '5 is high']
  },
  ratingsQuantity:{
    type: Number,
    default: 0
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val) {
        return val < this.price
      },
      message: 'priceDiscount must be less than price'
    }
  },
  summary: { 
    type: String,
    trim: true,
    required: [true, 'A tour must have description.'] 
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have difficulty.'],
    enum: {
      values: ['easy','medium','difficult'],
      message: 'Can only be fixed to easy,medium,difficult'
    }
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price.']
  },
  images: [String],
  description: { 
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  startDates: [Date]
},{
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
})

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration/7
})

tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, {lower : true})
  next()
})

tourSchema.pre('find',function(next) {
  this.find({duration: {$gte : 10}})
  next()
})

tourSchema.pre('aggregate',function(next) {
  console.log(this.pipeline())
  next()
})
module.exports = mongoose.model('Tour', tourSchema)