'use strict';

angular.module('uaaUIApp')
    .controller('IdentityProviderController', function ($scope, IdentityProvider) {
        $scope.providers = [];
        $scope.loadAll = function () {
            IdentityProvider.query({}, function (result) {
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
