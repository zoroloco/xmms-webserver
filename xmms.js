var pathUtil = require('path'),
    log      = require(pathUtil.join(__dirname,'./logger.js')),
    cp       = require('child_process'),
    _        = require('underscore');


var myXmms;

function Xmms(){
    var self = this;

    Xmms.prototype.shutdown = function(){
        var self = this;
        if(!_.isEmpty(myXmms)){
            process.kill(myXmms.pid);
        }
    };

    Xmms.prototype.connect = function() {
        var self = this;
        myXmms = cp.spawn('/usr/bin/xmms2');
        myXmms.stdin.setEncoding('utf-8');

        myXmms.on('close', (code) => {
            log.info('XMMS process closed with code:'+code);
        });

        myXmms.on('exit', (code) => {
            log.info('XMMS process exited with code:'+code);
        });
    };

    Xmms.sendCommand = function(req,res){
        var self = this;
        log.info('XMMS got command:'+req.originalUrl);

        if(req.originalUrl === '/shuffle'){
            let rand = Math.floor(Math.random() * 4848);
            myXmms.stdin.write('jump '+rand+'\r');
        }
        else{
            let cmd = req.originalUrl.replace('/','');
            log.info('Sending to xmms command:'+cmd);
            myXmms.stdin.write(cmd+'\r');
        }

        myXmms.stdout.on('data', (data) => {
            let dataStr = data.toString();
            log.info('XMMS received stdout from remote xmms:'+dataStr);
            res.json({'msg':dataStr}).status(200);
        });

        myXmms.stderr.on('data', (err) => {
            log.error('XMMS received stderr from remote xmms:'+err);
            res.json({'errMsg':err}).status(200);
        });
    }
}

module.exports = Xmms;
