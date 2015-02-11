'use strict';

var React = require('react');
var Reflux = require('reflux');
var TopoLayer = require('./map/topoLayer.jsx');
var PointLayer = require('./map/pointLayer.jsx');
var CountryActions = require('../actions/countryActions');
var MapViewActions = require('../actions/mapViewActions');
var MetaActions = require('../actions/pageMetaActions');
var CountryStore = require('../stores/countryStore');


function locationsToMultiPoint(locations) {
  return {
    type: 'Feature',
    geometry: {
      type: 'MultiPoint',
      coordinates: locations
    }
  };
}


module.exports  = React.createClass({

  mixins: [Reflux.connect(CountryStore)],

  componentWillMount: function() {
    // make sure we load the country data. http cache should make this cheap.
    CountryActions.loadCountry(this.props.params.countryId);
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.params.countryId !== this.props.params.countryId) {
      // user navigated from one country directly to another's url
      CountryActions.loadCountry(nextProps.params.countryId);
    }
  },

  locationPin: function(featureData, latlng) {
    return L.marker(latlng, {
      icon: L.divIcon({
        className: 'project-location-marker',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      }),
      riseOnHover: true
    });
  },

  styleTopoLayer: function(layer) {
    return {
      color: 'hsl(220, 100%, 10%)',
      weight: 3,
      dashArray: '1, 3',
      fill: false,
      clickable: false
    };
  },

  render: function() {
    var thisCountry = CountryStore.getCountry(this.props.params.countryId),
        hasLoaded = !!thisCountry;  // cast to bool, false if thisCountry is undefined

    if (!hasLoaded) {
      MetaActions.setTitle('(loading country...)');
      return <div className="hidden"></div>;
    }

    MetaActions.setTitle(thisCountry.properties.name);
    MapViewActions.changeBounds(thisCountry.properties.bounds, {debounceKey: 'country' + thisCountry.id});

    var projectSites = thisCountry.properties.projects.map(function(project, i) {
      // This loop could potentially become a performance bottleneck.
      // If it does, we can put all the projects on one layer and one component.
      // Maybe a big FeatureCollection of MultiPoints?
      return (
        <PointLayer
          key={i}
          getMap={this.props.getMap}
          pin={this.locationPin}
          geojson={locationsToMultiPoint(project.locations)} />
      );
    }, this);

    return (
      <div className="hidden">
        <TopoLayer
          getMap={this.props.getMap}
          style={this.styleTopoLayer}
          topojson={thisCountry.properties.topojson} />
        {projectSites}
      </div>
    );
  }

});
