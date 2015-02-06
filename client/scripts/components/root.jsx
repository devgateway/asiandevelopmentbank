'use strict';

var React = require('react');
var Reflux = require('reflux');
var Link = require('react-router').Link;
var Map = require('./map/map.jsx');
var Header = require('./header.jsx');
var Footer = require('./footer.jsx');
var RouteHandler = require('react-router').RouteHandler;

module.exports  = React.createClass({

  getMap: function() {
    return this.refs.map;
  },

  render: function() {
    return (
      <div>
        <Map ref="map" />
        <Header />
        <Footer />
        <RouteHandler {...this.props} getMap={this.getMap} />
      </div>
    );
  }

});
