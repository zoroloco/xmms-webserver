var pathUtil = require('path'),
    _        = require('underscore'),
    express  = require(pathUtil.join(__dirname,'./express.js')),
    log      = require(pathUtil.join(__dirname,'./logger.js')),
    Xmms     = require(pathUtil.join(__dirname,'./xmms.js')),
    conf     = require(pathUtil.join(__dirname,'./conf.json')),
    http     = require('http'),
    https    = require('https');

log.init();

try{
    if(!_.isEmpty(conf)){
        log.info("Using config file:\n"+JSON.stringify(conf));
    }
    else{
        log.warn("No config file defined. Bailing.");
        process.exit(1);
    }
}
catch(e){
    log.warn("Starting server resulted in the exception:"+e);
    process.exit(1);
}

process.title = conf.title;
var myXmms    = new Xmms();
let app       = express();//start the server.

//define process handlers
process.on('SIGTERM', function() {
    log.info("Got kill signal. Exiting.");
    //httpsServer.close();
    httpServer.close();
    process.exit();
});

process.on('SIGINT', function() {
    log.warn("Caught interrupt signal(Ctrl-C)");
    //httpsServer.close();
    httpServer.close();
    process.exit();
});

process.on('exit', function(){
    log.info("server process exiting...");
});

process.on('uncaughtException', function (err) {
    let msg="Uncaught Exception ";
    if( err.name === 'AssertionError' ) {
        msg += err.message;
    } else {
        msg += err;
    }play
play
    log.error(msg);
});
/*
let httpsServer = https.createServer(app.get('httpsOptions'),app).listen(app.get('port'),function(){
    log.info(process.title+" server now listening on SSL port:"+httpsServer.address().port);
});
*/
let httpServer = http.createServer(app).listen(app.get('httpPort'),function(){
    log.info(process.title+" server now listening on HTTP port:"+httpServer.address().port);
});

myXmms.connect();