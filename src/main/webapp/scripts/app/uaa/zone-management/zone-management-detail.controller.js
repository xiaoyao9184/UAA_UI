'use strict';

angular.module('uaaUIApp')
    .controller('ZoneManagementDetailController', 
    function ($scope, $state, $q, ZoneHolder, entity) {
        $scope.zone = entity;

        $q.all([ZoneHolder.current(),$scope.zone.$promise])
            .then(function(zone){
                $scope.isZoneMode = (zone[0].id === zone[1].id);
            })
        
        $scope.exitZoneMode = function(){
            ZoneHolder.reset();
            $state.go('home', null, { reload: true });
        };
    });
