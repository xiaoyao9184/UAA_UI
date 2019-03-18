'use strict';

angular.module('uaaUIApp')
    .controller('MFAProviderController', function ($scope, MFAProvider) {
        $scope.providers = [];

        $scope.loadAll = function () {
            MFAProvider.query({}, function (result, headers) {
                $scope.providers = result;
            });
        };

        $scope.loadAll();

        $scope.clear = function () {
            $scope.provider = {
                id: null, name: null, type: null, config: null
            };
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };
    });