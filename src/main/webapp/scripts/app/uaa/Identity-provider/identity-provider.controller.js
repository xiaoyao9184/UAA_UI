'use strict';

angular.module('uaaUIApp')
    .controller('IdentityProviderController', function ($scope, IdentityProvider) {
        $scope.providers = [];

        $scope.loadAll = function () {
            IdentityProvider.query({}, function (result, headers) {
                $scope.providers = result;
            });
        };

        $scope.loadAll();

        $scope.clear = function () {
            $scope.provider = {
                id: null, type: null, originKey: null, name: null, config: null,
                version: null, active: null, identityZoneId: null, created: null,
                last_modified: null
            };
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };
    });
