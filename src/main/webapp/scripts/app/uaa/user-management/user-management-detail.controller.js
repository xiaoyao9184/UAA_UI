'use strict';

angular.module('uaaUIApp')
    .controller('UserManagementDetailController', function ($scope, $stateParams, User) {
        $scope.user = {};
        $scope.load = function (id) {
            User.get({id: id}, function(result) {
                $scope.user = result;
            });
        };
        $scope.load($stateParams.id);
    });
