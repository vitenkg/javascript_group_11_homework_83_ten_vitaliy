const User = require("../models/User");
const Track = require("../models/Track");
const History = require("../models/TrackHistory");
const express = require("express");

const router = express.Router();

router.post('/', async (req,res) => {
    const token = req.get('Authorization');

    if (!req.body.trackId) {
        return res.status(400).send('Data Not valid');
    }

    if (!token) {
        return res.status(401).send({error: "No token present"});
    }

    const user = await User.findOne({token});

    if (!user) {
        return res.status(401).send({error: "Wrong token"});
    }

    const date = new Date();

    const historyData = {
        datetime: date,
        track: req.body.trackId,
        user: user._id,
    }

    const history = new History(historyData);

    try {
        await history.save();
        res.send(history);
    } catch (e) {
        res.status(500).send(e);
    }

});

module.exports = router;