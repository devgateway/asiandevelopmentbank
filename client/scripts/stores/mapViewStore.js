'use strict';

var assign = require('object-assign');
var Reflux = require('reflux');
var MapActions = require('../actions/mapViewActions');


module.exports = Reflux.createStore({

  listenables: MapActions,

  onResetBounds: function() {
    this.debounceKey = null;
    this.update(this.getInitialState());
  },

  onChangeBounds: function(newBounds, options) {
    options = options || {};
    // break out of user-comp-user-comp-user bounds changing loop
    if (options.debounceKey && this.isBounce(options.debounceKey)) { return; }

    this.update({ bounds: newBounds });
  },

  onChangeBoundsUser: function(newBounds) {
    this.update({ bounds: newBounds }, { silent: true });
  },

  isBounce: function(newKey) {
    var oldKey = this.debounceKey;
    if (newKey === oldKey) {
      return true;
    } else {
      this.debounceKey = newKey;
      return false;
    }
  },

  update: function(assignable, options) {
    options = options || {};
    this.state = assign(this.state, assignable);
    if (!options.silent) {
      this.trigger(this.state);
    }
  },

  getInitialState: function() {
    return (this.state = {
      bounds: [ [61, 195],
                [-24, 20] ]
    });
  }

});
