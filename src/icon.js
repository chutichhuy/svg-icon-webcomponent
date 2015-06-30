import {default as pickASrc} from "./src";
import * as registerElement from "document-register-element";

/*
 * The prototype
 */
let elementProto = Object.create(
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
                            this.innerHTML = "";
                            this.appendChild(content);
                        }
                    );
                }
            }
        }
    }
);

// the register event stuff
let makeRegisterFn = function (tag = "svg-icon") {
    return function () {
        return document.registerElement(tag, {
            prototype: elementProto
        });
    };
};

//
makeRegisterFn()();
export {makeRegisterFn};

