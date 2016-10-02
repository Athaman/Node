var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
var multer = require('multer');
var upload = multer({dest: './public/images/portfolio'});

// route files
var routes = require('./routes/index');
var admin = require('./routes/admin');

// init app
var app = express();

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extende: false }));

// handle sessions
app.use(session({
  secret:'secret',
  saveUninitialized: true,
  resave: true
}));

// validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespae = param.split('.')
    , root = namspace.shift()
    , formParam = root;

    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return{
      param : formParam,
      msg : msg,
      value : value
    };
  }
}));

// public folder
app.use(express.static(path.join(__dirname, 'public')));

// view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// connect flash
app.use(flash());

app.use('/', routes);
app.use('/admin', admin);

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
  console.log('Server started on port: ' +app.get('port'));
});
