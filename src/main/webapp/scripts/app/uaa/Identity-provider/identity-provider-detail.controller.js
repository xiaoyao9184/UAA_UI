'use strict';

angular.module('uaaUIApp')
    .controller('IdentityProviderDetailController', 
    function ($scope, $state, $stateParams, $location, $filter,
        IdentityProvider, Setting) {
        
        $scope.types = [
            "uaa",
            "oauth2.0","oidc1.0",
            "keystone",
            "saml",
            "ldap"
        ]
        $scope.isUnknowType = function(type){
            return $scope.types.indexOf(type) === -1
        };

        if(!$scope.isUnknowType($stateParams.type) &&
            $state.current.name.indexOf($stateParams.type) === -1){
            $state.go("identity-provider-detail." + $stateParams.type.replace('.',''))
        }

        var setting = Setting.get();
    
        $scope.provider = {};
        $scope.load = function (id) {
            IdentityProvider.get({id: id, rawConfig: true}, function(result) {
                $scope.provider = result;
            });
        };
        $scope.load($stateParams.id);

        

       


    });
