'use strict';

var assign = require('object-assign');
var Reflux = require('reflux');
var CountryActions = require('../actions/countryActions');


function _countriesToGeoJSON(rawCountries) {
  return {
    type: 'FeatureCollection',
    features: rawCountries.countries.map(function(country) {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: country.latlng
        },
        properties: country
      };
    })
  };
}


module.exports = Reflux.createStore({

  listenables: CountryActions,

  onLoad: function() {
    console.log('add a spinner?');
  },

  onLoadCompleted: function(data) {
    this.state = _countriesToGeoJSON(data);
    this.trigger(this.state);
  },

  onLoadFailed: function() {
    console.log('booooooo');
  },

  onLoadCountry: function(countryId) {
    console.log('load a country plz');
  },

  onLoadCountryCompleted: function() {
    console.log('loaded a country');
  },

  onLoadCountryFailed: function() {
    console.log('could not load that country');
  },

  getInitialState: function() {
    return (this.state = {
      type: 'FeatureCollection',
      features: []
     });
  }

});
