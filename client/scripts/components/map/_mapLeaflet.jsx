/*
 * Leaflet raw map component used by ./map.jsx (use that if you want a map)
 */

'use strict';

var React = require('react/addons');
var Reflux = require('reflux');


// L.map -> (bounds -> ()) -> (event -> ())
function getSimpleBounds(map, boundsChangeHandler) {
  return function(/* leafletEvent */) {  // don't need anything from the event
    var Lbounds = map.getBounds(),
        simpleBounds = [
          [Lbounds.getNorth(), Lbounds.getEast()],
          [Lbounds.getSouth(), Lbounds.getWest()]
        ];
    boundsChangeHandler(simpleBounds);
  };
}


module.exports = React.createClass({

  componentDidMount: function() {
    var containerNode = this.getDOMNode();

    var mapOptions = {};
    if (this.props.tiles) {
      mapOptions.layers = L.tileLayer(this.props.tiles);
    }

    this.map = L.map(containerNode, mapOptions);

    // something is setting the map's position to `relative` >:( so fix it
    containerNode.style.position = 'absolute';

    // send map events back to handlers in ./map.jsx
    if (this.props.onMapMove) {
      // `moveend` seems to cover all types of moves including zooms 
      this.map.on('moveend', getSimpleBounds(this.map, this.props.onMapMove));
    }

    // leaflet requires a view of the map to show
    if (this.props.bounds) {
      this.map.fitBounds(this.props.bounds);
    } else {
      this.map.fitWorld();
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.bounds) {
      this.map.fitBounds(nextProps.bounds)
    }
  },

  componentWillUnmount: function() {
    this.map.off();  // remove all event listeners
    this.map.remove();  // clean up the rest of the map stuff
    delete this.map;  // clear our ref so the map can be garbage collected
  },

  // () -> `L.map` instance or `undefined` if the component has not mounted yet
  getLeafletMap: function() {
    return this.map;
  },

  render: function() {
    return <div className="map react-leaflet-map"></div>
  }
});
