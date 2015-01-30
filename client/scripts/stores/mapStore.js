'use strict';

var assign = require('object-assign');
var Reflux = require('reflux');
var MapActions = require('../actions/mapActions');


module.exports = Reflux.createStore({

  listenables: MapActions,

  onChangeBounds: function(newBounds) {
    this.update({ bounds: newBounds });
  },

  onChangeBoundsUser: function(newBounds) {
    this.update({ bounds: newBounds }, { silent: true });
  },

  update: function(assignable, options) {
    options = options || {};
    console.log('updating state: ', assignable);
    this.state = assign(this.state, assignable);
    if (!options.silent) {
      this.trigger(this.state);
    }
  },

  getInitialState: function() {
    return (this.state = {
      bounds: [ [40, -75],
                [41, -74] ]
    });
  }

});
