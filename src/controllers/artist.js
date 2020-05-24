const { Artist } = require('../sequelize');

exports.createArtist = (req, res) => {
  Artist.create(req.body).then(artist => res.status(201).json(artist));
};


exports.listArtists = (req, res) => {
  Artist.findAll().then(artists => res.status(200).json(artists));
};

exports.findArtist = (req, res) => {
  const artistId = req.params.artistId;
  Artist.findByPk(artistId)
  .then(artist => {
    if(!artist) {
      res.status(404).json({error: 'The artist could not be found.'})
    } else {
      res.status(200).json(artist)
    }
  }); 
};

exports.updateArtist = (req,res) => {
  const artistId = req.params.artistId;
  Artist.update(req.body, {where: {id: artistId}})
  .then(([updatedArtist]) => {
    console.log(updatedArtist[0]);
    if(!updatedArtist) {
      res.status(404).json({error: 'The artist could not be found.'})
    } else {
      res.status(200).json(updatedArtist)
    }
  }); 
};

exports.deleteArtist = (req,res) => {
  const artistId = req.params.artistId;
  Artist.destroy({where: {id: artistId}})
  .then(deletedArtist => {
    if(!deletedArtist) {
      res.status(404).json({error: 'The artist could not be found.'})
    } else {
      res.status(204).json(deletedArtist)
    }
  }); 
};

