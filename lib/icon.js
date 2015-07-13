"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var pickASrc = _interopRequire(require("./src"));

var registerElement = _interopRequireWildcard(require("document-register-element"));

/*
 * The prototype
 */
var elementProto = Object.create(HTMLElement.prototype, {
    createdCallback: {
        value: function value() {
            var _this = this;

            // get all the src element
            var srcs = this.getElementsByTagName("src");

            if (srcs.length) {
                pickASrc(Array.prototype.slice.call(srcs).map(function (s) {
                    return s.getAttribute("href");
                }), function (content) {
                    // check for shadow DOM
                    if (false && _this.createShadowRoot) {
                        _this.createShadowRoot().appendChild(content);
                    } else {
                        _this.appendChild(content);
                    }
                });
            }
        }
    }
});

// the register event stuff

module.exports = function () {
    var tag = arguments[0] === undefined ? "svg-icon" : arguments[0];

    return function () {
        return document.registerElement(tag, {
            prototype: elementProto
        });
    };
};