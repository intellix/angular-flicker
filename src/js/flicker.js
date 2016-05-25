'use strict';

angular.module('angularFlicker', [
    'ngAnimate'
])

.filter('chunk', function() {
    return function(array, chunkSize) {
        return [].concat.apply([],
            array.map(function(elem, i) {
                return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
            })
        );
    };
})

.directive('flicker', function() {
    return {
        restrict: 'E',
        scope: {
            delay: '=',
            endDelay: '='
        },
        controller: function($scope) {

            this.rows = [];
            this.delay = $scope.delay || 1000;
            this.endDelay = $scope.endDelay || 1000;

            this.addRow = function(scope) {
                this.rows.push(scope);
            };
            this.start = function() {
                angular.forEach(this.rows, function(row) {
                    row.start();
                });
            };
            this.stop = function() {
                angular.forEach(this.rows, function(row) {
                    row.stop();
                });
            };

        }
    };
})

.directive('flickerRow', function($timeout, $interval, $animate) {
    return {
        require: '^flicker',
        restrict: 'E',
        scope: {
            last: '=',
            paused: '='
        },
        link: function(scope, element, attrs, flickerCtrl) {

            scope.paused = scope.paused || false;
            scope.last = scope.last || false;

            scope.flicker = function() {

                var items = element[0].querySelectorAll('flicker-item');
                if (items.length < 2) {
                    return;
                }

                var item = angular.element(items[0]);
                var lastItem = angular.element(items[items.length - 1]);

                $animate.enter(item, element, lastItem);
                $animate.addClass(lastItem, 'leave').then(function() {
                    lastItem.removeClass('leave');
                });

            };

            scope.start = function() {

                var delay = flickerCtrl.delay + flickerCtrl.delay * scope.$parent.$index;
                var interval = flickerCtrl.rows.length * flickerCtrl.delay + flickerCtrl.endDelay;

                scope.timeout = $timeout(function() {

                    if (!scope.paused) {
                        scope.flicker();
                    }

                    // After initial timeout, start an interval to continue running
                    scope.interval = $interval(function() {

                        if (!scope.paused) {
                            scope.flicker();
                        }

                    }, interval);

                }, delay);

            };

            scope.stop = function() {
                $timeout.cancel(scope.timeout);
                $interval.cancel(scope.interval);
            };

            flickerCtrl.addRow(scope);
            if (scope.last) {
                flickerCtrl.start();
            }

        }
    };
});
