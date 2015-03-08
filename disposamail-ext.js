var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var phonetic = require('phonetic');
var MailParser = require('mailparser').MailParser;
var fs = require('fs');
var bodyParser = require('body-parser');

var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
var clients = [];

app.use(express.static(__dirname + config.public_dir));

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/mandrill/inbound', urlencodedParser, function(req, res) {
    var obj = null;
    
    if (!req.body || !req.body.mandrill_events) {
        return res.status(400).send('Missing mandrill_events object.');
    }

    try {
        obj = JSON.parse(req.body.mandrill_events);
    } catch (e) {
        return res.status(400).send('Could not deserialize mandrill_events.');
    }
    
    for (var i = 0; i < obj.length; i++) {
        var item = obj[i];
        
        if (!item.event || item.event != 'inbound') {
            return res.status(400).send('Invalid mandrill event.');
        }
        
        if (!item.msg) {
            return res.status(400).send('msg object missing.');
        }
        
        process_email(item.msg.email, item.msg.raw_msg, function() {
            return res.send('ok');
        });
    }
});

var process_email = function(rcpt_to, raw_data, next) {
    console.log('Sending email for ' + rcpt_to);
    
    if (!(rcpt_to in clients)) {
        console.log(rcpt_to + ' not in email list.');
        
        return next();
    }
    
    console.log(rcpt_to + ' is in email list.');
    
    var parser = new MailParser();

    parser.on('end', function(mail_object){
        console.log('Sending message to ' + rcpt_to);
        
        mail_object.raw = raw_data;
        
        clients[rcpt_to].emit('message', mail_object);
    });

    parser.write(raw_data);
    parser.end();
    
    return next();
}

io.on('connection', function(socket) {
    var address = null;

    do {
        address = phonetic.generate().toLowerCase() + '@' + config.domain;
    } while (address in clients);

    clients[address] = socket;

    socket.on('disconnect', function() {
        delete clients[address];
    });

    socket.emit('info', {
        address: address
    });
});

http.listen(process.env.PORT || 3000);

