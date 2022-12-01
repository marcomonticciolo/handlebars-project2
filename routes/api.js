var express = require('express');
var router = express.Router();
const watchlist = require('../models/watchlist.model');
let newArray;

router.get("/charts", (req, res) => {  
fetch("https://api.coincap.io/v2/assets")
    .then(data => data.json())
    .then(json => {
        newArray = json.data.map((e) => {
            return {
                ...e,
                supply: Number(e.supply).toFixed(2),
                marketCapUsd: Number(e.marketCapUsd).toFixed(2),
                priceUsd: Number(e.priceUsd).toFixed(2),
                changePercent24Hr: Number(e.changePercent24Hr).toFixed(2)
            }
        })
        return watchlist.find()
    })
    .then(foundWatchlistArray => {
        res.render("charts", {charts: newArray, watchlists: foundWatchlistArray});
    })
    .catch((err) => {
        res.send(err);
    });
  });












module.exports = router;
