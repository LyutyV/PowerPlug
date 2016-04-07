function setActionItems(vm) {
    var weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    angular.forEach(vm.savingPlan.actions, function (value, key) {
        value.actionKey = key;
        if (value.scheduleType === 'DayOfWeek' || value.scheduleType === 'DayOfMonth') {
            var days;
            if (value.scheduleType === 'DayOfWeek') {
                days = value.daysOfWeek.toString(2);
            }
            else {
                days = value.daysOfMonth.toString(2);
            }
            var numbers = [];
            days = days.split("").reverse().join("");
            for (var i = 0; i < days.length; i++) {
                if (days[i] === '1') {
                    numbers.push(i);
                }
            }
            value.daysConverted = numbers;
        }

        if (value.scheduleType === 'DayOfWeek') {
            if (numbers.length < 7) {
                value.scheduleText = 'Every ';
                var daysList = [];
                angular.forEach(numbers, function (valueDays, keyDays) {
                    daysList.push(weekDays[valueDays]);
                });
                value.scheduleText += daysList.join(', ');
            }
            else {
                value.scheduleText = 'Every day';
            }
        }
        else if (value.scheduleType === 'DayOfMonth') {
            value.scheduleText = 'On ' + (Number(numbers[0]) + 1) + 'th of each month'
        }
        else if (value.scheduleType === 'SpecificDate') {
            value.dateConverted = moment(value.specificDate).format('L');
            value.scheduleText = 'On ' + value.dateConverted;
        }
        if (value.perform === 'Wake') {
            value.timeConverted = moment(value.fromTime).format('LT');
            value.scheduleText += ' at ' + value.timeConverted;
        }
        else if (value.perform === 'Restart') {
            value.formTimeConverted = moment(value.fromTime).format('LT');
            value.toTimeConverted = moment(value.toTime).format('LT');
            value.scheduleText += ' between ' + value.formTimeConverted + ' and ' + value.toTimeConverted;
        }
    });
}