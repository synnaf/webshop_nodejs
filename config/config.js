require('dotenv').config();

const mongoDB = {
    databaseUrl: process.env.MONGO_DB || "mongodb+srv://pizza_2019:pizza_2019@cluster0-17ron.mongodb.net/product?retryWrites=true&w=majority"
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


module.exports = { mongoDB, spotify, mailkey, tokenkey };  