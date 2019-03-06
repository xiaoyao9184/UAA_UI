'use strict';

angular.module('uaaUIApp')
    .controller('MFAProviderDetailController', 
    function ($scope, $state, $stateParams, $location, $filter,
        MFAProvider, Setting) {
        
        $scope.provider = {};
        $scope.load = function (id) {
            MFAProvider.get({id: id}, function(result) {
                $scope.provider = result;
            });
        };
        $scope.load($stateParams.id);

    });
