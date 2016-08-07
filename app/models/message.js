var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var MessageSchema = new Schema({
  user: String,
  text: String,
  date: String,
  channel: String
});

// MessageSchema.virtual('date')
//   .get(function(){
//     return this._id.getTimestamp();
//   });
var Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
