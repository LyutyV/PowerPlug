(function () {
    'use strict';
    angular
        .module('powerPlug').directive('optionsTab', function () {
            return {
                templateUrl: '../../../views/powerplan/settingsTabs/options.html',     
                scope: {
                    jsonobject: '='
                },
                link: function (scope, element, attrs) {
                    if (typeof (scope.jsonobject) != 'undefined') {
                        scope.force = scope.jsonobject.force;
                        scope.logoff = scope.jsonobject.logoff;
                        if (typeof (scope.jsonobject.message) == 'undefined' || scope.jsonobject.message == false) {
                            scope.message = false;
                        } else {
                            scope.message = true
                        }
                    }
                    scope.$on('saveSettings', function (event, data) {
                        scope.jsonobject.force   = scope.force;
                        scope.jsonobject.logoff  = scope.logoff;
                        scope.jsonobject.message = scope.message;
                    });
                }
            }
        })
}());