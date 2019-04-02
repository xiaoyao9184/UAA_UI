'use strict';

angular.module('uaaUIApp').controller('ZoneManagementEditController',
    ['$scope', '$q', '$http', '$uibModalInstance', 'entity', 'Zone', 'MFAProvider', 'IdentityProvider', 'Base64', 'SetUtils', 'HTTP_METHIDS', 'HTTP_HEADERS',
        function($scope, $q, $http, $uibModalInstance, entity, Zone, MFAProvider, IdentityProvider, Base64, SetUtils, HTTP_METHIDS, HTTP_HEADERS) {

        $scope.zone = entity;

        var onSaveSuccess = function (result) {
            $scope.isSaving = false;
            $uibModalInstance.close(result);
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        var save_processors = {
            'branding': function(){
                if(Object.keys($scope.branding.consent).length === 0){
                    $scope.branding.consent = null;
                }
                
                $scope.branding.productLogo = $scope.imageModelToBase64($scope.branding_productLogo);
                $scope.branding.squareLogo = $scope.imageModelToBase64($scope.branding_squareLogo);
                $scope.branding.banner.logo = $scope.imageModelToBase64($scope.branding_banner_logo);
            }
        };
        $scope.save = function () {
            $scope.isSaving = true;

            angular.forEach(save_processors,function(processor){
                processor();
            });
            
            if (angular.isDefined($scope.zone.$promise)) {
                Zone.update({id: $scope.zone.id}, $scope.zone, onSaveSuccess, onSaveError);
            } else {
                Zone.save($scope.zone, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.addItem = SetUtils.addItem;
        $scope.deleItem = SetUtils.deleItem;
        $scope.hasItem = SetUtils.hasItem;
        $scope.toggleItem = SetUtils.toggleItem;


        //Token Policy
        $scope.time_units = {
            'S': {
                'to': function(original){
                    return original;
                },
                'from': function(value){
                    return value;
                }
            },
            'M': {
                'to': function(original){
                    return original / 60;
                },
                'from': function(value){
                    return value * 60;
                }
            },
            'H': {
                'to': function(original){
                    return original / 3600;
                },
                'from': function(value){
                    return value * 3600;
                }
            },
            'D': {
                'to': function(original){
                    return original / 86400;
                },
                'from': function(value){
                    return value * 86400;
                }
            }
        };
        $scope.changeUnit = function(object,unit,units) {
            var last_unit = object.last_unit;
            var original = units[last_unit].from(object.value);
            object.value = units[unit].to(original);
            object.last_unit = unit;
        };
        $scope.assignmentUnit = function(object,units) {
            var now_unit = object.unit;
            var original = units[now_unit].from(object.value);
            object.original = original;
            if(angular.isUndefined(original)){
                return 0;
            }
            return original;
        };

        
        //CORS Policy
        $scope.http = {
            methods: HTTP_METHIDS,
            headers: HTTP_HEADERS
        };


        //Branding
        $scope.base64ToImageModel = function(base64,model){
            var deferred = $q.defer();
            if(angular.isUndefined(base64) || base64 === null){
                deferred.reject('undefined base64 param');
                return deferred.promise;
            }
            if(angular.isUndefined(model)){
                model = {};
            }

            var content = Base64.decode(base64);
            if(/data:.*\/.*;base64,/g.test(content)){
                model.format = 'dataUrl';
                model.url = content;
                deferred.resolve(model);
            }else{
                model.format = 'base64';
                model.url = "data:image/png;base64," + base64;
                deferred.resolve(model);
            }
            return deferred.promise;
        };
        $scope.fileToImageModel = function(file,model){
            var deferred = $q.defer();
            if(angular.isUndefined(file)){
                deferred.reject('undefined file');
                return deferred.promise;
            }
            if(angular.isUndefined(model)){
                model = {};
            }
        
            var reader = new FileReader();
            reader.onload = function(e){
                $scope.$apply(function() {
                    if(model.default){
                        model.default = false;
                    }
                    model.url = e.target.result;
                    deferred.resolve(model);
                });
            }; 
            reader.readAsDataURL(file);
            return deferred.promise;
        };
        $scope.imageModelToBase64 = function(model){
            if(model.default){
                return null;
            }else if(model.format === 'dataUrl'){
                return Base64.encode(model.url);
            }else if(model.format === 'base64'){
                return model.url.replace(/data:.*\/.*;base64,/g,"");
            }else{
                return null;
            }
        };

        $scope.activeTab = function(num){
            $scope.active = num;
        };


        //Saml
        $scope.changeKey = function(key) {
            $scope.samlConfig.activeKeyId = key;
            $scope.key = $scope.samlConfig.keys[key];
        };


        //MFA
        $scope.providers = {
            mfa: null,
            identity: null
        };
        MFAProvider.query({}, function (result) {
            $scope.providers.mfa = result;
        });
        IdentityProvider.query({}, function (result) {
            $scope.providers.identity = result;
        });

        
        //Raw
        $scope.initRawConfig = function() {
            $scope.config = JSON.stringify($scope.zone.config,null,"  ");
            // if (angular.isDefined($scope.zone.$promise)) {
            //     $scope.zone.$promise.then(function(zone){
                    
            //     });
            // }else{
            //     // $scope.config = {};
            // }
        };
        $scope.configChange = function() {
            $scope.zone.config = JSON.parse($scope.config);
        };

        
        var init_processors = {
            'tokenPolicy': function(){
                $scope.tokenPolicy_accessTokenValidity = {
                    last_unit: 'S',
                    unit: 'S',
                    value: $scope.tokenPolicy.accessTokenValidity,
                    original: $scope.tokenPolicy.accessTokenValidity
                };
                $scope.tokenPolicy_refreshTokenValidity = {
                    last_unit: 'S',
                    unit: 'S',
                    value: $scope.tokenPolicy.refreshTokenValidity,
                    original: $scope.tokenPolicy.refreshTokenValidity
                };
            },
            'clientSecretPolicy': function(){
                
            },
            'corsPolicy': function(){
                angular.merge(
                    $scope.corsPolicy,
                    {
                        defaultConfiguration: {
                            allowedHeaders: [],
                            allowedMethods: [],
                            allowedOriginPatterns: [],
                            allowedOrigins: [],
                            allowedUriPatterns: [],
                            allowedUris: []
                        },
                        xhrConfiguration: {
                            allowedHeaders: [],
                            allowedMethods: [],
                            allowedOriginPatterns: [],
                            allowedOrigins: [],
                            allowedUriPatterns: [],
                            allowedUris: []
                        }
                    },
                    $scope.corsPolicy);
            },
            'prompts': function(){
                angular.merge(
                    $scope.prompts,
                    [
                        {name: "username", type: "text", text: "Email"},
                        {name: "password", type: "password", text: "Password"},
                        {name: "passcode", type: "password", text: "Password"}
                    ],
                    $scope.prompts);
            },
            'links': function(){
                angular.merge(
                    $scope.links,
                    {
                        logout: { whitelist: [] },
                        selfService: {}
                    },
                    $scope.links);
            },
            'branding': function(){
                angular.merge(
                    $scope.branding,
                    {
                        footerLinks: {},
                        banner: {},
                        consent: {}
                    },
                    $scope.branding);
                
                $scope.base64ToImageModel($scope.branding.productLogo)
                    .then(function(model){
                        $scope.branding_productLogo = model;
                    })
                    .catch(function(){
                        $http({
                            method: 'GET',
                            url: 'assets/images/product-logo.png',
                            responseType: "blob"
                        }).then(function successCallback(response) {
                            var reader = new FileReader();
                            reader.readAsDataURL(response.data); 
                            reader.onloadend = function() {
                                $scope.branding_productLogo = {
                                    url: reader.result,
                                    format: 'base64',
                                    default: true
                                };
                            };
                        });
                    });
                
                $scope.base64ToImageModel($scope.branding.squareLogo)
                    .then(function(model){
                        $scope.branding_squareLogo = model;
                    })
                    .catch(function(){
                        $http({
                            method: 'GET',
                            url: 'assets/images/square-logo.png',
                            responseType: "blob"
                        }).then(function successCallback(response) {
                            var reader = new FileReader();
                            reader.readAsDataURL(response.data); 
                            reader.onloadend = function() {
                                $scope.branding_squareLogo = {
                                    url: reader.result,
                                    format: 'base64',
                                    default: true
                                };
                            };
                        });
                    });

                $scope.base64ToImageModel($scope.branding.banner.logo)
                    .then(function(model){
                        $scope.branding_banner_logo = model;
                    })
                    .catch(function(){
                        $scope.branding_banner_logo = {
                            url: '',
                            format: 'base64',
                            default: true
                        };
                    });
            },
            'samlConfig': function(){
                angular.merge(
                    $scope.samlConfig,
                    {
                        keys: {}
                    },
                    $scope.samlConfig);
            },
            'mfaConfig': function(){
                angular.merge(
                    $scope.mfaConfig,
                    {
                        identityProviders: []
                    },
                    $scope.mfaConfig);
            },
            'userConfig': function(){
                angular.merge(
                    $scope.userConfig,
                    {
                        defaultGroups: []
                    },
                    $scope.userConfig);
            },
            'other': function(){}
        };
        
        var init = function() {
            var promise;
            if(angular.isUndefined($scope.zone.$promise)){
                var deferred = $q.defer();
                deferred.resolve($scope.zone);
                promise = deferred.promise;
            }else{
                promise = $scope.zone.$promise;
            }
            promise.then(function(zone){
                if(angular.isUndefined(zone.config)){
                    zone.config = {};
                }
                angular.merge(
                    zone.config,
                    {
                        tokenPolicy: {},
                        clientSecretPolicy: {},
                        corsPolicy: {},
                        prompts: [],
                        links: {},
                        branding: {},
                        samlConfig: {},
                        mfaConfig: {},
                        userConfig: {}
                    },
                    zone.config);
                
                angular.forEach(init_processors,function(processor,name){
                    if(name in zone.config){
                        $scope[name] = zone.config[name];
                    }else{
                        $scope[name] = zone.config;
                    }

                    if(angular.isFunction(processor)){
                        processor();
                    }
                });
                
            });
        };

        init();
}]);
