var process_item = function(req, res, process_func) {
    console.log('[Mandrill] Processing incoming email');
    
    var obj = null;
    
    if (!req.body || !req.body.mandrill_events) {
        console.log('[Mandrill] Missing mandrill_events object');
        return res.status(400).send('Missing mandrill_events object');
    }

    try {
        obj = JSON.parse(req.body.mandrill_events);
    } catch (e) {
        console.log('[Mandrill] Could not deserialize mandrill_events');
        return res.status(400).send('Could not deserialize mandrill_events');
    }
    
    for (var i = 0; i < obj.length; i++) {
        var item = obj[i];
        
        if (!item.event || item.event != 'inbound') {
            console.log('[Mandrill] Invalid mandrill event');
            continue;
        }
        
        if (!item.msg) {
            console.log('[Mandrill] msg object missing');
            continue;
        }
        
        console.log('[Mandrill] Start processing of email from ' + item.msg.email + ' for ' + item.msg.email);
        
        process_func(item.msg.email, item.msg.raw_msg, function() {
            console.log('[Mandrill] Finished processing of email from ' + item.msg.email + ' for ' + item.msg.email);
        });
    }

    return res.send('Message delivered');
};

module.exports = {
    process: process_item
}