require('dotenv').config()

module.exports = {
    options: {
        port: process.env.PORT,
        dbUrl: process.env.DBURL,
        welcomemsg: process.env.WELCOMEMESSAGE,
    },
    secrets: {
        jwt: process.env.JWT_SECRET,
        jwtExp: '7d',
    },
}
