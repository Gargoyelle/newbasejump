'use strict';

var express = require('express'),
    routes = require('./app/routes/index.js'),
    mongoose = require("mongoose"),
    passport = require("passport"),
    session = require("express-session"),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    flash = require("connect-flash"),
    morgan = require("morgan");



var app = express();
// require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI)

app.use(morgan('dev'));
app.use(express.static(process.cwd() + '/public'));
app.use(cookieParser());
app.use(flash());
app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true}));
app.set('public', process.cwd() + '/public');
app.set('view engine', 'ejs');
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/common', express.static(process.cwd() + '/app/common'));
app.locals.url = process.env.APP_URL;

app.use(session({
    secret: 'secretClementine',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

var port = process.env.PORT;

app.listen(port, function () {
    console.log('Listening on port 8080...');
});
