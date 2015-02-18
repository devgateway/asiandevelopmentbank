'use strict';

var request = require('reqwest');


function logFailure(err, message) {
  console.error(message);
  console.error(err);
}


module.exports = {

  getAllCountries: function() {
    return request({ url: 'json/countries.json' }).fail(logFailure);
  },

  getCountry: function(countryId) {
    return request({ url: 'json/countries/' + countryId + '.json' }).fail(logFailure);
  },

  getProject: function(projectId) {
    return request({ url: 'json/projects/' + projectId + '.json' }).fail(logFailure);
  }

};
