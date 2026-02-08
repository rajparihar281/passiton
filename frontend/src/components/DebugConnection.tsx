import { useState } from 'react';
import { skillService } from '../services';

export const DebugConnection = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setTestResult('Testing...');
    
    try {
      console.log('🧪 Testing backend connection...');
      
      // Test basic API connection
      const response = await fetch('http://localhost:5000');
      const data = await response.json();
      
      console.log('✅ Basic connection successful:', data);
      
      // Test services endpoint
      const servicesResponse = await skillService.getServices();
      console.log('✅ Services endpoint successful:', servicesResponse);
      
      setTestResult(`✅ Connection successful!\nBackend: ${JSON.stringify(data, null, 2)}\nServices: ${JSON.stringify(servicesResponse, null, 2)}`);
      
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      setTestResult(`❌ Connection failed: ${error.message}\nDetails: ${JSON.stringify({
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      }, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const testAuth = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('🔐 Auth Debug:', {
      hasToken: !!token,
      tokenLength: token?.length,
      user: user ? JSON.parse(user) : null
    });
    
    setTestResult(`🔐 Auth Status:\nToken: ${token ? 'Present' : 'Missing'}\nUser: ${user || 'Not logged in'}`);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">🔧 Debug Tools</h3>
      
      <div className="space-x-2 mb-4">
        <button 
          onClick={testConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Backend Connection'}
        </button>
        
        <button 
          onClick={testAuth}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Check Auth Status
        </button>
      </div>
      
      {testResult && (
        <pre className="bg-white p-3 rounded border text-sm overflow-auto max-h-96">
          {testResult}
        </pre>
      )}
    </div>
  );
};