/**
 * @author Lucia
 * @date 2013-10-8
 */
(function() {
    if (!window.console) {
        window.console = {};
        window.console.log = function() {}
        window.console.dir = function() {}
    }
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (fn, scope) {
            'use strict';
            var i, len;
            for (i = 0, len = this.length; i < len; ++i) {
                if (i in this) {
                    fn.call(scope, this[i], i, this);
                }
            }
        };
    }
    if (!Array.prototype.every) {
      Array.prototype.every = function(fun /*, thisp */) {
        'use strict';
        var t, len, i, thisp;

        if (this == null) {
          throw new TypeError();
        }

        t = Object(this);
        len = t.length >>> 0;
        if (typeof fun !== 'function') {
            throw new TypeError();
        }

        thisp = arguments[1];
        for (i = 0; i < len; i++) {
          if (i in t && !fun.call(thisp, t[i], i, t)) {
            return false;
          }
        }

        return true;
      };
    }
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(elt /*, from*/) {
            var len = this.length >>> 0;

            var from = Number(arguments[1]) || 0;
            from = (from < 0)
                 ? Math.ceil(from)
                 : Math.floor(from);
            if (from < 0)
              from += len;

            for (; from < len; from++) {
                if (from in this &&
                    this[from] === elt)
                return from;
            }
            return -1;
        };
    }
    if (!Array.prototype.filter) {
      Array.prototype.filter = function (fn, context) {
        var i,
            value,
            result = [],
            length;

            if (!this || typeof fn !== 'function' || (fn instanceof RegExp)) {
              throw new TypeError();
            }

            length = this.length;

            for (i = 0; i < length; i++) {
              if (this.hasOwnProperty(i)) {
                value = this[i];
                if (fn.call(context, value, i, this)) {
                  result.push(value);
                }
              }
            }
        return result;
      };
    }
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (typeof this !== "function") {
                // closest thing possible to the ECMAScript 5 internal IsCallable function
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }

            var aArgs = Array.prototype.slice.call(arguments, 1), 
                fToBind = this, 
                fNOP = function () {},
                fBound = function () {
                    return fToBind.apply(this instanceof fNOP && oThis
                            ? this
                            : oThis,
                            aArgs.concat(Array.prototype.slice.call(arguments)));
                };

            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();

            return fBound;
        };
    }
})();
(function(){
    Function.prototype.before = function(func){
        var __self = this;
        return function(){
            var ret = func.apply(this, arguments);
            if(ret){
                return ret;
            }
            return __self.apply(this, arguments);
        }
    }

    Function.prototype.after = function(func){
        var __self = this;
        return function(){
            var ret = __self.apply(this, arguments);
            if(ret){
                return ret;
            }
            return func.apply(this, arguments);
        }
    }
})();
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
})();
(function() {
    var ua = window.navigator.userAgent.toLowerCase();
    window.platform = {
        isiPad: ua.match(/ipad/i) !== null,
        isiPhone: ua.match(/iphone/i) !== null,
        isAndroid: ua.match(/android/i) !== null,
        isBustedAndroid: ua.match(/android 2\.[12]/) !== null,
        isIE: window.navigator.appName.indexOf("Microsoft") !== -1 || ua.match(/rv:11.0/) !== null,
        isIE8: ua.match(/msie 8/) !== null,
        isIE9: ua.match(/msie 9/) !== null,
        isChrome: ua.match(/chrome/gi) !== null,
        isFirefox: ua.match(/firefox/gi) !== null,
        isWebkit: ua.match(/webkit/gi) !== null,
        isGecko: ua.match(/gecko/gi) !== null,
        isOpera: ua.match(/opera/gi) !== null,
        isMac: ua.match('mac') !== null,
        hasTouch: ('ontouchstart' in window),
        supportsSvg: !! document.createElementNS && !! document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect
    };
    platform.isMobile = ua.match(/android|webos|iphone|ipod|blackberry|iemobile/i) !== null && ua.match(/mobile/i) !== null;
    platform.isTablet = platform.isiPad || (ua.match(/android|webos/i) !== null && ua.match(/mobile/i) === null);
    platform.isDesktop = !(platform.isMobile || platform.isTablet);
})();
require.config({
    baseUrl: "scripts",
    waitSeconds: 0,
    paths: {
        "jquery": "../vendors/jquery/dist/jquery.min",
        "jquery.ui": "../vendors/jquery-ui-custom/jquery-ui",
        "jquery.youtube": "../vendors/jquery-youtube/src/jquery-youtube",
        "jqueryMobile": "../vendors/jquery/dist/jquery.min",
        "modernizr": "../vendors/modernizr/modernizr",
        "TweenMax": "../vendors/greensock-js/src/minified/TweenMax.min",
        "TweenMax.ScrollToPlugin": "../vendors/greensock-js/src/minified/plugins/ScrollToPlugin.min",
        "unslider": "../vendors/unslider/unslider",
        "iscroll": "../vendors/iscroll/build/iscroll",
        "domReady": "../vendors/domReady/domReady",
        "URI": "../vendors/URIjs/URI",
        "history": "../vendors/history/scripts/bundled/html4+html5/jquery.history",
        "hammer": "../vendors/hammerjs/dist/jquery.hammer",
        "mediaelement": "../vendors/mediaelement/build/mediaelement-and-player",
        "Bootstrap": "../vendors/bootstrap/dist/js/bootstrap.min",
        "infobubble" : "../vendors/googlemap/infobubble",
        "nanoscroller" : "../vendors/nanoscroller/bin/javascripts/jquery.nanoscroller.min",
        "threejs" : "../vendors/three.js/build/three.js",
        "slidesjs": "../vendors/slidesjs3-bower/source/jquery.slides.min",
        "soundmanager": "../vendors/SoundManager2-master/script/soundmanager2",
        "pace": "../vendors/pace/pace.min",
        "angular": "../vendors/angular/angular",
        "angularRoute": "../vendors/angular-route/angular-route",
        "angularAnimate": "../vendors/angular-animate/angular-animate",
        "angularCheckboxSet": "../vendors/angular-checkbox-set/angular-checkbox-set",
    },
    shim: {
        "angular": {
            exports: 'angular',
            deps: ['jquery']
        },
        "angularRoute": ['angular'],
        "angularAnimate": ['angular'],
        "angularCheckboxSet": ['angular'],
        "TweenMax.ScrollToPlugin": ['TweenMax'],
        "jquery.mousewheel": ['jquery'],
        "jquery.youtube": ['jquery'],
        "jquery.easing": ['jquery'],
        "jquery.ui": ['jquery'],
        "history": ['jquery'],
        "slidesjs": ['jquery'],
        "nanoscroller": ['jquery'],
        "blend": ["pixastic"],
        "hammer": ['jquery'],
        "mediaelement": ["jquery"],
        "unslider": ["jquery"],
        "carousel": ["jquery"],
        "Bootstrap": ['jquery']
    }
});
// require(['main'], function() {});
require(['angular', 'app'], function(angular, app) {
    angular.element(document).ready(function() {
        angular.bootstrap(document, [app['name']]); //graph
    });
});

// app.js
// define([
//     'angular',
//     'filters',
//     'services',
//     'animations',
//     'directives',
//     'controllers',
//     'angularRoute',
//     ], function (angular, filters, services, animations, directives, controllers) {
//         return angular.module('graph', [
//             'ngRoute',
//             'ngAnimate',
//             'graph.filters',
//             'graph.services',
//             'graph.animations',
//             'graph.directives',
//             'graph.controllers'
//         ]);
// });
