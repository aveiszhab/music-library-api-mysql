const express = require('express');
const artistController = require('../controllers/artist');
const albumController = require('../controllers/album');

const router = express.Router();

router
.route('/')
.post(artistController.createArtist)
.get(artistController.listArtists);

router
.route('/:artistId')
.patch(artistController.updateArtist)
.delete(artistController.deleteArtist)
.get(artistController.findArtist);

router
.route('/:artistId/albums')
.post(albumController.createAlbum)
.get(albumController.listAlbumsByArtistId);



module.exports = router;