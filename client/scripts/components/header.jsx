'use strict';

var React = require('react');
var Reflux = require('reflux');
var Link = require('react-router').Link;
var MetaStore = require('../stores/pageMetaStore');


module.exports  = React.createClass({

  mixins: [Reflux.connect(MetaStore)],

  render: function() {
    return (
      <header className="map-header">
        <h1>
          <Link to="international">AsDB Phase II</Link>
          <small>» {this.state.title}</small>
        </h1>
      </header>
    );
  }

});
