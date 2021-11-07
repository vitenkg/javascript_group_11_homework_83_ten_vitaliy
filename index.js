const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const exitHook = require('async-exit-hook');
const artists = require('./app/artists');
const tracks = require('./app/tracks');
const albums = require('./app/albums');
const Users = require('./app/users');
const TrackHistory = require('./app/trackHistory');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const port = 8000;

app.use('/artists', artists);
app.use('/albums', albums);
app.use('/tracks', tracks);
app.use('/users', Users);
app.use('/track_history', TrackHistory);


const run = async () => {
  await mongoose.connect('mongodb://localhost/HW83');

  app.listen(port, () => {
    console.log(`Server started on ${port} port`);
  });

  exitHook(() => {
    console.log('Mongo Exiting...');
    mongoose.disconnect();
  });
};

run().catch(e => console.error(e));