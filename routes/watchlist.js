var express = require('express');
var router = express.Router();
const watchlist = require('../models/watchlist.model');



router.get("/create-watchlist", (req,res,next) => {
    res.render("create-watchlist")
})

router.get('/watchlists', (req,res,next) => {
    watchlist.find()
      .then(createdWatchlistArray =>{
        res.render('watchlists', { createdWatchlistArray })
      })
      .catch(err => {
        console.log(err);
        res.send(err);
      })
})

router.get('/watchlists', (req,res,next) => {
    watchlist.find(req.params.name)
      .then(createdWatchlistArray =>{
        res.render('charts', { createdWatchlistArray })
      })
      .catch(err => {
        console.log(err);
        res.send(err);
      })
})


router.post('/create-watchlist',(req,res,next) =>{
    watchlist.create({
      name: req.body.name,
      description: req.body.description,
    })
    .then(createdWatchlist =>{
      res.redirect('/watchlist/watchlists')
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    })
  })


router.get('/watchlists/:id/', (req,res,next) => {
    
    let foundWatchlistName;

    watchlist.findById(req.params.id)
      .then(foundWatchlist =>{
        foundWatchlistName = foundWatchlist.name
        if(!foundWatchlist.coinIds.length){
            return Promise.reject('No coins in watchlist')
        }
        return fetch('https://api.coincap.io/v2/assets?ids=' + foundWatchlist.coinIds.join(','))
        })
      .then(fetchResponse => fetchResponse.json())
      .then(json => {       
        let newCoinArray = json.data.map((e) => {
            return {
                ...e,
                supply: Number(e.supply).toFixed(2),
                marketCapUsd: Number(e.marketCapUsd).toFixed(2),
                priceUsd: Number(e.priceUsd).toFixed(2),
                changePercent24Hr: Number(e.changePercent24Hr).toFixed(2),
                watchId: req.params.id
            }
        })
        console.log("NEW COIN", newCoinArray)
        
        res.render('created-watchlists.hbs', { charts: newCoinArray, foundWatchlistName })
        
        
      })
      .catch(err => {
        console.log(err);
        res.render('error.hbs', { message: err })
      })

})

  router.post("/watchlists/:id/",(req, res) => {
    watchlist.remove({ _id: req.params.id})
    .then((count) => {
      console.log(count)
      res.redirect("/watchlist/watchlists");
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post('/add/:coinId',(req,res,next) =>{
    watchlist.findByIdAndUpdate(req.body.watchlistId, {
        $push: {
            coinIds: req.params.coinId
        }
    }, {new: true})
    .then(updatedWatchlist =>{
      res.send(updatedWatchlist)
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    })
  })

  router.post("/remove-coin/:watchlistId/:coinId/",(req, res) => {

    watchlist.findByIdAndUpdate(req.params.watchlistId, {
        $pull: {
            coinIds: req.params.coinId
        }
    }, { new: true })
    .then((foundWatchlist) => {
      console.log(foundWatchlist)
      res.redirect(`/watchlist/watchlists/${req.params.watchlistId}`);
    })
    .catch((err) => {
      res.send(err);
    });
});




module.exports = router
