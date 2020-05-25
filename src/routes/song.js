const express = require('express');
const songController = require('../controllers/song');

const router = express.Router();

router
.route('/')
.get(songController.listAllSongs);

router
.route('/:songId')
.get(songController.findSong)
.patch(songController.updateSong)
.delete(songController.deleteSong);


module.exports = router;