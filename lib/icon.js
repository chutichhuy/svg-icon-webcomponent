"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _src = require("./src");

var _src2 = _interopRequireDefault(_src);

var _documentRegisterElement = require("document-register-element");

var registerElement = _interopRequireWildcard(_documentRegisterElement);

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
                (0, _src2["default"])(Array.prototype.slice.call(srcs).map(function (s) {
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

exports["default"] = function () {
    var tag = arguments[0] === undefined ? "svg-icon" : arguments[0];

    return function () {
        return document.registerElement(tag, {
            prototype: elementProto
        });
    };
};

;
module.exports = exports["default"];