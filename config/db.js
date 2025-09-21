const mongoose = require("mongoose");

const Connection = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then((conn) => console.log(`connection start: ${conn.connection.host}`));
};

module.exports = Connection;
