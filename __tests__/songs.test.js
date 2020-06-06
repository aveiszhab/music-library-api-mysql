/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');
const { Artist, Album, Song } = require('../src/sequelize');

describe('/songs', () => {
  let artist;
  let album;

  before(async () => {
    try {
      await Artist.sequelize.sync();
      await Album.sequelize.sync();
      await Song.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });

  beforeEach(async () => {
    try {
      await Artist.destroy({ where: {} });
      await Album.destroy({ where: {} });
      await Song.destroy({ where: {} });
      artist = await Artist.create({
        name: 'Tame Impala',
        genre: 'Rock',
      });
      album = await Album.create({
        name: 'InnerSpeaker',
        year: 2010,
        artistId: artist.id,
      });
    } catch (err) {
      console.log(err);
    }
  });

  describe('POST /albums/:albumId/song', () => {
    it('creates a new song under an album', (done) => {
      request(app)
        .post(`/albums/${album.id}/songs`)
        .send({
          artist: artist.id,
          name: 'Solitude Is Bliss',
        })
        .then((res) => {          
          expect(res.status).to.equal(201);
          const songId = res.body.id;
          expect(res.body.id).to.equal(songId);
          expect(res.body.name).to.equal('Solitude Is Bliss');
          expect(res.body.artistId).to.equal(artist.id);
          expect(res.body.albumId).to.equal(album.id);
          done();
        });
    });
    
    it('returns a 404 and does not create a song if the album does not exist', (done) => {
      request(app)
        .post('/albums/1234/songs')
        .send({
          artist: artist.id,
          name: 'Solitude Is Bliss',
        })
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal('The album could not be found.');

          Song.findAll().then((songs) => {
            expect(songs.length).to.equal(0);
            done();
          });
        });
    });
  });
  
  describe('with songs in the database', () => {
    let songs;
  beforeEach((done) => {
      Promise.all([
        Song.create({name: 'Song1'}),
        Song.create({name: 'Song2'}),
        Song.create({name: 'Song3'}),
      ]).then((documents) => {
        songs = documents;
       setArtistRecords = songs.map(songLinkedToArtist => 
          songLinkedToArtist.setArtist(artist));
        setAlbumRecords = songs.map(songLinkedToAlbum =>
          songLinkedToAlbum.setAlbum(album));
          Promise.all([...setArtistRecords, ...setAlbumRecords]).then(() => done());
      });
    });

 describe('GET / albums/:albumId/songs', () => {
    it('gets list of songs by album', (done) => {
      request(app)
        .get(`/albums/${album.id}/songs`)
        .then((res) =>{
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(3);
        res.body.forEach((song) => {
          const expected = songs.find((a) => a.id === song.id);
          expect(song.name).to.equal(expected.name);
          expect(song.artistId).to.equal(expected.artistId);
          expect(song.albumId).to.equal(expected.albumId);
        });
        done();
        });
    });
  }); 

  describe('GET /songs', () => {
    it('gets all song records', (done) => {
      request(app)
      .get('/songs')
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(3);
        res.body.forEach((song) => {
          const expected = songs.find((a) => a.id === song.id);
          expect(song.name).to.equal(expected.name);
          expect(song.artistId).to.equal(expected. artistId);
          expect(song.albumId).to.equal(expected. albumId);
        });
        done();
      });
    });
  });

  describe('GET /songs/songId', () => {
    it('gets sing record by id', (done) => {
      const song = songs[0];
      request(app)
      .get(`/songs/${song.id}`)
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal(song.name);
        expect(res.body.albumId).to.equal(song.albumId);
        expect(res.body.artistId).to.equal(song.artistId);
        done();
      });
    });

    it('returns a 404 if the song does not exist', (done) => {
      request(app)
      .get('/songs/44444')
      .then((res) => {
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('The song could not be found.');
        done();
      });
    });
  });

  describe('PATCH /songs/:songId', () => {
    it('updates song name by id', (done) => {
      const song = songs[0];
      request(app)
      .patch(`/songs/${song.id}`)
      .send({name: 'Renamed'})
      .then((res) => {
        expect(res.status).to.equal(200);
        Song.findByPk(song.id, {raw: true}).then((updatedSong) => {
          expect(updatedSong.name).to.equal('Renamed');
          done();
        });
      });
    });

    it('returns 404 if the song does not exist', (done) => {
      request(app)
      .patch('/songs/444444')
      .send({name: 'Renamed'})
      .then((res) => {
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('The song could not be found.')
        done();
      });
    });
  });

  describe('DELETE /songs/:songId', () => {
    it('deletes song record by id', (done) => {
      const song = songs[0];
      request(app)
        .delete(`/songs/${song.id}`)
        .then((res) => {
          expect(res.status).to.equal(204);
          Song.findByPk(song.id, { raw: true }).then((deletedSong) => {
            expect(deletedSong).to.equal(null);
            done();
          });
        });
    });

    it('returns a 404 if the song does not exist', (done) => {
      request(app)
        .delete('/songs/444444')
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal('The song could not be found.');
          done();
        });
    });
  });

  });
});
