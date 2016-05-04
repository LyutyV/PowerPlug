(function () {
    'use strict';
    angular

        .module('powerPlug')
        .controller('ReportGenerateCtrl', ['$state', '$stateParams', 'ReportsResource', 'ReportTemplateService', ReportGenerateCtrl]);

    function ReportGenerateCtrl($state, $stateParams, ReportsResource, ReportTemplateService) {
        var vm = this;
        vm.reportId = $stateParams.reportId;
        vm.templateId = $stateParams.templateId;

        ReportsResource.basic.get({ reportId: vm.reportId }, function (data) {
            onReportsSuccess(data);
        }, function (err) {
            onError(err);
        });        
                
        function onError(err) {
            console.log(err)
            if (err.status === 401 || err.status === -1) {
                $state.go('login');
            }
        }
        
        function onReportsSuccess(data) {
            vm.reportData = data;            
            console.log(vm.reportData);

            if (vm.templateId !== undefined) {
                vm.reportTemplateData = ReportTemplateService.getReportTemplate(vm.templateId);
            }
        }
    }
}());
