var pathUtil = require('path'),
    log      = require(pathUtil.join(__dirname,'./logger.js')),
    cp       = require('child_process'),
    mongoloid= require(pathUtil.join(__dirname,'./mongoose/mongoloid.js')),
    XmmsModel= require(pathUtil.join(__dirname,'./mongoose/xmms-model.js')),
    _        = require('underscore');

var myXmms;
var myXmms2d;

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
        log.info('Now spawning xmms2d');
        myXmms2d = cp.spawn('/usr/bin/xmms2d');

        setTimeout(function(){
            log.info('1.5 seconds have passed. now safe to spawn xmms2.');
            myXmms = cp.spawn('/usr/bin/xmms2');

            myXmms.stdin.setEncoding('utf-8');

            myXmms.on('close', (code) => {
                log.info('XMMS process closed with code:'+code);
            });

            myXmms.on('exit', (code) => {
                log.info('XMMS process exited with code:'+code);
            });

            myXmms.stdout.on('data', (data) => {
                //log.info('rx stdout from xmms:'+data.toString());
            });

            myXmms.stderr.on('data', (err) => {
                log.error('XMMS received stderr from remote xmms:'+err);
                Xmms.saveAction(null,err);
            });
        },1500);


        myXmms2d.stdout.on('data', (data)=>{
            let dataStr = data.toString();
            //log.info('XMMS2D received stdout from remote xmms2d:'+dataStr);
            let mStr = dataStr.substring(dataStr.indexOf('Music-Ken'),dataStr.indexOf('\' (')).replace('Music-Ken/','');
            mStr = mStr.replace('%','');
            log.info('Music Filename:'+mStr);
            Xmms.saveAction(mStr);
        });
    };

    Xmms.saveAction = function(msg,errMsg){
        if(_.isEmpty(msg)){
            log.warn('Not saving empty filename!');
            return;
        }

        let saveMe = new XmmsModel.model({
            song_title: msg,
            error_msg:  errMsg,
            event_time: new Date()
        });

        //log.info("Saving:" + JSON.stringify(saveMe));

        mongoloid.save(saveMe);
    };

    Xmms.sendCommand = function(req,res){
        var self = this;
        //log.info('XMMS got command:'+req.originalUrl);

        if(req.originalUrl === '/shuffle'){
            let rand = Math.floor(Math.random() * 4848);
            myXmms.stdin.write('jump '+rand+'\r');
        }
        else{
            let cmd = req.originalUrl.replace('/','');
            //log.info('Sending to xmms command:'+cmd);
            myXmms.stdin.write(cmd+'\r');
        }

        res.json({'msg':'okie dokie'}).status(200);
    }
}

module.exports = Xmms;
