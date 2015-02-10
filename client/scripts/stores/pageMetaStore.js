'use strict';

var assign = require('object-assign');
var Reflux = require('reflux');
var MetaActions = require('../actions/pageMetaActions');
var router = require('../router.jsx');


module.exports = Reflux.createStore({

  listenables: MetaActions,

  onSetTitle: function(newTitle) {
    this.update({title: newTitle});
  },

  onTransitionTo: function(routeNameOrPath, params, query) {
    // don't actually do anything state-wise, just proxy through to the router
    router.get().transitionTo(routeNameOrPath, params, query);
  },

  update: function(assignable) {
    this.state = assign(this.state, assignable);
    this.trigger(this.state);
  },

  getInitialState: function() {
    return (this.state = {
      title: ''
    });
  }

});
