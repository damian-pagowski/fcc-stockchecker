/*
*
*
*       Complete the API routing below
*
*
*/

'use strict'

// const expect = require('chai').expect
// const request = require('request-promise')
const CONNECTION_STRING = process.env.MONGOLAB_URI
// const Stock = require('../models/stock')
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
    // add tasks
    tasks.push(
      like
        ? runTask(likesDb.getLikesWithIncrement, { stock })
        : runTask(likesDb.getLikes, { stock })
    )
    tasks.push(runTask(getSingleStockData, stock))
    // execute tasks
    Promise.all(tasks).then(results =>
      res.json({ stockData: results.filter(x => x)[0] })
    )
  })
}
