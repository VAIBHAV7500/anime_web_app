var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var helmet = require('helmet');
var nodeadmin = require('nodeadmin');

require('dotenv').config();

var indexRouter = require('./routes/index');
var videoRouter = require('./routes/video');

var {
  anyError,
  errorHandler,
}  = require('./services/middleware')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
  origin: process.env.CORS_ORIGIN,
}));

app.use(helmet());

app.use(nodeadmin(app));

app.use('/', indexRouter);
app.use('/video', videoRouter);

app.use(anyError);
app.use(errorHandler);

const port = process.env.PORT || 4200;
app.listen(port,()=>{
  console.log(`Started listening at http://localhost:${port}`);
});

module.exports = app;
