const allowedOrigins = [
  'http://localhost:5173',
  ...(process.env.ALLOWED_ORIGINS_URL
    ? process.env.ALLOWED_ORIGINS_URL.split(',')
    : []),
];

module.exports = allowedOrigins;
