/*
 * Leaflet map component wrapper for React
 *
 * This component is a wrapper providing a friendly react-like API to other
 * components and connecting some pieces for the real leaflet
 */

'use strict';

var React = require('react/addons');
var Reflux = require('reflux');
var MapStore = require('../../stores/mapViewStore.js');
var MapActions = require('../../actions/mapViewActions.js');
var LeafletMap = require('./_mapLeaflet.jsx');


module.exports = React.createClass({

  mixins: [Reflux.connect(MapStore, 'mapView')],

  updateCurrentBounds: function(newMapViewBounds) {
    // Triggered whenever the map view changes, including:
    //   - initial map render
    //   - user drags or zooms the map
    //   - programatic changes to the map view
    // This function re-triggers it as an action so the mapViewStore can keep
    // track of where we are
    // The `user` child action of changeBounds signifies that we should not
    // trigger anything that might cause a re-render, just update store state.
    MapActions.changeBounds.user(newMapViewBounds);
  },

  // () -> either `L.map` instance or `undefined`
  getMap: function() {
    // TODO: is `this.refs` undefined at the beginning of the lifecycle?
    // ... if so, this could throw, and should probably handle that.
    return this.refs.leafletMapComponent.getLeafletMap();
  },

  render: function() {
    // pass a function down to children through props to access the leaflet map
    var children = React.Children.map(this.props.children, function(child) {
      return child ? React.addons.cloneWithProps(child, {getMap: this.getMap}) : null;
    }, this);

    var tiles = 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
    var bounds = this.state.mapView.bounds;

    return (
      <div>
        <LeafletMap
          ref="leafletMapComponent"
          tiles={tiles}
          bounds={bounds}
          onMapMove={this.updateCurrentBounds} />
        {children}
      </div>
    );
  }
});
