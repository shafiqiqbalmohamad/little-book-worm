// using file system (fs) module
const fs = require("fs");

// require for puppeteer package
const puppeteer = require("puppeteer");

// require autoscroll down library
const { scrollPageToBottom } = require("puppeteer-autoscroll-down");

async function run() {
  // automate the browser opening, eg: open the google chrome
  const browser = await puppeteer.launch();

  // initialize the page, eg: open new tab in browser
  const page = await browser.newPage();

  // go to specific page, eg: key in url link
  await page.goto("https://www.littlebookworm.com.my/");

  // using scrollPageToBottom method
  await scrollPageToBottom(page);

  const products = await page.evaluate(() =>
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

  console.log(products);

  // save to json file
  fs.writeFile("products.json", JSON.stringify(products), (err) => {
    if (err) throw err;
    console.log("JSON file saved");
  });

  // close browser
  await browser.close();
}

run();
