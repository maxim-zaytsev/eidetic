var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Message = mongoose.model('Message');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  Message.find(function (err, messages) {
    if (err) return next(err);
    res.render('index', {
      title: 'Generator-Express MVC',
      articles: messages
    });
  });
});
