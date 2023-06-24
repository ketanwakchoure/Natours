const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const User = require('./../models/user')
const catchAsync = require('./../util/catchAsync')
const APIErrors = require('./../util/APIErrors')

const signToken = id => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES
  })
}

exports.signup = catchAsync( async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  })

  const token = signToken(user._id)

  res.status(201).json({
    status: 'success',
    user: user,
    token: token
  })
})

exports.login = catchAsync(async (req, res, next) => {

  const {email, password} = req.body

  if(!email || !password) {
    return next(new APIErrors('Email or password is missing.',400))
  }

  const user = await User.findOne({email}).select('+password')
  const correct = await user.correctPassword(password,user.password)

  if(!user || !correct) {
    return next(new APIErrors('Enter correct email or password',401))
  }

  const token = signToken(user._id)
  res.status(200).json({
    token: token
  })
})

exports.protect = catchAsync(async (req, res, next) => {
  let token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  if(!token) {
    return next(new APIErrors('You are not logged in. Please log in to get access.',401))
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
  const user = await User.findById(decoded.id)
  if(!user) {
    return next(new APIErrors('User does not exist.',401))
  }
  if(user.changePasswordAfter(decoded.iat)) {
    return next(new APIErrors('User changed password after token creation', 401))
  }
  req.user = user
  next()
})

exports.restrict = function(...roles) {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)) {
      return next(new APIErrors('Access Denied', 403))
    }
  }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if(!user) {
    return next(new APIErrors('No user with this email Address',404))
  }
  const resetToken = crypto.randomBytes(32).toString('hex')
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
})