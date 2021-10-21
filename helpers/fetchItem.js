const fetchItem = (itemId) => {
  const error = new Error('You must provide an url');
  if (!itemId) return error.message;
  return fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => err);
};

if (typeof module !== 'undefined') module.exports = { fetchItem };
