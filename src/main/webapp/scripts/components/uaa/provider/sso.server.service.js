'use strict';

angular.module('uaaUIApp')
    .factory('SSOServerProvider', function ($http, $window, $location, $q, Base64, Setting) {
        return {
            start_logout: function(credentials,$scope){
                var data = "client_id=" + encodeURIComponent(credentials.clientId) 
                    + "&redirect=" + encodeURIComponent(credentials.redirect_uri)
                var uaa_logout_url = credentials.url + 'logout.do?' + data

                if(Setting.get().authWindowType === 'popup'){
                    var authWindow = $window.open(uaa_logout_url, 'UAA-Auth-Window', 
                        Setting.get().authWindowParam);

                    var deferred = $q.defer();
                    var listener = $scope.$root.$on('$messageIncoming', function (event, data){
                        listener();
                        authWindow.close();
                        deferred.resolve();
                    });
                    
                    return deferred.promise;
                }
            }
        };
    });