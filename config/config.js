var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'eidetic'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/eidetic-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'eidetic'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/eidetic-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'eidetic'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/eidetic-production'
  }
};

module.exports = config[env];
