var express = require('express');
var app = express();

//setting middleware
app.use(express.static('public')); //Serves resources from public folder


var server = app.listen(3000);
