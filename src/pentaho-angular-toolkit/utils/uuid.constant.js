(function(angular) {
  'use strict';

  /**
   *
   * @namespace utils
   * @memberOf pat
   */
  angular.module('pat.utils').constant('uuid', uuid);

  /**
   *
   *
   */
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  /**
   *
   *
   */
  function uuid() {
    return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
  }

})(window.angular);
