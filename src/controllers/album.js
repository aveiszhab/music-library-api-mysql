const { Artist, Album } = require('../sequelize');

exports.createAlbum = (req,res) => {
  const artistId = parseInt(req.params.artistId,10);
  Artist.findByPk(artistId)
  .then(artist => {
    if(!artist) 
      res.status(404).json({error: 'The artist could not be found.'})
    else
      Album.create(req.body)
  .then(album => album.setArtist(artistId))
  .then(albumLinkedToArtist =>res.status(201).json(albumLinkedToArtist))
  });
};

exports.listAlbumsByArtistId = (req, res) => {
  const artistId = req.params.artistId;
  Artist.findByPk(artistId).then(artist => {
    if(!artist)
    res.status(404).json({error: 'The artist could not be found.'})
    Album.findAll({where: {artistId}}).then(albums => res.status(200).json(albums));
  });
};

exports.listAllAlbums = (req, res) => {
  Album.findAll().then(albums => res.status(200).json(albums));
};

exports.findAlbum = (req, res) => {
  const albumId = req.params.albumId;
  Album.findByPk(albumId)
  .then(album => {
    if (!album) {
      res.status(404).json({error:'The album could not be found.'});
    } else {
      res.status(200).json(album);
    }
  });
};

exports.updateAlbum = (req, res) => {
  const albumId = req.params.albumId;
  Album.update(req.body, {where: {id: albumId}})
  .then(([updatedAlbum]) => {
    if(!updatedAlbum) {
      res.status(404).json({error: 'The album could not be found.'})
    } else {
      res.status(200).json(updatedAlbum)
    }
  });
};

exports.deleteAlbum = (req, res) => {
  const albumId = req.params.albumId;
  Album.destroy({where:{id: albumId}})
  .then(deletedAlbum => {
    if(!deletedAlbum) {
      res.status(404).json({error: 'The album could not be found.'})
    } else {
      res.status(204).json(deletedAlbum)
    }
    });
};
