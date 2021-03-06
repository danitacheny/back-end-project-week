const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Note = require('../models/NoteSchema');
const User = require('../models/UserSchema');

router.use((req, res, next) => {
  const token = req.headers.authorization;
  let verified;
  try {
    verified = jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (err) {
    return res.status(401).json({ err, msg: 'You are not authorized.' });
  }

  if (verified) {
    req.user = verified;
    next();
  } else {
    res.status(401).json({ error: 'Not logged in' });
  }
});

router.get('/', (req, res) => {
  const { id } = req.user;
  User.findOne({ _id: id })
    .populate('notes')
    .then(foundUser => {
      if (!foundUser) res.status(404).json({ msg: 'User does not exist' });
      res.status(200).json({ notes: foundUser.notes });
    })
    .catch(err => res.status(500).json({ err, msg: 'There was a error connecting with the database.'}));
});

router.get('/:id', (req, res) => {
  Note.findById(req.params.id)
    .then(note => res.status(200).json(note))
    .catch(err =>
      res
        .status(500)
        .json({ msg: 'There was an error retrieving the note.', error: err })
    );
});

router.post('/', (req, res) => {
  const { id } = req.user;
  const noteInfo = req.body;
  noteInfo.creator = id;
  const note = new Note(noteInfo);
  note
    .save()
    .then(savedNote => {
      User.findOne({ _id: id }, (err, user) => {
        if (err) {
          return res
            .status(500)
            .json({ msg: 'There was an error adding the note.' });
        }
        user.notes.push(savedNote);
        user
          .save()
          .then()
          .catch(err =>
            res.status(500).json({
              msg: 'There was an error saving the the note to the account.',
              error: err,
            })
          );
      });
      res.status(200).json(savedNote);
    })
    .catch(err => {
      res
        .status(500)
        .json({ msg: 'There was an error saving the note.', error: err });
    });
});

router.put('/collab/:id', (req, res) => {
  const { email } = req.body;
  const { id } = req.params;
  User.findOneAndUpdate({ email: email }, { $push: { notes: id } }, (err, user) => {
    if (err)
      res.status(500).json({
        msg: 'There was an error adding the note to the collaborator account',
        err,
      });
  });
});

router.put('/', (req, res) => {
  const note = req.body;
  Note.findByIdAndUpdate(note._id, note, { new: true })
    .then(updatedNote => {
      res.status(200).json(updatedNote);
    })
    .catch(err => {
      res
        .status(500)
        .json({ msg: 'There was an error updating the note.', error: err });
    });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  Note.findByIdAndRemove(id)
    .then(deletedNote => {
      res.status(200).json(deletedNote);
    })
    .catch(err => {
      res
        .status(500)
        .json({ msg: 'There was an error deleting the note.', error: err });
    });
});

module.exports = router;
