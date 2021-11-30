module.exports = (app, version) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "zi-access-token, Origin, Content-Type, Accept"
        )
        next()
    })

    // base route
    app.get('/', (req, res) => { res.send('This is the Pozitron.') })
}