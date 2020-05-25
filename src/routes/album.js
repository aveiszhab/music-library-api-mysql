const express = require('express');
const albumController = require('../controllers/album');
const songController = require('../controllers/song');

const router = express.Router();

router
.route('/')
.get(albumController.listAllAlbums);

router
.route('/:albumId')
.get(albumController.findAlbum)
.patch(albumController.updateAlbum)
.delete(albumController.deleteAlbum);

router
.route('/:albumId/songs')
.post(songController.createSong)
.get(songController.listSongsByAlbumId);



module.exports = router;