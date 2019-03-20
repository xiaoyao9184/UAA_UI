'use strict';

angular.module('uaaUIApp')
    .controller('ClientManagementController', function ($scope, $q, Client, ClientMeta, Base64, GRANTS, GROUPS) {
        $scope.apps = [];
        $scope.loadAllApp = function () {
            return ClientMeta.query().$promise
                .then(function(result){
                    $scope.apps = result;
                    angular.forEach(result, function(app){
                        var content = Base64.decode(app.appIcon)
                        if(/data:.*\/.*;base64,/g.test(content)){
                            app.appIconUrl = content;
                        }else{
                            app.appIconUrl = "data:image/png;base64," + app.appIcon
                        }
                    })
                });
        }

        $scope.clients = [];
        $scope.search = '';
        $scope.pageTotal = 0
        $scope.pageNumber = 1;
        $scope.pageSize = 5;
        $scope.loadPage = function (filter) {
            var startIndex = ($scope.pageNumber - 1) * $scope.pageSize + 1
            Client.query({startIndex: startIndex, count: $scope.pageSize, filter: filter}, function (result) {
                $scope.clients = result.resources;
                $scope.pageTotal = result.totalResults;
            });
        };

        $scope.loadAllApp();
        $scope.loadPage();

        $scope.clear = function () {
            $scope.client = {};
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };


        $scope.grants = {};
        angular.forEach(GRANTS,function(grant){
            if(grant.grant){
                var value = grant.value ? grant.value: grant.name;
                $scope.grants[value] = grant
            }
        });

        $scope.filters = [];
        angular.forEach(GRANTS,function(grant){
            if(grant.grant){
                var item = {
                    icon: "glyphicon-tag"
                };
                angular.merge(item,grant);
                item.field = "authorized_grant_types",
                item.operator = 'co';
                item.value = grant.value ? grant.value: grant.name;
                $scope.filters.push(item);
            }
        });
        angular.forEach(GROUPS,function(group){
            var item = {
                name: group,
                icon: "glyphicon-folder-close"
            };
            item.field = "scope",
            item.operator = 'co';
            item.value = group;
            $scope.filters.push(item);
        });
        

        $scope.selected = {
            value: []
        }
        $scope.tagging = function(text){
            return {
                name: 'ANY:' + text,
                icon: 'glyphicon-search',
                field: "ANY",
                operator: "co",
                value: text
            };
        }
        $scope.selectOne = function(item, model, search){
            var filters = [];
            angular.forEach(search.selected,function(select){
                var filter = '';
                if(select.field === 'ANY'){
                    filter = 
                        '(client_id co \'' + select.value + '\'' + 
                        ' or web_server_redirect_uri co \'' + select.value + '\'' +
                        ' or authorized_grant_types co \'' + select.value + '\'' +
                        ' or scope co \'' + select.value + '\')';
                }else{
                    filter = 
                        select.field + ' ' +
                        select.operator + ' ' +
                        '\'' + select.value + '\''
                }
                
                filters.push(filter);
            });

            var filter = filters.join(' or ');
            $scope.loadPage(filter);
        }
        
    });
