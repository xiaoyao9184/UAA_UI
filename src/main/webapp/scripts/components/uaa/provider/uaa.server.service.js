'use strict';

angular.module('uaaUIApp')
    .factory('UAAServerProvider', function apiService($q,Info,Healthz) {

        var _info;
        var _healthy = false;

        return {
            isHealthy: function () {
                return _healthy;
            },
            healthz: function(){
                var deferred = $q.defer();

                Healthz.get().$promise
                    .then(function (res) {
                        if(res.data === 'ok\n'){
                            _healthy = true;
                        }else{
                            _healthy = false;
                        }
                        deferred.resolve(_healthy);
                    })
                    .catch(function(){
                        _healthy = false;
                        deferred.resolve(_healthy);
                    });
                return deferred.promise;
            },
            info: function(force){
                var deferred = $q.defer();

                if (force === true) {
                    _info = undefined;
                }

                if (angular.isDefined(_info)) {
                    deferred.resolve(_info);

                    return deferred.promise;
                }

                Info.get().$promise
                    .then(function (res) {
                        _info = res;
                        _healthy = true;
                        deferred.resolve(_info);
                    })
                    .catch(function() {
                        _info = null;
                        _healthy = false;
                        deferred.resolve(_info);
                    });
                return deferred.promise;
            }
        };
    });
