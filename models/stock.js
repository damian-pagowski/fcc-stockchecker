const mongoose = require('mongoose')

var stockSchema = new mongoose.Schema({
  name: { type: String, required: true },
  likes: { type: Number, required: true, default: 0 }
})

module.exports = mongoose.model('Stock', stockSchema)