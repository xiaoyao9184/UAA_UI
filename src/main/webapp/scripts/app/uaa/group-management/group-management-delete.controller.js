'use strict';

angular.module('uaaUIApp')
	.controller('GroupManagementDeleteController', function($scope, $uibModalInstance, entity, Group) {

        $scope.group = entity;
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function (id) {
            Group.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };

    });
