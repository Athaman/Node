var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/show/:category', function(req, res, next){
  var posts = db.get('posts');

  posts.find({category: req.params.category}, {}, function(err, posts){
    res.render('index', {
      'title': req.params.category,
      'posts': posts
    });
  });
});
router.get('/add', function(req, res, next) {
  var categories = db.get('categories');

  categories.find({}, {}, function(err, categories){
    res.render('categories', {
      'title': 'Add Category'
    });
  });
});

router.post('/add', function(req, res, next) {
  // get the name of the category

  var name = req.body.name;

  // validate the form
  req.checkBody('name', 'Name field is required').notEmpty();

  // check errors

  var errors = req.validationErrors();

  if(errors){
    res.render('addpost',{
      "errors": errors
    });
  } else{
    var categories = db.get('categories');
    categories.insert({
      "name": name,

    }, function(err, post){
      if(err){
        res.send(err);
      } else{
        req.flash('success', 'Category Added');
        res.location('/');
        res.redirect('/');
      }
    });
  }
});

module.exports = router;
