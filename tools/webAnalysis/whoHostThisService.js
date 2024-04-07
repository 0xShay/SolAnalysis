const config = require('../../config.json');

const axios = require('axios')

const getWhoHostThisData = (domainName, options = {}) => {
    const params = {
      key: process.env['WHOHOST_API_KEY'],
      url: domainName,
      outputFormat: 'JSON'
    };

    const queryString = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');

    const url = `https://www.who-hosts-this.com/API/Host?${queryString}`;

    return axios.get(url)
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching WhoIs data:', error.message);
        throw error;
      });
  }

function getWebHosting(response) {
    if (response.results && response.results.length > 0 && response.results[0].isp_name) {
        return response.results[0].isp_name;
    } else {
        return "unknown";
    }
}

module.exports = { getWhoHostThisData, getWebHosting };