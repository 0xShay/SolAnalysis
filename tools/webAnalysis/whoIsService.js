const config = require('../../config.json');

const axios = require('axios');

const getWhoIsData = (domainName, options = {}) => {
    const params = {
      apiKey: process.env['WHOIS_API_KEY'],
      domainName: domainName,
      outputFormat: 'JSON'
    };

    const queryString = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');

    const url = `https://www.whoisxmlapi.com/whoisserver/WhoisService?${queryString}`;

    return axios.get(url)
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching WhoIs data:', error.message);
        throw error;
      });
  };

function getCreationDate(response) {
    if (response.WhoisRecord.registryData && response.WhoisRecord.registryData.createdDate) {
        return response.WhoisRecord.registryData.createdDate;
    } else {
        return "unknown";
    }
}

function getCompanyLocation(response) {
    if (response.WhoisRecord && response.WhoisRecord.registrant && response.WhoisRecord.registrant.country) {
        return response.WhoisRecord.registrant.country;
    } else {
        return "unknown";
    }
}

module.exports = { getWhoIsData, getCreationDate, getCompanyLocation };
