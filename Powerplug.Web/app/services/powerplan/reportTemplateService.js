﻿(function () {
    'use strict';
    angular
        .module('common.services')
        .service('ReportTemplateService', ['$state', 'ReportsResource', ReportTemplateService]);

    function ReportTemplateService($state, ReportsResource) {
        var _reportTemplates;
        function getRequestedTemplate(saveReportId) {
            var retSavedReport;
            
            angular.forEach(_reportTemplates, function (template) {
                if (template.savedReportId === Number(saveReportId)) {
                    retSavedReport = template;
                }
            });

            return retSavedReport;
        }
        return {
            getReportTemplate: function (saveReportId) {                
                if (_reportTemplates !== undefined) {
                    return getRequestedTemplate(saveReportId);
                }
                else {
                    ReportsResource.template.query(function (data) {
                        _reportTemplates = data;
                        return getRequestedTemplate(saveReportId);
                    }, function (err) {
                        if (err.status === 401 || err.status === -1) {
                            $state.go('login');
                        }
                    });
                }
            },
            setReportTemplate: function (value) {
                _reportTemplates = value;
            }
        }
    };
}());