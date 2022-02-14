const errorHandler = (err, req, res, next) => {
  process.env.NODE_ENV !== "production" && console.error(err.stack);
  res.status(err.statusCode || 500).json({ error: err.message });
};

export default errorHandler;
