const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Provide valid emailID']
  },
  photo: String,
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function(val) {
        return this.password === val
      }
    } 
  },
  passwordChangedAfter: {
    type: Date
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin']
  }
})

userSchema.pre('save',async function (next) {
  if(!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12)
  this.passwordChangedAfter = Date.now()
  this.passwordConfirm = undefined
  next()
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword,userPassword)
}

userSchema.methods.changePasswordAfter = function (tokeniat) {
  const x = Math.floor(this.passwordChangedAfter/1000)
  console.log(x,tokeniat)
  return tokeniat < x
}

//userSchema.method.

const User = mongoose.model('User', userSchema)
module.exports = User