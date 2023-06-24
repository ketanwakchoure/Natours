const fs = require('fs')

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
)

exports.checkId = (req, res, next, val) => {
  const tour = users.find(el => el._id === val)

  if(!users) {
    return res.status(404).json({
      status: 'failed',
      message: 'users not found.'
    })
  }
}

exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    users: users
  })
}

exports.getUser = (req, res) => {
  const id = req.params.id
  const tour = users.find(el => el._id === id) 
  
  res.status(200).json({
    status: 'success',
    users: user
  })
}

exports.updateUser = (req, res) => {
  const id = req.params.id * 1
  const tour = users.find(el => el._id === id)

  res.status(200).json({
    status: 'success',
    users: users[id]
  })
}

exports.deleteUser = (req, res) => {
  const id = req.params.id * 1
  const user = users.find(el => el._id === id)

  res.status(204).send()
}

exports.addUser = (req, res) => {
  const newId = users[users.length - 1].id + 1
  const newuser = Object.assign({ id: newId }, req.body)
  
  users.push(newuser)
  fs.writeFile(`${__dirname}/dev-data/data/users.json`, JSON.stringify(users), err => {
    res.status(201).json({
      status: 'success',
      data: {
        user: newuser
      }
    })
  })
}