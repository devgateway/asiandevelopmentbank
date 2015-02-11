'use strict';

var React = require('react');
var Reflux = require('reflux');
var TopoLayer = require('./map/topoLayer.jsx');
var CountryActions = require('../actions/countryActions');
var MapViewActions = require('../actions/mapViewActions');
var MetaActions = require('../actions/pageMetaActions');
var CountryStore = require('../stores/countryStore');


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

    // update the app title. TODO: research title-managing libs
    if (hasLoaded) {
      MetaActions.setTitle(thisCountry.properties.name);
      MapViewActions.changeBounds(thisCountry.properties.bounds, {debounceKey: 'country' + thisCountry.id});

      return (
        <TopoLayer
          getMap={this.props.getMap}
          style={this.styleTopoLayer}
          topojson={thisCountry.properties.topojson} />
      );

    } else {
      MetaActions.setTitle('(loading country...)');
      return <div className="hidden"></div>
    }
  }

});
