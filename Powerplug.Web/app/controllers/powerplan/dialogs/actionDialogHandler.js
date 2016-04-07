var actionDialogHandler = {
    vm: {},
    $scope: {},
    $mdMedia: {},
    $mdDialog: {},
    init: function (vm, $scope, $mdDialog, $mdMedia) {
        actionDialogHandler.vm = vm;
        actionDialogHandler.$scope = $scope;
        actionDialogHandler.$mdDialog = $mdDialog;
        actionDialogHandler.$mdMedia = $mdMedia;
    },
    
    showAdvanced: function (ev, actionData) {
        var useFullScreen = (actionDialogHandler.$mdMedia('sm') || actionDialogHandler.$mdMedia('xs')) && $scope.customFullscreen;
        actionDialogHandler.$mdDialog.show({
            templateUrl: 'views/powerplan/dialogs/action.dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            bindToController :true,
            fullscreen: useFullScreen,
            locals: { actionData: actionData },
            controller: actionDialogHandler.DialogController,
        })
        .then(function (answer) {
            console.log(actionData);
        }, function () {
            console.log(actionData);
        });
        //actionDialogHandler.$scope.$watch(function () {
        //    return actionDialogHandler.$mdMedia('xs') || actionDialogHandler.$mdMedia('sm');
        //}, function (wantsFullScreen) {
        //    $scope.customFullscreen = (wantsFullScreen === true);
        //});
    },

    DialogController: function ($scope, $mdDialog, actionData) {
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
        $scope.daysOfMonth   = actionData.daysOfMonth;
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
        $scope.hide = function () { $mdDialog.hide(); };
        $scope.cancel = function () { $mdDialog.cancel()};
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
            actionData.options.KeepMonitorOn = $scope.KeepMonitorOn;
            actionData.options.keepAlive = $scope.keepAlive;
            actionData.fromTime = $scope.timeChosen
            //Hide dialog
            $mdDialog.hide();
        };   
    }
};