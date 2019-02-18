'use strict';

angular.module('uaaUIApp')
	.controller('UserManagementDeleteController', function($scope, $uibModalInstance, entity, User) {

        $scope.user = entity;
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function (id) {
            User.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };

    });
