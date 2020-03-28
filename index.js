const mongoose = require('mongoose')
require('dotenv').config()
const {
    app,
    PORT
} = require('./src/server')
const config = require('./config/config')

const dbOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}

mongoose.connect(config.mongoDB.databaseUrl, dbOptions).then(() => {
    app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))
})

module.exports = {
    app,
    PORT
}
