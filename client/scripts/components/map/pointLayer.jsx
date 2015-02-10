'use strict';

var React = require('react/addons');
var Router = require('react-router');
var Reflux = require('reflux');
var Link = Router.Link;


module.exports = React.createClass({

  componentDidMount: function() {
    this.addLayerToMap(this.props);
  },

  componentWillReceiveProps: function(nextProps) {
    this.addLayerToMap(nextProps);
  },

  componentWillUnmount: function() {
    this.props.getMap().removeLayer(this.layer);
  },

  addLayerToMap: function(props) {
    if (this.props.getMap().hasLayer(this.layer)) {
      this.props.getMap().removeLayer(this.layer);
    }
    var options = {};
    if (props.popup) {
      options.onEachFeature = function(feature, layer) {
        layer.bindPopup('');
        layer.on('popupopen', function(e) {
          this.renderPopup(e.popup, feature, props.popup);
        }.bind(this))
      }.bind(this);
    }
    this.layer = L.geoJson(props.geojson, options);
    this.props.getMap().addLayer(this.layer);
  },

  renderPopup: function(popup, feature, popupFn) {
    this.popupFn = popupFn;
    this.setState(feature); // triggers a re-render
    popup.setContent(this.getDOMNode().innerHTML);
  },

  popupFn: function() {
    // this gets overridden
    return <div></div>;
  },

  render: function() {
    return (
      <div>
        {this.popupFn(this.state)}
      </div>
    );
  }

});
