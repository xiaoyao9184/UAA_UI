'use strict';

angular.module('uaaUIApp')
    .factory('SSOServerProvider', function ($http, $window, $location, $interval, $q, Base64, Setting) {
        return {
            start_logout: function(credentials,$scope){
                var data = "client_id=" + encodeURIComponent(credentials.clientId) +
                    "&redirect=" + encodeURIComponent(credentials.redirect_uri);
                var uaa_logout_url = credentials.url + 'logout.do?' + data;

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
            },
            start_autologin: function(credentials){
                var data = "code=" + encodeURIComponent(credentials.code) +
                    "&client_id=" + encodeURIComponent(credentials.clientId);
                var uaa_login_url = credentials.url + 'autologin?' + data;

                if(Setting.get().authWindowType === 'popup'){
                    $window.open(uaa_login_url, 'UAA-Autologin-Window', 
                        Setting.get().authWindowParam);
                }
            },
            start_passcode: function(credentials){
                var uaa_passcode_url = credentials.url + 'passcode';

                if(Setting.get().authWindowType === 'popup'){
                    $window.open(uaa_passcode_url, 'UAA-Passcode-Window', 
                        Setting.get().authWindowParam);
                }
            },
            start_session: function(credentials,$scope){
                var data = "clientId=" + encodeURIComponent(credentials.clientId) +
                    "&messageOrigin=" + encodeURIComponent(credentials.messageOrigin);
                var uaa_url = credentials.url + '?' + data;

                var msg = credentials.clientId + ' ' + credentials.userId;

                var sender = null;

                if(Setting.get().authWindowType === 'popup'){
                    var authWindow = $window.open(uaa_url, 'UAA-Session-Window', 
                        Setting.get().authWindowParam);
                    sender = $interval(function() {
                        authWindow.postMessage(msg, uaa_url);
                    }, 100);

                    var deferred = $q.defer();
                    var listener = $scope.$root.$on('$messageIncoming', function (event, data){
                        $interval.cancel(sender);
                        listener();
                        authWindow.close();
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                }
            }
        };
    });
