const config = require('../../config.json');

const axios = require('axios');

const requestConfig = {
  headers: {
    'Content-Type': 'application/json'
  }
};

const registerWithSSLLabs = () => {
  axios.post('https://www.ssllabs.com/api/v4/register', process.env['SSL_LABS_EMAIL'], requestConfig)
    .then((response) => {
      console.log('Response:', response.data);
    })
    .catch((error) => {
      console.error('Error:', error.response ? error.response.data : error.message);
    });
}

const analyzeWithSSLLabs = (host, options = {}) => {
  const { publish = 'off', startNew = 'off', fromCache = 'off', maxAge, all = 'on', ignoreMismatch = 'off' } = options;

  let apiUrl = `https://www.ssllabs.com/api/v4/analyze?host=${(host)}`; // Encode host

  const headers = {
    'email': process.env['SSL_LABS_EMAIL']
  };

  return axios.get(apiUrl, { headers })
    .then(response => response.data) 
    .catch(error => {
      console.error('Error performing SSL analysis:', error.response ? error.response.data : error.message);
      throw error;
    });
};

function getTrustGrade(Response) {
  if (Response.endpoints.length > 0 && Response.endpoints[0] && Response.endpoints[0].grade) {
    return Response.endpoints[0].grade
  }
  return 'unknown';
}

module.exports = { registerWithSSLLabs, analyzeWithSSLLabs, getTrustGrade };
