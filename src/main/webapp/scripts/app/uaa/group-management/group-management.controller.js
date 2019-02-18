'use strict';

angular.module('uaaUIApp')
    .controller('GroupManagementController', function ($scope, Group, ParseLinks) {
        $scope.groups = [];

        $scope.page = 1;
        $scope.size = 5;
        $scope.loadAll = function () {
            var startIndex = ($scope.page - 1) * $scope.size + 1
            Group.query({startIndex: startIndex, count: $scope.size}, function (result, headers) {
                if(headers('link') && headers('X-Total-Count')){
                    $scope.links = ParseLinks.parse(headers('link'));
                    $scope.totalItems = headers('X-Total-Count');
                    $scope.groups = result;
                }else{
                    //TODO not
                    // $scope.links = ParseLinks.parse(headers('link'));
                    $scope.totalItems = result.totalResults;
                    $scope.groups = result.resources;
                }
            });
        };

        $scope.loadPage = function () {
            $scope.loadAll();
        };
        $scope.loadAll();

        $scope.clear = function () {
            $scope.group = {
                id: null, displayName: null, description: null, zoneId: null
            };
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };
    });
