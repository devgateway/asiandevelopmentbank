'use strict';

var React = require('react/addons');
var Router = require('react-router');
var Reflux = require('reflux');
var Link = Router.Link;


module.exports = React.createClass({

  componentDidMount: function() {
    this.popupEl = document.createElement('div');
    this.addLayerToMap(this.props);
  },

  componentWillReceiveProps: function(nextProps) {
    this.addLayerToMap(nextProps);
  },

  componentWillUnmount: function() {
    this.props.getMap().map.removeLayer(this.layer);
  },

  addLayerToMap: function(props) {
    if (this.props.getMap().map.hasLayer(this.layer)) {
      this.props.getMap().map.removeLayer(this.layer);
    }
    var options = {};
    if (props.popup) {
      options.onEachFeature = function(feature, layer) {
        layer.bindPopup(this.popupEl);
        React.render(props.popup(feature), this.popupEl);
      }.bind(this);
    }
    this.layer = L.geoJson(props.geojson, options);
    this.props.getMap().map.addLayer(this.layer);
  },

  render: function() {
    // TODO: we don't actually want to return anything...
    return <span></span>;
  }

});
