const express = require('express');
const path = require('path');
const multer = require('multer');
const {nanoid} = require('nanoid');
const Album = require('../models/Album');
const Artist = require('../models/Artist');
const config = require('../config');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, nanoid() + path.extname(file.originalname))
  }
});

const upload = multer({storage});

router.get('/', async (req, res) => {
  try {
    const query = {};

    if (req.query.artist) {
      query.artist = req.query.artist
    }

    console.log(query);
    const albums = await Album.find(query).populate('artist', 'name');
    res.send(albums);
  } catch (e) {
    res.sendStatus(500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const allInfo = [];
  const albumInfo = await Album.findOne({_id: req.params.id});
    allInfo.push(albumInfo);
  const artistInfo = await Artist.findOne({_id: albumInfo.artist});
    allInfo.push(artistInfo);
  res.send (allInfo);
  } catch (e) {
    res.sendStatus(500);
  }
});


router.post('/', upload.single('image'), async (req, res) => {
  if (!req.body.name || !req.body.artist) {
    return res.status(400).send('Data Not valid');
  }

  const albumData = {
    name: req.body.name,
    artist: req.body.artist,
    year: req.body.year || null
  }

  if (req.file) {
    albumData.image = req.file.filename;
  }

  const album = new Album(albumData);
  try {
    await album.save();
    res.send(album);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;