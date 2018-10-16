const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3030;
const session = require('express-session');

const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');

const corsOptions = {
  origin: process.env.CLIENT_URI || `http://localhost:3000`,
  credentials: true,
};

const server = express();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost/notes';
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch(err => {
    console.log('There was an error connecting to MongoDB', err);
  });

server.use(cors(corsOptions));
server.use(express.json());
server.use(
  session({
    secret: 'rigby is a bird',
    resave: false,
    saveUninitialized: true,
    auth: false,
  })
);

server.use('/', userRoutes);
server.use('/notes', noteRoutes);


server.listen(port, () => console.log(`Server is listening on port ${port}`));
