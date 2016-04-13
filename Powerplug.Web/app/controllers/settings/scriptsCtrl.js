/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('ScriptsCtrl',
                     ['$state', '$document', 'ScriptsResource', ScriptsCtrl]);


    function ScriptsCtrl($state, $document, ScriptsResource) {
        var vm = this;
        
        ScriptsResource.detailed.query(function (data) {
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
            var scriptId = ev.target.parentNode.attributes["data-id"].value;
            angular.forEach(vm.scripts, function (value) {
                if (value.scriptId === Number(scriptId)) {
                    vm.currentScriptText = value.scriptText;
                    vm.currentScriptId = value.scriptId;
                }
            });
        }

        vm.changeScriptText = function () {
            angular.forEach(vm.scripts, function (value) {
                if (value.scriptId === vm.currentScriptId) {
                    value.scriptText = vm.currentScriptText;
                }
            });
        }
    }
}());