'use strict';

angular.module('uaaUIApp')
	.controller('IdentityProviderDeleteController', function($scope, $uibModalInstance, entity, IdentityProvider) {

        $scope.provider = entity;
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function (id) {
            IdentityProvider.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };

    });
