const express = require('express');

const artistRouter = require('./routes/artist');
const albumRouter = require('./routes/album');
const songrouter = require('./routes/song')

const app = express();

app.use(express.json());

app.use('/artists', artistRouter);
app.use('/albums', albumRouter);
app.use('/songs', songrouter);

module.exports = app;
