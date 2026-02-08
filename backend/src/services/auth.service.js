import supabase from '../config/supabase.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';

export const authService = {
  async signup({ email, password, full_name, college_id }) {
    console.log('🔐 Signup attempt for:', email);
    
    const hashedPassword = await hashPassword(password);
    console.log('🔒 Password hashed successfully');

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        },
      },
    });

    if (authError) {
      console.log('❌ Auth signup error:', authError);
      if (authError.message.includes('already registered') || authError.code === 'user_already_exists') {
        throw new Error('User already registered');
      }
      throw authError;
    }
    
    console.log('✅ Auth user created:', authData.user.id);
    const userId = authData.user.id;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        full_name,
        college_id,
      })
      .select()
      .single();

    if (profileError) {
      console.log('❌ Profile creation error:', profileError);
      throw profileError;
    }
    
    console.log('✅ Profile created successfully');
    const token = generateToken({ id: userId, email });

    return {
      user: { id: userId, email },
      profile,
      token,
    };
  },

  async login({ email, password }) {
    console.log('🔑 Login attempt for:', email);
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.log('❌ Login auth error:', authError);
      throw new Error('Invalid credentials');
    }
    
    console.log('✅ Auth login successful');
    const userId = authData.user.id;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.log('❌ Profile fetch error:', profileError);
      throw profileError;
    }
    
    console.log('✅ Profile fetched successfully');
    const token = generateToken({ id: userId, email });

    return {
      user: { id: userId, email },
      profile,
      token,
    };
  },

  async getCurrentUser(userId) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return profile;
  },

  async requestPasswordReset(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
    });

    if (error) throw error;

    return { message: 'Password reset email sent' };
  },

  async resetPassword(token, newPassword) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return { message: 'Password updated successfully' };
  },
};
