const dotenv = require('dotenv')
dotenv.config({ path: './config.env'})
const mongoose = require('mongoose')
const Tour = require('./../../models/tour')
const fs = require('fs')

const db = process.env.DBLINK.replace('<password>',process.env.DBPASSWORD)
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(con => {
    console.log('connection to db successful!')
  })

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'))

const importData = async () => {
  try {
    await Tour.create(tours)
    console.log('Data Loaded.')
    process.exit()
  } catch(err) {
    console.log(err)
  }
}

const deleteAll = async () => {
  try {
    await Tour.deleteMany()
    console.log('dataDeleted')
    process.exit()
  } catch(err) {
    console.log(err)
  }
}

if(process.argv[2] == '--import') {
  importData()
} else if (process.argv[2] == '--delete') {
  deleteAll()
}

console.log(process.argv)
