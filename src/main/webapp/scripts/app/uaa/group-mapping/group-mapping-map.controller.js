'use strict';

angular.module('uaaUIApp').controller('GroupMappingMapController',
    ['$scope', '$q', '$uibModalInstance', '$filter', 'Group', 'GroupMapping', 'IdentityProvider',
        function($scope, $q, $uibModalInstance, $filter, Group, GroupMapping, IdentityProvider) {
        
        $scope.mapping = { origin: 'ldap'};

        var onSaveSuccess = function (result) {
            $scope.isSaving = false;
            $uibModalInstance.close(result);
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            GroupMapping.save($scope.mapping, onSaveSuccess, onSaveError);
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };


        $scope.selected = {
            value: []
        };
        $scope.filters = [];
        $scope.tagging = function(text){
            var filters = [{
                group: 'Prompting',
                icon: 'glyphicon-hourglass',
                name: 'Searching.....'
            }];
            $scope.filters.length = 0;
            angular.merge($scope.filters,filters);

            var filter = "id co 'openid' or displayName co 'openid' or description co 'openid'";
            filter = filter.replaceAll('openid',text);
            Group.query({startIndex: 1, count: 5, 
                filter: filter}, function (result) {
                var filters = [];
                if(result.totalResults == 0){
                    filters.push({
                        group: 'Prompting',
                        icon: 'glyphicon-search',
                        name: 'Empty'
                    });
                } else {
                    angular.forEach(result.resources,function(group){
                        filters.push({
                            group: 'ExternalGroup',
                            icon: 'glyphicon-folder-close',
                            name: group.displayName,
                            field: "id",
                            operator: "is",
                            value: group.id
                        });
                    });
                }
                $scope.filters.length = 0;
                angular.merge($scope.filters,filters);
            });
            
            //if return the ui-select-choices will auto close
            return filters;
        };
        $scope.select = function(item,select){
            $scope.mapping.groupId = item.value;
            $scope.selected.value = [ item ];
        };
        $scope.remove = function(item){
            $scope.mapping.groupId = null;
        };

        var init = function() {
            IdentityProvider.query({}, function (result) {
                $scope.providers = result;
            });
        };

        init();
}]);
