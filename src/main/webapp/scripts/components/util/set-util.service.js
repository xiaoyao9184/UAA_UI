/*jshint bitwise: false*/
'use strict';

angular.module('uaaUIApp')
    .service('SetUtils', function () {
        this.addItem = function(listOrMap, item) {
            if(angular.isUndefined(listOrMap) ||
                listOrMap === null){
                return;
            }
            if(angular.isArray(listOrMap) &&
                angular.isArray(item)){
                for (var i=0; i<item.length; i++){
                    listOrMap.push(item[i]);
                }
            }else if(angular.isArray(listOrMap)){
                listOrMap.push(item);
            }else{
                listOrMap[item.key] = item.value
            }
        }
    
        this.deleItem = function(listOrMap, index) {
            if(angular.isUndefined(listOrMap) ||
                listOrMap === null){
                return;
            }
            if(angular.isArray(listOrMap)){
                listOrMap.splice(index,1);
            }else{
                var key = index;
                delete listOrMap[key];
            }
        }
    
        this.hasItem = function(listOrMap, item) {
            if(angular.isUndefined(listOrMap) ||
                listOrMap === null){
                return false;
            }
            if(angular.isArray(listOrMap)){
                var index = listOrMap.indexOf(item);
                return index !== -1
            }else{
                return item in listOrMap;
            }
        }
    
        this.toggleItem = function(listOrMap, item) {
            if(angular.isUndefined(listOrMap) ||
                listOrMap === null){
                return;
            }
            if(angular.isArray(listOrMap)){
                if(this.hasItem(listOrMap,item)){
                    var index = listOrMap.indexOf(item);
                    listOrMap.splice(index,1);
                    return
                }
                listOrMap.push(item);
            }else{
                if(this.hasItem(listOrMap,item)){
                    this.deleItem(listOrMap,item);
                    return
                }
                this.addItem(listOrMap,item);
            }
        }
    });

