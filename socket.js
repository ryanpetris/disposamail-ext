var phonetic = require('phonetic');
var socket = require('socket.io');

var load = function(http, config, clients) {
    var io = socket(http);
    
    io.on('connection', function(socket) {
        console.log('[Socket] New connection from ip ' + socket.handshake.address);
        
        var address = null;
    
        do {
            address = phonetic.generate().toLowerCase() + '@' + config.domain;
        } while (address in clients);
        
        console.log('[Socket] Assigning email address ' + address + ' to ip ' + socket.handshake.address);
        
        clients[address] = socket;
    
        socket.on('disconnect', function() {
            console.log('[Socket] Connection from ip ' + socket.handshake.address + ' disconnected');

            delete clients[address];
            
            console.log('[Socket] Deallocated email address ' + address);
        });
    
        socket.emit('info', {
            address: address
        });
        
        console.log('[Socket] Sent email address ' + address + ' to ip ' + socket.handshake.address);
    });   
}

module.exports = {
    load: load
}