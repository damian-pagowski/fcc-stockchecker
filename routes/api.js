/*
*
*
*       Complete the API routing below
*
*
*/

'use strict'

const CONNECTION_STRING = process.env.MONGOLAB_URI
const mongoose = require('mongoose')
mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true })
const stocksHandler = require('../controllers/stockHandler')
const likesDb = require('../controllers/likesHandler')

module.exports = function (app) {
  app.route('/api/stock-prices').get(function (req, res) {
    const { stock, like } = req.query
    const tasks = []
    async function runTask (fun, params) {
      return fun(params)
    }

    const getSingleStockData = stockCode =>
      stocksHandler
        .getData(stockCode)
        .then(data => likesDb.getLikes(stocksHandler.extractPrice(data)))

    const calculateRelLikes = stocks => {
      let stock1 = stocks[0]
      let stock2 = stocks[1]
      stock1.rel_likes = stock1.likes - stock2.likes
      stock2.rel_likes = stock2.likes - stock1.likes
      delete stock1.likes
      delete stock2.likes
      return [stock1, stock2]
    }

    // add tasks
    if (Array.isArray(stock)) {
      stock.forEach(symbol => {
        tasks.push(runTask(getSingleStockData, symbol))
        if (like) {
          tasks.push(runTask(likesDb.getLikesWithIncrement, { stock: symbol }))
        }
      })
    } else {
      tasks.push(runTask(getSingleStockData, stock))
      tasks.push(runTask(likesDb.getLikesWithIncrement, { stock }))
    }
    // execute tasks
    Promise.all(tasks).then(results => {
      console.log(JSON.stringify(results))
      let data = results.filter(r => r != null)
      res.json({
        stockData:
          data.length == 2
            ? calculateRelLikes(data)
            : data.length == 1 ? data[0] : data
      })
    })
  })
}
