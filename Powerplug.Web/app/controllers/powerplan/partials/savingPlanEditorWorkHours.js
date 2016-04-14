﻿var workHoursHandler = {
    vm: {},
    init: function (vm) {
        workHoursHandler.vm = vm;
    },
    setWorkHoursItems: function () {
        var workHours = [];
        var time = 0;
        var active = false;
        var startTime;
        var endTime;
        var currentTime = moment('2012-01-01');
        angular.forEach(workHoursHandler.vm.savingPlan.workHours.workTimeMask.split(''), function (value, key) {
            if (value === '1') {
                if (!active) {
                    active = true;
                    startTime = currentTime;
                }
            }
            else {
                if (active) {
                    active = false;
                    endTime = currentTime;
                    workHours.push({
                        start: startTime,
                        end: endTime
                    })
                }
            }
            currentTime = moment(currentTime).add(30, 'minutes');
        });
        if (active) {
            endTime = currentTime;
            workHours.push({
                start: startTime,
                end: endTime
            })
        }

        // var myEl = angular.element(document.querySelector('#calendar'));
        // myEl.fullCalendar({
        //     height: 500,
        //     defaultDate: '2012-01-01',
        //     defaultView: 'agendaWeek',
        //     editable: true,
        //     events: workHours,
        //     allDaySlot: false,
        //     header: {
        //         center: '',
        //         left: '',
        //         right: ''
        //     }
        // });
    }
};
