(function () {
    'use strict';
    angular

        .module('powerPlug')
        .controller('ReportGenerateCtrl', ['$state', '$stateParams', '$timeout', 'ReportsResource', 'ReportTemplateService', ReportGenerateCtrl]);

    function ReportGenerateCtrl($state, $stateParams, $timeout, ReportsResource, ReportTemplateService) {
        var vm = this;
        vm.reportId = $stateParams.reportId;
        vm.templateId = $stateParams.templateId;

        vm.years = [];        
        for (var i = 2000; i <= (new Date().getFullYear() + 1) ; i++) {
            vm.years.push(i);
        }

        vm.months = [{ key: 0, value: 'January' }, { key: 1, value: 'February' }, { key: 2, value: 'March' }, { key: 3, value: 'April' }, { key: 4, value: 'May' }, { key: 5, value: 'June' }, { key: 6, value: 'July' }, { key: 7, value: 'August' }, { key: 8, value: 'September' }, { key: 9, value: 'October' }, { key: 10, value: 'November' }, { key: 11, value: 'December' }];
        
        if (vm.templateId) {
            ReportTemplateService.getReportTemplate(vm.templateId, function (templateData) {
                vm.reportData = templateData;                
                if (!vm.reportData) {
                    loadDefaultReportData(onReportsSuccess);
                }
                else {
                    onReportsSuccess();
                }
            });
        }
        else {
            loadDefaultReportData(onReportsSuccess);
        }
        
        function loadDefaultReportData(cb) {
            ReportsResource.basic.get({ reportId: vm.reportId }, function (data) {
                vm.reportData = data;
                cb();
            }, function (err) {
                onError(err);
            });
        }
                
        function onError(err) {
            console.log(err)
            if (err.status === 401 || err.status === -1) {
                $state.go('login');
            }
        }
        
        function onReportsSuccess() {
            console.log(vm.reportData);
            if (vm.reportData.fromDate !== undefined) {
                vm.reportData.fromDate = new Date(vm.reportData.fromDate);
                vm.reportData.toDate = new Date(vm.reportData.toDate);
                $timeout(function () {
                    $('.from-date').datetimepicker({
                        format: 'MM/DD/YYYY',
                        defaultDate: vm.reportData.fromDate
                    });
                    $('.to-date').datetimepicker({
                        format: 'MM/DD/YYYY',
                        defaultDate: vm.reportData.toDate
                    });
                }, 0);
            }
            else if (vm.reportData.fromMonth !== undefined) {
                vm.reportData.fromMonth = new Date(vm.reportData.fromMonth);
                vm.reportData.toMonth = new Date(vm.reportData.toMonth);
                vm.selectedFromMonth = vm.reportData.fromMonth.getMonth();
                vm.selectedFromYear = vm.reportData.fromMonth.getFullYear();
                vm.selectedToMonth = vm.reportData.toMonth.getMonth();
                vm.selectedToYear = vm.reportData.toMonth.getFullYear();
            }
        }
    }
}());
