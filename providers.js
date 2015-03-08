var fs = require('fs');
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

function load(app, process_func) {
    console.log('[Providers] Loading Providers');
    
    var providers = fs.readdirSync('./providers');
    
    for (var i = 0; i < providers.length; i++) {
        var item = providers[i];
        var name = item.replace(/\.js$/, '');
        
        console.log('[Providers] Loading ' + name + ' provider');
        
        var provider = require('./providers/' + item);
        
        app.post('/' + name + '/inbound', urlencodedParser, function(req, res) {
            provider.process(req, res, process_func);
        });

        console.log('[Providers] Provider ' + name + ' loaded');
    }
}

module.exports = {
    load: load
}