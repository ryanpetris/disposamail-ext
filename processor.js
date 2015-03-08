var MailParser = require('mailparser').MailParser;

var clients = null;

var process_email = function(rcpt_to, raw_data, next) {
    console.log('[Processor] Sending email for ' + rcpt_to);
    
    if (!(rcpt_to in clients)) {
        console.log('[Processor] ' + rcpt_to + ' not in email list.');
        
        return next();
    }
    
    console.log('[Processor] ' + rcpt_to + ' is in email list.');
    
    var parser = new MailParser();

    parser.on('end', function(mail_object){
        console.log('[Processor] Sending message to ' + rcpt_to);
        
        mail_object.raw = raw_data;
        
        clients[rcpt_to].emit('message', mail_object);

        console.log('[Processor] Finished processing message for ' + rcpt_to);
    });

    parser.write(raw_data);
    parser.end();
    
    return next();
};

var load = function(load_clients) {
    clients = load_clients;
};

module.exports = {
    load: load,
    process: process_email
}