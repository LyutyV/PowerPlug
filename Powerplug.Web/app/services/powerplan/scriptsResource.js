(function () {
    'use strict';
    angular
        .module('common.services')
        .factory('ScriptsResource', ['$resource', 'appSettings', ScriptsResource]);

    function ScriptsResource($resource, appSettings) {
        return $resource(appSettings.serverPath + 'api/pc/scripts');
    }
}());