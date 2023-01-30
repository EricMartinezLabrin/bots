const puppeteer = require('puppeteer');
const fs = require("fs");
const { parse } = require("csv-parse");

const cash = [];
fs.createReadStream('./cards.csv')
    .pipe(parse({
        separator: ','
    }))
    .on('data', row => cash.push(row))


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

(async () => {
    console.log('Bienvenido a Premium y Codigos Card Checker')
    console.log('Iniciamos proceso');
    console.log('***********')
    console.log('')
    console.log('')
    const browser = await puppeteer.launch();//{ headless: false } );
    const page = await browser.newPage();
    await page.goto("https://productos.pago24.com.ar/giftcard/misaldo/");
    for await (i of cash) {
        card = i
        await page.type('input[name=number-gc]',card);
        await page.click('input[name=action-gc]');
        //await page.click('input[name=action-gc]');
        await delay(1500);

        // const xpath_expression = '/html/body/div[1]/div[2]/div[11]/div/div[3]/div[2]';
        const message = await page.evaluate(() => {
            mge = document.querySelector('.message-gc').innerHTML;
            if(mge === 'Tu saldo es:'){
                return '';
            }else{
                return mge.slice(0, 36);;
            }
        })        
        const total = await page.evaluate(() => {
            return document.querySelector('.amount-gc').innerHTML;
        })
        addCsv(i,`${message} ${total}`)
        console.log(`${i}: ${message} ${total}`)
        const inputValue = await page.$eval('.number-gc', el => el.value);
        // focus on the input field
        await page.click('.number-gc');
        for (let i = 0; i < inputValue.length; i++) {
        await page.keyboard.press('Backspace');
        }
    }
    console.log('')
    console.log('')
    console.log('***********')
    console.log("Terminando proceso...");
    browser.close();
    console.log("Termino correctamente");
})();