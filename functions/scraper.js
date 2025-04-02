const { default: puppeteer } = require("puppeteer")

exports.getMagnetURI = async (keyword, index) => {

  const query = keyword.replace(/[^a-zA-Z ]/g, "").replaceAll(' ', '+')

  // console.log("Extracting MagnetURI from Link")
  const timeStamp = Date.now()

   if (!global.browser) {
    global.browser = await puppeteer.launch(
      {headless: "new",
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--disable-gpu",
        ],
    
       }
    );
  }
  const page = await global.browser.newPage();


 await page.goto(`https://1337x.to/search/${query}/1/`, { waitUntil: "domcontentloaded" })

// console.log("Navigated to page ", Date.now() - timeStamp )

  // Intercept requests to speed up scraping (optional)
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (["image", "stylesheet", "font", "media", "other"].includes(req.resourceType())) {
      req.abort();
    } else {
      req.continue();
    }
  });

  const torrentLink = await page.$eval(
    ".coll-1.name a:last-child",
    (el) => el.href
  );

  
  if(torrentLink){

  // console.log("Opening torrent page:", torrentLink , Date.now() - timeStamp);

  await page.goto(torrentLink, { waitUntil: "domcontentloaded" });

  // console.log("Extracting MagnetURI.. ", Date.now() - timeStamp )

  const magnetURI = await page.$eval('a[href^="magnet:?xt="]', (el) => el.href);
    
  
  console.log("LOG:: Time taken: ", Date.now() - timeStamp )
  
  return(magnetURI)

}




}