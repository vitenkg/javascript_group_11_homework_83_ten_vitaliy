const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const ArtistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  information: String,
  photo: String,
});

ArtistSchema.plugin(idValidator);

const Artist = mongoose.model('Artist', ArtistSchema);
module.exports = Artist;