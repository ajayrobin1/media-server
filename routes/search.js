const fs = require('fs');
const path = require('path');
const { getMagnetURI } = require('../functions/scraper')
const { addTorrent } = require('../functions/torrents')

exports.search = async (req, res) => {

          const keyword = req.body.keyword;
          const index = req.body.index ? Number(req.body.index) : 1;
  
    let data = [];
  
    fs.readFile(path.join(__dirname, 'results.json'), async (err, fileData) => {
      let magnetURI;

      if (err) throw err;

      try{
        data =JSON.parse(fileData)
      } catch {
        console.log("Database is empty")
      }
      const fileObject = data.find(item => item.keyword === keyword) 
  
      if(fileObject){

        console.log('magnetURI loaded from database..!');
        
        await addTorrent(fileObject.magnetURI).then( (torrent) => {
          console.log("Added: ", torrent.name) 
          console.log(torrent.infoHash)
          res.send(JSON.stringify({'status' : 'success', 'infoHash': torrent.infoHash})) 
        }).catch(err => console.log(err))
        
      } else {
        
        magnetURI = await getMagnetURI(keyword, index)
        if(magnetURI){
          data.push({'keyword': keyword , 'magnetURI': magnetURI})
          
          await addTorrent(magnetURI).then((torrent) => {

            console.log("Added: ", torrent.name) 
            fs.writeFileSync( path.join(__dirname, 'results.json'), JSON.stringify(data), err => {
              if (err) throw err;
              console.log('Result was appended to file!');
            })
            console.log("magnetURI loaded from scraper")
    
            res.send(JSON.stringify({'status' : 'success', 'infoHash': torrent.infoHash})) 
          }).catch(err => console.log(err))
        } else {
          res.status(404).send(JSON.stringify({'status' : 'error'})) 
        }
      }

    })
  }