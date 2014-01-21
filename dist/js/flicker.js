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
        )
    };
})

.directive('flicker', function() {
    return {
        restrict: 'E',
        scope: {
            delay: '=',
            endDelay: '='
        },
        controller: function($scope, $interval) {

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
        transclude: true,
        link: function(scope, element, attrs, flickerCtrl) {

            scope.frozen = false;
            scope.freeze = function() {
                scope.paused = true;
            };
            scope.unfreeze = function() {
                scope.paused = false;
            };

            scope.flicker = function() {

                var item = angular.element(element[0].querySelector('flicker-item'));
                var lastItem = angular.element(element[0].querySelector('flicker-item:last-child'));

                $animate.enter(item, element, lastItem);
                $animate.addClass(lastItem, 'leave', function() {
                    lastItem.removeClass('leave');
                });

            };

            scope.start = function() {

                var delay = flickerCtrl.delay + flickerCtrl.delay * scope.$index;
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
                scope.timeout.cancel();
                scope.interval.cancel();
            };

            flickerCtrl.addRow(scope);
            if (scope.$last) {
                flickerCtrl.start();
            }

        }
    };
})

.directive('flickerItem', function() {
    return {
        require: '^flicker',
        restrict: 'E',
        link: function(scope, element, attrs) {
            if (scope.$last) {
                scope.$emit('itemsLoaded');
            }
        }
    };
});