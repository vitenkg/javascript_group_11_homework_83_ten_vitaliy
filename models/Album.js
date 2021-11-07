const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const AlbumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  },
  year: String,
  image: String
});

AlbumSchema.plugin(idValidator);

const Album = mongoose.model('Album', AlbumSchema);
module.exports = Album;