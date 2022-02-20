var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const firebase = require('firebase');

var userRoutes = require('./routes/user-routes');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', userRoutes.router);

// app.post('/user/register', (req, res) => {
//   console.log(req.body);
//   console.log(typeof req.body);
//   admin.auth().createUser({
//     email: req.body.email,
//     displayName: req.body.displayName
//   }).then(function(user){
//     console.log('Success creating user: ', user.uid);
//   }).catch(function(error){
//     console.log('Error creating user: ',error)
//   });
//   res.send(
//     `I received your POST request. This is what you sent me: ${req.body.email}`,
//   );
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
