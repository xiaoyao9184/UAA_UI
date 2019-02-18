'use strict';

angular.module('uaaUIApp')
    .controller('UserManagementController', function ($scope, User, ParseLinks) {
        $scope.users = [];

        $scope.page = 1;
        $scope.size = 5;
        $scope.loadAll = function () {
            var startIndex = ($scope.page - 1) * $scope.size + 1
            User.query({startIndex: startIndex, count: $scope.size}, function (result, headers) {
                if(headers('link') && headers('X-Total-Count')){
                    $scope.links = ParseLinks.parse(headers('link'));
                    $scope.totalItems = headers('X-Total-Count');
                    $scope.users = result;
                }else{
                    //TODO not
                    // $scope.links = ParseLinks.parse(headers('link'));
                    $scope.totalItems = result.totalResults;
                    $scope.users = result.resources;
                }
            });
        };

        $scope.loadPage = function () {
            $scope.loadAll();
        };
        $scope.loadAll();

        $scope.setActive = function (user, isActivated) {
            user.active = isActivated;
            User.update({id: user.id}, user, function () {
                $scope.loadAll();
                $scope.clear();
            });
        };

        $scope.clear = function () {
            $scope.user = {
                id: null, login: null, firstName: null, lastName: null, email: null,
                activated: null, langKey: null, createdBy: null, createdDate: null,
                lastModifiedBy: null, lastModifiedDate: null, resetDate: null,
                resetKey: null, authorities: null
            };
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };
    });
