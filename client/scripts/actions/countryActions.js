'use strict';

var Reflux = require('reflux');
var api = require('../api');


var load = Reflux.createAction({ asyncResult: true });
load.listenAndPromise(api.getAllCountries);

var loadCountry = Reflux.createAction({ asyncResult: true });
loadCountry.listenAndPromise(api.getCountry);


module.exports = {
  load: load,
  loadCountry: loadCountry
};
