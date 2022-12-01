var express = require('express');
var router = express.Router();
const bcryptjs = require('bcryptjs')
const User =  require('../models/user.model');



router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  res.render('login.hbs');
});

router.post('/login',(req,res,next) => {
  if(!req.body.email || ! req.body.password){
    res.render('login.hbs', {message : "Both fields are required!"})
    return;
  }
User.findOne({ email: req.body.email})
    .then((foundUser) => {
    if(!foundUser){
      res.render('login.hbs', {message: "This User does not exist!"})
        return;
    } 
    else {
      const isValidPassword = bcryptjs.compareSync(req.body.password, foundUser.password)
      if(isValidPassword) {
          req.session.user = foundUser;
          res.render('index', {message: "Succesfully logged in!"})
      }
      else {
        res.render('login.hbs', {message: "Incorrect Password or Email!"})
      }
    }
    })
    .catch(err => {
        res.send(err);
})
})



router.get('/signup', function(req, res, next) {
  res.render('signup.hbs');
});

router.post('/signup', function(req, res, next) {
  if(!req.body.email || ! req.body.password){
    res.send('Sorry you forgot an email or password');
    return;
  }

  User.findOne({ email: req.body.email })
    .then(foundUser => {
      if(foundUser){
        res.render("signup", {message: "Sorry this user already exists"});
        return;
      }

      const myHashedPassword = bcryptjs.hashSync(req.body.password)

      return User.create({
        email: req.body.email,
        password: myHashedPassword,
      })
      
    })
    .then(createdUser => {
      console.log("here's the new user", createdUser);
      res.redirect('/')
    })
    res.redirect('/')
    .catch(err => {
      console.log(err);
      res.send(err);
    })
});

router.get('/logout', (req,res,next) =>{
  req.session.destroy(() => {
    res.redirect('/')
  })
})



module.exports = router;
