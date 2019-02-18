'use strict';

angular.module('uaaUIApp')
    .controller('ServerInfoController', function ($scope, Info) {

        Info.get().$promise
            .then(function (info) {
                $scope.serverInfo = info;
            });
            
    });
