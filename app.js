var express = require('express'),
config = require('./config/config'),
glob = require('glob'),
mongoose = require('mongoose');

var elastic = require('./elasticsearch');
var Message = elastic.Message;

var app = express();

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});

require('./config/express')(app, config);

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});


var rtm = require('./slack').rtm;
var RTM_EVENTS = require('./slack').RTM_EVENTS;
var web = require('./slack').web;


rtm.on(RTM_EVENTS.MESSAGE, function (message) {
  var date = message.ts;
  var name = "";
  var text = message.text;
  web.users.info(message.user).then(function () {
    var user = arguments['0'].user;
    name = user.name;
    if (message.channel[0] == "C") {
      web.channels.info(message.channel).then(function () {
        var channel = arguments['0'].channel;
        var rawMessage = {user:name, text:text, date:date, channel : channel.name};
        saveMessage(rawMessage);
      });
    }
    else if (message.channel[0] == "G") {
      web.groups.info(message.channel).then(function(){
        var channel = arguments['0'].group;
        var rawMessage = {user:name, text:text, date:date, channel : channel.name};
        saveMessage(rawMessage);
      });
    }
  });
});

function findAllMesages() {
  Message.find({}, function (err, messages) {
    messages.forEach(function (message) {
      console.log(message.text);
    });
  });
}
function saveMessage(message){
  var m = new Message(message);
  m.save(function(err){
    if(err) throw err;
  });
  elastic.addDocument(message);
}

rtm.start();
