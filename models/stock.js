const mongoose = require('mongoose')

var StockSchema = new mongoose.Schema({
  name: { type: String, required: true },
  likes: { type: Number, required: true, default: 0 },
  ips: {
    type: [String],
    required:true,
    default: []
  }
})
StockSchema.methods.handleLike = function(ipAddr){
  const that = this;
  if (! this.ips.includes(ipAddr)){
    this.ips.push(ipAddr)
    this.likes +=1
    return this.save()
  }
  return new Promise(function(resolve, reject) {resolve(that)});
}
module.exports = mongoose.model('Stock', StockSchema)
