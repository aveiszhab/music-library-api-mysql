const { Artist } = require('../sequelize');

exports.createArtist = (req, res) => {
  Artist.create(req.body).then(user => res.status(201).json(user));
};


exports.listArtist = (req, res) => {
  Artist.findAll().then(artists => res.status(200).json(artists));
};