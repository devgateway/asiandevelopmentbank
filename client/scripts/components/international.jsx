'use strict';

var React = require('react');
var Reflux = require('reflux');
var Link = require('react-router').Link;
var PointLayer = require('./map/pointLayer.jsx');
var MapViewActions = require('../actions/mapViewActions');
var CountryActions = require('../actions/countryActions');
var CountryStore = require('../stores/countryStore');


module.exports  = React.createClass({

  mixins: [Reflux.connect(CountryStore)],

  componentWillMount: CountryActions.load,

  componentDidMount: MapViewActions.resetBounds,

  popup: function(country) {
    var d = country.properties;
    return (
      <div className='country-summary'>
        <h3>
          <Link to='country' params={{countryId: d.id}}>
            {d.name}
          </Link>
        </h3>
        <p>Total Commitments: <strong>{d.totals.commitments.amount}</strong></p>
        <p>
          <Link to='country' params={{countryId: d.id}}>View country page</Link>
        </p>
      </div>
    );
  },

  render: function() {
    return (
      <PointLayer
        getMap={this.props.getMap}
        geojson={this.state}
        popup={this.popup} />
    );
  }

});
