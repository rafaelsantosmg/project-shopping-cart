const getElementPrice = document.querySelector('.total-price');
const getSelectSectionItems = document.querySelector('.card-container');
const getCartList = document.querySelector('.cart__items');
const getButtonClear = document.querySelector('.empty-cart');
const getLoading = document.querySelector('.spinner-border');

const messageLoader = (remove) => {
  if (remove) return getLoading.remove();
  return getLoading;
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'card-img-top';
  img.style.width = '10rem';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const getPriceProduct = (storage) => {
  const price = storage.reduce((acc, product) => acc + product.salePrice, 0);
  getElementPrice.innerHTML = price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
};

function cartItemClickListener(event, sku) {
  event.target.remove();
  const storage = JSON.parse(localStorage.getItem('cartItems'));
  const findCartProduct = storage.find((product) => product.sku === sku);
  const findCartIndex = storage.indexOf(findCartProduct);
  storage.splice(findCartIndex, 1);
  getPriceProduct(storage);
  saveCartItems(JSON.stringify(storage));
}

function createCartItemElement({ sku, name, salePrice }) {  
  const li = document.createElement('li');
  li.className = 'list-group-item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event, sku));
  return li;
}

const getProductCart = async (sku) => {
  const storage = JSON.parse(getSavedCartItems()) || [];
  const data = await fetchItem(sku);
  const { title: name, price: salePrice } = data;
  getCartList.appendChild(createCartItemElement({ sku, name, salePrice }));
  storage.push({ sku, name, salePrice });
  getPriceProduct(storage);
  saveCartItems(JSON.stringify(storage));
};

function createProductItemElement({ sku, name, image }) {
  const divCard = document.createElement('div');
  const divBody = document.createElement('div');
  divCard.className = 'card';
  divCard.style.width = '14rem';
  divCard.style.margin = '5px';
  divCard.style.padding = '3px 0 10px 0';
  divCard.style.alignItems = 'center';
  divBody.className = 'card-body';
  divBody.appendChild(createCustomElement('p', 'card-text', sku));
  divBody.appendChild(createCustomElement('h5', 'card-title', name));
  const createButton = createCustomElement('button', 'btn btn-success', 'Adicionar ao carrinho!');
  createButton.addEventListener('click', () => getProductCart(sku));
  divCard.appendChild(createProductImageElement(image));
  divCard.appendChild(divBody);
  divCard.appendChild(createButton);

  return divCard;
}

const createProducts = async (fetchProducts) => {
  messageLoader();
  try {
    const data = await fetchProducts;
    data.results.forEach((product) => {
      const { id: sku, title: name, thumbnail: image } = product;
      getSelectSectionItems.appendChild(createProductItemElement({ sku, name, image }));
      messageLoader(true);
    });
  } catch (err) {
    console.log(err);
  }
};

const getStorage = () => {
  const storage = JSON.parse(getSavedCartItems());
  storage.forEach((product) => getCartList.appendChild(createCartItemElement(product)));
  getPriceProduct(storage);
};

getButtonClear.addEventListener('click', () => {
  localStorage.removeItem('cartItems');
  localStorage.removeItem('price');
  getCartList.innerHTML = '';
  getElementPrice.innerHTML = 'R$ 0,00';
});

window.onload = () => {
  createProducts(fetchProducts('computador'));
  if (getSavedCartItems() === undefined || getSavedCartItems() === null) {
    return localStorage.setItem('cartItems', JSON.stringify([]));
  }
  getStorage();
};
