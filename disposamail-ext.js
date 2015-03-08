var express = require('express');
var app = express();
var http = require('http').Server(app);
var fs = require('fs');

var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

app.use(express.static(__dirname + config.public_dir));

var clients = [];

var processor = require('./processor.js');
processor.load(clients);

require('./providers.js').load(app, processor.process);
require('./socket.js').load(http, config, clients);

http.listen(process.env.PORT || 3000);

