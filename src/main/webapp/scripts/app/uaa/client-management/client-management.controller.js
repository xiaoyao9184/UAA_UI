'use strict';

angular.module('uaaUIApp')
    .controller('ClientManagementController', 
    function ($scope, $state, $filter,
        Client, ClientMeta, 
        Group, IdentityProvider,
        AlertService, Base64, SetUtils, Search, GRANTS, GROUPS) {
        $scope.apps = [];
        $scope.loadAllApp = function () {
            return ClientMeta.query().$promise
                .then(function(result){
                    $scope.apps = result;
                    angular.forEach(result, function(app){
                        var content = Base64.decode(app.appIcon);
                        if(/data:.*\/.*;base64,/g.test(content)){
                            app.appIconUrl = content;
                        }else{
                            app.appIconUrl = "data:image/png;base64," + app.appIcon;
                        }
                    });
                });
        };

        $scope.clients = [];
        $scope.search = '';
        $scope.pageTotal = 0;
        $scope.pageNumber = 1;
        $scope.pageSize = 5;
        $scope.loadPage = function (filter,sortBy,sortOrder) {
            var startIndex = ($scope.pageNumber - 1) * $scope.pageSize + 1;
            Client.query({startIndex: startIndex, count: $scope.pageSize, 
                filter: filter, sortBy: sortBy, sortOrder: sortOrder}, function (result) {
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
        };
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
                $scope.grants[value] = grant;
            }
        });

        
        $scope.selected = {
            value: []
        };
        $scope.filters = Search.init(
            $scope.loadPage,
            $scope.selected,
            [{
                name: 'ID',
                field: "client_id",
                sort: true,
                any: true
            },{
                name: 'Url',
                field: "web_server_redirect_uri",
                url: true,
                any: true
            },{
                name: 'Scope',
                field: "scope",
                any: true,
                enum: (function(){
                    var groups = [];
                    angular.forEach(GROUPS,function(group){
                        var item = {
                            group: 'Scope',
                            icon: "glyphicon-folder-close",
                            name: group,
                        };
                        item.field = "scope",
                        item.operator = 'co';
                        item.value = group;
                        groups.push(item);
                    });
                    return groups;
                })()
            },{
                name: 'Grant',
                field: "authorized_grant_types",
                any: true,
                enum: (function(){
                    var grants = [];
                    angular.forEach(GRANTS,function(grant){
                        if(grant.grant){
                            var item = {
                                group: 'Grant',
                                icon: "glyphicon-tag"
                            };
                            angular.merge(item,grant);
                            item.field = "authorized_grant_types",
                            item.operator = 'co';
                            item.value = grant.value ? grant.value: grant.name;
                            grants.push(item);
                        }
                    });
                    return grants;
                })()
            },{
                name: 'LastModified',
                field: "lastModified",
                moment: true,
                sort: true
            }],
            [{
                support: function(text){
                    return !!text && text.indexOf('.') !== -1;
                },
                data: {
                    group: 'Scope',
                    icon: 'glyphicon-folder-close',
                    name: Search.usingText,
                    field: "scope",
                    operator: "co",
                    value: Search.usingText
                }
            }]
        );
        $scope.tagging = Search.tagging;
        $scope.filtering = Search.filtering;
        $scope.pagging = Search.refreshing;
    });
