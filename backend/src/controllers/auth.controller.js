import { authService } from '../services/auth.service.js';

export const signup = async (req, res, next) => {
  try {
    console.log('📝 Signup controller called');
    const { email, password, full_name, college_id } = req.body;
    console.log('📊 Signup data:', { email, full_name, college_id });

    const result = await authService.signup({ email, password, full_name, college_id });
    console.log('✅ Signup successful');

    res.status(201).json({
      success: true,
      data: result,
      message: 'Account created successfully',
    });
  } catch (error) {
    console.log('❌ Signup controller error:', error.message);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login({ email, password });

    res.json({
      success: true,
      data: result,
      message: 'Login successful',
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const profile = await authService.getCurrentUser(req.user.id);

    res.json({
      success: true,
      data: {
        user: { id: req.user.id, email: req.user.email },
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
};

export const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;

    const result = await authService.requestPasswordReset(email);

    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const result = await authService.resetPassword(token, password);

    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};
