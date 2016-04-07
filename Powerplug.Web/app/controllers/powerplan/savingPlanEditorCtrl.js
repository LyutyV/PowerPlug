(function () {
    'use strict';
    angular
        .module('powerPlug')
        .directive('convertToNumber', function() {
            return {
                require: 'ngModel',
                link: function(scope, element, attrs, ngModel) {
                    ngModel.$parsers.push(function(val) {
                        return val ? parseInt(val, 10) : null;
                    }); 
                    ngModel.$formatters.push(function(val) {
                        return val ? '' + val : null;
                    });
                }
            };
        })
        .controller('SavingPlanEditorCtrl',
                     ['$state', '$stateParams', '$scope', '$animate', '$document', '$mdDialog', '$mdMedia', 'SavingPlansResource', 'ComputersResource', 'ScriptsResource', SavingPlanEditorCtrl]);

    function SavingPlanEditorCtrl($state, $stateParams, $scope, $animate, $document, $mdDialog, $mdMedia, SavingPlansResource, ComputersResource, ScriptsResource) {
        var vm = this;
        var policyId = $stateParams.policyId;

        SavingPlansResource.get({ policyId: policyId }, function (data) {
            onSuccess(data);            
        }, function (err) {
            onError(err);
        });

        function onError(err) {
            console.log(err)
            if (err.status === 401 || err.status === -1) {
                $state.go('login');
            }
        }

        function onSuccess(data) {
            vm.savingPlan = data;

            setOverviewItems(vm);              
            setActionItems(vm);            
            setSavingItems(vm);
            setWorkHoursItems(vm);
            setEventItems(vm);

            console.log(vm.savingPlan);
        }

        setOverviewGraphs(vm);

        //==================================================PopUp=======================================================
        $scope.showAdvanced = function (ev, actionData) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                templateUrl: 'views/powerplan/action.dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                bindToController :true,
                fullscreen: useFullScreen,
                locals: { actionData: actionData },
                controller: DialogController,
            })
            .then(function (answer) {
                 console.log(actionData);
            }, function () {
                console.log(actionData);
            });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };
        function DialogController($scope, $mdDialog, actionData) {
            //Private
            var weekDays = actionData.weekDays;
            var SetDayModel = function (newValue) {
                var dayInBit = newValue;
                weekDays = (dayInBit > 0) ? (weekDays | dayInBit) : (weekDays & dayInBit);
                console.log(weekDays)
                return getDayModel(dayInBit);
            }
            var getDayModel = function (dayInBit) {
                if ((dayInBit & weekDays) == dayInBit) {
                    return dayInBit
                } else return ~dayInBit
            }
            function GetSetDays(newValue) {
                if (arguments.length) {
                    return SetDayModel(newValue, this.dayInBit);
                } else return getDayModel(this.dayInBit)
            }
            //Scope bind
            $scope.daysOfMonth   = actionData.daysOfMonth;
            $scope.KeepMonitorOn = actionData.options.KeepMonitorOn;
            $scope.keepAlive     = actionData.options.keepAlive;
            $scope.specificDate = (typeof actionData.specificDate != 'undefined') ? new Date(actionData.specificDate)    : new Date();
            $scope.timeChosen   = (typeof actionData.fromTime != 'undefined')     ? moment(actionData.fromTime).toDate() : 0;

            $scope.hide = function () { $mdDialog.hide(); };
            $scope.cancel = function () { $mdDialog.cancel()};
            $scope.Add = function () {
                //add data to json
                actionData.scheduleType = $scope.scheduleType;
                switch (actionData.scheduleType) {
                    case 'EveryDay':
                        actionData.scheduleType = 'DayOfWeek';
                        actionData.weekDays = 127;
                        break;
                    case 'DayOfWeek':
                        actionData.weekDays = weekDays;
                        break;
                    case 'DayOfMonth':
                        actionData.daysOfMonth = $scope.daysOfMonth;
                        break;
                    case 'SpecificDate':
                        actionData.specificDate = $scope.specificDate;
                        break;
                }
                actionData.options.KeepMonitorOn = $scope.KeepMonitorOn;
                actionData.options.keepAlive = $scope.keepAlive;
                actionData.fromTime = $scope.timeChosen
                //Hide dialog
                $mdDialog.hide();
            };
            //modify scheduleType if need
            if (actionData.scheduleType == 'DayOfWeek' && actionData.daysConverted.length == 7) {
                actionData.scheduleType == 'EveryDay';
            }
            $scope.scheduleType = actionData.scheduleType;
            $scope.Sunday = {
                dayInBit: 1,
                Value: GetSetDays,
            }
            $scope.Monday = {
                dayInBit: 2,
                Value: GetSetDays,
            }
            $scope.Tuesday = {
                dayInBit: 4,
                Value: GetSetDays,
            }
            $scope.Wednesday = {
                dayInBit : 8,
                Value: GetSetDays
            }
            $scope.Thursday = {
                dayInBit: 16,
                Value: GetSetDays
            }
            $scope.Friday = {
                dayInBit: 32,
                Value: GetSetDays
            }
            $scope.Saturday = {
                dayInBit: 64,
                Value: GetSetDays
            }
        }
        //=================================================EndPopUp=====================================================
               
        //Html Elements Events
        vm.saveChanges = function () {
            updateSavingItems(vm, $document);
            vm.savingPlan.$update(function (data) {
                onSuccess(data);            
            }, function (err) {
                onError(err);
            });
        }

        setEventEvents(vm, $scope, $document, $mdMedia, $mdDialog, ScriptsResource);
        setSavingEvents(vm, $scope, $document, $mdMedia, $mdDialog, ComputersResource);        
    }
}());