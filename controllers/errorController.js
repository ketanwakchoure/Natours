const APIErrors = require("../util/APIErrors")

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err
  })
}

const sendErrorProd = (err, res) => {
  if(err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong'
    })
  }
}

const handleCastError = err => {
  const message = `Invalid ${err.path}: ${err.value}`
  return new APIErrors(message, 400)
}

const handleDuplicateKeyError = err => {
  console.log(err)
  const message = `Duplicate key value: ${err.keyValue.name}. Please use different value.`
  return new APIErrors(message, 400)
}

const handleValidationError = err => {
  const errors = Object.values(err.errors).map(el => el.message)
  const message = `Invalid input data. ${errors.join('. ')}`
  return new APIErrors(message, 400)
}


module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  if(process.env.NODE_ENV === 'development') {
    sendErrorDev(err,res)
  } else if(process.env.NODE_ENV === 'production') {
    let error = {...err}
    if(error.name === 'CastError') error = handleCastError(error)
    if(error.code === 11000) error = handleDuplicateKeyError(error)
    if(err.name === 'ValidationError') error = handleValidationError(error)
    sendErrorProd(error, res)
  }
}