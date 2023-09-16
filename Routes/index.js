// Routes
const userRoutes = require("../Routes/userRoutes");
const tasksRoutes = require("../Routes/tasksRoutes");
const authRoutes = require("../Routes/authRoutes");
const ApiError = require("../utils/apiError");

exports.mount = (app) => {
  app.use("/api/v2/users", userRoutes);
  app.use("/api/v2/tasks", tasksRoutes);
  app.use("/api/v2/auth", authRoutes);
  app.all("*", (req, res, next) => {
    return next(new ApiError(`This route not found ${req.originalUrl}`, 400));
  });
};
