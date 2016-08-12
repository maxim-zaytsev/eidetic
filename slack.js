var token = require("./token").token;
var WebClient = require('@slack/client').WebClient;
var RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var Promise = require("bluebird");
var web = new WebClient(token);
var rtm = new RtmClient(token);
Promise.promisifyAll(rtm);





module.exports = {
  rtm  : rtm,
  RTM_EVENTS : RTM_EVENTS,
  web : web
}
