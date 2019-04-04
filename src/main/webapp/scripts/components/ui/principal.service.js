'use strict';

angular.module('uaaUIApp')
    .factory('Principal', function Principal($q, $filter, UserInfo) {
        var _identity,
            _authenticated = false,
            _token,
            _zone,
            _uaaLogin = false;

        var that = {
            isIdentityResolved: function () {
                return angular.isDefined(_identity);
            },
            isAuthenticated: function () {
                return _authenticated;
            },
            isUAALogin: function(){
                return _uaaLogin;
            },
            isClient: function(){
                return angular.isDefined(_token) &&
                    _token.grant_type === 'client_credentials';
            },
            isRedirect: function(){
                return angular.isDefined(_token) &&
                    (_token.grant_type === 'authorization_code' ||
                    _token.grant_type === 'implicit');
            },
            //Using uaa zone client to manage other zone
            isSwitchingZone: function(){
                if (!_token || !_zone) {
                    return false;
                }
                return _token.zid !== _zone.id &&
                    that.canSwitchingZone(_zone.id);
            },
            canSwitchingZone: function(zoneId){
                if (!_authenticated || !_token) {
                    return false;
                }
                if(zoneId === 'uaa'){
                    return false;
                }
                var find = $filter('filter')(_token.scope, 'zones.' + zoneId + '.');
                return find.length > 0;
            },
            userName: function() {
                return that.identity().then(function(_id) {
                    if(_id == null){
                        return 'UNKNOW';
                    }
                    return _id.user_name;
                }, function(err){
                    return 'UNKNOW';
                });
            },
            hasScope: function (scope) {
                if (!_authenticated || !_token) {
                    return false;
                }
                if (that.isSwitchingZone()) {
                    scope = 'zones.' + _token.zid + '.' + scope;
                }
                return _token.scope.indexOf(scope);
            },
            hasAnyScope: function (scopes) {
                if (!_authenticated || !_token) {
                    return false;
                }
                if (that.isSwitchingZone()) {
                    scope = 'zones.' + _token.zid + '.' + scope;
                }

                for (var i = 0; i < scopes.length; i++) {
                    if (_token.scope.indexOf(scopes[i]) !== -1) {
                        return true;
                    }
                }

                return false;
            },
            hasAuthority: function (authority) {
                if (!_authenticated || !_token) {
                    return false;
                }
                if (that.isSwitchingZone()) {
                    authority = 'zones.' + _token.zid + '.' + authority;
                }

                return _token.aud.indexOf(authority);
            },
            hasAnyAuthority: function (authorities) {
                if (!_authenticated || !_token) {
                    return false;
                }
                if (that.isSwitchingZone()) {
                    authority = 'zones.' + _token.zid + '.' + authority;
                }

                for (var i = 0; i < authorities.length; i++) {
                    if (_token.aud.indexOf(authorities[i]) !== -1) {
                        return true;
                    }
                }

                return false;
            },
            uaaLogin: function(flag){
                _uaaLogin = flag;
            },
            token: function(token){
                _token = token;
                if(that.isRedirect()){
                    _uaaLogin = true;
                }

                if(that.isClient()){
                    that.authenticate({
                        user_name: token.client_id
                    });
                }else{
                    that.userName();
                }
                return that;
            },
            zone: function(zone){
                _zone = zone;
                return that;
            },
            authenticate: function (identity) {
                _identity = identity;
                _authenticated = typeof identity !== 'undefined';
            },
            identity: function (force) {
                var deferred = $q.defer();

                if (force === true) {
                    _identity = undefined;
                }

                // check and see if we have retrieved the identity data from the server.
                // if we have, reuse it by immediately resolving
                if (angular.isDefined(_identity)) {
                    deferred.resolve(_identity);

                    return deferred.promise;
                }

                // retrieve the identity data from the server, update the identity object, and then resolve.
                UserInfo.get().$promise
                    .then(function (info) {
                        if (angular.isUndefined(info.user_name)) {
                            _identity = undefined;
                            _authenticated = false;
                            deferred.reject(null);
                            return;
                        }
                        _identity = info;
                        _authenticated = true;
                        deferred.resolve(_identity);
                    })
                    .catch(function() {
                        _identity = undefined;
                        _authenticated = false;
                        deferred.reject(null);
                    });
                return deferred.promise;
            }
        };

        return that;
    });
