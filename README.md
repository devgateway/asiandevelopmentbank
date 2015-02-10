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
