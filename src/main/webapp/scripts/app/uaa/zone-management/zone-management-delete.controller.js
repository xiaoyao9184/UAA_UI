'use strict';

angular.module('uaaUIApp')
	.controller('ZoneManagementDeleteController', function($scope, $uibModalInstance, entity, Zone) {

        $scope.zone = entity;
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function (id) {
            Zone.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };

    });
