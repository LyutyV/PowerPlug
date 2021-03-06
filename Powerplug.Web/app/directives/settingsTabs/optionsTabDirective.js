﻿(function () {
    'use strict';
    angular
        .module('powerPlug').directive('optionsTab', ['$uibModal', function ($uibModal) {
            return {
                templateUrl: '../../../views/powerplan/settingsTabs/options.html',
                scope: {
                    jsonobject: '=',
                    saveEvent: '=' //Indcates there is no event that save the data to json .. every change is made will be made on the original json
                },
                link: function (scope, element, attrs) {
                  
                  // This code set's different id for checkboxes
                  function setId(){
                    var inputArr = element.find('input');
                    var labelArr = element.find('label');

                    for (var i = 0; i < labelArr.length; i++) {
                      var rand = Math.random();
                      inputArr[i].setAttribute('id', rand);
                      labelArr[i].setAttribute('for', rand);
                    }
                  };
                  setId();
                  // End this code set's different id for checkboxes

                  scope.specifyMessageDialog = function () {
                      console.log('aaa');
                      $uibModal.open({
                          templateUrl: 'views/powerplan/dialogs/specifyMessage.html',
                          resolve: { },
                          controller: DialogController,
                          backdrop: 'static'
                      })

                      function DialogController($scope, $uibModalInstance, $document) {
                          $scope.upsertSavingApplication = function () {                              
                              $uibModalInstance.close();
                          };

                          $scope.closeSavingApplication = function () {
                              $uibModalInstance.dismiss();
                          };
                      }
                  };

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
        }])
}());
