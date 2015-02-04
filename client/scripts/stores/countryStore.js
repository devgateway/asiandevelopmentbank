'use strict';

var assign = require('object-assign');
var Reflux = require('reflux');
var CountryActions = require('../actions/countryActions');


function countryToFeature(rawCountry) {
  return {
    type: 'Feature',
    id: rawCountry.id,
    geometry: {
      type: 'Point',
      coordinates: rawCountry.latlng
    },
    properties: rawCountry
  };
}

function countriesToGeoJSON(rawCountries) {
  return {
    type: 'FeatureCollection',
    features: rawCountries.countries.map(countryToFeature)
  };
}


function getCountry(geojson, countryId) {
  var result;
  geojson.features.forEach(function(country) {
    if (country.id === countryId) { result = country; }
  });
  return result;
}


function removeCountry(state, countryId) {
  var country = getCountry(state, countryId);
  if (!country) { return assign({}, state); }
  var featuresWithout = [];
  state.features.forEach(function(someCountry) {
    if (someCountry !== country) {
      featuresWithout.push(someCountry);
    }
  });
  return assign({}, state, {features: featuresWithout});
}


function mergeGeoJSON(state, geojson) {
  state = state || { type: 'FeatureCollection', features: [] };
  var allCountries = geojson.features.map(function(country) {
    return getCountry(state, country.id) || country;
  });
  return assign({}, state, { features: allCountries });
}


function mergeCountry(state, countryFeature) {
  state = state || { type: 'FeatureCollection', features: [] };
  var updatedFeatures = removeCountry(state, countryFeature.id);
  updatedFeatures.features.push(countryFeature);
  return updatedFeatures;
}


module.exports = Reflux.createStore({

  listenables: CountryActions,

  onLoad: function() {
    console.log('add a spinner?');
  },

  onLoadCompleted: function(data) {
    this.state = mergeGeoJSON(this.state, countriesToGeoJSON(data));
    this.trigger(this.state);
  },

  onLoadFailed: function() {
    console.log('booooooo');
  },

  onLoadCountry: function(countryId) {
    console.log('load a country plz');
  },

  onLoadCountryCompleted: function(data) {
    this.state = mergeCountry(this.state, countryToFeature(data));
    this.trigger(this.state);
  },

  onLoadCountryFailed: function() {
    console.log('could not load that country');
  },

  getCountry: function(countryId) {
    return getCountry(this.state, countryId);
  },

  getInitialState: function() {
    return (this.state = {
      type: 'FeatureCollection',
      features: []
     });
  }

});
