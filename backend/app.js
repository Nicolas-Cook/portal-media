require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var session = require('express-session');
var cors = require('cors');


var usersRouter = require('./routes/users');
var moviesRouter = require('./routes/movies');
var seriesRouter = require('./routes/series');

var app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'clave-no-tan-secreta',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use('/users', usersRouter);

const authenticate = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Es necesario autenticarse primero' });
  }
  next();
};

app.use('/movies', authenticate, moviesRouter);
app.use('/series', authenticate, seriesRouter);



app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({error: err});
});

module.exports = app;
