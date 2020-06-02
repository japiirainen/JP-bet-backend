const app = require('./app.js')

const port = 1337

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})
