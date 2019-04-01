'use strict';

angular.module('uaaUIApp')
    .controller('GroupManagementController', 
    function ($scope, $stateParams, 
        Group, Search) {
        $scope.groups = [];
        $scope.pageTotal = 0;
        $scope.pageNumber = 1;
        $scope.pageSize = 5;
        $scope.loadPage = function (filter,sortBy,sortOrder) {
            var startIndex = ($scope.pageNumber - 1) * $scope.pageSize + 1;
            Group.query({startIndex: startIndex, count: $scope.pageSize, 
                filter: filter, sortBy: sortBy, sortOrder: sortOrder}, function (result) {
                $scope.pageTotal = result.totalResults;
                $scope.groups = result.resources;
            });
        };        

        $scope.clear = function () {
            $scope.group = {};
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };


        $scope.selected = {
            value: []
        };
        $scope.filters = Search.init(
            $scope.loadPage,
            $scope.selected,
            [{
                name: 'ID',
                field: "id",
                moment: false,
                sort: false,
                any: true
            },{
                name: 'DisplayName',
                field: "displayName",
                moment: false,
                sort: true,
                any: true
            },{
                name: 'Description',
                field: "description",
                moment: false,
                sort: false,
                any: true
            },{
                name: 'Created',
                field: "created",
                moment: true,
                sort: true
            },{
                name: 'LastModified',
                field: "lastModified",
                moment: true,
                sort: true
            }]
        );
        $scope.tagging = Search.tagging;
        $scope.filtering = Search.filtering;
        $scope.pagging = Search.refreshing;

        
        Search.searching($stateParams.search);
    });
