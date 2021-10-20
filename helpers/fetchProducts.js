const fetchProducts = async (param) => {
  const error = new Error('You must provide an url');
  if (!param) {
    return error.message;
  }
  try {
    const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${param}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console(err);
  }
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchProducts,
  };
}
