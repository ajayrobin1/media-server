const express = require('express');
const path = require('path');
const cors = require('cors');

const {search} = require('./routes/search.js')
const { streamVideo } = require('./functions/torrents');
const { getLocalIP } = require('./functions/getLocalIP.js');

const app = express();
const port = 8080;

const localIP = getLocalIP();

app.use(express.static('public'))
app.use(express.urlencoded());

     const corsOptions = {
        origin: ['http://localhost:3000'], // Replace with the actual origin of your frontend application
        credentials: true, // Allow sending cookies and authentication headers
    };

    app.use(cors (corsOptions));

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
