'use strict';

angular.module('uaaUIApp')
    .factory('ZoneHolder', function (Zone, localStorageService, $q) {
        var _current = undefined
        var _uaa = true;

        restoreZone();

        function restoreZone(){
            _current = localStorageService.get("zone")
            _uaa = (_current === null || _current.id === 'uaa');
        }
        function is_uaa(){
            return _uaa;
        }
        function now(){
            var deferred = $q.defer();

            if(_current === null){
                changeZone('uaa')
                    .then(function(zone){
                        deferred.resolve(zone);
                    })
            }else{
                deferred.resolve(_current);
            }

            return deferred.promise;
        }
        function nowName(){
            var deferred = $q.defer();
            now().then(function(zone){
                deferred.resolve(zone.name);
            })
            return deferred.promise;
        }
        function changeZone(id){
            if(_current !== null && 
                _current.id === id){
                var deferred = $q.defer();
                deferred.resolve(_current);
                return deferred.promise;
            }else{
                return Zone.get({id: id}).$promise
                    .then(function(zone){
                        localStorageService.set("zone",zone);
                        _uaa = (zone.id === 'uaa');
                        _current = zone
                    });
            }
        }
        function resetZone(){
            localStorageService.remove("zone");
            _uaa = true;
            _current = null;
        }

        return {
            isUAA: is_uaa,
            current: now,
            name: nowName,
            change: changeZone,
            reset: resetZone
        }
    });

