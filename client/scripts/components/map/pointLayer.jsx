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
    // remove any existing layer so we can render fresh
    if (this.props.getMap().hasLayer(this.layer)) {
      this.props.getMap().removeLayer(this.layer);
    }

    var options = {};  // options for L.geoJson

    // pin callback must give a leaflet-style maker. it would be nice to wrap
    // this in a component abstraction, but I don't know how right now.
    if (props.pin) {
      options.pointToLayer = props.pin;
    }

    var eachFeatureTasks = [];

    // popup callback should return contents as a leaflet component
    if (props.popup) {
      eachFeatureTasks.push(function(feature, layer) {
        layer.bindPopup('');
        layer.on('popupopen', function(e) {
          this.renderPopup(e.popup, feature, props.popup);
        }.bind(this))
      }.bind(this));
    }

    // optionally do something on marker double-click (like navigate to a page)
    if (props.dblclick) {
      eachFeatureTasks.push(function(feature, layer) {
        layer.on('dblclick', function(e) {
          // pass in a ref to the feature, since that's probably the most useful
          props.dblclick(feature, layer, e);
        }.bind(this));
      }.bind(this));
    }

    options.onEachFeature = function(feature, layer) {
      eachFeatureTasks.forEach(function(task) {
        task(feature, layer);
      }.bind(this))
    }

    this.layer = L.geoJson(props.geojson, options);
    this.props.getMap().addLayer(this.layer);
  },

  renderPopup: function(popup, feature, popupFn) {
    // this component renders, in react terms, _as its popup_. It's hidden from
    // the normal document flow, and copied into the open L.popup's content.
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
      <div className="hidden">
        {this.popupFn(this.state)}
      </div>
    );
  }

});
