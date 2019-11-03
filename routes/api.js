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
  app.route('/api/test').get(function (req, res) {
    const { stock, ip } = req.query
    const addr = req.ip
    console.log(
      addr +
        ' / ' +
        req.ips +
        ' / ' +
        req.connection.remoteAddress +
        ' / ' +
        req.headers['x-forwarded-for']
    )
    const Stock = require('../models/stock')
    Stock.findOne({ name: stock }).then(found =>
      found.handleLike(ip).then(updated => res.json(updated))
    )
  }), app.route('/api/stock-prices').get(function (req, res) {
    const { stock, like } = req.query
    const { ip } = req
    console.log('LIKE : ' + like)
    const tasks = []

    // TODO
    // Set the content security policies to only allow loading of scripts and CSS from your server.

    async function runTask (fun, param1) {
      return fun(param1)
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
        if (like) {
          console.log('LIKE TASK ADDED: ')
          tasks.push(
            runTask(
              likesDb.getLikes,
              { stock: symbol, updatLikes: true, ip }
            )
          )
        }
        tasks.push(runTask(getSingleStockData, symbol))
      })
    } else {
      if (like) {
        tasks.push(
          runTask(likesDb.getLikes, { stock, updatLikes: true, ip })
        )
      }
      tasks.push(runTask(getSingleStockData, stock))
    }
    // execute tasks
    Promise.all(tasks).then(results => {
      console.log('Results: ' + JSON.stringify(results))
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
