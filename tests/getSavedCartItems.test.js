const getSavedCartItems = require('../helpers/getSavedCartItems');

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
  },
});

describe('4 - Teste a função getSavedCartItems', () => {
  it('Teste se, ao executar `getSavedCartItems`, o método `localStorage.getItem` é chamado', () => {
    getSavedCartItems();
    expect(localStorage.getItem).toBeCalled();
  })

  it('Teste se, ao executar `getSavedCartItems`, o método `localStorage.getItem` é chamado com o `cartItems` como parâmetro.', () => {
    expect(localStorage.getItem).toBeCalledWith('cartItems');
  })
});
