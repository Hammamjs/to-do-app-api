// Routes
const userRoutes = require('./authRoutes');
const tasksRoutes = require('./tasksRoutes');
const authRoutes = require('./authRoutes');
const ApiError = require('../utils/apiError');

exports.mount = (app) => {
  app.use('/api/v2/users', userRoutes);
  app.use('/api/v2/tasks', tasksRoutes);
  app.use('/api/v2/auth', authRoutes);

  app.all('*', (req, res, next) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404));
  });
};
