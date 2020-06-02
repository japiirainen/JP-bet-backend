const app = require('./app.js')

const port = process.env.PORT

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})