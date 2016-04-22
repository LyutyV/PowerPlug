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
    GetAction: function(actionType, actionsArray){
        var action, actionKey, options;
        action = {};
        actionKey = actionsArray.length > 0 ? (actionsArray[actionsArray.length - 1].actionKey + 1) : 0;
        action.actionKey = actionKey;
        action.daysConverted = [0, 1, 2, 3, 4, 5, 6];
        action.daysOfMonth = 0;
        action.daysOfWeek = 127;
        action.displayOrder = actionsArray.length;
        action.scheduleType = 'DayOfWeek';
        //actionType specific properties
        action.perform = actionType;
        options = {};
        if (actionType == 'Restart') {
            options.hoursLastBoot = 0;
            options.idleTime = 30;
            options.implicitWake = 10;
            //hours recommendation
            action.fromTime = "1899-12-30T02:00:00";
            action.fromTimeConverted = "2:00 AM";
            action.toTime = "1899-12-30T23:00:00";
            action.toTimeConverted = "11:00 PM"
        }
        else if (actionType == 'Wake') {
            options.keepAlive = 60;
            //hours recommendation
            action.timeConverted = "10:00 PM";
            action.fromTime = "1899-12-30T22:00:00";
        }
        action.options = options;

        return action;
    },
    createNewAction: function (actionType, actionsArray) {
        var action, modalInstance;
        action = actionDialogHandler.GetAction(actionType, actionsArray);
        modalInstance = actionDialogHandler.openActionDialog(action, true);
        modalInstance.result.then(function () { actionsArray.push(action) });//, function () {Dismiss});
    },
    openActionDialog: function (actionData, isNewAction) {
       var modal = actionDialogHandler.$uibModal.open({
            templateUrl: 'views/powerplan/dialogs/action.dialog.html',
            resolve: { param: function () { return { 'actionData': actionData, 'isNewAction': isNewAction } } },
            controller: actionDialogHandler.DialogController,
            windowClass : 'action-calendar'
        });

        modal.rendered.then(function(){
            $('.datetimepicker').datetimepicker({
                format: 'LT',
                defaultDate:actionData.fromTime
            });
        });

        modal.closed.then(function(){
            $('.datetimepicker').datetimepicker('remove');
        });

        return modal;
    },

    DialogController: function ($scope, $uibModalInstance, param){
        //===============Private==========================//
        var actionData, isNewAction;
        actionData = param.actionData;
        isNewAction = param.isNewAction;
        var weekDays = actionData.daysOfWeek;
        var SetDayModel = function (newValue) {
            var dayInBit = newValue;
            weekDays = (dayInBit > 0) ? (weekDays | dayInBit) : (weekDays & dayInBit);
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
        $scope.checkbox = {};
        $scope.checkbox.keepMonitorOn = actionData.options.keepMonitorOn === undefined ? false : actionData.options.keepMonitorOn;
        $scope.keepAlive     = actionData.options.keepAlive;
        $scope.specificDate = (typeof actionData.specificDate != 'undefined') ? new Date(actionData.specificDate)    : new Date();
        $scope.timeChosen = (typeof actionData.fromTime != 'undefined') ? moment(actionData.fromTime).toDate() : 0;
        $scope.toTime = (typeof actionData.toTime != 'undefined') ? moment(actionData.toTime).toDate() : 0;
        //modify scheduleType if need
        if (actionData.scheduleType == 'DayOfWeek' && actionData.daysConverted.length == 7) {
            actionData.scheduleType = 'EveryDay';
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
            $scope.timeChosen = moment($('#atDate').val(),'hh:mm A')._d;
            if ($('#toTime').val()){
                $scope.toTime = moment($('#toTime').val(),'hh:mm A')._d;
            }
            //Save - add data to json
            actionData.scheduleType = $scope.scheduleType;
            switch (actionData.scheduleType) {
                case 'EveryDay':
                    actionData.scheduleType = 'DayOfWeek';
                    actionData.daysOfWeek = 127;
                    break;
                case 'DayOfWeek':
                    actionData.daysOfWeek = weekDays;
                    break;
                case 'DayOfMonth':
                    actionData.daysOfMonth = $scope.daysOfMonth;
                    break;
                case 'SpecificDate':
                    actionData.specificDate = $scope.specificDate;
                    break;
            }

            actionData.options.keepMonitorOn = $scope.checkbox.keepMonitorOn;
            actionData.options.keepAlive = $scope.keepAlive;
            actionData.fromTime = $scope.timeChosen;

            actionHandler.getActionText(actionData);
            //brodcast event to directive
            $scope.$broadcast('saveSettings', { actionData: actionData });
            //Hide dialog
            $uibModalInstance.close('Add');
        };
    }
};