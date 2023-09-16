const express = require("express");
const path = require("path");

const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// security package
const xssFilters = require("xss-filters");
const mongoSanitize = require("express-mongo-sanitize");

const Connection = require("./DataBase/db");
const globalErrorMiddleware = require("./Middleware/globalErrorMiddleware");

const { mount } = require("./Routes/index");

dotenv.config({ path: "config.env" });

const app = express();
// start DataBase Connection
Connection();

// Enable other domain to access application
app.use(cors());
app.options("*", cors());

app.use(express.json());
app.use(express.static(path.join(__dirname, "puplic")));
// get cookie from body
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`${process.env.NODE_ENV} mode start`);
}
// sanitize data
app.use((req, res, next) => {
  req.body = xssFilters.inHTMLData(JSON.stringify(req.body));
  req.body = JSON.parse(req.body);
  next();
});

app.use(mongoSanitize());

// Mount routes
mount(app);

app.use(globalErrorMiddleware);
const port = process.env.PORT | 8000;
const server = app.listen(port, () => {
  console.log("Server start running at port: " + port);
});

process.on("unhandledRejection", (err) => {
  console.log(`unhandledRejection occur: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("server shutting down");
    process.exit(1);
  });
});
