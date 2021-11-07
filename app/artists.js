const express = require('express');
const multer = require('multer');
const path = require('path');
const {nanoid} = require('nanoid');
const Artist = require('../models/Artist');
const config = require("../config");

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
    const artists = await Artist.find();
    res.send(artists);
  } catch (e) {
    res.sendStatus(500);
  }

});

router.post('/', upload.single('photo'), async (req, res) => {
  if (!req.body.name) {
    return res.status(400).send('Data Not valid');
  }

  const artistData = {
    name: req.body.name,
    information: req.body.information || null,
  }

  if (req.file) {
    artistData.photo = req.file.filename
  }

  const artist = new Artist(artistData);
  try {
    await artist.save();
    res.send(artist);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;