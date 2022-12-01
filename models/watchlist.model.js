const { model, Schema } = require('mongoose');

const watchlistSchema = new Schema({
    name: String,
    description: String,
    coinIds: [String]
  });


  const watchlist = model('watchlist', watchlistSchema)

  module.exports = watchlist
