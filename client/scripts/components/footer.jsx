'use strict';

var React = require('react');
var Reflux = require('reflux');
var Link = require('react-router').Link;
var MetaStore = require('../stores/pageMetaStore');


module.exports = React.createClass({

  mixins: [Reflux.connect(MetaStore)],

  render: function() {
    return (
      <nav className="nav navbar-inverse navbar-fixed-bottom map-footer">
        <div className="container">
          <p className="navbar-text"><strong>⇾</strong> Map Dashboard and Data</p>
        </div>
      </nav>
    );
  }

});
