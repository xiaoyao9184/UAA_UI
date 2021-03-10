'use strict';

angular.module('uaaUIApp')
	.controller('GroupMappingUnmapController', function($scope, $uibModalInstance, entity, GroupMappingById) {

        $scope.mapping = entity;
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function (obj) {
            GroupMappingById.delete({groupId: obj.groupId, externalGroup: obj.externalGroup, origin: obj.origin},
                function () {
                    $uibModalInstance.close(true);
                });
        };

    });
