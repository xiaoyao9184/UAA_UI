'use strict';

angular.module('uaaUIApp')
	.controller('SAMLServiceProviderDeleteController', function($scope, $uibModalInstance, entity, SAMLServiceProvider) {

        $scope.provider = entity;
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function (id) {
            SAMLServiceProvider.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };

    });
