(function () {
    'use strict';
    angular

        .module('powerPlug')
        .controller('ReportGenerateCtrl', ['$state', '$stateParams', 'ReportsResource', 'ReportTemplateService', ReportGenerateCtrl]);

    function ReportGenerateCtrl($state, $stateParams, ReportsResource, ReportTemplateService) {
        var vm = this;
        vm.reportId = $stateParams.reportId;
        vm.templateId = $stateParams.templateId;

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
        }
    }
}());
