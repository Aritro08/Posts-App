const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/user');

const router = express.Router();

router.post('/sign-up', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash =>
    {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save().then(resData => {
        const token = jwt.sign({ email: resData.email, id: resData._id}, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
          message: 'User created',
          token: token,
          expiresIn: 3600,
          userId: resData._id
        });
      })
      .catch(err => {
        res.status(500).json({
          message: 'User already exists.'
        });
      });
    });
});

router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({email: req.body.email}).then(user => {
    //check if email exists
    if(!user) {
      return res.status(401).json({
        message: 'Invalid Credentials'
      });
    }
    fetchedUser = user;
    //check to match password
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    //result is true or false based on check
    if(!result) {
      return res.status(401).json({
        message: 'Invalid Credentials'
      });
    }
    //if passwords match generate new token
    const token = jwt.sign({ email: fetchedUser.email, id: fetchedUser._id}, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id
    });
  })
  .catch(err => {
    return res.status(401).json({
      message: 'Login failed'
    });
  });
})

module.exports = router;
