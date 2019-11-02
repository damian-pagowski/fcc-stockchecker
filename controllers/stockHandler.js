const request = require('request-promise')

module.exports = {
  getData: function (symbol) {
    return request({
      uri: 'https://repeated-alpaca.glitch.me/v1/stock/' + symbol + '/quote',
      json: true
    })
  },

  extractPrice: function (data) {
    return { price: data.latestPrice, stock: data.symbol }
  }
}
