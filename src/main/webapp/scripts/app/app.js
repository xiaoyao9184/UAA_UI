'use strict';

angular.module('uaaUIApp', [
    'ngResource', 'ngCookies', 'ngAria', 'ngCacheBuster', 'ngFileUpload', 'ngPostMessage', 
    'ui.bootstrap', 'ui.router', 
    'infinite-scroll', 'LocalStorageModule', 
    'angular-loading-bar', 'angular-clipboard', 'file'])

    .run(function ($rootScope, $location, $window, $http, $state, Principal, ENV, VERSION) {
        
        $rootScope.ENV = ENV;
        $rootScope.VERSION = VERSION;
        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams, fromState, fromParams) {
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;

            var hash = $location.hash();
            if (hash) {
                toParams['#'] = hash;
            }
            
        });

        $rootScope.$on('$stateChangeSuccess',  function(event, toState, toParams, fromState, fromParams) {

            var titleKey = 'UaaUI' ;

            // Remember previous state unless we've been redirected to login or we've just
            // reset the state memory after logout. If we're redirected to login, our
            // previousState is already set in the authExpiredInterceptor. If we're going
            // previousState is already set in the authExpiredInterceptor. If we're going
            // to login directly, we don't want to be sent to some previous state anyway
            if (toState.name != 'login' && $rootScope.previousStateName) {
              $rootScope.previousStateName = fromState.name;
              $rootScope.previousStateParams = fromParams;
            }

            // Set the page title key to the one configured in state or use default one
            if (toState.data.pageTitle) {
                titleKey = toState.data.pageTitle;
            }
            $window.document.title = titleKey;
        });

        $rootScope.istokendpresent = function(){
            return $rootScope.uaatokendetails ? true : false;
        }

        // $rootScope.parseJwt = function(token) {
        //     var base64Url = token.split('.')[1];
        //     var base64 = base64Url.replace('-', '+').replace('_', '/');
        //     return JSON.parse($window.atob(base64));
        // }
        $rootScope.back = function() {
            // If previous state is 'activate' or do not exist go to 'home'
            if ($rootScope.previousStateName === 'activate' || $state.get($rootScope.previousStateName) === null) {
                $state.go('home');
            } else {
                $state.go($rootScope.previousStateName, $rootScope.previousStateParams);
            }
        };
    })
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider,
      httpRequestInterceptorCacheBusterProvider, AlertServiceProvider) {
        // uncomment below to make alerts look like toast
        //AlertServiceProvider.showAsToast(true);

        //Cache everything except rest api requests
        httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*api.*/, /.*protected.*/], true);

        $urlRouterProvider.otherwise('/');
        $urlRouterProvider.rule(function ($injector, $location) {
            var path = $location.path(),
            normalized = path.toLowerCase();
            if (path !== normalized) {
               return normalized;
            }
        });
        $stateProvider.state('site', {
            'abstract': true,
            views: {
                'navbar@': {
                    templateUrl: 'scripts/components/navbar/navbar.html',
                    controller: 'NavbarController'
                }
            }
        });

        $httpProvider.interceptors.push('errorHandlerInterceptor');
        $httpProvider.interceptors.push('zoneInterceptor');
        $httpProvider.interceptors.push('authExpiredInterceptor');
        $httpProvider.interceptors.push('authInterceptor');
        // $httpProvider.interceptors.push('notificationInterceptor');
        
    })
    .config(['$urlMatcherFactoryProvider', function($urlMatcherFactory) {
        $urlMatcherFactory.type('boolean', {
            name : 'boolean',
            decode: function(val) { return val == true ? true : val == "true" ? true : false },
            encode: function(val) { return val ? 1 : 0; },
            equals: function(a, b) { return this.is(a) && a === b; },
            is: function(val) { return [true,false,0,1].indexOf(val) >= 0 },
            pattern: /bool|true|0|1/
        });
    }]);;
