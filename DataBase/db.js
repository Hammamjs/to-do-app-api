const mongoose = require("mongoose");

const Connection = () => {
  mongoose
    .connect(
      "mongodb+srv://hammamhusseinjs:UT5bwj7KpZbPYJKY@todoapp.diarjwf.mongodb.net/?retryWrites=true&w=majority"
    )
    .then((conn) => console.log(`connection start: ${conn.connection.host}`));
};

module.exports = Connection;
