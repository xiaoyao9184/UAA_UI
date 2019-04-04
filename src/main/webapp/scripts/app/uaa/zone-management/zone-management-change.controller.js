'use strict';

angular.module('uaaUIApp')
	.controller('ZoneManagementChangeController', function($scope, $uibModalInstance, $stateParams, entity, ZoneHolder, Principal) {

        $scope.zone = entity;
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.canSwitchingZone = Principal.canSwitchingZone($stateParams.id);
        $scope.confirmChange = function (id) {
            ZoneHolder.change(id)
                .then(function(zone){
                    var reload = !$scope.canSwitchingZone;
                    $uibModalInstance.close({ reload: true });
                });
        };

    });
