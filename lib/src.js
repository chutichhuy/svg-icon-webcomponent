
/*
 * Check if this browser support SVG and createDocument()
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var supportsSVG = function supportsSVG() {
    // if it doesn't support createDocument()
    // it must be IE 8, this dude doesnt support SVG anyway
    return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") && document.implementation.createDocument;
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
    var srcDoc = document.implementation.createHTMLDocument("http://www.w3.org/1999/xhtml", "html", null);

    var body = srcDoc.createElement("body");
    body.innerHTML = content;

    srcDoc.documentElement.appendChild(body);
    return srcDoc;
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
 * Recursively import nodes from an element to another
 * This exists because IE9 and below doesnt support innerHTML on SVGElement
 */
var importNodes = function importNodes(orig, dest) {
    for (var i = 0; i < orig.childNodes.length; i++) {
        dest.appendChild(orig.childNodes[i].cloneNode(true));
    };
    return dest;
};

/*
 * Create a SVG element
 * @param element - the original SVG element
 */
var createSvgElement = function createSvgElement(element) {
    var svg = importNodes(element, document.createElementNS("http://www.w3.org/2000/svg", "svg"));

    // assign viewBox
    if (element.getAttribute("viewBox")) {
        svg.setAttribute("viewBox", element.getAttribute("viewBox"));
    }

    // namespace and stuff
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

exports["default"] = function (srcs, callback) {
    var isSvg = function isSvg(url) {
        var parts = url.split("#");
        return /\.svg/.test(parts[0]);
    };

    var innerPicker = function innerPicker(_x) {
        var _again = true;

        _function: while (_again) {
            var c = _x;
            nex = src = isSvgSupported = _ret = img = undefined;
            _again = false;

            if (c >= srcs.length) {
                return void 0;
            }

            //
            var nex = c + 1;
            var src = srcs[c];
            var isSvgSupported = supportsSVG();

            if (isSvg(src)) {
                if (!isSvgSupported) {
                    _x = nex;
                    _again = true;
                    continue _function;
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
                                        ele = doc.getElementById(anchor);

                                        if (!ele) {
                                            return innerPicker(nex);
                                        }
                                    }

                                    return callback(createSvgElement(anchor ? ele : doc.getElementsByTagName("svg")[0]));
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
        }
    };

    // start the loop
    innerPicker(0);
};

;
module.exports = exports["default"];