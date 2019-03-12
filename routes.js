//This script defines the routes taken by the server.

var pathUtil = require('path'),
    log      = require(pathUtil.join(__dirname,'./logger.js')),
    Xmms     = require(pathUtil.join(__dirname,'./xmms.js')),
    securityController = require(pathUtil.join(__dirname,'./security.server.controller.js'));

module.exports = function(app) {
  //order important here.

  //EVERYTHING WILL BE AUDITED AND REROUTED TO SECURE SITE.
  app.use(securityController.auditRequest,//if not mobile site, then log it.
          securityController.reRouteHttps);//after logging, forward to https site.

  app.get('/',function(req,res,next){
    res.sendStatus(404);
  })

  app.get('/play', function(req, res) {
    Xmms.sendCommand('play');
    res.sendStatus(200);
  });

  app.get('/stop', function(req, res) {
    Xmms.sendCommand('stop');
    res.sendStatus(200);
  });

  app.get('/next',function(req,res,next){
    Xmms.sendCommand('next');
    res.sendStatus(200);
  });

  app.get('/prev',function(req,res,prev){
      Xmms.sendCommand('prev');
      res.sendStatus(200);
  });

  app.get('/shuffle',function(req,res,shuffle){
    var rand = Math.floor(Math.random() * 5100);
    Xmms.sendCommand('jump '+rand);
    res.sendStatus(200);
  });

  //everything else is a 404, not found.
  app.get('*',function(req,res,next){
    res.sendStatus(404);
  });

  //error middleware triggered by next('some error');
  //error handling middleware is always declared last.
  app.use(function(err,req,res,next){
    log.error("Error middleware caught with error:"+err);
    res.sendStatus(err);
  });
};
