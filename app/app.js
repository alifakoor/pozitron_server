// requirements
const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { handler } = require('./errors/handlers');

// connection to the database
require('./db/conn');
require('./db/associations');

// routes & APIs
const adminRouter = require('./routes/index');
const api = require('./api/v1');

// create app
const app = express();

// cors options
app.use(cors({ origin: "*" }));

// set view engine & public folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, './public')));

// set parsers
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// APIs - version 1
// require('./api/v1')(app);
app.use('/api/v1', api);

// Routes
// require('./routes')(app)
app.use('/admin', adminRouter);

// 404 handler
app.use(function(req, res, next) {
	next({ status: 404, success: false, message: '404, Not Found!' });
});

// error handler
app.use(handler);

module.exports = app;

// run app
// app.listen(process.env.PORT || 3000, () => {
// 	console.log(`Server is Running on port ${process.env.PORT || 3000}`);
// });





// SOCKET
// const { socket } = require('./middlewares')
// global.SOCKET = new socket(httpServer)
