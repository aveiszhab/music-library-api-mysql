const express = require('express');
const albumController = require('../controllers/album');

const router = express.Router();

router
.route('/')
.get(albumController.listAllAlbums);

router
.route('/:albumId')
.get(albumController.findAlbum)
.patch(albumController.updateAlbum)
.delete(albumController.deleteAlbum);



module.exports = router;