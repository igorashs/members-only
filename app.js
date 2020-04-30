const debugServer = require('debug')('members-only:server');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const createError = require('http-errors');
const path = require('path');
const express = require('express');
const env = require('./.env.config');

const app = express();

// handle initial connection errors
(async () => {
  try {
    await mongoose.connect(env.mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  } catch (connectionErr) {
    debugServer(connectionErr);
  }
})();

const db = mongoose.connection;

// handle errors after initial connection
db.on('error', (err) => {
  debugServer(err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// log our request in a fancy way
app.use(morgan('dev'));

// wearing the helmet
app.use(
  helmet({
    hidePoweredBy: { setTo: 'Hidden Wizard' }
  })
);

// add compression
app.use(compression());

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// add our routes
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const messageRouter = require('./routes/message');
const membershipRouter = require('./routes/membership');

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/message', messageRouter);
app.use('/membership', membershipRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = env.NODE_ENV === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// listening to port
const server = app.listen(env.PORT || 3000);

// handle server errors
server.on('error', (err) => {
  switch (err.code) {
    case 'EACCES':
      debugServer('Permission Denied');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      debugServer('Address already in use');
      process.exit(1);
      break;
    default:
      throw err;
  }
});

// log the port
server.on('listening', () => {
  debugServer(`Listening on ${server.address().port}`);
});
