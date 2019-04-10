'use strict';

angular.module('uaaUIApp')
    .controller('MemberManagementController', function ($scope, $state, $q, $filter, group, MemberType, Group, User, Member) {
        $scope.paths = [];
        $scope.members = [];

        group.$promise.then(function(group){
            var root = {
                type: 'GROUP',
                entity: group,
                value: group.id,
    
                id: group.id,
                members: $scope.members
            };
            MemberType.getName(root)
                .then(function(name){
                    root.name = name;
                });

            $scope.selectItem(root)
                .then(function(members){
                    $scope.members = members;
                });
        });

        $scope.clear = function () {
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };

        $scope.selectItem = function(node, $event) {
            // disable Event bubbling
            if($event){
                $event.stopPropagation();
            }
            if(node.type !== 'GROUP'){   
                return;
            }

            // change paths
            var ps = [];
            createPath(ps,node);
            
            //TODO Comparison change
            $scope.paths = ps;
            $state.current.data.paths = $scope.paths;

            return reflashChildItem(node)
                .then(function(members){
                    if(members.length === 0){
                        node.nochild = true;
                    }else{
                        delete node.nochild;
                        node.show = true;
                    }
                    return members;
                });
        };

        $scope.expandItem = function(node, $event) {
            // disable Event bubbling
            if($event){
                $event.stopPropagation();
            }
            if(node.members === null && !node.show){
                reflashChildItem(node)
                    .then(function(members){
                        if(members.length === 0){
                            node.nochild = true;
                        }else{
                            delete node.nochild;
                            node.show = true;
                        }
                    });
            }else{
                if(node.members.length === 0){
                    
                }else{
                    node.show = !node.show;
                }
            }
        };
        
        var createPath = function(paths, member){
            paths.unshift(member);
            if(typeof member.father !== 'undefined'){
                createPath(paths, member.father);
            }
        };

        var reflashChildItem = function(node) {
            var deferred = $q.defer();

            var mapping_node = function (members) {
                var member_nodes = [];
                angular.forEach(members, function(member){
                    var member_node = {
                        id: member.value,
                        type: member.type,
                        name: '',
                    };

                    MemberType.getName(member)
                        .then(function(name){
                            member_node.name = name;
                        });
                    //Comparison change
                    var old = $filter('filter')(node.members, {'id':member_node.id});
                    if(old != null && old.length === 1 && typeof old[0] !== 'undefined'){
                        member_node.members = old[0].members;
                        member_node.show = old[0].show;
                    }else{
                        member_node.members = null;
                        member_node.show = false;
                    }
                    member_node.father = node;
                    member_nodes.push(member_node);
                });
                return member_nodes;
            };

            Member.list({gid: node.id, returnEntities: true}).$promise
                .then(mapping_node)
                .then(function(members){
                    node.members = members;
                    deferred.resolve(members);
                })
                .catch(function(res){
                    if(res.status === 404){
                        //when delete zone 
                        //the switching scopes member relationship will not be deleted
                        Member.list({gid: node.id, returnEntities: false}).$promise
                            .then(mapping_node)
                            .then(function(members){
                                node.members = members;
                                deferred.resolve(members);
                            })
                    }else{
                        deferred.reject(res);
                    }
                })

            return deferred.promise;
        };

        $state.reflash = function(result){
            var path = $scope.paths.slice(-1)[0];
            $scope.selectItem(path)
                .then(function(members){
                    if($scope.paths.length === 1){
                        $scope.members = members;
                    }
                });
        };
    });
