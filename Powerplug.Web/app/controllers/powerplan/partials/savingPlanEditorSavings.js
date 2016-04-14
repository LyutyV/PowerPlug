var savingHandler = {
    vm: {},
    $document: [],
    init: function (vm, $document) {
        savingHandler.vm = vm;
        savingHandler.$document = $document;
    },
    setSavingItems: function () {
        if (savingHandler.vm.savingPlan.savings && savingHandler.vm.savingPlan.savings.work && savingHandler.vm.savingPlan.savings.work.options) {
            savingHandler.vm.savingPlan.savings.work.options.computerMetricsConverted = {};
            angular.forEach(savingHandler.vm.savingPlan.savings.work.options.computerMetrics, function (value, key) {
                savingHandler.vm.savingPlan.savings.work.options.computerMetricsConverted[value.counter] = value;
                savingHandler.vm.savingPlan.savings.work.options.computerMetricsConverted[value.counter].thresholdInKb = savingHandler.vm.savingPlan.savings.work.options.computerMetricsConverted[value.counter].threshold / 1024;
            });
            angular.forEach(savingHandler.vm.savingPlan.savings.work.options.appMetrics, function (value, key) {
                value.appKey = key;
            });

            angular.forEach(savingHandler.vm.savingPlan.savings.work.options.computersNotRun, function (value, key) {
                value.computerKey = key;
            });
        }
        if (savingHandler.vm.savingPlan.savings && savingHandler.vm.savingPlan.savings.nonWork && savingHandler.vm.savingPlan.savings.nonWork.options) {
            savingHandler.vm.savingPlan.savings.nonWork.options.computerMetricsConverted = {};
            angular.forEach(savingHandler.vm.savingPlan.savings.nonWork.options.computerMetrics, function (value, key) {
                savingHandler.vm.savingPlan.savings.nonWork.options.computerMetricsConverted[value.counter] = value;
                savingHandler.vm.savingPlan.savings.nonWork.options.computerMetricsConverted[value.counter].thresholdInKb = savingHandler.vm.savingPlan.savings.nonWork.options.computerMetricsConverted[value.counter].threshold / 1024;

            });
            angular.forEach(savingHandler.vm.savingPlan.savings.nonWork.options.appMetrics, function (value, key) {
                value.appKey = key;
            });
            angular.forEach(savingHandler.vm.savingPlan.savings.nonWork.options.computersNotRun, function (value, key) {
                value.computerKey = key;
            });
        }
    },
    updateSavingItems: function () {
        if (savingHandler.vm.savingPlan.savings) {
            if (savingHandler.vm.savingPlan.savings.work &&
                savingHandler.vm.savingPlan.savings.work.options &&
                savingHandler.vm.savingPlan.savings.work.options.computerMetricsConverted) {
                savingHandler.setComputerMetrics('Cpu', 'work', 1);
                savingHandler.setComputerMetrics('Io', 'work', 1024);
                savingHandler.setComputerMetrics('Network', 'work', 1024);
            }
            if (savingHandler.vm.savingPlan.savings.nonWork &&
                savingHandler.vm.savingPlan.savings.nonWork.options &&
                savingHandler.vm.savingPlan.savings.nonWork.options.computerMetricsConverted) {
                savingHandler.setComputerMetrics('Cpu', 'nonWork', 1);
                savingHandler.setComputerMetrics('Io', 'nonWork', 1024);
                savingHandler.setComputerMetrics('Network', 'nonWork', 1024);
            }
        }
    },
    setComputerMetrics: function (id, type, multiplyNumber) {
        var chkElement = savingHandler.$document[0].querySelector('#' + type + id);
        var txtElement = savingHandler.$document[0].querySelector('#' + type + id + 'Text');
        var isElementFound = false;
        if (!savingHandler.vm.savingPlan.savings[type].options.computerMetrics) {
            savingHandler.vm.savingPlan.savings[type].options.computerMetrics = [];
        }

        if (chkElement.checked) {
            angular.forEach(savingHandler.vm.savingPlan.savings[type].options.computerMetrics, function (value, key) {
                if (value.counter === id) {
                    isElementFound = true;
                    value.threshold = Number(txtElement.value) * multiplyNumber;
                }
            });

            if (!isElementFound) {
                if (!savingHandler.vm.savingPlan.savings[type].options.computerMetrics) {
                    savingHandler.vm.savingPlan.savings[type].options.computerMetrics = [];
                }
                savingHandler.vm.savingPlan.savings[type].options.computerMetrics.push({ counter: id, threshold: (Number(txtElement.value) * multiplyNumber) });
            }
        }
        else {
            angular.forEach(savingHandler.vm.savingPlan.savings[type].options.computerMetrics, function (value, key) {
                if (value.counter === id) {
                    savingHandler.vm.savingPlan.savings[type].options.computerMetrics.splice(key, 1);
                    savingHandler.vm.savingPlan.savings[type].options.computerMetricsConverted.splice(value.counter, 1);
                }
            });
        }
    }
};



