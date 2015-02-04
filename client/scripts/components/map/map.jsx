'use strict';

var React = require('react/addons');
var Router = require('react-router');
var MapStore = require('../../stores/mapViewStore.js');
var Reflux = require('reflux');
var Link = Router.Link;
var MapActions = require('../../actions/mapViewActions.js');


module.exports = React.createClass({

  mixins: [Reflux.connect(MapStore)],

  componentWillMount: function() {
    this.map = L.map(document.createElement('div'), {
      layers: [L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')]
    });
  },

  componentDidMount: function() {
    var mapContainer = this.map.getContainer();
    this.getDOMNode().appendChild(mapContainer);
    mapContainer.classList.add('map');
    mapContainer.style.position = 'absolute';
    this.map.on('moveend', this.onChangeBounds, this);
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

  getLeafletMap: function() {
    return this.map;
  },

  onChangeBounds: function(e) {
    MapActions.changeBounds.user(this.map.getBounds());
  },

  repositionMap: function() {
    this.map.fitBounds(this.state.bounds);
  },

  render: function() {
    return <div></div>
  }
});
