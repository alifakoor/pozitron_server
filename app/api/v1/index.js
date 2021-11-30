const prefix = '/api/v1'
module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "zi-access-token, Origin, Content-Type, Accept"
        )
        next()
    })

    require('./auth.api')(app, prefix)
    require('./business.api')(app, prefix)
}