'use strict';

var assign = require('object-assign');
var React = require('react/addons');
var Reflux = require('reflux');


var filters = [
  {
    id: 'country',
    main: true,
    name: 'Country',
    glyphicon: 'globe'
  },
  {
    id: 'sector',
    main: true,
    name: 'Sector',
    glyphicon: 'grain'
  },
  {
    id: 'finance',
    main: true,
    name: 'Finance',
    glyphicon: 'piggy-bank'
  },
  {
    id: 'type-of-assistance',
    main: true,
    name: 'Type of Assistance',
    glyphicon: 'text-size'
  },
  {
    id: 'approval-year',
    main: true,
    name: 'Approval Year',
    glyphicon: 'calendar'
  },
  {
    id: 'advanced-filters',
    main: false,
    name: 'Advanced Filters',
    glyphicon: 'menu-hamburger'
  },
  {
    id: 'basemap',
    main: false,
    name: 'Basemap',
    glyphicon: 'globe',
  },
  {
    id: 'share',
    main: false,
    name: 'Share',
    glyphicon: 'link'
  }
];


var FilterViewActions = Reflux.createActions([
  'activate',
  'deactivate'
]);


var FilterViewStore = Reflux.createStore({
  listenables: FilterViewActions,

  onActivate: function(filterViewId) {
    this.update({currentlyActive: filterViewId});
  },

  onDeactivate: function(filterViewId) {
    if (filterViewId !== this.state.currentlyActive) {
      console.warn('can\'t deactivate not-active filter view', filterViewId);
      return;
    }
    this.update({currentlyActive: null});
  },

  update: function(spec) {
    this.state = assign({}, this.state, spec);
    this.trigger(this.state);
  },

  getInitialState: function() {
    return (this.state = {
      currentlyActive: null
    });
  }
});


var FilterNavButton = React.createClass({
  toggleMe: function(e) {
    if (e) { e.preventDefault() };  // if this is coming from a click event
    if (this.props.active) {
      FilterViewActions.deactivate(this.props.id);
    } else {
      FilterViewActions.activate(this.props.id);
    }
  },

  render: function() {
    var buttonClasses = React.addons.classSet({
      'active': this.props.active,
      'nav-button': true,
      'nav-button-main': this.props.main
    });
    return (
      <li role="presentation" className={buttonClasses}>
        <a href="#" onClick={this.toggleMe}>
          <span className={'glyphicon glyphicon-' + this.props.glyphicon} aria-hidden="true"></span>
          {this.props.name}
        </a>
      </li>
    );
  }
});


var FilterBody = React.createClass({
  render: function() {
    return <h3>{this.props.name}</h3>
  }
});


module.exports = React.createClass({

  mixins: [Reflux.connect(FilterViewStore)],

  render: function() {

    var buttons = filters.map(function(filter) {
      var isActive = filter.id === this.state.currentlyActive;
      return <FilterNavButton key={filter.id} {...filter} active={isActive} />;
    }, this);

    var activeFilter;
    if (this.state.currentlyActive) {
      filters.forEach(function(filter) {
        if (filter.id === this.state.currentlyActive) {
          activeFilter = (
            <div className="filters-body">
              <FilterBody {...filter} />
            </div>
          );
        }
      }, this);
    }

    return (
      <div className="filters">

        <div className="filters-nav">
          <h3 className="filters-title">
            <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
            Quick Filters
          </h3>

          <ul className="nav nav-stacked filters-nav-buttons">
            {buttons}
          </ul>
        </div>

        {activeFilter}

      </div>
    );
  }

});
