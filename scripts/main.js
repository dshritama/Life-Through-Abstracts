! function () {
    function e(t, i, n) {
        function r(o, a) {
            if (!i[o]) {
                if (!t[o]) {
                    var c = "function" == typeof require && require;
                    if (!a && c) return c(o, !0);
                    if (s) return s(o, !0);
                    var l = new Error("Cannot find module '" + o + "'");
                    throw l.code = "MODULE_NOT_FOUND", l
                }
                var u = i[o] = {
                    exports: {}
                };
                t[o][0].call(u.exports, function (e) {
                    var i = t[o][1][e];
                    return r(i ? i : e)
                }, u, u.exports, e, t, i, n)
            }
            return i[o].exports
        }
        for (var s = "function" == typeof require && require, o = 0; o < n.length; o++) r(n[o]);
        return r
    }
    return e
}()({
    1: [function (e, t, i) {
        "use strict";
        var n = e("./helpers/TabManager"),
            r = e("./helpers/hideSiblingElements"),
            s = e("./helpers/showSiblingElements"),
            o = function (e, t) {
                t = t || {}, this._tabbables = null, this._excludeHidden = t.excludeHidden, this._firstTabbableElement = t.firstFocusElement, this._lastTabbableElement = null, this._relatedTarget = null, this.el = e, this._handleOnFocus = this._handleOnFocus.bind(this)
            },
            a = o.prototype;
        a.start = function () {
            this.updateTabbables(), r(this.el, null, this._excludeHidden), this._firstTabbableElement ? this.el.contains(document.activeElement) || this._firstTabbableElement.focus() : console.warn("this._firstTabbableElement is null, CircularTab needs at least one tabbable element."), this._relatedTarget = document.activeElement, document.addEventListener("focus", this._handleOnFocus, !0)
        }, a.stop = function () {
            s(this.el), document.removeEventListener("focus", this._handleOnFocus, !0)
        }, a.updateTabbables = function () {
            this._tabbables = n.getTabbableElements(this.el, this._excludeHidden), this._firstTabbableElement = this._firstTabbableElement || this._tabbables[0], this._lastTabbableElement = this._tabbables[this._tabbables.length - 1]
        }, a._handleOnFocus = function (e) {
            if (this.el.contains(e.target)) this._relatedTarget = e.target;
            else {
                if (e.preventDefault(), this.updateTabbables(), this._relatedTarget === this._lastTabbableElement || null === this._relatedTarget) return this._firstTabbableElement.focus(), void(this._relatedTarget = this._firstTabbableElement);
                if (this._relatedTarget === this._firstTabbableElement) return this._lastTabbableElement.focus(), void(this._relatedTarget = this._lastTabbableElement)
            }
        }, a.destroy = function () {
            this.stop(), this.el = null, this._tabbables = null, this._firstTabbableElement = null, this._lastTabbableElement = null, this._relatedTarget = null, this._handleOnFocus = null
        }, t.exports = o
    }, {
        "./helpers/TabManager": 3,
        "./helpers/hideSiblingElements": 5,
        "./helpers/showSiblingElements": 9
    }],
    2: [function (e, t, i) {
        "use strict";

        function n() {
            this._createElemnts(), this._bindEvents()
        }
        var r = n.prototype;
        r._bindEvents = function () {
            this._onResize = this._resize.bind(this)
        }, r._createElemnts = function () {
            this.span = document.createElement("span");
            var e = this.span.style;
            e.visibility = "hidden", e.position = "absolute", e.top = "0", e.bottom = "0", e.zIndex = "-1", this.span.innerHTML = "&nbsp;", this.iframe = document.createElement("iframe");
            var t = this.iframe.style;
            t.position = "absolute", t.top = "0", t.left = "0", t.width = "100%", t.height = "100%", this.span.appendChild(this.iframe), document.body.appendChild(this.span)
        }, r.detect = function (e) {
            this.originalSize = e || 17, this.currentSize = parseFloat(window.getComputedStyle(this.span)["font-size"]), this.currentSize > this.originalSize && this._onResize(), this.isDetecting || (this.iframe.contentWindow.addEventListener("resize", this._onResize), this.isDetecting = !0)
        }, r._resize = function (e) {
            this.currentSize = parseFloat(window.getComputedStyle(this.span)["font-size"]), this.originalSize < this.currentSize ? document.documentElement.classList.add("text-zoom") : document.documentElement.classList.remove("text-zoom"), window.dispatchEvent(new Event("resize"))
        }, r.remove = function () {
            this.isDetecting && (this.iframe.contentWindow.removeEventListener("resize", this._onResize), this.isDetecting = !1)
        }, r.destroy = function () {
            this.remove(), this.span && this.span.parentElement && this.span.parentElement.removeChild(this.span), this.span = null, this.iframe = null
        }, t.exports = new n
    }, {}],
    3: [function (e, t, i) {
        "use strict";
        var n = e("./../maps/focusableElement"),
            r = function () {
                this.focusableSelectors = n.join(",")
            },
            s = r.prototype;
        s.isFocusableElement = function (e, t, i) {
            if (t && !this._isDisplayed(e)) return !1;
            var r = e.nodeName.toLowerCase(),
                s = n.indexOf(r) > -1;
            return "a" === r || (s ? !e.disabled : !e.contentEditable || (i = i || parseFloat(e.getAttribute("tabindex")), !isNaN(i)))
        }, s.isTabbableElement = function (e, t) {
            if (t && !this._isDisplayed(e)) return !1;
            var i = e.getAttribute("tabindex");
            return i = parseFloat(i), isNaN(i) ? this.isFocusableElement(e, t, i) : i >= 0
        }, s._isDisplayed = function (e) {
            var t = e.getBoundingClientRect();
            return (0 !== t.top || 0 !== t.left || 0 !== t.width || 0 !== t.height) && "hidden" !== window.getComputedStyle(e).visibility
        }, s.getTabbableElements = function (e, t) {
            for (var i = e.querySelectorAll(this.focusableSelectors), n = i.length, r = [], s = 0; s < n; s++) this.isTabbableElement(i[s], t) && r.push(i[s]);
            return r
        }, s.getFocusableElements = function (e, t) {
            for (var i = e.querySelectorAll(this.focusableSelectors), n = i.length, r = [], s = 0; s < n; s++) this.isFocusableElement(i[s], t) && r.push(i[s]);
            return r
        }, t.exports = new r
    }, {
        "./../maps/focusableElement": 11
    }],
    4: [function (e, t, i) {
        "use strict";
        var n = e("./setAttributes"),
            r = e("./../maps/ariaMap"),
            s = e("./TabManager"),
            o = "data-original-",
            a = "tabindex",
            c = function (e, t) {
                var i = e.getAttribute(o + t);
                i || (i = e.getAttribute(t) || "", n(e, o + t, i))
            };
        t.exports = function (e, t) {
            if (s.isFocusableElement(e, t)) c(e, a), n(e, a, -1);
            else
                for (var i = s.getTabbableElements(e, t), o = i.length; o--;) c(i[o], a), n(i[o], a, -1);
            c(e, r.HIDDEN), n(e, r.HIDDEN, !0)
        }
    }, {
        "./../maps/ariaMap": 10,
        "./TabManager": 3,
        "./setAttributes": 7
    }],
    5: [function (e, t, i) {
        "use strict";
        var n = e("./hide");
        t.exports = function r(e, t, i) {
            t = t || document.body;
            for (var s = e, o = e; s = s.previousElementSibling;) n(s, i);
            for (; o = o.nextElementSibling;) n(o, i);
            e.parentElement && e.parentElement !== t && r(e.parentElement)
        }
    }, {
        "./hide": 4
    }],
    6: [function (e, t, i) {
        "use strict";
        var n = function (e, t) {
                if ("string" == typeof t)
                    for (var i = t.split(/\s+/), n = 0; n < i.length; n++) e.getAttribute(i[n]) && e.removeAttribute(i[n])
            },
            r = function (e, t) {
                if (e.length)
                    for (var i = 0; i < e.length; i++) n(e[i], t);
                else n(e, t)
            };
        t.exports = r
    }, {}],
    7: [function (e, t, i) {
        "use strict";
        var n = function (e, t, i) {
                e && 1 === e.nodeType && e.setAttribute(t, i)
            },
            r = function (e, t, i) {
                if ("string" != typeof i && (i = i.toString()), e)
                    if (e.length)
                        for (var r = 0; r < e.length; r++) n(e[r], t, i);
                    else n(e, t, i)
            };
        t.exports = r
    }, {}],
    8: [function (e, t, i) {
        "use strict";
        var n = e("./removeAttributes"),
            r = e("./setAttributes"),
            s = e("./../maps/ariaMap"),
            o = "data-original-",
            a = "tabindex",
            c = function (e, t) {
                var i = e.getAttribute(o + t);
                "string" == typeof i && (i.length ? r(e, t, i) : n(e, t), n(e, o + t))
            };
        t.exports = function (e) {
            n(e, a + " " + s.HIDDEN), c(e, a), c(e, s.HIDDEN);
            for (var t = e.querySelectorAll("[" + o + a + "]"), i = t.length; i--;) c(t[i], a)
        }
    }, {
        "./../maps/ariaMap": 10,
        "./removeAttributes": 6,
        "./setAttributes": 7
    }],
    9: [function (e, t, i) {
        "use strict";
        var n = e("./show");
        t.exports = function r(e, t) {
            t = t || document.body;
            for (var i = e, s = e; i = i.previousElementSibling;) n(i);
            for (; s = s.nextElementSibling;) n(s);
            e.parentElement && e.parentElement !== t && r(e.parentElement)
        }
    }, {
        "./show": 8
    }],
    10: [function (e, t, i) {
        "use strict";
        t.exports = {
            AUTOCOMPLETE: "aria-autocomplete",
            CHECKED: "aria-checked",
            DISABLED: "aria-disabled",
            EXPANDED: "aria-expanded",
            HASPOPUP: "aria-haspopup",
            HIDDEN: "aria-hidden",
            INVALID: "aria-invalid",
            LABEL: "aria-label",
            LEVEL: "aria-level",
            MULTILINE: "aria-multiline",
            MULTISELECTABLE: "aria-multiselectable",
            ORIENTATION: "aria-orientation",
            PRESSED: "aria-pressed",
            READONLY: "aria-readonly",
            REQUIRED: "aria-required",
            SELECTED: "aria-selected",
            SORT: "aria-sort",
            VALUEMAX: "aria-valuemax",
            VALUEMIN: "aria-valuemin",
            VALUENOW: "aria-valuenow",
            VALUETEXT: "aria-valuetext",
            ATOMIC: "aria-atomic",
            BUSY: "aria-busy",
            LIVE: "aria-live",
            RELEVANT: "aria-relevant",
            DROPEFFECT: "aria-dropeffect",
            GRABBED: "aria-grabbed",
            ACTIVEDESCENDANT: "aria-activedescendant",
            CONTROLS: "aria-controls",
            DESCRIBEDBY: "aria-describedby",
            FLOWTO: "aria-flowto",
            LABELLEDBY: "aria-labelledby",
            OWNS: "aria-owns",
            POSINSET: "aria-posinset",
            SETSIZE: "aria-setsize"
        }
    }, {}],
    11: [function (e, t, i) {
        "use strict";
        t.exports = ["input", "select", "textarea", "button", "optgroup", "option", "menuitem", "fieldset", "object", "a[href]", "*[tabindex]", "*[contenteditable]"]
    }, {}],
    12: [function (e, t, i) {
        "use strict";
        e("@marcom/ac-polyfills/Array/prototype.slice"), e("@marcom/ac-polyfills/Element/prototype.classList");
        var n = e("./className/add");
        t.exports = function () {
            var e, t = Array.prototype.slice.call(arguments),
                i = t.shift(t);
            if (i.classList && i.classList.add) return void i.classList.add.apply(i.classList, t);
            for (e = 0; e < t.length; e++) n(i, t[e])
        }
    }, {
        "./className/add": 13,
        "@marcom/ac-polyfills/Array/prototype.slice": void 0,
        "@marcom/ac-polyfills/Element/prototype.classList": void 0
    }],
    13: [function (e, t, i) {
        "use strict";
        var n = e("./contains");
        t.exports = function (e, t) {
            n(e, t) || (e.className += " " + t)
        }
    }, {
        "./contains": 14
    }],
    14: [function (e, t, i) {
        "use strict";
        var n = e("./getTokenRegExp");
        t.exports = function (e, t) {
            return n(t).test(e.className)
        }
    }, {
        "./getTokenRegExp": 15
    }],
    15: [function (e, t, i) {
        "use strict";
        t.exports = function (e) {
            return new RegExp("(\\s|^)" + e + "(\\s|$)")
        }
    }, {}],
    16: [function (e, t, i) {
        "use strict";
        var n = e("./contains"),
            r = e("./getTokenRegExp");
        t.exports = function (e, t) {
            n(e, t) && (e.className = e.className.replace(r(t), "$1").trim())
        }
    }, {
        "./contains": 14,
        "./getTokenRegExp": 15
    }],
    17: [function (e, t, i) {
        "use strict";
        e("@marcom/ac-polyfills/Array/prototype.slice"), e("@marcom/ac-polyfills/Element/prototype.classList");
        var n = e("./className/remove");
        t.exports = function () {
            var e, t = Array.prototype.slice.call(arguments),
                i = t.shift(t);
            if (i.classList && i.classList.remove) return void i.classList.remove.apply(i.classList, t);
            for (e = 0; e < t.length; e++) n(i, t[e])
        }
    }, {
        "./className/remove": 16,
        "@marcom/ac-polyfills/Array/prototype.slice": void 0,
        "@marcom/ac-polyfills/Element/prototype.classList": void 0
    }],
    18: [function (e, t, i) {
        "use strict";
        t.exports = function (e, t) {
            var i;
            return t ? (i = e.getBoundingClientRect(), {
                width: i.width,
                height: i.height
            }) : {
                width: e.offsetWidth,
                height: e.offsetHeight
            }
        }
    }, {}],
    19: [function (e, t, i) {
        "use strict";
        var n = e("./getDimensions"),
            r = e("./getScrollX"),
            s = e("./getScrollY");
        t.exports = function (e, t) {
            var i, o, a, c;
            if (t) return i = e.getBoundingClientRect(), o = r(), a = s(), {
                top: i.top + a,
                right: i.right + o,
                bottom: i.bottom + a,
                left: i.left + o
            };
            for (c = n(e, t), i = {
                    top: e.offsetTop,
                    left: e.offsetLeft,
                    width: c.width,
                    height: c.height
                }; e = e.offsetParent;) i.top += e.offsetTop, i.left += e.offsetLeft;
            return {
                top: i.top,
                right: i.left + i.width,
                bottom: i.top + i.height,
                left: i.left
            }
        }
    }, {
        "./getDimensions": 18,
        "./getScrollX": 20,
        "./getScrollY": 21
    }],
    20: [function (e, t, i) {
        "use strict";
        t.exports = function (e) {
            return e = e || window, e === window ? window.scrollX || window.pageXOffset : e.scrollLeft
        }
    }, {}],
    21: [function (e, t, i) {
        "use strict";
        t.exports = function (e) {
            return e = e || window, e === window ? window.scrollY || window.pageYOffset : e.scrollTop
        }
    }, {}],
    22: [function (e, t, i) {
        "use strict";
        t.exports = 8
    }, {}],
    23: [function (e, t, i) {
        "use strict";
        t.exports = 11
    }, {}],
    24: [function (e, t, i) {
        "use strict";
        t.exports = 1
    }, {}],
    25: [function (e, t, i) {
        "use strict";
        t.exports = 3
    }, {}],
    26: [function (e, t, i) {
        "use strict";
        var n = e("../isNode");
        t.exports = function (e, t) {
            return !!n(e) && ("number" == typeof t ? e.nodeType === t : t.indexOf(e.nodeType) !== -1)
        }
    }, {
        "../isNode": 29
    }],
    27: [function (e, t, i) {
        "use strict";
        var n = e("./isNodeType"),
            r = e("../COMMENT_NODE"),
            s = e("../DOCUMENT_FRAGMENT_NODE"),
            o = e("../ELEMENT_NODE"),
            a = e("../TEXT_NODE"),
            c = [o, a, r, s],
            l = " must be an Element, TextNode, Comment, or Document Fragment",
            u = [o, a, r],
            h = " must be an Element, TextNode, or Comment",
            m = [o, s],
            d = " must be an Element, or Document Fragment",
            f = " must have a parentNode";
        t.exports = {
            parentNode: function (e, t, i, r) {
                if (r = r || "target", (e || t) && !n(e, m)) throw new TypeError(i + ": " + r + d)
            },
            childNode: function (e, t, i, r) {
                if (r = r || "target", (e || t) && !n(e, u)) throw new TypeError(i + ": " + r + h)
            },
            insertNode: function (e, t, i, r) {
                if (r = r || "node", (e || t) && !n(e, c)) throw new TypeError(i + ": " + r + l)
            },
            hasParentNode: function (e, t, i) {
                if (i = i || "target", !e.parentNode) throw new TypeError(t + ": " + i + f)
            }
        }
    }, {
        "../COMMENT_NODE": 22,
        "../DOCUMENT_FRAGMENT_NODE": 23,
        "../ELEMENT_NODE": 24,
        "../TEXT_NODE": 25,
        "./isNodeType": 26
    }],
    28: [function (e, t, i) {
        "use strict";
        var n = e("./internal/isNodeType"),
            r = e("./ELEMENT_NODE");
        t.exports = function (e) {
            return n(e, r)
        }
    }, {
        "./ELEMENT_NODE": 24,
        "./internal/isNodeType": 26
    }],
    29: [function (e, t, i) {
        "use strict";
        t.exports = function (e) {
            return !(!e || !e.nodeType)
        }
    }, {}],
    30: [function (e, t, i) {
        "use strict";
        var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                return typeof e
            } : function (e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            r = /^\[object (HTMLCollection|NodeList|Object)\]$/;
        t.exports = function (e) {
            return !!e && ("number" == typeof e.length && (!!("object" !== n(e[0]) || e[0] && e[0].nodeType) && r.test(Object.prototype.toString.call(e))))
        }
    }, {}],
    31: [function (e, t, i) {
        "use strict";
        var n = e("./internal/validate");
        t.exports = function (e) {
            return n.childNode(e, !0, "remove"), e.parentNode ? e.parentNode.removeChild(e) : e
        }
    }, {
        "./internal/validate": 27
    }],
    32: [function (e, t, i) {
        "use strict";
        var n = e("./ac-element-engagement/ElementEngagement");
        t.exports = new n, t.exports.ElementEngagement = n
    }, {
        "./ac-element-engagement/ElementEngagement": 33
    }],
    33: [function (e, t, i) {
        "use strict";
        var n, r = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            s = {
                defaults: e("@marcom/ac-object/defaults"),
                extend: e("@marcom/ac-object/extend")
            },
            o = e("@marcom/ac-element-tracker").ElementTracker,
            a = {
                timeToEngage: 500,
                inViewThreshold: .75,
                stopOnEngaged: !0
            },
            c = {
                thresholdEnterTime: 0,
                thresholdExitTime: 0,
                inThreshold: !1,
                engaged: !1,
                tracking: !0
            },
            l = function (e) {
                o.call(this, null, e), r.call(this), this._thresholdEnter = this._thresholdEnter.bind(this), this._thresholdExit = this._thresholdExit.bind(this), this._enterView = this._enterView.bind(this), this._exitView = this._exitView.bind(this)
            };
        n = l.prototype = Object.create(o.prototype), n = s.extend(n, r.prototype), n._decorateTrackedElement = function (e, t) {
            var i;
            i = s.defaults(a, t || {}), s.extend(e, i), s.extend(e, c)
        }, n._attachElementListeners = function (e) {
            e.on("thresholdenter", this._thresholdEnter, this), e.on("thresholdexit", this._thresholdExit, this), e.on("enterview", this._enterView, this), e.on("exitview", this._exitView, this)
        }, n._removeElementListeners = function (e) {
            e.off("thresholdenter", this._thresholdEnter), e.off("thresholdexit", this._thresholdExit), e.off("enterview", this._enterView), e.off("exitview", this._exitView)
        }, n._attachAllElementListeners = function () {
            this.elements.forEach(function (e) {
                e.stopOnEngaged ? e.engaged || this._attachElementListeners(e) : this._attachElementListeners(e)
            }, this)
        }, n._removeAllElementListeners = function () {
            this.elements.forEach(function (e) {
                this._removeElementListeners(e)
            }, this)
        }, n._elementInViewPastThreshold = function (e) {
            var t = !1;
            return t = e.pixelsInView === this._windowHeight || e.percentInView > e.inViewThreshold
        }, n._ifInView = function (e, t) {
            var i = e.inThreshold;
            o.prototype._ifInView.apply(this, arguments), !i && this._elementInViewPastThreshold(e) && (e.inThreshold = !0, e.trigger("thresholdenter", e), "number" == typeof e.timeToEngage && e.timeToEngage >= 0 && (e.engagedTimeout = window.setTimeout(this._engaged.bind(this, e), e.timeToEngage)))
        }, n._ifAlreadyInView = function (e) {
            var t = e.inThreshold;
            o.prototype._ifAlreadyInView.apply(this, arguments), t && !this._elementInViewPastThreshold(e) && (e.inThreshold = !1, e.trigger("thresholdexit", e), e.engagedTimeout && (window.clearTimeout(e.engagedTimeout), e.engagedTimeout = null))
        }, n._engaged = function (e) {
            e.engagedTimeout = null, this._elementEngaged(e), e.trigger("engaged", e), this.trigger("engaged", e)
        }, n._thresholdEnter = function (e) {
            e.thresholdEnterTime = Date.now(), e.thresholdExitTime = 0, this.trigger("thresholdenter", e)
        }, n._thresholdExit = function (e) {
            e.thresholdExitTime = Date.now(), this.trigger("thresholdexit", e)
        }, n._enterView = function (e) {
            this.trigger("enterview", e)
        }, n._exitView = function (e) {
            this.trigger("exitview", e)
        }, n._elementEngaged = function (e) {
            e.engaged = !0, e.stopOnEngaged && this.stop(e)
        }, n.stop = function (e) {
            this.tracking && !e && (this._removeAllElementListeners(), o.prototype.stop.call(this)), e && e.tracking && (e.tracking = !1, this._removeElementListeners(e), this.removeElement(e))
        }, n.start = function (e) {
            e || this._attachAllElementListeners(), e && !e.tracking && (e.stopOnEngaged ? e.engaged || (e.tracking = !0, this._attachElementListeners(e)) : (e.tracking = !0, this._attachElementListeners(e))), this.tracking ? (this.refreshAllElementMetrics(), this.refreshAllElementStates()) : o.prototype.start.call(this)
        }, n.addElement = function (e, t) {
            t = t || {};
            var i = o.prototype.addElement.call(this, e, t.useRenderedPosition);
            return this._decorateTrackedElement(i, t), i
        }, n.addElements = function (e, t) {
            [].forEach.call(e, function (e) {
                this.addElement(e, t)
            }, this)
        }, t.exports = l
    }, {
        "@marcom/ac-element-tracker": 34,
        "@marcom/ac-event-emitter-micro": 37,
        "@marcom/ac-object/defaults": 70,
        "@marcom/ac-object/extend": 71
    }],
    34: [function (e, t, i) {
        "use strict";
        var n = e("./ac-element-tracker/ElementTracker"),
            r = e("./ac-element-tracker/TrackedElement");
        t.exports = new n, t.exports.ElementTracker = n, t.exports.TrackedElement = r
    }, {
        "./ac-element-tracker/ElementTracker": 35,
        "./ac-element-tracker/TrackedElement": 36
    }],
    35: [function (e, t, i) {
        "use strict";

        function n(e, t) {
            this.options = a.clone(l), this.options = "object" === ("undefined" == typeof t ? "undefined" : r(t)) ? a.extend(this.options, t) : this.options, this._scrollY = this._getScrollY(), this._windowHeight = this._getWindowHeight(), this.tracking = !1, this.elements = [], e && (Array.isArray(e) || s.isNodeList(e) || s.isElement(e)) && this.addElements(e), this.refreshAllElementStates = this.refreshAllElementStates.bind(this), this.refreshAllElementMetrics = this.refreshAllElementMetrics.bind(this), this.options.autoStart && this.start()
        }
        var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                return typeof e
            } : function (e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            s = {
                isNodeList: e("@marcom/ac-dom-nodes/isNodeList"),
                isElement: e("@marcom/ac-dom-nodes/isElement")
            },
            o = {
                getDimensions: e("@marcom/ac-dom-metrics/getDimensions"),
                getPagePosition: e("@marcom/ac-dom-metrics/getPagePosition"),
                getScrollY: e("@marcom/ac-dom-metrics/getScrollY")
            },
            a = {
                clone: e("@marcom/ac-object/clone"),
                extend: e("@marcom/ac-object/extend")
            },
            c = e("./TrackedElement"),
            l = {
                autoStart: !1,
                useRenderedPosition: !1
            },
            u = n.prototype;
        u.destroy = function () {
            var e, t;
            for (this.stop(), e = 0, t = this.elements.length; e < t; e++) this.elements[e].destroy();
            this.elements = null, this.options = null
        }, u._registerTrackedElements = function (e) {
            var t = [].concat(e);
            t.forEach(function (e) {
                this._elementInDOM(e.element) && (e.offsetTop = e.element.offsetTop, this.elements.push(e))
            }, this)
        }, u._elementInDOM = function (e) {
            var t = !1,
                i = document.getElementsByTagName("body")[0];
            return s.isElement(e) && i.contains(e) && (t = !0), t
        }, u._elementPercentInView = function (e) {
            return e.pixelsInView / e.height
        }, u._elementPixelsInView = function (e) {
            var t = e.top - this._scrollY,
                i = e.bottom - this._scrollY;
            return t > this._windowHeight || i < 0 ? 0 : Math.min(i, this._windowHeight) - Math.max(t, 0)
        }, u._ifInView = function (e, t) {
            t || e.trigger("enterview", e)
        }, u._ifAlreadyInView = function (e) {
            e.inView || e.trigger("exitview", e)
        }, u.addElements = function (e, t) {
            "undefined" == typeof t && (t = this.options.useRenderedPosition), e = s.isNodeList(e) ? Array.prototype.slice.call(e) : [].concat(e);
            for (var i = 0, n = e.length; i < n; i++) this.addElement(e[i], t)
        }, u.addElement = function (e, t) {
            var i = null;
            if ("undefined" == typeof t && (t = this.options.useRenderedPosition), !s.isElement(e)) throw new TypeError("ElementTracker: " + e + " is not a valid DOM element");
            return i = new c(e, t), this._registerTrackedElements(i), this.refreshElementMetrics(i), this.refreshElementState(i), i
        }, u.removeElement = function (e) {
            var t, i = [];
            this.elements.forEach(function (t, n) {
                t !== e && t.element !== e || i.push(n)
            }), t = this.elements.filter(function (e, t) {
                return i.indexOf(t) < 0
            }), this.elements = t
        }, u.start = function () {
            this.tracking === !1 && (this.tracking = !0, window.addEventListener("resize", this.refreshAllElementMetrics), window.addEventListener("orientationchange", this.refreshAllElementMetrics), window.addEventListener("scroll", this.refreshAllElementStates), this.refreshAllElementMetrics())
        }, u.stop = function () {
            this.tracking === !0 && (this.tracking = !1, window.removeEventListener("resize", this.refreshAllElementMetrics), window.removeEventListener("orientationchange", this.refreshAllElementMetrics), window.removeEventListener("scroll", this.refreshAllElementStates))
        }, u.refreshAllElementMetrics = function (e, t) {
            "number" != typeof e && (e = this._getScrollY()), "number" != typeof t && (t = this._getWindowHeight()), this._scrollY = e, this._windowHeight = t, this.elements.forEach(this.refreshElementMetrics, this)
        }, u.refreshElementMetrics = function (e) {
            if (!e.isActive) return e;
            var t = o.getDimensions(e.element, e.useRenderedPosition),
                i = o.getPagePosition(e.element, e.useRenderedPosition);
            return e = a.extend(e, t, i), this.refreshElementState(e)
        }, u.refreshAllElementStates = function (e) {
            "number" != typeof e && (e = this._getScrollY()), this._scrollY = e, this.elements.forEach(this.refreshElementState, this)
        }, u.refreshElementState = function (e) {
            if (!e.isActive) return e;
            var t = e.inView;
            return e.pixelsInView = this._elementPixelsInView(e), e.percentInView = this._elementPercentInView(e), e.inView = e.pixelsInView > 0, e.inView && this._ifInView(e, t), t && this._ifAlreadyInView(e), e
        }, u.pauseElementTracking = function (e) {
            e && (e.isActive = !1)
        }, u.resumeElementTracking = function (e) {
            e && (e.isActive = !0)
        }, u._getWindowHeight = function () {
            return window.innerHeight
        }, u._getScrollY = function () {
            return o.getScrollY()
        }, t.exports = n
    }, {
        "./TrackedElement": 36,
        "@marcom/ac-dom-metrics/getDimensions": 18,
        "@marcom/ac-dom-metrics/getPagePosition": 19,
        "@marcom/ac-dom-metrics/getScrollY": 21,
        "@marcom/ac-dom-nodes/isElement": 28,
        "@marcom/ac-dom-nodes/isNodeList": 30,
        "@marcom/ac-object/clone": 68,
        "@marcom/ac-object/extend": 71
    }],
    36: [function (e, t, i) {
        "use strict";

        function n(e, t) {
            if (!r.isElement(e)) throw new TypeError("TrackedElement: " + e + " is not a valid DOM element");
            s.call(this), this.element = e, this.inView = !1, this.isActive = !0, this.percentInView = 0, this.pixelsInView = 0, this.offsetTop = 0, this.top = 0, this.right = 0, this.bottom = 0, this.left = 0, this.width = 0, this.height = 0, this.useRenderedPosition = t || !1
        }
        var r = {
                isElement: e("@marcom/ac-dom-nodes/isElement")
            },
            s = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            o = s.prototype,
            a = n.prototype = Object.create(o);
        a.destroy = function () {
            this.element = null, o.destroy.call(this)
        }, t.exports = n
    }, {
        "@marcom/ac-dom-nodes/isElement": 28,
        "@marcom/ac-event-emitter-micro": 37
    }],
    37: [function (e, t, i) {
        "use strict";
        t.exports = {
            EventEmitterMicro: e("./ac-event-emitter-micro/EventEmitterMicro")
        }
    }, {
        "./ac-event-emitter-micro/EventEmitterMicro": 38
    }],
    38: [function (e, t, i) {
        "use strict";

        function n() {
            this._events = {}
        }
        var r = n.prototype;
        r.on = function (e, t) {
            this._events[e] = this._events[e] || [], this._events[e].unshift(t)
        }, r.once = function (e, t) {
            function i(r) {
                n.off(e, i), void 0 !== r ? t(r) : t()
            }
            var n = this;
            this.on(e, i)
        }, r.off = function (e, t) {
            if (this.has(e)) {
                if (1 === arguments.length) return this._events[e] = null, void delete this._events[e];
                var i = this._events[e].indexOf(t);
                i !== -1 && this._events[e].splice(i, 1)
            }
        }, r.trigger = function (e, t) {
            if (this.has(e))
                for (var i = this._events[e].length - 1; i >= 0; i--) void 0 !== t ? this._events[e][i](t) : this._events[e][i]()
        }, r.has = function (e) {
            return e in this._events != !1 && 0 !== this._events[e].length
        }, r.destroy = function () {
            for (var e in this._events) this._events[e] = null;
            this._events = null
        }, t.exports = n
    }, {}],
    39: [function (e, t, i) {
        "use strict";

        function n() {
            var e = 0;
            Array.from(document.querySelectorAll(u)).forEach(function (t, i) {
                var n = parseInt(window.getComputedStyle(t).getPropertyValue("--columns-for-analytics-only"));
                if (!isNaN(n)) {
                    var s = Array.from(t.querySelectorAll(m));
                    if (s && s.length > 0) {
                        var o = 0;
                        s.forEach(function (t, i) {
                            var s = i + 1;
                            o = Math.ceil(s / n);
                            var a = e + o,
                                c = s - (o - 1) * n;
                            r(t, a, o, c, n)
                        }), e += o
                    } else {
                        e++;
                        var a = e + 0,
                            c = n,
                            c = 1;
                        r(t, a, o, c, n)
                    }
                }
            })
        }

        function r(e, t, i, n, r) {
            Array.from(e.querySelectorAll("a")).forEach(function (i, s) {
                var o = 1 === r ? 0 : n,
                    a = i.getAttribute("data-analytics-title") || i.getAttribute("aria-label") || i.innerText;
                if (!/\w/.test(a)) {
                    var c = e.getAttribute("data-module-template"),
                        l = e.getAttribute("data-unit-id");
                    if (l) {
                        for (var u = e.parentNode; !c;) c = u.getAttribute("data-module-template"), u = u.parentNode;
                        a = c + " " + l
                    } else a = c;
                    /\w/.test(i.className) && (a += " " + i.className)
                }
                a = a.split("’").join("").split(/[^\w]+/).join(" ").toLowerCase();
                var h = {
                    eVar102: t + "." + o + ":" + a,
                    eVar103: "abcdefghijklmnopqrstuvwxyz".charAt(n - 1)
                };
                i.addEventListener("mouseup", function () {
                    d.passiveTracker(h)
                })
            })
        }
        var s = (e("@marcom/feature-detect/isTablet"), e("@marcom/feature-detect/touchAvailable"), e("@marcom/viewport-emitter"), e("@marcom/anim-system")),
            o = e("@marcom/anim-system/Model/AnimSystemModel"),
            a = e("@marcom/anim-lazy-image/AnimLazyImage");
        o.BREAKPOINTS = [{
            name: "S",
            mediaQuery: "only screen and (max-width: 734px)"
        }, {
            name: "M",
            mediaQuery: "only screen and (max-width: 1068px)"
        }, {
            name: "L",
            mediaQuery: "only screen and (min-width: 1441px)"
        }, {
            name: "L",
            mediaQuery: "only screen and (min-width: 1069px)"
        }];
        var c = e("./js/TextZoomManager.js"),
            l = (new c, "data-module-template"),
            u = "[" + l + "]",
            h = "data-unit-id",
            m = "[" + h + "]",
            d = null;
        try {
            d = e("@marcom/ac-analytics")
        } catch (f) {}
        var p = e("./js/extendedHomepageSectionsLib.built.js");
        t.exports = function () {
            function e() {
                var e, t, i, n = document.querySelector("meta[property=analytics-track]");
                if (n && n.content && (i = document.querySelector("[data-module-template]"), i && (e = i.querySelector("[data-analytics-section-engagement]"), e && e.hasAttribute("data-analytics-section-engagement") && (t = e.getAttribute("data-analytics-section-engagement").split(":")[1])))) return "0. " + n.content.toLowerCase() + " - " + t + " - section engaged .0"
            }

            function t() {
                n();
                var t = {
                        page: {
                            data: {}
                        }
                    },
                    i = e();
                i && (t.page.data.prop34 = i), d.createBasicObserverSuite(t)
            }
            var i = [];
            s.on("ON_DOM_KEYFRAMES_CREATED", function () {
                new a, [].forEach.call(document.querySelectorAll(u), function (e, t) {
                    var n = e.getAttribute(l),
                        r = p[n].SectionClass,
                        o = p[n].collectionUnits;
                    i.push(new r(e, t, o, s))
                })
            }), s.initialize(), d && t()
        }
    }, {
        "./js/TextZoomManager.js": 43,
        "./js/extendedHomepageSectionsLib.built.js": 44,
        "@marcom/ac-analytics": void 0,
        "@marcom/anim-lazy-image/AnimLazyImage": 94,
        "@marcom/anim-system": 112,
        "@marcom/anim-system/Model/AnimSystemModel": 117,
        "@marcom/feature-detect/isTablet": 132,
        "@marcom/feature-detect/touchAvailable": 133,
        "@marcom/viewport-emitter": 150
    }],
    40: [function (e, t, i) {
        "use strict";

        function n(e, t, i) {
            r.apply(this, arguments)
        }
        var r = e("../../js/BaseHomepageSection.js"),
            s = r.prototype,
            o = n.prototype = Object.create(s);
        o.destroy = function () {
            s.destroy.call(this)
        }, t.exports = n
    }, {
        "../../js/BaseHomepageSection.js": 41
    }],
    41: [function (e, t, i) {
        "use strict";

        function n(t, i, n, s) {
            r.apply(this), this.sectionElement = t, this.sectionIndex = i, this.moduleTemplateName = t.getAttribute("data-module-template"), this.viewportEmitter = e("@marcom/viewport-emitter"), this.AnimSystem = s, this.sectionAnalyticsRegion = t.getAttribute("data-analytics-region"), this.collectionUnits = this.sectionElement.querySelectorAll("[data-unit-id]"), this.elementEngagement = new o, this.elementEngagement.start(), this.collectionUnitObjs = {}, this._setDebouncedResizeEvents(500), this.initContentUnitClasses(n)
        }
        var r = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            s = r.prototype,
            o = e("@marcom/ac-element-engagement").ElementEngagement,
            a = e("./BaseHomepageUnit"),
            c = n.prototype = Object.create(s);
        c.initContentUnitClasses = function (e) {
            Array.from(this.collectionUnits).forEach(function (t) {
                var i = t.getAttribute("data-unit-id"),
                    n = e[i] ? e[i] : a;
                this.collectionUnitObjs[i] = new n(t, i, this)
            }.bind(this))
        }, c.destroy = function () {
            s.destroy.call(this)
        }, c.addWrapperClass = function (e) {
            this.sectionElement.classList.add(e)
        }, c.removeWrapperClass = function (e) {
            this.sectionElement.classList.remove(e)
        }, c._setDebouncedResizeEvents = function (e) {
            var t = !1;
            window.addEventListener("resize", function () {
                clearTimeout(this._checkResizeEndTimer), t || (this.trigger("resize:start"), t = !0), this._checkResizeEndTimer = setTimeout(function () {
                    t && (t = !1, this.trigger("resize:end"))
                }.bind(this), e)
            }.bind(this))
        }, t.exports = n
    }, {
        "./BaseHomepageUnit": 42,
        "@marcom/ac-element-engagement": 32,
        "@marcom/ac-event-emitter-micro": 37,
        "@marcom/viewport-emitter": 150
    }],
    42: [function (e, t, i) {
        "use strict";

        function n(e, t, i) {
            r.apply(this), this.collectionUnitElement = e, this.unitWrapperElement = this.collectionUnitElement.querySelector(".unit-wrapper"), this.id = t, this.sectionObj = i, this.AnimSystem = i.AnimSystem, this.handleLinkAccessibilityConcerns()
        }
        var r = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            s = r.prototype,
            o = n.prototype = Object.create(s);
        o.setVoiceoverCopy = function () {
            if (this.unitWrapperElement) {
                var e = /^\s*$/,
                    t = this.unitWrapperElement.querySelector("a.unit-link"),
                    i = t.querySelector(".unit-link-vo");
                if (t && i) {
                    var n = i.textContent,
                        r = e.test(n),
                        s = Array.from(this.unitWrapperElement.querySelectorAll(".unit-copy-wrapper>*:not(a)"));
                    s.forEach(function (t) {
                        if (r) {
                            var i = t.innerText && "" != t.innerText ? t.innerText : t.textContent;
                            if (i = i.replace(/[\r\n]/g, " "), e.test(i)) return;
                            /[a-z0-9]\s*$/i.test(i) && (i += "."), n += i.split(/\.$/).join(". ")
                        }
                        t.setAttribute("aria-hidden", !0)
                    }), r && (t.setAttribute("aria-label", n), i.innerHTML = n)
                }
            }
        }, o.handleLinkAccessibilityConcerns = function () {
            if (this.unitWrapperElement) {
                var e = this.unitWrapperElement.querySelector("a.unit-link"),
                    t = e ? e.href : null,
                    i = e ? e.getAttribute("aria-label") : null,
                    n = this.unitWrapperElement.querySelectorAll(".cta-links a"),
                    r = function () {
                        var e = [];
                        return n.forEach(function (t, i) {
                            e.push(t.href)
                        }), e
                    }(),
                    s = t && r.indexOf(t) >= 0,
                    o = !i || !/\w/.test(i);
                if (t)
                    if (s) e.removeAttribute("aria-label"), e.setAttribute("aria-hidden", "true"), e.setAttribute("tabindex", "-1");
                    else if (o) {
                    var a = this.unitWrapperElement.querySelector(".unit-copy-wrapper>*:not(a)"),
                        c = a.innerText && "" != a.innerText ? a.innerText : a.textContent;
                    e.setAttribute("aria-label", c)
                }
            }
        }, o.destroy = function () {
            s.destroy.call(this)
        }, t.exports = n
    }, {
        "@marcom/ac-event-emitter-micro": 37
    }],
    43: [function (e, t, i) {
        "use strict";

        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function s(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var a = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var n = t[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function (t, i, n) {
                    return i && e(t.prototype, i), n && e(t, n), t
                }
            }(),
            c = e("@marcom/useragent-detect"),
            l = (n(c), e("@marcom/ac-raf-emitter")),
            u = e("@marcom/ac-event-emitter-micro"),
            h = e("@marcom/ac-accessibility/TextZoom"),
            m = "textZoomChange",
            d = "data-text-zoom",
            f = 17,
            p = [1.2, 1.44, 1.72, 2.07, 2.48, 2.98],
            v = function (e) {
                function t() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : f,
                        i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : p;
                    r(this, t);
                    var n = s(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                    return n.baseFontSize = e, n.fontSizeDeltas = i, h.detect(n.baseFontSize), n._cachedTextZoomDeltaFloat = 1, n._cachedTextZoomFactor = 0, n._rafEmitter = new l.RAFEmitter, n._htmlElement = document.querySelector("html"), n._listenForChanges(), n._checkForTextZoomChange(), n
                }
                return o(t, e), a(t, [{
                    key: "_listenForChanges",
                    value: function () {
                        var e = this;
                        window.addEventListener("resize", function (t) {
                            e._checkForTextZoomChange()
                        })
                    }
                }, {
                    key: "_checkForTextZoomChange",
                    value: function () {
                        var e = this,
                            t = 4;
                        this._rafEmitter.on("update", function () {
                            t--;
                            var i = e.getTextZoomDeltaAsFloat();
                            i != e._cachedTextZoomDeltaFloat ? (e._cachedTextZoomDeltaFloat = i, e._cachedTextZoomDeltaFactor = e.getTextZoomAsFactor(), e._setTextZoomDataAttribute(), e.trigger(m, {
                                zoomAsFloat: e._cachedTextZoomDeltaFloat,
                                zoomAsFactor: e._cachedTextZoomDeltaFactor
                            })) : t > 0 && e._rafEmitter.run()
                        }), this._rafEmitter.run()
                    }
                }, {
                    key: "_setTextZoomDataAttribute",
                    value: function () {
                        var e = this;
                        this._rafEmitter.on("draw", function () {
                            var t = e._cachedTextZoomDeltaFactor > 0 ? "setAttribute" : "removeAttribute";
                            e._htmlElement[t](d, e._cachedTextZoomDeltaFactor)
                        })
                    }
                }, {
                    key: "getTextZoomAsFactor",
                    value: function () {
                        var e = 0,
                            t = this.getTextZoomDeltaAsFloat();
                        return this.fontSizeDeltas.forEach(function (i) {
                            t > i && e++
                        }), e
                    }
                }, {
                    key: "getTextZoomDeltaAsFloat",
                    value: function () {
                        return parseFloat(h.currentSize) / this.baseFontSize
                    }
                }]), t
            }(u.EventEmitterMicro);
        t.exports = v
    }, {
        "@marcom/ac-accessibility/TextZoom": 2,
        "@marcom/ac-event-emitter-micro": 37,
        "@marcom/ac-raf-emitter": 78,
        "@marcom/useragent-detect": 139
    }],
    44: [function (e, t, i) {
        "use strict";
        t.exports = {
            "behind-the-mac-takeover": {
                SectionClass: e("../../../../../src/content/modules/behind-the-mac-takeover/behind-the-mac-takeover.js"),
                collectionUnits: e("../../../../../tmp/collection-units.behind-the-mac-takeover.built.js")
            },
            generic: {
                SectionClass: e("../built-in-module-templates/generic/generic.js"),
                collectionUnits: e("../../../../../tmp/collection-units.generic.built.js")
            },
            heroes: {
                SectionClass: e("../built-in-module-templates/generic/generic.js"),
                collectionUnits: e("../../../../../tmp/collection-units.heroes.built.js")
            },
            promos: {
                SectionClass: e("../built-in-module-templates/generic/generic.js"),
                collectionUnits: e("../../../../../tmp/collection-units.promos.built.js")
            },
            "supports-shared-modals": {
                SectionClass: e("../built-in-module-templates/generic/generic.js"),
                collectionUnits: e("../../../../../tmp/collection-units.supports-shared-modals.built.js")
            }
        }
    }, {
        "../../../../../src/content/modules/behind-the-mac-takeover/behind-the-mac-takeover.js": 168,
        "../../../../../tmp/collection-units.behind-the-mac-takeover.built.js": 175,
        "../../../../../tmp/collection-units.generic.built.js": 176,
        "../../../../../tmp/collection-units.heroes.built.js": 177,
        "../../../../../tmp/collection-units.promos.built.js": 178,
        "../../../../../tmp/collection-units.supports-shared-modals.built.js": 179,
        "../built-in-module-templates/generic/generic.js": 40
    }],
    45: [function (e, t, i) {
        "use strict";
        t.exports = function (e, t, i, n) {
            return e.addEventListener ? e.addEventListener(t, i, !!n) : e.attachEvent("on" + t, i), e
        }
    }, {}],
    46: [function (e, t, i) {
        "use strict";
        t.exports = function (e, t, i, n) {
            return e.removeEventListener ? e.removeEventListener(t, i, !!n) : e.detachEvent("on" + t, i), e
        }
    }, {}],
    47: [function (e, t, i) {
        "use strict";

        function n(e) {
            this._keysDown = {}, this._DOMKeyDown = this._DOMKeyDown.bind(this), this._DOMKeyUp = this._DOMKeyUp.bind(this), this._context = e || document, s(this._context, l, this._DOMKeyDown, !0), s(this._context, u, this._DOMKeyUp, !0), r.call(this)
        }
        var r = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            s = e("@marcom/ac-dom-events/utils/addEventListener"),
            o = e("@marcom/ac-dom-events/utils/removeEventListener"),
            a = e("@marcom/ac-object/create"),
            c = e("./internal/KeyEvent"),
            l = "keydown",
            u = "keyup",
            h = n.prototype = a(r.prototype);
        h.onDown = function (e, t) {
            return this.on(l + ":" + e, t)
        }, h.onceDown = function (e, t) {
            return this.once(l + ":" + e, t)
        }, h.offDown = function (e, t) {
            return this.off(l + ":" + e, t)
        }, h.onUp = function (e, t) {
            return this.on(u + ":" + e, t)
        }, h.onceUp = function (e, t) {
            return this.once(u + ":" + e, t)
        }, h.offUp = function (e, t) {
            return this.off(u + ":" + e, t)
        }, h.isDown = function (e) {
            return e += "", this._keysDown[e] || !1
        }, h.isUp = function (e) {
            return !this.isDown(e)
        }, h.destroy = function () {
            return o(this._context, l, this._DOMKeyDown, !0), o(this._context, u, this._DOMKeyUp, !0), this._keysDown = null, this._context = null, r.prototype.destroy.call(this), this
        }, h._DOMKeyDown = function (e) {
            var t = this._normalizeKeyboardEvent(e),
                i = t.keyCode += "";
            this._trackKeyDown(i), this.trigger(l + ":" + i, t)
        }, h._DOMKeyUp = function (e) {
            var t = this._normalizeKeyboardEvent(e),
                i = t.keyCode += "";
            this._trackKeyUp(i), this.trigger(u + ":" + i, t)
        }, h._normalizeKeyboardEvent = function (e) {
            return new c(e)
        }, h._trackKeyUp = function (e) {
            this._keysDown[e] && (this._keysDown[e] = !1)
        }, h._trackKeyDown = function (e) {
            this._keysDown[e] || (this._keysDown[e] = !0)
        }, t.exports = n
    }, {
        "./internal/KeyEvent": 49,
        "@marcom/ac-dom-events/utils/addEventListener": 45,
        "@marcom/ac-dom-events/utils/removeEventListener": 46,
        "@marcom/ac-event-emitter-micro": 37,
        "@marcom/ac-object/create": 69
    }],
    48: [function (e, t, i) {
        "use strict";
        var n = e("./Keyboard");
        t.exports = new n
    }, {
        "./Keyboard": 47
    }],
    49: [function (e, t, i) {
        "use strict";

        function n(e) {
            this.originalEvent = e;
            var t;
            for (t in e) r.indexOf(t) === -1 && "function" != typeof e[t] && (this[t] = e[t]);
            this.location = void 0 !== this.originalEvent.location ? this.originalEvent.location : this.originalEvent.keyLocation
        }
        var r = ["keyLocation"];
        n.prototype = {
            preventDefault: function () {
                return "function" != typeof this.originalEvent.preventDefault ? void(this.originalEvent.returnValue = !1) : this.originalEvent.preventDefault()
            },
            stopPropagation: function () {
                return this.originalEvent.stopPropagation()
            }
        }, t.exports = n
    }, {}],
    50: [function (e, t, i) {
        "use strict";
        t.exports = {
            BACKSPACE: 8,
            TAB: 9,
            ENTER: 13,
            SHIFT: 16,
            CONTROL: 17,
            ALT: 18,
            COMMAND: 91,
            CAPSLOCK: 20,
            ESCAPE: 27,
            PAGE_UP: 33,
            PAGE_DOWN: 34,
            END: 35,
            HOME: 36,
            ARROW_LEFT: 37,
            ARROW_UP: 38,
            ARROW_RIGHT: 39,
            ARROW_DOWN: 40,
            DELETE: 46,
            ZERO: 48,
            ONE: 49,
            TWO: 50,
            THREE: 51,
            FOUR: 52,
            FIVE: 53,
            SIX: 54,
            SEVEN: 55,
            EIGHT: 56,
            NINE: 57,
            A: 65,
            B: 66,
            C: 67,
            D: 68,
            E: 69,
            F: 70,
            G: 71,
            H: 72,
            I: 73,
            J: 74,
            K: 75,
            L: 76,
            M: 77,
            N: 78,
            O: 79,
            P: 80,
            Q: 81,
            R: 82,
            S: 83,
            T: 84,
            U: 85,
            V: 86,
            W: 87,
            X: 88,
            Y: 89,
            Z: 90,
            NUMPAD_ZERO: 96,
            NUMPAD_ONE: 97,
            NUMPAD_TWO: 98,
            NUMPAD_THREE: 99,
            NUMPAD_FOUR: 100,
            NUMPAD_FIVE: 101,
            NUMPAD_SIX: 102,
            NUMPAD_SEVEN: 103,
            NUMPAD_EIGHT: 104,
            NUMPAD_NINE: 105,
            NUMPAD_ASTERISK: 106,
            NUMPAD_PLUS: 107,
            NUMPAD_DASH: 109,
            NUMPAD_DOT: 110,
            NUMPAD_SLASH: 111,
            NUMPAD_EQUALS: 187,
            TICK: 192,
            LEFT_BRACKET: 219,
            RIGHT_BRACKET: 221,
            BACKSLASH: 220,
            SEMICOLON: 186,
            APOSTRAPHE: 222,
            APOSTROPHE: 222,
            SPACEBAR: 32,
            CLEAR: 12,
            COMMA: 188,
            DOT: 190,
            SLASH: 191
        }
    }, {}],
    51: [function (e, t, i) {
        "use strict";
        var n = e("./utils/addEventListener"),
            r = e("./shared/getEventType");
        t.exports = function (e, t, i, s) {
            return t = r(e, t), n(e, t, i, s)
        }
    }, {
        "./shared/getEventType": 53,
        "./utils/addEventListener": 55
    }],
    52: [function (e, t, i) {
        "use strict";
        var n = e("./utils/removeEventListener"),
            r = e("./shared/getEventType");
        t.exports = function (e, t, i, s) {
            return t = r(e, t), n(e, t, i, s)
        }
    }, {
        "./shared/getEventType": 53,
        "./utils/removeEventListener": 56
    }],
    53: [function (e, t, i) {
        "use strict";
        var n = e("@marcom/ac-prefixer/getEventType");
        t.exports = function (e, t) {
            var i, r;
            return i = "tagName" in e ? e.tagName : e === window ? "window" : "document", r = n(t, i), r ? r : t
        }
    }, {
        "@marcom/ac-prefixer/getEventType": 72
    }],
    54: [function (e, t, i) {
        "use strict";
        t.exports = function (e) {
            return e = e || window.event, "undefined" != typeof e.target ? e.target : e.srcElement
        }
    }, {}],
    55: [function (e, t, i) {
        arguments[4][45][0].apply(i, arguments)
    }, {
        dup: 45
    }],
    56: [function (e, t, i) {
        arguments[4][46][0].apply(i, arguments)
    }, {
        dup: 46
    }],
    57: [function (e, t, i) {
        "use strict";
        t.exports = function (e) {
            var t;
            if (e = e || window, e === window) {
                if (t = window.pageXOffset) return t;
                e = document.documentElement || document.body.parentNode || document.body
            }
            return e.scrollLeft
        }
    }, {}],
    58: [function (e, t, i) {
        "use strict";
        t.exports = function (e) {
            var t;
            if (e = e || window, e === window) {
                if (t = window.pageYOffset) return t;
                e = document.documentElement || document.body.parentNode || document.body
            }
            return e.scrollTop
        }
    }, {}],
    59: [function (e, t, i) {
        "use strict";
        t.exports = {
            Modal: e("./ac-modal-basic/Modal"),
            Renderer: e("./ac-modal-basic/Renderer"),
            classNames: e("./ac-modal-basic/classNames"),
            dataAttributes: e("./ac-modal-basic/dataAttributes")
        }
    }, {
        "./ac-modal-basic/Modal": 60,
        "./ac-modal-basic/Renderer": 61,
        "./ac-modal-basic/classNames": 62,
        "./ac-modal-basic/dataAttributes": 63
    }],
    60: [function (e, t, i) {
        "use strict";

        function n(e, t) {
            l.call(this), this.options = o.defaults(h, e), this.renderer = new u(t), this.opened = !1, this._keysToClose = [c.ESCAPE], this._attachedKeysToClose = [], this.close = this.close.bind(this)
        }
        var r = {
                addEventListener: e("@marcom/ac-dom-events/addEventListener"),
                removeEventListener: e("@marcom/ac-dom-events/removeEventListener"),
                target: e("@marcom/ac-dom-events/target")
            },
            s = {
                getScrollX: e("@marcom/ac-dom-metrics/getScrollX"),
                getScrollY: e("@marcom/ac-dom-metrics/getScrollY")
            },
            o = {
                create: e("@marcom/ac-object/create"),
                defaults: e("@marcom/ac-object/defaults")
            },
            a = e("@marcom/ac-keyboard"),
            c = e("@marcom/ac-keyboard/keyMap"),
            l = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            u = e("./Renderer"),
            h = {
                retainScrollPosition: !1
            },
            m = n.prototype = o.create(l.prototype);
        m.open = function () {
            this.options.retainScrollPosition && this._saveScrollPosition(), this.opened || (this._attachEvents(), this.trigger("willopen"), this.renderer.open(), this.opened = !0, this.trigger("open"))
        }, m.close = function (e) {
            var t, i;
            if (this.opened) {
                if (e && "click" === e.type && (t = r.target(e), i = this.renderer.options.dataAttributes.close, !t.hasAttribute(i))) return;
                this.trigger("willclose"), this._removeEvents(), this.renderer.close(), this.options.retainScrollPosition && this._restoreScrollPosition(), this.opened = !1, this.trigger("close")
            }
        }, m.render = function () {
            this.renderer.render()
        }, m.appendContent = function (e, t) {
            this.renderer.appendContent(e, t)
        }, m.removeContent = function (e) {
            this.renderer.removeContent(e)
        }, m.destroy = function () {
            this._removeEvents(), this.renderer.destroy();
            for (var e in this) this.hasOwnProperty(e) && (this[e] = null)
        }, m.addKeyToClose = function (e) {
            var t = this._keysToClose.indexOf(e);
            t === -1 && (this._keysToClose.push(e), this._bindKeyToClose(e))
        }, m.removeKeyToClose = function (e) {
            var t = this._keysToClose.indexOf(e);
            t !== -1 && this._keysToClose.splice(t, 1), this._releaseKeyToClose(e)
        }, m._bindKeyToClose = function (e) {
            var t = this._attachedKeysToClose.indexOf(e);
            t === -1 && (a.onUp(e, this.close), this._attachedKeysToClose.push(e))
        }, m._releaseKeyToClose = function (e) {
            var t = this._attachedKeysToClose.indexOf(e);
            t !== -1 && (a.offUp(e, this.close), this._attachedKeysToClose.splice(t, 1))
        }, m._removeEvents = function () {
            this.renderer.modalElement && r.removeEventListener(this.renderer.modalElement, "click", this.close), this._keysToClose.forEach(this._releaseKeyToClose, this)
        }, m._attachEvents = function () {
            this.renderer.modalElement && r.addEventListener(this.renderer.modalElement, "click", this.close), this._keysToClose.forEach(this._bindKeyToClose, this)
        }, m._restoreScrollPosition = function () {
            window.scrollTo(this._scrollX || 0, this._scrollY || 0)
        }, m._saveScrollPosition = function () {
            this._scrollX = s.getScrollX(), this._scrollY = s.getScrollY()
        }, t.exports = n
    }, {
        "./Renderer": 61,
        "@marcom/ac-dom-events/addEventListener": 51,
        "@marcom/ac-dom-events/removeEventListener": 52,
        "@marcom/ac-dom-events/target": 54,
        "@marcom/ac-dom-metrics/getScrollX": 57,
        "@marcom/ac-dom-metrics/getScrollY": 58,
        "@marcom/ac-event-emitter-micro": 37,
        "@marcom/ac-keyboard": 48,
        "@marcom/ac-keyboard/keyMap": 50,
        "@marcom/ac-object/create": 69,
        "@marcom/ac-object/defaults": 70
    }],
    61: [function (e, t, i) {
        "use strict";
        var n = {
                add: e("@marcom/ac-classlist/add"),
                remove: e("@marcom/ac-classlist/remove")
            },
            r = {
                defaults: e("@marcom/ac-object/defaults")
            },
            s = {
                remove: e("@marcom/ac-dom-nodes/remove"),
                isElement: e("@marcom/ac-dom-nodes/isElement")
            },
            o = e("./classNames"),
            a = e("./dataAttributes"),
            c = {
                modalElement: null,
                contentElement: null,
                closeButton: null,
                classNames: o,
                dataAttributes: a
            },
            l = function (e) {
                e = e || {}, this.options = r.defaults(c, e), this.options.classNames = r.defaults(c.classNames, e.classNames), this.options.dataAttributes = r.defaults(c.dataAttributes, e.dataAttributes), this.modalElement = this.options.modalElement, this.contentElement = this.options.contentElement, this.closeButton = this.options.closeButton
            },
            u = l.prototype;
        u.render = function () {
            return s.isElement(this.modalElement) || (this.modalElement = this.renderModalElement(this.options.classNames.modalElement)), s.isElement(this.contentElement) || (this.contentElement = this.renderContentElement(this.options.classNames.contentElement)), this.closeButton !== !1 && (s.isElement(this.closeButton) || (this.closeButton = this.renderCloseButton(this.options.classNames.closeButton)), this.modalElement.appendChild(this.closeButton)), this.modalElement.appendChild(this.contentElement), document.body.appendChild(this.modalElement), this.modalElement
        }, u.renderCloseButton = function (e) {
            var t;
            return e = e || this.options.classNames.closeButton, t = this._renderElement("button", e), t.setAttribute(this.options.dataAttributes.close, ""), t
        }, u.renderModalElement = function (e) {
            return e = e || this.options.classNames.modalElement, this._renderElement("div", e)
        }, u.renderContentElement = function (e) {
            return e = e || this.options.classNames.contentElement, this._renderElement("div", e)
        }, u.appendContent = function (e, t) {
            s.isElement(e) && (void 0 === arguments[1] ? this.contentElement.appendChild(e) : s.isElement(t) && t.appendChild(e))
        }, u.removeContent = function (e) {
            e ? this.modalElement.contains(e) && s.remove(e) : this._emptyContent()
        }, u.open = function () {
            var e = [document.documentElement].concat(this.options.classNames.documentElement),
                t = [this.modalElement].concat(this.options.classNames.modalOpen);
            n.add.apply(null, e), n.add.apply(null, t)
        }, u.close = function () {
            var e = [document.documentElement].concat(this.options.classNames.documentElement),
                t = [this.modalElement].concat(this.options.classNames.modalOpen);
            n.remove.apply(null, e), n.remove.apply(null, t)
        }, u.destroy = function () {
            var e = [document.documentElement].concat(this.options.classNames.documentElement);
            this.modalElement && document.body.contains(this.modalElement) && (this.close(), document.body.removeChild(this.modalElement)), n.remove.apply(null, e);
            for (var t in this) this.hasOwnProperty(t) && (this[t] = null)
        }, u._renderElement = function (e, t) {
            var i = document.createElement(e),
                r = [i];
            return t && (r = r.concat(t)), n.add.apply(null, r), i
        }, u._emptyContent = function () {
            this.contentElement.innerHTML = ""
        }, t.exports = l
    }, {
        "./classNames": 62,
        "./dataAttributes": 63,
        "@marcom/ac-classlist/add": 12,
        "@marcom/ac-classlist/remove": 17,
        "@marcom/ac-dom-nodes/isElement": 28,
        "@marcom/ac-dom-nodes/remove": 31,
        "@marcom/ac-object/defaults": 70
    }],
    62: [function (e, t, i) {
        "use strict";
        t.exports = {
            modalElement: "modal",
            modalOpen: "modal-open",
            documentElement: "has-modal",
            contentElement: "modal-content",
            closeButton: "modal-close"
        }
    }, {}],
    63: [function (e, t, i) {
        "use strict";
        t.exports = {
            close: "data-modal-close"
        }
    }, {}],
    64: [function (e, t, i) {
        "use strict";
        t.exports = {
            Modal: e("./ac-modal/Modal"),
            createStandardModal: e("./ac-modal/factory/createStandardModal"),
            createFullViewportModal: e("./ac-modal/factory/createFullViewportModal")
        }
    }, {
        "./ac-modal/Modal": 65,
        "./ac-modal/factory/createFullViewportModal": 66,
        "./ac-modal/factory/createStandardModal": 67
    }],
    65: [function (e, t, i) {
        "use strict";

        function n(e) {
            s.call(this), this.options = e || {}, this._modal = new r(e, this.options.renderer), this.opened = !1, this._render(), this.closeButton = this._modal.renderer.closeButton, this.modalElement = this._modal.renderer.modalElement, this.contentElement = this._modal.renderer.contentElement, this.modalElement.setAttribute("role", "dialog"), this.closeButton.setAttribute("aria-label", "Close"), this._circularTab = new o(this.modalElement), this._onWillOpen = this._onWillOpen.bind(this), this._onOpen = this._onOpen.bind(this), this._onWillClose = this._onWillClose.bind(this), this._onClose = this._onClose.bind(this), this._bindEvents()
        }
        var r = e("@marcom/ac-modal-basic").Modal,
            s = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            o = e("@marcom/ac-accessibility/CircularTab"),
            a = n.prototype = Object.create(s.prototype);
        a.open = function () {
            this._modal.open(), this.opened = this._modal.opened
        }, a.close = function () {
            this._modal.close()
        }, a.appendContent = function (e) {
            this._modal.appendContent(e)
        }, a.removeContent = function (e) {
            this._modal.removeContent(e)
        }, a.destroy = function () {
            this._releaseEvents(), this._modal.destroy(), this._removeModalFocus(), this._circularTab.destroy(), this._focusObj = null;
            for (var e in this) this.hasOwnProperty(e) && (this[e] = null)
        }, a.addKeyToClose = function (e) {
            this._modal.addKeyToClose(e)
        }, a.removeKeyToClose = function (e) {
            this._modal.removeKeyToClose(e)
        }, a._render = function () {
            this._modal.render(), this._modal.renderer.modalElement.setAttribute("aria-hidden", "true")
        }, a._bindEvents = function () {
            this._modal.on("willopen", this._onWillOpen), this._modal.on("open", this._onOpen), this._modal.on("willclose", this._onWillClose), this._modal.on("close", this._onClose)
        }, a._releaseEvents = function () {
            this._modal.off("willopen", this._onWillOpen), this._modal.off("open", this._onOpen), this._modal.off("willclose", this._onWillClose), this._modal.off("close", this._onClose)
        }, a._onWillOpen = function () {
            this.trigger("willopen")
        }, a._onOpen = function () {
            this.opened = this._modal.opened, this._giveModalFocus(), this.trigger("open")
        }, a._onWillClose = function () {
            this.trigger("willclose"), this._removeModalFocus()
        }, a._onClose = function () {
            this.opened = this._modal.opened, this.trigger("close")
        }, a._giveModalFocus = function () {
            this.modalElement.removeAttribute("aria-hidden"), this._activeElement = document.activeElement, this.closeButton.focus(), this._circularTab.start()
        }, a._removeModalFocus = function () {
            this._circularTab.stop(), this.modalElement.setAttribute("aria-hidden", "true"), this._activeElement && (this._activeElement.focus(), this._activeElement = null)
        }, t.exports = n
    }, {
        "@marcom/ac-accessibility/CircularTab": 1,
        "@marcom/ac-event-emitter-micro": 37,
        "@marcom/ac-modal-basic": 59
    }],
    66: [function (e, t, i) {
        "use strict";

        function n(e) {
            var t = new r(o);
            return e && t.appendContent(e), t
        }
        var r = e("../Modal"),
            s = e("@marcom/ac-modal-basic").classNames,
            o = {
                retainScrollPosition: !0,
                renderer: {
                    classNames: {
                        documentElement: [s.documentElement].concat("has-modal-full-viewport"),
                        modalElement: [s.modalElement].concat("modal-full-viewport")
                    }
                }
            };
        t.exports = n
    }, {
        "../Modal": 65,
        "@marcom/ac-modal-basic": 59
    }],
    67: [function (e, t, i) {
        "use strict";

        function n(e) {
            var t = new r(c);
            e && t.appendContent(e);
            var i = document.createElement("div"),
                n = document.createElement("div"),
                s = document.createElement("div"),
                l = document.createElement("div");
            return a.add(i, "content-table"), a.add(n, "content-cell"), a.add(s, "content-wrapper"), a.add(l, "content-padding", "large-8", "medium-10"), t.modalElement.setAttribute(o.close, ""), s.setAttribute(o.close, ""), n.setAttribute(o.close, ""), i.appendChild(n), n.appendChild(s), s.appendChild(l), t.modalElement.appendChild(i), l.appendChild(t.contentElement), l.appendChild(t.closeButton), t
        }
        var r = e("../Modal"),
            s = e("@marcom/ac-modal-basic").classNames,
            o = e("@marcom/ac-modal-basic").dataAttributes,
            a = {
                add: e("@marcom/ac-classlist/add")
            },
            c = {
                renderer: {
                    classNames: {
                        documentElement: [s.documentElement].concat("has-modal-standard"),
                        modalElement: [s.modalElement].concat("modal-standard")
                    }
                }
            };
        t.exports = n
    }, {
        "../Modal": 65,
        "@marcom/ac-classlist/add": 12,
        "@marcom/ac-modal-basic": 59
    }],
    68: [function (e, t, i) {
        "use strict";
        var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
            return typeof e
        } : function (e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        };
        e("@marcom/ac-polyfills/Array/isArray");
        var r = e("./extend"),
            s = Object.prototype.hasOwnProperty,
            o = function a(e, t) {
                var i;
                for (i in t) s.call(t, i) && (null === t[i] ? e[i] = null : "object" === n(t[i]) ? (e[i] = Array.isArray(t[i]) ? [] : {}, a(e[i], t[i])) : e[i] = t[i]);
                return e
            };
        t.exports = function (e, t) {
            return t ? o({}, e) : r({}, e)
        }
    }, {
        "./extend": 71,
        "@marcom/ac-polyfills/Array/isArray": void 0
    }],
    69: [function (e, t, i) {
        "use strict";
        var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                return typeof e
            } : function (e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            r = function () {};
        t.exports = function (e) {
            if (arguments.length > 1) throw new Error("Second argument not supported");
            if (null === e || "object" !== ("undefined" == typeof e ? "undefined" : n(e))) throw new TypeError("Object prototype may only be an Object.");
            return "function" == typeof Object.create ? Object.create(e) : (r.prototype = e, new r)
        }
    }, {}],
    70: [function (e, t, i) {
        "use strict";
        var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                return typeof e
            } : function (e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            r = e("./extend");
        t.exports = function (e, t) {
            if ("object" !== ("undefined" == typeof e ? "undefined" : n(e))) throw new TypeError("defaults: must provide a defaults object");
            if (t = t || {}, "object" !== ("undefined" == typeof t ? "undefined" : n(t))) throw new TypeError("defaults: options must be a typeof object");
            return r({}, e, t)
        }
    }, {
        "./extend": 71
    }],
    71: [function (e, t, i) {
        "use strict";
        e("@marcom/ac-polyfills/Array/prototype.forEach");
        var n = Object.prototype.hasOwnProperty;
        t.exports = function () {
            var e, t;
            return e = arguments.length < 2 ? [{}, arguments[0]] : [].slice.call(arguments), t = e.shift(), e.forEach(function (e) {
                if (null != e)
                    for (var i in e) n.call(e, i) && (t[i] = e[i])
            }), t
        }
    }, {
        "@marcom/ac-polyfills/Array/prototype.forEach": void 0
    }],
    72: [function (e, t, i) {
        "use strict";
        var n = e("./utils/eventTypeAvailable"),
            r = e("./shared/camelCasedEventTypes"),
            s = e("./shared/windowFallbackEventTypes"),
            o = e("./shared/prefixHelper"),
            a = {};
        t.exports = function c(e, t) {
            var i, l, u;
            if (t = t || "div", e = e.toLowerCase(), t in a || (a[t] = {}), l = a[t], e in l) return l[e];
            if (n(e, t)) return l[e] = e;
            if (e in r)
                for (u = 0; u < r[e].length; u++)
                    if (i = r[e][u], n(i.toLowerCase(), t)) return l[e] = i;
            for (u = 0; u < o.evt.length; u++)
                if (i = o.evt[u] + e, n(i, t)) return o.reduce(u), l[e] = i;
            return "window" !== t && s.indexOf(e) ? l[e] = c(e, "window") : l[e] = !1
        }
    }, {
        "./shared/camelCasedEventTypes": 73,
        "./shared/prefixHelper": 74,
        "./shared/windowFallbackEventTypes": 75,
        "./utils/eventTypeAvailable": 76
    }],
    73: [function (e, t, i) {
        "use strict";
        t.exports = {
            transitionend: ["webkitTransitionEnd", "MSTransitionEnd"],
            animationstart: ["webkitAnimationStart", "MSAnimationStart"],
            animationend: ["webkitAnimationEnd", "MSAnimationEnd"],
            animationiteration: ["webkitAnimationIteration", "MSAnimationIteration"],
            fullscreenchange: ["MSFullscreenChange"],
            fullscreenerror: ["MSFullscreenError"]
        }
    }, {}],
    74: [function (e, t, i) {
        "use strict";
        var n = ["-webkit-", "-moz-", "-ms-"],
            r = ["Webkit", "Moz", "ms"],
            s = ["webkit", "moz", "ms"],
            o = function () {
                this.initialize()
            },
            a = o.prototype;
        a.initialize = function () {
            this.reduced = !1, this.css = n, this.dom = r, this.evt = s
        }, a.reduce = function (e) {
            this.reduced || (this.reduced = !0, this.css = [this.css[e]], this.dom = [this.dom[e]], this.evt = [this.evt[e]])
        }, t.exports = new o
    }, {}],
    75: [function (e, t, i) {
        "use strict";
        t.exports = ["transitionend", "animationstart", "animationend", "animationiteration"]
    }, {}],
    76: [function (e, t, i) {
        "use strict";
        var n = {
            window: window,
            document: document
        };
        t.exports = function (e, t) {
            var i;
            return e = "on" + e, t in n || (n[t] = document.createElement(t)), i = n[t], e in i || "setAttribute" in i && (i.setAttribute(e, "return;"), "function" == typeof i[e])
        }
    }, {}],
    77: [function (e, t, i) {
        "use strict";
        var n = e("@marcom/ac-shared-instance").SharedInstance,
            r = "ac-raf-emitter-id-generator:sharedRAFEmitterIDGeneratorInstance",
            s = "1.0.3",
            o = function () {
                this._currentID = 0
            };
        o.prototype.getNewID = function () {
            return this._currentID++, "raf:" + this._currentID
        }, t.exports = n.share(r, s, o)
    }, {
        "@marcom/ac-shared-instance": 92
    }],
    78: [function (e, t, i) {
        "use strict";
        t.exports = {
            RAFEmitter: e("./ac-raf-emitter/RAFEmitter"),
            ThrottledRAFEmitter: e("./ac-raf-emitter/ThrottledRAFEmitter"),
            update: e("./ac-raf-emitter/update"),
            external: e("./ac-raf-emitter/external"),
            draw: e("./ac-raf-emitter/draw"),
            cancelUpdate: e("./ac-raf-emitter/cancelUpdate"),
            cancelExternal: e("./ac-raf-emitter/cancelExternal"),
            cancelDraw: e("./ac-raf-emitter/cancelDraw")
        }
    }, {
        "./ac-raf-emitter/RAFEmitter": 79,
        "./ac-raf-emitter/ThrottledRAFEmitter": 83,
        "./ac-raf-emitter/cancelDraw": 84,
        "./ac-raf-emitter/cancelExternal": 85,
        "./ac-raf-emitter/cancelUpdate": 86,
        "./ac-raf-emitter/draw": 87,
        "./ac-raf-emitter/external": 88,
        "./ac-raf-emitter/update": 89
    }],
    79: [function (e, t, i) {
        "use strict";

        function n(e) {
            e = e || {}, s.call(this), this.id = a.getNewID(), this.executor = e.executor || o, this._reset(), this._willRun = !1, this._didDestroy = !1
        }
        var r, s = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            o = e("@marcom/ac-raf-executor/sharedRAFExecutorInstance"),
            a = e("@marcom/ac-raf-emitter-id-generator/sharedRAFEmitterIDGeneratorInstance");
        r = n.prototype = Object.create(s.prototype), r.run = function () {
            return this._willRun || (this._willRun = !0), this._subscribe()
        }, r.cancel = function () {
            this._unsubscribe(), this._willRun && (this._willRun = !1), this._reset()
        }, r.destroy = function () {
            var e = this.willRun();
            return this.cancel(), this.executor = null, s.prototype.destroy.call(this), this._didDestroy = !0, e
        }, r.willRun = function () {
            return this._willRun
        }, r.isRunning = function () {
            return this._isRunning
        }, r._subscribe = function () {
            return this.executor.subscribe(this)
        }, r._unsubscribe = function () {
            return this.executor.unsubscribe(this)
        }, r._onAnimationFrameStart = function (e) {
            this._isRunning = !0, this._willRun = !1, this._didEmitFrameData || (this._didEmitFrameData = !0, this.trigger("start", e))
        }, r._onAnimationFrameEnd = function (e) {
            this._willRun || (this.trigger("stop", e), this._reset())
        }, r._reset = function () {
            this._didEmitFrameData = !1, this._isRunning = !1
        }, t.exports = n
    }, {
        "@marcom/ac-event-emitter-micro": 37,
        "@marcom/ac-raf-emitter-id-generator/sharedRAFEmitterIDGeneratorInstance": 77,
        "@marcom/ac-raf-executor/sharedRAFExecutorInstance": 91
    }],
    80: [function (e, t, i) {
        "use strict";
        var n = e("./SingleCallRAFEmitter"),
            r = function (e) {
                this.rafEmitter = new n, this.rafEmitter.on(e, this._onRAFExecuted.bind(this)), this.requestAnimationFrame = this.requestAnimationFrame.bind(this), this.cancelAnimationFrame = this.cancelAnimationFrame.bind(this), this._frameCallbacks = [], this._nextFrameCallbacks = [], this._currentFrameID = -1, this._cancelFrameIdx = -1, this._frameCallbackLength = 0, this._nextFrameCallbacksLength = 0, this._frameCallbackIteration = 0
            },
            s = r.prototype;
        s.requestAnimationFrame = function (e) {
            return this._currentFrameID = this.rafEmitter.run(), this._nextFrameCallbacks.push(this._currentFrameID, e), this._nextFrameCallbacksLength += 2, this._currentFrameID
        }, s.cancelAnimationFrame = function (e) {
            this._cancelFrameIdx = this._nextFrameCallbacks.indexOf(e), this._cancelFrameIdx !== -1 && (this._nextFrameCallbacks.splice(this._cancelFrameIdx, 2), this._nextFrameCallbacksLength -= 2, 0 === this._nextFrameCallbacksLength && this.rafEmitter.cancel())
        }, s._onRAFExecuted = function (e) {
            for (this._frameCallbacks = this._nextFrameCallbacks, this._frameCallbackLength = this._nextFrameCallbacksLength, this._nextFrameCallbacks = [], this._nextFrameCallbacksLength = 0, this._frameCallbackIteration = 0; this._frameCallbackIteration < this._frameCallbackLength; this._frameCallbackIteration += 2) this._frameCallbacks[this._frameCallbackIteration + 1](e.time, e)
        }, t.exports = r
    }, {
        "./SingleCallRAFEmitter": 82
    }],
    81: [function (e, t, i) {
        "use strict";
        var n = e("./RAFInterface"),
            r = function () {
                this.events = {}
            },
            s = r.prototype;
        s.requestAnimationFrame = function (e) {
            return this.events[e] || (this.events[e] = new n(e)), this.events[e].requestAnimationFrame
        }, s.cancelAnimationFrame = function (e) {
            return this.events[e] || (this.events[e] = new n(e)), this.events[e].cancelAnimationFrame
        }, t.exports = new r
    }, {
        "./RAFInterface": 80
    }],
    82: [function (e, t, i) {
        "use strict";
        var n = e("./RAFEmitter"),
            r = function (e) {
                n.call(this, e)
            },
            s = r.prototype = Object.create(n.prototype);
        s._subscribe = function () {
            return this.executor.subscribe(this, !0)
        }, t.exports = r
    }, {
        "./RAFEmitter": 79
    }],
    83: [function (e, t, i) {
        "use strict";

        function n(e, t) {
            a.call(this), t = t || {}, this._fps = e || 0, this._delta = 0, this._currentFps = 0, this._rafEmitter = t.rafEmitter || new s, this._lastThrottledTime = 0, this._didEmitFrameData = !1, this._rafEmitterEvent = null, this._shouldDraw = !1, this._boundOnRAFEmitterUpdate = this._onRAFEmitterUpdate.bind(this), this._boundOnRAFEmitterDraw = this._onRAFEmitterDraw.bind(this), this._boundOnRAFEmitterStop = this._onRAFEmitterStop.bind(this), this._rafEmitter.on("update", this._boundOnRAFEmitterUpdate), this._rafEmitter.on("draw", this._boundOnRAFEmitterDraw), this._rafEmitter.on("stop", this._boundOnRAFEmitterStop)
        }
        var r, s = e("./RAFEmitter"),
            o = e("@marcom/ac-object/clone"),
            a = e("@marcom/ac-event-emitter-micro").EventEmitterMicro;
        r = n.prototype = Object.create(a.prototype), r.setFps = function (e) {
            return e !== this._fps && (this._fps = e, !0)
        }, r.getFps = function () {
            return this._fps
        }, r.run = function () {
            return this._rafEmitter.run()
        }, r.cancel = function () {
            return this._rafEmitter.cancel()
        }, r.willRun = function () {
            return this._rafEmitter.willRun()
        }, r.isRunning = function () {
            return this._rafEmitter.isRunning()
        }, r.destroy = function () {
            var e = this._rafEmitter.destroy();
            return a.prototype.destroy.call(this), this._rafEmitter = null, this._boundOnRAFEmitterUpdate = null, this._boundOnRAFEmitterDraw = null, this._boundOnRAFEmitterStop = null, this._rafEmitterEvent = null, e
        }, r._onRAFEmitterUpdate = function (e) {
            if (0 === this._lastThrottledTime && (this._lastThrottledTime = this._rafEmitter.executor.lastFrameTime), this._delta = e.time - this._lastThrottledTime, !this._fps) throw new TypeError("FPS is not defined.");
            return this._currentFps = 1e3 / this._delta, this._currentFps > this._fps ? void this._rafEmitter.run() : (this._rafEmitterEvent = o(e), this._rafEmitterEvent.delta = this._delta, this._rafEmitterEvent.fps = this._currentFps, this._lastThrottledTime = this._rafEmitterEvent.time, this._shouldDraw = !0, this._didEmitFrameData || (this.trigger("start", this._rafEmitterEvent), this._didEmitFrameData = !0), void this.trigger("update", this._rafEmitterEvent))
        }, r._onRAFEmitterDraw = function () {
            this._shouldDraw && (this._shouldDraw = !1, this.trigger("draw", this._rafEmitterEvent))
        }, r._onRAFEmitterStop = function () {
            this._lastThrottledTime = 0, this._didEmitFrameData = !1, this.trigger("stop", this._rafEmitterEvent)
        }, t.exports = n
    }, {
        "./RAFEmitter": 79,
        "@marcom/ac-event-emitter-micro": 37,
        "@marcom/ac-object/clone": 68
    }],
    84: [function (e, t, i) {
        "use strict";
        var n = e("./RAFInterfaceController");
        t.exports = n.cancelAnimationFrame("draw")
    }, {
        "./RAFInterfaceController": 81
    }],
    85: [function (e, t, i) {
        "use strict";
        var n = e("./RAFInterfaceController");
        t.exports = n.cancelAnimationFrame("external")
    }, {
        "./RAFInterfaceController": 81
    }],
    86: [function (e, t, i) {
        "use strict";
        var n = e("./RAFInterfaceController");
        t.exports = n.cancelAnimationFrame("update")
    }, {
        "./RAFInterfaceController": 81
    }],
    87: [function (e, t, i) {
        "use strict";
        var n = e("./RAFInterfaceController");
        t.exports = n.requestAnimationFrame("draw")
    }, {
        "./RAFInterfaceController": 81
    }],
    88: [function (e, t, i) {
        "use strict";
        var n = e("./RAFInterfaceController");
        t.exports = n.requestAnimationFrame("external")
    }, {
        "./RAFInterfaceController": 81
    }],
    89: [function (e, t, i) {
        "use strict";
        var n = e("./RAFInterfaceController");
        t.exports = n.requestAnimationFrame("update")
    }, {
        "./RAFInterfaceController": 81
    }],
    90: [function (e, t, i) {
        "use strict";

        function n(e) {
            e = e || {}, this._reset(), this._willRun = !1, this._totalSubscribeCount = -1, this._requestAnimationFrame = window.requestAnimationFrame, this._cancelAnimationFrame = window.cancelAnimationFrame, this._boundOnAnimationFrame = this._onAnimationFrame.bind(this), this._boundOnExternalAnimationFrame = this._onExternalAnimationFrame.bind(this)
        }
        e("@marcom/ac-polyfills/performance/now");
        var r;
        r = n.prototype, r.subscribe = function (e, t) {
            return this._totalSubscribeCount++, this._nextFrameSubscribers[e.id] || (t ? this._nextFrameSubscribersOrder.unshift(e.id) : this._nextFrameSubscribersOrder.push(e.id), this._nextFrameSubscribers[e.id] = e, this._nextFrameSubscriberArrayLength++, this._nextFrameSubscriberCount++, this._run()), this._totalSubscribeCount
        }, r.unsubscribe = function (e) {
            return !!this._nextFrameSubscribers[e.id] && (this._nextFrameSubscribers[e.id] = null, this._nextFrameSubscriberCount--, 0 === this._nextFrameSubscriberCount && this._cancel(), !0)
        }, r.trigger = function (e, t) {
            var i;
            for (i = 0; i < this._subscriberArrayLength; i++) null !== this._subscribers[this._subscribersOrder[i]] && this._subscribers[this._subscribersOrder[i]]._didDestroy === !1 && this._subscribers[this._subscribersOrder[i]].trigger(e, t)
        }, r.destroy = function () {
            var e = this._cancel();
            return this._subscribers = null, this._subscribersOrder = null, this._nextFrameSubscribers = null, this._nextFrameSubscribersOrder = null, this._rafData = null, this._boundOnAnimationFrame = null, this._onExternalAnimationFrame = null, e
        }, r.useExternalAnimationFrame = function (e) {
            if ("boolean" == typeof e) {
                var t = this._isUsingExternalAnimationFrame;
                return e && this._animationFrame && (this._cancelAnimationFrame.call(window, this._animationFrame), this._animationFrame = null), !this._willRun || e || this._animationFrame || (this._animationFrame = this._requestAnimationFrame.call(window, this._boundOnAnimationFrame)), this._isUsingExternalAnimationFrame = e, e ? this._boundOnExternalAnimationFrame : t || !1
            }
        }, r._run = function () {
            if (!this._willRun) return this._willRun = !0, 0 === this.lastFrameTime && (this.lastFrameTime = performance.now()), this._animationFrameActive = !0, this._isUsingExternalAnimationFrame || (this._animationFrame = this._requestAnimationFrame.call(window, this._boundOnAnimationFrame)), !0
        }, r._cancel = function () {
            var e = !1;
            return this._animationFrameActive && (this._animationFrame && (this._cancelAnimationFrame.call(window, this._animationFrame), this._animationFrame = null), this._animationFrameActive = !1, this._willRun = !1, e = !0), this._isRunning || this._reset(), e
        }, r._onSubscribersAnimationFrameStart = function (e) {
            var t;
            for (t = 0; t < this._subscriberArrayLength; t++) null !== this._subscribers[this._subscribersOrder[t]] && this._subscribers[this._subscribersOrder[t]]._didDestroy === !1 && this._subscribers[this._subscribersOrder[t]]._onAnimationFrameStart(e)
        }, r._onSubscribersAnimationFrameEnd = function (e) {
            var t;
            for (t = 0; t < this._subscriberArrayLength; t++) null !== this._subscribers[this._subscribersOrder[t]] && this._subscribers[this._subscribersOrder[t]]._didDestroy === !1 && this._subscribers[this._subscribersOrder[t]]._onAnimationFrameEnd(e)
        }, r._onAnimationFrame = function (e) {
            this._subscribers = this._nextFrameSubscribers, this._subscribersOrder = this._nextFrameSubscribersOrder,
                this._subscriberArrayLength = this._nextFrameSubscriberArrayLength, this._subscriberCount = this._nextFrameSubscriberCount, this._nextFrameSubscribers = {}, this._nextFrameSubscribersOrder = [], this._nextFrameSubscriberArrayLength = 0, this._nextFrameSubscriberCount = 0, this._isRunning = !0, this._willRun = !1, this._didRequestNextRAF = !1, this._rafData.delta = e - this.lastFrameTime, this.lastFrameTime = e, this._rafData.fps = 0, this._rafData.delta >= 1e3 && (this._rafData.delta = 0), 0 !== this._rafData.delta && (this._rafData.fps = 1e3 / this._rafData.delta), this._rafData.time = e, this._rafData.naturalFps = this._rafData.fps, this._rafData.timeNow = Date.now(), this._onSubscribersAnimationFrameStart(this._rafData), this.trigger("update", this._rafData), this.trigger("external", this._rafData), this.trigger("draw", this._rafData), this._onSubscribersAnimationFrameEnd(this._rafData), this._willRun || this._reset()
        }, r._onExternalAnimationFrame = function (e) {
            this._isUsingExternalAnimationFrame && this._onAnimationFrame(e)
        }, r._reset = function () {
            this._rafData = {
                time: 0,
                delta: 0,
                fps: 0,
                naturalFps: 0,
                timeNow: 0
            }, this._subscribers = {}, this._subscribersOrder = [], this._subscriberArrayLength = 0, this._subscriberCount = 0, this._nextFrameSubscribers = {}, this._nextFrameSubscribersOrder = [], this._nextFrameSubscriberArrayLength = 0, this._nextFrameSubscriberCount = 0, this._didEmitFrameData = !1, this._animationFrame = null, this._animationFrameActive = !1, this._isRunning = !1, this._shouldReset = !1, this.lastFrameTime = 0
        }, t.exports = n
    }, {
        "@marcom/ac-polyfills/performance/now": void 0
    }],
    91: [function (e, t, i) {
        "use strict";
        var n = e("@marcom/ac-shared-instance").SharedInstance,
            r = "ac-raf-executor:sharedRAFExecutorInstance",
            s = "2.0.1",
            o = e("./RAFExecutor");
        t.exports = n.share(r, s, o)
    }, {
        "./RAFExecutor": 90,
        "@marcom/ac-shared-instance": 92
    }],
    92: [function (e, t, i) {
        "use strict";
        t.exports = {
            SharedInstance: e("./ac-shared-instance/SharedInstance")
        }
    }, {
        "./ac-shared-instance/SharedInstance": 93
    }],
    93: [function (e, t, i) {
        "use strict";
        var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                return typeof e
            } : function (e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            r = window,
            s = "AC",
            o = "SharedInstance",
            a = r[s],
            c = function () {
                var e = {};
                return {
                    get: function (t, i) {
                        var n = null;
                        return e[t] && e[t][i] && (n = e[t][i]), n
                    },
                    set: function (t, i, n) {
                        return e[t] || (e[t] = {}), "function" == typeof n ? e[t][i] = new n : e[t][i] = n, e[t][i]
                    },
                    share: function (e, t, i) {
                        var n = this.get(e, t);
                        return n || (n = this.set(e, t, i)), n
                    },
                    remove: function (t, i) {
                        var r = "undefined" == typeof i ? "undefined" : n(i);
                        if ("string" === r || "number" === r) {
                            if (!e[t] || !e[t][i]) return;
                            return void(e[t][i] = null)
                        }
                        e[t] && (e[t] = null)
                    }
                }
            }();
        a || (a = r[s] = {}), a[o] || (a[o] = c), t.exports = a[o]
    }, {}],
    94: [function (e, t, i) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var r = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var n = t[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function (t, i, n) {
                    return i && e(t.prototype, i), n && e(t, n), t
                }
            }(),
            s = function () {
                function e() {
                    var t = this,
                        i = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                    n(this, e), this.options = i, "loading" === document.readyState ? document.addEventListener("readystatechange", function (e) {
                        "interactive" === document.readyState && t._init()
                    }) : this._init()
                }
                return r(e, [{
                    key: "_init",
                    value: function () {
                        return this._images = Array.from(document.querySelectorAll("*[" + e.DATA_ATTRIBUTE + "]")), this.AnimSystem = this._findAnim(), null === this.AnimSystem ? null : void this._addKeyframesToImages()
                    }
                }, {
                    key: "_defineKeyframeOptions",
                    value: function () {
                        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
                            i = t.getAttribute(e.DATA_DOWNLOAD_AREA_KEYFRAME) || "{}";
                        return Object.assign({}, {
                            start: "t - 200vh",
                            end: "b + 100vh",
                            event: "AnimLazyImage"
                        }, JSON.parse(i))
                    }
                }, {
                    key: "_addKeyframesToImages",
                    value: function () {
                        var e = this;
                        this._scrollGroup = this.AnimSystem.getGroupForTarget(document.body), this._images.forEach(function (t) {
                            var i = e._defineKeyframeOptions(t),
                                n = e._scrollGroup.addKeyframe(t, i);
                            n.controller.once("AnimLazyImage:enter", function () {
                                e._imageIsInLoadRange(t)
                            })
                        })
                    }
                }, {
                    key: "_cleanUpImageAttributes",
                    value: function (t) {
                        var i = !1;
                        try {
                            i = this._scrollGroup.getControllerForTarget(t).getNearestKeyframeForAttribute("AnimLazyImage").isCurrentlyInRange
                        } catch (n) {
                            i = !1
                        }
                        i || t.setAttribute(e.DATA_ATTRIBUTE, "")
                    }
                }, {
                    key: "_downloadingImageAttributes",
                    value: function (t) {
                        t.removeAttribute(e.DATA_ATTRIBUTE)
                    }
                }, {
                    key: "_imageIsInLoadRange",
                    value: function (e) {
                        this._downloadImage(e)
                    }
                }, {
                    key: "_downloadImage",
                    value: function (e) {
                        this._downloadingImageAttributes(e)
                    }
                }, {
                    key: "_findAnim",
                    value: function () {
                        var e = Array.from(document.querySelectorAll("[data-anim-group],[data-anim-scroll-group],[data-anim-time-group]"));
                        return e.map(function (e) {
                            return e._animInfo ? e._animInfo.group : null
                        }).filter(function (e) {
                            return null !== e
                        }), e[0] && e[0]._animInfo ? e[0]._animInfo.group.anim : (console.error("AnimLazyImage: AnimSystem not found, please initialize anim before instantiating"), null)
                    }
                }]), e
            }();
        s.DATA_DOWNLOAD_AREA_KEYFRAME = "data-download-area-keyframe", s.DATA_ATTRIBUTE = "data-anim-lazy-image", t.exports = s
    }, {}],
    95: [function (e, t, i) {
        arguments[4][37][0].apply(i, arguments)
    }, {
        "./ac-event-emitter-micro/EventEmitterMicro": 96,
        dup: 37
    }],
    96: [function (e, t, i) {
        arguments[4][38][0].apply(i, arguments)
    }, {
        dup: 38
    }],
    97: [function (e, t, i) {
        "use strict";
        t.exports = {
            majorVersionNumber: "3.x"
        }
    }, {}],
    98: [function (e, t, i) {
        "use strict";

        function n(e) {
            e = e || {}, s.call(this), this.id = a.getNewID(), this.executor = e.executor || o, this._reset(), this._willRun = !1, this._didDestroy = !1
        }
        var r, s = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            o = e("./sharedRAFExecutorInstance"),
            a = e("./sharedRAFEmitterIDGeneratorInstance");
        r = n.prototype = Object.create(s.prototype), r.run = function () {
            return this._willRun || (this._willRun = !0), this._subscribe()
        }, r.cancel = function () {
            this._unsubscribe(), this._willRun && (this._willRun = !1), this._reset()
        }, r.destroy = function () {
            var e = this.willRun();
            return this.cancel(), this.executor = null, s.prototype.destroy.call(this), this._didDestroy = !0, e
        }, r.willRun = function () {
            return this._willRun
        }, r.isRunning = function () {
            return this._isRunning
        }, r._subscribe = function () {
            return this.executor.subscribe(this)
        }, r._unsubscribe = function () {
            return this.executor.unsubscribe(this)
        }, r._onAnimationFrameStart = function (e) {
            this._isRunning = !0, this._willRun = !1, this._didEmitFrameData || (this._didEmitFrameData = !0, this.trigger("start", e))
        }, r._onAnimationFrameEnd = function (e) {
            this._willRun || (this.trigger("stop", e), this._reset())
        }, r._reset = function () {
            this._didEmitFrameData = !1, this._isRunning = !1
        }, t.exports = n
    }, {
        "./sharedRAFEmitterIDGeneratorInstance": 106,
        "./sharedRAFExecutorInstance": 107,
        "@marcom/ac-event-emitter-micro": 95
    }],
    99: [function (e, t, i) {
        "use strict";

        function n(e) {
            e = e || {}, this._reset(), this.updatePhases(), this.eventEmitter = new s, this._willRun = !1, this._totalSubscribeCount = -1, this._requestAnimationFrame = window.requestAnimationFrame, this._cancelAnimationFrame = window.cancelAnimationFrame, this._boundOnAnimationFrame = this._onAnimationFrame.bind(this), this._boundOnExternalAnimationFrame = this._onExternalAnimationFrame.bind(this)
        }
        var r, s = e("@marcom/ac-event-emitter-micro/EventEmitterMicro");
        r = n.prototype, r.frameRequestedPhase = "requested", r.startPhase = "start", r.runPhases = ["update", "external", "draw"], r.endPhase = "end", r.disabledPhase = "disabled", r.beforePhaseEventPrefix = "before:", r.afterPhaseEventPrefix = "after:", r.subscribe = function (e, t) {
            return this._totalSubscribeCount++, this._nextFrameSubscribers[e.id] || (t ? this._nextFrameSubscribersOrder.unshift(e.id) : this._nextFrameSubscribersOrder.push(e.id), this._nextFrameSubscribers[e.id] = e, this._nextFrameSubscriberArrayLength++, this._nextFrameSubscriberCount++, this._run()), this._totalSubscribeCount
        }, r.subscribeImmediate = function (e, t) {
            return this._totalSubscribeCount++, this._subscribers[e.id] || (t ? this._subscribersOrder.splice(this._currentSubscriberIndex + 1, 0, e.id) : this._subscribersOrder.unshift(e.id), this._subscribers[e.id] = e, this._subscriberArrayLength++, this._subscriberCount++), this._totalSubscribeCount
        }, r.unsubscribe = function (e) {
            return !!this._nextFrameSubscribers[e.id] && (this._nextFrameSubscribers[e.id] = null, this._nextFrameSubscriberCount--, 0 === this._nextFrameSubscriberCount && this._cancel(), !0)
        }, r.getSubscribeID = function () {
            return this._totalSubscribeCount += 1
        }, r.destroy = function () {
            var e = this._cancel();
            return this.eventEmitter.destroy(), this.eventEmitter = null, this.phases = null, this._subscribers = null, this._subscribersOrder = null, this._nextFrameSubscribers = null, this._nextFrameSubscribersOrder = null, this._rafData = null, this._boundOnAnimationFrame = null, this._onExternalAnimationFrame = null, e
        }, r.useExternalAnimationFrame = function (e) {
            if ("boolean" == typeof e) {
                var t = this._isUsingExternalAnimationFrame;
                return e && this._animationFrame && (this._cancelAnimationFrame.call(window, this._animationFrame), this._animationFrame = null), !this._willRun || e || this._animationFrame || (this._animationFrame = this._requestAnimationFrame.call(window, this._boundOnAnimationFrame)), this._isUsingExternalAnimationFrame = e, e ? this._boundOnExternalAnimationFrame : t || !1
            }
        }, r.updatePhases = function () {
            this.phases || (this.phases = []), this.phases.length = 0, this.phases.push(this.frameRequestedPhase), this.phases.push(this.startPhase), Array.prototype.push.apply(this.phases, this.runPhases), this.phases.push(this.endPhase), this._runPhasesLength = this.runPhases.length, this._phasesLength = this.phases.length
        }, r._run = function () {
            if (!this._willRun) return this._willRun = !0, 0 === this.lastFrameTime && (this.lastFrameTime = performance.now()), this._animationFrameActive = !0, this._isUsingExternalAnimationFrame || (this._animationFrame = this._requestAnimationFrame.call(window, this._boundOnAnimationFrame)), this.phase === this.disabledPhase && (this.phaseIndex = 0, this.phase = this.phases[this.phaseIndex]), !0
        }, r._cancel = function () {
            var e = !1;
            return this._animationFrameActive && (this._animationFrame && (this._cancelAnimationFrame.call(window, this._animationFrame), this._animationFrame = null), this._animationFrameActive = !1, this._willRun = !1, e = !0), this._isRunning || this._reset(), e
        }, r._onAnimationFrame = function (e) {
            for (this._subscribers = this._nextFrameSubscribers, this._subscribersOrder = this._nextFrameSubscribersOrder, this._subscriberArrayLength = this._nextFrameSubscriberArrayLength, this._subscriberCount = this._nextFrameSubscriberCount, this._nextFrameSubscribers = {}, this._nextFrameSubscribersOrder = [], this._nextFrameSubscriberArrayLength = 0, this._nextFrameSubscriberCount = 0, this.phaseIndex = 0, this.phase = this.phases[this.phaseIndex], this._isRunning = !0, this._willRun = !1, this._didRequestNextRAF = !1, this._rafData.delta = e - this.lastFrameTime, this.lastFrameTime = e, this._rafData.fps = 0, this._rafData.delta >= 1e3 && (this._rafData.delta = 0), 0 !== this._rafData.delta && (this._rafData.fps = 1e3 / this._rafData.delta), this._rafData.time = e, this._rafData.naturalFps = this._rafData.fps, this._rafData.timeNow = Date.now(), this.phaseIndex++, this.phase = this.phases[this.phaseIndex], this.eventEmitter.trigger(this.beforePhaseEventPrefix + this.phase), this._currentSubscriberIndex = 0; this._currentSubscriberIndex < this._subscriberArrayLength; this._currentSubscriberIndex++) null !== this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]] && this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]]._didDestroy === !1 && this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]]._onAnimationFrameStart(this._rafData);
            for (this.eventEmitter.trigger(this.afterPhaseEventPrefix + this.phase), this._runPhaseIndex = 0; this._runPhaseIndex < this._runPhasesLength; this._runPhaseIndex++) {
                for (this.phaseIndex++, this.phase = this.phases[this.phaseIndex], this.eventEmitter.trigger(this.beforePhaseEventPrefix + this.phase), this._currentSubscriberIndex = 0; this._currentSubscriberIndex < this._subscriberArrayLength; this._currentSubscriberIndex++) null !== this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]] && this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]]._didDestroy === !1 && this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]].trigger(this.phase, this._rafData);
                this.eventEmitter.trigger(this.afterPhaseEventPrefix + this.phase)
            }
            for (this.phaseIndex++, this.phase = this.phases[this.phaseIndex], this.eventEmitter.trigger(this.beforePhaseEventPrefix + this.phase), this._currentSubscriberIndex = 0; this._currentSubscriberIndex < this._subscriberArrayLength; this._currentSubscriberIndex++) null !== this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]] && this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]]._didDestroy === !1 && this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]]._onAnimationFrameEnd(this._rafData);
            this.eventEmitter.trigger(this.afterPhaseEventPrefix + this.phase), this._willRun ? (this.phaseIndex = 0, this.phaseIndex = this.phases[this.phaseIndex]) : this._reset()
        }, r._onExternalAnimationFrame = function (e) {
            this._isUsingExternalAnimationFrame && this._onAnimationFrame(e)
        }, r._reset = function () {
            this._rafData || (this._rafData = {}), this._rafData.time = 0, this._rafData.delta = 0, this._rafData.fps = 0, this._rafData.naturalFps = 0, this._rafData.timeNow = 0, this._subscribers = {}, this._subscribersOrder = [], this._currentSubscriberIndex = -1, this._subscriberArrayLength = 0, this._subscriberCount = 0, this._nextFrameSubscribers = {}, this._nextFrameSubscribersOrder = [], this._nextFrameSubscriberArrayLength = 0, this._nextFrameSubscriberCount = 0, this._didEmitFrameData = !1, this._animationFrame = null, this._animationFrameActive = !1, this._isRunning = !1, this._shouldReset = !1, this.lastFrameTime = 0, this._runPhaseIndex = -1, this.phaseIndex = -1, this.phase = this.disabledPhase
        }, t.exports = n
    }, {
        "@marcom/ac-event-emitter-micro/EventEmitterMicro": 96
    }],
    100: [function (e, t, i) {
        "use strict";
        var n = e("./SingleCallRAFEmitter"),
            r = function (e) {
                this.phase = e, this.rafEmitter = new n, this._cachePhaseIndex(), this.requestAnimationFrame = this.requestAnimationFrame.bind(this), this.cancelAnimationFrame = this.cancelAnimationFrame.bind(this), this._onBeforeRAFExecutorStart = this._onBeforeRAFExecutorStart.bind(this), this._onBeforeRAFExecutorPhase = this._onBeforeRAFExecutorPhase.bind(this), this._onAfterRAFExecutorPhase = this._onAfterRAFExecutorPhase.bind(this), this.rafEmitter.on(this.phase, this._onRAFExecuted.bind(this)), this.rafEmitter.executor.eventEmitter.on("before:start", this._onBeforeRAFExecutorStart), this.rafEmitter.executor.eventEmitter.on("before:" + this.phase, this._onBeforeRAFExecutorPhase), this.rafEmitter.executor.eventEmitter.on("after:" + this.phase, this._onAfterRAFExecutorPhase), this._frameCallbacks = [], this._currentFrameCallbacks = [], this._nextFrameCallbacks = [], this._phaseActive = !1, this._currentFrameID = -1, this._cancelFrameIdx = -1, this._frameCallbackLength = 0, this._currentFrameCallbacksLength = 0, this._nextFrameCallbacksLength = 0, this._frameCallbackIteration = 0
            },
            s = r.prototype;
        s.requestAnimationFrame = function (e, t) {
            return t === !0 && this.rafEmitter.executor.phaseIndex > 0 && this.rafEmitter.executor.phaseIndex <= this.phaseIndex ? this._phaseActive ? (this._currentFrameID = this.rafEmitter.executor.subscribeImmediate(this.rafEmitter, !0), this._frameCallbacks.push(this._currentFrameID, e), this._frameCallbackLength += 2) : (this._currentFrameID = this.rafEmitter.executor.subscribeImmediate(this.rafEmitter, !1), this._currentFrameCallbacks.push(this._currentFrameID, e), this._currentFrameCallbacksLength += 2) : (this._currentFrameID = this.rafEmitter.run(), this._nextFrameCallbacks.push(this._currentFrameID, e), this._nextFrameCallbacksLength += 2), this._currentFrameID
        }, s.cancelAnimationFrame = function (e) {
            this._cancelFrameIdx = this._nextFrameCallbacks.indexOf(e), this._cancelFrameIdx > -1 ? this._cancelNextAnimationFrame() : (this._cancelFrameIdx = this._currentFrameCallbacks.indexOf(e), this._cancelFrameIdx > -1 ? this._cancelCurrentAnimationFrame() : (this._cancelFrameIdx = this._frameCallbacks.indexOf(e), this._cancelFrameIdx > -1 && this._cancelRunningAnimationFrame()))
        }, s._onRAFExecuted = function (e) {
            for (this._frameCallbackIteration = 0; this._frameCallbackIteration < this._frameCallbackLength; this._frameCallbackIteration += 2) this._frameCallbacks[this._frameCallbackIteration + 1](e.time, e);
            this._frameCallbacks.length = 0, this._frameCallbackLength = 0
        }, s._onBeforeRAFExecutorStart = function () {
            Array.prototype.push.apply(this._currentFrameCallbacks, this._nextFrameCallbacks.splice(0, this._nextFrameCallbacksLength)), this._currentFrameCallbacksLength = this._nextFrameCallbacksLength, this._nextFrameCallbacks.length = 0, this._nextFrameCallbacksLength = 0
        }, s._onBeforeRAFExecutorPhase = function () {
            this._phaseActive = !0, Array.prototype.push.apply(this._frameCallbacks, this._currentFrameCallbacks.splice(0, this._currentFrameCallbacksLength)), this._frameCallbackLength = this._currentFrameCallbacksLength, this._currentFrameCallbacks.length = 0, this._currentFrameCallbacksLength = 0
        }, s._onAfterRAFExecutorPhase = function () {
            this._phaseActive = !1
        }, s._cachePhaseIndex = function () {
            this.phaseIndex = this.rafEmitter.executor.phases.indexOf(this.phase)
        }, s._cancelRunningAnimationFrame = function () {
            this._frameCallbacks.splice(this._cancelFrameIdx, 2), this._frameCallbackLength -= 2
        }, s._cancelCurrentAnimationFrame = function () {
            this._currentFrameCallbacks.splice(this._cancelFrameIdx, 2), this._currentFrameCallbacksLength -= 2
        }, s._cancelNextAnimationFrame = function () {
            this._nextFrameCallbacks.splice(this._cancelFrameIdx, 2), this._nextFrameCallbacksLength -= 2, 0 === this._nextFrameCallbacksLength && this.rafEmitter.cancel()
        }, t.exports = r
    }, {
        "./SingleCallRAFEmitter": 102
    }],
    101: [function (e, t, i) {
        "use strict";
        var n = e("./RAFInterface"),
            r = function () {
                this.events = {}
            },
            s = r.prototype;
        s.requestAnimationFrame = function (e) {
            return this.events[e] || (this.events[e] = new n(e)), this.events[e].requestAnimationFrame
        }, s.cancelAnimationFrame = function (e) {
            return this.events[e] || (this.events[e] = new n(e)), this.events[e].cancelAnimationFrame
        }, t.exports = new r
    }, {
        "./RAFInterface": 100
    }],
    102: [function (e, t, i) {
        "use strict";
        var n = e("./RAFEmitter"),
            r = function (e) {
                n.call(this, e)
            },
            s = r.prototype = Object.create(n.prototype);
        s._subscribe = function () {
            return this.executor.subscribe(this, !0)
        }, t.exports = r
    }, {
        "./RAFEmitter": 98
    }],
    103: [function (e, t, i) {
        "use strict";
        var n = e("./RAFInterfaceController");
        t.exports = n.cancelAnimationFrame("update")
    }, {
        "./RAFInterfaceController": 101
    }],
    104: [function (e, t, i) {
        "use strict";
        var n = e("./RAFInterfaceController");
        t.exports = n.requestAnimationFrame("draw")
    }, {
        "./RAFInterfaceController": 101
    }],
    105: [function (e, t, i) {
        "use strict";
        var n = e("./RAFInterfaceController");
        t.exports = n.requestAnimationFrame("external")
    }, {
        "./RAFInterfaceController": 101
    }],
    106: [function (e, t, i) {
        "use strict";
        var n = e("@marcom/ac-shared-instance").SharedInstance,
            r = e("../.release-info.js").majorVersionNumber,
            s = function () {
                this._currentID = 0
            };
        s.prototype.getNewID = function () {
            return this._currentID++, "raf:" + this._currentID
        }, t.exports = n.share("@marcom/ac-raf-emitter/sharedRAFEmitterIDGeneratorInstance", r, s)
    }, {
        "../.release-info.js": 97,
        "@marcom/ac-shared-instance": 109
    }],
    107: [function (e, t, i) {
        "use strict";
        var n = e("@marcom/ac-shared-instance").SharedInstance,
            r = e("../.release-info.js").majorVersionNumber,
            s = e("./RAFExecutor");
        t.exports = n.share("@marcom/ac-raf-emitter/sharedRAFExecutorInstance", r, s)
    }, {
        "../.release-info.js": 97,
        "./RAFExecutor": 99,
        "@marcom/ac-shared-instance": 109
    }],
    108: [function (e, t, i) {
        "use strict";
        var n = e("./RAFInterfaceController");
        t.exports = n.requestAnimationFrame("update")
    }, {
        "./RAFInterfaceController": 101
    }],
    109: [function (e, t, i) {
        arguments[4][92][0].apply(i, arguments)
    }, {
        "./ac-shared-instance/SharedInstance": 110,
        dup: 92
    }],
    110: [function (e, t, i) {
        arguments[4][93][0].apply(i, arguments)
    }, {
        dup: 93
    }],
    111: [function (e, t, i) {
        "use strict";
        t.exports = {
            version: "3.1.0",
            major: "3.x",
            majorMinor: "3.1"
        }
    }, {}],
    112: [function (e, t, i) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function r(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function s(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var o = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var n = t[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function (t, i, n) {
                    return i && e(t.prototype, i), n && e(t, n), t
                }
            }(),
            a = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            c = e("./Model/AnimSystemModel"),
            l = e("./Keyframes/Keyframe"),
            u = e("./Keyframes/KeyframeCSSClass"),
            h = e("./Keyframes/KeyframeDiscreteEvent"),
            m = e("./ScrollGroup"),
            d = e("./TimeGroup"),
            f = e("./.release-info"),
            p = {
                update: e("@marcom/ac-raf-emitter/update"),
                cancelUpdate: e("@marcom/ac-raf-emitter/cancelUpdate"),
                external: e("@marcom/ac-raf-emitter/external"),
                draw: e("@marcom/ac-raf-emitter/draw")
            },
            v = null,
            y = function (e) {
                function t() {
                    n(this, t);
                    var e = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                    if (v) throw "You cannot create multiple AnimSystems. You probably want to create multiple groups instead. You can have unlimited groups on a page";
                    return v = e, e.groups = [], e.scrollSystems = [], e.timeSystems = [], e._forceUpdateRAFId = -1, e._initialized = !1, e.model = c, e.version = f.version, e.onScroll = e.onScroll.bind(e), e.onResizedDebounced = e.onResizedDebounced.bind(e), e.onResizeImmediate = e.onResizeImmediate.bind(e), e
                }
                return s(t, e), o(t, [{
                    key: "initialize",
                    value: function () {
                        this._initialized || (this._initialized = !0, this.timeSystems = [], this.scrollSystems = [], this.groups = [], this.setupEvents(), this.initializeResizeFilter(), this.initializeModel(), this.createDOMGroups(), this.createDOMKeyframes())
                    }
                }, {
                    key: "remove",
                    value: function () {
                        var e = this;
                        return Promise.all(this.groups.map(function (e) {
                            return e.remove()
                        })).then(function () {
                            e.groups = null, e.scrollSystems = null, e.timeSystems = null, window.clearTimeout(c.RESIZE_TIMEOUT), window.removeEventListener("scroll", e.onScroll), window.removeEventListener("resize", e.onResizeImmediate), e._events = {}, e._initialized = !1
                        })
                    }
                }, {
                    key: "destroy",
                    value: function () {
                        return this.remove()
                    }
                }, {
                    key: "createTimeGroup",
                    value: function (e) {
                        var t = new d(e, this);
                        return this.groups.push(t), this.timeSystems.push(t), this.trigger(c.EVENTS.ON_GROUP_CREATED, t), t
                    }
                }, {
                    key: "createScrollGroup",
                    value: function (e) {
                        if (!e) throw "AnimSystem scroll based groups must supply an HTMLElement";
                        var t = new m(e, this);
                        return this.groups.push(t), this.scrollSystems.push(t), this.trigger(c.EVENTS.ON_GROUP_CREATED, t), t
                    }
                }, {
                    key: "removeGroup",
                    value: function (e) {
                        var t = this;
                        return Promise.all(e.keyframeControllers.map(function (t) {
                            return e.removeKeyframeController(t)
                        })).then(function () {
                            var i = t.groups.indexOf(e);
                            i !== -1 && t.groups.splice(i, 1), i = t.scrollSystems.indexOf(e), i !== -1 && t.scrollSystems.splice(i, 1), i = t.timeSystems.indexOf(e), i !== -1 && t.timeSystems.splice(i, 1), e.destroy()
                        })
                    }
                }, {
                    key: "createDOMGroups",
                    value: function () {
                        var e = this;
                        document.body.setAttribute("data-anim-scroll-group", "body"), document.querySelectorAll("[data-anim-scroll-group]").forEach(function (t) {
                            return e.createScrollGroup(t)
                        }), document.querySelectorAll("[data-anim-time-group]").forEach(function (t) {
                            return e.createTimeGroup(t)
                        }), this.trigger(c.EVENTS.ON_DOM_GROUPS_CREATED, this.groups)
                    }
                }, {
                    key: "createDOMKeyframes",
                    value: function () {
                        var e = this,
                            t = [];
                        [l.DATA_ATTRIBUTE, u.DATA_ATTRIBUTE, h.DATA_ATTRIBUTE].forEach(function (e) {
                            for (var i = 0; i < 12; i++) t.push(e + (0 === i ? "" : "-" + (i - 1)))
                        });
                        for (var i = 0; i < t.length; i++)
                            for (var n = t[i], r = document.querySelectorAll("[" + n + "]"), s = 0; s < r.length; s++) {
                                var o = r[s],
                                    a = JSON.parse(o.getAttribute(n));
                                this.addKeyframe(o, a)
                            }
                        p.update(function () {
                            e.groups.forEach(function (e) {
                                return e.onKeyframesDirty({
                                    silent: !0
                                })
                            }), e.groups.forEach(function (e) {
                                return e.trigger(c.EVENTS.ON_DOM_KEYFRAMES_CREATED, e)
                            }), e.trigger(c.EVENTS.ON_DOM_KEYFRAMES_CREATED, e), e.groups.forEach(function (e) {
                                e.forceUpdate({
                                    waitForNextUpdate: !1,
                                    silent: !0
                                }), e.reconcile()
                            }), e.onScroll()
                        }, !0)
                    }
                }, {
                    key: "initializeResizeFilter",
                    value: function () {
                        if (!c.cssDimensionsTracker) {
                            var e = document.querySelector(".cssDimensionsTracker") || document.createElement("div");
                            e.setAttribute("cssDimensionsTracker", "true"), e.style.position = "fixed", e.style.top = "0", e.style.width = "100%", e.style.height = "100vh", e.style.pointerEvents = "none", e.style.visibility = "hidden", e.style.zIndex = "-1", document.documentElement.appendChild(e), c.cssDimensionsTracker = e
                        }
                    }
                }, {
                    key: "initializeModel",
                    value: function () {
                        c.pageMetrics.windowHeight = c.cssDimensionsTracker.clientHeight, c.pageMetrics.windowWidth = c.cssDimensionsTracker.clientWidth, c.pageMetrics.scrollY = window.scrollY || window.pageYOffset, c.pageMetrics.scrollX = window.scrollX || window.pageXOffset, c.pageMetrics.breakpoint = c.getBreakpoint();
                        var e = document.documentElement.getBoundingClientRect();
                        c.pageMetrics.documentOffsetX = e.left + c.pageMetrics.scrollX, c.pageMetrics.documentOffsetY = e.top + c.pageMetrics.scrollY
                    }
                }, {
                    key: "setupEvents",
                    value: function () {
                        window.removeEventListener("scroll", this.onScroll), window.addEventListener("scroll", this.onScroll), window.removeEventListener("resize", this.onResizeImmediate), window.addEventListener("resize", this.onResizeImmediate)
                    }
                }, {
                    key: "onScroll",
                    value: function () {
                        c.pageMetrics.scrollY = window.scrollY || window.pageYOffset, c.pageMetrics.scrollX = window.scrollX || window.pageXOffset;
                        for (var e = 0, t = this.scrollSystems.length; e < t; e++) this.scrollSystems[e]._onScroll();
                        this.trigger(c.PageEvents.ON_SCROLL, c.pageMetrics)
                    }
                }, {
                    key: "onResizeImmediate",
                    value: function () {
                        var e = c.cssDimensionsTracker.clientWidth,
                            t = c.cssDimensionsTracker.clientHeight;
                        if (e !== c.pageMetrics.windowWidth || t !== c.pageMetrics.windowHeight) {
                            c.pageMetrics.windowWidth = e, c.pageMetrics.windowHeight = t, c.pageMetrics.scrollY = window.scrollY || window.pageYOffset, c.pageMetrics.scrollX = window.scrollX || window.pageXOffset;
                            var i = document.documentElement.getBoundingClientRect();
                            c.pageMetrics.documentOffsetX = i.left + c.pageMetrics.scrollX, c.pageMetrics.documentOffsetY = i.top + c.pageMetrics.scrollY, window.clearTimeout(c.RESIZE_TIMEOUT), c.RESIZE_TIMEOUT = window.setTimeout(this.onResizedDebounced, 250), this.trigger(c.PageEvents.ON_RESIZE_IMMEDIATE, c.pageMetrics)
                        }
                    }
                }, {
                    key: "onResizedDebounced",
                    value: function () {
                        var e = this;
                        p.update(function () {
                            var t = c.pageMetrics.breakpoint,
                                i = c.getBreakpoint(),
                                n = i !== t;
                            if (n) {
                                c.pageMetrics.previousBreakpoint = t, c.pageMetrics.breakpoint = i;
                                for (var r = 0, s = e.groups.length; r < s; r++) e.groups[r]._onBreakpointChange();
                                e.trigger(c.PageEvents.ON_BREAKPOINT_CHANGE, c.pageMetrics)
                            }
                            for (var o = 0, a = e.groups.length; o < a; o++) e.groups[o].forceUpdate({
                                waitForNextUpdate: !1
                            });
                            e.trigger(c.PageEvents.ON_RESIZE_DEBOUNCED, c.pageMetrics)
                        }, !0)
                    }
                }, {
                    key: "forceUpdate",
                    value: function () {
                        var e = this,
                            t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                            i = t.waitForNextUpdate,
                            n = void 0 === i || i,
                            r = t.silent,
                            s = void 0 !== r && r;
                        this._forceUpdateRAFId !== -1 && p.cancelUpdate(this._forceUpdateRAFId);
                        var o = function () {
                            for (var t = 0, i = e.groups.length; t < i; t++) {
                                var n = e.groups[t];
                                n.forceUpdate({
                                    waitForNextUpdate: !1,
                                    silent: s
                                })
                            }
                            return -1
                        };
                        this._forceUpdateRAFId = n ? p.update(o, !0) : o()
                    }
                }, {
                    key: "addKeyframe",
                    value: function (e, t) {
                        var i = this.getGroupForTarget(e);
                        return i = i || this.getGroupForTarget(document.body), i.addKeyframe(e, t)
                    }
                }, {
                    key: "getGroupForTarget",
                    value: function (e) {
                        if (e._animInfo && e._animInfo.group) return e._animInfo.group;
                        for (var t = e; t;) {
                            if (t._animInfo && t._animInfo.isGroup) return t._animInfo.group;
                            t = t.parentElement
                        }
                    }
                }, {
                    key: "getControllerForTarget",
                    value: function (e) {
                        return e._animInfo && e._animInfo.controller ? e._animInfo.controller : null
                    }
                }]), t
            }(a);
        t.exports = window.AC.SharedInstance.share("AnimSystem", f.major, y)
    }, {
        "./.release-info": 111,
        "./Keyframes/Keyframe": 113,
        "./Keyframes/KeyframeCSSClass": 114,
        "./Keyframes/KeyframeDiscreteEvent": 116,
        "./Model/AnimSystemModel": 117,
        "./ScrollGroup": 125,
        "./TimeGroup": 126,
        "@marcom/ac-event-emitter-micro": 37,
        "@marcom/ac-raf-emitter/cancelUpdate": 103,
        "@marcom/ac-raf-emitter/draw": 104,
        "@marcom/ac-raf-emitter/external": 105,
        "@marcom/ac-raf-emitter/update": 108
    }],
    113: [function (e, t, i) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var r = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var n = t[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function (t, i, n) {
                    return i && e(t.prototype, i), n && e(t, n), t
                }
            }(),
            s = e("../Model/AnimSystemModel"),
            o = e("@marcom/sm-math-utils"),
            a = e("../Model/EasingFunctions"),
            c = e("../Model/UnitBezier"),
            l = e("../utils/arrayToObject"),
            u = e("../utils/toValidAnchor"),
            h = function () {
                function e(t, i) {
                    n(this, e), this.controller = t, this.anchors = [], this.jsonProps = i, this.ease = t.group.defaultEase, this.easeFunctionString = s.KeyframeDefaults.easeFunctionString, this.easeFunction = a[this.easeFunctionString], this.start = 0, this.end = 0, this.localT = 0, this.curvedT = 0, this.id = 0, this.event = "", this.needsEventDispatch = !1, this.snapAtCreation = !1, this.isEnabled = !1, this.animValues = {}, this.breakpointMask = "SMLX", this.disabledWhen = [], this.keyframeType = s.KeyframeTypes.Interpolation, this.hold = !1, this.preserveState = !1, this.markedForRemoval = !1
                }
                return r(e, [{
                    key: "destroy",
                    value: function () {
                        this.controller = null, this.disabledWhen = null, this.anchors = null, this.jsonProps = null, this.easeFunction = null, this.animValues = null
                    }
                }, {
                    key: "remove",
                    value: function () {
                        return this.controller.removeKeyframe(this)
                    }
                }, {
                    key: "parseOptions",
                    value: function (e) {
                        var t = this;
                        if (this.jsonProps = e, e.relativeTo && console.error("KeyframeError: relativeTo has been removed. Use 'anchors' property instead. Found 'relativeTo':\"" + e.relativeTo + '"'), "" !== e.anchors && e.anchors ? (this.anchors = [], e.anchors = Array.isArray(e.anchors) ? e.anchors : [e.anchors], e.anchors.forEach(function (i, n) {
                                var r = u(i, t.controller.group.element);
                                if (!r) {
                                    var s = "";
                                    return "string" == typeof i && (s = " Provided value was a string, so a failed attempt was made to find anchor with the provided querystring in group.element, or in the document."), void console.warn("Keyframe on", t.controller.element, " failed to find anchor at index " + n + " in array", e.anchors, ". Anchors must be JS Object references, Elements references, or valid query selector strings. " + s)
                                }
                                t.anchors.push(r), t.controller.group.metrics.add(r)
                            })) : (this.anchors = [], e.anchors = []), e.ease ? this.ease = parseFloat(e.ease) : e.ease = this.ease, e.hasOwnProperty("snapAtCreation") ? this.snapAtCreation = e.snapAtCreation : e.snapAtCreation = this.snapAtCreation, e.easeFunction ? this.easeFunction = e.easeFunction : e.easeFunction = this.easeFunctionString, e.breakpointMask ? this.breakpointMask = e.breakpointMask : e.breakpointMask = this.breakpointMask, e.disabledWhen ? this.disabledWhen = Array.isArray(e.disabledWhen) ? e.disabledWhen : [e.disabledWhen] : e.disabledWhen = this.disabledWhen, e.hasOwnProperty("hold") ? this.hold = e.hold : e.hold = this.hold, e.hasOwnProperty("preserveState") ? this.preserveState = e.preserveState : e.preserveState = this.preserveState, this.easeFunction = a[e.easeFunction], !a.hasOwnProperty(e.easeFunction)) {
                            var i = c.fromCSSString(e.easeFunction);
                            i ? this.easeFunction = i : console.error("Keyframe parseOptions cannot find EasingFunction named '" + e.easingFunction + "'")
                        }
                        for (var n in e)
                            if (s.KeyframeJSONReservedWords.indexOf(n) === -1) {
                                var r = e[n];
                                if (Array.isArray(r)) {
                                    if (this.animValues[n] = this.controller.group.expressionParser.parseArray(this, r), void 0 === this.controller.tweenProps[n] || !this.controller._ownerIsElement) {
                                        var o = 0;
                                        this.controller._ownerIsElement || (o = this.controller.element[n] || 0);
                                        var l = new s.TargetValue(o, s.KeyframeDefaults.epsilon, this.snapAtCreation);
                                        this.controller.tweenProps[n] = l
                                    }
                                    var h = this.controller.tweenProps[n];
                                    if (e.epsilon) h.epsilon = e.epsilon;
                                    else {
                                        var m = Math.abs(this.animValues[n][0] - this.animValues[n][1]),
                                            d = Math.min(.001 * m, h.epsilon, s.KeyframeDefaults.epsilon);
                                        h.epsilon = Math.max(d, 1e-4)
                                    }
                                }
                            } this.keyframeType = this.hold ? s.KeyframeTypes.InterpolationForward : s.KeyframeTypes.Interpolation, e.event && (this.event = e.event)
                    }
                }, {
                    key: "overwriteProps",
                    value: function (e) {
                        this.animValues = {};
                        var t = Object.assign({}, this.jsonProps, e);
                        this.controller.updateKeyframe(this, t)
                    }
                }, {
                    key: "updateLocalProgress",
                    value: function (e) {
                        if (this.start === this.end || e < this.start || e > this.end) return this.localT = e < this.start ? 0 : e > this.end ? 1 : 0, void(this.curvedT = this.easeFunction(this.localT));
                        var t = (e - this.start) / (this.end - this.start),
                            i = this.hold ? this.localT : 0;
                        this.localT = o.clamp(t, i, 1), this.curvedT = this.easeFunction(this.localT)
                    }
                }, {
                    key: "reconcile",
                    value: function (e) {
                        var t = this.animValues[e],
                            i = this.controller.tweenProps[e];
                        i.initialValue = t[0], i.target = t[0] + this.curvedT * (t[1] - t[0]), i.current !== i.target && (i.current = i.target, this.needsEventDispatch || (this.needsEventDispatch = !0, this.controller.keyframesRequiringDispatch.push(this)))
                    }
                }, {
                    key: "reset",
                    value: function (e) {
                        this.localT = e || 0;
                        var t = this.ease;
                        this.ease = 1;
                        for (var i in this.animValues) this.reconcile(i);
                        this.ease = t
                    }
                }, {
                    key: "onDOMRead",
                    value: function (e) {
                        var t = this.animValues[e],
                            i = this.controller.tweenProps[e];
                        i.target = t[0] + this.curvedT * (t[1] - t[0]);
                        var n = i.current;
                        i.current += (i.target - i.current) * this.ease;
                        var r = i.current - i.target;
                        r < i.epsilon && r > -i.epsilon && (i.current = i.target, r = 0), "" === this.event || this.needsEventDispatch || (r > i.epsilon || r < -i.epsilon || 0 === r && n !== i.current) && (this.needsEventDispatch = !0, this.controller.keyframesRequiringDispatch.push(this))
                    }
                }, {
                    key: "isInRange",
                    value: function (e) {
                        return e >= this.start && e <= this.end
                    }
                }, {
                    key: "setEnabled",
                    value: function (e) {
                        e = e || l(Array.from(document.documentElement.classList));
                        var t = this.breakpointMask.indexOf(s.pageMetrics.breakpoint) !== -1,
                            i = !1;
                        return this.disabledWhen.length > 0 && (i = this.disabledWhen.some(function (t) {
                            return "undefined" != typeof e[t]
                        })), this.isEnabled = t && !i, this.isEnabled
                    }
                }, {
                    key: "evaluateConstraints",
                    value: function () {
                        this.start = this.controller.group.expressionParser.parseTimeValue(this, this.jsonProps.start), this.end = this.controller.group.expressionParser.parseTimeValue(this, this.jsonProps.end), this.evaluateInterpolationConstraints()
                    }
                }, {
                    key: "evaluateInterpolationConstraints",
                    value: function () {
                        for (var e in this.animValues) {
                            var t = this.jsonProps[e];
                            this.animValues[e] = this.controller.group.expressionParser.parseArray(this, t)
                        }
                    }
                }]), e
            }();
        h.DATA_ATTRIBUTE = "data-anim-tween", t.exports = h
    }, {
        "../Model/AnimSystemModel": 117,
        "../Model/EasingFunctions": 118,
        "../Model/UnitBezier": 122,
        "../utils/arrayToObject": 127,
        "../utils/toValidAnchor": 128,
        "@marcom/sm-math-utils": 135
    }],
    114: [function (e, t, i) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function r(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function s(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                return typeof e
            } : function (e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            a = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var n = t[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function (t, i, n) {
                    return i && e(t.prototype, i), n && e(t, n), t
                }
            }(),
            c = e("./Keyframe"),
            l = e("../Model/AnimSystemModel.js"),
            u = function (e) {
                function t(e, i) {
                    n(this, t);
                    var s = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, i));
                    return s.keyframeType = l.KeyframeTypes.CSSClass, s._triggerType = t.TRIGGER_TYPE_CSS_CLASS, s.cssClass = "", s.friendlyName = "", s.style = {
                        on: null,
                        off: null
                    }, s.toggle = !1, s.isApplied = !1, s
                }
                return s(t, e), a(t, [{
                    key: "parseOptions",
                    value: function (e) {
                        if (!this.controller._ownerIsElement) throw new TypeError("CSS Keyframes cannot be applied to JS Objects");
                        if (e.x = void 0, e.y = void 0, e.scale = void 0, e.scaleX = void 0, e.scaleY = void 0, e.rotation = void 0, e.opacity = void 0, e.hold = void 0, void 0 !== e.toggle && (this.toggle = e.toggle), void 0 !== e.cssClass) this._triggerType = t.TRIGGER_TYPE_CSS_CLASS, this.cssClass = e.cssClass, this.friendlyName = "." + this.cssClass, void 0 === this.controller.tweenProps.targetClasses && (this.controller.tweenProps.targetClasses = {
                            add: [],
                            remove: []
                        });
                        else {
                            if (void 0 === e.style || !this.isValidStyleProperty(e.style)) throw new TypeError("KeyframeCSSClass no 'cssClass` property found. If using `style` property its also missing or invalid");
                            if (this._triggerType = t.TRIGGER_TYPE_STYLE_PROPERTY, this.style = e.style, this.friendlyName = "style", this.toggle = void 0 !== this.style.off || this.toggle, this.toggle && void 0 === this.style.off) {
                                this.style.off = {};
                                for (var i in this.style.on) this.style.off[i] = ""
                            }
                            void 0 === this.controller.tweenProps.targetStyles && (this.controller.tweenProps.targetStyles = {})
                        }
                        if (void 0 === e.end && (e.end = e.start), e.toggle = this.toggle, this._triggerType === t.TRIGGER_TYPE_CSS_CLASS) this.isApplied = this.controller.element.classList.contains(this.cssClass);
                        else {
                            var n = getComputedStyle(this.controller.element);
                            this.isApplied = !0;
                            for (var r in this.style.on)
                                if (n[r] !== this.style.on[r]) {
                                    this.isApplied = !1;
                                    break
                                }
                        }
                        c.prototype.parseOptions.call(this, e), this.animValues[this.friendlyName] = [0, 0], void 0 === this.controller.tweenProps[this.friendlyName] && (this.controller.tweenProps[this.friendlyName] = new l.TargetValue(0, 1, (!1))), this.keyframeType = l.KeyframeTypes.CSSClass
                    }
                }, {
                    key: "updateLocalProgress",
                    value: function (e) {
                        this.isApplied && !this.toggle || (this.start !== this.end ? !this.isApplied && e >= this.start && e <= this.end ? this._apply() : this.isApplied && this.toggle && (e < this.start || e > this.end) && this._unapply() : !this.isApplied && e >= this.start ? this._apply() : this.isApplied && this.toggle && e < this.start && this._unapply())
                    }
                }, {
                    key: "_apply",
                    value: function () {
                        if (this._triggerType === t.TRIGGER_TYPE_CSS_CLASS) this.controller.tweenProps.targetClasses.add.push(this.cssClass), this.controller.needsClassUpdate = !0;
                        else {
                            for (var e in this.style.on) this.controller.tweenProps.targetStyles[e] = this.style.on[e];
                            this.controller.needsStyleUpdate = !0
                        }
                        this.isApplied = !0
                    }
                }, {
                    key: "_unapply",
                    value: function () {
                        if (this._triggerType === t.TRIGGER_TYPE_CSS_CLASS) this.controller.tweenProps.targetClasses.remove.push(this.cssClass), this.controller.needsClassUpdate = !0;
                        else {
                            for (var e in this.style.off) this.controller.tweenProps.targetStyles[e] = this.style.off[e];
                            this.controller.needsStyleUpdate = !0
                        }
                        this.isApplied = !1
                    }
                }, {
                    key: "isValidStyleProperty",
                    value: function (e) {
                        if (!e.hasOwnProperty("on")) return !1;
                        if ("object" !== o(e.on)) throw new TypeError("KeyframeCSSClass `style` property should be in the form of: {on:{visibility:hidden, otherProperty: value}}");
                        if (this.toggle && e.hasOwnProperty("off") && "object" !== o(e.off)) throw new TypeError("KeyframeCSSClass `style` property should be in the form of: {on:{visibility:hidden, otherProperty: value}}");
                        return !0
                    }
                }, {
                    key: "reconcile",
                    value: function (e, t) {}
                }, {
                    key: "onDOMRead",
                    value: function (e, t) {}
                }, {
                    key: "evaluateInterpolationConstraints",
                    value: function () {}
                }]), t
            }(c);
        u.TRIGGER_TYPE_CSS_CLASS = 0, u.TRIGGER_TYPE_STYLE_PROPERTY = 1, u.DATA_ATTRIBUTE = "data-anim-classname", t.exports = u
    }, {
        "../Model/AnimSystemModel.js": 117,
        "./Keyframe": 113
    }],
    115: [function (e, t, i) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function r(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function s(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var o = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var n = t[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function (t, i, n) {
                    return i && e(t.prototype, i), n && e(t, n), t
                }
            }(),
            a = function g(e, t, i) {
                null === e && (e = Function.prototype);
                var n = Object.getOwnPropertyDescriptor(e, t);
                if (void 0 === n) {
                    var r = Object.getPrototypeOf(e);
                    return null === r ? void 0 : g(r, t, i)
                }
                if ("value" in n) return n.value;
                var s = n.get;
                if (void 0 !== s) return s.call(i)
            },
            c = e("../Model/AnimSystemModel"),
            l = (e("./Keyframe"), e("./KeyframeCSSClass")),
            u = e("../Model/InferKeyframeFromProps"),
            h = e("../utils/arrayToObject"),
            m = e("../Model/UUID"),
            d = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            f = e("@marcom/decompose-css-transform"),
            p = {
                update: e("@marcom/ac-raf-emitter/update"),
                external: e("@marcom/ac-raf-emitter/external"),
                draw: e("@marcom/ac-raf-emitter/draw")
            },
            v = Math.PI / 180,
            y = ["x", "y", "z", "scale", "scaleX", "scaleY", "rotation", "rotationX", "rotationY", "rotationZ"],
            _ = {
                create: e("gl-mat4/create"),
                rotateX: e("gl-mat4/rotateX"),
                rotateY: e("gl-mat4/rotateY"),
                rotateZ: e("gl-mat4/rotateZ"),
                scale: e("gl-mat4/scale")
            },
            b = function (e) {
                function t(e, i) {
                    n(this, t);
                    var s = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                    return s._events.draw = [], s.uuid = m(), s.group = e, s.element = i, s._ownerIsElement = s.element instanceof Element, s._ownerIsElement ? s.friendlyName = s.element.tagName + "." + Array.from(s.element.classList).join(".") : s.friendlyName = s.element.friendlyName || s.uuid, s.element._animInfo = s.element._animInfo || new c.AnimInfo(e, s), s.element._animInfo.controller = s, s.element._animInfo.group = s.group, s.element._animInfo.controllers.push(s), s.tweenProps = s.element._animInfo.tweenProps, s.eventObject = new c.EventObject(s), s.needsStyleUpdate = !1, s.needsClassUpdate = !1, s.elementMetrics = s.group.metrics.add(s.element), s.attributes = [], s.keyframes = {}, s._allKeyframes = [], s._activeKeyframes = [], s.keyframesRequiringDispatch = [], s.updateCachedValuesFromElement(), s.boundsMin = 0, s.boundsMax = 0, s.mat2d = new Float32Array(6), s.mat4 = _.create(), s.needsWrite = !0, s.onDOMWriteImp = s._ownerIsElement ? s.onDOMWriteForElement : s.onDOMWriteForObject, s
                }
                return s(t, e), o(t, [{
                    key: "destroy",
                    value: function () {
                        if (this.element._animInfo) {
                            this.element._animInfo.controller === this && (this.element._animInfo.controller = null);
                            var e = this.element._animInfo.controllers.indexOf(this);
                            e !== -1 && this.element._animInfo.controllers.splice(e, 1), 0 === this.element._animInfo.controllers.length ? this.element._animInfo = null : (this.element._animInfo.controller = this.element._animInfo.controllers[this.element._animInfo.controllers.length - 1], this.element._animInfo.group = this.element._animInfo.controller.group)
                        }
                        this.eventObject.controller = null, this.eventObject.element = null, this.eventObject.keyframe = null, this.eventObject.tweenProps = null, this.eventObject = null, this.elementMetrics = null, this.group = null, this.keyframesRequiringDispatch = null;
                        for (var i = 0; i < this._allKeyframes.length; i++) this._allKeyframes[i].destroy();
                        this._allKeyframes = null, this._activeKeyframes = null, this.attributes = null, this.keyframes = null, this.element = null, this.tweenProps = null, a(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "destroy", this).call(this)
                    }
                }, {
                    key: "remove",
                    value: function () {
                        return this.group.removeKeyframeController(this)
                    }
                }, {
                    key: "updateCachedValuesFromElement",
                    value: function () {
                        var e = this;
                        if (this._ownerIsElement) {
                            var t = getComputedStyle(this.element),
                                i = f(this.element, !0),
                                n = c.KeyframeDefaults.epsilon,
                                r = !1;
                            ["x", "y", "z"].forEach(function (t, s) {
                                e.tweenProps[t] = new c.TargetValue(i.translation[s], n, r)
                            }), this.tweenProps.rotation = new c.TargetValue(i.eulerRotation[2], n, r), ["rotationX", "rotationY", "rotationZ"].forEach(function (t, s) {
                                e.tweenProps[t] = new c.TargetValue(i.eulerRotation[s], n, r)
                            }), this.tweenProps.scaleZ = new c.TargetValue(i.scale[0], n, r), ["scaleX", "scaleY", "scale"].forEach(function (t, s) {
                                e.tweenProps[t] = new c.TargetValue(i.scale[s], n, r)
                            }), this.tweenProps.opacity = new c.TargetValue(parseFloat(t.opacity), n, r)
                        }
                    }
                }, {
                    key: "addKeyframe",
                    value: function (e) {
                        var t = u(e);
                        if (!t) throw new Error("AnimSystem Cannot create keyframe for from options `" + e + "`");
                        var i = new t(this, e);
                        return i.parseOptions(e), i.id = this._allKeyframes.length, this._allKeyframes.push(i), i
                    }
                }, {
                    key: "needsUpdate",
                    value: function () {
                        for (var e = 0, t = this.attributes.length; e < t; e++) {
                            var i = this.attributes[e],
                                n = this.tweenProps[i],
                                r = Math.abs(n.current - n.target);
                            if (r > n.epsilon) return !0
                        }
                        return !1
                    }
                }, {
                    key: "updateLocalProgress",
                    value: function (e) {
                        for (var t = 0, i = this.attributes.length; t < i; t++) {
                            var n = this.attributes[t],
                                r = this.keyframes[this.attributes[t]];
                            if (1 !== r.length) {
                                var s = this.getNearestKeyframeForAttribute(n, e);
                                s && s.updateLocalProgress(e)
                            } else r[0].updateLocalProgress(e)
                        }
                    }
                }, {
                    key: "reconcile",
                    value: function () {
                        for (var e = 0, t = this.attributes.length; e < t; e++) {
                            var i = this.attributes[e],
                                n = this.getNearestKeyframeForAttribute(i, this.group.position.local);
                            n.updateLocalProgress(this.group.position.local), n.snapAtCreation && n.reconcile(i)
                        }
                    }
                }, {
                    key: "determineActiveKeyframes",
                    value: function (e) {
                        var t = this;
                        e = e || h(Array.from(document.documentElement.classList));
                        var i = this._activeKeyframes,
                            n = this.attributes,
                            r = {};
                        this._activeKeyframes = [], this.attributes = [], this.keyframes = {};
                        for (var s = 0; s < this._allKeyframes.length; s++) {
                            var o = this._allKeyframes[s];
                            if (!o.markedForRemoval && o.setEnabled(e)) {
                                this._activeKeyframes.push(o);
                                for (var a in o.animValues) this.keyframes[a] = this.keyframes[a] || [], this.keyframes[a].push(o), this.attributes.indexOf(a) === -1 && (r[a] = !0, this.attributes.push(a), this.tweenProps[a].isActive = !0)
                            } else
                                for (var c in o.animValues) this.tweenProps[c].isActive = o.preserveState, o.preserveState && (r[c] = !0)
                        }
                        var u = i.filter(function (e) {
                            return t._activeKeyframes.indexOf(e) === -1
                        });
                        if (0 !== u.length) {
                            var m = n.filter(function (e) {
                                return t.attributes.indexOf(e) === -1 && !r.hasOwnProperty(e)
                            });
                            if (0 !== m.length)
                                if (this.needsWrite = !0, this._ownerIsElement) p.external(function () {
                                    var e = Object.keys(r).filter(function (e) {
                                        return y.includes(e)
                                    });
                                    0 === e.length && t.element.style.removeProperty("transform");
                                    for (var i = 0, n = m.length; i < n; ++i) {
                                        var s = m[i],
                                            o = t.tweenProps[s];
                                        o.current = o.target, o.isActive = !1, "opacity" === s && t.element.style.removeProperty("opacity")
                                    }
                                    for (var a = 0, c = u.length; a < c; ++a) {
                                        var h = u[a];
                                        h instanceof l && !h.preserveState && h._unapply()
                                    }
                                }, !0);
                                else
                                    for (var d = 0, f = m.length; d < f; ++d) {
                                        var v = this.tweenProps[m[d]];
                                        v.current = v.target, v.isActive = !1
                                    }
                        }
                    }
                }, {
                    key: "onDOMRead",
                    value: function (e) {
                        for (var t = 0, i = this.attributes.length; t < i; t++) {
                            var n = this.attributes[t];
                            this.tweenProps[n].previousValue = this.tweenProps[n].current;
                            var r = this.getNearestKeyframeForAttribute(n, e.local);
                            r && r.onDOMRead(n), this.tweenProps[n].previousValue !== this.tweenProps[n].current && (this.needsWrite = !0)
                        }
                    }
                }, {
                    key: "onDOMWrite",
                    value: function () {
                        (this.needsWrite || this.needsClassUpdate || this.needsStyleUpdate) && (this.needsWrite = !1, this.onDOMWriteImp(), this.handleEventDispatch())
                    }
                }, {
                    key: "onDOMWriteForObject",
                    value: function () {
                        for (var e = 0, t = this.attributes.length; e < t; e++) {
                            var i = this.attributes[e];
                            this.element[i] = this.tweenProps[i].current
                        }
                    }
                }, {
                    key: "onDOMWriteForElement",
                    value: function () {
                        var e = this.tweenProps;
                        if (e.z.isActive || e.rotationX.isActive || e.rotationY.isActive) {
                            var t = this.mat4;
                            if (t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, e.x.isActive || e.y.isActive || e.z.isActive) {
                                var i = e.x.current,
                                    n = e.y.current,
                                    r = e.z.current;
                                t[12] = t[0] * i + t[4] * n + t[8] * r + t[12], t[13] = t[1] * i + t[5] * n + t[9] * r + t[13], t[14] = t[2] * i + t[6] * n + t[10] * r + t[14], t[15] = t[3] * i + t[7] * n + t[11] * r + t[15]
                            }
                            if (e.rotation.isActive || e.rotationZ.isActive) {
                                var s = (e.rotation.current || e.rotationZ.current) * v;
                                _.rotateZ(t, t, s)
                            }
                            if (e.rotationX.isActive) {
                                var o = e.rotationX.current * v;
                                _.rotateX(t, t, o)
                            }
                            if (e.rotationY.isActive) {
                                var a = e.rotationY.current * v;
                                _.rotateY(t, t, a)
                            }(e.scale.isActive || e.scaleX.isActive || e.scaleY.isActive) && _.scale(t, t, [e.scale.current, e.scale.current, 1]), this.element.style.transform = "matrix3d(" + t[0] + "," + t[1] + "," + t[2] + "," + t[3] + "," + t[4] + "," + t[5] + "," + t[6] + "," + t[7] + "," + t[8] + "," + t[9] + "," + t[10] + "," + t[11] + "," + t[12] + "," + t[13] + "," + t[14] + "," + t[15] + ")"
                        } else if (e.x.isActive || e.y.isActive || e.rotation.isActive || e.rotationZ.isActive || e.scale.isActive || e.scaleX.isActive || e.scaleY.isActive) {
                            var c = this.mat2d;
                            if (c[0] = 1, c[1] = 0, c[2] = 0, c[3] = 1, c[4] = 0, c[5] = 0, e.x.isActive || e.y.isActive) {
                                var l = e.x.current,
                                    u = e.y.current,
                                    h = c[0],
                                    m = c[1],
                                    d = c[2],
                                    f = c[3],
                                    p = c[4],
                                    y = c[5];
                                c[0] = h, c[1] = m, c[2] = d, c[3] = f, c[4] = h * l + d * u + p, c[5] = m * l + f * u + y
                            }
                            if (e.rotation.isActive || e.rotationZ.isActive) {
                                var b = (e.rotation.current || e.rotationZ.current) * v,
                                    g = c[0],
                                    E = c[1],
                                    w = c[2],
                                    x = c[3],
                                    A = c[4],
                                    T = c[5],
                                    S = Math.sin(b),
                                    O = Math.cos(b);
                                c[0] = g * O + w * S, c[1] = E * O + x * S, c[2] = g * -S + w * O, c[3] = E * -S + x * O, c[4] = A, c[5] = T
                            }
                            e.scale.isActive ? (c[0] = c[0] * e.scale.current, c[1] = c[1] * e.scale.current, c[2] = c[2] * e.scale.current, c[3] = c[3] * e.scale.current, c[4] = c[4], c[5] = c[5]) : (e.scaleX.isActive || e.scaleY.isActive) && (c[0] = c[0] * e.scaleX.current, c[1] = c[1] * e.scaleX.current, c[2] = c[2] * e.scaleY.current, c[3] = c[3] * e.scaleY.current, c[4] = c[4], c[5] = c[5]), this.element.style.transform = "matrix(" + c[0] + ", " + c[1] + ", " + c[2] + ", " + c[3] + ", " + c[4] + ", " + c[5] + ")"
                        }
                        if (e.opacity.isActive && (this.element.style.opacity = e.opacity.current), this.needsStyleUpdate) {
                            for (var C in this.tweenProps.targetStyles) null !== this.tweenProps.targetStyles[C] && (this.element.style[C] = this.tweenProps.targetStyles[C]), this.tweenProps.targetStyles[C] = null;
                            this.needsStyleUpdate = !1
                        }
                        this.needsClassUpdate && (this.tweenProps.targetClasses.add.length > 0 && this.element.classList.add.apply(this.element.classList, this.tweenProps.targetClasses.add), this.tweenProps.targetClasses.remove.length > 0 && this.element.classList.remove.apply(this.element.classList, this.tweenProps.targetClasses.remove), this.tweenProps.targetClasses.add.length = 0, this.tweenProps.targetClasses.remove.length = 0, this.needsClassUpdate = !1)
                    }
                }, {
                    key: "handleEventDispatch",
                    value: function () {
                        if (0 !== this.keyframesRequiringDispatch.length) {
                            for (var e = 0, t = this.keyframesRequiringDispatch.length; e < t; e++) {
                                var i = this.keyframesRequiringDispatch[e];
                                i.needsEventDispatch = !1, this.eventObject.keyframe = i, this.eventObject.pageMetrics = c.pageMetrics, this.eventObject.event = i.event, this.trigger(i.event, this.eventObject)
                            }
                            this.keyframesRequiringDispatch.length = 0
                        }
                        if (0 !== this._events.draw.length) {
                            this.eventObject.keyframe = null, this.eventObject.event = "draw";
                            for (var n = this._events.draw.length - 1; n >= 0; n--) this._events.draw[n](this.eventObject)
                        }
                    }
                }, {
                    key: "updateAnimationConstraints",
                    value: function () {
                        for (var e = this, t = 0, i = this._activeKeyframes.length; t < i; t++) this._activeKeyframes[t].evaluateConstraints();
                        this.attributes.forEach(function (t) {
                            1 !== e.keyframes[t].length && e.keyframes[t].sort(c.KeyframeComparison)
                        }), this.updateDeferredPropertyValues()
                    }
                }, {
                    key: "refreshMetrics",
                    value: function () {
                        var e = new Set([this.element]);
                        this._allKeyframes.forEach(function (t) {
                            return t.anchors.forEach(function (t) {
                                return e.add(t)
                            })
                        }), this.group.metrics.refreshCollection(e), this.group.keyframesDirty = !0
                    }
                }, {
                    key: "updateDeferredPropertyValues",
                    value: function () {
                        for (var e = 0, t = this.attributes.length; e < t; e++) {
                            var i = this.attributes[e],
                                n = this.keyframes[i],
                                r = n[0];
                            if (!(r.keyframeType > c.KeyframeTypes.InterpolationForward))
                                for (var s = 0, o = n.length; s < o; s++) {
                                    var a = n[s];
                                    if (null === a.jsonProps[i][0]) {
                                        if (0 === s) {
                                            a.animValues[i][0] = this.tweenProps[i].initialValue;
                                            continue
                                        }
                                        a.animValues[i][0] = n[s - 1].animValues[i][1]
                                    }
                                    if (null === a.jsonProps[i][1]) {
                                        if (s === o - 1) throw new RangeError("AnimSystem - last keyframe cannot defer it's end value! " + i + ":[" + a.jsonProps[i][0] + ",null]");
                                        a.animValues[i][1] = n[s + 1].animValues[i][0]
                                    }
                                }
                        }
                    }
                }, {
                    key: "getBounds",
                    value: function (e) {
                        this.boundsMin = Number.MAX_VALUE, this.boundsMax = -Number.MAX_VALUE;
                        for (var t = 0, i = this.attributes.length; t < i; t++)
                            for (var n = this.keyframes[this.attributes[t]], r = 0; r < n.length; r++) {
                                var s = n[r];
                                this.boundsMin = Math.min(s.start, this.boundsMin), this.boundsMax = Math.max(s.end, this.boundsMax), e.min = Math.min(s.start, e.min), e.max = Math.max(s.end, e.max)
                            }
                    }
                }, {
                    key: "getNearestKeyframeForAttribute",
                    value: function (e, t) {
                        t = void 0 !== t ? t : this.group.position.local;
                        var i = null,
                            n = Number.POSITIVE_INFINITY,
                            r = this.keyframes[e];
                        if (void 0 === r) return null;
                        var s = r.length;
                        if (0 === s) return null;
                        if (1 === s) return r[0];
                        for (var o = 0; o < s; o++) {
                            var a = r[o];
                            if (a.isInRange(t)) {
                                i = a;
                                break
                            }
                            var c = Math.min(Math.abs(t - a.start), Math.abs(t - a.end));
                            c < n && (n = c, i = a)
                        }
                        return i
                    }
                }, {
                    key: "getAllKeyframesForAttribute",
                    value: function (e) {
                        return this.keyframes[e]
                    }
                }, {
                    key: "updateKeyframe",
                    value: function (e, t) {
                        var i = this;
                        e.parseOptions(t), e.evaluateConstraints(), this.group.keyframesDirty = !0, p.update(function () {
                            i.trigger(c.EVENTS.ON_KEYFRAME_UPDATED, e), i.group.trigger(c.EVENTS.ON_KEYFRAME_UPDATED, e)
                        }, !0)
                    }
                }, {
                    key: "removeKeyframe",
                    value: function (e) {
                        var t = this;
                        return e.controller !== this ? Promise.resolve(null) : (e.markedForRemoval = !0, this.group.keyframesDirty = !0, new Promise(function (i) {
                            t.group.rafEmitter.executor.eventEmitter.once("before:draw", function () {
                                i(e), e.destroy();
                                var n = t._allKeyframes.indexOf(e);
                                n !== -1 && t._allKeyframes.splice(n, 1)
                            })
                        }))
                    }
                }, {
                    key: "updateAnimation",
                    value: function (e, t) {
                        return this.group.gui && console.warn("KeyframeController.updateAnimation(keyframe,props) has been deprecated. Please use updateKeyframe(keyframe,props)"), this.updateKeyframe(e, t)
                    }
                }]), t
            }(d);
        t.exports = b
    }, {
        "../Model/AnimSystemModel": 117,
        "../Model/InferKeyframeFromProps": 120,
        "../Model/UUID": 121,
        "../utils/arrayToObject": 127,
        "./Keyframe": 113,
        "./KeyframeCSSClass": 114,
        "@marcom/ac-event-emitter-micro": 37,
        "@marcom/ac-raf-emitter/draw": 104,
        "@marcom/ac-raf-emitter/external": 105,
        "@marcom/ac-raf-emitter/update": 108,
        "@marcom/decompose-css-transform": 129,
        "gl-mat4/create": 152,
        "gl-mat4/rotateX": 154,
        "gl-mat4/rotateY": 155,
        "gl-mat4/rotateZ": 156,
        "gl-mat4/scale": 157
    }],
    116: [function (e, t, i) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function r(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function s(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var o = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var n = t[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function (t, i, n) {
                    return i && e(t.prototype, i), n && e(t, n), t
                }
            }(),
            a = function h(e, t, i) {
                null === e && (e = Function.prototype);
                var n = Object.getOwnPropertyDescriptor(e, t);
                if (void 0 === n) {
                    var r = Object.getPrototypeOf(e);
                    return null === r ? void 0 : h(r, t, i)
                }
                if ("value" in n) return n.value;
                var s = n.get;
                if (void 0 !== s) return s.call(i)
            },
            c = e("./Keyframe"),
            l = e("../Model/AnimSystemModel.js"),
            u = function (e) {
                function t(e, i) {
                    n(this, t);
                    var s = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, i));
                    return s.keyframeType = l.KeyframeTypes.Event, s.isApplied = !1, s.hasDuration = !1, s.isCurrentlyInRange = !1, s
                }
                return s(t, e), o(t, [{
                    key: "parseOptions",
                    value: function (e) {
                        e.x = void 0, e.y = void 0, e.scale = void 0, e.scaleX = void 0, e.scaleY = void 0, e.rotation = void 0, e.style = void 0, e.cssClass = void 0, e.rotation = void 0, e.opacity = void 0, e.hold = void 0, void 0 === e.end && (e.end = e.start), this.event = e.event, this.animValues[this.event] = [0, 0], "undefined" == typeof this.controller.tweenProps[this.event] && (this.controller.tweenProps[this.event] = new l.TargetValue(0, 1, (!1))), a(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "parseOptions", this).call(this, e), this.keyframeType = l.KeyframeTypes.Event
                    }
                }, {
                    key: "updateLocalProgress",
                    value: function (e) {
                        if (this.hasDuration) {
                            var t = this.isCurrentlyInRange,
                                i = e >= this.start && e <= this.end;
                            if (t === i) return;
                            return this.isCurrentlyInRange = i, void(i && !t ? this._trigger(this.event + ":enter") : t && !i && this._trigger(this.event + ":exit"))
                        }!this.isApplied && e >= this.start ? (this.isApplied = !0, this._trigger(this.event)) : this.isApplied && e < this.start && (this.isApplied = !1, this._trigger(this.event + ":reverse"))
                    }
                }, {
                    key: "_trigger",
                    value: function (e) {
                        this.controller.eventObject.event = e, this.controller.eventObject.keyframe = this, this.controller.trigger(e, this.controller.eventObject)
                    }
                }, {
                    key: "evaluateConstraints",
                    value: function () {
                        a(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "evaluateConstraints", this).call(this), this.hasDuration = this.start !== this.end
                    }
                }, {
                    key: "reset",
                    value: function (e) {
                        this.isApplied = !1, this.isCurrentlyInRange = !1, a(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "reset", this).call(this, e)
                    }
                }, {
                    key: "onDOMRead",
                    value: function (e, t) {}
                }, {
                    key: "reconcile",
                    value: function (e, t) {}
                }, {
                    key: "evaluateInterpolationConstraints",
                    value: function () {}
                }]), t
            }(c);
        u.DATA_ATTRIBUTE = "data-anim-event", t.exports = u
    }, {
        "../Model/AnimSystemModel.js": 117,
        "./Keyframe": 113
    }],
    117: [function (e, t, i) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var r = {
            GUI_INSTANCE: null,
            ANIM_INSTANCE: null,
            VIEWPORT_EMITTER_ELEMENT: void 0,
            LOCAL_STORAGE_KEYS: {
                GuiPosition: "anim-ui.position",
                GroupCollapsedStates: "anim-ui.group-collapsed-states",
                scrollY: "anim-ui.scrollY-position",
                path: "anim-ui.path"
            },
            RESIZE_TIMEOUT: -1,
            BREAKPOINTS: [{
                name: "S",
                mediaQuery: "only screen and (max-width: 735px)"
            }, {
                name: "M",
                mediaQuery: "only screen and (max-width: 1068px)"
            }, {
                name: "L",
                mediaQuery: "only screen and (min-width: 1442px)"
            }, {
                name: "L",
                mediaQuery: "only screen and (min-width: 1069px)"
            }],
            getBreakpoint: function () {
                for (var e = 0; e < r.BREAKPOINTS.length; e++) {
                    var t = r.BREAKPOINTS[e],
                        i = window.matchMedia(t.mediaQuery);
                    if (i.matches) return t.name
                }
            },
            KeyframeDefaults: {
                ease: 1,
                epsilon: .05,
                easeFunctionString: "linear",
                easeFunction: "linear",
                hold: !1,
                snapAtCreation: !1,
                toggle: !1,
                breakpointMask: "SMLX",
                event: "",
                disabledWhen: [],
                cssClass: ""
            },
            KeyframeTypes: {
                Interpolation: 0,
                InterpolationForward: 1,
                CSSClass: 2,
                Event: 3
            },
            EVENTS: {
                ON_DOM_KEYFRAMES_CREATED: "ON_DOM_KEYFRAMES_CREATED",
                ON_DOM_GROUPS_CREATED: "ON_DOM_GROUPS_CREATED",
                ON_GROUP_CREATED: "ON_GROUP_CREATED",
                ON_KEYFRAME_UPDATED: "ON_KEYFRAME_UPDATED",
                ON_TIMELINE_START: "ON_TIMELINE_START",
                ON_TIMELINE_UPDATE: "ON_TIMELINE_UPDATE",
                ON_TIMELINE_COMPLETE: "ON_TIMELINE_COMPLETE"
            },
            PageEvents: {
                ON_SCROLL: "ON_SCROLL",
                ON_RESIZE_IMMEDIATE: "ON_RESIZE_IMMEDIATE",
                ON_RESIZE_DEBOUNCED: "ON_RESIZE_DEBOUNCED",
                ON_BREAKPOINT_CHANGE: "ON_BREAKPOINT_CHANGE"
            },
            KeyframeJSONReservedWords: ["event", "cssClass", "style", "anchors", "start", "end", "epsilon", "easeFunction", "ease", "breakpointMask", "disabledWhen"],
            TweenProps: function s() {
                n(this, s)
            },
            TargetValue: function o(e, t, i) {
                n(this, o), this.epsilon = parseFloat(t), this.snapAtCreation = i, this.initialValue = e, this.target = e, this.current = e, this.previousValue = e, this.isActive = !1
            },
            AnimInfo: function (e, t) {
                var i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
                this.isGroup = i, this.group = e, this.controller = t, this.controllers = [], this.tweenProps = new r.TweenProps
            },
            Progress: function () {
                this.local = 0, this.localUnclamped = 0, this.lastPosition = 0
            },
            ViewableRange: function (e, t) {
                this.a = e.top - t, this.a < 0 && (this.a = e.top), this.b = e.top, this.d = e.bottom, this.c = Math.max(this.d - t, this.b)
            },
            pageMetrics: new function () {
                this.scrollX = 0, this.scrollY = 0, this.windowWidth = 0, this.windowHeight = 0, this.documentOffsetX = 0, this.documentOffsetY = 0, this.previousBreakpoint = "", this.breakpoint = ""
            },
            EventObject: function (e) {
                this.controller = e, this.element = this.controller.element, this.keyframe = null, this.event = "", this.tweenProps = this.controller.tweenProps
            },
            KeyframeComparison: function (e, t) {
                return e.start < t.start ? -1 : e.start > t.start ? 1 : 0
            }
        };
        t.exports = r
    }, {}],
    118: [function (e, t, i) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var r = function s() {
            n(this, s), this.linear = function (e) {
                return e
            }, this.easeInQuad = function (e) {
                return e * e
            }, this.easeOutQuad = function (e) {
                return e * (2 - e)
            }, this.easeInOutQuad = function (e) {
                return e < .5 ? 2 * e * e : -1 + (4 - 2 * e) * e
            }, this.easeInSin = function (e) {
                return 1 + Math.sin(Math.PI / 2 * e - Math.PI / 2)
            }, this.easeOutSin = function (e) {
                return Math.sin(Math.PI / 2 * e)
            }, this.easeInOutSin = function (e) {
                return (1 + Math.sin(Math.PI * e - Math.PI / 2)) / 2
            }, this.easeInElastic = function (e) {
                return 0 === e ? e : (.04 - .04 / e) * Math.sin(25 * e) + 1
            }, this.easeOutElastic = function (e) {
                return .04 * e / --e * Math.sin(25 * e)
            }, this.easeInOutElastic = function (e) {
                return (e -= .5) < 0 ? (.02 + .01 / e) * Math.sin(50 * e) : (.02 - .01 / e) * Math.sin(50 * e) + 1
            }, this.easeOutBack = function (e) {
                return e -= 1, e * e * (2.70158 * e + 1.70158) + 1
            }, this.easeInCubic = function (e) {
                return e * e * e
            }, this.easeOutCubic = function (e) {
                return --e * e * e + 1
            }, this.easeInOutCubic = function (e) {
                return e < .5 ? 4 * e * e * e : (e - 1) * (2 * e - 2) * (2 * e - 2) + 1
            }, this.easeInQuart = function (e) {
                return e * e * e * e
            }, this.easeOutQuart = function (e) {
                return 1 - --e * e * e * e
            }, this.easeInOutQuart = function (e) {
                return e < .5 ? 8 * e * e * e * e : 1 - 8 * --e * e * e * e
            }, this.easeInQuint = function (e) {
                return e * e * e * e * e
            }, this.easeOutQuint = function (e) {
                return 1 + --e * e * e * e * e
            }, this.easeInOutQuint = function (e) {
                return e < .5 ? 16 * e * e * e * e * e : 1 + 16 * --e * e * e * e * e
            }
        };
        t.exports = new r
    }, {}],
    119: [function (e, t, i) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var r = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var n = t[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function (t, i, n) {
                    return i && e(t.prototype, i), n && e(t, n), t
                }
            }(),
            s = e("./AnimSystemModel"),
            o = function (e, t) {
                return void 0 === e || null === e ? t : e
            },
            a = function () {
                function e() {
                    n(this, e), this.clear()
                }
                return r(e, [{
                    key: "clear",
                    value: function () {
                        this._metrics = new WeakMap
                    }
                }, {
                    key: "destroy",
                    value: function () {
                        this._metrics = null
                    }
                }, {
                    key: "add",
                    value: function (e) {
                        var t = this._metrics.get(e);
                        if (t) return t;
                        var i = new c(e);
                        return this._metrics.set(e, i), this._refreshMetrics(e, i)
                    }
                }, {
                    key: "get",
                    value: function (e) {
                        return this._metrics.get(e)
                    }
                }, {
                    key: "refreshCollection",
                    value: function (e) {
                        var t = this;
                        e.forEach(function (e) {
                            return t._refreshMetrics(e, null)
                        })
                    }
                }, {
                    key: "refreshMetrics",
                    value: function (e) {
                        return this._refreshMetrics(e)
                    }
                }, {
                    key: "_refreshMetrics",
                    value: function (e, t) {
                        if (t = t || this._metrics.get(e), !(e instanceof Element)) return t.width = o(e.width, 0), t.height = o(e.height, 0), t.top = o(e.top, o(e.y, 0)), t.left = o(e.left, o(e.x, 0)), t.right = t.left + t.width, t.bottom = t.top + t.height, t;
                        if (void 0 === e.offsetWidth) {
                            var i = e.getBoundingClientRect();
                            return t.width = i.width, t.height = i.height, t.top = s.pageMetrics.scrollY + i.top, t.left = s.pageMetrics.scrollX + i.left, t.right = t.left + t.width, t.bottom = t.top + t.height, t
                        }
                        t.width = e.offsetWidth, t.height = e.offsetHeight, t.top = s.pageMetrics.documentOffsetY, t.left = s.pageMetrics.documentOffsetX;
                        for (var n = e; n;) t.top += n.offsetTop, t.left += n.offsetLeft, n = n.offsetParent;
                        return t.right = t.left + t.width, t.bottom = t.top + t.height, t
                    }
                }]), e
            }(),
            c = function () {
                function e(t) {
                    n(this, e), this.top = 0, this.bottom = 0, this.left = 0, this.right = 0, this.height = 0, this.width = 0
                }
                return r(e, [{
                    key: "toString",
                    value: function () {
                        return "top:" + this.top + ", bottom:" + this.bottom + ", left:" + this.left + ", right:" + this.right + ", height:" + this.height + ", width:" + this.width
                    }
                }, {
                    key: "toObject",
                    value: function () {
                        return {
                            top: this.top,
                            bottom: this.bottom,
                            left: this.left,
                            right: this.right,
                            height: this.height,
                            width: this.width
                        }
                    }
                }]), e
            }();
        t.exports = a
    }, {
        "./AnimSystemModel": 117
    }],
    120: [function (e, t, i) {
        "use strict";
        var n = e("./AnimSystemModel"),
            r = e("../Keyframes/Keyframe"),
            s = e("../Keyframes/KeyframeDiscreteEvent"),
            o = e("../Keyframes/KeyframeCSSClass"),
            a = function (e) {
                for (var t in e) {
                    var i = e[t];
                    if (n.KeyframeJSONReservedWords.indexOf(t) === -1 && Array.isArray(i)) return !0
                }
                return !1
            };
        t.exports = function (e) {
            if (void 0 !== e.cssClass || void 0 !== e.style) {
                if (a(e)) throw "CSS Keyframes cannot tween values, please use multiple keyframes instead";
                return o
            }
            if (a(e)) return r;
            if (e.event) return s;
            throw delete e.anchors, "Could not determine tween type based on " + JSON.stringify(e)
        }
    }, {
        "../Keyframes/Keyframe": 113,
        "../Keyframes/KeyframeCSSClass": 114,
        "../Keyframes/KeyframeDiscreteEvent": 116,
        "./AnimSystemModel": 117
    }],
    121: [function (e, t, i) {
        "use strict";
        t.exports = function () {
            for (var e = "", t = 0; t < 8; t++) {
                var i = 16 * Math.random() | 0;
                8 !== t && 12 !== t && 16 !== t && 20 !== t || (e += "-"), e += (12 === t ? 4 : 16 === t ? 3 & i | 8 : i).toString(16)
            }
            return e
        }
    }, {}],
    122: [function (e, t, i) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var r = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var n = t[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function (t, i, n) {
                    return i && e(t.prototype, i), n && e(t, n), t
                }
            }(),
            s = 1e-5,
            o = Math.abs,
            a = 5,
            c = function () {
                function e(t, i, r, s) {
                    n(this, e), this.cp = new Float32Array(6), this.cp[0] = 3 * t, this.cp[1] = 3 * (r - t) - this.cp[0], this.cp[2] = 1 - this.cp[0] - this.cp[1], this.cp[3] = 3 * i, this.cp[4] = 3 * (s - i) - this.cp[3], this.cp[5] = 1 - this.cp[3] - this.cp[4]
                }
                return r(e, [{
                    key: "sampleCurveX",
                    value: function (e) {
                        return ((this.cp[2] * e + this.cp[1]) * e + this.cp[0]) * e
                    }
                }, {
                    key: "sampleCurveY",
                    value: function (e) {
                        return ((this.cp[5] * e + this.cp[4]) * e + this.cp[3]) * e
                    }
                }, {
                    key: "sampleCurveDerivativeX",
                    value: function (e) {
                        return (3 * this.cp[2] * e + 2 * this.cp[1]) * e + this.cp[0]
                    }
                }, {
                    key: "solveCurveX",
                    value: function (e) {
                        var t, i, n, r, c, l;
                        for (n = e, l = 0; l < a; l++) {
                            if (r = this.sampleCurveX(n) - e, o(r) < s) return n;
                            if (c = this.sampleCurveDerivativeX(n), o(c) < s) break;
                            n -= r / c
                        }
                        if (t = 0, i = 1, n = e, n < t) return t;
                        if (n > i) return i;
                        for (; t < i;) {
                            if (r = this.sampleCurveX(n), o(r - e) < s) return n;
                            e > r ? t = n : i = n, n = .5 * (i - t) + t
                        }
                        return n
                    }
                }, {
                    key: "solve",
                    value: function (e) {
                        return this.sampleCurveY(this.solveCurveX(e))
                    }
                }]), e
            }(),
            l = /\d*\.?\d+/g;
        c.fromCSSString = function (e) {
            var t = e.match(l);
            if (4 !== t.length) throw "UnitBezier could not convert " + e + " to cubic-bezier";
            var i = t.map(Number),
                n = new c(i[0], i[1], i[2], i[3]);
            return n.solve.bind(n)
        }, t.exports = c
    }, {}],
    123: [function (e, t, i) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                return typeof e
            } : function (e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            s = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var n = t[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function (t, i, n) {
                    return i && e(t.prototype, i), n && e(t, n), t
                }
            }(),
            o = e("./Interpreter"),
            a = new(e("../Model/ElementMetricsLookup")),
            c = function () {
                function e(t) {
                    n(this, e), this.group = t, this.data = {
                        target: null,
                        anchors: null,
                        metrics: this.group.metrics
                    }
                }
                return s(e, [{
                    key: "parseArray",
                    value: function (e, t) {
                        return [this.parseExpression(e, t[0]), this.parseExpression(e, t[1])]
                    }
                }, {
                    key: "parseExpression",
                    value: function (t, i) {
                        if (!i) return null;
                        if ("number" == typeof i) return i;
                        if ("string" != typeof i) throw "Expression must be a string, received " + ("undefined" == typeof i ? "undefined" : r(i));
                        return this.data.target = t.controller.element, this.data.anchors = t.anchors, this.data.keyframe = t.keyframe, e._parse(i, this.data)
                    }
                }, {
                    key: "parseTimeValue",
                    value: function (e, t) {
                        if ("number" == typeof t) return t;
                        var i = this.group.expressionParser.parseExpression(e, t);
                        return this.group.convertScrollPositionToTValue(i)
                    }
                }, {
                    key: "destroy",
                    value: function () {
                        this.group = null
                    }
                }], [{
                    key: "parse",
                    value: function (t, i) {
                        return i = i || {}, i && (a.clear(), i.target && a.add(i.target), i.anchors && i.anchors.forEach(function (e) {
                            return a.add(e)
                        })), i.metrics = a, e._parse(t, i)
                    }
                }, {
                    key: "_parse",
                    value: function (e, t) {
                        return o.Parse(e).execute(t)
                    }
                }]), e
            }();
        c.programs = o.programs, window.ExpressionParser = c, t.exports = c
    }, {
        "../Model/ElementMetricsLookup": 119,
        "./Interpreter": 124
    }],
    124: [function (e, t, i) {
        "use strict";

        function n(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function r(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        function s(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var o = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var n = t[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function (t, i, n) {
                    return i && e(t.prototype, i), n && e(t, n), t
                }
            }(),
            a = e("../Model/AnimSystemModel"),
            c = e("@marcom/sm-math-utils"),
            l = {},
            u = {
                smoothstep: function (e, t, i) {
                    return i = u.clamp((i - e) / (t - e), 0, 1), i * i * (3 - 2 * i)
                },
                deg: function (e) {
                    return 180 * e / Math.PI
                },
                rad: function (e) {
                    return e * Math.PI / 180
                },
                random: function (e, t) {
                    return Math.random() * (t - e) + e
                },
                atan: Math.atan2
            };
        Object.getOwnPropertyNames(Math).forEach(function (e) {
            return u[e] ? null : u[e.toLowerCase()] = Math[e]
        }), Object.getOwnPropertyNames(c).forEach(function (e) {
            return u[e] ? null : u[e.toLowerCase()] = c[e]
        });
        var h = null,
            m = {
                ANCHOR_CONST: "a",
                ALPHA: "ALPHA",
                LPAREN: "(",
                RPAREN: ")",
                PLUS: "PLUS",
                MINUS: "MINUS",
                MUL: "MUL",
                DIV: "DIV",
                INTEGER_CONST: "INTEGER_CONST",
                FLOAT_CONST: "FLOAT_CONST",
                COMMA: ",",
                EOF: "EOF"
            },
            d = {
                NUMBERS: /\d|\d\.\d/,
                DIGIT: /\d/,
                OPERATOR: /[-+*\/]/,
                PAREN: /[()]/,
                WHITE_SPACE: /\s/,
                ALPHA: /[a-zA-Z]|%/,
                ALPHANUMERIC: /[a-zA-Z0-9]/,
                OBJECT_UNIT: /^(t|l|b|r|%w|%h|%|h|w)$/,
                GLOBAL_METRICS_UNIT: /^(px|vh|vw)$/,
                ANY_UNIT: /^(t|l|b|r|%w|%h|%|h|w|px|vh|vw)$/,
                MATH_FUNCTION: new RegExp("\\b(" + Object.keys(u).join("|") + ")\\b", "i")
            },
            f = {
                round: 1,
                clamp: 3,
                lerp: 3,
                random: 2,
                atan: 2,
                floor: 1,
                ceil: 1,
                abs: 1,
                cos: 1,
                sin: 1,
                smoothstep: 3,
                rad: 1,
                deg: 1,
                pow: 2,
                calc: 1
            },
            p = function O(e, t) {
                s(this, O), this.type = e, this.value = t
            };
        p.ONE = new p("100", 100), p.EOF = new p(m.EOF, null);
        var v = function C(e) {
                s(this, C), this.type = e
            },
            y = function (e) {
                function t(e, i) {
                    s(this, t);
                    var r = n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, "UnaryOp"));
                    return r.token = r.op = e, r.expr = i, r
                }
                return r(t, e), t
            }(v),
            _ = function (e) {
                function t(e, i, r) {
                    s(this, t);
                    var o = n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, "BinOp"));
                    return o.left = e, o.op = i, o.right = r, o
                }
                return r(t, e), t
            }(v),
            b = function (e) {
                function t(e, i) {
                    s(this, t);
                    var r = n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, "MathOp"));
                    if (r.op = e, r.list = i, f[e.value] && i.length !== f[e.value]) throw new Error("Incorrect number of arguments for '" + e.value + "'. Received " + i.length + ", expected " + f[e.value]);
                    return r
                }
                return r(t, e), t
            }(v),
            g = function (e) {
                function t(e) {
                    s(this, t);
                    var i = n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, "Num"));
                    return i.token = e, i.value = e.value, i
                }
                return r(t, e), t
            }(v),
            E = (function (e) {
                function t(e) {
                    s(this, t);
                    var i = n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, "Unit"));
                    return i.token = e, i.value = e.value, i
                }
                return r(t, e), t
            }(v), function (e) {
                function t(e, i, r) {
                    s(this, t);
                    var o = n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, "RefValue"));
                    return o.num = e, o.ref = i, o.unit = r, o
                }
                return r(t, e), t
            }(v)),
            w = function (e) {
                function t(e, i) {
                    s(this, t);
                    var r = n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, "CSSValue"));
                    return r.ref = e, r.propertyName = i, r
                }
                return r(t, e), t
            }(v),
            x = function (e) {
                function t(e, i) {
                    s(this, t);
                    var r = n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, "PropValue"));
                    return r.ref = e, r.propertyName = i, r
                }
                return r(t, e), t
            }(v),
            A = function () {
                function e(t) {
                    s(this, e), this.text = t, this.pos = 0, this["char"] = this.text[this.pos], this.tokens = [];
                    for (var i = void 0;
                        (i = this.getNextToken()) && i !== p.EOF;) this.tokens.push(i);
                    this.tokens.push(i)
                }
                return o(e, [{
                    key: "advance",
                    value: function () {
                        this["char"] = this.text[++this.pos]
                    }
                }, {
                    key: "skipWhiteSpace",
                    value: function () {
                        for (; null != this["char"] && d.WHITE_SPACE.test(this["char"]);) this.advance()
                    }
                }, {
                    key: "name",
                    value: function () {
                        for (var e = ""; null != this["char"] && d.ALPHA.test(this["char"]);) e += this["char"], this.advance();
                        return new p(m.ALPHA, e)
                    }
                }, {
                    key: "number",
                    value: function () {
                        for (var e = ""; null != this["char"] && d.DIGIT.test(this["char"]);) e += this["char"], this.advance();
                        if (null != this["char"] && "." === this["char"]) {
                            for (e += this["char"], this.advance(); null != this["char"] && d.DIGIT.test(this["char"]);) e += this["char"], this.advance();
                            return new p(m.FLOAT_CONST, parseFloat(e))
                        }
                        return new p(m.INTEGER_CONST, parseInt(e))
                    }
                }, {
                    key: "getNextToken",
                    value: function () {
                        for (; null != this["char"];)
                            if (d.WHITE_SPACE.test(this["char"])) this.skipWhiteSpace();
                            else {
                                if (d.DIGIT.test(this["char"])) return this.number();
                                if ("," === this["char"]) return this.advance(), new p(m.COMMA, ",");
                                if (d.OPERATOR.test(this["char"])) {
                                    var e = "",
                                        t = this["char"];
                                    switch (t) {
                                        case "+":
                                            e = m.PLUS;
                                            break;
                                        case "-":
                                            e = m.MINUS;
                                            break;
                                        case "*":
                                            e = m.MUL;
                                            break;
                                        case "/":
                                            e = m.DIV
                                    }
                                    return this.advance(), new p(e, t)
                                }
                                if (d.PAREN.test(this["char"])) {
                                    var i = "",
                                        n = this["char"];
                                    switch (n) {
                                        case "(":
                                            i = m.LPAREN;
                                            break;
                                        case ")":
                                            i = m.RPAREN
                                    }
                                    return this.advance(), new p(i, n)
                                }
                                if (d.ALPHA.test(this["char"])) return this.name();
                                this.error("Unexpected character " + this["char"])
                            } return p.EOF
                    }
                }]), e
            }(),
            T = function () {
                function e(t) {
                    s(this, e), this.lexer = t, this.pos = 0
                }
                return o(e, [{
                    key: "error",
                    value: function t(e) {
                        var i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
                            n = this.lexer.text.slice(this.pos - 3, this.pos + 3),
                            t = new Error(e + ' in "' + this.lexer.text + '" near "' + n + '". ' + i + " ");
                        throw console.error(t.message, h ? h.keyframe || h.target : ""), t
                    }
                }, {
                    key: "consume",
                    value: function (e) {
                        var t = this.currentToken;
                        return t.type === e ? this.pos += 1 : this.error("Invalid token " + this.currentToken.value + ", expected " + e), t
                    }
                }, {
                    key: "consumeList",
                    value: function (e) {
                        e.includes(this.currentToken) ? this.pos += 1 : this.error("Invalid token " + this.currentToken.value + ", expected " + tokenType)
                    }
                }, {
                    key: "expr",
                    value: function () {
                        for (var e = this.term(); this.currentToken.type === m.PLUS || this.currentToken.type === m.MINUS;) {
                            var t = this.currentToken;
                            switch (t.value) {
                                case "+":
                                    this.consume(m.PLUS);
                                    break;
                                case "-":
                                    this.consume(m.MINUS)
                            }
                            e = new _(e, t, this.term())
                        }
                        return e
                    }
                }, {
                    key: "term",
                    value: function () {
                        for (var e = this.factor(); this.currentToken.type === m.MUL || this.currentToken.type === m.DIV;) {
                            var t = this.currentToken;
                            switch (t.value) {
                                case "*":
                                    this.consume(m.MUL);
                                    break;
                                case "/":
                                    this.consume(m.DIV)
                            }
                            e = new _(e, t, this.factor())
                        }
                        return e
                    }
                }, {
                    key: "factor",
                    value: function () {
                        if (this.currentToken.type === m.PLUS) return new y(this.consume(m.PLUS), this.factor());
                        if (this.currentToken.type === m.MINUS) return new y(this.consume(m.MINUS), this.factor());
                        if (this.currentToken.type === m.INTEGER_CONST || this.currentToken.type === m.FLOAT_CONST) {
                            var e = new g(this.currentToken);
                            if (this.pos += 1, d.OPERATOR.test(this.currentToken.value) || this.currentToken.type === m.RPAREN || this.currentToken.type === m.COMMA || this.currentToken.type === m.EOF) return e;
                            if (this.currentToken.type === m.ALPHA && this.currentToken.value === m.ANCHOR_CONST) return this.consume(m.ALPHA), new E(e, this.anchorIndex(), this.unit(d.ANY_UNIT));
                            if (this.currentToken.type === m.ALPHA) return "%a" === this.currentToken.value && this.error("%a is invalid, try removing the %"), new E(e, null, this.unit());
                            this.error("Expected a scaling unit type", "Such as 'h' / 'w'")
                        } else {
                            if (d.OBJECT_UNIT.test(this.currentToken.value)) return new E(new g(p.ONE), null, this.unit());
                            if (this.currentToken.value === m.ANCHOR_CONST) {
                                this.consume(m.ALPHA);
                                var t = this.anchorIndex();
                                if (d.OBJECT_UNIT.test(this.currentToken.value)) return new E(new g(p.ONE), t, this.unit())
                            } else if (this.currentToken.type === m.ALPHA) {
                                if ("css" === this.currentToken.value || "prop" === this.currentToken.value) {
                                    var i = "css" === this.currentToken.value ? w : x;
                                    this.consume(m.ALPHA), this.consume(m.LPAREN);
                                    var n = this.propertyName(),
                                        r = null;
                                    return this.currentToken.type === m.COMMA && (this.consume(m.COMMA), this.consume(m.ALPHA), r = this.anchorIndex()), this.consume(m.RPAREN), new i(r, n)
                                }
                                if (d.MATH_FUNCTION.test(this.currentToken.value)) {
                                    var s = this.currentToken.value.toLowerCase();
                                    if ("number" == typeof u[s]) return this.consume(m.ALPHA), new g(new p(m.ALPHA, u[s]));
                                    var o = p[s] || new p(s, s),
                                        a = [];
                                    this.consume(m.ALPHA), this.consume(m.LPAREN);
                                    var c = null;
                                    do this.currentToken.value === m.COMMA && this.consume(m.COMMA), c = this.expr(), a.push(c); while (this.currentToken.value === m.COMMA);
                                    return this.consume(m.RPAREN), new b(o, a)
                                }
                            } else if (this.currentToken.type === m.LPAREN) {
                                this.consume(m.LPAREN);
                                var l = this.expr();
                                return this.consume(m.RPAREN), l
                            }
                        }
                        this.error("Unexpected token " + this.currentToken.value)
                    }
                }, {
                    key: "propertyName",
                    value: function () {
                        for (var e = ""; this.currentToken.type === m.ALPHA || this.currentToken.type === m.MINUS;) e += this.currentToken.value, this.pos += 1;
                        return e
                    }
                }, {
                    key: "unit",
                    value: function () {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : d.ANY_UNIT,
                            t = this.currentToken;
                        return t.type === m.ALPHA && e.test(t.value) ? (this.consume(m.ALPHA), new p(m.ALPHA, t.value = t.value.replace(/%(h|w)/, "$1").replace("%", "h"))) : void this.error("Expected unit type")
                    }
                }, {
                    key: "anchorIndex",
                    value: function () {
                        var e = this.currentToken;
                        return e.type === m.INTEGER_CONST ? (this.consume(m.INTEGER_CONST), new g(e)) : void this.error("Invalid anchor reference", ". Should be something like a0, a1, a2")
                    }
                }, {
                    key: "parse",
                    value: function () {
                        var e = this.expr();
                        return this.currentToken !== p.EOF && this.error("Unexpected token " + this.currentToken.value), e
                    }
                }, {
                    key: "currentToken",
                    get: function () {
                        return this.lexer.tokens[this.pos]
                    }
                }]), e
            }(),
            S = function () {
                function e(t) {
                    s(this, e), this.parser = t, this.root = t.parse()
                }
                return o(e, [{
                    key: "visit",
                    value: function (e) {
                        var t = this[e.type];
                        if (!t) throw new Error("No visit method named, " + t);
                        var i = t.call(this, e);
                        return i
                    }
                }, {
                    key: "BinOp",
                    value: function (e) {
                        switch (e.op.type) {
                            case m.PLUS:
                                return this.visit(e.left) + this.visit(e.right);
                            case m.MINUS:
                                return this.visit(e.left) - this.visit(e.right);
                            case m.MUL:
                                return this.visit(e.left) * this.visit(e.right);
                            case m.DIV:
                                return this.visit(e.left) / this.visit(e.right)
                        }
                    }
                }, {
                    key: "RefValue",
                    value: function (e) {
                        var t = this.unwrapReference(e),
                            i = e.unit.value,
                            n = e.num.value,
                            r = h.metrics.get(t);
                        switch (i) {
                            case "h":
                                return .01 * n * r.height;
                            case "t":
                                return .01 * n * r.top;
                            case "vh":
                                return .01 * n * a.pageMetrics.windowHeight;
                            case "vw":
                                return .01 * n * a.pageMetrics.windowWidth;
                            case "px":
                                return n;
                            case "w":
                                return .01 * n * r.width;
                            case "b":
                                return .01 * n * r.bottom;
                            case "l":
                                return .01 * n * r.left;
                            case "r":
                                return .01 * n * r.right
                        }
                    }
                }, {
                    key: "PropValue",
                    value: function (e) {
                        var t = null === e.ref ? h.target : h.anchors[e.ref.value];
                        return t[e.propertyName]
                    }
                }, {
                    key: "CSSValue",
                    value: function (t) {
                        var i = this.unwrapReference(t),
                            n = getComputedStyle(i).getPropertyValue(t.propertyName);
                        return "" === n ? 0 : e.Parse(n).execute(h)
                    }
                }, {
                    key: "Num",
                    value: function (e) {
                        return e.value
                    }
                }, {
                    key: "UnaryOp",
                    value: function (e) {
                        return e.op.type === m.PLUS ? +this.visit(e.expr) : e.op.type === m.MINUS ? -this.visit(e.expr) : void 0
                    }
                }, {
                    key: "MathOp",
                    value: function (e) {
                        var t = this,
                            i = e.list.map(function (e) {
                                return t.visit(e)
                            });
                        return u[e.op.value].apply(null, i)
                    }
                }, {
                    key: "unwrapReference",
                    value: function (e) {
                        return null === e.ref ? h.target : (e.ref.value >= h.anchors.length && console.error("Not enough anchors supplied for expression " + this.parser.lexer.text, h.target), h.anchors[e.ref.value])
                    }
                }, {
                    key: "execute",
                    value: function (e) {
                        return h = e, this.visit(this.root)
                    }
                }], [{
                    key: "Parse",
                    value: function (t) {
                        return l[t] || (l[t] = new e(new T(new A(t))))
                    }
                }]), e
            }();
        S.programs = l, t.exports = S
    }, {
        "../Model/AnimSystemModel": 117,
        "@marcom/sm-math-utils": 135
    }],
    125: [function (e, t, i) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function r(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function s(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var o = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var n = t[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function (t, i, n) {
                    return i && e(t.prototype, i), n && e(t, n), t
                }
            }(),
            a = function y(e, t, i) {
                null === e && (e = Function.prototype);
                var n = Object.getOwnPropertyDescriptor(e, t);
                if (void 0 === n) {
                    var r = Object.getPrototypeOf(e);
                    return null === r ? void 0 : y(r, t, i)
                }
                if ("value" in n) return n.value;
                var s = n.get;
                if (void 0 !== s) return s.call(i)
            },
            c = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            l = e("@marcom/sm-math-utils"),
            u = e("./utils/arrayToObject"),
            h = e("./Model/AnimSystemModel"),
            m = e("./Model/ElementMetricsLookup"),
            d = e("./Parsing/ExpressionParser"),
            f = e("./Keyframes/KeyframeController"),
            p = {
                create: e("@marcom/ac-raf-emitter/RAFEmitter"),
                update: e("@marcom/ac-raf-emitter/update"),
                draw: e("@marcom/ac-raf-emitter/draw")
            },
            v = function (e) {
                function t(e, i) {
                    n(this, t);
                    var s = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                    return s.anim = i, s.element = e, s.name = s.name || e.getAttribute("data-anim-scroll-group"), s.isEnabled = !0, s.position = new h.Progress, s.metrics = new m, s.metrics.add(s.element), s.expressionParser = new d(s), s.boundsMin = 0, s.boundsMax = 0, s.timelineUpdateRequired = !1, s._keyframesDirty = !1, s.viewableRange = s.createViewableRange(), s.defaultEase = h.KeyframeDefaults.ease, s.keyframeControllers = [], s.updateProgress(s.getPosition()), s.onDOMRead = s.onDOMRead.bind(s), s.onDOMWrite = s.onDOMWrite.bind(s), s.gui = null, s.finalizeInit(), s
                }
                return s(t, e), o(t, [{
                    key: "finalizeInit",
                    value: function () {
                        this.element._animInfo = new h.AnimInfo(this, null, (!0)), this.setupRAFEmitter()
                    }
                }, {
                    key: "destroy",
                    value: function () {
                        this.expressionParser.destroy(), this.expressionParser = null;
                        for (var e = 0, i = this.keyframeControllers.length; e < i; e++) this.keyframeControllers[e].destroy();
                        this.keyframeControllers = null, this.position = null, this.viewableRange = null, this.gui && (this.gui.destroy(), this.gui = null), this.metrics.destroy(), this.metrics = null, this.rafEmitter.destroy(), this.rafEmitter = null, this.anim = null, this.element._animInfo && this.element._animInfo.group === this && (this.element._animInfo.group = null, this.element._animInfo = null), this.element = null, this.isEnabled = !1, a(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "destroy", this).call(this)
                    }
                }, {
                    key: "removeKeyframeController",
                    value: function (e) {
                        var t = this;
                        if (!this.keyframeControllers.includes(e)) return Promise.resolve();
                        var i = e._allKeyframes;
                        return e._allKeyframes = [], this.keyframesDirty = !0, new Promise(function (n) {
                            p.draw(function () {
                                var r = t.keyframeControllers.indexOf(e);
                                return r === -1 ? void n() : (t.keyframeControllers.splice(r, 1), e.onDOMWrite(), i.forEach(function (e) {
                                    return e.destroy()
                                }), e.destroy(), t.gui && t.gui.create(), void n())
                            })
                        })
                    }
                }, {
                    key: "remove",
                    value: function () {
                        return this.anim.removeGroup(this)
                    }
                }, {
                    key: "setupRAFEmitter",
                    value: function (e) {
                        var t = this;
                        this.rafEmitter && this.rafEmitter.destroy(), this.rafEmitter = e || new p.create, this.rafEmitter.on("update", this.onDOMRead), this.rafEmitter.on("draw", this.onDOMWrite), this.rafEmitter.once("external", function () {
                            return t.reconcile()
                        })
                    }
                }, {
                    key: "requestDOMChange",
                    value: function () {
                        return !!this.isEnabled && this.rafEmitter.run()
                    }
                }, {
                    key: "onDOMRead",
                    value: function () {
                        this.keyframesDirty && this.onKeyframesDirty();
                        for (var e = 0, t = this.keyframeControllers.length; e < t; e++) this.keyframeControllers[e].onDOMRead(this.position)
                    }
                }, {
                    key: "onDOMWrite",
                    value: function () {
                        for (var e = 0, t = this.keyframeControllers.length; e < t; e++) this.keyframeControllers[e].onDOMWrite(this.position);
                        this.needsUpdate() && this.requestDOMChange()
                    }
                }, {
                    key: "needsUpdate",
                    value: function () {
                        if (this._keyframesDirty) return !0;
                        for (var e = 0, t = this.keyframeControllers.length; e < t; e++)
                            if (this.keyframeControllers[e].needsUpdate()) return !0;
                        return !1
                    }
                }, {
                    key: "addKeyframe",
                    value: function (e, t) {
                        var i = this.getControllerForTarget(e);
                        return null === i && (i = new f(this, e), this.keyframeControllers.push(i)), this.keyframesDirty = !0, i.addKeyframe(t)
                    }
                }, {
                    key: "forceUpdate",
                    value: function () {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                            t = e.waitForNextUpdate,
                            i = void 0 === t || t,
                            n = e.silent,
                            r = void 0 !== n && n;
                        this.isEnabled && (this.refreshMetrics(), this.timelineUpdateRequired = !0, i ? this.keyframesDirty = !0 : this.onKeyframesDirty({
                            silent: r
                        }))
                    }
                }, {
                    key: "onKeyframesDirty",
                    value: function () {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                            t = e.silent,
                            i = void 0 !== t && t;
                        this.determineActiveKeyframes(), this.keyframesDirty = !1, this.metrics.refreshMetrics(this.element), this.viewableRange = this.createViewableRange();
                        for (var n = 0, r = this.keyframeControllers.length; n < r; n++) this.keyframeControllers[n].updateAnimationConstraints();
                        this.updateBounds(), this.updateProgress(this.getPosition()), i || this._onScroll(), this.gui && this.gui.create()
                    }
                }, {
                    key: "refreshMetrics",
                    value: function () {
                        var e = new Set([this.element]);
                        this.keyframeControllers.forEach(function (t) {
                            e.add(t.element), t._allKeyframes.forEach(function (t) {
                                return t.anchors.forEach(function (t) {
                                    return e.add(t)
                                })
                            })
                        }), this.metrics.refreshCollection(e), this.viewableRange = this.createViewableRange()
                    }
                }, {
                    key: "reconcile",
                    value: function () {
                        for (var e = 0, t = this.keyframeControllers.length; e < t; e++) this.keyframeControllers[e].reconcile()
                    }
                }, {
                    key: "determineActiveKeyframes",
                    value: function (e) {
                        e = e || u(Array.from(document.documentElement.classList));
                        for (var t = 0, i = this.keyframeControllers.length; t < i; t++) this.keyframeControllers[t].determineActiveKeyframes(e)
                    }
                }, {
                    key: "updateBounds",
                    value: function () {
                        if (0 === this.keyframeControllers.length) return this.boundsMin = 0, void(this.boundsMax = 0);
                        for (var e = {
                                min: Number.POSITIVE_INFINITY,
                                max: Number.NEGATIVE_INFINITY
                            }, t = 0, i = this.keyframeControllers.length; t < i; t++) this.keyframeControllers[t].getBounds(e);
                        var n = this.convertTValueToScrollPosition(e.min),
                            r = this.convertTValueToScrollPosition(e.max);
                        r - n < h.pageMetrics.windowHeight ? (e.min = this.convertScrollPositionToTValue(n - .5 * h.pageMetrics.windowHeight), e.max = this.convertScrollPositionToTValue(r + .5 * h.pageMetrics.windowHeight)) : (e.min -= .001, e.max += .001), this.boundsMin = e.min, this.boundsMax = e.max, this.timelineUpdateRequired = !0
                    }
                }, {
                    key: "createViewableRange",
                    value: function () {
                        return new h.ViewableRange(this.metrics.get(this.element), h.pageMetrics.windowHeight)
                    }
                }, {
                    key: "_onBreakpointChange",
                    value: function (e, t) {
                        this.keyframesDirty = !0, this.determineActiveKeyframes()
                    }
                }, {
                    key: "updateProgress",
                    value: function (e) {
                        return this.hasDuration() ? (this.position.localUnclamped = (e - this.viewableRange.a) / (this.viewableRange.d - this.viewableRange.a), void(this.position.local = l.clamp(this.position.localUnclamped, this.boundsMin, this.boundsMax))) : void(this.position.local = this.position.localUnclamped = 0)
                    }
                }, {
                    key: "performTimelineDispatch",
                    value: function () {
                        for (var e = 0, t = this.keyframeControllers.length; e < t; e++) this.keyframeControllers[e].updateLocalProgress(this.position.local);
                        this.trigger(h.EVENTS.ON_TIMELINE_UPDATE, this.position.local), this.timelineUpdateRequired = !1, this.position.lastPosition !== this.position.local && (this.position.lastPosition <= this.boundsMin && this.position.localUnclamped > this.boundsMin ? this.trigger(h.EVENTS.ON_TIMELINE_START, this) : this.position.lastPosition >= this.boundsMin && this.position.localUnclamped < this.boundsMin ? this.trigger(h.EVENTS.ON_TIMELINE_START + ":reverse", this) : this.position.lastPosition <= this.boundsMax && this.position.localUnclamped >= this.boundsMax ? this.trigger(h.EVENTS.ON_TIMELINE_COMPLETE, this) : this.position.lastPosition >= this.boundsMax && this.position.localUnclamped < this.boundsMax && this.trigger(h.EVENTS.ON_TIMELINE_COMPLETE + ":reverse", this)), null !== this.gui && this.gui.onScrollUpdate(this.position)
                    }
                }, {
                    key: "_onScroll",
                    value: function (e) {
                        if (!this.isEnabled) return !1;
                        void 0 === e && (e = this.getPosition()), this.updateProgress(e);
                        var t = this.position.lastPosition === this.boundsMin || this.position.lastPosition === this.boundsMax,
                            i = this.position.localUnclamped === this.boundsMin || this.position.localUnclamped === this.boundsMax;
                        if (!this.timelineUpdateRequired && t && i && this.position.lastPosition === e) return void(this.position.local = this.position.localUnclamped);
                        if (this.timelineUpdateRequired || this.position.localUnclamped > this.boundsMin && this.position.localUnclamped < this.boundsMax) return this.performTimelineDispatch(), this.requestDOMChange(), void(this.position.lastPosition = this.position.localUnclamped);
                        var n = this.position.lastPosition > this.boundsMin && this.position.lastPosition < this.boundsMax,
                            r = this.position.localUnclamped <= this.boundsMin || this.position.localUnclamped >= this.boundsMax;
                        if (n && r) return this.performTimelineDispatch(), this.requestDOMChange(), void(this.position.lastPosition = this.position.localUnclamped);
                        var s = this.position.lastPosition < this.boundsMin && this.position.localUnclamped > this.boundsMax,
                            o = this.position.lastPosition > this.boundsMax && this.position.localUnclamped < this.boundsMax;
                        (s || o) && (this.performTimelineDispatch(), this.requestDOMChange(), this.position.lastPosition = this.position.localUnclamped), null !== this.gui && this.gui.onScrollUpdate(this.position)
                    }
                }, {
                    key: "convertScrollPositionToTValue",
                    value: function (e) {
                        return this.hasDuration() ? l.map(e, this.viewableRange.a, this.viewableRange.d, 0, 1) : 0
                    }
                }, {
                    key: "convertTValueToScrollPosition",
                    value: function (e) {
                        return this.hasDuration() ? l.map(e, 0, 1, this.viewableRange.a, this.viewableRange.d) : 0
                    }
                }, {
                    key: "hasDuration",
                    value: function () {
                        return this.viewableRange.a !== this.viewableRange.d
                    }
                }, {
                    key: "getPosition",
                    value: function () {
                        return h.pageMetrics.scrollY
                    }
                }, {
                    key: "getControllerForTarget",
                    value: function (e) {
                        if (!e._animInfo || !e._animInfo.controllers) return null;
                        if (e._animInfo.controller && e._animInfo.controller.group === this) return e._animInfo.controller;
                        for (var t = e._animInfo.controllers, i = 0, n = t.length; i < n; i++)
                            if (t[i].group === this) return t[i];
                        return null
                    }
                }, {
                    key: "trigger",
                    value: function (e, t) {
                        if ("undefined" != typeof this._events[e])
                            for (var i = this._events[e].length - 1; i >= 0; i--) void 0 !== t ? this._events[e][i](t) : this._events[e][i]()
                    }
                }, {
                    key: "keyframesDirty",
                    set: function (e) {
                        this._keyframesDirty = e, this._keyframesDirty && this.requestDOMChange()
                    },
                    get: function () {
                        return this._keyframesDirty
                    }
                }]), t
            }(c);
        t.exports = v
    }, {
        "./Keyframes/KeyframeController": 115,
        "./Model/AnimSystemModel": 117,
        "./Model/ElementMetricsLookup": 119,
        "./Parsing/ExpressionParser": 123,
        "./utils/arrayToObject": 127,
        "@marcom/ac-event-emitter-micro": 37,
        "@marcom/ac-raf-emitter/RAFEmitter": 98,
        "@marcom/ac-raf-emitter/draw": 104,
        "@marcom/ac-raf-emitter/update": 108,
        "@marcom/sm-math-utils": 135
    }],
    126: [function (e, t, i) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function r(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function s(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var o = function () {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var n = t[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function (t, i, n) {
                    return i && e(t.prototype, i), n && e(t, n), t
                }
            }(),
            a = function d(e, t, i) {
                null === e && (e = Function.prototype);
                var n = Object.getOwnPropertyDescriptor(e, t);
                if (void 0 === n) {
                    var r = Object.getPrototypeOf(e);
                    return null === r ? void 0 : d(r, t, i)
                }
                if ("value" in n) return n.value;
                var s = n.get;
                if (void 0 !== s) return s.call(i)
            },
            c = e("./ScrollGroup"),
            l = e("@marcom/sm-math-utils"),
            u = 0,
            h = {
                create: e("@marcom/ac-raf-emitter/RAFEmitter")
            },
            m = function (e) {
                function t(e, i) {
                    n(this, t), e || (e = document.createElement("div"), e.className = "TimeGroup-" + u++);
                    var s = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, i));
                    return s.name = s.name || e.getAttribute("data-anim-time-group"), s._isPaused = !0, s._repeats = 0, s._isReversed = !1, s._timeScale = 1, s
                }
                return s(t, e), o(t, [{
                    key: "finalizeInit",
                    value: function () {
                        if (!this.anim) throw "TimeGroup not instantiated correctly. Please use `AnimSystem.createTimeGroup(el)`";
                        this.defaultEase = 1, this.onPlayTimeUpdate = this.onPlayTimeUpdate.bind(this), a(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "finalizeInit", this).call(this)
                    }
                }, {
                    key: "progress",
                    value: function (e) {
                        if (void 0 === e) return 0 === this.boundsMax ? 0 : this.position.local / this.boundsMax;
                        var t = e * this.boundsMax;
                        this.timelineUpdateRequired = !0, this._onScroll(t)
                    }
                }, {
                    key: "time",
                    value: function (e) {
                        return void 0 === e ? this.position.local : (e = l.clamp(e, this.boundsMin, this.boundsMax), this.timelineUpdateRequired = !0, void this._onScroll(e))
                    }
                }, {
                    key: "play",
                    value: function (e) {
                        this.reversed(!1), this.isEnabled = !0, this._isPaused = !1, this.time(e), this._playheadEmitter.run()
                    }
                }, {
                    key: "reverse",
                    value: function (e) {
                        this.reversed(!0), this.isEnabled = !0, this._isPaused = !1, this.time(e), this._playheadEmitter.run()
                    }
                }, {
                    key: "reversed",
                    value: function (e) {
                        return void 0 === e ? this._isReversed : void(this._isReversed = e)
                    }
                }, {
                    key: "restart",
                    value: function () {
                        this._isReversed ? (this.progress(1), this.reverse(this.time())) : (this.progress(0), this.play(this.time()))
                    }
                }, {
                    key: "pause",
                    value: function (e) {
                        this.time(e), this._isPaused = !0
                    }
                }, {
                    key: "paused",
                    value: function (e) {
                        return void 0 === e ? this._isPaused : (this._isPaused = e, this._isPaused || this.play(), this)
                    }
                }, {
                    key: "onPlayTimeUpdate",
                    value: function (e) {
                        if (!this._isPaused) {
                            var i = l.clamp(e.delta / 1e3, 0, .5);
                            this._isReversed && (i = -i);
                            var n = this.time(),
                                r = n + i * this._timeScale;
                            if (this._repeats === t.REPEAT_FOREVER || this._repeats > 0) {
                                var s = !1;
                                !this._isReversed && r > this.boundsMax ? (r -= this.boundsMax, s = !0) : this._isReversed && r < 0 && (r = this.boundsMax + r, s = !0), s && (this._repeats = this._repeats === t.REPEAT_FOREVER ? t.REPEAT_FOREVER : this._repeats - 1)
                            }
                            this.time(r);
                            var o = !this._isReversed && this.position.local !== this.duration,
                                a = this._isReversed && 0 !== this.position.local;
                            o || a ? this._playheadEmitter.run() : this.paused(!0)
                        }
                    }
                }, {
                    key: "updateProgress",
                    value: function (e) {
                        return this.hasDuration() ? (this.position.localUnclamped = e, void(this.position.local = l.clamp(this.position.localUnclamped, this.boundsMin, this.boundsMax))) : void(this.position.local = this.position.localUnclamped = 0)
                    }
                }, {
                    key: "updateBounds",
                    value: function () {
                        if (0 === this.keyframeControllers.length) return this.boundsMin = 0, void(this.boundsMax = 0);
                        for (var e = {
                                min: Number.POSITIVE_INFINITY,
                                max: Number.NEGATIVE_INFINITY
                            }, t = 0, i = this.keyframeControllers.length; t < i; t++) this.keyframeControllers[t].getBounds(e);
                        this.boundsMin = 0, this.boundsMax = e.max, this.viewableRange.a = this.viewableRange.b = 0, this.viewableRange.c = this.viewableRange.d = this.boundsMax, this.timelineUpdateRequired = !0
                    }
                }, {
                    key: "setupRAFEmitter",
                    value: function (e) {
                        this._playheadEmitter = new h.create, this._playheadEmitter.on("update", this.onPlayTimeUpdate), a(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "setupRAFEmitter", this).call(this, e)
                    }
                }, {
                    key: "timeScale",
                    value: function (e) {
                        return void 0 === e ? this._timeScale : (this._timeScale = e, this)
                    }
                }, {
                    key: "repeats",
                    value: function (e) {
                        return void 0 === e ? this._repeats : void(this._repeats = e)
                    }
                }, {
                    key: "getPosition",
                    value: function () {
                        return this.position.local
                    }
                }, {
                    key: "convertScrollPositionToTValue",
                    value: function (e) {
                        return e
                    }
                }, {
                    key: "convertTValueToScrollPosition",
                    value: function (e) {
                        return e
                    }
                }, {
                    key: "hasDuration",
                    value: function () {
                        return this.duration > 0
                    }
                }, {
                    key: "destroy",
                    value: function () {
                        this._playheadEmitter.destroy(), this._playheadEmitter = null, a(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "destroy", this).call(this)
                    }
                }, {
                    key: "duration",
                    get: function () {
                        return this.keyframesDirty && this.onKeyframesDirty({
                            silent: !0
                        }), this.boundsMax
                    }
                }]), t
            }(c);
        m.REPEAT_FOREVER = -1, t.exports = m
    }, {
        "./ScrollGroup": 125,
        "@marcom/ac-raf-emitter/RAFEmitter": 98,
        "@marcom/sm-math-utils": 135
    }],
    127: [function (e, t, i) {
        "use strict";
        var n = function (e) {
            return e.reduce(function (e, t) {
                return e[t] = t, e
            }, {})
        };
        t.exports = n
    }, {}],
    128: [function (e, t, i) {
        "use strict";
        t.exports = function (e, t) {
            if ("string" != typeof e) return e;
            try {
                return (t || document).querySelector(e) || document.querySelector(e)
            } catch (i) {
                return !1
            }
        }
    }, {}],
    129: [function (e, t, i) {
        "use strict";
        var n = {
                create: e("gl-mat4/create"),
                invert: e("gl-mat4/invert"),
                clone: e("gl-mat4/clone"),
                transpose: e("gl-mat4/transpose")
            },
            r = {
                create: e("gl-vec3/create"),
                dot: e("gl-vec3/dot"),
                normalize: e("gl-vec3/normalize"),
                length: e("gl-vec3/length"),
                cross: e("gl-vec3/cross"),
                fromValues: e("gl-vec3/fromValues")
            },
            s = {
                create: e("gl-vec4/create"),
                transformMat4: e("gl-vec4/transformMat4"),
                fromValues: e("gl-vec4/fromValues")
            },
            o = (Math.PI / 180, 180 / Math.PI),
            a = 0,
            c = 1,
            l = 3,
            u = 4,
            h = 5,
            m = 7,
            d = 11,
            f = 12,
            p = 13,
            v = 15,
            y = function (e, t) {
                t = t || !1;
                for (var i = n.clone(e), a = r.create(), c = r.create(), u = r.create(), h = s.create(), f = s.create(), p = (r.create(), 0); p < 16; p++) i[p] /= i[v];
                var y = n.clone(i);
                y[l] = 0, y[m] = 0, y[d] = 0, y[v] = 1;
                var E = (i[3], i[7], i[11], i[12]),
                    w = i[13],
                    x = i[14],
                    A = (i[15], s.create());
                if (g(i[l]) && g(i[m]) && g(i[d])) h = s.fromValues(0, 0, 0, 1);
                else {
                    A[0] = i[l], A[1] = i[m], A[2] = i[d], A[3] = i[v];
                    var T = n.invert(n.create(), y),
                        S = n.transpose(n.create(), T);
                    h = s.transformMat4(h, A, S)
                }
                a[0] = E, a[1] = w, a[2] = x;
                var O = [r.create(), r.create(), r.create()];
                O[0][0] = i[0], O[0][1] = i[1], O[0][2] = i[2], O[1][0] = i[4], O[1][1] = i[5], O[1][2] = i[6], O[2][0] = i[8], O[2][1] = i[9], O[2][2] = i[10], c[0] = r.length(O[0]), r.normalize(O[0], O[0]), u[0] = r.dot(O[0], O[1]), O[1] = _(O[1], O[0], 1, -u[0]), c[1] = r.length(O[1]), r.normalize(O[1], O[1]), u[0] /= c[1], u[1] = r.dot(O[0], O[2]), O[2] = _(O[2], O[0], 1, -u[1]), u[2] = r.dot(O[1], O[2]), O[2] = _(O[2], O[1], 1, -u[2]), c[2] = r.length(O[2]), r.normalize(O[2], O[2]), u[1] /= c[2], u[2] /= c[2];
                var C = r.cross(r.create(), O[1], O[2]);
                if (r.dot(O[0], C) < 0)
                    for (p = 0; p < 3; p++) c[p] *= -1, O[p][0] *= -1, O[p][1] *= -1, O[p][2] *= -1;
                f[0] = .5 * Math.sqrt(Math.max(1 + O[0][0] - O[1][1] - O[2][2], 0)), f[1] = .5 * Math.sqrt(Math.max(1 - O[0][0] + O[1][1] - O[2][2], 0)), f[2] = .5 * Math.sqrt(Math.max(1 - O[0][0] - O[1][1] + O[2][2], 0)), f[3] = .5 * Math.sqrt(Math.max(1 + O[0][0] + O[1][1] + O[2][2], 0)), O[2][1] > O[1][2] && (f[0] = -f[0]), O[0][2] > O[2][0] && (f[1] = -f[1]), O[1][0] > O[0][1] && (f[2] = -f[2]);
                var M = s.fromValues(f[0], f[1], f[2], 2 * Math.acos(f[3])),
                    F = b(f);
                return t && (u[0] = Math.round(u[0] * o * 100) / 100, u[1] = Math.round(u[1] * o * 100) / 100, u[2] = Math.round(u[2] * o * 100) / 100, F[0] = Math.round(F[0] * o * 100) / 100, F[1] = Math.round(F[1] * o * 100) / 100, F[2] = Math.round(F[2] * o * 100) / 100, M[3] = Math.round(M[3] * o * 100) / 100), {
                    translation: a,
                    scale: c,
                    skew: u,
                    perspective: h,
                    quaternion: f,
                    eulerRotation: F,
                    axisAngle: M
                }
            },
            _ = function (e, t, i, n) {
                var s = r.create();
                return s[0] = i * e[0] + n * t[0], s[1] = i * e[1] + n * t[1], s[2] = i * e[2] + n * t[2], s
            },
            b = function (e) {
                var t, i, n, s = e[3] * e[3],
                    o = e[0] * e[0],
                    a = e[1] * e[1],
                    c = e[2] * e[2],
                    l = o + a + c + s,
                    u = e[0] * e[1] + e[2] * e[3];
                return u > .499 * l ? (i = 2 * Math.atan2(e[0], e[3]), n = Math.PI / 2, t = 0, r.fromValues(t, i, n)) : u < -.499 * l ? (i = -2 * Math.atan2(e[0], e[3]), n = -Math.PI / 2, t = 0, r.fromValues(t, i, n)) : (i = Math.atan2(2 * e[1] * e[3] - 2 * e[0] * e[2], o - a - c + s), n = Math.asin(2 * u / l), t = Math.atan2(2 * e[0] * e[3] - 2 * e[1] * e[2], -o + a - c + s), r.fromValues(t, i, n))
            },
            g = function (e) {
                return Math.abs(e) < 1e-4
            },
            E = function (e) {
                var t = String(getComputedStyle(e).transform).trim(),
                    i = n.create();
                if ("none" === t || "" === t) return i;
                var r, s, o = t.slice(0, t.indexOf("("));
                if ("matrix3d" === o)
                    for (r = t.slice(9, -1).split(","), s = 0; s < r.length; s++) i[s] = parseFloat(r[s]);
                else {
                    if ("matrix" !== o) throw new TypeError("Invalid Matrix Value");
                    for (r = t.slice(7, -1).split(","), s = r.length; s--;) r[s] = parseFloat(r[s]);
                    i[a] = r[0], i[c] = r[1], i[f] = r[4], i[u] = r[2], i[h] = r[3], i[p] = r[5]
                }
                return i
            };
        t.exports = function (e, t) {
            var i = E(e);
            return y(i, t)
        }
    }, {
        "gl-mat4/clone": 151,
        "gl-mat4/create": 152,
        "gl-mat4/invert": 153,
        "gl-mat4/transpose": 158,
        "gl-vec3/create": 159,
        "gl-vec3/cross": 160,
        "gl-vec3/dot": 161,
        "gl-vec3/fromValues": 162,
        "gl-vec3/length": 163,
        "gl-vec3/normalize": 164,
        "gl-vec4/create": 165,
        "gl-vec4/fromValues": 166,
        "gl-vec4/transformMat4": 167
    }],
    130: [function (e, t, i) {
        "use strict";
        t.exports = {
            getWindow: function () {
                return window
            },
            getDocument: function () {
                return document
            },
            getNavigator: function () {
                return navigator
            }
        }
    }, {}],
    131: [function (e, t, i) {
        "use strict";

        function n() {
            var e = o.getWindow();
            return !s() && !e.orientation || r.windows
        }
        var r = e("@marcom/useragent-detect").os,
            s = e("./touchAvailable").original,
            o = e("./helpers/globals"),
            a = e("@marcom/function-utils/once");
        t.exports = a(n), t.exports.original = n
    }, {
        "./helpers/globals": 130,
        "./touchAvailable": 133,
        "@marcom/function-utils/once": 134,
        "@marcom/useragent-detect": 139
    }],
    132: [function (e, t, i) {
        "use strict";

        function n() {
            var e = s.getWindow(),
                t = e.screen.width;
            return e.orientation && e.screen.height < t && (t = e.screen.height), !r() && t >= a
        }
        var r = e("./isDesktop").original,
            s = e("./helpers/globals"),
            o = e("@marcom/function-utils/once"),
            a = 600;
        t.exports = o(n), t.exports.original = n
    }, {
        "./helpers/globals": 130,
        "./isDesktop": 131,
        "@marcom/function-utils/once": 134
    }],
    133: [function (e, t, i) {
        "use strict";

        function n() {
            var e = r.getWindow(),
                t = r.getDocument(),
                i = r.getNavigator();
            return !!("ontouchstart" in e || e.DocumentTouch && t instanceof e.DocumentTouch || i.maxTouchPoints > 0 || i.msMaxTouchPoints > 0)
        }
        var r = e("./helpers/globals"),
            s = e("@marcom/function-utils/once");
        t.exports = s(n), t.exports.original = n
    }, {
        "./helpers/globals": 130,
        "@marcom/function-utils/once": 134
    }],
    134: [function (e, t, i) {
        "use strict";
        t.exports = function (e) {
            var t;
            return function () {
                return "undefined" == typeof t && (t = e.apply(this, arguments)), t
            }
        }
    }, {}],
    135: [function (e, t, i) {
        "use strict";
        t.exports = {
            lerp: function (e, t, i) {
                return t + (i - t) * e
            },
            map: function (e, t, i, n, r) {
                return n + (r - n) * (e - t) / (i - t)
            },
            mapClamp: function (e, t, i, n, r) {
                var s = n + (r - n) * (e - t) / (i - t);
                return Math.max(n, Math.min(r, s))
            },
            norm: function (e, t, i) {
                return (e - t) / (i - t)
            },
            clamp: function (e, t, i) {
                return Math.max(t, Math.min(i, e))
            },
            randFloat: function (e, t) {
                return Math.random() * (t - e) + e
            },
            randInt: function (e, t) {
                return Math.floor(Math.random() * (t - e) + e)
            }
        }
    }, {}],
    136: [function (e, t, i) {
        "use strict";
        t.exports = {
            browser: {
                safari: !1,
                chrome: !1,
                firefox: !1,
                ie: !1,
                opera: !1,
                android: !1,
                edge: !1,
                version: {
                    string: "",
                    major: 0,
                    minor: 0,
                    patch: 0,
                    documentMode: !1
                }
            },
            os: {
                osx: !1,
                ios: !1,
                android: !1,
                windows: !1,
                linux: !1,
                fireos: !1,
                chromeos: !1,
                version: {
                    string: "",
                    major: 0,
                    minor: 0,
                    patch: 0
                }
            }
        }
    }, {}],
    137: [function (e, t, i) {
        "use strict";
        t.exports = {
            browser: [{
                name: "edge",
                userAgent: "Edge",
                version: ["rv", "Edge"],
                test: function (e) {
                    return e.ua.indexOf("Edge") > -1 || "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" === e.ua
                }
            }, {
                name: "chrome",
                userAgent: "Chrome"
            }, {
                name: "firefox",
                test: function (e) {
                    return e.ua.indexOf("Firefox") > -1 && e.ua.indexOf("Opera") === -1
                },
                version: "Firefox"
            }, {
                name: "android",
                userAgent: "Android"
            }, {
                name: "safari",
                test: function (e) {
                    return e.ua.indexOf("Safari") > -1 && e.vendor.indexOf("Apple") > -1
                },
                version: "Version"
            }, {
                name: "ie",
                test: function (e) {
                    return e.ua.indexOf("IE") > -1 || e.ua.indexOf("Trident") > -1
                },
                version: ["MSIE", "rv"],
                parseDocumentMode: function () {
                    var e = !1;
                    return document.documentMode && (e = parseInt(document.documentMode, 10)), e
                }
            }, {
                name: "opera",
                userAgent: "Opera",
                version: ["Version", "Opera"]
            }],
            os: [{
                name: "windows",
                test: function (e) {
                    return e.ua.indexOf("Windows") > -1
                },
                version: "Windows NT"
            }, {
                name: "osx",
                userAgent: "Mac",
                test: function (e) {
                    return e.ua.indexOf("Macintosh") > -1
                }
            }, {
                name: "ios",
                test: function (e) {
                    return e.ua.indexOf("iPhone") > -1 || e.ua.indexOf("iPad") > -1
                },
                version: ["iPhone OS", "CPU OS"]
            }, {
                name: "linux",
                userAgent: "Linux",
                test: function (e) {
                    return (e.ua.indexOf("Linux") > -1 || e.platform.indexOf("Linux") > -1) && e.ua.indexOf("Android") === -1
                }
            }, {
                name: "fireos",
                test: function (e) {
                    return e.ua.indexOf("Firefox") > -1 && e.ua.indexOf("Mobile") > -1
                },
                version: "rv"
            }, {
                name: "android",
                userAgent: "Android",
                test: function (e) {
                    return e.ua.indexOf("Android") > -1
                }
            }, {
                name: "chromeos",
                userAgent: "CrOS"
            }]
        }
    }, {}],
    138: [function (e, t, i) {
        "use strict";

        function n(e) {
            return new RegExp(e + "[a-zA-Z\\s/:]+([0-9_.]+)", "i")
        }

        function r(e, t) {
            if ("function" == typeof e.parseVersion) return e.parseVersion(t);
            var i = e.version || e.userAgent;
            "string" == typeof i && (i = [i]);
            for (var r, s = i.length, o = 0; o < s; o++)
                if (r = t.match(n(i[o])), r && r.length > 1) return r[1].replace(/_/g, ".");
            return !1
        }

        function s(e, t, i) {
            for (var n, s, o = e.length, a = 0; a < o; a++)
                if ("function" == typeof e[a].test ? e[a].test(i) === !0 && (n = e[a].name) : i.ua.indexOf(e[a].userAgent) > -1 && (n = e[a].name), n) {
                    if (t[n] = !0, s = r(e[a], i.ua), "string" == typeof s) {
                        var c = s.split(".");
                        t.version.string = s, c && c.length > 0 && (t.version.major = parseInt(c[0] || 0), t.version.minor = parseInt(c[1] || 0), t.version.patch = parseInt(c[2] || 0))
                    } else "edge" === n && (t.version.string = "12.0.0", t.version.major = "12", t.version.minor = "0", t.version.patch = "0");
                    return "function" == typeof e[a].parseDocumentMode && (t.version.documentMode = e[a].parseDocumentMode()), t
                } return t
        }

        function o(e) {
            var t = {};
            return t.browser = s(c.browser, a.browser, e), t.os = s(c.os, a.os, e), t
        }
        var a = e("./defaults"),
            c = e("./dictionary");
        t.exports = o
    }, {
        "./defaults": 136,
        "./dictionary": 137
    }],
    139: [function (e, t, i) {
        "use strict";
        var n = {
            ua: window.navigator.userAgent,
            platform: window.navigator.platform,
            vendor: window.navigator.vendor
        };
        t.exports = e("./parseUserAgent")(n)
    }, {
        "./parseUserAgent": 138
    }],
    140: [function (e, t, i) {
        arguments[4][97][0].apply(i, arguments)
    }, {
        dup: 97
    }],
    141: [function (e, t, i) {
        arguments[4][98][0].apply(i, arguments)
    }, {
        "./sharedRAFEmitterIDGeneratorInstance": 146,
        "./sharedRAFExecutorInstance": 147,
        "@marcom/ac-event-emitter-micro": 37,
        dup: 98
    }],
    142: [function (e, t, i) {
        arguments[4][99][0].apply(i, arguments)
    }, {
        "@marcom/ac-event-emitter-micro/EventEmitterMicro": 38,
        dup: 99
    }],
    143: [function (e, t, i) {
        arguments[4][100][0].apply(i, arguments)
    }, {
        "./SingleCallRAFEmitter": 145,
        dup: 100
    }],
    144: [function (e, t, i) {
        arguments[4][101][0].apply(i, arguments)
    }, {
        "./RAFInterface": 143,
        dup: 101
    }],
    145: [function (e, t, i) {
        arguments[4][102][0].apply(i, arguments)
    }, {
        "./RAFEmitter": 141,
        dup: 102
    }],
    146: [function (e, t, i) {
        arguments[4][106][0].apply(i, arguments)
    }, {
        "../.release-info.js": 140,
        "@marcom/ac-shared-instance": 92,
        dup: 106
    }],
    147: [function (e, t, i) {
        arguments[4][107][0].apply(i, arguments)
    }, {
        "../.release-info.js": 140,
        "./RAFExecutor": 142,
        "@marcom/ac-shared-instance": 92,
        dup: 107
    }],
    148: [function (e, t, i) {
        arguments[4][108][0].apply(i, arguments)
    }, {
        "./RAFInterfaceController": 144,
        dup: 108
    }],
    149: [function (e, t, i) {
        "use strict";

        function n(e, t) {
            r.call(this), this._id = e || o.ID, this._options = Object.assign({}, o.OPTIONS, t), this._allowDOMEventDispatch = !1, this._allowElementStateData = !1, this._options.removeNamespace = "boolean" != typeof this._options.removeNamespace || this._options.removeNamespace, this._el = this._initViewportEl(this._id), this._resizing = !1, this._mediaQueryLists = {
                resolution: {
                    retina: window.matchMedia(l.RETINA)
                },
                orientation: {
                    portrait: window.matchMedia(l.PORTRAIT),
                    landscape: window.matchMedia(l.LANDSCAPE)
                }
            }, this._viewport = this._getViewport(this._options.removeNamespace), this._retina = this._getRetina(this._mediaQueryLists.resolution.retina), this._orientation = this._initOrientation(), this._addListeners(), this._updateElementStateData()
        }
        var r = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            s = e("@marcom/ac-raf-emitter/update"),
            o = {
                ID: "viewport-emitter",
                OPTIONS: {
                    removeNamespace: !0
                }
            },
            a = {
                DOM_DISPATCH: "data-viewport-emitter-dispatch",
                STATE: "data-viewport-emitter-state"
            },
            c = "::before",
            l = {
                RETINA: "only screen and (-webkit-min-device-pixel-ratio: 1.5), screen and (min-resolution: 1.5dppx), screen and (min-resolution: 144dpi)",
                PORTRAIT: "only screen and (orientation: portrait)",
                LANDSCAPE: "only screen and (orientation: landscape)"
            },
            u = {
                any: "change:any",
                orientation: "change:orientation",
                retina: "change:retina",
                viewport: "change:viewport"
            };
        Object.defineProperty(n, "DOM_DISPATCH_ATTRIBUTE", {
            get: function () {
                return a.DOM_DISPATCH
            }
        }), Object.defineProperty(n, "DOM_STATE_ATTRIBUTE", {
            get: function () {
                return a.STATE
            }
        });
        var h = n.prototype = Object.create(r.prototype);
        Object.defineProperty(h, "id", {
            get: function () {
                return this._id
            }
        }), Object.defineProperty(h, "element", {
            get: function () {
                return this._el
            }
        }), Object.defineProperty(h, "mediaQueryLists", {
            get: function () {
                return this._mediaQueryLists
            }
        }), Object.defineProperty(h, "viewport", {
            get: function () {
                return this._viewport
            }
        }), Object.defineProperty(h, "retina", {
            get: function () {
                return this._retina
            }
        }), Object.defineProperty(h, "orientation", {
            get: function () {
                return this._orientation
            }
        }), Object.defineProperty(h, "hasDomDispatch", {
            get: function () {
                return this._allowDOMEventDispatch
            }
        }), h.destroy = function () {
            this._removeListeners();
            for (var e in this._options) this._options[e] = null;
            for (var t in this._mediaQueryLists) {
                var i = this._mediaQueryLists[t];
                for (var n in i) i[n] = null
            }
            this._id = null, this._el = null, this._viewport = null, this._retina = null, this._orientation = null, r.prototype.destroy.call(this)
        }, h._initViewportEl = function (e) {
            var t = document.getElementById(e);
            return t || (t = document.createElement("div"), t.id = e, t = document.body.appendChild(t)), t.hasAttribute(a.DOM_DISPATCH) || (t.setAttribute(a.DOM_DISPATCH, ""), this._allowDOMEventDispatch = !0), t.hasAttribute(a.STATE) || (this._allowElementStateData = !0), t
        }, h._dispatch = function (e, t) {
            var i = {
                viewport: this._viewport,
                orientation: this._orientation,
                retina: this._retina
            };
            if (this._allowDOMEventDispatch) {
                var n = new CustomEvent(e, {
                        detail: t
                    }),
                    r = new CustomEvent(u.any, {
                        detail: i
                    });
                this._el.dispatchEvent(n), this._el.dispatchEvent(r)
            }
            this.trigger(e, t), this.trigger(u.any, i)
        }, h._addListeners = function () {
            this._onOrientationChange = this._onOrientationChange.bind(this), this._onRetinaChange = this._onRetinaChange.bind(this), this._onViewportChange = this._onViewportChange.bind(this), this._onViewportChangeUpdate = this._onViewportChangeUpdate.bind(this), this._mediaQueryLists.orientation.portrait.addListener(this._onOrientationChange), this._mediaQueryLists.orientation.landscape.addListener(this._onOrientationChange), this._mediaQueryLists.resolution.retina.addListener(this._onRetinaChange), window.addEventListener("resize", this._onViewportChange)
        }, h._removeListeners = function () {
            this._mediaQueryLists.orientation.portrait.removeListener(this._onOrientationChange), this._mediaQueryLists.orientation.landscape.removeListener(this._onOrientationChange), this._mediaQueryLists.resolution.retina.removeListener(this._onRetinaChange), window.removeEventListener("resize", this._onViewportChange)
        }, h._updateElementStateData = function () {
            if (this._allowElementStateData) {
                var e = JSON.stringify({
                    viewport: this._viewport,
                    orientation: this._orientation,
                    retina: this._retina
                });
                this._el.setAttribute(a.STATE, e)
            }
        }, h._getViewport = function (e) {
            var t = window.getComputedStyle(this._el, c).content;
            return t ? (t = t.replace(/["']/g, ""), e ? t.split(":").pop() : t) : null
        }, h._getRetina = function (e) {
            return e.matches
        }, h._getOrientation = function (e) {
            var t = this._orientation;
            if (e.matches) {
                var i = /portrait|landscape/;
                return e.media.match(i)[0]
            }
            return t
        }, h._initOrientation = function () {
            var e = this._getOrientation(this._mediaQueryLists.orientation.portrait);
            return e ? e : this._getOrientation(this._mediaQueryLists.orientation.landscape)
        }, h._onViewportChange = function () {
            this._resizing || (this._resizing = !0, s(this._onViewportChangeUpdate))
        }, h._onViewportChangeUpdate = function () {
            var e = this._viewport;
            if (this._viewport = this._getViewport(this._options.removeNamespace), e !== this._viewport) {
                var t = {
                    from: e,
                    to: this._viewport
                };
                this._updateElementStateData(), this._dispatch(u.viewport, t)
            }
            this._resizing = !1
        }, h._onRetinaChange = function (e) {
            var t = this._retina;
            if (this._retina = this._getRetina(e), t !== this._retina) {
                var i = {
                    from: t,
                    to: this._retina
                };
                this._updateElementStateData(), this._dispatch(u.retina, i)
            }
        }, h._onOrientationChange = function (e) {
            var t = this._orientation;
            if (this._orientation = this._getOrientation(e), t !== this._orientation) {
                var i = {
                    from: t,
                    to: this._orientation
                };
                this._updateElementStateData(), this._dispatch(u.orientation, i)
            }
        }, t.exports = n
    }, {
        "@marcom/ac-event-emitter-micro": 37,
        "@marcom/ac-raf-emitter/update": 148
    }],
    150: [function (e, t, i) {
        "use strict";
        var n = e("./ViewportEmitter");
        t.exports = new n
    }, {
        "./ViewportEmitter": 149
    }],
    151: [function (e, t, i) {
        function n(e) {
            var t = new Float32Array(16);
            return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t
        }
        t.exports = n
    }, {}],
    152: [function (e, t, i) {
        function n() {
            var e = new Float32Array(16);
            return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e
        }
        t.exports = n
    }, {}],
    153: [function (e, t, i) {
        function n(e, t) {
            var i = t[0],
                n = t[1],
                r = t[2],
                s = t[3],
                o = t[4],
                a = t[5],
                c = t[6],
                l = t[7],
                u = t[8],
                h = t[9],
                m = t[10],
                d = t[11],
                f = t[12],
                p = t[13],
                v = t[14],
                y = t[15],
                _ = i * a - n * o,
                b = i * c - r * o,
                g = i * l - s * o,
                E = n * c - r * a,
                w = n * l - s * a,
                x = r * l - s * c,
                A = u * p - h * f,
                T = u * v - m * f,
                S = u * y - d * f,
                O = h * v - m * p,
                C = h * y - d * p,
                M = m * y - d * v,
                F = _ * M - b * C + g * O + E * S - w * T + x * A;
            return F ? (F = 1 / F, e[0] = (a * M - c * C + l * O) * F, e[1] = (r * C - n * M - s * O) * F, e[2] = (p * x - v * w + y * E) * F, e[3] = (m * w - h * x - d * E) * F, e[4] = (c * S - o * M - l * T) * F, e[5] = (i * M - r * S + s * T) * F, e[6] = (v * g - f * x - y * b) * F, e[7] = (u * x - m * g + d * b) * F, e[8] = (o * C - a * S + l * A) * F, e[9] = (n * S - i * C - s * A) * F, e[10] = (f * w - p * g + y * _) * F, e[11] = (h * g - u * w - d * _) * F, e[12] = (a * T - o * O - c * A) * F, e[13] = (i * O - n * T + r * A) * F, e[14] = (p * b - f * E - v * _) * F, e[15] = (u * E - h * b + m * _) * F, e) : null
        }
        t.exports = n
    }, {}],
    154: [function (e, t, i) {
        function n(e, t, i) {
            var n = Math.sin(i),
                r = Math.cos(i),
                s = t[4],
                o = t[5],
                a = t[6],
                c = t[7],
                l = t[8],
                u = t[9],
                h = t[10],
                m = t[11];
            return t !== e && (e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15]), e[4] = s * r + l * n, e[5] = o * r + u * n, e[6] = a * r + h * n, e[7] = c * r + m * n, e[8] = l * r - s * n, e[9] = u * r - o * n, e[10] = h * r - a * n, e[11] = m * r - c * n, e
        }
        t.exports = n
    }, {}],
    155: [function (e, t, i) {
        function n(e, t, i) {
            var n = Math.sin(i),
                r = Math.cos(i),
                s = t[0],
                o = t[1],
                a = t[2],
                c = t[3],
                l = t[8],
                u = t[9],
                h = t[10],
                m = t[11];
            return t !== e && (e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15]), e[0] = s * r - l * n, e[1] = o * r - u * n, e[2] = a * r - h * n, e[3] = c * r - m * n, e[8] = s * n + l * r, e[9] = o * n + u * r, e[10] = a * n + h * r, e[11] = c * n + m * r, e
        }
        t.exports = n
    }, {}],
    156: [function (e, t, i) {
        function n(e, t, i) {
            var n = Math.sin(i),
                r = Math.cos(i),
                s = t[0],
                o = t[1],
                a = t[2],
                c = t[3],
                l = t[4],
                u = t[5],
                h = t[6],
                m = t[7];
            return t !== e && (e[8] = t[8], e[9] = t[9], e[10] = t[10], e[11] = t[11], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15]), e[0] = s * r + l * n, e[1] = o * r + u * n, e[2] = a * r + h * n, e[3] = c * r + m * n, e[4] = l * r - s * n, e[5] = u * r - o * n, e[6] = h * r - a * n, e[7] = m * r - c * n, e
        }
        t.exports = n
    }, {}],
    157: [function (e, t, i) {
        function n(e, t, i) {
            var n = i[0],
                r = i[1],
                s = i[2];
            return e[0] = t[0] * n, e[1] = t[1] * n, e[2] = t[2] * n, e[3] = t[3] * n, e[4] = t[4] * r, e[5] = t[5] * r, e[6] = t[6] * r, e[7] = t[7] * r, e[8] = t[8] * s, e[9] = t[9] * s, e[10] = t[10] * s, e[11] = t[11] * s, e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15], e
        }
        t.exports = n
    }, {}],
    158: [function (e, t, i) {
        function n(e, t) {
            if (e === t) {
                var i = t[1],
                    n = t[2],
                    r = t[3],
                    s = t[6],
                    o = t[7],
                    a = t[11];
                e[1] = t[4], e[2] = t[8], e[3] = t[12], e[4] = i, e[6] = t[9], e[7] = t[13], e[8] = n, e[9] = s, e[11] = t[14], e[12] = r, e[13] = o, e[14] = a
            } else e[0] = t[0], e[1] = t[4], e[2] = t[8], e[3] = t[12], e[4] = t[1], e[5] = t[5], e[6] = t[9], e[7] = t[13], e[8] = t[2], e[9] = t[6], e[10] = t[10], e[11] = t[14], e[12] = t[3], e[13] = t[7], e[14] = t[11], e[15] = t[15];
            return e
        }
        t.exports = n
    }, {}],
    159: [function (e, t, i) {
        function n() {
            var e = new Float32Array(3);
            return e[0] = 0, e[1] = 0, e[2] = 0, e
        }
        t.exports = n
    }, {}],
    160: [function (e, t, i) {
        function n(e, t, i) {
            var n = t[0],
                r = t[1],
                s = t[2],
                o = i[0],
                a = i[1],
                c = i[2];
            return e[0] = r * c - s * a, e[1] = s * o - n * c, e[2] = n * a - r * o, e
        }
        t.exports = n
    }, {}],
    161: [function (e, t, i) {
        function n(e, t) {
            return e[0] * t[0] + e[1] * t[1] + e[2] * t[2]
        }
        t.exports = n
    }, {}],
    162: [function (e, t, i) {
        function n(e, t, i) {
            var n = new Float32Array(3);
            return n[0] = e, n[1] = t, n[2] = i, n
        }
        t.exports = n
    }, {}],
    163: [function (e, t, i) {
        function n(e) {
            var t = e[0],
                i = e[1],
                n = e[2];
            return Math.sqrt(t * t + i * i + n * n)
        }
        t.exports = n
    }, {}],
    164: [function (e, t, i) {
        function n(e, t) {
            var i = t[0],
                n = t[1],
                r = t[2],
                s = i * i + n * n + r * r;
            return s > 0 && (s = 1 / Math.sqrt(s), e[0] = t[0] * s, e[1] = t[1] * s, e[2] = t[2] * s), e
        }
        t.exports = n
    }, {}],
    165: [function (e, t, i) {
        function n() {
            var e = new Float32Array(4);
            return e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 0, e
        }
        t.exports = n
    }, {}],
    166: [function (e, t, i) {
        function n(e, t, i, n) {
            var r = new Float32Array(4);
            return r[0] = e, r[1] = t, r[2] = i, r[3] = n, r
        }
        t.exports = n
    }, {}],
    167: [function (e, t, i) {
        function n(e, t, i) {
            var n = t[0],
                r = t[1],
                s = t[2],
                o = t[3];
            return e[0] = i[0] * n + i[4] * r + i[8] * s + i[12] * o, e[1] = i[1] * n + i[5] * r + i[9] * s + i[13] * o, e[2] = i[2] * n + i[6] * r + i[10] * s + i[14] * o, e[3] = i[3] * n + i[7] * r + i[11] * s + i[15] * o, e
        }
        t.exports = n
    }, {}],
    168: [function (e, t, i) {
        function n(e, t, i) {
            r.apply(this, arguments), this.IS_MOBILE = this.IS_MOBILE(), this.IS_REDUCED_MOTION = this.IS_REDUCED_MOTION(), this.canvasContainer = e.querySelector(".unit-canvas-container"), this.canvasWrappers = Array.from(e.querySelectorAll(".unit-canvas-wrapper:not(:first-child)")), this.tiles = Array.from(e.querySelectorAll(".unit-tile")), this.copyWrapper = e.querySelector(".unit-canvas-copy"), this.headlineText = Array.from(this.copyWrapper.querySelectorAll(".headline .headline-sliding-text")), this.hashTag = this.copyWrapper.querySelector(".tag"), this.ctaLinks = this.copyWrapper.querySelector(".cta-links"), this.learnMoreArrow = e.querySelector(".learn-more-arrow"), this.sheCreatesImg = e.querySelector(".unit-image-she-creates-she-creates"), this.initialize()
        }
        var r = e("@marcom/ac-homepage/BaseHomepageSection");
        const s = {
            create: e("@marcom/ac-raf-emitter/RAFEmitter"),
            update: e("@marcom/ac-raf-emitter/update"),
            draw: e("@marcom/ac-raf-emitter/draw")
        };
        var o = n.prototype = Object.create(r.prototype);
        o.destroy = function () {
            r.prototype.destroy.call(this)
        }, o.initialize = function () {
            if (this.IS_MOBILE) {
                var e = this.learnMoreArrow,
                    t = document.querySelector("[data-layout-name=behind-the-mac-takeover]"),
                    i = document.documentElement.querySelector("body");
                document.addEventListener("DOMContentLoaded", function () {
                    setTimeout(function () {
                        t = document.querySelector("[data-layout-name=behind-the-mac-takeover]"), t.style.overflow = "scroll"
                    }, 300)
                }), e.addEventListener("click", function (n) {
                    e.classList.toggle("up"), e.classList.contains("up") ? (this.IS_REDUCED_MOTION || (this.sheCreatesImg && (this.sheCreatesImg.style.opacity = "1"), i.style.transition = "ease-in-out 1s transform"), i.style.transform = "translateY(-90vh)", i.style.marginBottom = "-90vh", i.style.overflow = "auto", t.style.overflow = "visible", window.scrollTo(0, 0)) : (this.IS_REDUCED_MOTION || (this.sheCreatesImg && (this.sheCreatesImg.style.opacity = "0"), i.style.transition = "ease-in-out 1s transform"), i.style.transform = "translateY(0vh)", i.style.marginBottom = "0vh", setTimeout(function () {
                        t.style.overflow = "scroll"
                    }, 1e3), i.style.overflow = "hidden", window.scrollTo(0, 0))
                }.bind(this)), rafEmitter = new s.create, rafEmitter.on("draw", function (e) {
                    window.scrollTo(0, 0)
                }), setTimeout(function () {
                    rafEmitter.run()
                }, 300)
            } else this.sheCreatesImg && this.AnimSystem.addKeyframe(this.sheCreatesImg, {
                start: "t - 100vh + 50h",
                end: "t - 50vh + 50h",
                opacity: [0, 1],
                disabledWhen: "reduced-motion"
            });
            var n = this.AnimSystem.createTimeGroup(),
                r = 0;
            this.headlineText.forEach(function (e) {
                n.addKeyframe(e, {
                    start: r,
                    end: 1.7,
                    y: [100, -5],
                    ease: .3,
                    easeFunction: "easeOutCubic",
                    disabledWhen: "reduced-motion"
                }), r += .2
            }), n.addKeyframe(this.hashTag, {
                start: 1.2,
                end: 2,
                opacity: [0, 1],
                ease: .3,
                easeFunction: "easeOutCubic",
                disabledWhen: "reduced-motion"
            }), n.addKeyframe(this.ctaLinks, {
                start: 1.2,
                end: 2,
                opacity: [0, 1],
                ease: .3,
                easeFunction: "easeOutCubic",
                disabledWhen: "reduced-motion"
            }), n.addKeyframe(this.learnMoreArrow, {
                start: 1.2,
                end: 2,
                opacity: [0, 1],
                disabledWhen: "reduced-motion"
            });
            var o = 1.2;
            this.canvasWrappers.forEach(function (e) {
                n.addKeyframe(e, {
                    start: o,
                    end: o + .8,
                    opacity: [0, 1],
                    disabledWhen: "reduced-motion"
                }), o += .4
            }.bind(this)), n.play()
        }, o.IS_MOBILE = function () {
            return document.documentElement.classList.contains("touch")
        }, o.IS_REDUCED_MOTION = function () {
            return document.documentElement.classList.contains("reduced-motion")
        }, t.exports = n
    }, {
        "@marcom/ac-homepage/BaseHomepageSection": 41,
        "@marcom/ac-raf-emitter/RAFEmitter": 79,
        "@marcom/ac-raf-emitter/draw": 87,
        "@marcom/ac-raf-emitter/update": 89
    }],
    169: [function (e, t, i) {
        function n() {
            document.documentElement.classList.add("position-mode"), h = p, m = this.sectionObj.viewportEmitter, d = "xlarge" === m.viewport || "large" === m.viewport ? "large" : "medium" === m.viewport ? medium : "small", f = this._setPosition, s(this.section, h), a(this.section, d), u(this.section, v), this.tiles.forEach(function (e, t) {
                r(e.closest(".unit-canvas-container"), e, t), l(e, t)
            }.bind(this)), this.sectionObj.viewportEmitter.on("change:viewport", function () {
                m = this.sectionObj.viewportEmitter, d = this.sectionObj.viewportEmitter.viewport, c()
            }.bind(this))
        }

        function r(e, t, i) {
            function n(e) {
                f = e.clientX - y, v = e.clientY - _, e.target === t && (c = !0)
            }

            function r(e) {
                f = l, v = u, c = !1
            }

            function s(e) {
                c && (e.preventDefault(), l = e.clientX - f, u = e.clientY - v, y = l, _ = u, o(l, u, t))
            }

            function o(e, t, n) {
                return n.style.transform = "translate3d(" + e + "px, " + t + "px, 0)", "large" === d.toString() || "xlarge" === d.toString() ? (h[i].xlarge = {
                    x: e,
                    y: t
                }, void(h[i].large = {
                    x: e,
                    y: t
                })) : (console.log(d), void(h[i][d.toString()] = {
                    x: e,
                    y: t
                }))
            }
            var a = p[i][d.toString()],
                c = !1,
                l = a.x,
                u = a.y,
                f = a.x,
                v = a.y,
                y = l,
                _ = u;
            m.on("change:viewport", function () {
                y = h[i][d.toString()].x, _ = h[i][d.toString()].y
            }), e.addEventListener("mousedown", n, !1), e.addEventListener("mouseup", r, !1), e.addEventListener("mousemove", s, !1)
        }

        function s(e, t) {
            function i(e) {
                var t = "";
                return e.forEach(function (e, i) {
                    t += ".unit-tile-" + i + " { \t\t\t\t@include css(( \t\t\t\t\ttransform: ( \t\t\t\t\tlarge:  translate(" + e.large.x + "px, " + e.large.y + "px), \t\t\t\t\tmedium: translate(" + e.medium.x + "px, " + e.medium.y + "px), \t\t\t\t\tsmall:  translate(" + e.small.x + "px, " + e.small.y + "px) \t\t\t\t\t) \t\t\t\t)); \t\t\t\t} \t\t\t"
                }), t
            }
            var n = document.createElement("button");
            n.className = "export-button button", n.innerHTML = "Export Positions";
            var r = document.createElement("div");
            r.className = "export-container", e.prepend(r);
            var s = i(t);
            n.addEventListener("click", function () {
                o(r, JSON.stringify(t), s)
            }), e.prepend(n)
        }

        function o(e, t, i) {
            e.innerHTML = '<p class="export-copy"><span>Copy the coordinates below 😎</span><button class="close-button icon icon-after icon-resetcircle"></button></p><p>JSON for _position-data.json:</p>' + t + "<p>CSS for _position-data.scss:</p>" + i, e.style.display = "block", e.querySelector(".close-button").addEventListener("click", function () {
                e.style.display = "none"
            })
        }

        function a(e) {
            var t = document.createElement("div");
            t.className = "viewport-container", e.prepend(t), c()
        }

        function c() {
            var e = document.documentElement.querySelector(".viewport-container"),
                t = Array.from(document.documentElement.querySelectorAll(".unit-tile"));
            return t.forEach(function (e, t) {
                f(e, t, h[t][d.toString()])
            }), "xlarge" === d.toString() || "large" === d.toString() ? void(e.innerHTML = "Current viewport: large") : void(e.innerHTML = "Current viewport: " + d)
        }

        function l(e, t) {
            var i = e.querySelector(".unit-image").classList[1].split("unit-")[1],
                n = document.createElement("span");
            n.className = "index-overlay", n.innerHTML = "index-" + (t + 1) + "<br>" + i, e.prepend(n)
        }

        function u(e, t) {
            console.log("last vp " + d);
            var i = document.createElement("div");
            i.className = "canvas-size-selectors", i.innerHTML = '<button class="button button-secondary" value="large">L</button> <button class="button button-secondary" value="medium">M</button> <button class="button button-secondary" value="small">S</button>';
            var n = Array.from(i.querySelectorAll("button"));
            n.forEach(function (i) {
                i.addEventListener("click", function (i) {
                    d = i.target.value, c();
                    var n = Array.from(e.querySelectorAll(".unit-canvas-wrapper"));
                    n.forEach(function (e) {
                        e.style.width = t[0][i.target.value].w + "px", e.style.height = t[0][i.target.value].h + "px"
                    })
                })
            }), e.prepend(i)
        }
        var h, m, d, f, p = e("./_position-data"),
            v = [{
                large: {
                    w: 2820,
                    h: 2350
                },
                medium: {
                    w: 2350,
                    h: 2040
                },
                small: {
                    w: 1600,
                    h: 1450
                }
            }];
        t.exports = n
    }, {
        "./_position-data": 170
    }],
    170: [function (e, t, i) {
        t.exports = [{
            xlarge: {
                x: -331,
                y: 395
            },
            large: {
                x: -331,
                y: 395
            },
            medium: {
                x: -289,
                y: 382
            },
            small: {
                x: -122,
                y: 244
            }
        }, {
            xlarge: {
                x: 213,
                y: 423
            },
            large: {
                x: 213,
                y: 423
            },
            medium: {
                x: 245,
                y: 385
            },
            small: {
                x: 134,
                y: 294
            }
        }, {
            xlarge: {
                x: 376,
                y: -362
            },
            large: {
                x: 376,
                y: -362
            },
            medium: {
                x: 449,
                y: -337
            },
            small: {
                x: 151,
                y: -235
            }
        }, {
            xlarge: {
                x: -627,
                y: -283
            },
            large: {
                x: -627,
                y: -283
            },
            medium: {
                x: -560,
                y: -257
            },
            small: {
                x: -393,
                y: -191
            }
        }, {
            xlarge: {
                x: 87,
                y: -742
            },
            large: {
                x: 87,
                y: -742
            },
            medium: {
                x: 99,
                y: -727
            },
            small: {
                x: 24,
                y: -458
            }
        }, {
            xlarge: {
                x: -795,
                y: 778
            },
            large: {
                x: -795,
                y: 778
            },
            medium: {
                x: -764,
                y: 741
            },
            small: {
                x: -579,
                y: 480
            }
        }, {
            xlarge: {
                x: -675,
                y: -639
            },
            large: {
                x: -675,
                y: -639
            },
            medium: {
                x: -663,
                y: -579
            },
            small: {
                x: -360,
                y: -399
            }
        }, {
            xlarge: {
                x: -230,
                y: 755
            },
            large: {
                x: -230,
                y: 755
            },
            medium: {
                x: -221,
                y: 765
            },
            small: {
                x: -279,
                y: 496
            }
        }, {
            xlarge: {
                x: 509,
                y: 72
            },
            large: {
                x: 509,
                y: 72
            },
            medium: {
                x: 518,
                y: 64
            },
            small: {
                x: 284,
                y: 13
            }
        }, {
            xlarge: {
                x: -150,
                y: -394
            },
            large: {
                x: -150,
                y: -394
            },
            medium: {
                x: -129,
                y: -377
            },
            small: {
                x: -93,
                y: -249
            }
        }, {
            xlarge: {
                x: 689,
                y: -711
            },
            large: {
                x: 689,
                y: -711
            },
            medium: {
                x: 663,
                y: -689
            },
            small: {
                x: 343,
                y: -428
            }
        }, {
            xlarge: {
                x: -531,
                y: 51
            },
            large: {
                x: -531,
                y: 51
            },
            medium: {
                x: -506,
                y: 61
            },
            small: {
                x: -354,
                y: 48
            }
        }, {
            xlarge: {
                x: -1062,
                y: 86
            },
            large: {
                x: -1062,
                y: 86
            },
            medium: {
                x: -1017,
                y: 119
            },
            small: {
                x: -690,
                y: 84
            }
        }, {
            xlarge: {
                x: -1127,
                y: -324
            },
            large: {
                x: -1127,
                y: -324
            },
            medium: {
                x: -968,
                y: -217
            },
            small: {
                x: -658,
                y: -153
            }
        }, {
            xlarge: {
                x: -777,
                y: 422
            },
            large: {
                x: -777,
                y: 422
            },
            medium: {
                x: -732,
                y: 431
            },
            small: {
                x: -404,
                y: 273
            }
        }, {
            xlarge: {
                x: 1069,
                y: -634
            },
            large: {
                x: 1069,
                y: -634
            },
            medium: {
                x: 997,
                y: -587
            },
            small: {
                x: 595,
                y: -234
            }
        }, {
            xlarge: {
                x: 808,
                y: -288
            },
            large: {
                x: 808,
                y: -288
            },
            medium: {
                x: 925,
                y: 79
            },
            small: {
                x: 383,
                y: -190
            }
        }, {
            xlarge: {
                x: 326,
                y: 804
            },
            large: {
                x: 326,
                y: 804
            },
            medium: {
                x: 370,
                y: 727
            },
            small: {
                x: 6,
                y: 541
            }
        }, {
            xlarge: {
                x: 772,
                y: 494
            },
            large: {
                x: 772,
                y: 494
            },
            medium: {
                x: 792,
                y: 407
            },
            small: {
                x: 454,
                y: 286
            }
        }, {
            xlarge: {
                x: 804,
                y: 833
            },
            large: {
                x: 804,
                y: 833
            },
            medium: {
                x: 827,
                y: 744
            },
            small: {
                x: 327,
                y: 507
            }
        }, {
            xlarge: {
                x: 940,
                y: 150
            },
            large: {
                x: 940,
                y: 150
            },
            medium: {
                x: 876,
                y: -249
            },
            small: {
                x: 553,
                y: 76
            }
        }]
    }, {}],
    171: [function (e, t, i) {
        function n(t, i, n) {
            r.apply(this, arguments), this.IN_POSITIONING_MODE = !1, this.enablePositionMode = this.IN_POSITIONING_MODE ? e("./_PositionModeComponent").bind(this) : function () {}, this.section = t, this.copyWrapper = this.section.querySelector(".unit-copy-wrapper"), this.canvasContainer = this.section.querySelector(".unit-canvas-container"), this.canvasWrappers = Array.from(this.section.querySelectorAll(".unit-canvas-wrapper")), this.tiles = Array.from(this.section.querySelectorAll(".unit-tile")), this.IS_PAUSED = !1, this.IS_MOBILE = document.documentElement.classList.contains("touch"), this.IS_REDUCED_MOTION = document.documentElement.classList.contains("reduced-motion"), this._initialize()
        }
        const r = e("@marcom/ac-homepage/BaseHomepageUnit"),
            s = r.prototype,
            o = e("@marcom/ac-modal").createFullViewportModal,
            a = e("@marcom/ac-accessibility/CircularTab");
        var c, l, u;
        try {
            c = e("@marcom/ac-analytics")
        } catch (h) {}
        const m = {
            create: e("@marcom/ac-raf-emitter/RAFEmitter"),
            update: e("@marcom/ac-raf-emitter/update"),
            draw: e("@marcom/ac-raf-emitter/draw")
        };
        var d = n.prototype = Object.create(s);
        d._initialize = function () {
            this.IN_POSITIONING_MODE ? this.enablePositionMode() : this.IS_MOBILE || this.IS_REDUCED_MOTION ? this._initTouchExperience() : this._initDesktopExperience(), this._onResize(), this._applyModals(), this._unitTiles()
        }, d._onResize = function () {
            this.sectionObj.viewportEmitter.on("change:viewport", function () {
                this.IS_MODAL(), this._unitTiles()
            }.bind(this))
        }, d._initTouchExperience = function () {
            function e(e) {
                d.normalize.x = e.target.scrollLeft / (e.target.scrollWidth - window.innerWidth) - .5, d.normalize.y = e.target.scrollTop / (e.target.scrollHeight - window.innerHeight) - .5, i.run()
            }

            function t() {
                d.current = {
                    x: 0,
                    y: 0
                }, d.range = {
                    width: .5 * (u.scrollWidth - window.innerWidth),
                    height: .5 * (u.scrollHeight - window.innerHeight)
                }, u.scroll({
                    top: d.range.height,
                    left: d.range.width,
                    behavior: "auto"
                })
            }
            var i, n, r = this.canvasWrappers[0].querySelector(".tag"),
                s = this.canvasWrappers[0].querySelector(".headline"),
                o = this.canvasWrappers[0].querySelector(".cta-links"),
                a = this.canvasWrappers[1],
                c = this.canvasWrappers[2],
                l = this.canvasWrappers[3],
                u = this.canvasContainer,
                h = [a, c, l, r, s, o],
                d = {
                    current: {
                        x: 0,
                        y: 0
                    },
                    normalize: {
                        x: 0,
                        y: 0
                    },
                    range: {
                        width: .5 * (u.scrollWidth - window.innerWidth),
                        height: .5 * (u.scrollHeight - window.innerHeight)
                    }
                };
            this.IS_MOBILE && !this.IS_REDUCED_MOTION ? (n = this.section.querySelector(".learn-more-arrow"), u.addEventListener("scroll", e), h.forEach(function (e) {
                e.style.willChange = "transform"
            }), n.addEventListener("click", function (e) {
                e.target.classList.contains("up") ? h.forEach(function (e) {
                    e.style.willChange = "transform"
                }) : (t(), h.forEach(function (e) {
                    e.style.willChange = "auto"
                }))
            })) : h.forEach(function (e) {
                e.style.willChange = "auto"
            }), i = new m.create, t(), window.addEventListener("resize", function (e) {
                t()
            }), i.on("update", function (e) {
                d.current.x = .45 * -((window.innerWidth - u.scrollWidth) / (u.scrollWidth / window.innerWidth) * d.normalize.x), d.current.y = .45 * -((window.innerHeight - u.scrollHeight) / (u.scrollHeight / window.innerHeight) * d.normalize.y)
            }), i.on("draw", function (e) {
                r.style.transform = "translate(" + (.9 * d.current.x).toFixed(2) + "px," + (.9 * d.current.y).toFixed(2) + "px)", s.style.transform = "translate(" + d.current.x.toFixed(2) + "px," + d.current.y.toFixed(2) + "px)", o.style.transform = "translate(" + (.9 * d.current.x).toFixed(2) + "px," + (.9 * d.current.y).toFixed(2) + "px)", a.style.transform = "translate(" + d.current.x.toFixed(2) + "px," + d.current.y.toFixed(2) + "px)", c.style.transform = "translate(" + (.8 * d.current.x).toFixed(2) + "px," + (.8 * d.current.y).toFixed(2) + "px)", l.style.transform = "translate(" + (.8 * d.current.x).toFixed(2) + "px," + (.6 * d.current.y).toFixed(2) + "px)"
            })
        }, d._initDesktopExperience = function () {
            function e(e) {
                clearTimeout(i), u.normalize.x = e.clientX / (window.innerWidth / 2) - 1, u.normalize.y = e.clientY / (window.innerHeight / 2) - 1, u.target.x = u.range.width * u.normalize.x, u.target.y = u.range.height * u.normalize.y, t.run(), i = setTimeout(function () {
                    u.target = {
                        x: 0,
                        y: 0
                    }, t.run()
                }, 8e3)
            }
            var t, i, n = this.canvasWrappers[0].querySelector(".tag"),
                r = this.canvasWrappers[0].querySelector(".headline"),
                s = this.canvasWrappers[0].querySelector(".cta-links"),
                o = this.canvasWrappers[1],
                a = this.canvasWrappers[2],
                c = this.canvasWrappers[3],
                l = [o, a, c, n, r, s],
                u = {
                    target: {
                        x: 0,
                        y: 0
                    },
                    current: {
                        x: 0,
                        y: 0
                    },
                    normalize: {
                        x: 0,
                        y: 0
                    },
                    overscroll: {
                        x: -185,
                        y: -75
                    },
                    ease: window.innerWidth * window.innerHeight / (this.canvasWrappers[1].clientHeight * this.canvasWrappers[1].clientWidth) / 15,
                    range: {
                        width: 0,
                        height: 0
                    }
                };
            u.range = {
                width: .5 * (this.copyWrapper.clientWidth - this.canvasWrappers[1].clientWidth) + u.overscroll.x,
                height: .5 * (this.copyWrapper.clientHeight - this.canvasWrappers[1].clientHeight) + u.overscroll.y
            }, setTimeout(function () {
                this.copyWrapper.addEventListener("mousemove", e), this.copyWrapper.addEventListener("mouseleave", function (e) {
                    clearTimeout(i), i = setTimeout(function () {
                        u.target = {
                            x: 0,
                            y: 0
                        }
                    }, 3e3)
                })
            }.bind(this), 2800), this.sectionObj.viewportEmitter.on("change:viewport", function () {
                u.range = {
                    width: .5 * (this.copyWrapper.clientWidth - this.canvasWrappers[1].clientWidth) + u.overscroll.x,
                    height: .5 * (this.copyWrapper.clientHeight - this.canvasWrappers[1].clientHeight) + u.overscroll.y
                }, u.ease = window.innerWidth * window.innerHeight / (this.canvasWrappers[1].clientHeight * this.canvasWrappers[1].clientWidth) / 15, u.target = {
                    x: 0,
                    y: 0
                }
            }.bind(this)), t = new m.create;
            var h = this.sectionObj.AnimSystem.addKeyframe(this.copyWrapper, {
                start: "-100vh",
                end: "a0b",
                event: "animationLoop",
                anchors: [this.copyWrapper]
            });
            h.controller.on("animationLoop:enter", function (e) {
                l.forEach(function (e) {
                    e.style.willChange = "transform"
                })
            }), h.controller.on("animationLoop:exit", function (e) {
                clearTimeout(i), u.target = {
                    x: 0,
                    y: 0
                }, u.current = {
                    x: 0,
                    y: 0
                }, i = setTimeout(function () {
                    t.cancel(), l.forEach(function (e) {
                        e.style.willChange = "auto"
                    })
                }, 300)
            }), t.on("update", function (e) {
                var i = Math.abs((u.target.x - u.current.x) * u.ease),
                    n = Math.abs((u.target.y - u.current.y) * u.ease);
                u.current.x += (u.target.x - u.current.x) * u.ease, u.current.y += (u.target.y - u.current.y) * u.ease, t.run(), i <= .05 && n <= .05 && t.cancel()
            }), t.on("draw", function (e) {
                n.style.transform = "translate(" + (.97 * u.current.x).toFixed(2) + "px," + (.97 * u.current.y).toFixed(2) + "px)", r.style.transform = "translate(" + u.current.x.toFixed(2) + "px," + u.current.y.toFixed(2) + "px)", s.style.transform = "translate(" + (.97 * u.current.x).toFixed(2) + "px," + (.97 * u.current.y).toFixed(2) + "px)", o.style.transform = "translate(" + u.current.x.toFixed(2) + "px," + u.current.y.toFixed(2) + "px)", a.style.transform = "translate(" + (.95 * u.current.x).toFixed(2) + "px," + (.95 * u.current.y).toFixed(2) + "px)", c.style.transform = "translate(" + (.9 * u.current.x).toFixed(2) + "px," + (.9 * u.current.y).toFixed(2) + "px)"
            })
        }, d.IS_MODAL = function () {
            var e = this.sectionObj.viewportEmitter.viewport;
            if (this.IS_MOBILE || "small" == e) return !0
        }, d._unitTiles = function () {
            var e = this.canvasContainer.dataset.learnMore;
            e = e || "Learn more about ", this.tiles.forEach(function (t) {
                var i = t.querySelector(".unit-bio p"),
                    n = t.querySelector(".bio-highlight-name").innerText.replace("’s", "");
                this.IS_MODAL() ? (t.classList.add("unit-modal"), t.setAttribute("aria-label", e + n), t.setAttribute("role", "button")) : (t.classList.remove("unit-modal"), t.setAttribute("aria-label", i.innerText), t.setAttribute("role", "img"))
            }.bind(this)), this.IS_MODAL() && c && this._runAnalytics()
        }, d._createModal = function (e) {
            var t = e.querySelector(".unit-bio"),
                t = t.parentNode.appendChild(t.cloneNode(!0)),
                t = e.querySelector(".unit-bio");
            this.modal = o(t);
            var i = this.modal.modalElement.querySelector(".modal-close");
            i.classList.add("icon-resetcircle"), this.modal.on("open", function () {
                this._circularTab = new a(this.modal.modalElement), t.classList.add("unit-bio-fade-in"), t.querySelector("p").setAttribute("role", "text"), this.modal._giveModalFocus = function () {
                    this.modalElement.removeAttribute("aria-hidden"), this._activeElement = document.activeElement, setTimeout(function () {
                        this.modalElement.focus()
                    }.bind(this), 300), this._circularTab.start()
                }
            }.bind(this)), this.modal.open(), this.modal.on("close", function () {
                this.modal.destroy(), e.focus()
            }.bind(this))
        }, d._applyModals = function () {
            this.canvasWrappers.forEach(function (e) {
                e.addEventListener("click", function (e) {
                    var t = e.target;
                    t.classList.contains("unit-modal") && (this._createModal(t), c && this._bodyClick(t))
                }.bind(this))
            }.bind(this))
        }, d._runAnalytics = function () {
            u = 0, l = Array.from(document.querySelectorAll(".unit-tile")), window.s.registerPostTrackCallback(function () {
                u = 0
            })
        }, d._bodyClick = function (e) {
            var t = l.indexOf(e);
            if (t !== -1) {
                l.splice(t, 1), u++;
                var i = {
                        events: "event363=" + u
                    },
                    n = {
                        overwriteStorageItem: !0
                    };
                c && c.passiveTracker(i, n)
            }
        }, t.exports = n
    }, {
        "./_PositionModeComponent": 169,
        "@marcom/ac-accessibility/CircularTab": 1,
        "@marcom/ac-analytics": void 0,
        "@marcom/ac-homepage/BaseHomepageUnit": 42,
        "@marcom/ac-modal": 64,
        "@marcom/ac-raf-emitter/RAFEmitter": 79,
        "@marcom/ac-raf-emitter/draw": 87,
        "@marcom/ac-raf-emitter/update": 89
    }],
    172: [function (e, t, i) {
        function n(e, t, i) {
            r.apply(this, arguments), this._attachModalClickEvents()
        }
        var r = e("@marcom/ac-homepage/BaseHomepageUnit"),
            s = r.prototype;
        const o = e("@marcom/ac-modal").createStandardModal,
            a = (e("@marcom/ac-raf-emitter/update"), e("@marcom/ac-raf-emitter/draw")),
            c = e("@marcom/ac-accessibility/CircularTab");
        var l = n.prototype = Object.create(s);
        l._openModal = function () {
            a(function () {
                this.iframeSrc && this.iframe && (this.iframe.src = this.iframeSrc), this.modal.open()
            }.bind(this))
        }, l._createModal = function () {
            document.domain = "apple.com";
            var e = this.collectionUnitElement.querySelector(".module-modal"),
                e = e.parentNode.appendChild(e.cloneNode(!0)),
                e = this.collectionUnitElement.querySelector(".module-modal");
            this.iframe = this.collectionUnitElement.querySelector("iframe"), this.iframe && (this.iframeSrc = this.iframe.getAttribute("data-lazy-src")), this.modal = o(e), this.modal.modalElement.setAttribute("data-modal-from", [this.sectionObj.moduleTemplateName, this.id].join("-")), this.modal.on("open", function () {
                this._circularTab = new c(this.modal.modalElement), this.modal._giveModalFocus = function () {
                    this.modalElement.removeAttribute("aria-hidden"), this._activeElement = document.activeElement, console.log(element, element), a(this.modal.modalElement), this._circularTab.start()
                }
            }.bind(this)), this.modal.on("close", function () {
                this.modal.destroy(), this.collectionUnitElement.querySelector("a[href$=modal]").focus()
            }.bind(this))
        }, l._attachModalClickEvents = function () {
            this.collectionUnitElement.querySelectorAll("a[href$=modal]").forEach(function (e) {
                e.addEventListener("click", function (e) {
                    e.preventDefault(), this._createModal(), this._openModal()
                }.bind(this))
            }.bind(this))
        }, t.exports = n
    }, {
        "@marcom/ac-accessibility/CircularTab": 1,
        "@marcom/ac-homepage/BaseHomepageUnit": 42,
        "@marcom/ac-modal": 64,
        "@marcom/ac-raf-emitter/draw": 87,
        "@marcom/ac-raf-emitter/update": 89
    }],
    173: [function (e, t, i) {
        "use strict";
        e("@marcom/ac-homepage/src/ac-homepage-main")(), e("./shame.js")()
    }, {
        "./shame.js": 174,
        "@marcom/ac-homepage/src/ac-homepage-main": 39
    }],
    174: [function (e, t, i) {
        "use strict";
        t.exports = function () {}
    }, {}],
    175: [function (e, t, i) {
        var n = {};
        n.hero = e("../src/content/modules/behind-the-mac-takeover/hero/hero.js"), t.exports = n
    }, {
        "../src/content/modules/behind-the-mac-takeover/hero/hero.js": 171
    }],
    176: [function (e, t, i) {
        var n = {};
        t.exports = n
    }, {}],
    177: [function (e, t, i) {
        arguments[4][176][0].apply(i, arguments)
    }, {
        dup: 176
    }],
    178: [function (e, t, i) {
        arguments[4][176][0].apply(i, arguments)
    }, {
        dup: 176
    }],
    179: [function (e, t, i) {
        var n = {};
        n["collection-unit-support"] = e("../src/content/modules/supports-shared-modals/collection-unit-support/collection-unit-support.js"), t.exports = n
    }, {
        "../src/content/modules/supports-shared-modals/collection-unit-support/collection-unit-support.js": 172
    }]
}, {}, [173]);