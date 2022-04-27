// requirements
const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { handler } = require('./app/errors/handlers');

// connection to the database
require('./app/db/conn');
require('./app/db/associations');

// routes & APIs
const adminRouter = require('./app/routes/index');
const api = require('./app/api/v1');

// create app
const app = express();

// cors options
app.use(cors({ origin: '*' }));

// set view engine & public folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './app/views'));
app.use(express.static(path.join(__dirname, './app/public')));

// set parsers
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// APIs - version 1
// require('./app/api/v1')(app);
app.use('/api/v1', api);

// Routes
// require('./app/routes')(app)
app.use('/admin', adminRouter);

// 404 handler
app.use(function(req, res, next) {
	next({ status: 404, success: false, message: '404, Not Found!' });
});

// error handler
app.use(handler);

// run app
app.listen(process.env.PORT || 3000, () => {
	console.log(`Server is Running on port ${process.env.PORT || 3000}`);
});





// SOCKET
// const { socket } = require('./app/middlewares')
// global.SOCKET = new socket(httpServer)
