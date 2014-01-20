'use strict';

angular.module('angularFlicker').controller('FlickerCtrl', function($scope, $filter) {

    var users = [{
        name: 'intellix',
        amount: 243
    }, {
        name: 'and',
        amount: 75
    }, {
        name: 'konoro',
        amount: 122
    }, {
        name: 'kingdom',
        amount: 252
    }, {
        name: 'are',
        amount: 12
    }, {
        name: 'awesome',
        amount: 22
    }, {
        name: 'really.',
        amount: 223
    }, {
        name: 'honestly!',
        amount: 52
    }];

    $scope.userChunks = $filter('chunk')(users, 3);

});