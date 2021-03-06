﻿(function () {
    'use strict';
    angular
        .module('common.services')
        .factory('ReportsResource', ['$resource', 'appSettings', ReportsResource]);

    function ReportsResource($resource, appSettings) {
        return {            
            basic: $resource(appSettings.serverPath + 'api/pc/reports/:reportId', { reportId: '@reportId' },
            {
                'generate': { method: 'POST' }
            }),
            template: $resource(appSettings.serverPath + 'api/pc/reports/templates', null, {}),
        }
    }
}());