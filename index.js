const express = require('express');
const app = express();
app.listen(3000, ()=>console.log('Uber-BackEnd Connected Waiting for request.../'));
app.get('/', (req, res) => res.send('UberEats Server'))
app.use(express.json({}))


app.post('/api', (req, res)=>{
    console.log('i got a res');
    console.log(req.body);
    res.header("Access-Control-Allow-Origin", "*");
    
    const puppeteer = require('puppeteer');
    let site = `https://www.google.com/maps/search/restaurants+near+${req.body.location}`
    
    
    let scrape = (async () => {
    
    let sectionsArray = []
    let pageCounter = 1
    let sectionResultCollection = []
      const browser = await puppeteer.launch(
          {headless: true},
          {ignoreDefaultArgs: ['--disable-extensions'],}
          );
      const page = await browser.newPage();
      await page.goto(site, {waitUntil: 'load', timeout: 0});
      await page.waitFor(2000);

      await page.waitForSelector('.section-result', {
        visible: true,
      });

      let section = await page.evaluate(() => { 
        let Divs = document.getElementsByClassName("section-result").length;
    
        return {
            Divs
        }
      },);
    
      sectionResultCollection.push(section)
    
      if(sectionResultCollection[0].Divs == 21){
        console.log("Ads present")
      }else{
        console.table(sectionResultCollection)
      }
      await page.waitFor(2000);
    
    for (let i = 0; i < 
      sectionResultCollection[0].Divs + 1; i++) {
      await page.evaluate((i) => { 
        document.getElementsByClassName("section-result")[i].click(); 
      },i);
    
      await page.screenshot({path: 'example.png'});
    
      await page.waitForSelector('.section-info-text', {
        visible: true,
      });
      
      const result = await page.evaluate(() => {
        let check = document.getElementsByClassName("section-info-text")[4].innerText
        let check2 = document.getElementsByClassName("section-info-text")[3].innerText
        let check3 = document.getElementsByClassName('GLOBAL__gm2-subtitle-alt-1')[0].innerText
        let check4 = document.getElementsByClassName("section-popular-times-value section-popular-times-live-value").length
        let check5 = document.getElementsByClassName("section-popular-times-value section-popular-times-current-value")
    
        let bussynessPercentage = ""
        
    if((check == "Cerrado." || check2 == "Cerrado.") || (check3 != "Horarios populares" && check5.length == 0)){
      bussynessPercentage = "0%"
      let restaurantName = document.getElementsByClassName('GLOBAL__gm2-headline-5 section-hero-header-title-title')[0].innerText

      return {
        bussynessPercentage,
        restaurantName 
      }
    }else if (check4 == 0){
          bussynessPercentage = document.getElementsByClassName("section-popular-times-value section-popular-times-current-value")[1].parentElement.attributes[0].textContent.slice(0,3) 
          let restaurantName = document.getElementsByClassName('GLOBAL__gm2-headline-5 section-hero-header-title-title')[0].innerText
  
          return {
            bussynessPercentage,
            restaurantName 
          }
        
      }else if(check4 == 1){
        bussynessPercentage = document.getElementsByClassName("section-popular-times-value section-popular-times-live-value")[0].attributes[0].textContent
      let restaurantName = document.getElementsByClassName('GLOBAL__gm2-headline-5 section-hero-header-title-title')[0].innerText
       
      return {
        bussynessPercentage,
        restaurantName
      }  

    }
    
      });
        sectionsArray.push(result)
        console.log(result)
        console.log("I is now: " + i)
        console.log("We r on Page: " + pageCounter)
        
          await page.evaluate(() => { 
            document.getElementsByClassName("section-back-to-list-button blue-link noprint")[0].click(); 
          }); 
          await page.waitFor(2000);
          //sectionResultCollection[0].Divs - 1( total amount of divs containing restaurants)
        if(i == 1){
          i = 0
          await page.evaluate(() => { 
            document.getElementsByClassName("n7lv7yjyC35__button-next-icon")[0].click(); 
          });
          await page.waitFor(2000); 
          console.log("page: " + pageCounter)
          pageCounter++
    
          if(pageCounter == 3){

            let cordinates = page.url()
            let strCoord = cordinates.search("@")
            let coors = cordinates.slice(strCoord)
            let coorsOne = coors.search(",")
            let lan = coors.slice(1,coorsOne)
            let lon = coors.split(",")
            console.log(sectionsArray)
            browser.close();
            res.json({
              status: "success",
              response: sectionsArray,
              lon: lon[1],
              lat: lan
          })
            return sectionsArray;
          }
        }
        
      }
      
    })();

})
