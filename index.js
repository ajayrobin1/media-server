const express = require('express');
const path = require('path');

const {search} = require('./routes/search.js')
const { streamVideo } = require('./functions/torrents');
const { getLocalIP } = require('./functions/getLocalIP.js');

const app = express();
const port = 8080;

const localIP = getLocalIP();

app.use(express.static('public'))
app.use(express.urlencoded());

app.use((req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
  res.header(`Access-Control-Allow-Headers`, `Content-Type`);
  res.setHeader("Access-Control-Allow-Headers", "Range");
  res.setHeader("Access-Control-Expose-Headers", "Content-Range, Accept-Ranges");
  next();
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/player', (req, res) => res.sendFile(path.join(__dirname, 'player.html')));


app.post('/search', search)

app.get('/:infoHash',  async (req, res) => {
  streamVideo(req, res)
})

const url = `http://${localIP}:${port}`;

app.listen(port, () => {
  console.log(`HTTPS Server running at ${url}`);
});

exports.port = port;