'use strict';

angular.module('uaaUIApp')
    .controller('UserManagementController', 
    function ($scope, $stateParams, 
        User, Search) {
        $scope.users = [];
        $scope.pageTotal = 0;
        $scope.pageNumber = 1;
        $scope.pageSize = 5;
        $scope.loadPage = function (filter,sortBy,sortOrder) {
            var startIndex = ($scope.pageNumber - 1) * $scope.pageSize + 1;
            User.query({startIndex: startIndex, count: $scope.pageSize, 
                filter: filter, sortBy: sortBy, sortOrder: sortOrder}, function (result) {
                $scope.pageTotal = result.totalResults;
                $scope.users = result.resources;
            });
        };

        $scope.clear = function () {
            $scope.user = {};
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };

        $scope.setActive = function (user, isActivated) {
            user.active = isActivated;
            User.update({id: user.id}, user, function () {
                $scope.loadAll();
                $scope.clear();
            });
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
                sort: true,
                any: true
            },{
                name: 'Name',
                field: "userName",
                sort: true,
                any: true
            },{
                name: 'GivenName',
                field: "givenname",
                sort: true,
                any: true
            },{
                name: 'FamilyName',
                field: "familyname",
                sort: true,
                any: true
            },{
                name: 'Email',
                field: "email",
                email: true,
                sort: true,
                any: true
            },{
                name: 'Status',
                field: "active",
                enum: [{
                    icon: 'glyphicon-lock',
                    name: 'Activated',
                    tags: 'Activated',
                    field: "active",
                    operator: "eq",
                    value: true
                },{
                    icon: 'glyphicon-lock',
                    name: 'Desactivated',
                    tags: 'Desactivated',
                    field: "active",
                    operator: "eq",
                    value: false
                }]
            },{
                name: 'Status',
                field: "verified",
                enum: [{
                    icon: 'glyphicon-flag',
                    name: 'Verified',
                    tags: 'Verified',
                    field: "verified",
                    operator: "eq",
                    value: true
                },{
                    icon: 'glyphicon-flag',
                    name: 'Desverified',
                    tags: 'Desverified',
                    field: "verified",
                    operator: "eq",
                    value: false
                }]
            },{
                name: 'PreviousLogonTime',
                field: "previousLogonTime",
                moment: true,
                sort: true
            },{
                name: 'LastLogonTime',
                field: "lastLogonTime",
                moment: true,
                sort: true
            },{
                name: 'PasswordLastModified',
                field: "passwd_lastmodified",
                moment: true,
                sort: true
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
            }],
            [{
                support: function(text){
                    return !!text && text.indexOf('.') !== -1;
                },
                data: {
                    group: 'Scope',
                    icon: 'glyphicon-folder-close',
                    name: Search.usingText,
                    field: "scope",
                    operator: "co",
                    value: Search.usingText
                }
            }]
        );
        $scope.tagging = Search.tagging;
        $scope.filtering = Search.filtering;
        $scope.pagging = Search.refreshing;


        Search.searching($stateParams.search);
    });
