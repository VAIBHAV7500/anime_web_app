const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./db');
const { updateList } = require('./lib/search');
const { logger } = require('./lib/logger');
const oAuth2Server = require('node-oauth2-server')
const oAuthModel = require('./services/accessTokenModel');
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');

var app = express();
app.oauth = oAuth2Server({
  model: oAuthModel,
  grants: ['password'],
  debug: true
})
var { anyError, errorHandler, }  = require('./services/middleware');
require('dotenv').config();

// app.use(expressCspHeader({
//   directives: {
//       'default-src': [SELF, INLINE],
//       'script-src': [SELF, INLINE, '*'],
//       'style-src': [SELF, INLINE],
//       'img-src': [SELF , '*', 'data:image/png'],
//       'worker-src': [NONE],
//       'block-all-mixed-content': true
//   }
// }));

/* -------------------------------------------------------------------------- */
/*                          Routers Declaration Start                         */
/* -------------------------------------------------------------------------- */

var indexRouter = require('./routes');
var authRouter = require('./routes/authRoutes')(app);
var restrictedAreaRouter = require('./routes/restrictedArea')(app);
var apiRouter = require('./routes/api');

/* -------------------------------------------------------------------------- */
/*                           Routers Declaration End                          */
/* -------------------------------------------------------------------------- */

global.connection = db.getConnection();

updateList(); // to load the search list

// view engine setup
/*app.set('views', path.join(__dirname, 'views'));*/
app.set('view engine', 'jade');
//app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, 'build')));
}else{
  app.use(express.static(path.join(__dirname, 'public')));
}
app.use(cors());
app.use(helmet());

const getMorganFormat = () =>
  JSON.stringify({
    method: ':method',
    url: ':url',
    http_version: ':http-version',
    remote_address: ':remote-addr',
    remote_user: ':remote-user',
    response_time: ':response-time',
    referrer: ':referrer',
    status: ':status',
    content_length: ':res[content-length]',
    timestamp: ':date[iso]',
  });

app.use(
  morgan(getMorganFormat(), {
    stream: logger.stream,
  })
);

app.use('/auth',authRouter);
app.use('/restrictedArea',restrictedAreaRouter)
app.use('/api', apiRouter);
app.use(app.oauth.errorHandler());
if(process.env.NODE_ENV === "production"){
  console.log('here');
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('/*', function (req, res) {
    console.log('check');
    console.log(path.resolve(__dirname, 'build', 'index.html'));
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
  
}else{
  app.use('/', indexRouter);
}
app.use(anyError);
app.use(errorHandler);

let port = process.env.PORT || 4200;
let host = process.env.HOST || 'localhost';
app.listen(port,host,()=>{
  console.log(`Started listening at http://${host}:${port}`);
});

module.exports = app;

