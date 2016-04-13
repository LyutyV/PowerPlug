/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('ScriptsCtrl',
                     ['$state', '$document', 'ScriptsResource', ScriptsCtrl]);


    function ScriptsCtrl($state, $document, ScriptsResource) {
        var vm = this;
        
        ScriptsResource.query(function (data) {
            vm.scripts = data;
        }, function (error) {
            if (error.status === 401 || error.status === -1)
            {                
                $state.go('login');
            }
        });
                
        vm.selectScript = function (ev) {
            angular.forEach(angular.element('.script-row'), function (value) {
                value.className = value.className.replace('bg-script-selected', '');
            });

            ev.target.parentNode.className = ev.target.parentNode.className + ' bg-script-selected';
            vm.currentScript = ev.target.parentNode.attributes["data-id"].value;
        }
    }
}());