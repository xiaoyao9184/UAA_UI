'use strict';

angular.module('uaaUIApp')
    .controller('ClientManagementController', 
    function ($scope, $q, $state, $filter,
        Client, ClientMeta, 
        Group, IdentityProvider,
        AlertService, Base64, SetUtils, GRANTS, GROUPS) {
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

        
        $scope.getScopeLabel = function(scope, autoapprove){
            if(SetUtils.hasItem(autoapprove,'true')){
                return 'label-success';
            }
            if(scope.indexOf('*') != -1){
                return 'label-danger';
            }
            if(autoapprove.indexOf(scope) != -1){
                return 'label-success';
            }
            return 'label-primary';
        };
        $scope.getScopeIcon = function(scope, autoapprove){
            if(SetUtils.hasItem(autoapprove,'true')){
                return 'glyphicon-ok';
            }
            if(scope.indexOf('*') != -1){
                return 'glyphicon-asterisk';
            }
            if(autoapprove.indexOf(scope) != -1){
                return 'glyphicon-ok';
            }
            return 'glyphicon-folder-close';
        }
        $scope.getScopeTipIndex = function(scope, autoapprove){
            if(SetUtils.hasItem(autoapprove,'true')){
                return 0;
            }
            if(scope.indexOf('*') != -1){
                return 1;
            }
            if(autoapprove.indexOf(scope) != -1){
                return 0;
            }
            return 2;
        };
        $scope.goGroupListOrDetail = function(displayName){
            var wild = false;
            var operator = 'eq';
            if(displayName.indexOf('*') !== -1){
                wild = true;
                operator = 'co';
                displayName = displayName.replace('*','');
            }

            Group.query({filter: 'displayname ' + operator + ' \'' + displayName + '\''}, function (result) {
                var find = $filter('filter')(result.resources, {'displayName':displayName}, !wild);
                if(find.length === 1){
                    $state.go("group-management-detail",{id: find[0].id});
                }else if(find.length > 1){
                    $state.go("group-management",{search: displayName});
                }else{
                    AlertService.warning('<strong>UI: </strong>' + displayName + ' is not Group!',{timeout:1000000});
                }
            });
        };
        $scope.goIdentityProviderDetail = function(originKey){
            IdentityProvider.query({}, function (result) {
                var find = $filter('filter')(result, {'originKey':originKey}, true);
                if(find.length === 1){
                    $state.go("identity-provider-detail",{id: find[0].id, type: find[0].type});
                }else{
                    AlertService.warning('<strong>UI: </strong>' + originKey + ' is not Identity Provider!');
                }
            });
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
