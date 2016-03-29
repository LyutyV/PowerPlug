(function () {
    'use strict';
    angular
        .module('common.services')
        .factory('SavingPlansResource', ['$resource', 'appSettings', SavingPlansResource]);

    function SavingPlansResource($resource, appSettings) {
        return $resource(appSettings.serverPath + 'api/power-plans/:policyId', { policyId: '@policyId' },
            {
                'update': { method: 'PUT' }
            });            
    }
}());