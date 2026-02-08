import type { FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components';
import { validateEmail, validatePassword } from '../utils/helpers';
import apiClient from '../services/api';

import type { College } from '../types';

export const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [colleges, setColleges] = useState<College[]>([]);
  const [collegesLoading, setCollegesLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    college_id: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadColleges();
  }, []);

  const loadColleges = async () => {
    try {
      console.log('🏫 Loading colleges...');
      setCollegesLoading(true);
      const response = await apiClient.get('/api/colleges');
      console.log('📡 College API response:', response.data);
      if (response.data.success && response.data.data) {
        console.log(`✅ Loaded ${response.data.data.length} colleges:`, response.data.data);
        setColleges(response.data.data);
      } else {
        console.error('❌ Invalid response format:', response.data);
      }
    } catch (error) {
      console.error('❌ Failed to load colleges:', error);
    } finally {
      setCollegesLoading(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.valid) {
        newErrors.password = passwordValidation.message!;
      }
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.college_id) {
      newErrors.college_id = 'Please select your college';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      await signup(formData.email, formData.password, formData.full_name, formData.college_id);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12 animate-fadeIn">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 animate-fadeInUp">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Package className="w-16 h-16 text-blue-600 transition-transform duration-300 hover:scale-110" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 animate-slideDown">Join PassItOn</h1>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            label="Full Name"
            placeholder="John Doe"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            error={errors.full_name}
            required
          />

          <Input
            type="email"
            label="College Email"
            placeholder="your.email@college.edu"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            helperText="Use your official college email"
            required
          />

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

          <Input
            type="password"
            label="Password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
            required
          />

          <Input
            type="password"
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
            required
          />

          <Button type="submit" fullWidth loading={loading}>
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
