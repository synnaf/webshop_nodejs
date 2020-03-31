
if (process.env.NODE_ENV !== 'production') require('dotenv').config(); 

const mongoDB = {
    databaseUrl: process.env.MONGO_DB
}

const spotify = {
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET
}

const mailkey = {
    mailkey: process.env.SEND_GRID_KEY
}

const tokenkey = {
    adminjwt: process.env.ADMIN_TOKEN,
    userjwt: process.env.USER_TOKEN,
}

const admin = {
    adminPassword: process.env.ADMIN_PASSWORD
}


module.exports = { mongoDB, spotify, mailkey, tokenkey, admin };  
