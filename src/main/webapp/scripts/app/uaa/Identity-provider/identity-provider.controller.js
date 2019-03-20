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
            $scope.provider = {};
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };
    });
