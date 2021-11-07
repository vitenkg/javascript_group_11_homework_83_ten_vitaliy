const mongoose = require('mongoose');

const TrackHistorySchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    track: {
        type: String,
        required: true
    },
    datetime: {
        type: String,
        required: true,
    }
});

const TrackHistory = mongoose.model('TrackHistory', TrackHistorySchema);

module.exports = TrackHistory;