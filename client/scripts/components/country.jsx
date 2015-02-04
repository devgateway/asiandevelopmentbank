'use strict';

var React = require('react');
var Reflux = require('reflux');
var Link = require('react-router').Link;

module.exports  = React.createClass({

  propTypes: {
    id: React.PropTypes.number,
    name: React.PropTypes.string,
    totalCommitments: React.PropTypes.number,
  },

  render: function() {
    return (
      <p>hello</p>
    );
  }

});
