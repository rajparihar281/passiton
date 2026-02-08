import fetch from 'node-fetch';

const testBackend = async () => {
  try {
    console.log('🧪 Testing backend connection...');
    
    const response = await fetch('http://localhost:5000');
    const data = await response.json();
    
    console.log('✅ Backend is running!');
    console.log('📊 Response:', data);
    
    // Test the services endpoint
    console.log('\n🧪 Testing services endpoint...');
    const servicesResponse = await fetch('http://localhost:5000/api/services');
    const servicesData = await servicesResponse.json();
    
    console.log('✅ Services endpoint working!');
    console.log('📊 Services response:', servicesData);
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
  }
};

testBackend();