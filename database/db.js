const mongoose = require('mongoose')
require('dotenv').config()

const connect = (url = process.env.DBURL, opts = {}) => {
    return mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
}

module.exports = connect
