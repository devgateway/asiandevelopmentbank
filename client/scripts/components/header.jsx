'use strict';

var React = require('react');
var Reflux = require('reflux');
var Link = require('react-router').Link;
var MetaStore = require('../stores/pageMetaStore');


module.exports = React.createClass({

  mixins: [Reflux.connect(MetaStore)],

  render: function() {
    return (
      <nav className="nav navbar-inverse navbar-fixed-top map-header">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed">
              <span className="sr-only">Toggle Navigation</span>
              <span className="icon-bar"></span>
            </button>
            <Link to="international" className="navbar-brand">AsDB Phase II</Link>
            <ul className="nav navbar-nav">
              <li className="active"><a>{this.state.title}</a></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }

});
