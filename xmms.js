var pathUtil = require('path'),
    log      = require(pathUtil.join(__dirname,'./logger.js')),
    cp       = require('child_process'),
    _        = require('underscore');


function Xmms(){
    var self = this;
    this._xmms = null;

    Xmms.prototype.shutdown = function(){
        var self = this;
        if(!_.isEmpty(self._xmms)){
            process.kill(self._xmms.pid);
        }
    };

    Xmms.prototype.connect = function() {
        var self = this;
        self._xmms = cp.spawn('xmms2');
        self._xmms.stdin.setEncoding('utf-8');

        self._xmms.stdout.on('data', (data) => {
            log.info('XMMS received stdout from remote xmms:'+data.toString());
        });

        self._xmms.stderr.on('data', (err) => {
            log.error('XMMS received stderr from remote xmms:'+err);
        });

        self._xmms.on('close', (code) => {
            log.info('XMMS process closed with code:'+code);
        });

        self._xmms.on('exit', (code) => {
            log.info('XMMS process exited with code:'+code);
        });
    };

    Xmms.sendCommand = function(cmd){
        var self = this;
        log.info('XMMS got command:'+cmd);
        self._xmms.stdin.write(cmd+'\r\n');
    }
}

module.exports = Xmms;
