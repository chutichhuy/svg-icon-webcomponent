"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

// this file means to be compiled to lib

var createFn = _interopRequire(require("./icon"));

// change this if you want a different tag name
var tagName = "svg-icon";

// run
createFn(tagName)();
