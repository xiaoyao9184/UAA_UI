'use strict';

angular.module('uaaUIApp')
    .controller('ZoneManagementDetailController', function ($scope, $stateParams, Zone) {
        $scope.zone = {};
        $scope.load = function (id) {
            Zone.get({id: id}, function(result) {
                $scope.zone = result;
            });
        };
        $scope.load($stateParams.id);
    });
