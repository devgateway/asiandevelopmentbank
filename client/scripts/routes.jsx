'use strict';

var React = require('react');
var Route = require('react-router').Route;
var DefaultRoute = require('react-router').DefaultRoute;


var Root = require('./components/root.jsx');
var International = require('./components/international.jsx');
var Country = require('./components/country.jsx');
var CountryProjects = require('./components/countryProjects.jsx');
var Project = require('./components/project.jsx');


module.exports = (
  <Route name="main" path="/" handler={Root}>
    <Route name="international" path="/" handler={International} />
    <Route name="country" path="/countries/:countryId" handler={Country}>
      <Route name="country-projects" path="projects/" handler={CountryProjects} />
    </Route>
    <Route name="project" path="/projects/:projectId" handler={Project} />
  </Route>
);
