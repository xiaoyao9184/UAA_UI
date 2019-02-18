'use strict';

angular.module('uaaUIApp')
	.controller('ClientManagementDeleteController', function($scope, $uibModalInstance, entity, Client) {

        $scope.client = entity;
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function (id) {
            Client.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };

    });
