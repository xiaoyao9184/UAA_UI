'use strict';

angular.module('uaaUIApp')
    .controller('GroupManagementController', 
    function ($scope, $stateParams, $filter, 
        Group, GuessSearch) {
        $scope.groups = [];
        $scope.search = $stateParams.search;
        $scope.pageTotal = 0
        $scope.pageNumber = 1;
        $scope.pageSize = 5;
        $scope.loadPage = function (filter) {
            var startIndex = ($scope.pageNumber - 1) * $scope.pageSize + 1
            Group.query({startIndex: startIndex, count: $scope.pageSize, filter: filter}, function (result) {
                $scope.pageTotal = result.totalResults;
                $scope.groups = result.resources;
            });
        };
        $scope.loadPage();

        $scope.clear = function () {
            $scope.group = {};
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };

        GuessSearch.config([
            {
                support: 'string',
                data: {
                    name: function(context){
                        return 'ANY:' + context;
                    },
                    icon: 'glyphicon-search',
                    field: "ANY",
                    operator: "co",
                    value: function(context){
                        return context;
                    }
                }
            },
            {
                support: 'moment',
                data: [{
                    type: 'guess',
                    name: function(context){
                        return 'After ' + context.moment.fromNow();
                    },
                    text: function(context){
                        return context.text;
                    },
                    icon: 'glyphicon-time',
                    field: "lastModified",
                    operator: "ge",
                    value: function(context){
                        return context.moment.toISOString();
                    }
                },
                {
                    name: function(context){
                        return 'Before ' + context.moment.fromNow()
                    },
                    text: function(context){
                        return context.text;
                    },
                    icon: 'glyphicon-time',
                    field: "lastModified",
                    operator: "le",
                    value: function(context){
                        return context.moment.toISOString();
                    }
                },
                {
                    name: function(context){
                        return 'After ' + context.moment.fromNow()
                    },
                    text: function(context){
                        return context.text;
                    },
                    icon: 'glyphicon-time',
                    field: "created",
                    operator: "ge",
                    value: function(context){
                        return context.moment.toISOString();
                    }
                },
                {
                    name: function(context){
                        return 'Before ' + context.moment.fromNow()
                    },
                    text: function(context){
                        return context.text;
                    },
                    icon: 'glyphicon-time',
                    field: "created",
                    operator: "le",
                    value: function(context){
                        return context.moment.toISOString();
                    }
                }]
            },
            {
                support: true,
                data: [{
                    name: 'EXACT',
                    text: 'EXACT',
                    icon: 'glyphicon-random',
                    field: "EXACT",
                    operator: "",
                    value: "with 'AND' operator"
                }]
            }
        ]);
        $scope.filters = GuessSearch.guess();
        $scope.selected = {
            value: []
        }
        $scope.tagging = function(text){
            $scope.filters = GuessSearch.guess(text);
            return {
                name: 'ANY:' + text,
                icon: 'glyphicon-search',
                field: "ANY",
                operator: "co",
                value: text
            };
        }
        $scope.filtering = function(item, model, search){
            var filters = [];
            var find = $filter('filter')(search.selected, {'field':'EXACT'}, true);
            var and = (find.length > 0);
            angular.forEach(search.selected,function(select){
                var filter = '';
                if(select.field === 'EXACT'){
                    return;
                }else if(select.field === 'ANY'){
                    filter = 
                        (and ? '(' : '') +
                        'id co \'' + select.value + '\'' +
                        ' or displayName co \'' + select.value + '\'' +
                        ' or description co \'' + select.value + '\'' +
                        (and ? ')' : '');
                }else{
                    filter = 
                        select.field + ' ' +
                        select.operator + ' ' +
                        (angular.isString(select.value) ? '\'' + select.value + '\'' :  select.value);
                }
                filters.push(filter);
            });

            var filter = filters.join(and ? ' and ' : ' or ');
            $scope.loadPage(filter);
        }
    });
