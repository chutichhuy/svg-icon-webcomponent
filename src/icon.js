import {default as pickASrc} from "./src";
import * as registerElement from "document-register-element";

/*
 * The prototype
 */
var elementProto = Object.create(
    HTMLElement.prototype, 
    {
        createdCallback: {
            value: function () {
                // get all the src element
                let srcs = this.getElementsByTagName("src");

                if (srcs.length) {
                    pickASrc(
                        Array.prototype.slice.call(srcs).map(function (s) {
                            return s.getAttribute("href");
                        }),

                        (content) => {
                            // check for shadow DOM
                            if (false && this.createShadowRoot) {
                                let sr = this.createShadowRoot();
                                sr.appendChild(content);
                            } else {
                                this.appendChild(content);
                            }
                        }
                    );
                }
            }
        }
    }
);

// the register event stuff
export default function (tag = "svg-icon") {
    return function () {
        return document.registerElement(tag, {
            prototype: elementProto
        });
    };
};

