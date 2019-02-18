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
    .factory('MemberType', function (Group, User, $q, $injector) {

        var items = {
            "USER": {
                "resourceName": "User",
                "getName": function(user){
                    return user.userName
                }
            },
            "GROUP": {
                "resourceName": "Group",
                "getName": function(user){
                    return user.displayName
                }
            }
        };

        return {
                'getName': function (member) {
                    var deferred = $q.defer();
                    if (angular.isDefined(member.entity)) {
                        if (member.type === 'USER'){
                            deferred.resolve(member.entity.userName)
                        // }else if (member.type === 'GROUP'){
                        //     deferred.resolve(member.entity.displayName)
                        }else {
                            var item = items[member.type];
                            if (typeof item === 'undefined'){
                                return
                            }
                            deferred.resolve(item.getName(member.entity))
                        }
                    }else{
                        if (member.type === 'USER'){
                            User.get({id: member.id}).$promise
                                .then(function (result) {
                                    member.entity = result;
                                    deferred.resolve(member.entity.userName);
                                })
                                .catch(function() {
                                    member.entity = undefined;
                                    deferred.resolve("UNKNOW");
                                });
                        // }else if (member.type === 'GROUP'){
                        //     Group.get({id: member.id}).$promise
                        //         .then(function (result) {
                        //             member.entity = result;
                        //             deferred.resolve(member.entity.displayName);
                        //         })
                        //         .catch(function() {
                        //             member.entity = undefined;
                        //             deferred.resolve("UNKNOW");
                        //         });
                        }else{
                            var item = items[member.type];
                            if (typeof item === 'undefined'){
                                return
                            }
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
                    }
                    return deferred.promise;
                }
            };
        });
