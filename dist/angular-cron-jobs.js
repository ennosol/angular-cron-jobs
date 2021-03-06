/**
 * UI Component For Creating Cron Job Syntax To Send To Server
 * @version v1.4.1 - 2015-11-18 * @link https://github.com/jacobscarter/angular-cron-jobs
 * @author Jacob Carter <jacob@ieksolutions.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
angular.module('templates-angularcronjobs', ['cronselection.html']);

angular.module("cronselection.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("cronselection.html",
    "<div class=\"cron-wrap\">\n" +
    "<span>Minden </span>\n" +
    "	<select class=\"cron-select\" ng-model=\"myFrequency.base\" ng-options=\"item.value as item.label for item in frequency\"></select>\n" +
    "\n" +
    "	<div class=\"select-options\">\n" +
    "		<select ng-show=\"myFrequency.base == 4\" class=\"cron-select day-value\" ng-model=\"myFrequency.dayValue\" ng-options=\"(value | dayName) for value in dayValue\"></select>\n" +
    "\n" +
    "		<select ng-show=\"myFrequency.base == 6\" class=\"cron-select month-value\" ng-model=\"myFrequency.monthValue\" ng-options=\"(value | monthName) for value in monthValue\"></select>\n" +
    "\n" +
    "		<select ng-show=\"myFrequency.base >= 5\" class=\"cron-select day-of-month-value\" ng-model=\"myFrequency.dayOfMonthValue\" ng-options=\"(value | numeral) for value in dayOfMonthValue\"></select>\n" +
    "		<span ng-show=\"myFrequency.base >= 5\">napján </span>\n" +
    "\n" +
    "		<select ng-show=\"myFrequency.base >= 3\" class=\"cron-select hour-value\" ng-model=\"myFrequency.hourValue\" ng-options=\"value for value in hourValue\"></select>\n" +
    "		<span ng-show=\"myFrequency.base >= 3\"> : </span>\n" +
    "		<select ng-show=\"myFrequency.base >= 2\" class=\"cron-select minute-value\" ng-model=\"myFrequency.minuteValue\" ng-options=\"value for value in minuteValue\"></select>\n" +
    "		<span ng-show=\"myFrequency.base >= 3\"> -kor</span>\n" +
    "		<span ng-show=\"myFrequency.base == 2\"> perckor</span>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);

'use strict';

angular.module('angular-cron-jobs', ['templates-angularcronjobs']);

'use strict';

angular.module('angular-cron-jobs', ['templates-angularcronjobs']);

'use strict';

angular.module('angular-cron-jobs').directive('cronSelection', ['cronService', function(cronService) {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        scope: {
            config : '=',
            output : '=?',
            init   : '=?'
        },
        templateUrl: function(element, attributes) {
          return attributes.template || 'cronselection.html';
        },
        link: function($scope) {

            var originalInit = undefined;
            var initChanged = false;

            $scope.frequency = [
                {
                    value : 1,
                    label : 'percben'
                },
                {
                  value : 2,
                  label : 'óra'
                },
                {
                  value : 3,
                  label : 'nap'
                },
                {
                  value : 4,
                  label : 'héten'
                },
                {
                  value : 5,
                  label : 'hónap'
                },
                {
                  value : 6,
                  label : 'év'
                }
            ];

            if (angular.isDefined($scope.init)) {
                //console.log('init value found: ', $scope.init);
                originalInit = angular.copy($scope.init);
                $scope.myFrequency = cronService.fromCron($scope.init);
            }

            $scope.$watch('init', function(newValue){
                //console.log('watch on init fired!', newValue, originalInit);
                if(angular.isDefined(newValue) && newValue && (newValue !== originalInit)){
                    initChanged = true;
                    $scope.myFrequency = cronService.fromCron(newValue);
                }
            });

            if(typeof $scope.config === 'object' && !$scope.config.length){
                var optionsKeyArray = Object.keys($scope.config.options);
                for (var i in optionsKeyArray) {
                    var currentKey = optionsKeyArray[i].replace(/^allow/, '');
                    var originalKey = optionsKeyArray[i];
                    if(!$scope.config.options[originalKey]){
                        for(var b in $scope.frequency){
                            if($scope.frequency[b].label === currentKey){
                                $scope.frequency.splice(b, 1);
                            }
                        }
                    }
                }
            }

            $scope.minuteValue = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
            $scope.hourValue = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
            $scope.dayOfMonthValue = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
            $scope.dayValue = [0, 1, 2, 3, 4, 5, 6];
            $scope.monthValue = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

            $scope.$watch('myFrequency', function(n, o){
                //console.log('myFrequency changed: ', n, initChanged);
                if(n && (!o || n.base !== o.base) && !initChanged){
                    //console.log('base changed!', n, o);
                    if(n && n.base){
                        n.base = parseInt(n.base);
                    }
                    if(n && n.base && n.base >= 2) {
                        n.minuteValue = $scope.minuteValue[0];
                    }

                    if(n && n.base && n.base >= 3) {
                        n.hourValue = $scope.hourValue[0];
                    }

                    if(n && n.base && n.base === 4) {
                        n.dayValue = $scope.dayValue[0];
                    }

                    if(n && n.base && n.base >= 5) {
                        n.dayOfMonthValue = $scope.dayOfMonthValue[0];
                    }

                    if(n && n.base && n.base === 6) {
                        n.monthValue = $scope.monthValue[0];
                    }
                } else if(n && n.base && o && o.base){
                    initChanged = false;
                }
                $scope.output = cronService.setCron(n);
            }, true);


        }
    };
}]).filter('numeral', function() {
    return function(input) {
        return input + '.';
        /*
        switch (input) {
            case 1:
                return '1st';
            case 2:
                return '2nd';
            case 3:
                return '3rd';
            case 21:
                return '21st';
            case 22:
                return '22nd';
            case 23:
                return '23rd';
            case 31:
                return '31st';
            case null:
                return null;
            default:
                return input + 'th';
        }*/
    };
}).filter('monthName', function() {
    return function(input) {
        var months = {
            1: 'január',
            2: 'február',
            3: 'március',
            4: 'április',
            5: 'május',
            6: 'június',
            7: 'július',
            8: 'augusztus',
            9: 'szeptember',
            10: 'október',
            11: 'november',
            12: 'december'
        };

        if (input !== null && angular.isDefined(months[input])) {
            return months[input];
        } else {
            return null;
        }
    };
}).filter('dayName', function() {
    return function(input) {
        var days = {
            0: 'vasárnap',
            1: 'hétfőn',
            2: 'kedden',
            3: 'szerdán',
            4: 'csütörtökön',
            5: 'pénteken',
            6: 'szombaton',
        };

        if (input !== null && angular.isDefined(days[input])) {
            return days[input];
        } else {
            return null;
        }
    };
});
'use strict';

angular.module('angular-cron-jobs').factory('cronService', function($filter) {
    var service = {};

    service.setCron = function(n) {
        //  console.log('set cron called: ', n);
        var cron = ['*', '*', '*',  '*',  '*'];

        if(n && n.base && n.base >= 2) {
            cron[0] = typeof n.minuteValue !== undefined ? n.minuteValue : '*';
        }

        if(n && n.base && n.base >= 3) {
            cron[1] = typeof n.hourValue !== undefined ? n.hourValue  : '*';
        }

        if(n && n.base && n.base === 4) {
            cron[4] = n.dayValue;
        }

        if(n && n.base && n.base >= 5) {
            cron[2] = typeof n.dayOfMonthValue !== undefined ? n.dayOfMonthValue : '*';
        }

        if(n && n.base && n.base === 6) {
            cron[3] = typeof n.monthValue !== undefined ? n.monthValue : '*';
        }
        //  console.log('cron after setCron ', cron.join(' '));
        return cron.join(' ');
    };

    service.fromCron = function(value) {
        //  console.log('set cron fired!');
       var cron = value.replace(/\s+/g, ' ').split(' ');
       var frequency = {base: '1'}; // default: every minute

       if(cron[0] === '*' && cron[1] === '*' && cron[2] === '*' && cron[3] === '*'  && cron[4] === '*') {
           frequency.base = 1; // every minute
       } else if(cron[1] === '*' && cron[2] === '*' && cron[3] === '*'  && cron[4] === '*') {
           frequency.base = 2; // every hour
       } else if(cron[2] === '*' && cron[3] === '*'  && cron[4] === '*') {
           frequency.base = 3; // every day
       } else if(cron[2] === '*' && cron[3] === '*') {
           frequency.base = 4; // every week
       } else if(cron[3] === '*' && cron[4] === '*') {
           frequency.base = 5; // every month
       } else if(cron[4] === '*') {
           frequency.base = 6; // every year
       }

       // console.log('frequency should be 5: ', frequency, cron);

       if (cron[0] !== '*') {
           frequency.minuteValue = parseInt(cron[0]);
       }
       if (cron[1] !== '*') {
           frequency.hourValue = parseInt(cron[1]);
       }
       if (cron[2] !== '*') {
           frequency.dayOfMonthValue = parseInt(cron[2]);
       }
       if (cron[3] !== '*') {
           frequency.monthValue = parseInt(cron[3]);
       }
       if (cron[4] !== '*') {
           frequency.dayValue = parseInt(cron[4]);
       }

       //frequency.base += ''; // 'cast' to string in order to set proper value on "every" modal

       // console.log('freq ', frequency);
       return frequency;
   };

   service.humanize = function(value) {
       if (typeof value !== 'undefined') {
            var frequency = service.fromCron(value);

            if (frequency.base === 1) {
                return 'Minden percben';
            }
            if (frequency.base === 2) {
                return 'Minden óra ' + frequency.minuteValue + ' perckor';
            }
            if (frequency.base === 3) {
                return 'Minden nap ' + frequency.hourValue + ':' + frequency.minuteValue + '-kor';
            }
            if (frequency.base === 4) {
                return 'Minden héten ' + $filter('dayName')(frequency.dayValue) + ' ' + frequency.hourValue + ':' + frequency.minuteValue + '-kor';
            }
            if (frequency.base === 5) {
                return 'Minden hónap ' + frequency.dayOfMonthValue + '. napján ' + frequency.hourValue + ':' + frequency.minuteValue + '-kor';
            }
            if (frequency.base === 6) {
                return 'Minden év ' + $filter('monthName')(frequency.monthValue) + ' ' + frequency.dayOfMonthValue + '. napján ' + frequency.hourValue + ':' + frequency.minuteValue + '-kor';
            }
       } else {
            return '';
       }
   };

   return service;
});
