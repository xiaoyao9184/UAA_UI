'use strict';

angular.module('uaaUIApp')
    .controller('UserManagementController', function ($scope, $stateParams, User) {
        $scope.users = [];
        $scope.search = $stateParams.search;
        $scope.pageTotal = 0
        $scope.pageNumber = 1;
        $scope.pageSize = 5;
        $scope.loadPage = function () {
            var filter = 
                'id co \'' + $scope.search + '\'' +
                ' or userName co \'' + $scope.search + '\'' +
                ' or email co \'' + $scope.search + '\'';
            if($scope.search.length === 0){
                filter = null
            }
            var startIndex = ($scope.pageNumber - 1) * $scope.pageSize + 1
            User.query({startIndex: startIndex, count: $scope.pageSize, filter: filter}, function (result) {
                $scope.pageTotal = result.totalResults;
                $scope.users = result.resources;
            });
        };

        $scope.loadPage();

        $scope.setActive = function (user, isActivated) {
            user.active = isActivated;
            User.update({id: user.id}, user, function () {
                $scope.loadAll();
                $scope.clear();
            });
        };

        $scope.clear = function () {
            $scope.user = {};
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };
    });
