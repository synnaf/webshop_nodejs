'use strict';

// Härifrån startar vi upp vår webshop
var mongoose = require('mongoose');

var _require = require('./src/server'),
    app = _require.app,
    PORT = _require.PORT;

var dbConfig = require('./config/config');

// Kicka igång servern
var dbOptions = { useUnifiedTopology: true, useNewUrlParser: true };
mongoose.connect(dbConfig.databaseURL, dbOptions).then(function () {
    app.listen(PORT, function () {
        return console.log('App listening on port ' + PORT + '!');
    });
});

module.exports = { app: app, PORT: PORT };