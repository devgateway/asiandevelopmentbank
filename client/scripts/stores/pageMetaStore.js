'use strict';

var assign = require('object-assign');
var Reflux = require('reflux');
var MetaActions = require('../actions/pageMetaActions');


module.exports = Reflux.createStore({

  listenables: MetaActions,

  onSetTitle: function(newTitle) {
    this.update({title: newTitle});
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
