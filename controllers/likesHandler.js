const Stock = require('../models/stock')

module.exports = {
  getLikes: function (data, increment) {
    console.log(
      'get likes called with params: ' +
        JSON.stringify(data) +
        ' and  ' +
        data.updatLikes
    )
    return Stock.findOne({ name: data.stock }).then(res => {
      if (res) {
        console.log('DB QUERY RESULT: ' + JSON.stringify(res))
        if (data.updatLikes) {
          res
            .handleLike(data.ip)
            .then(
              updated =>
                updated
                  ? { ...data, likes: updated.likes }
                  : { ...data, likes: res.likes }
            )
        } else {
          return { ...data, likes: res.likes }
        }
      } else {
        new Stock({
          name: data.stock,
          likes: data.updatLikes ? 1 : 0,
          ips: data.updatLikes ? [data.ip] : []
        })
          .save()
          .then(doc => ({ ...data, likes: doc.likes }))
      }
    })
  }
}
