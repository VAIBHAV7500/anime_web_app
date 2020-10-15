var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var helmet = require('helmet');
var db = require('./db');
var { updateList } = require('./lib/search');
const oAuth2Server = require('node-oauth2-server')

require('dotenv').config();
var indexRouter = require('./routes');
var authRouter = require('./routes/authRoutes');
var oAuthModel = require('./services/accessTokenModel');

var {
  anyError,
  errorHandler,
}  = require('./services/middleware')

global.connection = db.getConnection();

var app = express();
app.oauth = oAuth2Server({
  model: oAuthModel,
  grants: ['password'],
  debug: true
})
updateList(); // to load the search list

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use(helmet());

app.use('/', indexRouter);
app.use('/auth',authRouter);
app.post('/auth/login',app.oauth.grant());
app.post('/restrictedArea/enter',app.oauth.authorise(),(req,res)=>{res.json({message : "Successfully Entered"})});
app.use(app.oauth.errorHandler());

app.use(anyError);
app.use(errorHandler);

let port = process.env.PORT || 4200;
let host = process.env.HOST || 'localhost';
app.listen(port,host,()=>{
  console.log(`Started listening at http://${host}:${port}`);
});

module.exports = app;

