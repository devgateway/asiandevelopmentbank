'use strict';

var Reflux = require('reflux');


module.exports = Reflux.createActions([
  'setTitle',
  'transitionTo',  // pageMetaStore just proxies this to react-router
]);
