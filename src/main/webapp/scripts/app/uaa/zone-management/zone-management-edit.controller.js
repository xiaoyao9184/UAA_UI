'use strict';

angular.module('uaaUIApp').controller('ZoneManagementEditController',
    ['$scope', '$q', '$http', '$uibModalInstance', 'entity', 'Zone', 'MFAProvider', 'IdentityProvider', 'Base64', 'Setting',
        function($scope, $q, $http, $uibModalInstance, entity, Zone, MFAProvider, IdentityProvider, Base64, Setting) {

        $scope.setting = Setting.get();
        $scope.zone = entity;
        var onSaveSuccess = function (result) {
            $scope.isSaving = false;
            $uibModalInstance.close(result);
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            // if(typeof $scope.zone.config === 'string'){
            //     $scope.zone.config = JSON.parse($scope.zone.config)
            // }

            angular.forEach($scope.before_save_processors,function(processor,name){
                processor();
            });
            
            if ($scope.zone.id != null) {
                Zone.update({id: $scope.zone.id}, $scope.zone, onSaveSuccess, onSaveError);
            } else {
                // $scope.zone.langKey = 'en';
                Zone.save($scope.zone, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };


        $scope.initRawConfig = function() {
            $scope.zone.$promise.then(function(zone){
                $scope.config = JSON.stringify(zone.config,null,"  ");
            })
        };
        $scope.configChange = function() {
            $scope.zone.config = JSON.parse($scope.config)
        };


        $scope.http = {
            methods: [
                'GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'TRACE'
            ],
            headers: [
                'Accept', 
                'Accept-Charset', 
                'Accept-Encoding', 
                'Accept-Language', 
                'Accept-Ranges', 
                'Access-Control-Allow-Credentials', 
                'Access-Control-Allow-Headers', 
                'Access-Control-Allow-Methods', 
                'Access-Control-Allow-Origin', 
                'Access-Control-Expose-Headers', 
                'Access-Control-Max-Age', 
                'Access-Control-Request-Headers', 
                'Access-Control-Request-Method', 
                'Age', 
                'Allow', 
                'Authorization', 
                'Cache-Control', 
                'Connection', 
                'Content-Encoding', 
                'Content-Disposition', 
                'Content-Language', 
                'Content-Length', 
                'Content-Location', 
                'Content-Range', 
                'Content-Type', 
                'Cookie', 
                'Date', 
                'ETag', 
                'Expect', 
                'Expires', 
                'From', 
                'Host', 
                'If-Match', 
                'If-Modified-Since', 
                'If-None-Match', 
                'If-Range', 
                'If-Unmodified-Since', 
                'Last-Modified', 
                'Link', 
                'Location', 
                'Max-Forwards', 
                'Origin', 
                'Pragma', 
                'Proxy-Authenticate', 
                'Proxy-Authorization', 
                'Range', 
                'Referer', 
                'Retry-After', 
                'Server', 
                'Set-Cookie', 
                'Set-Cookie2', 
                'TE', 
                'Trailer', 
                'Transfer-Encoding', 
                'Upgrade', 
                'User-Agent', 
                'Vary', 
                'Via', 
                'Warning', 
                'WWW-Authenticate'
            ]
        };

        $scope.time_units = {
            'S': {
                'to': function(original){
                    return original
                },
                'from': function(value){
                    return value
                }
            },
            'M': {
                'to': function(original){
                    return original / 60
                },
                'from': function(value){
                    return value * 60
                }
            },
            'H': {
                'to': function(original){
                    return original / 3600
                },
                'from': function(value){
                    return value * 3600
                }
            },
            'D': {
                'to': function(original){
                    return original / 86400
                },
                'from': function(value){
                    return value * 86400
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
                return 0
            }
            return original;
        };


        $scope.after_init_processors = {
            'tokenPolicy': function(){
                $scope.tokenPolicy_accessTokenValidity = {
                    last_unit: 'S',
                    unit: 'S',
                    value: $scope.tokenPolicy.accessTokenValidity,
                    original: $scope.tokenPolicy.accessTokenValidity
                }
                $scope.tokenPolicy_refreshTokenValidity = {
                    last_unit: 'S',
                    unit: 'S',
                    value: $scope.tokenPolicy.refreshTokenValidity,
                    original: $scope.tokenPolicy.refreshTokenValidity
                }
            },
            'links': function(){
                if($scope.links.logout.whitelist === null ||
                    angular.isUndefined($scope.links.logout.whitelist)){
                    $scope.links.logout.whitelist = []
                }
            },
            'branding': function(){
                if($scope.branding.footerLinks === null ||
                    angular.isUndefined($scope.branding.footerLinks)){
                    $scope.branding.footerLinks = {}
                }
                if($scope.branding.banner === null ||
                    angular.isUndefined($scope.branding.banner)){
                    $scope.branding.banner = {}
                }
                if($scope.branding.consent === null ||
                    angular.isUndefined($scope.branding.consent)){
                    $scope.branding.consent = {}
                }
                
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
                                }
                            }
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
                                }
                            }
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
                        }
                    });
            }
        };

        $scope.init = function(name,object) {
            $scope.zone.$promise.then(function(zone){
                if(name in zone.config){
                    $scope[name] = zone.config[name];
                }else if(angular.isDefined(object)){
                    zone.config[name] = object;
                    $scope[name] = zone.config[name];
                }else{
                    $scope[name] = zone.config;
                }

                var processor = $scope.after_init_processors[name];
                if(angular.isFunction(processor)){
                    processor();
                };
            })
        };

        $scope.before_save_processors = {
            'branding': function(){
                if(Object.keys($scope.branding.consent).length === 0){
                    $scope.branding.consent = null
                }
                
                $scope.branding.productLogo = $scope.imageModelToBase64($scope.branding_productLogo);
                $scope.branding.squareLogo = $scope.imageModelToBase64($scope.branding_squareLogo);
                $scope.branding.banner.logo = $scope.imageModelToBase64($scope.branding_banner_logo);
            }
        };

        $scope.addItem = function(listOrMap, item) {
            if(angular.isUndefined(listOrMap)){
                return;
            }
            if(angular.isArray(listOrMap)){
                listOrMap.push(item);
            }else{
                listOrMap[item.key] = item.value
            }
        }

        $scope.deleItem = function(listOrMap, index) {
            if(angular.isUndefined(listOrMap)){
                return;
            }
            if(angular.isArray(listOrMap)){
                listOrMap.splice(index,1);
            }else{
                var key = index;
                delete listOrMap[key];
            }
        };

        $scope.hasItem = function(listOrMap, item) {
            if(angular.isUndefined(listOrMap)){
                return;
            }
            if(angular.isArray(listOrMap)){
                var index = listOrMap.indexOf(item);
                return index !== -1
            }else{
                return item in listOrMap;
            }
        };

        $scope.toggleItem = function(listOrMap, item) {
            if(angular.isUndefined(listOrMap)){
                return;
            }
            if(angular.isArray(listOrMap)){
                if($scope.hasItem(listOrMap,item)){
                    var index = listOrMap.indexOf(item);
                    listOrMap.splice(index,1);
                    return
                }
                listOrMap.push(item);
            }else{
                if($scope.hasItem(listOrMap,item)){
                    $scope.deleItem(listOrMap,item);
                    return
                }
                $scope.addItem(listOrMap,item);
            }
        };

        $scope.changeKey = function(key) {
            $scope.samlConfig.activeKeyId = key;
            $scope.key = $scope.samlConfig.keys[key]
        }

        $scope.providers = {
            mfa: null,
            identity: null
        }
        MFAProvider.query({}, function (result) {
            $scope.providers.mfa = result;
        });
        IdentityProvider.query({}, function (result, headers) {
            $scope.providers.identity = result;
        });

        $scope.timerToDate = function(timer,date) {
            var d = new Date((timer + new Date().getTimezoneOffset() * 60)*1000)
            if(angular.isDefined(date)){
                date = d
                $scope.$apply();
            }
            return d;
        }

        $scope.dateToTimer = function(date,timer) {
            var t = date.getTime() / 1000 - new Date().getTimezoneOffset() * 60
            if(angular.isDefined(timer)){
                timer = t
                $scope.$apply();
            }
            return t;
        }
        $scope.increment = function(count) {
            count = count + 1;
        };
        $scope.decrement = function() {
            count = count - 1;
        };


        $scope.base64ToImageModel = function(base64,model){
            var deferred = $q.defer();
            if(angular.isUndefined(base64) || base64 === null){
                deferred.reject('undefined base64 param')
                return deferred.promise;
            }
            if(angular.isUndefined(model)){
                model = {};
            }

            var content = Base64.decode(base64)
            if(/data:.*\/.*;base64,/g.test(content)){
                model.format = 'dataUrl';
                model.url = content;
                deferred.resolve(model);
            }else{
                model.format = 'base64';
                model.url = "data:image/png;base64," + base64
                deferred.resolve(model);
            }
            return deferred.promise;
        };
        $scope.fileToImageModel = function(file,model){
            var deferred = $q.defer();
            if(angular.isUndefined(file)){
                deferred.reject('undefined file')
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
        }
        
        $scope.activeTab = function(num){
            $scope.active = num
        }
        

        Object.byString = function(o, s) {
            s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
            s = s.replace(/^\./, '');           // strip a leading dot
            var a = s.split('.');
            for (var i = 0, n = a.length; i < n; ++i) {
                var n = a[i];
                if (n in o) {
                    o = o[n];
                } else {
                    return;
                }
            }
            return o;
        }
}]);
