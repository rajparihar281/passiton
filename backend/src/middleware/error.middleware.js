export const errorHandler = (err, req, res, next) => {
  console.error('❌ API Error:');
  console.error('📍 Route:', req.method, req.path);
  console.error('🔴 Error:', err.message);
  console.error('📊 Stack:', err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
};
