const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3030;
const session = require('express-session');

const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');

const corsOptions = {
  origin: [`http://localhost:3000`, process.env.CLIENT_URI],
  credentials: true,
};

const server = express();
server.use(cors(corsOptions));

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost/notes';

mongoose
  .connect(
    MONGO_URI,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch(err => {
    console.log('There was an error connecting to MongoDB', err);
  });

server.use(express.json());

server.use('/', userRoutes);
server.use('/notes', noteRoutes);

server.listen(port, () => console.log(`Server is listening on port ${port}`));
