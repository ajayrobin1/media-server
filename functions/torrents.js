const {PassThrough} = require("stream");

let client;

async function createClients(){
  const WebTorrent = (await import('webtorrent')).default
  client = new WebTorrent()

}

createClients();

exports.addTorrent = (magnetURI) => {
  return new Promise(async function (resolve, reject) {

    const torrent = await client?.get(magnetURI);
    if(torrent !== null){
      console.log("Torrent already exists")
      resolve(torrent);
  
    } else {

      if(client.torrents.length >= 1) {
        client.torrents.at(0).destroy()
      };
        
        console.log("Adding torrent..")
        client.add(magnetURI, (torrent) => {

          
          if (torrent) {
          
          resolve(torrent);
        } else {
          reject(Error("Failed to add torrent"));
        }
      })
    }
    
  })
}

exports.streamVideo = async (req, res) => {

    const infoHash = req.params.infoHash;
    const torrent = await client.get(infoHash).catch(err => console.log(err));  
    
    const file = torrent?.files.sort((a, b) => b.size - a.size).find(item => ((item.name.endsWith('.mp4') || (item.name.endsWith('.mkv')))));
    
    if (!file) {

      console.log('File is still loading, please try again later.');

    } else {
      
      const range = req.headers.range;

  const fileSize = file.size;

  if (range) {
      const [start, end] = range.replace(/bytes=/, '').split('-').map(Number);
      console.log(start, end)
      const chunkStart = start || 0;
      const chunkEnd = end ? Math.min(end, fileSize - 1) : fileSize - 1;
      const chunkSize = chunkEnd - chunkStart + 1;
  
      const stream = file.createReadStream({start, end}) ;
      
      const passThrough = new PassThrough(); 

      res.writeHead(206, {
        'Content-Range': `bytes ${chunkStart}-${chunkEnd}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      });

      stream.pipe(passThrough).pipe(res);
    
    req.on("close", () => {
      console.log("Client disconnected, stopping stream...");
      stream.destroy();
    });
  }
  }
}