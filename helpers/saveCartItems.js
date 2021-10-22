const saveCartItems = (productCart) => {
  localStorage.setItem('cartItems', productCart);
};

if (typeof module !== 'undefined') {
  module.exports = saveCartItems;
}
