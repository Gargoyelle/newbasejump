'use strict';

var express = require('express'),
    routes = require('./app/routes/index.js'),
    mongoose = require("mongoose")

var app = express();

mongoose.connect('mongodb://localhost:27017/clementinejs')

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

routes(app);

app.listen(8080, function () {
    console.log('Listening on port 8080...');
});
