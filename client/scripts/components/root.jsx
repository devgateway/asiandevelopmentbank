'use strict';

var React = require('react');
var Reflux = require('reflux');
var Link = require('react-router').Link;
var Map = require('./map/map.jsx');
var Header = require('./header.jsx');
var Footer = require('./footer.jsx');
var RouteHandler = require('react-router').RouteHandler;

module.exports  = React.createClass({

  render: function() {
    return (
      <div>
        <Header />
        <Map>
          <RouteHandler {...this.props} />
        </Map>
        <Footer />
      </div>
    );
  }

});
