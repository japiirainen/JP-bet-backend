import mongoose from 'mongoose'
require('dotenv').config()

const connect = (url = process.env.DBURL, opts = {}) => {
    return mongoose.connect(url, {
        ...opts,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
}

export default connect
