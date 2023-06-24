const express = require('express')
const morgan = require('morgan')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const APIErrors = require('./util/APIErrors')
const globalErrorHandler = require('./controllers/errorController')

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.static(`${__dirname}/public`))

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.all('*', (req,res,next) => {
  next(new APIErrors(`Can't find ${req.originalUrl} on this server!`,404))
})
app.use(globalErrorHandler)
module.exports = app