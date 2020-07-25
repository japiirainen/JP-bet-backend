const mongoose = require('mongoose')
require('dotenv').config()

const env = process.env.NODE_ENV

function connect(
    url = env === 'dev' ? process.env.DBURL_DEV : process.env.DBURL_PROD
) {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        })
        var db = mongoose.connection

        db.on('error', (err) => {
            console.log(err)
        })
        db.once('connected', () => {
            console.log('Mongo connected')
        })
        db.on('reconnected', () => {
            console.log('Mongo re-connected')
        })
        db.on('disconnected', () => {
            console.log('Mongo disconnected')
        })
    })
}

module.exports = connect
