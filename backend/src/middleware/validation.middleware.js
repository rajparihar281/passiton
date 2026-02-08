import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  console.log('✅ Validation middleware called');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('❌ Validation errors:', errors.array());
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
    });
  }
  console.log('✅ Validation passed');
  next();
};
