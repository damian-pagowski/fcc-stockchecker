const Stock = require('../models/stock')

module.exports = {
  getLikes: function (data) {
    return Stock.findOne({ name: data.stock }).then(
      res =>
        res
          ? { ...data, likes: res.likes }
          : new Stock({ name: data.stock, likes: 0 })
              .save()
              .then(doc => ({ ...data, likes: 0 }))
    )
  },
  getLikesWithIncrement: function (data) {
    return Stock.findOne({ name: data.stock }).then(res => {
      if (res) {
        res.likes += 1
        res.save().then(res => ({ ...data, likes: res.likes }))
      } else {
        new Stock({ name: data.stock, likes: 1 })
          .save()
          .then(doc => ({ ...data, likes: 0 }))
      }
    })
  }
}
