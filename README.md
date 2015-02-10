AsDB GIS Dashboard
==================

Local Dev Setup
---------------

### Prerequisites

 1. [**nodejs**](http://nodejs.org/)

    The project requires the nodejs javascript runtime to compile assets.

 2. [**grunt**](http://gruntjs.com/)

    ```bash
    $ npm install -g grunt
    ```

    Dev and build tasks are handled by the grunt task runner

 3. [**bower**](http://bower.io/)

    ```bash
    $ npm install -g bower
    ```

    Front-end library dependencies are handled by bower

 4. **dependencies**

    nodejs dependencies:

    ```bash
    (asdb-gis-dashboard/) $ npm install
    ```

    front-end dependencies:

    ```bash
    (asdb-gis-dashboard/) $ bower install
    ```


#### Recommended:

  * [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) browser extension for chrome

  * [LiveReload](http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-) browser extension for chrome, firefox, and safari


### Running the dev environment

Once you have all of the prerequisites installed, you can run the project locally:

```bash
(asdb-gis-dashboard/) $ grunt serve
```

...and then open [localhost:9010](http://localhost:9010/) in a browser.

That command will continue to run in the background, reloading and recompiling files as they change. If you have installed the LiveReload browser extension, your web browser will automatically refresh when you save files.


Tools Used
----------

  * [browserify](http://browserify.org/) for javascript modules (eg. `var react = require('react');`).
  * [react](https://facebook.github.io/react/) javascript component UI framework and jsx
  * [react router](https://github.com/rackt/react-router/) does some magic to map URLs to views of the app, rendering the correct components.
  * [reflux](https://github.com/spoike/refluxjs) event and data flow via Actions and Stores
  * [leaflet](http://leafletjs.com/) for the map


### Routing Quickstart

This project uses [react-router](https://github.com/rackt/react-router/) for URL routing, which integrates with `react` and also handles rendering the right components for us. The best documentation is available from React Router itself, but here is a very quick AsDB-GIS-specific overview to get started:

#### Routes ([router.jsx](client/scripts/router.jsx))

React Router provides JSX components to model your URL hierarchy and the components responsible for rendering a given page.

The route setup for country views of this project looks [something like](client/scripts/router.jsx):

```jsx
var RootComponent = require('./components/root.jsx');
var InternationalComponent = require('./components/international.jsx');
var CountryComponent = require('./components/country.jsx');

var routes = (
  <Route name="main" path="/" handler={RootComponent}>
    <DefaultRoute handler={InternationalComponent} />
    <Route name="country" path="/countries/:countryId" handler={CountryComponent} />
  </Route>
);
```

This **nested** structure is a little different from most URL routing libraries: multiple handlers will usually be involved in rendering a single page. The page at `/` will involve [`RootComponent`](client/scripts/components/root.jsx) and [`InternationalComponent`](client/scripts/components/international.jsx); `/countries/01234` will involve [`RootComponent`](client/scripts/components/root.jsx) and `CountryComponent`.

The trick here is to use React Router's `<RouteHandler />` somewhere when you render `RootComponent`. React-Router will then insert a child component there according to the routes specification.

The [React Router Guide](https://github.com/rackt/react-router/blob/master/docs/guides/overview.md) has probably a much clearer explanation.

##### Getting URL parameters to child components

URL parameters will be available to the top-level handler in `this.props.params`. Therefore, in our `RootComponent`, when we render `<RouteHandler />`, we just pass our props onto the child components: `<RouteHandler {...this.props} />`.
