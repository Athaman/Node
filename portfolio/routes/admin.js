var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './public/images/portfolio'});
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'whargarbl',
  database: 'portfolio'
});

connection.connect();

router.get('/', function(req, res, next){
  connection.query("SELECT * FROM projects", function(err, rows, fields){
    if(err) throw err;
    res.render('admin/index',{
      "projects": rows
    });
  });
});

router.get('/add', function(req, res, next){
  res.render('admin/add')
});

router.post('/add', upload.single('projectimage'), function(req, res, next){
  // get the form variables
  var title = req.body.title;
  var description = req.body.description;
  var service = req.body.service;
  var url = req.body.url;
  var client = req.body.client;
  var projectdate = req.body.projectdate;

  // check the image upload
  if(req.file){
    var projectImageName = req.file.filename;
  }else{
    var projectImageName = 'noimage.jpg';
  }

  // validate form
  req.checkBody('title', 'Title field is required');
  req.checkBody('service', 'Service field is required');

  var errors = req.validationErrors();

  if(errors){
    res.render('admin/add',{
      errors: errors,
      title: title,
      description: description,
      service: service,
      client: client,
      url: url
    });
  }else{
    var project ={
      title: title,
      description: description,
      service: service,
      client: client,
      date: projectdate,
      url: url,
      image: projectImageName
    };
  }

  var query = connection.query('INSERT INTO projects SET ?', project, function(err, result){
    console.log('Error: ' +err);
    console.log('Success: '+result);
  });

  req.flash('success_msg', 'Project Added');

  res.redirect('/admin');

});

router.get('/edit/:id', function(req, res, next){
  connection.query("SELECT * FROM projects WHERE id = ?", req.params.id, function(error, rows, fields){
    if(error) throw error;
    res.render('admin/edit',{
      "project": rows[0]
    });
  });
});

router.post('/edit/:i', upload.single('projectimage'), function(req, res, next){
  // get the form variables
  var title = req.body.title;
  var description = req.body.description;
  var service = req.body.service;
  var url = req.body.url;
  var client = req.body.client;
  var projectdate = req.body.projectdate;

  // validate form
  req.checkBody('title', 'Title field is required');
  req.checkBody('service', 'Service field is required');

  var errors = req.validationErrors();

  if(errors){
    res.render('admin/add',{
      errors: errors,
      title: title,
      description: description,
      service: service,
      client: client,
      url: url
    });
  }else{
    var project ={
      title: title,
      description: description,
      service: service,
      client: client,
      date: projectdate,
      url: url,
    };
    // check the image upload
    if(req.file){
      project.image = req.file.filename;
    }

  }

  var query = connection.query('UPDATE projects SET ? WHERE id = '+req.params.id, project, function(err, result){
    console.log('Error: ' +err);
    console.log('Success: '+result);
  });

  req.flash('success_msg', 'Project Updated');

  res.redirect('/admin');

});

router.delete('/delete/:id', function(req, res){
  connection.query('DELETE FROM projects WHERE id = '+req.params.id, function(error, result){
    if(error) throw error;
    console.log('deleted '+ result.affectedRows + ' rows');
  });
  req.flash('success_msg', "Project Deleted");
  res.sendStatus(200);
});

module.exports = router;
