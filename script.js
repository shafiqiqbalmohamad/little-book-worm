// function from other reference: https://www.youtube.com/watch?v=NZ11jlEeZN8

const cartContainer = document.querySelector(".cart-container");
const productList = document.querySelector(".products-lists");
const cartList = document.querySelector(".cart-list");
const cartTotalValue = document.getElementById("cart-total-value");
const cartCountInfo = document.getElementById("cart-count-info");

let isFormAdded = false;

let cartItemID = 1;

eventListeners();

function eventListeners() {
  window.addEventListener("DOMContentLoaded", () => {
    loadJSON();
    loadCart();
  });
  // show or hide cart container
  document.getElementById("cart-btn").addEventListener("click", () => {
    cartContainer.classList.toggle("hidden");
  });

  productList.addEventListener("click", purchaseProduct);

  cartList.addEventListener("click", deleteProduct);
}

// update cart count info
function updateCartInfo() {
  let cartInfo = findCartInfo();
  // console.log(cartInfo);
  cartCountInfo.textContent = cartInfo.productCount;
  cartTotalValue.textContent = cartInfo.total;
}

updateCartInfo();

// start: function from web scraping section

// load product item
function loadJSON() {
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      let products = "";
      data.forEach((product) => {
        products += `
        <div class="product-list p-2.5">
            <img class="product-img w-64 ml-auto mr-auto block" src="${product.image}">
            <h4 class="product-name text-center pt-7 pb-5 font-semibold first-letter">Title: ${product.title}</h4>
            <p class="original-price pt-0 px-5 pb-5 text-center leading-5 line-through">${product.originalPrice}</p>
            <p class="offer-price pt-0 px-5 pb-5 text-center leading-5 text-blue-700">${product.offerPrice}</p>
            <div class="flex flex-col md:flex md:flex-row md:justify-center md:space-x-4">
                <a href="${product.url}">
                    <button class="bg-blue-700 text-white font-sans duration-500 px-8 py-2 mx-auto hover:bg-pink-500 rounded-md flex mb-2">Buy Now Online</button>
                </a>
                <a href="#">
                    <button class="add-to-cart-btn bg-green-600 text-white font-sans duration-500 px-8 py-2 mx-auto hover:bg-pink-500 rounded-md flex mb-2">WhatsApp Order</button>
                </a>
            </div>
        </div>
    `;
      });
      productList.innerHTML = products;
      // document.getElementById("products-lists").innerHTML = products;
    });
}

// navbar toggle menu function
function Menu(el) {
  let list = document.querySelector("#navList");
  el.name === "menu-outline"
    ? ((el.name = "close-outline"),
      list.classList.add("top-[80px]"),
      list.classList.add("opacity-100"))
    : ((el.name = "menu-outline"),
      list.classList.remove("top-[80px]"),
      list.classList.remove("opacity-100"));
}

// end: function from web scraping section

// function from other reference: https://www.youtube.com/watch?v=NZ11jlEeZN8

// purchase product
function purchaseProduct(ele) {
  if (ele.target.classList.contains("add-to-cart-btn")) {
    let product = ele.target.parentElement.parentElement.parentElement;
    // console.log(product);
    getProductInfo(product);
  }
}

// get product info after add to cart button is clicked
function getProductInfo(product) {
  let productInfo = {
    id: cartItemID,
    imgSrc: product.querySelector(".product-img").src,
    name: product.querySelector(".product-name").textContent,
    originalPrice: product.querySelector(".original-price").textContent,
    offerPrice: product.querySelector(".offer-price").textContent,
  };
  cartItemID++;
  // console.log(productInfo);
  addToCartList(productInfo);
  saveProductInStorage(productInfo);
  // try error for whatsapp function
  nameOfferPrice(productInfo);
}

// add selected product to cart list drop down
function addToCartList(product) {
  const cartItem = document.createElement("div");
  cartItem.classList.add("cart-item");
  cartItem.setAttribute("data-id", `${product.id}`);
  cartItem.innerHTML = `
    <div class="flex flex-1 justify-between">
      <img src = "${product.imgSrc}" alt = "product image" class="w-28" id="productImage">
      <div class="cart-item-info flex flex-col w-full">
          <h3 id="productName" class="cart-item-name">${product.name}</h3>
          <span id="originalPrice" class="cart-item-original-price line-through">${product.originalPrice}</span>
          <span id="offerPrice" class="cart-item-offer-price">${product.offerPrice}</span>
      </div>
      <button type="button" class="cart-item-del-btn right-4 top-12 py-0.5 px-2 text-xl text-gray-600">
          <ion-icon name="close-circle"></ion-icon>
      </button>
    </div>
  `;
  cartList.appendChild(cartItem);
}

// add form section to cart list
function addFormToCartList() {
  const form = document.createElement("form");
  form.action = "#";
  form.innerHTML = `
    <div class="container mx-auto px-2">
      <form class="mt-8">
          <div class="mb-2">
              <label class="block text-gray-600 text-base mb-2" for="customerName">
                  Customer Name
              </label>
              <input
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-slate-100"
                  id="customerName" type="text" placeholder="Enter your name" />
          </div>
          <div class="mb-2">
              <label class="block text-gray-600 text-base mb-2" for="customerPhone">
                  Customer Phone
              </label>
              <input
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-slate-100"
                  id="customerPhone" type="text" placeholder="Enter your phone number" />
          </div>
          <div class="mb-2">
              <label class="block text-gray-600 text-base mb-2" for="customerAddress">
                  Customer Address
              </label>
              <textarea
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-slate-100"
                  id="customerAddress" placeholder="Enter your address"></textarea>
          </div>
          <div class="mb-4">
              <label class="block text-gray-600 text-base mb-2" for="customerName">
                  Product Summary
              </label>
              <input
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-slate-100"
                  id="productSummary" type="text" placeholder="Product A , Color, Size, 1 unit" />
          </div>
          <div class="flex items-center justify-between mb-6">
              <button
                  class="bg-green-600 hover:bg-pink-500 text-white font-semibold py-2 px-2 rounded-md focus:outline-none focus:shadow-outline w-full"
                  type="submit" onclick="whatsApp()">
                  Confirm Order
              </button>
          </div>
      </form>
    </div>

  `;
  cartList.appendChild(form);
  isFormAdded = true;
}

// save product in local storage
// other local storage reference: https://www.youtube.com/watch?v=AUOzvFzdIk4
function saveProductInStorage(item) {
  let products = getProductFromStorage();
  // console.log(products);
  products.push(item);
  localStorage.setItem("products", JSON.stringify(products));
  updateCartInfo();
}

// getting product from local storage
function getProductFromStorage() {
  return localStorage.getItem("products")
    ? JSON.parse(localStorage.getItem("products"))
    : [];
}

// load cart product
function loadCart() {
  let products = getProductFromStorage();
  if (products.length < 1) {
    cartItemID = 1;
    // ID value if no any product in local storage
  } else {
    cartItemID = products[products.length - 1].id;
    cartItemID++;
    // else get the id of the last product
    // and increase it by 1
  }

  if (!isFormAdded) {
    addFormToCartList();
  }

  products.forEach((product) => addToCartList(product));

  // calculate and update UI and cart info
  updateCartInfo();
}

// calculate total price
// and other info
function findCartInfo() {
  let products = getProductFromStorage();
  // console.log(products);
  let total = products.reduce((acc, product) => {
    let price = parseFloat(product.offerPrice.substr(2));
    // remove RM sign
    return (acc += price);
  }, 0);
  // console.log(total);
  return {
    total: total.toFixed(2),
    productCount: products.length,
  };
}

// delete product at cart list
// delete product at local storage
function deleteProduct(elem) {
  // console.log(elem.target.parentElement.parentElement.parentElement);
  let cartItem;
  if (elem.target.parentElement.tagName === "BUTTON") {
    cartItem = elem.target.parentElement.parentElement.parentElement;
    cartItem.remove();
  } else if (elem.target.parentElement.tagname === "ION-ICON") {
    cartItem =
      elem.target.parentElement.parentElement.parentElement.parentElement;
    cartItem.remove();
  }
  // remove from DOM cart only
  // cartItem.remove();
  // console.log(cartItem);

  let products = getProductFromStorage();
  let updatedProducts = products.filter((product) => {
    return product.id != parseInt(cartItem.dataset.id);
  });
  // updating the product after deletion
  localStorage.setItem("products", JSON.stringify(updatedProducts));

  updateCartInfo();

  // console.log(products);
  // console.log(updatedProducts);
}

// try error for whatsapp function
// function nameOfferPrice(productInfo) {
//   let nameWhatsApp = productInfo.name;
//   let offerPriceWhatsApp = productInfo.offerPrice;
//   whatsApp(nameWhatsApp, offerPriceWhatsApp);
// }

function nameOfferPrice(productInfo) {
  let name = productInfo.name;
  let offerPrice = productInfo.offerPrice;
  return "Name of Product: " + name + "%0aOffer Price: " + offerPrice + "%0a";
}

// whatsapp reference: https://www.youtube.com/watch?v=2ofv2_tJvoM
function whatsApp() {
  const customerName = document.getElementById("customerName").value;
  const customerPhone = document.getElementById("customerPhone").value;
  const customerAddress = document.getElementById("customerAddress").value;
  const productSummary = document.getElementById("productSummary").value;

  // Get the products from the local storage
  const products = JSON.parse(localStorage.getItem("products")) || [];

  let message = `Hi, I want to order:\n\n`;

  let totalPrice = 0; // initialize total price to zero

  // Loop through the products and add their details to the message
  products.forEach((product, index) => {
    const productName = product.name;
    const offerPrice = product.offerPrice;

    message += `Product ${index + 1}:\n`;
    message += `Product: ${productName}\n`;
    message += `Price: ${offerPrice}\n\n`;

    totalPrice += parseFloat(offerPrice.substr(2)); // add the offerPrice to the totalPrice
  });

  message += `Total Price: ${totalPrice.toFixed(2)}\n`; // add the totalPrice to the message

  message += `Name: ${customerName}\nPhone: ${customerPhone}\nAddress: ${customerAddress}\nSummary: ${productSummary}\n\n`;

  const encodedMessage = encodeURIComponent(message);

  window.open(`https://wa.me/${60132349717}?text=${encodedMessage}`, "_blank");
}
