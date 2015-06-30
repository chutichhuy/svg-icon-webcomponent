"use strict";

var supportsSVG = function supportsSVG() {
    return false;
    return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
};

/*
 * Cache register for all the sources
 */
var _srcCache = {};

/*
 * Load 
 */
var makeAjaxRequest = function makeAjaxRequest(file, cb) {
    var x = new (XMLHttpRequest || ActiveXObject)("MSXML2.XMLHTTP.3.0");
    x.open("GET", file, 1);
    //
    x.onreadystatechange = function () {
        if (x.readyState > 3) {
            if (x.status < 400) {
                cb(x.responseText);
            } else {
                cb(null);
            }
        }
        return;
    };
    x.send();
    return file;
};

/*
 * Create an alternative document object
 * @param content -  String
 */
var createDoc = function createDoc(content) {
    var srcDoc = document.implementation.createDocument("http://www.w3.org/1999/xhtml", "html", null);

    var body = document.createElementNS("http://www.w3.org/1999/xhtml", "body");
    body.innerHTML = content;
    srcDoc.documentElement.appendChild(body);
    return srcDoc.documentElement;
};

/*
 * Make a HTTP request for a file if needs to.
 * Return a document object
 * @param file - string
 * @param cb - function
 */
var loadSrc = function loadSrc(file, cb) {
    return _srcCache[file] ? cb(_srcCache[file]) : makeAjaxRequest(file, function (content) {
        if (content) {
            var doc = createDoc(content);
            _srcCache[file] = doc;
            cb(doc);
        } else {
            cb(null);
        }
    });
};

/*
 * Create a SVG element
 * @param element - the original SVG element
 */
var createSvgElement = function createSvgElement(element) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    svg.innerHTML = element.innerHTML;
    if (element.getAttribute("viewBox")) {
        svg.setAttribute("viewBox", element.getAttribute("viewBox"));
    }

    svg.setAttribute("xmlns", element.getAttribute("xmlns") ? element.getAttribute("xmlns") : "http://www.w3.org/2000/svg");

    svg.setAttribute("version", element.getAttribute("version") ? element.getAttribute("version") : "1.1");

    return svg;
};

/*
 * Picks an icon source, fallbacks to other if one fails
 *
 * @param srcs - Array of source URL
 * @param callback - A callback function
 */

module.exports = function (srcs, callback) {
    var isSvg = function isSvg(url) {
        var parts = url.split("#");
        return /\.svg/.test(parts[0]);
    };

    var innerPicker = (function (_innerPicker) {
        var _innerPickerWrapper = function innerPicker() {
            return _innerPicker.apply(this, arguments);
        };

        _innerPickerWrapper.toString = function () {
            return _innerPicker.toString();
        };

        return _innerPickerWrapper;
    })(function (c) {
        if (c >= srcs.length) {
            return void 0;
        }

        //
        var nex = c + 1;
        var src = srcs[c];
        var isSvgSupported = supportsSVG();

        if (isSvg(src)) {
            if (!isSvgSupported) {
                return innerPicker(nex);
            } else {
                var _ret = (function () {
                    var parts = src.split("#");
                    var anchor = parts[1];
                    return {
                        v: loadSrc(parts[0], function (doc) {
                            if (doc) {
                                var ele;

                                // check if the anchor matches any element in the document
                                // if not, then move on
                                if (anchor) {
                                    ele = doc.querySelector("#" + anchor);

                                    if (!ele) {
                                        console.log("move on");
                                        return innerPicker(nex);
                                    }
                                }

                                return callback(createSvgElement(anchor ? ele : doc.querySelector("svg")));
                            }
                            return innerPicker(nex);
                        })
                    };
                })();

                if (typeof _ret === "object") return _ret.v;
            }
        } else {
            var img = document.createElement("img");
            img.src = src;
            img.onerror = function () {
                innerPicker(nex);
            };

            img.onload = function () {
                callback(this);
            };
            return;
        }
    });

    innerPicker(0);
};