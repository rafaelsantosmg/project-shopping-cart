const fetchProducts = (category) => {
  const error = new Error('You must provide an url');
  if (!category) return error.message;
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${category}`)
    .then((response) => response.json())
    .then((data) => data);
};

if (typeof module !== 'undefined') module.exports = { fetchProducts };
