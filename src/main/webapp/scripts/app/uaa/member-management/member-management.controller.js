'use strict';

angular.module('uaaUIApp')
    .controller('MemberManagementController', function ($scope, $state, $filter, group, MemberType, Group, User, Member) {
        $scope.paths = [];
        $scope.members = [];

        group.$promise.then(function(group){
            var root = {
                type: 'GROUP',
                entity: group,
                value: group.id,
    
                id: group.id,
                members: $scope.members
            }
            MemberType.getName(root)
                .then(function(name){
                    root.name = name
                })

            $scope.selectItem(root)
                .then(function(members){
                    $scope.members = members;
                });
        });

        $scope.clear = function () {
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };

        $scope.selectItem = function(member, $event) {
            // disable Event bubbling
            if($event){
                $event.stopPropagation();
            }
            if(member.type !== 'GROUP'){   
                return
            }

            // change paths
            var ps = [];
            createPath(ps,member);
            
            //TODO Comparison change
            $scope.paths = ps;
            $state.current.data.paths = $scope.paths;

            return getSubItem(member);
        }

        $scope.expandItem = function(member, $event) {
            // disable Event bubbling
            if($event){
                $event.stopPropagation();
            }
            if(member.members == null && !member.show){
                getSubItem(member)
                    .then(function(members){
                        member.show = !member.show;
                    })
            }else{
                member.show = !member.show;
            }
        }
        
        var createPath = function(paths, member){
            paths.unshift(member);
            if(typeof member.father !== 'undefined'){
                createPath(paths, member.father)
            }
        }

        var getSubItem = function(member) {
            return Member.list({gid: member.value}, function (result) {
                result.forEach(element => {
                    element.id = element.value
                    MemberType.getName(element)
                        .then(function(name){
                            element.name = name
                        })
                    //Comparison change
                    var old = $filter('filter')(member.members, {'id':element.id})
                    if(old != null && old.length === 1 && typeof old[0] !== 'undefined'){
                        element.members = old[0].members
                        element.show = old[0].show
                    }else{
                        element.members = null
                        element.show = false
                    }
                    element.father = member
                });
                member.members = result;
            }).$promise;
        }


    });
