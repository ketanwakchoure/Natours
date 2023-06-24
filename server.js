const dotenv = require('dotenv')
dotenv.config({ path: './config.env'})
const mongoose = require('mongoose')

const app = require('./app')

console.log(mongoose.Error.DocumentNotFoundError)

const db = process.env.DBLINK.replace('<password>',process.env.DBPASSWORD)
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(con => {
    console.log('connection to db successful!')
  })

//console.log(process.env)

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`)
})

process.on('unhandledRejection',err => {
  console.log(err.name, err.message)
  server.close(() => {
    process.exit()
  })
})