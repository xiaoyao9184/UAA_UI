'use strict';

angular.module('uaaUIApp')
    .factory('Member', function ($resource) {
        return $resource('api/Groups/:gid/members/:id', {}, {
                'list': {method: 'GET', isArray: true},
                'check': {
                    method: 'GET',
                    transformResponse: function (data) {
                        data = angular.fromJson(data);
                        return data;
                    }
                },
                'add': { method:'POST' },
                'remove':{ method:'DELETE'}
            });
        })
    .factory('MemberType', function (User, $q, $injector) {

        var items = {
            "USER": {
                "resourceName": "User",
                "getName": function(user){
                    return user.userName;
                }
            },
            "GROUP": {
                "resourceName": "Group",
                "getName": function(group){
                    return group.displayName;
                }
            }
        };

        return {
                'getName': function (member) {
                    var deferred = $q.defer();
                    var item = items[member.type];
                    if (angular.isUndefined(item)){
                        return;
                    }
                    if (angular.isDefined(member.entity)) {
                        deferred.resolve(item.getName(member.entity));
                    }else{ 
                        var name = item.resourceName;
                        var resource = $injector.get(name);
                        resource.get({id: member.id}).$promise
                            .then(function (result) {
                                member.entity = result;
                                deferred.resolve(item.getName(member.entity));
                            })
                            .catch(function() {
                                member.entity = undefined;
                                deferred.resolve("UNKNOW");
                            });
                    }
                    return deferred.promise;
                }
            };
        });
