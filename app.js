const express = require('express');
const path = require('path');
const sequelize = require('./models').sequelize
const routes = require('./routes/index');
const cookieParser = require('cookie-parser');

// Check if db can be talked to
(async () => {  
  try {
    await sequelize.authenticate();
    console.log('Connection successfull.');
    await sequelize.sync();
  } catch (error) {
    console.error('Unable to connect to database:', error);
  }
})();

const app = express();
app.use('/static', express.static('public'));
const port = 3000;
const http = require('http');
const server = http.createServer(app)
server.listen(port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

//  404 handler
app.use(function(req, res, next) {
  const err = new Error();
  err.status = 404;
  err.message = "Oops! It seems the page could not be found...";
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  if (err.status === 404) {
    res.render('page-not-found', { err, title: "Page Not Found "});
  } else {
    err.message = err.message || 'Oops! It looks like something went wrong';
    res.render('error', {err, title: "Error"});
  }
});






