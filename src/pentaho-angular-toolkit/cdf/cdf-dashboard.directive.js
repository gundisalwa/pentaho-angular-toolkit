( function () {
  'use strict';

  var forEach = angular.forEach,
      isFunction = angular.isFunction,
      equals = angular.equals;

  angular.module( 'vertex.cdf' )
    .directive( 'cdfDashboard' , cdfDashboard );

  // TODO: Add attribute version for single parameter / single event.

  /* @ngInject */
  cdfDashboard.$inject = [ '$parse' , 'CdfHelper'];
  function cdfDashboard ( $parse , CdfHelper ) {
    var directive = {
      bindToController: true,
      controller: CdfDashboardController,
      controllerAs: 'vm',
      restrict: 'EA',
      scope: {
        'path': '@',
        'getParameters' : '&parameters',
        'getEvents': '&events',
        'isDeepWatch': '&deepWatch'
      },
      link: postLink
    };

    /* @ngInject */

    function postLink( scope, element, attrs, controller ) {
      var _watcher;

      scope.$watch( function() { return controller.path; } , handlePathChange  );

      function handlePathChange ( newPath , oldPath ) {
        if ( newPath ) {
          clearWatcher();
          controller.setNewDashboard( newPath , element )
            .then( setParameters )
            .then( addEventsDispatcher )
            .then( controller.render )
            .then( addParametersWatcher )
            ;
        }
      }

      function addParametersWatcher ( dash ) {
        _watcher = scope.$watchCollection( function() {
            return controller.getParameters();
          } , handleParametersChange , isDeepWatch() );

        function handleParametersChange ( newParameters , oldParameters ) {
          var changeParameters = {};
          forEach( newParameters , function ( value , name ) {
            if ( !equals( value , dash.getParameterValue( name ) ) ) {
              dash.fireChange( name, value );
            }
          } );
        }

        return dash;
      }

      function addEventsDispatcher ( dash ) {
        dash.listenTo( dash , 'all' , function ( eventName , eventData ) {
          var callbacks = controller.getEvents() || {};
          if ( callbacks[eventName] ) {
            $parse( callbacks[eventName] )( scope.$parent , {
              name: eventName,
              data: eventData
            } );
          }
        } );
        return dash;
      }

      function clearWatcher (  ) {
        if ( isFunction( _watcher ) ) {
          _watcher();
          _watcher = undefined;
        }
      }

      function setParameters ( dash ) {
        forEach( controller.getParameters() , function ( value , name ) {
          dash.setParameter( name , value );
        } );
        return dash;
      }

      function isDeepWatch () {
        return !!controller.isDeepWatch();
      }

    }
    postLink.$inject = ['scope', 'element', 'attrs', 'controller'];

    return directive;
  }

  // TODO: Move some of the API to the controller, for sharing with other directives
  CdfDashboardController.$inject = [ 'CdfHelper'];
  function CdfDashboardController ( CdfHelper ) {
    var _dash;

    this.setDashboard = setDashboard;
    this.setNewDashboard = setNewDashboard;
    this.getDashboard = getDashboard;
    this.render = render;

    function setDashboard ( dash ) {
      _dash = dash;
      return dash;
    }

    function getDashboard ( ) {
      return _dash;
    }

    function render ( ) {
      return CdfHelper.renderDashboard( getDashboard() );
    }

    function setNewDashboard ( path , element ) {
      return CdfHelper.getNewDashboard( path , element ).then( setDashboard );
    }

  }

} )();