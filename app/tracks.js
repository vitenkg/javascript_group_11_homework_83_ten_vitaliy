const express = require('express');
const Track = require('../models/Track');
const Albums = require('../models/Album');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const query = {};
        if (req.query.album) {
            query.album = req.query.album;
            const tracks = await Track.find(query).populate('album', 'name artist');
            return res.send(tracks);
        }

        if (req.query.artist) {
            let allTracks = [];
            query.artist = req.query.artist;
            const albums = await Albums.find(query).populate('artist', 'name artist');

            for (let i = 0; i < albums.length; i++) {
                const queryAlbum = {};
                queryAlbum.album = albums[i]._id;
                const tracks = await Track.find(queryAlbum).populate('album', 'name artist')
                allTracks = allTracks.concat(tracks);
            }

            return res.send(allTracks);
        }

        const tracks = await Track.find();
        res.send(tracks);

    } catch (e) {
        res.sendStatus(500);
    }

});

router.post('/', async (req, res) => {
    if (!req.body.name || !req.body.album) {
        return res.status(400).send('Data Not valid');
    }

    const trackData = {
        name: req.body.name,
        album: req.body.album,
        lasting: req.body.lasting || null
    }


    const track = new Track(trackData);
    try {
        await track.save();
        res.send(track);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const track = await Track.findByIdAndDelete(req.params.id);

        if (track) {
            res.send(`Product ${track.name} removed`);
        } else {
            res.status(404).send({error: 'Product no found'});
        }
    } catch (e) {

    }
})

module.exports = router;