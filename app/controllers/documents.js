var express = require('express');
var router = express.Router();

var elastic = require('../../elasticsearch');


router.get('/suggest/:input', function (req, res, next) {
    elastic.getSuggestions(req.params.input).then(function (result) {
      res.json(result)
    });
});

router.get('/search/:input', function (req, res, next) {
    elastic.search(req.params.input).then(function (result) {
      res.json(result)
    });
});

module.exports = function (app) {
  app.use('/documents', router);
};





