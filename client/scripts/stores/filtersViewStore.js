'use strict';

var assign = require('object-assign');
var Reflux = require('reflux');
var FiltersViewActions = require('../actions/filtersViewActions');


module.exports = Reflux.createStore({
  listenables: FiltersViewActions,

  onActivate: function(filterViewId) {
    this.update({currentlyActive: filterViewId});
  },

  onDeactivate: function(filterViewId) {
    if (filterViewId !== this.state.currentlyActive) {
      console.warn('can\'t deactivate not-active filter view', filterViewId);
      return;
    }
    this.update({currentlyActive: null});
  },

  update: function(spec) {
    this.state = assign({}, this.state, spec);
    this.trigger(this.state);
  },

  getInitialState: function() {
    return (this.state = {
      currentlyActive: null
    });
  }
});