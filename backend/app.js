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
var oAuthModel = require('./services/accessTokenModel');
var app = express();
app.oauth = oAuth2Server({
  model: oAuthModel,
  grants: ['password'],
  debug: true
})
var {
  anyError,
  errorHandler,
}  = require('./services/middleware');

/* -------------------------------------------------------------------------- */
/*                          Routers Declaration Start                         */
/* -------------------------------------------------------------------------- */

var indexRouter = require('./routes');
var authRouter = require('./routes/authRoutes')(app);
var restrictedAreaRouter = require('./routes/restrictedArea')(app);


/* -------------------------------------------------------------------------- */
/*                           Routers Declaration End                          */
/* -------------------------------------------------------------------------- */

global.connection = db.getConnection();

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
app.use('/restrictedArea',restrictedAreaRouter)

app.use(app.oauth.errorHandler());
app.use(anyError);
app.use(errorHandler);

let port = process.env.PORT || 4200;
let host = process.env.HOST || 'localhost';
app.listen(port,host,()=>{
  console.log(`Started listening at http://${host}:${port}`);
});

module.exports = app;

