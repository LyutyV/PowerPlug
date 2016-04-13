(function () {
    'use strict';
    angular
        .module('powerPlug').directive('optionsTab', function () {
            return {
                templateUrl: '../../../views/powerplan/settingsTabs/options.html',     
                scope: {
                    jsonobject: '=',
                    saveEvent: '=' //Indcates there is no event that save the data to json .. every change is made will be made on the original json
                },
                link: function (scope, element, attrs) {
                 
                    //copy array appMetrics - init
                    if (!scope.saveEvent) {
                        scope.$watch('jsonobject', function (newValue, oldValue){
                            if (typeof (newValue) != 'undefined') {
                                //copy by ref
                                scope.options = scope.jsonobject;
                                if (typeof (newValue.message) == 'undefined') {
                                    scope.options.messageChecked = false;
                                } else {
                                    scope.options.messageChecked = true
                                }
                            }
                        });
                    } else if (typeof (scope.jsonobject) != 'undefined') {
                        //Copy by Value
                        scope.options = {};
                        scope.options.force = scope.jsonobject.force;
                        scope.options.logoff = scope.jsonobject.logoff;
                        if (typeof (scope.jsonobject.message) == 'undefined' || scope.options.messageChecked == false) {
                            scope.options.messageChecked = false;
                        } else {
                            scope.options.messageChecked = true
                        }
                    }
                    scope.updateMessage = function () {
                        if (scope.options.messageChecked && !scope.jsonobject.message) {
                            scope.options.message = {}
                            scope.options.message.msgDisplaySec = '0';
                            scope.options.message.msgText = "";
                            scope.options.message.msgTitle = "";
                        } else if (!scope.messageChecked) {
                            delete scope.options.message;
                        }
                    }

                    scope.$on('saveSettings', function (event, data) {
                        scope.jsonobject.force = scope.options.force;
                        scope.jsonobject.logoff = scope.options.logoff;
                        if (scope.options.messageChecked && !scope.jsonobject.message) {
                            scope.jsonobject.message = {}
                            scope.jsonobject.message.msgDisplaySec = '0';
                            scope.jsonobject.message.msgText = "";
                            scope.jsonobject.message.msgTitle = "";
                        } else if (!scope.message) {
                            delete scope.jsonobject.message;
                        }
                    });
                }
            }
        })
}());