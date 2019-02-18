'use strict';

angular.module('uaaUIApp')
    .factory('Principal', function Principal($q, UserInfo) {
        var _identity,
            _authenticated = false,
            _token,
            _uaaLogin = false;

        return {
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
                    _token.grant_type === 'client_credentials'
            },
            isRedirect: function(){
                return angular.isDefined(_token) &&
                    (_token.grant_type === 'authorization_code' ||
                    _token.grant_type === 'implicit')
            },
            userName: function() {
                return this.identity().then(function(_id) {
                    if(_id == null){
                        return 'UNKNOW';
                    }
                    return _id.user_name;
                }, function(err){
                    return 'UNKNOW';
                });
            },
            hasAuthority: function (authority) {
                if (!_authenticated) {
                    return $q.when(false);
                }

                return this.identity().then(function(_id) {
                    return _id.authorities && _id.authorities.indexOf(authority) !== -1;
                }, function(err){
                    return false;
                });
            },
            hasAnyAuthority: function (authorities) {
                if (!_authenticated || !_identity || !_identity.authorities) {
                    return false;
                }

                for (var i = 0; i < authorities.length; i++) {
                    if (_identity.authorities.indexOf(authorities[i]) !== -1) {
                        return true;
                    }
                }

                return false;
            },
            uaaLogout(){
                _uaaLogin = false
            },
            token: function(token){
                _token = token
                if(this.isRedirect()){
                    _uaaLogin = true
                }

                if(this.isClient()){
                    this.authenticate({
                        user_name: token.client_id
                    })
                }else{
                    this.userName()
                }
                return this;
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
                        _identity = info;
                        _authenticated = true;
                        deferred.resolve(_identity);
                    })
                    .catch(function() {
                        _identity = undefined;
                        _authenticated = false;
                        deferred.resolve(null);
                    });
                return deferred.promise;
            }
        };
    });