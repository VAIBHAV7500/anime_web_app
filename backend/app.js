const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const hsts = require('hsts');
const db = require('./db');
const { updateList } = require('./lib/search');
const { logger } = require('./lib/logger');
const oAuth2Server = require('node-oauth2-server')
const oAuthModel = require('./services/accessTokenModel');
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');
const WebSocket = require('ws');
const fs = require('fs');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const connectEnsureLogin = require('connect-ensure-login');
const keys = require('./config/keys.json');
const dbConfig = require('./config/dbConfig.json');

var app = express();
app.oauth = oAuth2Server({
  model: oAuthModel,
  grants: ['password'],
  debug: true
})
var { anyError, errorHandler, }  = require('./services/middleware');
require('dotenv').config();

// if(process.env.NODE_ENV === "production"){
//   app.use(expressCspHeader({
//    directives: {
//       'default-src': ['*'],
//       'script-src': ['*'],
//        'style-src': ['*'],
//       'img-src': [SELF , '*'],
//       'worker-src': ['*'],
//       'block-all-mixed-content': false
//   }
// }));
// }

if(process.env.NODE_ENV === "production"){
  app.use(hsts({
    maxAge: 15552000  // 180 days in seconds
  }))
}


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

var sessionStore = new MySQLStore({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.db_name,
});

var sess = {
  key: keys.session.key,
  secret: keys.session.secret,
  saveUninitialized: false,
  store: sessionStore,
  resave: false,
  cookie: {
    maxAge: 60000
  }
}

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());

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


/* -------------------------------------------------------------------------- */
/*                          Routers Declaration Start                         */
/* -------------------------------------------------------------------------- */

var indexRouter = require('./routes');
var authRouter = require('./routes/authRoutes')(app);
var restrictedAreaRouter = require('./routes/restrictedArea')(app);
var apiRouter = require('./routes/api');
const { onLoad } = require('./routes/socket');

/* -------------------------------------------------------------------------- */
/*                           Routers Declaration End                          */
/* -------------------------------------------------------------------------- */

app.use('/auth',authRouter);
app.use('/restrictedArea',restrictedAreaRouter)
app.use('/api', apiRouter);
app.use(app.oauth.errorHandler());
if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', function (req, res) {
    //Facing issues on reloading...
    res.redirect('/');
    // console.log('Going to that path');
    // console.log(__dirname);
    // res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
  
}else{
  app.use('/', indexRouter);
}
app.use(anyError);
app.use(errorHandler);
let server;
// if(process.env.NODE_ENV === "production"){
//   const https = require("https");
//   const key = fs.readFileSync('C:\\nginx\\ssl\\dev.animei.tv.key');
//   const cert = fs.readFileSync('C:\\nginx\\ssl\\dev.animei.tv.crt');
//   server = https.createServer({key,cert},app);
// }else{
  const http = require("http");
  server = http.createServer(app);
//}

const wss = new WebSocket.Server({ server });
onLoad(wss);

let port = process.env.PORT || 4200;
let host = process.env.HOST || 'localhost';

server.listen(port,host,() => console.log(`Listening on port http://${host}:${port}`));

module.exports = server;

