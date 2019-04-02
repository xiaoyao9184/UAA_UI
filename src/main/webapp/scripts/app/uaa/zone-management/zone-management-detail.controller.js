'use strict';

angular.module('uaaUIApp')
    .controller('ZoneManagementDetailController', 
    function ($scope, $state, $q, $filter, ZoneHolder, entity, Group, ZONE_SCOPES) {
        $scope.zone = entity;

        $q.all([ZoneHolder.current(),$scope.zone.$promise])
            .then(function(zone){
                $scope.isZoneMode = (zone[0].id === zone[1].id);
            });
        
        $scope.exitZoneMode = function(){
            ZoneHolder.reset();
            $state.go('home', null, { reload: true });
        };

        $scope.ui = {
            groups: []
        };
        $scope.hasGroup = function(group){
            return !!group.has;
        }
        $scope.toggleGroup = function(group){
            if(group.has){
                Group.delete({id: group.has.id},
                    function () {
                        group.has = undefined;
                    });
            }else{
                Group.save({
                    displayName: group.name,
                    description: group.description
                }, function(result){
                    group.has = result;
                });
            }
        };

        var init = function() {
            var promise;
            if(angular.isUndefined($scope.zone.$promise)){
                var deferred = $q.defer();
                deferred.resolve($scope.zone);
                promise = deferred.promise;
            }else{
                promise = $scope.zone.$promise;
            }
            promise.then(function(zone){
                angular.forEach(ZONE_SCOPES, function(scope){
                    var group = {
                        title: scope.template.replace('zones.<zone id>.',''),
                        name: scope.template.replace('<zone id>',zone.id),
                        description: scope.description,
                        has: undefined
                    };
                    $scope.ui.groups.push(group);
                    Group.query({filter: 'displayname eq \'' + group.name + '\''}, function (result) {
                        var find = $filter('filter')(result.resources, {'displayName':scope.name}, true);
                        if(find.length === 1){
                            group.has = find[0];
                        }
                    });
                });
            });
        };

        init();
    });
