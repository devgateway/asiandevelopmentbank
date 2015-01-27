'use strict';

module.exports = {

  ActionTypes: {
    LOAD_COUNTRIES: 'LOAD_COUNTRY',
    LOAD_COUNTRIES_SUCCESS: 'LOAD_COUNTRIES_SUCCESS',
    LOAD_COUNTRIES_FAIL: 'LOAD_COUNTRIES_FAIL',

    CLICK_COUNTRY: 'CLICK_COUNTRY',

    RECEIVE_RAW_COUNTRIES: 'RECEIVE_RAW_COUNTRIES',
  },

  PayloadSources: {
    SERVER_ACTION: 'SERVER_ACTION',
    VIEW_ACTION: 'VIEW_ACTION'
  }

};
