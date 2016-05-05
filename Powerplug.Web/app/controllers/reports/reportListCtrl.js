(function () {
    'use strict';
    angular

        .module('powerPlug')
        .controller('ReportListCtrl', ['$state', '$stateParams', 'ReportsResource', 'ReportTemplateService', ReportListCtrl]);

    function ReportListCtrl($state, $stateParams, ReportsResource, ReportTemplateService) {
        var vm = this;

        ReportsResource.basic.query(function (data) {
            onReportsSuccess(data);
        }, function (err) {
            onError(err);
        });

        ReportsResource.template.query(function (data) {
            onReportTemplatesSuccess(data);
        }, function (err) {
            onError(err);
        });

        vm.goToReport = function () {
            $state.go('reportGenerate', { reportId: vm.reportType })
        };
        
        function onError(err) {
            console.log(err)
            if (err.status === 401 || err.status === -1) {
                $state.go('login');
            }
        }
        
        function onReportsSuccess(data) {
            vm.reports = data;        
        }

        function onReportTemplatesSuccess(data) {
            vm.reportTemplates = data;
            ReportTemplateService.setReportTemplate(vm.reportTemplates);
        }
    }
}());
