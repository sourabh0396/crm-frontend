const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    console.log('Testing API connection...');
    
    // Test authentication
    console.log('\n1. Testing authentication...');
    try {
      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        email: 'admin@example.com',
        password: 'password123'
      });
      console.log('Login successful:', loginResponse.data);
      
      const token = loginResponse.data.token;
      
      // Test leads endpoint
      console.log('\n2. Testing leads endpoint...');
      const leadsResponse = await axios.get(`${API_URL}/leads`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Leads fetched successfully:', leadsResponse.data);
      
      // Test telecallers endpoint
      console.log('\n3. Testing telecallers endpoint...');
      const telecallersResponse = await axios.get(`${API_URL}/telecallers`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Telecallers fetched successfully:', telecallersResponse.data);
      
      // Test dashboard endpoint
      console.log('\n4. Testing dashboard endpoint...');
      const dashboardResponse = await axios.get(`${API_URL}/dashboard/metrics`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Dashboard metrics fetched successfully:', dashboardResponse.data);
      
    } catch (error) {
      console.error('Authentication failed:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('API test failed:', error.message);
  }
}

testAPI(); 