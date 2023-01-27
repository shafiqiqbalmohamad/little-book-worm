// using file system (fs) module
const fs = require("fs");

// require puppeteer package
const puppeteer = require("puppeteer");

const { scrollPageToBottom } = require("puppeteer-autoscroll-down");

async function run() {
  // open browser programmatically
  const browser = await puppeteer.launch();

  // initialize the page
  const page = await browser.newPage();

  // go to specific page
  await page.goto("https://www.littlebookworm.com.my/");
  // await page.goto("https://www.littlebookworm.com.my/", {
  //   waitUntil: "networkidle2",
  // });

  // await page.goto("https://www.littlebookworm.com.my/", {
  //   waitUntil: "networkidle2",
  //   timeout: 60000,
  // });

  await scrollPageToBottom(page);

  // await page.goto("https://www.littlebookworm.com.my/");
  // await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30000 });

  // create full page screenshot of the page
  // await page.screenshot({ path: "littlebookworm.png", fullPage: true });

  // obtaining entire html content of the page
  // const html = await page.content();
  // console.log(html);

  const books = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(".sc-product .sc-product-container"),
      (e) => ({
        image: e.querySelector(".sc-img-product a img").src,
        title: e.querySelector(".sc-info .product-name a").title,
        originalPrice: e.querySelector(".sc-info .sc-price .price-old")
          .innerText,
        offerPrice: e.querySelector(".sc-info .sc-price .price-new").innerText,
        url: e.querySelector(".sc-img-product a").href,
      })
    )
  );

  console.log(books);

  fs.writeFile("books.json", JSON.stringify(books), (err) => {
    if (err) throw err;
    console.log("JSON file saved");
  });

  // close browser
  await browser.close();
}

run();
