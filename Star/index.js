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
    const data = await fs.promises.readFile('./star.csv', 'utf-8');

    // Convertir el contenido del archivo a un arreglo de filas
    const rows = data.split('\n');
     //Mensajes de bienvenida
     console.log('Bienvenido a Premium y Codigos Netflix Checker')
     console.log('Iniciamos proceso');
     console.log('***********')
     console.log('')
     console.log('')

    // Recorrer cada fila del archivo
    for (const row of rows) {
        // Inicializar Puppeteer
        const browser = await puppeteer.launch({ 
            headless: false
         });
        const page = await browser.newPage();

        // Separar las columnas de la fila
        const columns = row.split(',');

        // Definimos email y password
        const [accEmail,accPassword] = columns

        //Iniciamos proceso
        await page.goto("https://www.starplus.com/es-419/login",
        {
            waitUntil:'networkidle0'
        })

        //Ingresamos Email
        await page.type("#email",accEmail)
        await page.click("#dssLogin > div:nth-child(4) > button")

        //Ingresamos Password
        try {
            await page.waitForSelector("#password")
            await page.type("#password",accPassword)
            await page.click("#dssLogin > div > button")
        } catch (error) {
            {}
        }

        //Suspendido
        await page.waitForNetworkIdle()
        const url = await page.url();
        if (url == "https://www.starplus.com/es-419/restart-subscription") {
            await page.waitForSelector("#section_index > div > div:nth-child(2) > div > div > div.sc-GMQeP.fjHChO.noAnimations > h2",{timeout:5000})
            await page.$eval("#section_index > div > div:nth-child(2) > div > div > div.sc-GMQeP.fjHChO.noAnimations > h2", el => el.textContent);
            console.log(`${accEmail}: Suspendido`)
            addCsv(accEmail,'Suspendido')
            await browser.close();
            continue       
        }
        
        //Codigo en email
        try {
            await page.waitForSelector("#onboarding_index > div > div",{timeout:5000});
            const code = await page.$eval("#onboarding_index > div > div", el => el.textContent);
            console.log(`${accEmail}: Revisar Manualmente`);
            addCsv(email,'Revisar Manualmente');
            await browser.close();
            continue;
        } catch (error){
            {}
        }

        //Pass Error
        try {
            await page.waitForSelector("#password__error", {timeout:3000})
            var passErr = await page.$eval("#password__error", el => el.textContent);
            console.log(`${accEmail}: ${passErr}`)
            addCsv(accEmail,passErr)
            await browser.close();
            continue
        } catch (error) {
            {}
        }

        //Ingresar al perfil
        try {
            await page.waitForSelector("#remove-main-padding_index > div > div > section > h2",{timeout:3000})
            await page.keyboard.press('Tab')
            await page.keyboard.press('Tab')
            await page.keyboard.press('Tab')
            await page.keyboard.press('Enter')
            // await page.waitForSelector("#remove-main-padding_index > div > div > section > ul > div:nth-child(1) > div > div")
            // await page.click("#remove-main-padding_index > div > div > section > ul > div:nth-child(1) > div > div")
        } catch (error) {
            {}
        }

        //Ingresa a Detalles de cuenta
        try {
            await page.waitForSelector("#nav-list > span:nth-child(2) > a > span > svg > path", {timeout:3000})
            const active = "Activo"
            console.log(`${accEmail}: ${active}`)
            addCsv(accEmail,active)
            await browser.close();
            continue
        } catch (error) {
            {}
        }

        

        // Cerrar el navegador
        console.log(`${accEmail}: Revisar manualmente`)
        addCsv(accEmail,"Revisar manualmente")
        await browser.close();
    }
    //Mensajes de Despedida
    console.log('')
    console.log('')
    console.log('***********')
    console.log("Terminando proceso...");
    console.log("Termino correctamente");
}

main();
