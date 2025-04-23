const axios = require('axios');
const API_BASE_URL = 'http://localhost:2000/api'

const makeAuthenticatedRequest = async (token, method, endpoint, data = null) => {
    try {
      const config = {
        headers: {
          'Authorization': `${token}`
        }
      };
  
      const response = await axios({
        method,
        url: `${API_BASE_URL}${endpoint}`,
        data,
        ...config
      });
  
      return response.data;
    } catch (error) {
      throw error;
    }
  };

module.exports = makeAuthenticatedRequest;
