'use strict';

angular.module('uaaUIApp')
    .controller('GroupManagementController', function ($scope, $stateParams, Group) {
        $scope.groups = [];
        $scope.search = $stateParams.search;
        $scope.pageTotal = 0
        $scope.pageNumber = 1;
        $scope.pageSize = 5;
        $scope.loadPage = function () {
            var filter = 
                'id co \'' + $scope.search + '\'' +
                ' or displayName co \'' + $scope.search + '\'' +
                ' or description co \'' + $scope.search + '\'';
            if($scope.search.length === 0){
                filter = null
            }
            var startIndex = ($scope.pageNumber - 1) * $scope.pageSize + 1
            Group.query({startIndex: startIndex, count: $scope.pageSize, filter: filter}, function (result) {
                $scope.pageTotal = result.totalResults;
                $scope.groups = result.resources;
            });
        };
        $scope.loadPage();

        $scope.clear = function () {
            $scope.group = {};
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };
    });
