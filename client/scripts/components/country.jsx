'use strict';

var React = require('react');
var Reflux = require('reflux');
var Link = require('react-router').Link;
var CountryActions = require('../actions/countryActions');
var MetaActions = require('../actions/pageMetaActions');
var CountryStore = require('../stores/countryStore');


module.exports  = React.createClass({

  mixins: [Reflux.connect(CountryStore)],

  componentWillMount: function() {
    CountryActions.loadCountry(this.props.params.countryId);
  },

  componentWillReceiveProps: function(nextProps) {
    CountryActions.loadCountry(nextProps.params.countryId);
  },

  render: function() {
    var thisCountry = CountryStore.getCountry(this.props.params.countryId);
    if (thisCountry) {
      this.props.getMap().map.fitBounds(thisCountry.properties.bounds);
      MetaActions.setTitle(thisCountry.properties.name);
    } else {
      MetaActions.setTitle('(loading country...)');
    }
    return (
      <p>hello</p>
    );
  }

});
