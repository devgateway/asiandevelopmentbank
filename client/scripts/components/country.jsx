'use strict';

var React = require('react');
var Reflux = require('reflux');
var Link = require('react-router').Link;
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

  render: function() {

    var thisCountry = CountryStore.getCountry(this.props.params.countryId),
        hasLoaded = !!thisCountry;  // cast to bool, false if thisCountry is undefined

    if (hasLoaded) {
      MetaActions.setTitle(thisCountry.properties.name);
      MapViewActions.changeBounds(thisCountry.properties.bounds);
    } else {
      // update the app title. TODO: research title-managing libs
      MetaActions.setTitle('(loading country...)');
    }

    // TODO: render something for the country...
    return (
      <p>hello</p>
    );
  }

});
