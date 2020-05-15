require('dotenv').config({ silent: true });

const puppeteer = require('puppeteer');
const schedule = require('node-schedule');
const fs = require('fs');
const { format } = require('date-fns')

const { db } = require('./services/firebase');


const rules = new schedule.RecurrenceRule()
rules.hour = 08


const URL = process.env.SCRAPING_URL;

const getBody = async () => {
       const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
       })
       const page = await browser.newPage()
       await page.goto(URL, {
        waitUntil: 'networkidle0'
       });


      try {
        await page.waitForSelector('.linhaIOFPrimeira')
        const content = await page.evaluate(() => {
             return document.querySelectorAll('.linhaIOFPrimeira')[48].innerText;
        });
        
        await browser.close();

        return content

      }catch(err){
          console.log(err)
      }
        console.log(`> [getBody] Starting done!`);
       return content;
    

}

const getInfo = async (body) => {
    const info = body.split("SANTANDER IBOVESPA ATIVO AÇÕES").toString()
    console.log(`> [getInfo] Starting done!`)
    console.log(info)
    return info
         
}

const processingData = async (info) => {
    const data =  info.split('\t');
    let currentDate = new Date();
    currentDate = format(currentDate, 'dd/MM/yyyy');


    const actions = {
        fundName:'IBOVESPA AÇÕES',
        askDate: currentDate,
        quotaDate: data[1],
        quotaValue:data[2],
        profitability: {
            onDay: data[3],
            inMonth: data[4],
            previousMonth: data[5],
            cumulativeYear: data[6],
            lastYear: data[7],
            lastTwoYears: data[8],
            lastThreeYears: data[9]
        }
    }
    console.log(`> [processingData] Starting done!`);

    return actions
    
}
const saveDataToDB = async (db, info) => {
    const fundRef = db.collection('actionsFund');
    const data = info
    fundRef.add(data);

    console.log(`> [saveDataToDB] Starting done!`);
}

const keepAlive = async () => {
    setInterval(async ()=>{
        fetch('https://scraping-bot.herokuapp.com/', {
            method: 'GET',
           
        })
        
        console.log('op')
    }, 1200 * 1000)
}

const start = async () => {
    require('./utils/bot');
    require('./services/firebase');

    await keepAlive()

    const job = schedule.scheduleJob(rules, async () => {
        const body = await getBody();
        const info = await getInfo(body);
        const processing = await processingData(info);
        const saveData = await saveDataToDB(db, processing);
    
    });
    // const body = await getBody();
    // const info = await getInfo(body);
    // const processing = await processingData(info);
    // const saveData = await saveDataToDB(db, processing);



};


start();
