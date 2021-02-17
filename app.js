const express = require('express');
const path = require('path');
const sequelize = require('./models').sequelize
const routes = require('./routes/index');
const cookieParser = require('cookie-parser');

const app = express();
app.use('/static', express.static('public'));
const port = 3000;
const http = require('http');
const server = http.createServer(app)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


sequelize.sync()
  .then(() => {
    server.listen(port);
    app.use('/', routes);
  });






