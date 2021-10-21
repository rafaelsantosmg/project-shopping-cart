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

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getCartList = document.querySelector('.cart__items');
const getProductCart = async (sku) => {
  const data = await fetchItem(sku);
  const { title: name, price: salePrice } = data;
  getCartList.appendChild(createCartItemElement({ sku, name, salePrice }));
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const getSelectSectionItems = document.querySelector('.items');

const createProducts = async (fetchProducts) => {
  try {
    const data = await fetchProducts;
    data.results.forEach((product) => {
      const { id: sku, title: name, thumbnail: image } = product;
      getSelectSectionItems.appendChild(createProductItemElement({ sku, name, image }));
    });
  } catch (err) {
    console.log(err);
  }
};

window.onload = () => {
  createProducts(fetchProducts('computador'));
  // addProductToCart();
};
