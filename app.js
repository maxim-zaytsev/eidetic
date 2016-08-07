var express = require('express'),
config = require('./config/config'),
glob = require('glob'),
mongoose = require('mongoose');
var Message = require('./app/models/message');


var elastic = require('./elasticsearch');
elastic.indexExists().then(function (exists) {
  if (exists) {
    return elastic.deleteIndex();
  }
}).then(function () {
  return elastic.initIndex()
});

var app = express();
var documents = require('./app/routes/documents');
app.use('/documents', documents);


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

var token = require("./token").token;

var WebClient = require('@slack/client').WebClient;
var RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var Promise = require("bluebird");






var web = new WebClient(token);
var rtm = new RtmClient(token);
Promise.promisifyAll(rtm);

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
  // findAllMesages();
}

rtm.start();
