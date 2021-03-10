'use strict';

angular.module('uaaUIApp')
    .controller('GroupMappingController', 
    function ($scope, $stateParams, $filter, 
        GroupMapping, Group, IdentityProvider, Search) {
        $scope.mappings = [];
        $scope.pageTotal = 0;
        $scope.pageNumber = 1;
        $scope.pageSize = 5;
        $scope.loadPage = function (externalGroup,origin) {
            var startIndex = ($scope.pageNumber - 1) * $scope.pageSize + 1;
            GroupMapping.query({startIndex: startIndex, count: $scope.pageSize, 
                externalGroup: externalGroup, origin: origin}, function (result) {
                $scope.pageTotal = result.totalResults;
                // $scope.mappings = result.resources;
                // return result.resources;
            }).$promise
            .then(function(result){
                return result.resources;
            })
            .then(mapping_group)
            .then(function(mappings){
                $scope.mappings = mappings;
                return mappings;
            });
        };        

        $scope.clear = function () {
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };

        var mapping_group = function(mappings){
            angular.forEach(mappings, function(mapping){
                var findProviders = $filter('filter')($scope.providers, {'originKey':mapping.origin}, true);
                if(findProviders.length == 1){
                    mapping.idpId = findProviders[0].id;
                }
                Group.get({id: mapping.groupId}, function(result) {
                    mapping.groupName = result.displayName;
                });
            });
            return mappings;
        };

        $scope.selected = {
            value: []
        };
        $scope.filters = [];
        // $scope.filters = Search.init(
        //     $scope.loadPage,
        //     $scope.selected,
        //     []
        // );
        $scope.tagging = function(text){
            var filters = [];
            var findProviders = $filter('filter')($scope.providers, {'originKey':text}, false);
            if(findProviders.length == 1){
                var origin = findProviders[0];
                filters.push({
                    group: 'Origin',
                    icon: 'glyphicon-search',
                    name: 'Origin:' + origin.originKey,
                    field: "origin",
                    operator: "equals",
                    value: origin.originKey
                });
            }
            if(angular.isDefined(text)){
                filters.push({
                    group: 'ExternalGroup',
                    icon: 'glyphicon-search',
                    name: 'ExternalGroup:' + text,
                    field: "externalGroup",
                    operator: "equals",
                    value: text
                });
            }
            
            $scope.filters.length = 0;
            angular.merge($scope.filters,filters);
            //if return the ui-select-choices will auto close
            // return filters;
        };
        $scope.filtering = function(selected){
            var externalGroup, origin;
            var externalGroupFilter = $filter('filter')(selected, {'field':'externalGroup'}, true);
            if(externalGroupFilter.length > 0){
                externalGroup = externalGroupFilter[0].value;
            }

            var originFilter = $filter('filter')(selected, {'field':'origin'}, true);
            if(originFilter.length > 0){
                origin = originFilter[0].value;
            }

            $scope.loadPage(externalGroup,origin);
            $scope.tagging();
        };
        $scope.pagging = function(){
            $scope.filtering($scope.selected.value);
        };

        var init = function() {
            IdentityProvider.query({}, function (result) {
                $scope.providers = result;
            }).$promise
            .then(function(){
                $scope.pagging();
                // Search.searching($stateParams.search);
            });
        };

        init();
    });
