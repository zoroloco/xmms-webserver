//This script defines the routes taken by the server.

var pathUtil = require('path'),
    log      = require(pathUtil.join(__dirname,'./logger.js')),
    xmms     = require(pathUtil.join(__dirname,'./xmms.js')),
    cors     = require('cors'),
    serverController = require(pathUtil.join(__dirname,'./server.controller.js'));

module.exports = function(app) {
  //order important here.

  //EVERYTHING WILL BE AUDITED AND REROUTED TO SECURE SITE.
  app.use(cors(),
      serverController.auditRequest,
          //securityController.reRouteHttps
  );

  app.get('/',function(req,res){
    res.sendStatus(404);
  });

  app.get('/play', xmms.sendCommand);
  app.get('/stop', xmms.sendCommand);
  app.get('/next', xmms.sendCommand);
  app.get('/prev', xmms.sendCommand);
  app.get('/shuffle',xmms.sendCommand);

  //everything else is a 404, not found.
  app.get('*',function(req,res){
    res.sendStatus(404);
  });

  //error middleware triggered by next('some error');
  //error handling middleware is always declared last.
  app.use(function(err,req,res,next){
    log.error("Error middleware caught with error:"+err);
    res.sendStatus(err);
  });
};
