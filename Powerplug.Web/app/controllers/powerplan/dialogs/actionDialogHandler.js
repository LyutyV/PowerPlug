var actionDialogHandler = {
    vm: {},
    $scope: {},
    init: function (vm, $scope, $uibModal) {
        actionDialogHandler.vm = vm;
        actionDialogHandler.$scope = $scope;
        actionDialogHandler.$uibModal = $uibModal;
    },
   
    setActionDialogItems: function () {
        var I;
        if (actionDialogHandler.vm.savingPlan.actions) {
            actionDialogHandler.vm.savingPlan.actions.forEach(function (actionItem, index, array) {
                if (actionItem.options && actionItem.options.computerMetrics) {
                    actionItem.options.computerMetricsConverted = {};
                    angular.forEach(actionItem.options.computerMetrics, function (value, key) {
                        actionItem.options.computerMetricsConverted[value.counter] = value;
                        actionItem.options.computerMetricsConverted[value.counter].thresholdInKb = value.threshold / 1024;
                    });
                    angular.forEach(actionItem.options.appMetrics, function (value, key) {
                        value.appKey = key;
                    });

                    angular.forEach(actionItem.computersNotRun, function (value, key) {
                        value.computerKey = key;
                    });
                }
            });
        }
    },

    showAdvanced: function (ev, actionData) {
        actionDialogHandler.$uibModal.open({
            templateUrl: 'views/powerplan/dialogs/action.dialog.html',
            resolve: { actionData: function () { return actionData } },
            controller: actionDialogHandler.DialogController
        });
    },

    DialogController: function ($scope, $uibModalInstance, actionData) {
        //===============Private==========================//
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
        //=================Scope bind====================//
        $scope.options = actionData.options;
        $scope.perform = actionData.perform;
        $scope.daysOfMonth = actionData.daysOfMonth;
        $scope.KeepMonitorOn = actionData.options.KeepMonitorOn;
        $scope.keepAlive     = actionData.options.keepAlive;
        $scope.specificDate = (typeof actionData.specificDate != 'undefined') ? new Date(actionData.specificDate)    : new Date();
        $scope.timeChosen   = (typeof actionData.fromTime != 'undefined')     ? moment(actionData.fromTime).toDate() : 0;
        //modify scheduleType if need
        if (actionData.scheduleType == 'DayOfWeek' && actionData.daysConverted.length == 7) {
            actionData.scheduleType == 'EveryDay';
        }
        $scope.scheduleType = actionData.scheduleType;
        $scope.Sunday    = { dayInBit: 1, Value: GetSetDays }
        $scope.Monday    = { dayInBit: 2, Value: GetSetDays }
        $scope.Tuesday   = { dayInBit: 4, Value: GetSetDays }
        $scope.Wednesday = { dayInBit: 8, Value: GetSetDays }
        $scope.Thursday  = { dayInBit: 16, Value: GetSetDays }
        $scope.Friday    = { dayInBit: 32, Value: GetSetDays }
        $scope.Saturday  = { dayInBit: 64, Value: GetSetDays }
        $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
        $scope.Add = function () {
            //Save - add data to json
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
            //brodcast event to directive 
            $scope.$broadcast('saveSettings', {});
            actionData.options.KeepMonitorOn = $scope.KeepMonitorOn;
            actionData.options.keepAlive = $scope.keepAlive;
            actionData.fromTime = $scope.timeChosen
            //Hide dialog
            $uibModalInstance.dismiss('cancel');
        };   
    }
};