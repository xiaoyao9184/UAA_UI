'use strict';

angular.module('uaaUIApp')
	.controller('MFAProviderDeleteController', function($scope, $uibModalInstance, entity, MFAProvider) {

        $scope.provider = entity;
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function (id) {
            MFAProvider.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };

    });
