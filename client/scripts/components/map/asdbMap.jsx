'use strict';

var deepEqual = require('deep-equal');
var React = require('react');
var Router = require('react-router');
var MapStore = require('../../stores/mapStore.js');
var Reflux = require('reflux');
var Link = Router.Link;
var MapActions = require('../../actions/mapActions.js');
var MapControls = require('./controls.jsx')

module.exports  = React.createClass({

  mixins: [Reflux.connect(MapStore)],

  componentWillMount: function() {
    var map = this.map = L.map(document.createElement('div'), {
      layers: [L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')]
    });
    map.on('moveend', this.onChangeBounds, this);
  },

  componentDidMount: function() {
    this.getDOMNode().querySelector('.map').appendChild(this.map.getContainer());
    this.repositionMap();
  },

  componentDidUpdate: function(oldProps, oldState) {
    this.repositionMap();
  },

  componentWillUnmount: function() {
    this.map.off();
    this.map.remove();
    delete this.map;
  },

  onChangeBounds: function(e) {
    MapActions.changeBounds.user(this.map.getBounds());
  },

  repositionMap: function() {
    console.log('repositioning...', JSON.stringify(this.state));
    this.map.fitBounds(this.state.bounds);
  },

  render: function() {
    return (
      <div>
        <div className='map'></div>
        {this.props.children}
      </div>
    );
  }
});
