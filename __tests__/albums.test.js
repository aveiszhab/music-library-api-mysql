/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');
const { Artist, Album } = require('../src/sequelize');

describe('/albums', () => {
  let artist;

  before(async () => {
    try {
      await Artist.sequelize.sync();
      await Album.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });

  beforeEach(async () => {
    try {
      await Artist.destroy({ where: {} });
      await Album.destroy({ where: {} });
      artist = await Artist.create({
        name: 'Tame Impala',
        genre: 'Rock',
      });
    } catch (err) {
      console.log(err);
    }
  });

  describe('POST /artists/:artistId/albums', () => {
    it('creates a new album for a given artist', (done) => {
      request(app)
        .post(`/artists/${artist.id}/albums`)
        .send({
          name: 'InnerSpeaker',
          year: 2010,
        })
        .then((res) => {
          expect(res.status).to.equal(201);
                  
          Album.findByPk(res.body.id, { raw: true }).then((album) => {
            expect(album.name).to.equal('InnerSpeaker');
            expect(album.year).to.equal(2010);
            expect(album.artistId).to.equal(artist.id);
            
            done();
          });
        });
    });

    it('returns a 404 and does not create an album if the artist does not exist', (done) => {
      request(app)
        .post('/artists/1234/albums')
        .send({
          name: 'InnerSpeaker',
          year: 2010,
        })
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal('The artist could not be found.');

          Album.findAll().then((albums) => {
            expect(albums.length).to.equal(0);
            done();
          });
        });
    });
  });
  
  describe('with albums in the database', () =>{
    let albums;
    beforeEach((done) => {
      Promise.all([
        Album.create({name: 'Album1', year: 2020}),
        Album.create({name: 'Album2', year: 2019}),
        Album.create({name: 'Album3', year: 2018}),
      ]).then((documents) => {
        albums = documents;
        setArtistRecords = albums.map(albumLinkedToArtist =>
          albumLinkedToArtist.setArtist(artist));
        Promise.all(setArtistRecords).then(() => done());
        //console.log(albums[1].dataValues);
        //console.log(artist.id);
      });
     
    });

  describe('GET /artists/:artistId/albums', () =>{
      it('gets list of albums by artist', (done) => {
        //console.log(artist.id);
        request(app)
          .get(`/artists/${artist.id}/albums`)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(3);
          //console.log(res.body);
          res.body.forEach((album) => {
            const expected = albums.find((a) => a.id === album.id);
            expect(album.name).to.equal(expected.name);
            expect(album.year).to.equal(expected.year);
            //console.log(album.name);
          });
          done(); 
        });
        
      });
    });

  describe('GET /albums', () => {
    it('gets all album records', (done) =>{
      request(app)
      .get('/albums')
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(3);
        res.body.forEach((album) => {
          const expected = albums.find((a) => a.id === album.id);
          expect(album.name).to.equal(expected.name);
          expect(album.year).to.equal(expected.year);
        });
        done();
      });
    });
  });

  describe('GET /album/albumId', () => {
    it('gets album record by id', (done) => {
      const album = albums[0];
      request(app)
      .get(`/albums/${album.id}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal(album.name);
        expect(res.body.year).to.equal(album.year);
        expect(res.body.artistId).to.equal(album.artistId);
        done();
      });
    });

    it('returns a 404 if the album does not exist', (done) => {
      request(app)
      .get('/albums/44444')
      .then((res) => {
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('The album could not be found.');
        done();
      });
    });
  });

  describe('PATCH /albums/:albumId', () => {
    it('updates album name by id', (done) => {
      const album = albums[0];
      request(app)
      .patch(`/albums/${album.id}`)
      .send({name: 'Renamed'})
      .then((res) => {
        expect(res.status).to.equal(200);
        Album.findByPk(album.id, {raw: true}).then((updatedAlbum) => {
          expect(updatedAlbum.name).to.equal('Renamed');
          //console.log(updatedAlbum);
          done();
        });
      });
    });

    it('updates album year by id', (done) => {
      const album = albums[0];
      //console.log(album.dataValues);
      request(app)
      .patch(`/albums/${album.id}`)
      .send({year: 1997})
      .then((res) => {
        expect(res.status).to.equal(200);
        Album.findByPk(album.id, {raw: true}).then((updatedAlbum) =>{
          expect(updatedAlbum.year).to.equal(1997);
          //console.log(updatedAlbum);
          done();
        });
      });
    });

    it('returns 404 if the album does not exist', (done) => {
      request(app)
      .patch('/albums/444444')
      .send({year: 1997})
      .then((res) => {
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('The album could not be found.')
        done();
      });
    });
  });

  describe('DELETE /albums/:albumId', () => {
    it('deletes album record by id', (done) => {
      const album = albums[0];
      request(app)
        .delete(`/albums/${album.id}`)
        .then((res) => {
          expect(res.status).to.equal(204);
          Album.findByPk(album.id, { raw: true }).then((deletedAlbum) => {
            expect(deletedAlbum).to.equal(null);
            done();
          });
        });
    });

    it('returns a 404 if the album does not exist', (done) => {
      request(app)
        .delete('/albums/444444')
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal('The album could not be found.');
          done();
        });
    });
  });
    
  });

});


