'use strict';

angular.module('uaaUIApp').controller('ClientManagementMetaController',
    ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'ClientMeta', 'Base64', 
        function($scope, $stateParams, $uibModalInstance, entity, ClientMeta, Base64) {

        $scope.client = entity;
        $scope.file = null;
        $scope.imageUrl = null;
        $scope.imageFormat = true;

        entity.$promise.then(function(client){
            var content = Base64.decode(client.appIcon);
            if(/data:.*\/.*;base64,/g.test(content)){
                $scope.imageUrl = content;
                $scope.imageFormat = true;
            }else{
                $scope.imageUrl = "data:image/png;base64," + client.appIcon;
                $scope.imageFormat = false;
            }
        });

        $scope.imageIsLoaded = function(e){
            $scope.$apply(function() {
                $scope.imageUrl = e.target.result;
                if(/data:image\/png;base64,/g.test($scope.imageUrl)){
                    $scope.imageFormat = false;
                }else{
                    $scope.imageFormat = true;
                }
            });
        };

        $scope.flashIcon = function(){
            var reader = new FileReader();
            reader.onload = $scope.imageIsLoaded; 
            reader.readAsDataURL($scope.file);
        };

        var onSaveSuccess = function (result) {
            $scope.isSaving = false;
            $uibModalInstance.close(result);
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            if($scope.imageFormat){
                $scope.client.appIcon = Base64.encode($scope.imageUrl);
            }else{
                $scope.client.appIcon = $scope.imageUrl.replace(/data:.*\/.*;base64,/g,"");
            }
            ClientMeta.update({id: $scope.client.clientId}, $scope.client, onSaveSuccess, onSaveError);
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.disable = function() {
            $scope.isSaving = true;
            $scope.client.appIcon = null;
            $scope.client.appLaunchUrl = null;
            $scope.client.showOnHomePage = false;
            ClientMeta.update({id: $scope.client.clientId}, $scope.client, onSaveSuccess, onSaveError);
        };

}]);
