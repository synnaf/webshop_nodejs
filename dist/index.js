'use strict';

var mongoose = require('mongoose');
require('dotenv').config();

var _require = require('./src/server'),
    app = _require.app,
    PORT = _require.PORT;

var config = require('./config/config');

var dbOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
};

mongoose.connect(config.mongoDB.databaseUrl, dbOptions).then(function () {
    app.listen(PORT, function () {
        return console.log('App listening on port ' + PORT + '!');
    });
});

module.exports = { app: app, PORT: PORT };