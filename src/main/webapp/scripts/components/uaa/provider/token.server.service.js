'use strict';

angular.module('uaaUIApp')
    .factory('TokenServerProvider', function ($http, $window, $location, $q, Base64, Setting) {
        return {
            refresh: function(credentials) {
                var data = "client_id=" + encodeURIComponent(credentials.clientId) 
                    + "&client_secret=" + encodeURIComponent(credentials.clientSecret) 
                    + "&grant_type=refresh_token" 
                    //TODO not jwt format
                    // + "&token_format=opaque"
                    + "&refresh_token=" + credentials.token;
                
                return $http.post('api/oauth/token', data, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Accept": "application/json",
                        "Authorization": "Basic " + Base64.encode(credentials.clientId + ':' + credentials.clientSecret)
                    }
                });
            },
            client: function(credentials) {
                var data = "grant_type=client_credentials";
                return $http.post('api/oauth/token', data, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Accept": "application/json",
                        "Authorization": "Basic " + Base64.encode(credentials.clientId + ':' + credentials.clientSecret)
                    }
                });
            },
            password: function(credentials) {
                var data = "username=" +  encodeURIComponent(credentials.username) 
                    + "&password=" + encodeURIComponent(credentials.password) 
                    + "&grant_type=password";
                return $http.post('api/oauth/token', data, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Accept": "application/json",
                        "Authorization": "Basic " + Base64.encode(credentials.clientId + ':' + credentials.clientSecret)
                    }
                });
            },
            passcode: function(credentials) {
                var data = "passcode=" +  encodeURIComponent(credentials.passcode) 
                    + "&grant_type=password";
                return $http.post('api/oauth/token', data, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Accept": "application/json",
                        "Authorization": "Basic " + Base64.encode(credentials.clientId + ':' + credentials.clientSecret)
                    }
                });
            },
            authorization_code: function(credentials){
                var data = "client_id=" + encodeURIComponent(credentials.clientId) 
                    + "&redirect_uri=" + encodeURIComponent(credentials.redirect_uri) 
                    + "&grant_type=authorization_code&code=" + credentials.code;
                return $http.post('api/oauth/token', data, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Accept": "application/json",
                        "Authorization": "Basic " + Base64.encode(credentials.clientId + ':' + credentials.clientSecret)
                    }
                });                
            },
            start_implicit: function(credentials,$scope){
                var response_type = credentials.response_type || 'token'
                var data = "client_id=" + encodeURIComponent(credentials.clientId) 
                    + "&redirect_uri=" + encodeURIComponent(credentials.redirect_uri) 
                    + "&response_type=" + response_type 
                    + "&state=" + credentials.state;
                var uaa_auth_url = credentials.auth_url + '?' + data

                if(Setting.get().authWindowType === 'popup'){
                    var authWindow = $window.open(uaa_auth_url, 'UAA-Auth-Window', 
                        Setting.get().authWindowParam);

                    var that = this
                    var deferred = $q.defer();
                    var listener = $scope.$root.$on('$messageIncoming', function (event, data){
                        var data = angular.fromJson(data);
                        //TODO
                        delete data.origin

                        that.end_data(data)
                            .then(function(token){
                                listener();
                                authWindow.close();
                                deferred.resolve(token);
                            })
                            .catch(function(err){
                                deferred.reject(err);
                            })
                    });
                    
                    return deferred.promise;
                }
            },
            start_authorization_code: function(credentials,$scope){
                var response_type = credentials.response_type || 'code'

                var data = "client_id=" + encodeURIComponent(credentials.clientId) 
                    + "&redirect_uri=" + encodeURIComponent(credentials.redirect_uri) 
                    + "&response_type=" + response_type 
                    + "&state=" + credentials.state;
                if(credentials.code !== null &&
                    !angular.isUndefined(credentials.code)){
                    data = data
                        + "&code=" + credentials.code; 
                }
                var uaa_auth_url = credentials.auth_url + '?' + data

                if(Setting.get().authWindowType === 'popup'){
                    var authWindow = $window.open(uaa_auth_url, 'UAA-Auth-Window', 
                        Setting.get().authWindowParam);

                    var that = this
                    var deferred = $q.defer();
                    var listener = $scope.$root.$on('$messageIncoming', function (event, data){
                        var data = angular.fromJson(data);
                        //TODO
                        delete data.origin

                        data.redirect_uri = credentials.redirect_uri
                        that.end_data(data)
                            .then(function(token){
                                listener();
                                authWindow.close();
                                deferred.resolve(token);
                            })
                            .catch(function(err){
                                deferred.reject(err);
                            })
                    });
                    
                    return deferred.promise;
                }
            },
            get_redirect_data: function(stateParams){
                var urlParams = {}
                var searchParams = new URL(location.href).searchParams;
                var arrayParams = Array.from(searchParams.entries());
                angular.forEach(arrayParams, function(param){
                    urlParams[param[0]] = param[1]
                });

                for (var n in stateParams) { 
                    if (stateParams[n] === null) {
                        delete stateParams[n];
                    }
                }

                var params = angular.merge(urlParams,stateParams);
                return params
            },
            end_redirect: function($scope,$window,$stateParams){
                var deferred = $q.defer();

                var data = this.get_redirect_data($stateParams)
                if(data === null){
                    deferred.reject({
                        error: true,
                        error_description: "No redirect."
                    });
                }else if(!angular.isUndefined(data.error)){
                    deferred.reject(data);
                    return deferred.promise;
                }else if(Setting.get().authWindowType === 'popup' && 
                    $window.operer !== null && 
                    angular.isUndefined($window.operer)){
                    //check this is popup auth window
                    //post massage back
                    $scope.$emit(
                        '$messageOutgoing',
                        angular.toJson(data)
                    );
                    deferred.reject({
                        error: false,
                        error_description: "Redirect data post back to opener window. waiting for auto close."
                    });
                }else{
                    //TODO other windowType
                    deferred.resolve(data);
                }
                return deferred.promise;
            },
            end_data: function(data){
                var deferred = $q.defer();
                if(data.code !== null &&
                    !angular.isUndefined(data.code)){ 
                    var setting = Setting.get()
                    var uaa = {
                        url: setting.url,
                        clientId: setting.clientId,
                        clientSecret: setting.clientSecret,
                        code: data.code,
                        redirect_uri: data.redirect_uri
                    }
                    this.authorization_code(uaa)
                        .then(function(res){
                            deferred.resolve(res.data);
                        })
                        .catch(function(err){
                            deferred.resolve(err);
                        });
                } else if(data.access_token !== null &&
                    !angular.isUndefined(data.access_token)){
                    data.expires_in = parseInt(data.expires_in)
                    deferred.resolve(data);
                }
                return deferred.promise;
            }
        };
    });
