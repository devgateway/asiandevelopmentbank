'use strict';
var React = require('react');
var Router = require('react-router'); // or var Router = ReactRouter; in browsers
var routes=require('./routes.jsx');


var router = Router.create({
  routes: routes,
 // location: Router.HistoryLocation  // <- uncomment to enable pushstate (no hash in url)
});

window.r = router;


router.run(function(Handler, state) {
  React.render(React.createElement(Handler, state), document.getElementById('app-wrapper'));
});