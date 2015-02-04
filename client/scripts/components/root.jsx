'use strict';

var React = require('react');
var Reflux = require('reflux');
var Link = require('react-router').Link;
var MapComponent = require('./map/map.jsx');
var RouteHandler = require('react-router').RouteHandler;

module.exports  = React.createClass({

  getMap: function() {
    return this.refs.map;
  },

  render: function() {
    return (
      <div>
        <MapComponent ref="map" />
        <RouteHandler {...this.props} getMap={this.getMap} />
      </div>
    );
  }

});
