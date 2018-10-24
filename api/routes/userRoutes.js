const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/UserSchema');

router.post('/register', (req, res) => {
  const newUser = req.body;
  if (!newUser.username || !newUser.password) {
    res
      .status(400)
      .json({ msg: 'Please provide a username and a password.', error: err });
  }
  const user = new User(newUser);
  user
    .save()
    .then((savedUser) => {
      res.status(200).json(savedUser);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ msg: 'There was an error saving the user.', error: err });
    });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({
      msg: 'Please enter both a username and a password.',
    });
  }

  User.findOne({ username })
    .populate('notes')
    .then((foundUser) => {
      if (!foundUser)
        return res.status(400).json({ msg: 'Invalid credentials.' });
      foundUser
        .checkPassword(password)
        .then((isValid) => {
          if (isValid) {
            const token = jwt.sign(
              { username: foundUser.username, id: foundUser._id },
              process.env.TOKEN_SECRET,
              { expiresIn: '1h' }
            );
            res.status(200).json({ token, username: foundUser.username });
          } else {
            res.status(400).json({ msg: 'Invalid credentials.' });
          }
        })
        .catch((err) =>
          res
            .status(401)
            .json({ err, msg: 'There was an error hashing the password.' })
        );
    })
    .catch((err) => {
      res.status(500).json({
        err,
        msg: 'There was an error communicating with the database.',
      });
    });
});

module.exports = router;
