import { useState, useEffect } from 'react';
import { X, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components';
import { validateEmail, validatePassword } from '../utils/helpers';
import { collegeService } from '../services';
import type { College } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [colleges, setColleges] = useState<College[]>([]);
  const [collegesLoading, setCollegesLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    college_id: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && mode === 'signup' && colleges.length === 0) {
      loadColleges();
    }
  }, [isOpen, mode]);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        full_name: '',
        college_id: '',
      });
      setErrors({});
    }
  }, [isOpen]);

  const loadColleges = async () => {
    try {
      setCollegesLoading(true);
      const response = await collegeService.getColleges();
      if (response.success && response.data) {
        setColleges(response.data);
      }
    } catch (error) {
      console.error('Failed to load colleges:', error);
    } finally {
      setCollegesLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (mode === 'signup') {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.valid) {
        newErrors.password = passwordValidation.message!;
      }
    }
    
    if (mode === 'signup') {
      if (!formData.full_name.trim()) {
        newErrors.full_name = 'Full name is required';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      if (!formData.college_id) {
        newErrors.college_id = 'Please select your college';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
        toast.success('Login successful!');
      } else {
        await signup(formData.email, formData.password, formData.full_name, formData.college_id);
        toast.success('Account created successfully!');
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message || `${mode === 'login' ? 'Login' : 'Signup'} failed`);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {mode === 'login' ? 'Welcome Back' : 'Join PassItOn'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <Input
                type="text"
                label="Full Name"
                placeholder="John Doe"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                error={errors.full_name}
                required
              />
            )}

            <Input
              type="email"
              label="Email"
              placeholder={mode === 'signup' ? 'your.email@college.edu' : 'Enter your email'}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              required
            />

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  College <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.college_id}
                  onChange={(e) => setFormData({ ...formData, college_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={collegesLoading}
                >
                  <option value="">
                    {collegesLoading ? 'Loading colleges...' : 'Select your college'}
                  </option>
                  {colleges.map((college) => (
                    <option key={college.id} value={college.id}>
                      {college.name}
                    </option>
                  ))}
                </select>
                {errors.college_id && <p className="mt-1 text-sm text-red-600">{errors.college_id}</p>}
              </div>
            )}

            <Input
              type="password"
              label="Password"
              placeholder={mode === 'signup' ? 'Create a strong password' : 'Enter your password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              required
            />

            {mode === 'signup' && (
              <Input
                type="password"
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={errors.confirmPassword}
                required
              />
            )}

            <Button type="submit" fullWidth loading={isLoading}>
              {mode === 'login' ? 'Login' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={switchMode}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {mode === 'login' ? 'Sign up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};