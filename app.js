const debugServer = require('debug')('members-only:server');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const createError = require('http-errors');
const path = require('path');
const express = require('express');
const env = require('./.env.config');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const bcrypt = require('bcryptjs');

const session = require('express-session');

const app = express();

// handle initial connection errors
(async () => {
  try {
    await mongoose.connect(env.mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
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

app.use(
  express.urlencoded({
    useNewUrlParser: true,
    useUnifiedTopology: true,
    extended: false
  })
);

// setup LocalStrategy for passport
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });

      if (!user) {
        app.locals.loginErrors = {
          username: { message: `${username} doesn't exist` }
        };
        return done(null, false);
      }

      if (await bcrypt.compare(password, user.password)) {
        app.locals.requestedUser = null;
        app.locals.loginErrors = {};

        return done(null, user);
      } else {
        app.locals.requestedUser = username;

        app.locals.loginErrors = {
          password: { message: 'wrong password' }
        };
        return done(null, false);
      }
    } catch (err) {
      debugServer(err);
      return done(err);
    }
  })
);

// passport session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
  try {
    const user = await User.findById(_id);

    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// initialize passport
app.use(session({ secret: 'Alune', resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// get the logged user
app.use((req, res, next) => {
  if (req.user) {
    app.locals.currentUser = req.user;
  } else {
    app.locals.currentUser = null;
  }

  next();
});

// add our routes
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const messageRouter = require('./routes/message');
const membershipRouter = require('./routes/membership');
const adminRouter = require('./routes/admin');

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/message', messageRouter);
app.use('/membership', membershipRouter);
app.use('/admin', adminRouter);

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
