const express = require('express');
const path = require('path');

const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const corsOptions = require('./config/corsOption');
// security package
const xssFilters = require('xss-filters');
const mongoSanitize = require('express-mongo-sanitize');
const { rateLimit } = require('express-rate-limit');

const Connection = require('./config/db');
const globalErrorMiddleware = require('./middleware/globalErrorMiddleware');

const { mount } = require('./routes/index');

dotenv.config({ path: '.env' });

const app = express();
// start DataBase Connection
Connection();

// Enable other domain to access application
app.use(cors(corsOptions));
app.options('*', cors());

app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'public')));
// get cookie from body
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`${process.env.NODE_ENV} mode start`);
}
// sanitize data
app.use((req, res, next) => {
  req.body = xssFilters.inHTMLData(JSON.stringify(req.body));
  req.body = JSON.parse(req.body);
  next();
});

app.use(mongoSanitize());

// give route limit access like Auth/ and change password
const limit = rateLimit({
  windowMs: 20 * 60 * 1000,
  limit: 10,
  message: 'To many Request from this IP please wait for couple minutes',
});
// Just for authentication routes
app.use('api/v2/auth/', limit);

// Mount routes
mount(app);

app.use(globalErrorMiddleware);
const port = process.env.PORT || 3500;
const server = app.listen(port, () => {
  console.log('Server start running at port: ' + port);
});

process.on('unhandledRejection', (err) => {
  console.log(`unhandledRejection occur: ${err.name} | ${err.message}`);
  console.log(err);
  server.close(() => {
    console.log('server shutting down');
    process.exit(1);
  });
});
