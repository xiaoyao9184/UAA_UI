'use strict';

angular.module('uaaUIApp')
    .controller('GroupManagementDetailController', function ($scope, $stateParams, Group) {
        $scope.group = {};
        $scope.load = function (id) {
            Group.get({id: id}, function(result) {
                $scope.group = result;
            });
        };
        $scope.load($stateParams.id);
    });
