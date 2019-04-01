'use strict';

angular.module('uaaUIApp').controller('UserManagementInviteController',
    ['$scope', '$stateParams', '$uibModalInstance', '$filter', 'clipboard', 'UserInvite', 'Setting',
        function($scope, $stateParams, $uibModalInstance, $filter, clipboard, UserInvite, Setting) {

       
        var onSaveSuccess = function (result) {
            $scope.isSaving = false;
            result.new_invites.concat(result.failed_invites).forEach(function(new_invite){
                var find = $filter('filter')($scope.invites, {'email':new_invite.email}, true);
                if(find.length === 1){
                    var i = find[0];
                    i = angular.merge(i, new_invite);
                    i.done = true;
                }
            });
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.params = {
            client_id: Setting.get().clientId,
            redirect_uri: Setting.get().url
        };
        $scope.invites = [
            { email: '', done: false }
        ];

        $scope.addInvite = function() {
            $scope.invites.push({ email: '', done: false });
        };

        $scope.deleInvite = function(index) {
            $scope.invites.splice(index,1);
        };

        $scope.save = function () {
            $scope.isSaving = true;

            var body = {
                emails: []
            };
            $scope.invites.forEach(function(invite){
                body.emails.push(invite.email);
            });

            UserInvite.invite(
                $scope.params, 
                body,
                onSaveSuccess, onSaveError);
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

        
        $scope.copyText = clipboard.copyText;
}]);
