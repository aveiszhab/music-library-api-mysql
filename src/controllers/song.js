const {Artist, Album, Song} = require('../sequelize');

exports.createSong = (req, res) => {
  const albumId = parseInt(req.params.albumId,10);
  const artistId = req.body.artist;
  Album.findByPk(albumId)
  .then(album => {
    if(!album) 
      res.status(404).json({error: 'The album could not be found.'})
    else 
      Song.create(req.body)
  
  .then(song => song.setAlbum(albumId))
  .then(songLinkedToAlbum => songLinkedToAlbum.setArtist(artistId))
  .then(finalSong => {
      res.status(201).json(finalSong);
    });
  });
};

exports.listSongsByAlbumId = (req,res) => {
  const albumId = req.params.albumId;
  Album.findByPk(albumId,{raw: true}).then((album ) => {
    Song.findAll({where: {albumId}})
  .then(songs => {
    res.status(200).json(songs);
  });
  });
};

exports.listAllSongs = (req, res) => {
  Song.findAll(
    {
      include: [{
        model: Album,
        as: 'album'
      }]
    }
  ).then(songs => {
    res.status(200).json(songs);
  });
};

exports.findSong = (req, res) => {
  const songId = req.params.songId;
  Song.findByPk(songId)
    .then(song => {
      if(!song) {
        res.status(404).json({error:'The song could not be found.'});
      } else {
        res.status(200).json(song);
      }
    });
};

exports.updateSong = (req, res) => {
  const songId = req.params.songId;
  Song.update(req.body, {where: {id: songId}})
  .then(([updatedSong]) => {
    if(!updatedSong) {
      res.status(404).json({error:'The song could not be found.'});
    } else {
      res.status(200).json(updatedSong);
    }
  });
};

exports.deleteSong = (req, res) => {      
  const songId = req.params.songId;
  Song.destroy({where: {id: songId}})
  .then((deletedSong) => {
    if(!deletedSong) {
      res.status(404).json({error:'The song could not be found.'});
    } else {
      res.status(204).json(deletedSong);
    }
  });
};
