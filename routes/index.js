var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Website downloader - Take any website offline.' });
});

var designRoutes = {
  '/design-v1': { folder: 'v1', name: 'Inkwell' },
  '/design-v2': { folder: 'v2', name: 'Phosphor' },
  '/design-v3': { folder: 'v3', name: 'Whitespace' },
  '/design-v4': { folder: 'v4', name: 'Frost' },
  '/design-v5': { folder: 'v5', name: 'Radix' }
};

Object.keys(designRoutes).forEach(function(path) {
  var d = designRoutes[path];
  router.get(path, function(req, res, next) {
    res.render('designs/' + d.folder + '/index', {
      title: 'WebCloner ' + d.name + ' - design preview',
      layout: 'designs/' + d.folder + '/layout'
    });
  });
});

module.exports = router;
