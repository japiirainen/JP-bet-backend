import mongoose from 'mongoose'
import { config } from '../src/utils/config'

const connect = (url = config.options.dbUrl, opts = {}) => {
    return mongoose.connect(url, {
        ...opts,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
}

export default connect
