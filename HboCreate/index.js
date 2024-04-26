const puppeteer = require('puppeteer');
const fs = require('fs');

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

async function main() {
    // Leer el archivo CSV
    const data = await fs.promises.readFile('./hbo.csv', 'utf-8');

    // Convertir el contenido del archivo a un arreglo de filas
    const rows = data.split('\n');

    //Mensajes de bienvenida
    console.log('Bienvenido a Premium y Codigos HBO Creator')
    console.log('Iniciamos proceso');
    console.log('***********')
    console.log('')
    console.log('')

    // Recorrer cada fila del archivo
    for (const row of rows) {
        // Inicializar Puppeteer
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setViewport({ 
            width: 1024,
            height: 2500
         });


        // Separar las columnas de la fila
        const columns = row.split(',');

        // Definimos email y password
        const [email,password,card,date,cvv,cardholder] = columns

        //Iniciamos proceso
        await page.goto("https://www.hbomax.com/subscribe/plan-picker",
        {
            waitUntil:'networkidle0'
        })
        page.waitForNetworkIdle

        //Acept cookies
        await page.click("#onetrust-accept-btn-handler")
        //Select Plan
        for (let index = 0; index < 13; index++) {
            await page.keyboard.press('Tab');
            await delay(200)
        }
        await page.keyboard.press('Enter')
        await delay(200)
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        await page.keyboard.press('Enter');

        //Write account data
        await page.type("#firstName","Premium y")
        await page.type("#lastName","Codigos")
        await page.type("#email",email)
        await page.type("#password",password)
        await page.click("#createAccount")
        page.waitForNetworkIdle

        try {
            await page.waitForSelector("#generalError > span")
            await page.goto("https://play.hbomax.com/signIn")
            await page.waitForSelector("#EmailTextInput")
            await page.type("#EmailTextInput",email)
            await page.type("#PasswordTextInput",password)
            await page.keyboard.press('Enter')
            page.waitForNavigation
            await page.goto("https://play.hbomax.com/signUp",
        {
            waitUntil:'networkidle0'
        })
            //Select Plan
            for (let index = 0; index < 3; index++) {
                await page.keyboard.press('Tab');
                await delay(200)
            }
            await page.keyboard.press('Enter')
            await delay(200)
            page.waitForNetworkIdle

            //Select Plan
            for (let index = 0; index < 14; index++) {
                await page.keyboard.press('Tab');
                await delay(200)
            }
            await page.keyboard.press('Enter')
            await delay(200)
                await page.waitForSelector("#cardHolderNameField")

        } catch (error) {
            {}
        }

        //Write Card Data
        await page.waitForSelector("#cardHolderNameField")
        await page.type("#cardHolderNameField",cardholder)
        await page.waitForSelector("#card_number")
        await page.type("#card_number",card)
        await page.type("#cardExpiryDateField",date)
        await page.type("#cvv",cvv)
        await page.click("#savePaymentMethod")
        page.waitForNetworkIdle


        //Edit first profile
        for (let index = 0; index < 5; index++) {
            await page.keyboard.press('Tab');
            await delay(200)
        }       
        await page.keyboard.press('Enter')
        page.waitForNetworkIdle
        await page.keyboard.press('Tab');
        page.waitForNetworkIdle
        await page.keyboard.press('Enter')
        page.waitForNetworkIdle
        await page.type("#root > div.css-175oi2r.r-13awgt0 > div > div.css-175oi2r.r-1p0dtai.r-eqz5dr.r-1d2f490.r-u8s1d.r-zchlnj.r-ipm5af > div.css-175oi2r.r-13awgt0 > div > div > div.css-175oi2r.r-13awgt0 > div:nth-child(2) > div.css-175oi2r.r-1p0dtai.r-1d2f490.r-u8s1d.r-zchlnj.r-ipm5af.r-12vffkv > div:nth-child(2) > div > div > div > div.css-175oi2r.r-13awgt0 > div > div.css-175oi2r.r-150rngu.r-eqz5dr.r-16y2uox.r-1wbh5a2.r-11yh6sk.r-1rnoaur.r-1sncvnh > div > div > div:nth-child(2) > div > div:nth-child(4) > input","PERFIL 1")
        await page.keyboard.press('Tab');
        await page.keyboard.press('Enter')
        page.waitForNetworkIdle
        

        //create second profile
        for (let index = 0; index < 2; index++) {
            await page.keyboard.press('Tab');
            await delay(200)
        }        
        await page.keyboard.press('Enter')
        page.waitForNetworkIdle
        await page.type("#root > div.css-175oi2r.r-13awgt0 > div > div.css-175oi2r.r-1p0dtai.r-eqz5dr.r-1d2f490.r-u8s1d.r-zchlnj.r-ipm5af > div.css-175oi2r.r-13awgt0 > div > div > div.css-175oi2r.r-13awgt0 > div:nth-child(4) > div.css-175oi2r.r-1p0dtai.r-1d2f490.r-u8s1d.r-zchlnj.r-ipm5af.r-12vffkv > div:nth-child(2) > div > div > div > div.css-175oi2r.r-13awgt0 > div > div.css-175oi2r.r-150rngu.r-eqz5dr.r-16y2uox.r-1wbh5a2.r-11yh6sk.r-1rnoaur.r-1sncvnh > div > div > div:nth-child(2) > div > div:nth-child(4) > input","PERFIL 2")
        await page.keyboard.press('Tab');
        await page.keyboard.press('Enter')
        page.waitForNetworkIdle


        //CREATE THIRTH PROFILE
        for (let index = 0; index < 3; index++) {
            await page.keyboard.press('Tab');
            await delay(200)
        }        
        await page.keyboard.press('Enter')
        page.waitForNetworkIdle
        await page.type("#root > div.css-175oi2r.r-13awgt0 > div > div.css-175oi2r.r-1p0dtai.r-eqz5dr.r-1d2f490.r-u8s1d.r-zchlnj.r-ipm5af > div.css-175oi2r.r-13awgt0 > div > div > div.css-175oi2r.r-13awgt0 > div:nth-child(4) > div.css-175oi2r.r-1p0dtai.r-1d2f490.r-u8s1d.r-zchlnj.r-ipm5af.r-12vffkv > div:nth-child(2) > div > div > div > div.css-175oi2r.r-13awgt0 > div > div.css-175oi2r.r-150rngu.r-eqz5dr.r-16y2uox.r-1wbh5a2.r-11yh6sk.r-1rnoaur.r-1sncvnh > div > div > div:nth-child(2) > div > div:nth-child(4) > input","PERFIL 3")
        await page.keyboard.press('Tab');
        await page.keyboard.press('Enter')
        page.waitForNetworkIdle


        //create FOURTH profile
        for (let index = 0; index < 4; index++) {
            await page.keyboard.press('Tab');
            await delay(200)
        }        
        await page.keyboard.press('Enter')
        page.waitForNetworkIdle
        await page.type("#root > div.css-175oi2r.r-13awgt0 > div > div.css-175oi2r.r-1p0dtai.r-eqz5dr.r-1d2f490.r-u8s1d.r-zchlnj.r-ipm5af > div.css-175oi2r.r-13awgt0 > div > div > div.css-175oi2r.r-13awgt0 > div:nth-child(4) > div.css-175oi2r.r-1p0dtai.r-1d2f490.r-u8s1d.r-zchlnj.r-ipm5af.r-12vffkv > div:nth-child(2) > div > div > div > div.css-175oi2r.r-13awgt0 > div > div.css-175oi2r.r-150rngu.r-eqz5dr.r-16y2uox.r-1wbh5a2.r-11yh6sk.r-1rnoaur.r-1sncvnh > div > div > div:nth-child(2) > div > div:nth-child(4) > input","PERFIL 4")
        await page.keyboard.press('Tab');
        await page.keyboard.press('Enter')
        page.waitForNetworkIdle

        //create FIFTH profile
        for (let index = 0; index < 5; index++) {
            await page.keyboard.press('Tab');
            await delay(200)
        }        
        await page.keyboard.press('Enter')
        page.waitForNetworkIdle
        await page.type("#root > div.css-175oi2r.r-13awgt0 > div > div.css-175oi2r.r-1p0dtai.r-eqz5dr.r-1d2f490.r-u8s1d.r-zchlnj.r-ipm5af > div.css-175oi2r.r-13awgt0 > div > div > div.css-175oi2r.r-13awgt0 > div:nth-child(4) > div.css-175oi2r.r-1p0dtai.r-1d2f490.r-u8s1d.r-zchlnj.r-ipm5af.r-12vffkv > div:nth-child(2) > div > div > div > div.css-175oi2r.r-13awgt0 > div > div.css-175oi2r.r-150rngu.r-eqz5dr.r-16y2uox.r-1wbh5a2.r-11yh6sk.r-1rnoaur.r-1sncvnh > div > div > div:nth-child(2) > div > div:nth-child(4) > input","PERFIL 5")
        await page.keyboard.press('Tab');
        await page.keyboard.press('Enter')
        page.waitForNetworkIdle
        

        page.waitForNetworkIdle
        await delay(30000)
     
    }
    // Cerrar el navegador
        await browser.close();
    //Mensajes de Despedida
    console.log('')
    console.log('')
    console.log('***********')
    console.log("Terminando proceso...");
    // browser.close();
    console.log("Termino correctamente");
}

main();
