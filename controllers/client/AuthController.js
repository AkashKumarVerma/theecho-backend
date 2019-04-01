const router   = require('express').Router()
const mongoose = require('mongoose')
const bcrypt   = require('bcrypt')
const jwt      = require('jsonwebtoken')
const { secret }     = require('./../../config/Keys')

const ClientModel = mongoose.model('ClientUsers')


const register = async (req, res, next) => {
  const { username, email, password } = req.body

  try {
    const ClientDocument = new ClientModel({ email: email, username: username })
    await ClientDocument.setPassword(password)
    await ClientDocument.save()
    res.status(200).send({ user: ClientDocument.toAuthJSON() })
  } catch(error) {
    res.status(400).send({ error: 'Reqest bosy should be in the form { username, email, password }'})
  }
}



const login = async (req, res, next) => {
  const { email, password } = req.body

  try {
    const ClientDocument = await ClientModel.findOne({ email: email })

    if (ClientDocument && ClientDocument.validatePassword(password)) {
      res.status(200) .send({ user: ClientDocument.toAuthJSON() })
    } else {
      res.status(400).send({ error: 'Email or Password Not Foud.'})
    }
  } catch(error) {
    res.status(400).send({ error: 'Something Went wrong Please Try again.' })
  }
}


module.exports = {
  login,
  register
}

