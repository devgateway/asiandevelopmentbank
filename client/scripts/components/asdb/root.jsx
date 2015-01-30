'use strict';

var React = require('react');
var Reflux = require('reflux');
var Link = require('react-router').Link;
var MapComponent = require('../map/asdbMap.jsx');
var RouteHandler = require('react-router').RouteHandler;

module.exports  = React.createClass({

  render: function() {
    return (
      <MapComponent>
        <RouteHandler {...this.props}/>
      </MapComponent>
    );
  }

});
