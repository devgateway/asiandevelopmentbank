'use strict';

var React = require('react');
var Reflux = require('reflux');
var Link = require('react-router').Link;
var PointLayer = require('./map/pointLayer.jsx');
var MapViewActions = require('../actions/mapViewActions');
var MetaActions = require('../actions/pageMetaActions');
var CountryActions = require('../actions/countryActions');
var CountryStore = require('../stores/countryStore');


module.exports  = React.createClass({

  mixins: [Reflux.connect(CountryStore)],

  componentWillMount: CountryActions.load,

  componentDidMount: function() {
    MapViewActions.resetBounds();
    MetaActions.setTitle('International');
  },

  pin: function(featureData, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: 'images/international-pin.png',
        // TODO: retina icon
        iconSize: [48, 48],
        iconAnchor: [24, 24]
      }),
      title: featureData.properties.name,
      alt: 'Clickable map marker for ' + featureData.properties.name,
      riseOnHover: true
    });
  },

  popup: function(country) {
    var d = country.properties;
    return (
      <div className='country-summary'>
        <h3>
          <Link to='country' params={{countryId: d.id}}>
            {d.name}
          </Link>
        </h3>
        <p>Total Commitments: <strong>{d.totals.commitments.amount} {d.totals.commitments.unit}</strong></p>
        <p>Total Projects: <strong>{d.totals.projects.amount}</strong></p>
        <p>
          <Link to='country' params={{countryId: d.id}}>View country info »</Link>
        </p>
      </div>
    );
  },

  dblclick: function(feature, layer) {
    MetaActions.transitionTo('country', {countryId: feature.id});
  },

  render: function() {
    return (
      <PointLayer
        getMap={this.props.getMap}
        geojson={this.state}
        pin={this.pin}
        popup={this.popup}
        dblclick={this.dblclick} />
    );
  }

});
