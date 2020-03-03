// Härifrån startar vi upp vår webshop
const mongoose = require('mongoose')

const {
    app,
    PORT
} = require('./src/server')
const dbConfig = require('./config/config')

// Kicka igång servern
<<<<<<< HEAD
const dbOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true
}

=======
const dbOptions = { useUnifiedTopology: true, useNewUrlParser: true }
>>>>>>> 006033b78bdfa120e35f77d2b8b1fdcf5ed68cfd
mongoose.connect(dbConfig.databaseUrl, dbOptions).then(() => {
    app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))
})

module.exports = {
    app,
    PORT
}