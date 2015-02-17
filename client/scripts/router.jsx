'use strict';


// circular import handling: indirection via getter function that is called later
module.exports = {
  get: function() {
    return router;
  }
};


var React = require('react');
var Router = require('react-router');
var Route = require('react-router').Route;
var DefaultRoute = require('react-router').DefaultRoute;


var Root = require('./components/root.jsx');
var International = require('./components/international.jsx');
var Country = require('./components/country.jsx');
var CountryProjects = require('./components/countryProjects.jsx');
var Project = require('./components/project.jsx');


var routes = (
  <Route name="international" path="/" handler={Root}>
    <DefaultRoute handler={International} />
    <Route name="country" path="/countries/:countryId" handler={Country}>
      <Route name="country-projects" path="projects/" handler={CountryProjects} />
    </Route>
    <Route name="project" path="/projects/:projectId" handler={Project} />
  </Route>
);


var router = Router.create({
  routes: routes,
  // location: Router.HistoryLocation  // <- uncomment to enable pushstate (no hash in url)
});
