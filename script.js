const getElementPrice = document.querySelector('.total-price');
const getSelectSectionItems = document.querySelector('.items');
const getCartList = document.querySelector('.cart__items');
const getButtonClear = document.querySelector('.empty-cart');
const getLoading = document.querySelector('.loading');

const messageLoader = (message, remove) => {
  if (remove) return getLoading.remove();
  getLoading.innerHTML = message;
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
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
  getElementPrice.innerHTML = price; // .toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
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
  li.className = 'cart__item';
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
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const createButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  createButton.addEventListener('click', () => getProductCart(sku));
  section.appendChild(createButton);

  return section;
}

const createProducts = async (fetchProducts) => {
  messageLoader('carregando');
  try {
    const data = await fetchProducts;
    data.results.forEach((product) => {
      const { id: sku, title: name, thumbnail: image } = product;
      getSelectSectionItems.appendChild(createProductItemElement({ sku, name, image }));
      messageLoader('', true);
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
  getElementPrice.innerHTML = '';
});

window.onload = () => {
  createProducts(fetchProducts('computador'));
  if (getSavedCartItems() === undefined || getSavedCartItems() === null) {
    return localStorage.setItem('cartItems', JSON.stringify([]));
  }
  getStorage();
};
