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

        myXmms.stdout.on('data', (data) => {
            log.info('XMMS received stdout from remote xmms:'+data.toString());
        });

        myXmms.stderr.on('data', (err) => {
            log.error('XMMS received stderr from remote xmms:'+err);
        });

        myXmms.on('close', (code) => {
            log.info('XMMS process closed with code:'+code);
        });

        myXmms.on('exit', (code) => {
            log.info('XMMS process exited with code:'+code);
        });
    };

    Xmms.sendCommand = function(cmd){
        var self = this;
        log.info('XMMS got command:'+cmd);
        myXmms.stdin.write(cmd+'\r');
    }
}

module.exports = Xmms;
