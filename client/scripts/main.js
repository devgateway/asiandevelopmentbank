'use strict';
var React = require('react');
var router = require('./router.jsx').get();  // function indirection to avoid circular import issues


router.run(function(Handler, state) {
  React.render(React.createElement(Handler, state), document.getElementById('app-wrapper'));
});