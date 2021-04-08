const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const morgan = require('morgan');
// var multer  = require('multer')
// var upload = multer({ dest: 'uploads/' })

const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const eventRoutes = require('./routes/eventRoutes');
const eventCategoryRoutes = require('./routes/eventCategoryRoutes');
const globalErrHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const app = express();

app.use(morgan('tiny'));

// Allow Cross-Origin requests
app.use(cors({
    origin: 'http://localhost:3001'
}));
app.use((req, res, next) => {
    res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type'
    })
    next();
  })
// Set security HTTP headers
// app.use(helmet());

// Limit request from the same API 
const limiter = rateLimit({
    max: 150,
    windowMs: 60 * 60 * 1000,
    message: 'Too Many Request from this IP, please try again in an hour'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({
    limit: '15kb'
}));

// Data sanitization against Nosql query injection
// app.use(mongoSanitize());

// Data sanitization against XSS(clean user input from malicious HTML code)
// app.use(xss());

// Prevent parameter pollution
// app.use(hpp());


// Routes
app.use('/api/users', userRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/category', eventCategoryRoutes);


// handle undefined Routes
app.use('*', (req, res, next) => {
    const err = new AppError(404, 'fail', 'undefined route');
    next(err, req, res, next);
});

app.use(globalErrHandler);

module.exports = app;