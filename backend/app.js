const express = require('express');
const os = require("os");
const cluster = require("cluster");
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
const WebSocket = require('ws');
const fs = require('fs');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const responseTime = require('response-time');
const redis = require('redis');
const {executeOnce} = require('./services/slave');
//const discord = require('./services/pushNotification');
const https = require("https");
const http = require("http");
const rateLimit = require("express-rate-limit");

const clusterWorkerSize = os.cpus().length
var app = express();
app.oauth = oAuth2Server({
  model: oAuthModel,
  grants: ['password'],
  debug: true
})
var { anyError, errorHandler, apiMiddleware }  = require('./services/middleware');
require('dotenv').config();

console.log(process.env.NODE_ENV)

if(process.env.NODE_ENV === "production"){
  console.log("Running Production...")
  app.use(hsts({
    maxAge: 15552000  // 180 days in seconds
  })) 
}else {
  global.redis = redis.createClient({
    host: 'localhost',
    port: 6379,
  });
  global.redis.on('error', (err) => {
    logger.error(err);
  });
}

// use response-time as a middleware
app.use(responseTime());


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
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB,
});

var sess = {
  key: process.env.SESSION_KEY,
  secret: process.env.SESSION_SECRET,
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

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20
});

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

app.use('/auth',authLimiter,authRouter);
app.use('/restrictedArea',restrictedAreaRouter)
//app.use('/api',apiMiddleware, app.oauth.authorise(), apiRouter);
app.use('/api', apiRouter);
app.use(app.oauth.errorHandler());
if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('/',limiter, (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
  app.get('*', function (req, res) {
    //Facing issues on reloading...
    res.redirect(`/?redirect=${req.originalUrl}`);
  });
  
}else{
  app.use('/', indexRouter);
}
app.use(anyError);
app.use(errorHandler);

let server;
let key;
let cert;

server = http.createServer(app);

let port = process.env.PORT || 4200;
let host = process.env.HOST || 'localhost';

let isMainWorker = false;

server.listen(port,host,() => console.log(`Listening on port http://${host}:${port}`));
const wss = new WebSocket.Server({ server }); 
onLoad(wss);
executeOnce();

// if (clusterWorkerSize > 1) {
//   if (cluster.isMaster) {
//     for (let i=0; i < clusterWorkerSize; i++) {
//       cluster.fork()
//     }

//     cluster.on('listening', (worker, address) => {
//       console.log("cluster listening new worker", worker.id, " ", address);
//       if(!isMainWorker) {
//           console.log("Making worker " + worker.id + " to main worker");
//           isMainWorker = true;
//           worker.send({order: "oneTimeExecution"});
//       }
//   });

//     cluster.on("exit", function(worker) {
//       console.log("Worker", worker.id, " has exitted.")
//     })
//   } else {
//     server = http.createServer(app);
//     const wss = new WebSocket.Server({ server }); 
//     onLoad(wss);
//     process.on('message', function(msg) {
//       console.log('Worker ' + process.pid + ' received message from master.', msg);
//       if(msg.order == "oneTimeExecution") {
//         executeOnce();
//       }
//     });
//     server.listen(port,host,() => console.log(`Listening on port http://${host}:${port}`));
//   }
// } else {
//   if(!isMainWorker){
//     isMainWorker = true;
//     executeOnce();
//   }
//   server = http.createServer(app);
//   const wss = new WebSocket.Server({ server }); 
//   onLoad(wss);
//   server.listen(port,host,() => console.log(`Listening on port http://${host}:${port}`));
// }

module.exports = server;

