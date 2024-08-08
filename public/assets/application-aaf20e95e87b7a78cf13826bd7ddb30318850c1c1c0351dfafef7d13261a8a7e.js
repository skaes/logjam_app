(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x2) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x2, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x2)(function(x2) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x2 + '" is not supported');
  });
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // vendor/logjam/app/assets/javascripts/logjam-monitoring.js
  var init_logjam_monitoring = __esm({
    "vendor/logjam/app/assets/javascripts/logjam-monitoring.js"() {
      (function() {
        window.rum !== false && function(window2, document2, location2) {
          var logjamPageAction = document2.querySelector("meta[name^=logjam-action]"), logjamPageRequestId = document2.querySelector("meta[name^=logjam-request-id]"), monitoringCollector = document2.querySelector("meta[name^=logjam-timings-collector]");
          if (!(monitoringCollector && logjamPageAction && logjamPageAction))
            return;
          monitoringCollector = monitoringCollector.content + "/logjam/";
          logjamPageAction = logjamPageAction.content;
          logjamPageRequestId = logjamPageRequestId.content;
          var monitoringMeasures, _toQuery = function(obj) {
            obj._ = new Date().getTime();
            return Object.keys(obj).map(function(k) {
              return encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]);
            }).join("&");
          };
          Monitoring = function() {
            if (window2.addEventListener && window2.performance) {
              this.setXMLHttpRequestHook();
              this.getStaticMetrics();
              document2.readyState !== "loading" ? this.getDomInformation() : document2.addEventListener("DOMContentLoaded", this.getDomInformation, false);
              document2.readyState === "complete" ? this.getPerformanceData() : window2.addEventListener("load", this.getPerformanceData, false);
            } else {
              window2.performance = { navigation: {}, timing: {} };
              this.getStaticMetrics();
              this.getEmptyPerformanceData();
            }
            return this;
          };
          Monitoring.prototype = {
            getStaticMetrics: function() {
              monitoringMeasures = {
                logjam_action: logjamPageAction,
                logjam_request_id: logjamPageRequestId,
                url: location2.pathname,
                screen_height: screen.height,
                screen_width: screen.width,
                redirect_count: performance.navigation.redirectCount,
                v: 1
              };
            },
            getDomInformation: function() {
              monitoringMeasures.html_nodes = document2.getElementsByTagName("*").length;
              monitoringMeasures.script_nodes = document2.scripts.length;
              monitoringMeasures.style_nodes = document2.styleSheets.length;
            },
            getEmptyPerformanceData: function() {
              this.getPerformanceData();
            },
            getPerformanceData: function() {
              setTimeout(function() {
                var timing = performance.timing, fetchStart = timing.fetchStart, rts = [];
                [
                  "navigationStart",
                  "fetchStart",
                  "domainLookupStart",
                  "domainLookupEnd",
                  "connectStart",
                  "connectEnd",
                  "requestStart",
                  "responseStart",
                  "responseEnd",
                  "domLoading",
                  "domInteractive",
                  "domContentLoadedEventStart",
                  "domContentLoadedEventEnd",
                  "domComplete",
                  "loadEventStart",
                  "loadEventEnd"
                ].forEach(function(key) {
                  rts.push(timing[key] || 0);
                });
                monitoringMeasures.rts = rts;
                var tracking_url = monitoringCollector + "page?" + _toQuery(monitoringMeasures);
                if (typeof navigator.sendBeacon === "function")
                  navigator.sendBeacon(tracking_url);
                else
                  new Image().src = tracking_url;
              }, 20);
            },
            setXMLHttpRequestHook: function() {
              var originalXMLHttpRequest = XMLHttpRequest;
              window2.XMLHttpRequest = function() {
                var request = new originalXMLHttpRequest(), monitoringOpen = request.open, monitoringStart, monitoringUrl;
                request.open = function(method, url, async) {
                  monitoringUrl = url;
                  monitoringOpen.call(this, method, url, async);
                };
                request.addEventListener("readystatechange", function() {
                  var logjamRequestId, logjamRequestAction;
                  if (request.readyState == 1) {
                    monitoringStart = +new Date();
                  }
                  if (request.readyState == 4) {
                    try {
                      logjamRequestId = request.getResponseHeader("X-Logjam-Request-Id") || false;
                      logjamRequestAction = request.getResponseHeader("X-Logjam-Request-Action") || false;
                    } catch (e) {
                      logjamRequestId = logjamRequestAction = false;
                    }
                    if (logjamRequestId && logjamRequestAction) {
                      var requestData = {
                        logjam_caller_id: logjamPageRequestId,
                        logjam_caller_action: logjamPageAction,
                        logjam_request_id: logjamRequestId,
                        logjam_action: logjamRequestAction,
                        rts: [monitoringStart, +new Date()],
                        url: monitoringUrl.replace(location2.protocol + "//" + location2.host, "").replace("//", "/").split("?")[0],
                        v: 1
                      };
                      var tracking_url = monitoringCollector + "ajax?" + _toQuery(requestData);
                      if (typeof navigator.sendBeacon === "function")
                        navigator.sendBeacon(tracking_url);
                      else
                        new Image().src = tracking_url;
                    }
                  }
                }, false);
                return request;
              };
            }
          };
          new Monitoring();
        }(window, document, location);
      })();
    }
  });

  // node_modules/jquery/dist/jquery.js
  var require_jquery = __commonJS({
    "node_modules/jquery/dist/jquery.js"(exports2, module2) {
      (function(global2, factory) {
        "use strict";
        if (typeof module2 === "object" && typeof module2.exports === "object") {
          module2.exports = global2.document ? factory(global2, true) : function(w) {
            if (!w.document) {
              throw new Error("jQuery requires a window with a document");
            }
            return factory(w);
          };
        } else {
          factory(global2);
        }
      })(typeof window !== "undefined" ? window : exports2, function(window2, noGlobal) {
        "use strict";
        var arr = [];
        var getProto = Object.getPrototypeOf;
        var slice3 = arr.slice;
        var flat = arr.flat ? function(array2) {
          return arr.flat.call(array2);
        } : function(array2) {
          return arr.concat.apply([], array2);
        };
        var push = arr.push;
        var indexOf = arr.indexOf;
        var class2type = {};
        var toString = class2type.toString;
        var hasOwn = class2type.hasOwnProperty;
        var fnToString = hasOwn.toString;
        var ObjectFunctionString = fnToString.call(Object);
        var support = {};
        var isFunction = function isFunction2(obj) {
          return typeof obj === "function" && typeof obj.nodeType !== "number" && typeof obj.item !== "function";
        };
        var isWindow = function isWindow2(obj) {
          return obj != null && obj === obj.window;
        };
        var document2 = window2.document;
        var preservedScriptAttributes = {
          type: true,
          src: true,
          nonce: true,
          noModule: true
        };
        function DOMEval(code, node, doc) {
          doc = doc || document2;
          var i2, val, script = doc.createElement("script");
          script.text = code;
          if (node) {
            for (i2 in preservedScriptAttributes) {
              val = node[i2] || node.getAttribute && node.getAttribute(i2);
              if (val) {
                script.setAttribute(i2, val);
              }
            }
          }
          doc.head.appendChild(script).parentNode.removeChild(script);
        }
        function toType(obj) {
          if (obj == null) {
            return obj + "";
          }
          return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
        }
        var version = "3.6.0", jQuery2 = function(selector, context2) {
          return new jQuery2.fn.init(selector, context2);
        };
        jQuery2.fn = jQuery2.prototype = {
          jquery: version,
          constructor: jQuery2,
          length: 0,
          toArray: function() {
            return slice3.call(this);
          },
          get: function(num) {
            if (num == null) {
              return slice3.call(this);
            }
            return num < 0 ? this[num + this.length] : this[num];
          },
          pushStack: function(elems) {
            var ret = jQuery2.merge(this.constructor(), elems);
            ret.prevObject = this;
            return ret;
          },
          each: function(callback) {
            return jQuery2.each(this, callback);
          },
          map: function(callback) {
            return this.pushStack(jQuery2.map(this, function(elem, i2) {
              return callback.call(elem, i2, elem);
            }));
          },
          slice: function() {
            return this.pushStack(slice3.apply(this, arguments));
          },
          first: function() {
            return this.eq(0);
          },
          last: function() {
            return this.eq(-1);
          },
          even: function() {
            return this.pushStack(jQuery2.grep(this, function(_elem, i2) {
              return (i2 + 1) % 2;
            }));
          },
          odd: function() {
            return this.pushStack(jQuery2.grep(this, function(_elem, i2) {
              return i2 % 2;
            }));
          },
          eq: function(i2) {
            var len = this.length, j2 = +i2 + (i2 < 0 ? len : 0);
            return this.pushStack(j2 >= 0 && j2 < len ? [this[j2]] : []);
          },
          end: function() {
            return this.prevObject || this.constructor();
          },
          push,
          sort: arr.sort,
          splice: arr.splice
        };
        jQuery2.extend = jQuery2.fn.extend = function() {
          var options, name, src, copy3, copyIsArray, clone, target = arguments[0] || {}, i2 = 1, length = arguments.length, deep = false;
          if (typeof target === "boolean") {
            deep = target;
            target = arguments[i2] || {};
            i2++;
          }
          if (typeof target !== "object" && !isFunction(target)) {
            target = {};
          }
          if (i2 === length) {
            target = this;
            i2--;
          }
          for (; i2 < length; i2++) {
            if ((options = arguments[i2]) != null) {
              for (name in options) {
                copy3 = options[name];
                if (name === "__proto__" || target === copy3) {
                  continue;
                }
                if (deep && copy3 && (jQuery2.isPlainObject(copy3) || (copyIsArray = Array.isArray(copy3)))) {
                  src = target[name];
                  if (copyIsArray && !Array.isArray(src)) {
                    clone = [];
                  } else if (!copyIsArray && !jQuery2.isPlainObject(src)) {
                    clone = {};
                  } else {
                    clone = src;
                  }
                  copyIsArray = false;
                  target[name] = jQuery2.extend(deep, clone, copy3);
                } else if (copy3 !== void 0) {
                  target[name] = copy3;
                }
              }
            }
          }
          return target;
        };
        jQuery2.extend({
          expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),
          isReady: true,
          error: function(msg) {
            throw new Error(msg);
          },
          noop: function() {
          },
          isPlainObject: function(obj) {
            var proto, Ctor;
            if (!obj || toString.call(obj) !== "[object Object]") {
              return false;
            }
            proto = getProto(obj);
            if (!proto) {
              return true;
            }
            Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
            return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
          },
          isEmptyObject: function(obj) {
            var name;
            for (name in obj) {
              return false;
            }
            return true;
          },
          globalEval: function(code, options, doc) {
            DOMEval(code, { nonce: options && options.nonce }, doc);
          },
          each: function(obj, callback) {
            var length, i2 = 0;
            if (isArrayLike(obj)) {
              length = obj.length;
              for (; i2 < length; i2++) {
                if (callback.call(obj[i2], i2, obj[i2]) === false) {
                  break;
                }
              }
            } else {
              for (i2 in obj) {
                if (callback.call(obj[i2], i2, obj[i2]) === false) {
                  break;
                }
              }
            }
            return obj;
          },
          makeArray: function(arr2, results) {
            var ret = results || [];
            if (arr2 != null) {
              if (isArrayLike(Object(arr2))) {
                jQuery2.merge(
                  ret,
                  typeof arr2 === "string" ? [arr2] : arr2
                );
              } else {
                push.call(ret, arr2);
              }
            }
            return ret;
          },
          inArray: function(elem, arr2, i2) {
            return arr2 == null ? -1 : indexOf.call(arr2, elem, i2);
          },
          merge: function(first, second2) {
            var len = +second2.length, j2 = 0, i2 = first.length;
            for (; j2 < len; j2++) {
              first[i2++] = second2[j2];
            }
            first.length = i2;
            return first;
          },
          grep: function(elems, callback, invert) {
            var callbackInverse, matches2 = [], i2 = 0, length = elems.length, callbackExpect = !invert;
            for (; i2 < length; i2++) {
              callbackInverse = !callback(elems[i2], i2);
              if (callbackInverse !== callbackExpect) {
                matches2.push(elems[i2]);
              }
            }
            return matches2;
          },
          map: function(elems, callback, arg) {
            var length, value, i2 = 0, ret = [];
            if (isArrayLike(elems)) {
              length = elems.length;
              for (; i2 < length; i2++) {
                value = callback(elems[i2], i2, arg);
                if (value != null) {
                  ret.push(value);
                }
              }
            } else {
              for (i2 in elems) {
                value = callback(elems[i2], i2, arg);
                if (value != null) {
                  ret.push(value);
                }
              }
            }
            return flat(ret);
          },
          guid: 1,
          support
        });
        if (typeof Symbol === "function") {
          jQuery2.fn[Symbol.iterator] = arr[Symbol.iterator];
        }
        jQuery2.each(
          "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
          function(_i, name) {
            class2type["[object " + name + "]"] = name.toLowerCase();
          }
        );
        function isArrayLike(obj) {
          var length = !!obj && "length" in obj && obj.length, type2 = toType(obj);
          if (isFunction(obj) || isWindow(obj)) {
            return false;
          }
          return type2 === "array" || length === 0 || typeof length === "number" && length > 0 && length - 1 in obj;
        }
        var Sizzle = function(window3) {
          var i2, support2, Expr, getText, isXML, tokenize, compile, select, outermostContext, sortInput, hasDuplicate, setDocument, document3, docElem, documentIsHTML, rbuggyQSA, rbuggyMatches, matches2, contains, expando = "sizzle" + 1 * new Date(), preferredDoc = window3.document, dirruns = 0, done = 0, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(), nonnativeSelectorCache = createCache(), sortOrder = function(a, b) {
            if (a === b) {
              hasDuplicate = true;
            }
            return 0;
          }, hasOwn2 = {}.hasOwnProperty, arr2 = [], pop = arr2.pop, pushNative = arr2.push, push2 = arr2.push, slice4 = arr2.slice, indexOf2 = function(list, elem) {
            var i3 = 0, len = list.length;
            for (; i3 < len; i3++) {
              if (list[i3] === elem) {
                return i3;
              }
            }
            return -1;
          }, booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", whitespace = "[\\x20\\t\\r\\n\\f]", identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+", attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace + "*([*^$|!~]?=)" + whitespace + `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` + identifier + "))|)" + whitespace + "*\\]", pseudos = ":(" + identifier + `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` + attributes + ")*)|.*)\\)|)", rwhitespace = new RegExp(whitespace + "+", "g"), rtrim2 = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"), rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"), rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"), rdescend = new RegExp(whitespace + "|>"), rpseudo = new RegExp(pseudos), ridentifier = new RegExp("^" + identifier + "$"), matchExpr = {
            "ID": new RegExp("^#(" + identifier + ")"),
            "CLASS": new RegExp("^\\.(" + identifier + ")"),
            "TAG": new RegExp("^(" + identifier + "|[*])"),
            "ATTR": new RegExp("^" + attributes),
            "PSEUDO": new RegExp("^" + pseudos),
            "CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
            "bool": new RegExp("^(?:" + booleans + ")$", "i"),
            "needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
          }, rhtml2 = /HTML$/i, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rnative = /^[^{]+\{\s*\[native \w/, rquickExpr2 = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rsibling = /[+~]/, runescape = new RegExp("\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g"), funescape = function(escape2, nonHex) {
            var high = "0x" + escape2.slice(1) - 65536;
            return nonHex ? nonHex : high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320);
          }, rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g, fcssescape = function(ch, asCodePoint) {
            if (asCodePoint) {
              if (ch === "\0") {
                return "\uFFFD";
              }
              return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
            }
            return "\\" + ch;
          }, unloadHandler = function() {
            setDocument();
          }, inDisabledFieldset = addCombinator(
            function(elem) {
              return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
            },
            { dir: "parentNode", next: "legend" }
          );
          try {
            push2.apply(
              arr2 = slice4.call(preferredDoc.childNodes),
              preferredDoc.childNodes
            );
            arr2[preferredDoc.childNodes.length].nodeType;
          } catch (e) {
            push2 = {
              apply: arr2.length ? function(target, els) {
                pushNative.apply(target, slice4.call(els));
              } : function(target, els) {
                var j2 = target.length, i3 = 0;
                while (target[j2++] = els[i3++]) {
                }
                target.length = j2 - 1;
              }
            };
          }
          function Sizzle2(selector, context2, results, seed) {
            var m, i3, elem, nid, match, groups, newSelector, newContext = context2 && context2.ownerDocument, nodeType = context2 ? context2.nodeType : 9;
            results = results || [];
            if (typeof selector !== "string" || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {
              return results;
            }
            if (!seed) {
              setDocument(context2);
              context2 = context2 || document3;
              if (documentIsHTML) {
                if (nodeType !== 11 && (match = rquickExpr2.exec(selector))) {
                  if (m = match[1]) {
                    if (nodeType === 9) {
                      if (elem = context2.getElementById(m)) {
                        if (elem.id === m) {
                          results.push(elem);
                          return results;
                        }
                      } else {
                        return results;
                      }
                    } else {
                      if (newContext && (elem = newContext.getElementById(m)) && contains(context2, elem) && elem.id === m) {
                        results.push(elem);
                        return results;
                      }
                    }
                  } else if (match[2]) {
                    push2.apply(results, context2.getElementsByTagName(selector));
                    return results;
                  } else if ((m = match[3]) && support2.getElementsByClassName && context2.getElementsByClassName) {
                    push2.apply(results, context2.getElementsByClassName(m));
                    return results;
                  }
                }
                if (support2.qsa && !nonnativeSelectorCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector)) && (nodeType !== 1 || context2.nodeName.toLowerCase() !== "object")) {
                  newSelector = selector;
                  newContext = context2;
                  if (nodeType === 1 && (rdescend.test(selector) || rcombinators.test(selector))) {
                    newContext = rsibling.test(selector) && testContext(context2.parentNode) || context2;
                    if (newContext !== context2 || !support2.scope) {
                      if (nid = context2.getAttribute("id")) {
                        nid = nid.replace(rcssescape, fcssescape);
                      } else {
                        context2.setAttribute("id", nid = expando);
                      }
                    }
                    groups = tokenize(selector);
                    i3 = groups.length;
                    while (i3--) {
                      groups[i3] = (nid ? "#" + nid : ":scope") + " " + toSelector(groups[i3]);
                    }
                    newSelector = groups.join(",");
                  }
                  try {
                    push2.apply(
                      results,
                      newContext.querySelectorAll(newSelector)
                    );
                    return results;
                  } catch (qsaError) {
                    nonnativeSelectorCache(selector, true);
                  } finally {
                    if (nid === expando) {
                      context2.removeAttribute("id");
                    }
                  }
                }
              }
            }
            return select(selector.replace(rtrim2, "$1"), context2, results, seed);
          }
          function createCache() {
            var keys = [];
            function cache(key, value) {
              if (keys.push(key + " ") > Expr.cacheLength) {
                delete cache[keys.shift()];
              }
              return cache[key + " "] = value;
            }
            return cache;
          }
          function markFunction(fn) {
            fn[expando] = true;
            return fn;
          }
          function assert(fn) {
            var el = document3.createElement("fieldset");
            try {
              return !!fn(el);
            } catch (e) {
              return false;
            } finally {
              if (el.parentNode) {
                el.parentNode.removeChild(el);
              }
              el = null;
            }
          }
          function addHandle(attrs, handler) {
            var arr3 = attrs.split("|"), i3 = arr3.length;
            while (i3--) {
              Expr.attrHandle[arr3[i3]] = handler;
            }
          }
          function siblingCheck(a, b) {
            var cur = b && a, diff = cur && a.nodeType === 1 && b.nodeType === 1 && a.sourceIndex - b.sourceIndex;
            if (diff) {
              return diff;
            }
            if (cur) {
              while (cur = cur.nextSibling) {
                if (cur === b) {
                  return -1;
                }
              }
            }
            return a ? 1 : -1;
          }
          function createInputPseudo(type2) {
            return function(elem) {
              var name = elem.nodeName.toLowerCase();
              return name === "input" && elem.type === type2;
            };
          }
          function createButtonPseudo(type2) {
            return function(elem) {
              var name = elem.nodeName.toLowerCase();
              return (name === "input" || name === "button") && elem.type === type2;
            };
          }
          function createDisabledPseudo(disabled) {
            return function(elem) {
              if ("form" in elem) {
                if (elem.parentNode && elem.disabled === false) {
                  if ("label" in elem) {
                    if ("label" in elem.parentNode) {
                      return elem.parentNode.disabled === disabled;
                    } else {
                      return elem.disabled === disabled;
                    }
                  }
                  return elem.isDisabled === disabled || elem.isDisabled !== !disabled && inDisabledFieldset(elem) === disabled;
                }
                return elem.disabled === disabled;
              } else if ("label" in elem) {
                return elem.disabled === disabled;
              }
              return false;
            };
          }
          function createPositionalPseudo(fn) {
            return markFunction(function(argument) {
              argument = +argument;
              return markFunction(function(seed, matches3) {
                var j2, matchIndexes = fn([], seed.length, argument), i3 = matchIndexes.length;
                while (i3--) {
                  if (seed[j2 = matchIndexes[i3]]) {
                    seed[j2] = !(matches3[j2] = seed[j2]);
                  }
                }
              });
            });
          }
          function testContext(context2) {
            return context2 && typeof context2.getElementsByTagName !== "undefined" && context2;
          }
          support2 = Sizzle2.support = {};
          isXML = Sizzle2.isXML = function(elem) {
            var namespace = elem && elem.namespaceURI, docElem2 = elem && (elem.ownerDocument || elem).documentElement;
            return !rhtml2.test(namespace || docElem2 && docElem2.nodeName || "HTML");
          };
          setDocument = Sizzle2.setDocument = function(node) {
            var hasCompare, subWindow, doc = node ? node.ownerDocument || node : preferredDoc;
            if (doc == document3 || doc.nodeType !== 9 || !doc.documentElement) {
              return document3;
            }
            document3 = doc;
            docElem = document3.documentElement;
            documentIsHTML = !isXML(document3);
            if (preferredDoc != document3 && (subWindow = document3.defaultView) && subWindow.top !== subWindow) {
              if (subWindow.addEventListener) {
                subWindow.addEventListener("unload", unloadHandler, false);
              } else if (subWindow.attachEvent) {
                subWindow.attachEvent("onunload", unloadHandler);
              }
            }
            support2.scope = assert(function(el) {
              docElem.appendChild(el).appendChild(document3.createElement("div"));
              return typeof el.querySelectorAll !== "undefined" && !el.querySelectorAll(":scope fieldset div").length;
            });
            support2.attributes = assert(function(el) {
              el.className = "i";
              return !el.getAttribute("className");
            });
            support2.getElementsByTagName = assert(function(el) {
              el.appendChild(document3.createComment(""));
              return !el.getElementsByTagName("*").length;
            });
            support2.getElementsByClassName = rnative.test(document3.getElementsByClassName);
            support2.getById = assert(function(el) {
              docElem.appendChild(el).id = expando;
              return !document3.getElementsByName || !document3.getElementsByName(expando).length;
            });
            if (support2.getById) {
              Expr.filter["ID"] = function(id2) {
                var attrId = id2.replace(runescape, funescape);
                return function(elem) {
                  return elem.getAttribute("id") === attrId;
                };
              };
              Expr.find["ID"] = function(id2, context2) {
                if (typeof context2.getElementById !== "undefined" && documentIsHTML) {
                  var elem = context2.getElementById(id2);
                  return elem ? [elem] : [];
                }
              };
            } else {
              Expr.filter["ID"] = function(id2) {
                var attrId = id2.replace(runescape, funescape);
                return function(elem) {
                  var node2 = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
                  return node2 && node2.value === attrId;
                };
              };
              Expr.find["ID"] = function(id2, context2) {
                if (typeof context2.getElementById !== "undefined" && documentIsHTML) {
                  var node2, i3, elems, elem = context2.getElementById(id2);
                  if (elem) {
                    node2 = elem.getAttributeNode("id");
                    if (node2 && node2.value === id2) {
                      return [elem];
                    }
                    elems = context2.getElementsByName(id2);
                    i3 = 0;
                    while (elem = elems[i3++]) {
                      node2 = elem.getAttributeNode("id");
                      if (node2 && node2.value === id2) {
                        return [elem];
                      }
                    }
                  }
                  return [];
                }
              };
            }
            Expr.find["TAG"] = support2.getElementsByTagName ? function(tag, context2) {
              if (typeof context2.getElementsByTagName !== "undefined") {
                return context2.getElementsByTagName(tag);
              } else if (support2.qsa) {
                return context2.querySelectorAll(tag);
              }
            } : function(tag, context2) {
              var elem, tmp = [], i3 = 0, results = context2.getElementsByTagName(tag);
              if (tag === "*") {
                while (elem = results[i3++]) {
                  if (elem.nodeType === 1) {
                    tmp.push(elem);
                  }
                }
                return tmp;
              }
              return results;
            };
            Expr.find["CLASS"] = support2.getElementsByClassName && function(className, context2) {
              if (typeof context2.getElementsByClassName !== "undefined" && documentIsHTML) {
                return context2.getElementsByClassName(className);
              }
            };
            rbuggyMatches = [];
            rbuggyQSA = [];
            if (support2.qsa = rnative.test(document3.querySelectorAll)) {
              assert(function(el) {
                var input;
                docElem.appendChild(el).innerHTML = "<a id='" + expando + "'></a><select id='" + expando + "-\r\\' msallowcapture=''><option selected=''></option></select>";
                if (el.querySelectorAll("[msallowcapture^='']").length) {
                  rbuggyQSA.push("[*^$]=" + whitespace + `*(?:''|"")`);
                }
                if (!el.querySelectorAll("[selected]").length) {
                  rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
                }
                if (!el.querySelectorAll("[id~=" + expando + "-]").length) {
                  rbuggyQSA.push("~=");
                }
                input = document3.createElement("input");
                input.setAttribute("name", "");
                el.appendChild(input);
                if (!el.querySelectorAll("[name='']").length) {
                  rbuggyQSA.push("\\[" + whitespace + "*name" + whitespace + "*=" + whitespace + `*(?:''|"")`);
                }
                if (!el.querySelectorAll(":checked").length) {
                  rbuggyQSA.push(":checked");
                }
                if (!el.querySelectorAll("a#" + expando + "+*").length) {
                  rbuggyQSA.push(".#.+[+~]");
                }
                el.querySelectorAll("\\\f");
                rbuggyQSA.push("[\\r\\n\\f]");
              });
              assert(function(el) {
                el.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                var input = document3.createElement("input");
                input.setAttribute("type", "hidden");
                el.appendChild(input).setAttribute("name", "D");
                if (el.querySelectorAll("[name=d]").length) {
                  rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
                }
                if (el.querySelectorAll(":enabled").length !== 2) {
                  rbuggyQSA.push(":enabled", ":disabled");
                }
                docElem.appendChild(el).disabled = true;
                if (el.querySelectorAll(":disabled").length !== 2) {
                  rbuggyQSA.push(":enabled", ":disabled");
                }
                el.querySelectorAll("*,:x");
                rbuggyQSA.push(",.*:");
              });
            }
            if (support2.matchesSelector = rnative.test(matches2 = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) {
              assert(function(el) {
                support2.disconnectedMatch = matches2.call(el, "*");
                matches2.call(el, "[s!='']:x");
                rbuggyMatches.push("!=", pseudos);
              });
            }
            rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
            rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));
            hasCompare = rnative.test(docElem.compareDocumentPosition);
            contains = hasCompare || rnative.test(docElem.contains) ? function(a, b) {
              var adown = a.nodeType === 9 ? a.documentElement : a, bup = b && b.parentNode;
              return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
            } : function(a, b) {
              if (b) {
                while (b = b.parentNode) {
                  if (b === a) {
                    return true;
                  }
                }
              }
              return false;
            };
            sortOrder = hasCompare ? function(a, b) {
              if (a === b) {
                hasDuplicate = true;
                return 0;
              }
              var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
              if (compare) {
                return compare;
              }
              compare = (a.ownerDocument || a) == (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1;
              if (compare & 1 || !support2.sortDetached && b.compareDocumentPosition(a) === compare) {
                if (a == document3 || a.ownerDocument == preferredDoc && contains(preferredDoc, a)) {
                  return -1;
                }
                if (b == document3 || b.ownerDocument == preferredDoc && contains(preferredDoc, b)) {
                  return 1;
                }
                return sortInput ? indexOf2(sortInput, a) - indexOf2(sortInput, b) : 0;
              }
              return compare & 4 ? -1 : 1;
            } : function(a, b) {
              if (a === b) {
                hasDuplicate = true;
                return 0;
              }
              var cur, i3 = 0, aup = a.parentNode, bup = b.parentNode, ap = [a], bp = [b];
              if (!aup || !bup) {
                return a == document3 ? -1 : b == document3 ? 1 : aup ? -1 : bup ? 1 : sortInput ? indexOf2(sortInput, a) - indexOf2(sortInput, b) : 0;
              } else if (aup === bup) {
                return siblingCheck(a, b);
              }
              cur = a;
              while (cur = cur.parentNode) {
                ap.unshift(cur);
              }
              cur = b;
              while (cur = cur.parentNode) {
                bp.unshift(cur);
              }
              while (ap[i3] === bp[i3]) {
                i3++;
              }
              return i3 ? siblingCheck(ap[i3], bp[i3]) : ap[i3] == preferredDoc ? -1 : bp[i3] == preferredDoc ? 1 : 0;
            };
            return document3;
          };
          Sizzle2.matches = function(expr, elements) {
            return Sizzle2(expr, null, null, elements);
          };
          Sizzle2.matchesSelector = function(elem, expr) {
            setDocument(elem);
            if (support2.matchesSelector && documentIsHTML && !nonnativeSelectorCache[expr + " "] && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
              try {
                var ret = matches2.call(elem, expr);
                if (ret || support2.disconnectedMatch || elem.document && elem.document.nodeType !== 11) {
                  return ret;
                }
              } catch (e) {
                nonnativeSelectorCache(expr, true);
              }
            }
            return Sizzle2(expr, document3, null, [elem]).length > 0;
          };
          Sizzle2.contains = function(context2, elem) {
            if ((context2.ownerDocument || context2) != document3) {
              setDocument(context2);
            }
            return contains(context2, elem);
          };
          Sizzle2.attr = function(elem, name) {
            if ((elem.ownerDocument || elem) != document3) {
              setDocument(elem);
            }
            var fn = Expr.attrHandle[name.toLowerCase()], val = fn && hasOwn2.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : void 0;
            return val !== void 0 ? val : support2.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
          };
          Sizzle2.escape = function(sel) {
            return (sel + "").replace(rcssescape, fcssescape);
          };
          Sizzle2.error = function(msg) {
            throw new Error("Syntax error, unrecognized expression: " + msg);
          };
          Sizzle2.uniqueSort = function(results) {
            var elem, duplicates = [], j2 = 0, i3 = 0;
            hasDuplicate = !support2.detectDuplicates;
            sortInput = !support2.sortStable && results.slice(0);
            results.sort(sortOrder);
            if (hasDuplicate) {
              while (elem = results[i3++]) {
                if (elem === results[i3]) {
                  j2 = duplicates.push(i3);
                }
              }
              while (j2--) {
                results.splice(duplicates[j2], 1);
              }
            }
            sortInput = null;
            return results;
          };
          getText = Sizzle2.getText = function(elem) {
            var node, ret = "", i3 = 0, nodeType = elem.nodeType;
            if (!nodeType) {
              while (node = elem[i3++]) {
                ret += getText(node);
              }
            } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
              if (typeof elem.textContent === "string") {
                return elem.textContent;
              } else {
                for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                  ret += getText(elem);
                }
              }
            } else if (nodeType === 3 || nodeType === 4) {
              return elem.nodeValue;
            }
            return ret;
          };
          Expr = Sizzle2.selectors = {
            cacheLength: 50,
            createPseudo: markFunction,
            match: matchExpr,
            attrHandle: {},
            find: {},
            relative: {
              ">": { dir: "parentNode", first: true },
              " ": { dir: "parentNode" },
              "+": { dir: "previousSibling", first: true },
              "~": { dir: "previousSibling" }
            },
            preFilter: {
              "ATTR": function(match) {
                match[1] = match[1].replace(runescape, funescape);
                match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);
                if (match[2] === "~=") {
                  match[3] = " " + match[3] + " ";
                }
                return match.slice(0, 4);
              },
              "CHILD": function(match) {
                match[1] = match[1].toLowerCase();
                if (match[1].slice(0, 3) === "nth") {
                  if (!match[3]) {
                    Sizzle2.error(match[0]);
                  }
                  match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
                  match[5] = +(match[7] + match[8] || match[3] === "odd");
                } else if (match[3]) {
                  Sizzle2.error(match[0]);
                }
                return match;
              },
              "PSEUDO": function(match) {
                var excess, unquoted = !match[6] && match[2];
                if (matchExpr["CHILD"].test(match[0])) {
                  return null;
                }
                if (match[3]) {
                  match[2] = match[4] || match[5] || "";
                } else if (unquoted && rpseudo.test(unquoted) && (excess = tokenize(unquoted, true)) && (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
                  match[0] = match[0].slice(0, excess);
                  match[2] = unquoted.slice(0, excess);
                }
                return match.slice(0, 3);
              }
            },
            filter: {
              "TAG": function(nodeNameSelector) {
                var nodeName2 = nodeNameSelector.replace(runescape, funescape).toLowerCase();
                return nodeNameSelector === "*" ? function() {
                  return true;
                } : function(elem) {
                  return elem.nodeName && elem.nodeName.toLowerCase() === nodeName2;
                };
              },
              "CLASS": function(className) {
                var pattern = classCache[className + " "];
                return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(
                  className,
                  function(elem) {
                    return pattern.test(
                      typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || ""
                    );
                  }
                );
              },
              "ATTR": function(name, operator, check) {
                return function(elem) {
                  var result = Sizzle2.attr(elem, name);
                  if (result == null) {
                    return operator === "!=";
                  }
                  if (!operator) {
                    return true;
                  }
                  result += "";
                  return operator === "=" ? result === check : operator === "!=" ? result !== check : operator === "^=" ? check && result.indexOf(check) === 0 : operator === "*=" ? check && result.indexOf(check) > -1 : operator === "$=" ? check && result.slice(-check.length) === check : operator === "~=" ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1 : operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" : false;
                };
              },
              "CHILD": function(type2, what, _argument, first, last) {
                var simple = type2.slice(0, 3) !== "nth", forward = type2.slice(-4) !== "last", ofType = what === "of-type";
                return first === 1 && last === 0 ? function(elem) {
                  return !!elem.parentNode;
                } : function(elem, _context, xml) {
                  var cache, uniqueCache, outerCache, node, nodeIndex, start2, dir2 = simple !== forward ? "nextSibling" : "previousSibling", parent = elem.parentNode, name = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType, diff = false;
                  if (parent) {
                    if (simple) {
                      while (dir2) {
                        node = elem;
                        while (node = node[dir2]) {
                          if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {
                            return false;
                          }
                        }
                        start2 = dir2 = type2 === "only" && !start2 && "nextSibling";
                      }
                      return true;
                    }
                    start2 = [forward ? parent.firstChild : parent.lastChild];
                    if (forward && useCache) {
                      node = parent;
                      outerCache = node[expando] || (node[expando] = {});
                      uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});
                      cache = uniqueCache[type2] || [];
                      nodeIndex = cache[0] === dirruns && cache[1];
                      diff = nodeIndex && cache[2];
                      node = nodeIndex && parent.childNodes[nodeIndex];
                      while (node = ++nodeIndex && node && node[dir2] || (diff = nodeIndex = 0) || start2.pop()) {
                        if (node.nodeType === 1 && ++diff && node === elem) {
                          uniqueCache[type2] = [dirruns, nodeIndex, diff];
                          break;
                        }
                      }
                    } else {
                      if (useCache) {
                        node = elem;
                        outerCache = node[expando] || (node[expando] = {});
                        uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});
                        cache = uniqueCache[type2] || [];
                        nodeIndex = cache[0] === dirruns && cache[1];
                        diff = nodeIndex;
                      }
                      if (diff === false) {
                        while (node = ++nodeIndex && node && node[dir2] || (diff = nodeIndex = 0) || start2.pop()) {
                          if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {
                            if (useCache) {
                              outerCache = node[expando] || (node[expando] = {});
                              uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});
                              uniqueCache[type2] = [dirruns, diff];
                            }
                            if (node === elem) {
                              break;
                            }
                          }
                        }
                      }
                    }
                    diff -= last;
                    return diff === first || diff % first === 0 && diff / first >= 0;
                  }
                };
              },
              "PSEUDO": function(pseudo, argument) {
                var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle2.error("unsupported pseudo: " + pseudo);
                if (fn[expando]) {
                  return fn(argument);
                }
                if (fn.length > 1) {
                  args = [pseudo, pseudo, "", argument];
                  return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches3) {
                    var idx, matched = fn(seed, argument), i3 = matched.length;
                    while (i3--) {
                      idx = indexOf2(seed, matched[i3]);
                      seed[idx] = !(matches3[idx] = matched[i3]);
                    }
                  }) : function(elem) {
                    return fn(elem, 0, args);
                  };
                }
                return fn;
              }
            },
            pseudos: {
              "not": markFunction(function(selector) {
                var input = [], results = [], matcher = compile(selector.replace(rtrim2, "$1"));
                return matcher[expando] ? markFunction(function(seed, matches3, _context, xml) {
                  var elem, unmatched = matcher(seed, null, xml, []), i3 = seed.length;
                  while (i3--) {
                    if (elem = unmatched[i3]) {
                      seed[i3] = !(matches3[i3] = elem);
                    }
                  }
                }) : function(elem, _context, xml) {
                  input[0] = elem;
                  matcher(input, null, xml, results);
                  input[0] = null;
                  return !results.pop();
                };
              }),
              "has": markFunction(function(selector) {
                return function(elem) {
                  return Sizzle2(selector, elem).length > 0;
                };
              }),
              "contains": markFunction(function(text) {
                text = text.replace(runescape, funescape);
                return function(elem) {
                  return (elem.textContent || getText(elem)).indexOf(text) > -1;
                };
              }),
              "lang": markFunction(function(lang) {
                if (!ridentifier.test(lang || "")) {
                  Sizzle2.error("unsupported lang: " + lang);
                }
                lang = lang.replace(runescape, funescape).toLowerCase();
                return function(elem) {
                  var elemLang;
                  do {
                    if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {
                      elemLang = elemLang.toLowerCase();
                      return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
                    }
                  } while ((elem = elem.parentNode) && elem.nodeType === 1);
                  return false;
                };
              }),
              "target": function(elem) {
                var hash = window3.location && window3.location.hash;
                return hash && hash.slice(1) === elem.id;
              },
              "root": function(elem) {
                return elem === docElem;
              },
              "focus": function(elem) {
                return elem === document3.activeElement && (!document3.hasFocus || document3.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
              },
              "enabled": createDisabledPseudo(false),
              "disabled": createDisabledPseudo(true),
              "checked": function(elem) {
                var nodeName2 = elem.nodeName.toLowerCase();
                return nodeName2 === "input" && !!elem.checked || nodeName2 === "option" && !!elem.selected;
              },
              "selected": function(elem) {
                if (elem.parentNode) {
                  elem.parentNode.selectedIndex;
                }
                return elem.selected === true;
              },
              "empty": function(elem) {
                for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                  if (elem.nodeType < 6) {
                    return false;
                  }
                }
                return true;
              },
              "parent": function(elem) {
                return !Expr.pseudos["empty"](elem);
              },
              "header": function(elem) {
                return rheader.test(elem.nodeName);
              },
              "input": function(elem) {
                return rinputs.test(elem.nodeName);
              },
              "button": function(elem) {
                var name = elem.nodeName.toLowerCase();
                return name === "input" && elem.type === "button" || name === "button";
              },
              "text": function(elem) {
                var attr;
                return elem.nodeName.toLowerCase() === "input" && elem.type === "text" && ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
              },
              "first": createPositionalPseudo(function() {
                return [0];
              }),
              "last": createPositionalPseudo(function(_matchIndexes, length) {
                return [length - 1];
              }),
              "eq": createPositionalPseudo(function(_matchIndexes, length, argument) {
                return [argument < 0 ? argument + length : argument];
              }),
              "even": createPositionalPseudo(function(matchIndexes, length) {
                var i3 = 0;
                for (; i3 < length; i3 += 2) {
                  matchIndexes.push(i3);
                }
                return matchIndexes;
              }),
              "odd": createPositionalPseudo(function(matchIndexes, length) {
                var i3 = 1;
                for (; i3 < length; i3 += 2) {
                  matchIndexes.push(i3);
                }
                return matchIndexes;
              }),
              "lt": createPositionalPseudo(function(matchIndexes, length, argument) {
                var i3 = argument < 0 ? argument + length : argument > length ? length : argument;
                for (; --i3 >= 0; ) {
                  matchIndexes.push(i3);
                }
                return matchIndexes;
              }),
              "gt": createPositionalPseudo(function(matchIndexes, length, argument) {
                var i3 = argument < 0 ? argument + length : argument;
                for (; ++i3 < length; ) {
                  matchIndexes.push(i3);
                }
                return matchIndexes;
              })
            }
          };
          Expr.pseudos["nth"] = Expr.pseudos["eq"];
          for (i2 in { radio: true, checkbox: true, file: true, password: true, image: true }) {
            Expr.pseudos[i2] = createInputPseudo(i2);
          }
          for (i2 in { submit: true, reset: true }) {
            Expr.pseudos[i2] = createButtonPseudo(i2);
          }
          function setFilters() {
          }
          setFilters.prototype = Expr.filters = Expr.pseudos;
          Expr.setFilters = new setFilters();
          tokenize = Sizzle2.tokenize = function(selector, parseOnly) {
            var matched, match, tokens, type2, soFar, groups, preFilters, cached = tokenCache[selector + " "];
            if (cached) {
              return parseOnly ? 0 : cached.slice(0);
            }
            soFar = selector;
            groups = [];
            preFilters = Expr.preFilter;
            while (soFar) {
              if (!matched || (match = rcomma.exec(soFar))) {
                if (match) {
                  soFar = soFar.slice(match[0].length) || soFar;
                }
                groups.push(tokens = []);
              }
              matched = false;
              if (match = rcombinators.exec(soFar)) {
                matched = match.shift();
                tokens.push({
                  value: matched,
                  type: match[0].replace(rtrim2, " ")
                });
                soFar = soFar.slice(matched.length);
              }
              for (type2 in Expr.filter) {
                if ((match = matchExpr[type2].exec(soFar)) && (!preFilters[type2] || (match = preFilters[type2](match)))) {
                  matched = match.shift();
                  tokens.push({
                    value: matched,
                    type: type2,
                    matches: match
                  });
                  soFar = soFar.slice(matched.length);
                }
              }
              if (!matched) {
                break;
              }
            }
            return parseOnly ? soFar.length : soFar ? Sizzle2.error(selector) : tokenCache(selector, groups).slice(0);
          };
          function toSelector(tokens) {
            var i3 = 0, len = tokens.length, selector = "";
            for (; i3 < len; i3++) {
              selector += tokens[i3].value;
            }
            return selector;
          }
          function addCombinator(matcher, combinator, base) {
            var dir2 = combinator.dir, skip = combinator.next, key = skip || dir2, checkNonElements = base && key === "parentNode", doneName = done++;
            return combinator.first ? function(elem, context2, xml) {
              while (elem = elem[dir2]) {
                if (elem.nodeType === 1 || checkNonElements) {
                  return matcher(elem, context2, xml);
                }
              }
              return false;
            } : function(elem, context2, xml) {
              var oldCache, uniqueCache, outerCache, newCache = [dirruns, doneName];
              if (xml) {
                while (elem = elem[dir2]) {
                  if (elem.nodeType === 1 || checkNonElements) {
                    if (matcher(elem, context2, xml)) {
                      return true;
                    }
                  }
                }
              } else {
                while (elem = elem[dir2]) {
                  if (elem.nodeType === 1 || checkNonElements) {
                    outerCache = elem[expando] || (elem[expando] = {});
                    uniqueCache = outerCache[elem.uniqueID] || (outerCache[elem.uniqueID] = {});
                    if (skip && skip === elem.nodeName.toLowerCase()) {
                      elem = elem[dir2] || elem;
                    } else if ((oldCache = uniqueCache[key]) && oldCache[0] === dirruns && oldCache[1] === doneName) {
                      return newCache[2] = oldCache[2];
                    } else {
                      uniqueCache[key] = newCache;
                      if (newCache[2] = matcher(elem, context2, xml)) {
                        return true;
                      }
                    }
                  }
                }
              }
              return false;
            };
          }
          function elementMatcher(matchers) {
            return matchers.length > 1 ? function(elem, context2, xml) {
              var i3 = matchers.length;
              while (i3--) {
                if (!matchers[i3](elem, context2, xml)) {
                  return false;
                }
              }
              return true;
            } : matchers[0];
          }
          function multipleContexts(selector, contexts, results) {
            var i3 = 0, len = contexts.length;
            for (; i3 < len; i3++) {
              Sizzle2(selector, contexts[i3], results);
            }
            return results;
          }
          function condense(unmatched, map2, filter2, context2, xml) {
            var elem, newUnmatched = [], i3 = 0, len = unmatched.length, mapped = map2 != null;
            for (; i3 < len; i3++) {
              if (elem = unmatched[i3]) {
                if (!filter2 || filter2(elem, context2, xml)) {
                  newUnmatched.push(elem);
                  if (mapped) {
                    map2.push(i3);
                  }
                }
              }
            }
            return newUnmatched;
          }
          function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
            if (postFilter && !postFilter[expando]) {
              postFilter = setMatcher(postFilter);
            }
            if (postFinder && !postFinder[expando]) {
              postFinder = setMatcher(postFinder, postSelector);
            }
            return markFunction(function(seed, results, context2, xml) {
              var temp, i3, elem, preMap = [], postMap = [], preexisting = results.length, elems = seed || multipleContexts(
                selector || "*",
                context2.nodeType ? [context2] : context2,
                []
              ), matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context2, xml) : elems, matcherOut = matcher ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : results : matcherIn;
              if (matcher) {
                matcher(matcherIn, matcherOut, context2, xml);
              }
              if (postFilter) {
                temp = condense(matcherOut, postMap);
                postFilter(temp, [], context2, xml);
                i3 = temp.length;
                while (i3--) {
                  if (elem = temp[i3]) {
                    matcherOut[postMap[i3]] = !(matcherIn[postMap[i3]] = elem);
                  }
                }
              }
              if (seed) {
                if (postFinder || preFilter) {
                  if (postFinder) {
                    temp = [];
                    i3 = matcherOut.length;
                    while (i3--) {
                      if (elem = matcherOut[i3]) {
                        temp.push(matcherIn[i3] = elem);
                      }
                    }
                    postFinder(null, matcherOut = [], temp, xml);
                  }
                  i3 = matcherOut.length;
                  while (i3--) {
                    if ((elem = matcherOut[i3]) && (temp = postFinder ? indexOf2(seed, elem) : preMap[i3]) > -1) {
                      seed[temp] = !(results[temp] = elem);
                    }
                  }
                }
              } else {
                matcherOut = condense(
                  matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut
                );
                if (postFinder) {
                  postFinder(null, results, matcherOut, xml);
                } else {
                  push2.apply(results, matcherOut);
                }
              }
            });
          }
          function matcherFromTokens(tokens) {
            var checkContext, matcher, j2, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[" "], i3 = leadingRelative ? 1 : 0, matchContext = addCombinator(function(elem) {
              return elem === checkContext;
            }, implicitRelative, true), matchAnyContext = addCombinator(function(elem) {
              return indexOf2(checkContext, elem) > -1;
            }, implicitRelative, true), matchers = [function(elem, context2, xml) {
              var ret = !leadingRelative && (xml || context2 !== outermostContext) || ((checkContext = context2).nodeType ? matchContext(elem, context2, xml) : matchAnyContext(elem, context2, xml));
              checkContext = null;
              return ret;
            }];
            for (; i3 < len; i3++) {
              if (matcher = Expr.relative[tokens[i3].type]) {
                matchers = [addCombinator(elementMatcher(matchers), matcher)];
              } else {
                matcher = Expr.filter[tokens[i3].type].apply(null, tokens[i3].matches);
                if (matcher[expando]) {
                  j2 = ++i3;
                  for (; j2 < len; j2++) {
                    if (Expr.relative[tokens[j2].type]) {
                      break;
                    }
                  }
                  return setMatcher(
                    i3 > 1 && elementMatcher(matchers),
                    i3 > 1 && toSelector(
                      tokens.slice(0, i3 - 1).concat({ value: tokens[i3 - 2].type === " " ? "*" : "" })
                    ).replace(rtrim2, "$1"),
                    matcher,
                    i3 < j2 && matcherFromTokens(tokens.slice(i3, j2)),
                    j2 < len && matcherFromTokens(tokens = tokens.slice(j2)),
                    j2 < len && toSelector(tokens)
                  );
                }
                matchers.push(matcher);
              }
            }
            return elementMatcher(matchers);
          }
          function matcherFromGroupMatchers(elementMatchers, setMatchers) {
            var bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function(seed, context2, xml, results, outermost) {
              var elem, j2, matcher, matchedCount = 0, i3 = "0", unmatched = seed && [], setMatched = [], contextBackup = outermostContext, elems = seed || byElement && Expr.find["TAG"]("*", outermost), dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1, len = elems.length;
              if (outermost) {
                outermostContext = context2 == document3 || context2 || outermost;
              }
              for (; i3 !== len && (elem = elems[i3]) != null; i3++) {
                if (byElement && elem) {
                  j2 = 0;
                  if (!context2 && elem.ownerDocument != document3) {
                    setDocument(elem);
                    xml = !documentIsHTML;
                  }
                  while (matcher = elementMatchers[j2++]) {
                    if (matcher(elem, context2 || document3, xml)) {
                      results.push(elem);
                      break;
                    }
                  }
                  if (outermost) {
                    dirruns = dirrunsUnique;
                  }
                }
                if (bySet) {
                  if (elem = !matcher && elem) {
                    matchedCount--;
                  }
                  if (seed) {
                    unmatched.push(elem);
                  }
                }
              }
              matchedCount += i3;
              if (bySet && i3 !== matchedCount) {
                j2 = 0;
                while (matcher = setMatchers[j2++]) {
                  matcher(unmatched, setMatched, context2, xml);
                }
                if (seed) {
                  if (matchedCount > 0) {
                    while (i3--) {
                      if (!(unmatched[i3] || setMatched[i3])) {
                        setMatched[i3] = pop.call(results);
                      }
                    }
                  }
                  setMatched = condense(setMatched);
                }
                push2.apply(results, setMatched);
                if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {
                  Sizzle2.uniqueSort(results);
                }
              }
              if (outermost) {
                dirruns = dirrunsUnique;
                outermostContext = contextBackup;
              }
              return unmatched;
            };
            return bySet ? markFunction(superMatcher) : superMatcher;
          }
          compile = Sizzle2.compile = function(selector, match) {
            var i3, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + " "];
            if (!cached) {
              if (!match) {
                match = tokenize(selector);
              }
              i3 = match.length;
              while (i3--) {
                cached = matcherFromTokens(match[i3]);
                if (cached[expando]) {
                  setMatchers.push(cached);
                } else {
                  elementMatchers.push(cached);
                }
              }
              cached = compilerCache(
                selector,
                matcherFromGroupMatchers(elementMatchers, setMatchers)
              );
              cached.selector = selector;
            }
            return cached;
          };
          select = Sizzle2.select = function(selector, context2, results, seed) {
            var i3, tokens, token, type2, find2, compiled = typeof selector === "function" && selector, match = !seed && tokenize(selector = compiled.selector || selector);
            results = results || [];
            if (match.length === 1) {
              tokens = match[0] = match[0].slice(0);
              if (tokens.length > 2 && (token = tokens[0]).type === "ID" && context2.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
                context2 = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context2) || [])[0];
                if (!context2) {
                  return results;
                } else if (compiled) {
                  context2 = context2.parentNode;
                }
                selector = selector.slice(tokens.shift().value.length);
              }
              i3 = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
              while (i3--) {
                token = tokens[i3];
                if (Expr.relative[type2 = token.type]) {
                  break;
                }
                if (find2 = Expr.find[type2]) {
                  if (seed = find2(
                    token.matches[0].replace(runescape, funescape),
                    rsibling.test(tokens[0].type) && testContext(context2.parentNode) || context2
                  )) {
                    tokens.splice(i3, 1);
                    selector = seed.length && toSelector(tokens);
                    if (!selector) {
                      push2.apply(results, seed);
                      return results;
                    }
                    break;
                  }
                }
              }
            }
            (compiled || compile(selector, match))(
              seed,
              context2,
              !documentIsHTML,
              results,
              !context2 || rsibling.test(selector) && testContext(context2.parentNode) || context2
            );
            return results;
          };
          support2.sortStable = expando.split("").sort(sortOrder).join("") === expando;
          support2.detectDuplicates = !!hasDuplicate;
          setDocument();
          support2.sortDetached = assert(function(el) {
            return el.compareDocumentPosition(document3.createElement("fieldset")) & 1;
          });
          if (!assert(function(el) {
            el.innerHTML = "<a href='#'></a>";
            return el.firstChild.getAttribute("href") === "#";
          })) {
            addHandle("type|href|height|width", function(elem, name, isXML2) {
              if (!isXML2) {
                return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
              }
            });
          }
          if (!support2.attributes || !assert(function(el) {
            el.innerHTML = "<input/>";
            el.firstChild.setAttribute("value", "");
            return el.firstChild.getAttribute("value") === "";
          })) {
            addHandle("value", function(elem, _name, isXML2) {
              if (!isXML2 && elem.nodeName.toLowerCase() === "input") {
                return elem.defaultValue;
              }
            });
          }
          if (!assert(function(el) {
            return el.getAttribute("disabled") == null;
          })) {
            addHandle(booleans, function(elem, name, isXML2) {
              var val;
              if (!isXML2) {
                return elem[name] === true ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
              }
            });
          }
          return Sizzle2;
        }(window2);
        jQuery2.find = Sizzle;
        jQuery2.expr = Sizzle.selectors;
        jQuery2.expr[":"] = jQuery2.expr.pseudos;
        jQuery2.uniqueSort = jQuery2.unique = Sizzle.uniqueSort;
        jQuery2.text = Sizzle.getText;
        jQuery2.isXMLDoc = Sizzle.isXML;
        jQuery2.contains = Sizzle.contains;
        jQuery2.escapeSelector = Sizzle.escape;
        var dir = function(elem, dir2, until) {
          var matched = [], truncate = until !== void 0;
          while ((elem = elem[dir2]) && elem.nodeType !== 9) {
            if (elem.nodeType === 1) {
              if (truncate && jQuery2(elem).is(until)) {
                break;
              }
              matched.push(elem);
            }
          }
          return matched;
        };
        var siblings = function(n, elem) {
          var matched = [];
          for (; n; n = n.nextSibling) {
            if (n.nodeType === 1 && n !== elem) {
              matched.push(n);
            }
          }
          return matched;
        };
        var rneedsContext = jQuery2.expr.match.needsContext;
        function nodeName(elem, name) {
          return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
        }
        var rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
        function winnow(elements, qualifier, not) {
          if (isFunction(qualifier)) {
            return jQuery2.grep(elements, function(elem, i2) {
              return !!qualifier.call(elem, i2, elem) !== not;
            });
          }
          if (qualifier.nodeType) {
            return jQuery2.grep(elements, function(elem) {
              return elem === qualifier !== not;
            });
          }
          if (typeof qualifier !== "string") {
            return jQuery2.grep(elements, function(elem) {
              return indexOf.call(qualifier, elem) > -1 !== not;
            });
          }
          return jQuery2.filter(qualifier, elements, not);
        }
        jQuery2.filter = function(expr, elems, not) {
          var elem = elems[0];
          if (not) {
            expr = ":not(" + expr + ")";
          }
          if (elems.length === 1 && elem.nodeType === 1) {
            return jQuery2.find.matchesSelector(elem, expr) ? [elem] : [];
          }
          return jQuery2.find.matches(expr, jQuery2.grep(elems, function(elem2) {
            return elem2.nodeType === 1;
          }));
        };
        jQuery2.fn.extend({
          find: function(selector) {
            var i2, ret, len = this.length, self = this;
            if (typeof selector !== "string") {
              return this.pushStack(jQuery2(selector).filter(function() {
                for (i2 = 0; i2 < len; i2++) {
                  if (jQuery2.contains(self[i2], this)) {
                    return true;
                  }
                }
              }));
            }
            ret = this.pushStack([]);
            for (i2 = 0; i2 < len; i2++) {
              jQuery2.find(selector, self[i2], ret);
            }
            return len > 1 ? jQuery2.uniqueSort(ret) : ret;
          },
          filter: function(selector) {
            return this.pushStack(winnow(this, selector || [], false));
          },
          not: function(selector) {
            return this.pushStack(winnow(this, selector || [], true));
          },
          is: function(selector) {
            return !!winnow(
              this,
              typeof selector === "string" && rneedsContext.test(selector) ? jQuery2(selector) : selector || [],
              false
            ).length;
          }
        });
        var rootjQuery, rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/, init2 = jQuery2.fn.init = function(selector, context2, root2) {
          var match, elem;
          if (!selector) {
            return this;
          }
          root2 = root2 || rootjQuery;
          if (typeof selector === "string") {
            if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {
              match = [null, selector, null];
            } else {
              match = rquickExpr.exec(selector);
            }
            if (match && (match[1] || !context2)) {
              if (match[1]) {
                context2 = context2 instanceof jQuery2 ? context2[0] : context2;
                jQuery2.merge(this, jQuery2.parseHTML(
                  match[1],
                  context2 && context2.nodeType ? context2.ownerDocument || context2 : document2,
                  true
                ));
                if (rsingleTag.test(match[1]) && jQuery2.isPlainObject(context2)) {
                  for (match in context2) {
                    if (isFunction(this[match])) {
                      this[match](context2[match]);
                    } else {
                      this.attr(match, context2[match]);
                    }
                  }
                }
                return this;
              } else {
                elem = document2.getElementById(match[2]);
                if (elem) {
                  this[0] = elem;
                  this.length = 1;
                }
                return this;
              }
            } else if (!context2 || context2.jquery) {
              return (context2 || root2).find(selector);
            } else {
              return this.constructor(context2).find(selector);
            }
          } else if (selector.nodeType) {
            this[0] = selector;
            this.length = 1;
            return this;
          } else if (isFunction(selector)) {
            return root2.ready !== void 0 ? root2.ready(selector) : selector(jQuery2);
          }
          return jQuery2.makeArray(selector, this);
        };
        init2.prototype = jQuery2.fn;
        rootjQuery = jQuery2(document2);
        var rparentsprev = /^(?:parents|prev(?:Until|All))/, guaranteedUnique = {
          children: true,
          contents: true,
          next: true,
          prev: true
        };
        jQuery2.fn.extend({
          has: function(target) {
            var targets = jQuery2(target, this), l = targets.length;
            return this.filter(function() {
              var i2 = 0;
              for (; i2 < l; i2++) {
                if (jQuery2.contains(this, targets[i2])) {
                  return true;
                }
              }
            });
          },
          closest: function(selectors, context2) {
            var cur, i2 = 0, l = this.length, matched = [], targets = typeof selectors !== "string" && jQuery2(selectors);
            if (!rneedsContext.test(selectors)) {
              for (; i2 < l; i2++) {
                for (cur = this[i2]; cur && cur !== context2; cur = cur.parentNode) {
                  if (cur.nodeType < 11 && (targets ? targets.index(cur) > -1 : cur.nodeType === 1 && jQuery2.find.matchesSelector(cur, selectors))) {
                    matched.push(cur);
                    break;
                  }
                }
              }
            }
            return this.pushStack(matched.length > 1 ? jQuery2.uniqueSort(matched) : matched);
          },
          index: function(elem) {
            if (!elem) {
              return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
            }
            if (typeof elem === "string") {
              return indexOf.call(jQuery2(elem), this[0]);
            }
            return indexOf.call(
              this,
              elem.jquery ? elem[0] : elem
            );
          },
          add: function(selector, context2) {
            return this.pushStack(
              jQuery2.uniqueSort(
                jQuery2.merge(this.get(), jQuery2(selector, context2))
              )
            );
          },
          addBack: function(selector) {
            return this.add(
              selector == null ? this.prevObject : this.prevObject.filter(selector)
            );
          }
        });
        function sibling(cur, dir2) {
          while ((cur = cur[dir2]) && cur.nodeType !== 1) {
          }
          return cur;
        }
        jQuery2.each({
          parent: function(elem) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
          },
          parents: function(elem) {
            return dir(elem, "parentNode");
          },
          parentsUntil: function(elem, _i, until) {
            return dir(elem, "parentNode", until);
          },
          next: function(elem) {
            return sibling(elem, "nextSibling");
          },
          prev: function(elem) {
            return sibling(elem, "previousSibling");
          },
          nextAll: function(elem) {
            return dir(elem, "nextSibling");
          },
          prevAll: function(elem) {
            return dir(elem, "previousSibling");
          },
          nextUntil: function(elem, _i, until) {
            return dir(elem, "nextSibling", until);
          },
          prevUntil: function(elem, _i, until) {
            return dir(elem, "previousSibling", until);
          },
          siblings: function(elem) {
            return siblings((elem.parentNode || {}).firstChild, elem);
          },
          children: function(elem) {
            return siblings(elem.firstChild);
          },
          contents: function(elem) {
            if (elem.contentDocument != null && getProto(elem.contentDocument)) {
              return elem.contentDocument;
            }
            if (nodeName(elem, "template")) {
              elem = elem.content || elem;
            }
            return jQuery2.merge([], elem.childNodes);
          }
        }, function(name, fn) {
          jQuery2.fn[name] = function(until, selector) {
            var matched = jQuery2.map(this, fn, until);
            if (name.slice(-5) !== "Until") {
              selector = until;
            }
            if (selector && typeof selector === "string") {
              matched = jQuery2.filter(selector, matched);
            }
            if (this.length > 1) {
              if (!guaranteedUnique[name]) {
                jQuery2.uniqueSort(matched);
              }
              if (rparentsprev.test(name)) {
                matched.reverse();
              }
            }
            return this.pushStack(matched);
          };
        });
        var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;
        function createOptions(options) {
          var object = {};
          jQuery2.each(options.match(rnothtmlwhite) || [], function(_, flag) {
            object[flag] = true;
          });
          return object;
        }
        jQuery2.Callbacks = function(options) {
          options = typeof options === "string" ? createOptions(options) : jQuery2.extend({}, options);
          var firing, memory, fired, locked, list = [], queue = [], firingIndex = -1, fire = function() {
            locked = locked || options.once;
            fired = firing = true;
            for (; queue.length; firingIndex = -1) {
              memory = queue.shift();
              while (++firingIndex < list.length) {
                if (list[firingIndex].apply(memory[0], memory[1]) === false && options.stopOnFalse) {
                  firingIndex = list.length;
                  memory = false;
                }
              }
            }
            if (!options.memory) {
              memory = false;
            }
            firing = false;
            if (locked) {
              if (memory) {
                list = [];
              } else {
                list = "";
              }
            }
          }, self = {
            add: function() {
              if (list) {
                if (memory && !firing) {
                  firingIndex = list.length - 1;
                  queue.push(memory);
                }
                (function add(args) {
                  jQuery2.each(args, function(_, arg) {
                    if (isFunction(arg)) {
                      if (!options.unique || !self.has(arg)) {
                        list.push(arg);
                      }
                    } else if (arg && arg.length && toType(arg) !== "string") {
                      add(arg);
                    }
                  });
                })(arguments);
                if (memory && !firing) {
                  fire();
                }
              }
              return this;
            },
            remove: function() {
              jQuery2.each(arguments, function(_, arg) {
                var index;
                while ((index = jQuery2.inArray(arg, list, index)) > -1) {
                  list.splice(index, 1);
                  if (index <= firingIndex) {
                    firingIndex--;
                  }
                }
              });
              return this;
            },
            has: function(fn) {
              return fn ? jQuery2.inArray(fn, list) > -1 : list.length > 0;
            },
            empty: function() {
              if (list) {
                list = [];
              }
              return this;
            },
            disable: function() {
              locked = queue = [];
              list = memory = "";
              return this;
            },
            disabled: function() {
              return !list;
            },
            lock: function() {
              locked = queue = [];
              if (!memory && !firing) {
                list = memory = "";
              }
              return this;
            },
            locked: function() {
              return !!locked;
            },
            fireWith: function(context2, args) {
              if (!locked) {
                args = args || [];
                args = [context2, args.slice ? args.slice() : args];
                queue.push(args);
                if (!firing) {
                  fire();
                }
              }
              return this;
            },
            fire: function() {
              self.fireWith(this, arguments);
              return this;
            },
            fired: function() {
              return !!fired;
            }
          };
          return self;
        };
        function Identity(v) {
          return v;
        }
        function Thrower(ex) {
          throw ex;
        }
        function adoptValue(value, resolve, reject, noValue) {
          var method;
          try {
            if (value && isFunction(method = value.promise)) {
              method.call(value).done(resolve).fail(reject);
            } else if (value && isFunction(method = value.then)) {
              method.call(value, resolve, reject);
            } else {
              resolve.apply(void 0, [value].slice(noValue));
            }
          } catch (value2) {
            reject.apply(void 0, [value2]);
          }
        }
        jQuery2.extend({
          Deferred: function(func) {
            var tuples = [
              [
                "notify",
                "progress",
                jQuery2.Callbacks("memory"),
                jQuery2.Callbacks("memory"),
                2
              ],
              [
                "resolve",
                "done",
                jQuery2.Callbacks("once memory"),
                jQuery2.Callbacks("once memory"),
                0,
                "resolved"
              ],
              [
                "reject",
                "fail",
                jQuery2.Callbacks("once memory"),
                jQuery2.Callbacks("once memory"),
                1,
                "rejected"
              ]
            ], state = "pending", promise = {
              state: function() {
                return state;
              },
              always: function() {
                deferred.done(arguments).fail(arguments);
                return this;
              },
              "catch": function(fn) {
                return promise.then(null, fn);
              },
              pipe: function() {
                var fns = arguments;
                return jQuery2.Deferred(function(newDefer) {
                  jQuery2.each(tuples, function(_i, tuple) {
                    var fn = isFunction(fns[tuple[4]]) && fns[tuple[4]];
                    deferred[tuple[1]](function() {
                      var returned = fn && fn.apply(this, arguments);
                      if (returned && isFunction(returned.promise)) {
                        returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
                      } else {
                        newDefer[tuple[0] + "With"](
                          this,
                          fn ? [returned] : arguments
                        );
                      }
                    });
                  });
                  fns = null;
                }).promise();
              },
              then: function(onFulfilled, onRejected, onProgress) {
                var maxDepth = 0;
                function resolve(depth, deferred2, handler, special) {
                  return function() {
                    var that = this, args = arguments, mightThrow = function() {
                      var returned, then;
                      if (depth < maxDepth) {
                        return;
                      }
                      returned = handler.apply(that, args);
                      if (returned === deferred2.promise()) {
                        throw new TypeError("Thenable self-resolution");
                      }
                      then = returned && (typeof returned === "object" || typeof returned === "function") && returned.then;
                      if (isFunction(then)) {
                        if (special) {
                          then.call(
                            returned,
                            resolve(maxDepth, deferred2, Identity, special),
                            resolve(maxDepth, deferred2, Thrower, special)
                          );
                        } else {
                          maxDepth++;
                          then.call(
                            returned,
                            resolve(maxDepth, deferred2, Identity, special),
                            resolve(maxDepth, deferred2, Thrower, special),
                            resolve(
                              maxDepth,
                              deferred2,
                              Identity,
                              deferred2.notifyWith
                            )
                          );
                        }
                      } else {
                        if (handler !== Identity) {
                          that = void 0;
                          args = [returned];
                        }
                        (special || deferred2.resolveWith)(that, args);
                      }
                    }, process = special ? mightThrow : function() {
                      try {
                        mightThrow();
                      } catch (e) {
                        if (jQuery2.Deferred.exceptionHook) {
                          jQuery2.Deferred.exceptionHook(
                            e,
                            process.stackTrace
                          );
                        }
                        if (depth + 1 >= maxDepth) {
                          if (handler !== Thrower) {
                            that = void 0;
                            args = [e];
                          }
                          deferred2.rejectWith(that, args);
                        }
                      }
                    };
                    if (depth) {
                      process();
                    } else {
                      if (jQuery2.Deferred.getStackHook) {
                        process.stackTrace = jQuery2.Deferred.getStackHook();
                      }
                      window2.setTimeout(process);
                    }
                  };
                }
                return jQuery2.Deferred(function(newDefer) {
                  tuples[0][3].add(
                    resolve(
                      0,
                      newDefer,
                      isFunction(onProgress) ? onProgress : Identity,
                      newDefer.notifyWith
                    )
                  );
                  tuples[1][3].add(
                    resolve(
                      0,
                      newDefer,
                      isFunction(onFulfilled) ? onFulfilled : Identity
                    )
                  );
                  tuples[2][3].add(
                    resolve(
                      0,
                      newDefer,
                      isFunction(onRejected) ? onRejected : Thrower
                    )
                  );
                }).promise();
              },
              promise: function(obj) {
                return obj != null ? jQuery2.extend(obj, promise) : promise;
              }
            }, deferred = {};
            jQuery2.each(tuples, function(i2, tuple) {
              var list = tuple[2], stateString = tuple[5];
              promise[tuple[1]] = list.add;
              if (stateString) {
                list.add(
                  function() {
                    state = stateString;
                  },
                  tuples[3 - i2][2].disable,
                  tuples[3 - i2][3].disable,
                  tuples[0][2].lock,
                  tuples[0][3].lock
                );
              }
              list.add(tuple[3].fire);
              deferred[tuple[0]] = function() {
                deferred[tuple[0] + "With"](this === deferred ? void 0 : this, arguments);
                return this;
              };
              deferred[tuple[0] + "With"] = list.fireWith;
            });
            promise.promise(deferred);
            if (func) {
              func.call(deferred, deferred);
            }
            return deferred;
          },
          when: function(singleValue) {
            var remaining = arguments.length, i2 = remaining, resolveContexts = Array(i2), resolveValues = slice3.call(arguments), primary = jQuery2.Deferred(), updateFunc = function(i3) {
              return function(value) {
                resolveContexts[i3] = this;
                resolveValues[i3] = arguments.length > 1 ? slice3.call(arguments) : value;
                if (!--remaining) {
                  primary.resolveWith(resolveContexts, resolveValues);
                }
              };
            };
            if (remaining <= 1) {
              adoptValue(
                singleValue,
                primary.done(updateFunc(i2)).resolve,
                primary.reject,
                !remaining
              );
              if (primary.state() === "pending" || isFunction(resolveValues[i2] && resolveValues[i2].then)) {
                return primary.then();
              }
            }
            while (i2--) {
              adoptValue(resolveValues[i2], updateFunc(i2), primary.reject);
            }
            return primary.promise();
          }
        });
        var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
        jQuery2.Deferred.exceptionHook = function(error, stack) {
          if (window2.console && window2.console.warn && error && rerrorNames.test(error.name)) {
            window2.console.warn("jQuery.Deferred exception: " + error.message, error.stack, stack);
          }
        };
        jQuery2.readyException = function(error) {
          window2.setTimeout(function() {
            throw error;
          });
        };
        var readyList = jQuery2.Deferred();
        jQuery2.fn.ready = function(fn) {
          readyList.then(fn).catch(function(error) {
            jQuery2.readyException(error);
          });
          return this;
        };
        jQuery2.extend({
          isReady: false,
          readyWait: 1,
          ready: function(wait) {
            if (wait === true ? --jQuery2.readyWait : jQuery2.isReady) {
              return;
            }
            jQuery2.isReady = true;
            if (wait !== true && --jQuery2.readyWait > 0) {
              return;
            }
            readyList.resolveWith(document2, [jQuery2]);
          }
        });
        jQuery2.ready.then = readyList.then;
        function completed() {
          document2.removeEventListener("DOMContentLoaded", completed);
          window2.removeEventListener("load", completed);
          jQuery2.ready();
        }
        if (document2.readyState === "complete" || document2.readyState !== "loading" && !document2.documentElement.doScroll) {
          window2.setTimeout(jQuery2.ready);
        } else {
          document2.addEventListener("DOMContentLoaded", completed);
          window2.addEventListener("load", completed);
        }
        var access = function(elems, fn, key, value, chainable, emptyGet, raw) {
          var i2 = 0, len = elems.length, bulk = key == null;
          if (toType(key) === "object") {
            chainable = true;
            for (i2 in key) {
              access(elems, fn, i2, key[i2], true, emptyGet, raw);
            }
          } else if (value !== void 0) {
            chainable = true;
            if (!isFunction(value)) {
              raw = true;
            }
            if (bulk) {
              if (raw) {
                fn.call(elems, value);
                fn = null;
              } else {
                bulk = fn;
                fn = function(elem, _key, value2) {
                  return bulk.call(jQuery2(elem), value2);
                };
              }
            }
            if (fn) {
              for (; i2 < len; i2++) {
                fn(
                  elems[i2],
                  key,
                  raw ? value : value.call(elems[i2], i2, fn(elems[i2], key))
                );
              }
            }
          }
          if (chainable) {
            return elems;
          }
          if (bulk) {
            return fn.call(elems);
          }
          return len ? fn(elems[0], key) : emptyGet;
        };
        var rmsPrefix = /^-ms-/, rdashAlpha = /-([a-z])/g;
        function fcamelCase(_all, letter) {
          return letter.toUpperCase();
        }
        function camelCase(string2) {
          return string2.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
        }
        var acceptData = function(owner) {
          return owner.nodeType === 1 || owner.nodeType === 9 || !+owner.nodeType;
        };
        function Data() {
          this.expando = jQuery2.expando + Data.uid++;
        }
        Data.uid = 1;
        Data.prototype = {
          cache: function(owner) {
            var value = owner[this.expando];
            if (!value) {
              value = {};
              if (acceptData(owner)) {
                if (owner.nodeType) {
                  owner[this.expando] = value;
                } else {
                  Object.defineProperty(owner, this.expando, {
                    value,
                    configurable: true
                  });
                }
              }
            }
            return value;
          },
          set: function(owner, data, value) {
            var prop, cache = this.cache(owner);
            if (typeof data === "string") {
              cache[camelCase(data)] = value;
            } else {
              for (prop in data) {
                cache[camelCase(prop)] = data[prop];
              }
            }
            return cache;
          },
          get: function(owner, key) {
            return key === void 0 ? this.cache(owner) : owner[this.expando] && owner[this.expando][camelCase(key)];
          },
          access: function(owner, key, value) {
            if (key === void 0 || key && typeof key === "string" && value === void 0) {
              return this.get(owner, key);
            }
            this.set(owner, key, value);
            return value !== void 0 ? value : key;
          },
          remove: function(owner, key) {
            var i2, cache = owner[this.expando];
            if (cache === void 0) {
              return;
            }
            if (key !== void 0) {
              if (Array.isArray(key)) {
                key = key.map(camelCase);
              } else {
                key = camelCase(key);
                key = key in cache ? [key] : key.match(rnothtmlwhite) || [];
              }
              i2 = key.length;
              while (i2--) {
                delete cache[key[i2]];
              }
            }
            if (key === void 0 || jQuery2.isEmptyObject(cache)) {
              if (owner.nodeType) {
                owner[this.expando] = void 0;
              } else {
                delete owner[this.expando];
              }
            }
          },
          hasData: function(owner) {
            var cache = owner[this.expando];
            return cache !== void 0 && !jQuery2.isEmptyObject(cache);
          }
        };
        var dataPriv = new Data();
        var dataUser = new Data();
        var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, rmultiDash = /[A-Z]/g;
        function getData(data) {
          if (data === "true") {
            return true;
          }
          if (data === "false") {
            return false;
          }
          if (data === "null") {
            return null;
          }
          if (data === +data + "") {
            return +data;
          }
          if (rbrace.test(data)) {
            return JSON.parse(data);
          }
          return data;
        }
        function dataAttr(elem, key, data) {
          var name;
          if (data === void 0 && elem.nodeType === 1) {
            name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
            data = elem.getAttribute(name);
            if (typeof data === "string") {
              try {
                data = getData(data);
              } catch (e) {
              }
              dataUser.set(elem, key, data);
            } else {
              data = void 0;
            }
          }
          return data;
        }
        jQuery2.extend({
          hasData: function(elem) {
            return dataUser.hasData(elem) || dataPriv.hasData(elem);
          },
          data: function(elem, name, data) {
            return dataUser.access(elem, name, data);
          },
          removeData: function(elem, name) {
            dataUser.remove(elem, name);
          },
          _data: function(elem, name, data) {
            return dataPriv.access(elem, name, data);
          },
          _removeData: function(elem, name) {
            dataPriv.remove(elem, name);
          }
        });
        jQuery2.fn.extend({
          data: function(key, value) {
            var i2, name, data, elem = this[0], attrs = elem && elem.attributes;
            if (key === void 0) {
              if (this.length) {
                data = dataUser.get(elem);
                if (elem.nodeType === 1 && !dataPriv.get(elem, "hasDataAttrs")) {
                  i2 = attrs.length;
                  while (i2--) {
                    if (attrs[i2]) {
                      name = attrs[i2].name;
                      if (name.indexOf("data-") === 0) {
                        name = camelCase(name.slice(5));
                        dataAttr(elem, name, data[name]);
                      }
                    }
                  }
                  dataPriv.set(elem, "hasDataAttrs", true);
                }
              }
              return data;
            }
            if (typeof key === "object") {
              return this.each(function() {
                dataUser.set(this, key);
              });
            }
            return access(this, function(value2) {
              var data2;
              if (elem && value2 === void 0) {
                data2 = dataUser.get(elem, key);
                if (data2 !== void 0) {
                  return data2;
                }
                data2 = dataAttr(elem, key);
                if (data2 !== void 0) {
                  return data2;
                }
                return;
              }
              this.each(function() {
                dataUser.set(this, key, value2);
              });
            }, null, value, arguments.length > 1, null, true);
          },
          removeData: function(key) {
            return this.each(function() {
              dataUser.remove(this, key);
            });
          }
        });
        jQuery2.extend({
          queue: function(elem, type2, data) {
            var queue;
            if (elem) {
              type2 = (type2 || "fx") + "queue";
              queue = dataPriv.get(elem, type2);
              if (data) {
                if (!queue || Array.isArray(data)) {
                  queue = dataPriv.access(elem, type2, jQuery2.makeArray(data));
                } else {
                  queue.push(data);
                }
              }
              return queue || [];
            }
          },
          dequeue: function(elem, type2) {
            type2 = type2 || "fx";
            var queue = jQuery2.queue(elem, type2), startLength = queue.length, fn = queue.shift(), hooks = jQuery2._queueHooks(elem, type2), next = function() {
              jQuery2.dequeue(elem, type2);
            };
            if (fn === "inprogress") {
              fn = queue.shift();
              startLength--;
            }
            if (fn) {
              if (type2 === "fx") {
                queue.unshift("inprogress");
              }
              delete hooks.stop;
              fn.call(elem, next, hooks);
            }
            if (!startLength && hooks) {
              hooks.empty.fire();
            }
          },
          _queueHooks: function(elem, type2) {
            var key = type2 + "queueHooks";
            return dataPriv.get(elem, key) || dataPriv.access(elem, key, {
              empty: jQuery2.Callbacks("once memory").add(function() {
                dataPriv.remove(elem, [type2 + "queue", key]);
              })
            });
          }
        });
        jQuery2.fn.extend({
          queue: function(type2, data) {
            var setter = 2;
            if (typeof type2 !== "string") {
              data = type2;
              type2 = "fx";
              setter--;
            }
            if (arguments.length < setter) {
              return jQuery2.queue(this[0], type2);
            }
            return data === void 0 ? this : this.each(function() {
              var queue = jQuery2.queue(this, type2, data);
              jQuery2._queueHooks(this, type2);
              if (type2 === "fx" && queue[0] !== "inprogress") {
                jQuery2.dequeue(this, type2);
              }
            });
          },
          dequeue: function(type2) {
            return this.each(function() {
              jQuery2.dequeue(this, type2);
            });
          },
          clearQueue: function(type2) {
            return this.queue(type2 || "fx", []);
          },
          promise: function(type2, obj) {
            var tmp, count = 1, defer = jQuery2.Deferred(), elements = this, i2 = this.length, resolve = function() {
              if (!--count) {
                defer.resolveWith(elements, [elements]);
              }
            };
            if (typeof type2 !== "string") {
              obj = type2;
              type2 = void 0;
            }
            type2 = type2 || "fx";
            while (i2--) {
              tmp = dataPriv.get(elements[i2], type2 + "queueHooks");
              if (tmp && tmp.empty) {
                count++;
                tmp.empty.add(resolve);
              }
            }
            resolve();
            return defer.promise(obj);
          }
        });
        var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
        var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");
        var cssExpand = ["Top", "Right", "Bottom", "Left"];
        var documentElement = document2.documentElement;
        var isAttached = function(elem) {
          return jQuery2.contains(elem.ownerDocument, elem);
        }, composed = { composed: true };
        if (documentElement.getRootNode) {
          isAttached = function(elem) {
            return jQuery2.contains(elem.ownerDocument, elem) || elem.getRootNode(composed) === elem.ownerDocument;
          };
        }
        var isHiddenWithinTree = function(elem, el) {
          elem = el || elem;
          return elem.style.display === "none" || elem.style.display === "" && isAttached(elem) && jQuery2.css(elem, "display") === "none";
        };
        function adjustCSS(elem, prop, valueParts, tween) {
          var adjusted, scale, maxIterations = 20, currentValue = tween ? function() {
            return tween.cur();
          } : function() {
            return jQuery2.css(elem, prop, "");
          }, initial = currentValue(), unit2 = valueParts && valueParts[3] || (jQuery2.cssNumber[prop] ? "" : "px"), initialInUnit = elem.nodeType && (jQuery2.cssNumber[prop] || unit2 !== "px" && +initial) && rcssNum.exec(jQuery2.css(elem, prop));
          if (initialInUnit && initialInUnit[3] !== unit2) {
            initial = initial / 2;
            unit2 = unit2 || initialInUnit[3];
            initialInUnit = +initial || 1;
            while (maxIterations--) {
              jQuery2.style(elem, prop, initialInUnit + unit2);
              if ((1 - scale) * (1 - (scale = currentValue() / initial || 0.5)) <= 0) {
                maxIterations = 0;
              }
              initialInUnit = initialInUnit / scale;
            }
            initialInUnit = initialInUnit * 2;
            jQuery2.style(elem, prop, initialInUnit + unit2);
            valueParts = valueParts || [];
          }
          if (valueParts) {
            initialInUnit = +initialInUnit || +initial || 0;
            adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2];
            if (tween) {
              tween.unit = unit2;
              tween.start = initialInUnit;
              tween.end = adjusted;
            }
          }
          return adjusted;
        }
        var defaultDisplayMap = {};
        function getDefaultDisplay(elem) {
          var temp, doc = elem.ownerDocument, nodeName2 = elem.nodeName, display = defaultDisplayMap[nodeName2];
          if (display) {
            return display;
          }
          temp = doc.body.appendChild(doc.createElement(nodeName2));
          display = jQuery2.css(temp, "display");
          temp.parentNode.removeChild(temp);
          if (display === "none") {
            display = "block";
          }
          defaultDisplayMap[nodeName2] = display;
          return display;
        }
        function showHide(elements, show) {
          var display, elem, values = [], index = 0, length = elements.length;
          for (; index < length; index++) {
            elem = elements[index];
            if (!elem.style) {
              continue;
            }
            display = elem.style.display;
            if (show) {
              if (display === "none") {
                values[index] = dataPriv.get(elem, "display") || null;
                if (!values[index]) {
                  elem.style.display = "";
                }
              }
              if (elem.style.display === "" && isHiddenWithinTree(elem)) {
                values[index] = getDefaultDisplay(elem);
              }
            } else {
              if (display !== "none") {
                values[index] = "none";
                dataPriv.set(elem, "display", display);
              }
            }
          }
          for (index = 0; index < length; index++) {
            if (values[index] != null) {
              elements[index].style.display = values[index];
            }
          }
          return elements;
        }
        jQuery2.fn.extend({
          show: function() {
            return showHide(this, true);
          },
          hide: function() {
            return showHide(this);
          },
          toggle: function(state) {
            if (typeof state === "boolean") {
              return state ? this.show() : this.hide();
            }
            return this.each(function() {
              if (isHiddenWithinTree(this)) {
                jQuery2(this).show();
              } else {
                jQuery2(this).hide();
              }
            });
          }
        });
        var rcheckableType = /^(?:checkbox|radio)$/i;
        var rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i;
        var rscriptType = /^$|^module$|\/(?:java|ecma)script/i;
        (function() {
          var fragment = document2.createDocumentFragment(), div = fragment.appendChild(document2.createElement("div")), input = document2.createElement("input");
          input.setAttribute("type", "radio");
          input.setAttribute("checked", "checked");
          input.setAttribute("name", "t");
          div.appendChild(input);
          support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;
          div.innerHTML = "<textarea>x</textarea>";
          support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
          div.innerHTML = "<option></option>";
          support.option = !!div.lastChild;
        })();
        var wrapMap = {
          thead: [1, "<table>", "</table>"],
          col: [2, "<table><colgroup>", "</colgroup></table>"],
          tr: [2, "<table><tbody>", "</tbody></table>"],
          td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
          _default: [0, "", ""]
        };
        wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
        wrapMap.th = wrapMap.td;
        if (!support.option) {
          wrapMap.optgroup = wrapMap.option = [1, "<select multiple='multiple'>", "</select>"];
        }
        function getAll(context2, tag) {
          var ret;
          if (typeof context2.getElementsByTagName !== "undefined") {
            ret = context2.getElementsByTagName(tag || "*");
          } else if (typeof context2.querySelectorAll !== "undefined") {
            ret = context2.querySelectorAll(tag || "*");
          } else {
            ret = [];
          }
          if (tag === void 0 || tag && nodeName(context2, tag)) {
            return jQuery2.merge([context2], ret);
          }
          return ret;
        }
        function setGlobalEval(elems, refElements) {
          var i2 = 0, l = elems.length;
          for (; i2 < l; i2++) {
            dataPriv.set(
              elems[i2],
              "globalEval",
              !refElements || dataPriv.get(refElements[i2], "globalEval")
            );
          }
        }
        var rhtml = /<|&#?\w+;/;
        function buildFragment(elems, context2, scripts, selection2, ignored) {
          var elem, tmp, tag, wrap, attached, j2, fragment = context2.createDocumentFragment(), nodes = [], i2 = 0, l = elems.length;
          for (; i2 < l; i2++) {
            elem = elems[i2];
            if (elem || elem === 0) {
              if (toType(elem) === "object") {
                jQuery2.merge(nodes, elem.nodeType ? [elem] : elem);
              } else if (!rhtml.test(elem)) {
                nodes.push(context2.createTextNode(elem));
              } else {
                tmp = tmp || fragment.appendChild(context2.createElement("div"));
                tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
                wrap = wrapMap[tag] || wrapMap._default;
                tmp.innerHTML = wrap[1] + jQuery2.htmlPrefilter(elem) + wrap[2];
                j2 = wrap[0];
                while (j2--) {
                  tmp = tmp.lastChild;
                }
                jQuery2.merge(nodes, tmp.childNodes);
                tmp = fragment.firstChild;
                tmp.textContent = "";
              }
            }
          }
          fragment.textContent = "";
          i2 = 0;
          while (elem = nodes[i2++]) {
            if (selection2 && jQuery2.inArray(elem, selection2) > -1) {
              if (ignored) {
                ignored.push(elem);
              }
              continue;
            }
            attached = isAttached(elem);
            tmp = getAll(fragment.appendChild(elem), "script");
            if (attached) {
              setGlobalEval(tmp);
            }
            if (scripts) {
              j2 = 0;
              while (elem = tmp[j2++]) {
                if (rscriptType.test(elem.type || "")) {
                  scripts.push(elem);
                }
              }
            }
          }
          return fragment;
        }
        var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
        function returnTrue() {
          return true;
        }
        function returnFalse() {
          return false;
        }
        function expectSync(elem, type2) {
          return elem === safeActiveElement() === (type2 === "focus");
        }
        function safeActiveElement() {
          try {
            return document2.activeElement;
          } catch (err) {
          }
        }
        function on(elem, types, selector, data, fn, one2) {
          var origFn, type2;
          if (typeof types === "object") {
            if (typeof selector !== "string") {
              data = data || selector;
              selector = void 0;
            }
            for (type2 in types) {
              on(elem, type2, selector, data, types[type2], one2);
            }
            return elem;
          }
          if (data == null && fn == null) {
            fn = selector;
            data = selector = void 0;
          } else if (fn == null) {
            if (typeof selector === "string") {
              fn = data;
              data = void 0;
            } else {
              fn = data;
              data = selector;
              selector = void 0;
            }
          }
          if (fn === false) {
            fn = returnFalse;
          } else if (!fn) {
            return elem;
          }
          if (one2 === 1) {
            origFn = fn;
            fn = function(event) {
              jQuery2().off(event);
              return origFn.apply(this, arguments);
            };
            fn.guid = origFn.guid || (origFn.guid = jQuery2.guid++);
          }
          return elem.each(function() {
            jQuery2.event.add(this, types, fn, data, selector);
          });
        }
        jQuery2.event = {
          global: {},
          add: function(elem, types, handler, data, selector) {
            var handleObjIn, eventHandle, tmp, events, t, handleObj, special, handlers, type2, namespaces, origType, elemData = dataPriv.get(elem);
            if (!acceptData(elem)) {
              return;
            }
            if (handler.handler) {
              handleObjIn = handler;
              handler = handleObjIn.handler;
              selector = handleObjIn.selector;
            }
            if (selector) {
              jQuery2.find.matchesSelector(documentElement, selector);
            }
            if (!handler.guid) {
              handler.guid = jQuery2.guid++;
            }
            if (!(events = elemData.events)) {
              events = elemData.events = /* @__PURE__ */ Object.create(null);
            }
            if (!(eventHandle = elemData.handle)) {
              eventHandle = elemData.handle = function(e) {
                return typeof jQuery2 !== "undefined" && jQuery2.event.triggered !== e.type ? jQuery2.event.dispatch.apply(elem, arguments) : void 0;
              };
            }
            types = (types || "").match(rnothtmlwhite) || [""];
            t = types.length;
            while (t--) {
              tmp = rtypenamespace.exec(types[t]) || [];
              type2 = origType = tmp[1];
              namespaces = (tmp[2] || "").split(".").sort();
              if (!type2) {
                continue;
              }
              special = jQuery2.event.special[type2] || {};
              type2 = (selector ? special.delegateType : special.bindType) || type2;
              special = jQuery2.event.special[type2] || {};
              handleObj = jQuery2.extend({
                type: type2,
                origType,
                data,
                handler,
                guid: handler.guid,
                selector,
                needsContext: selector && jQuery2.expr.match.needsContext.test(selector),
                namespace: namespaces.join(".")
              }, handleObjIn);
              if (!(handlers = events[type2])) {
                handlers = events[type2] = [];
                handlers.delegateCount = 0;
                if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
                  if (elem.addEventListener) {
                    elem.addEventListener(type2, eventHandle);
                  }
                }
              }
              if (special.add) {
                special.add.call(elem, handleObj);
                if (!handleObj.handler.guid) {
                  handleObj.handler.guid = handler.guid;
                }
              }
              if (selector) {
                handlers.splice(handlers.delegateCount++, 0, handleObj);
              } else {
                handlers.push(handleObj);
              }
              jQuery2.event.global[type2] = true;
            }
          },
          remove: function(elem, types, handler, selector, mappedTypes) {
            var j2, origCount, tmp, events, t, handleObj, special, handlers, type2, namespaces, origType, elemData = dataPriv.hasData(elem) && dataPriv.get(elem);
            if (!elemData || !(events = elemData.events)) {
              return;
            }
            types = (types || "").match(rnothtmlwhite) || [""];
            t = types.length;
            while (t--) {
              tmp = rtypenamespace.exec(types[t]) || [];
              type2 = origType = tmp[1];
              namespaces = (tmp[2] || "").split(".").sort();
              if (!type2) {
                for (type2 in events) {
                  jQuery2.event.remove(elem, type2 + types[t], handler, selector, true);
                }
                continue;
              }
              special = jQuery2.event.special[type2] || {};
              type2 = (selector ? special.delegateType : special.bindType) || type2;
              handlers = events[type2] || [];
              tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");
              origCount = j2 = handlers.length;
              while (j2--) {
                handleObj = handlers[j2];
                if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
                  handlers.splice(j2, 1);
                  if (handleObj.selector) {
                    handlers.delegateCount--;
                  }
                  if (special.remove) {
                    special.remove.call(elem, handleObj);
                  }
                }
              }
              if (origCount && !handlers.length) {
                if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
                  jQuery2.removeEvent(elem, type2, elemData.handle);
                }
                delete events[type2];
              }
            }
            if (jQuery2.isEmptyObject(events)) {
              dataPriv.remove(elem, "handle events");
            }
          },
          dispatch: function(nativeEvent) {
            var i2, j2, ret, matched, handleObj, handlerQueue, args = new Array(arguments.length), event = jQuery2.event.fix(nativeEvent), handlers = (dataPriv.get(this, "events") || /* @__PURE__ */ Object.create(null))[event.type] || [], special = jQuery2.event.special[event.type] || {};
            args[0] = event;
            for (i2 = 1; i2 < arguments.length; i2++) {
              args[i2] = arguments[i2];
            }
            event.delegateTarget = this;
            if (special.preDispatch && special.preDispatch.call(this, event) === false) {
              return;
            }
            handlerQueue = jQuery2.event.handlers.call(this, event, handlers);
            i2 = 0;
            while ((matched = handlerQueue[i2++]) && !event.isPropagationStopped()) {
              event.currentTarget = matched.elem;
              j2 = 0;
              while ((handleObj = matched.handlers[j2++]) && !event.isImmediatePropagationStopped()) {
                if (!event.rnamespace || handleObj.namespace === false || event.rnamespace.test(handleObj.namespace)) {
                  event.handleObj = handleObj;
                  event.data = handleObj.data;
                  ret = ((jQuery2.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
                  if (ret !== void 0) {
                    if ((event.result = ret) === false) {
                      event.preventDefault();
                      event.stopPropagation();
                    }
                  }
                }
              }
            }
            if (special.postDispatch) {
              special.postDispatch.call(this, event);
            }
            return event.result;
          },
          handlers: function(event, handlers) {
            var i2, handleObj, sel, matchedHandlers, matchedSelectors, handlerQueue = [], delegateCount = handlers.delegateCount, cur = event.target;
            if (delegateCount && cur.nodeType && !(event.type === "click" && event.button >= 1)) {
              for (; cur !== this; cur = cur.parentNode || this) {
                if (cur.nodeType === 1 && !(event.type === "click" && cur.disabled === true)) {
                  matchedHandlers = [];
                  matchedSelectors = {};
                  for (i2 = 0; i2 < delegateCount; i2++) {
                    handleObj = handlers[i2];
                    sel = handleObj.selector + " ";
                    if (matchedSelectors[sel] === void 0) {
                      matchedSelectors[sel] = handleObj.needsContext ? jQuery2(sel, this).index(cur) > -1 : jQuery2.find(sel, this, null, [cur]).length;
                    }
                    if (matchedSelectors[sel]) {
                      matchedHandlers.push(handleObj);
                    }
                  }
                  if (matchedHandlers.length) {
                    handlerQueue.push({ elem: cur, handlers: matchedHandlers });
                  }
                }
              }
            }
            cur = this;
            if (delegateCount < handlers.length) {
              handlerQueue.push({ elem: cur, handlers: handlers.slice(delegateCount) });
            }
            return handlerQueue;
          },
          addProp: function(name, hook) {
            Object.defineProperty(jQuery2.Event.prototype, name, {
              enumerable: true,
              configurable: true,
              get: isFunction(hook) ? function() {
                if (this.originalEvent) {
                  return hook(this.originalEvent);
                }
              } : function() {
                if (this.originalEvent) {
                  return this.originalEvent[name];
                }
              },
              set: function(value) {
                Object.defineProperty(this, name, {
                  enumerable: true,
                  configurable: true,
                  writable: true,
                  value
                });
              }
            });
          },
          fix: function(originalEvent) {
            return originalEvent[jQuery2.expando] ? originalEvent : new jQuery2.Event(originalEvent);
          },
          special: {
            load: {
              noBubble: true
            },
            click: {
              setup: function(data) {
                var el = this || data;
                if (rcheckableType.test(el.type) && el.click && nodeName(el, "input")) {
                  leverageNative(el, "click", returnTrue);
                }
                return false;
              },
              trigger: function(data) {
                var el = this || data;
                if (rcheckableType.test(el.type) && el.click && nodeName(el, "input")) {
                  leverageNative(el, "click");
                }
                return true;
              },
              _default: function(event) {
                var target = event.target;
                return rcheckableType.test(target.type) && target.click && nodeName(target, "input") && dataPriv.get(target, "click") || nodeName(target, "a");
              }
            },
            beforeunload: {
              postDispatch: function(event) {
                if (event.result !== void 0 && event.originalEvent) {
                  event.originalEvent.returnValue = event.result;
                }
              }
            }
          }
        };
        function leverageNative(el, type2, expectSync2) {
          if (!expectSync2) {
            if (dataPriv.get(el, type2) === void 0) {
              jQuery2.event.add(el, type2, returnTrue);
            }
            return;
          }
          dataPriv.set(el, type2, false);
          jQuery2.event.add(el, type2, {
            namespace: false,
            handler: function(event) {
              var notAsync, result, saved = dataPriv.get(this, type2);
              if (event.isTrigger & 1 && this[type2]) {
                if (!saved.length) {
                  saved = slice3.call(arguments);
                  dataPriv.set(this, type2, saved);
                  notAsync = expectSync2(this, type2);
                  this[type2]();
                  result = dataPriv.get(this, type2);
                  if (saved !== result || notAsync) {
                    dataPriv.set(this, type2, false);
                  } else {
                    result = {};
                  }
                  if (saved !== result) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    return result && result.value;
                  }
                } else if ((jQuery2.event.special[type2] || {}).delegateType) {
                  event.stopPropagation();
                }
              } else if (saved.length) {
                dataPriv.set(this, type2, {
                  value: jQuery2.event.trigger(
                    jQuery2.extend(saved[0], jQuery2.Event.prototype),
                    saved.slice(1),
                    this
                  )
                });
                event.stopImmediatePropagation();
              }
            }
          });
        }
        jQuery2.removeEvent = function(elem, type2, handle) {
          if (elem.removeEventListener) {
            elem.removeEventListener(type2, handle);
          }
        };
        jQuery2.Event = function(src, props) {
          if (!(this instanceof jQuery2.Event)) {
            return new jQuery2.Event(src, props);
          }
          if (src && src.type) {
            this.originalEvent = src;
            this.type = src.type;
            this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === void 0 && src.returnValue === false ? returnTrue : returnFalse;
            this.target = src.target && src.target.nodeType === 3 ? src.target.parentNode : src.target;
            this.currentTarget = src.currentTarget;
            this.relatedTarget = src.relatedTarget;
          } else {
            this.type = src;
          }
          if (props) {
            jQuery2.extend(this, props);
          }
          this.timeStamp = src && src.timeStamp || Date.now();
          this[jQuery2.expando] = true;
        };
        jQuery2.Event.prototype = {
          constructor: jQuery2.Event,
          isDefaultPrevented: returnFalse,
          isPropagationStopped: returnFalse,
          isImmediatePropagationStopped: returnFalse,
          isSimulated: false,
          preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = returnTrue;
            if (e && !this.isSimulated) {
              e.preventDefault();
            }
          },
          stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = returnTrue;
            if (e && !this.isSimulated) {
              e.stopPropagation();
            }
          },
          stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = returnTrue;
            if (e && !this.isSimulated) {
              e.stopImmediatePropagation();
            }
            this.stopPropagation();
          }
        };
        jQuery2.each({
          altKey: true,
          bubbles: true,
          cancelable: true,
          changedTouches: true,
          ctrlKey: true,
          detail: true,
          eventPhase: true,
          metaKey: true,
          pageX: true,
          pageY: true,
          shiftKey: true,
          view: true,
          "char": true,
          code: true,
          charCode: true,
          key: true,
          keyCode: true,
          button: true,
          buttons: true,
          clientX: true,
          clientY: true,
          offsetX: true,
          offsetY: true,
          pointerId: true,
          pointerType: true,
          screenX: true,
          screenY: true,
          targetTouches: true,
          toElement: true,
          touches: true,
          which: true
        }, jQuery2.event.addProp);
        jQuery2.each({ focus: "focusin", blur: "focusout" }, function(type2, delegateType) {
          jQuery2.event.special[type2] = {
            setup: function() {
              leverageNative(this, type2, expectSync);
              return false;
            },
            trigger: function() {
              leverageNative(this, type2);
              return true;
            },
            _default: function() {
              return true;
            },
            delegateType
          };
        });
        jQuery2.each({
          mouseenter: "mouseover",
          mouseleave: "mouseout",
          pointerenter: "pointerover",
          pointerleave: "pointerout"
        }, function(orig, fix) {
          jQuery2.event.special[orig] = {
            delegateType: fix,
            bindType: fix,
            handle: function(event) {
              var ret, target = this, related = event.relatedTarget, handleObj = event.handleObj;
              if (!related || related !== target && !jQuery2.contains(target, related)) {
                event.type = handleObj.origType;
                ret = handleObj.handler.apply(this, arguments);
                event.type = fix;
              }
              return ret;
            }
          };
        });
        jQuery2.fn.extend({
          on: function(types, selector, data, fn) {
            return on(this, types, selector, data, fn);
          },
          one: function(types, selector, data, fn) {
            return on(this, types, selector, data, fn, 1);
          },
          off: function(types, selector, fn) {
            var handleObj, type2;
            if (types && types.preventDefault && types.handleObj) {
              handleObj = types.handleObj;
              jQuery2(types.delegateTarget).off(
                handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
                handleObj.selector,
                handleObj.handler
              );
              return this;
            }
            if (typeof types === "object") {
              for (type2 in types) {
                this.off(type2, selector, types[type2]);
              }
              return this;
            }
            if (selector === false || typeof selector === "function") {
              fn = selector;
              selector = void 0;
            }
            if (fn === false) {
              fn = returnFalse;
            }
            return this.each(function() {
              jQuery2.event.remove(this, types, fn, selector);
            });
          }
        });
        var rnoInnerhtml = /<script|<style|<link/i, rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
        function manipulationTarget(elem, content) {
          if (nodeName(elem, "table") && nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr")) {
            return jQuery2(elem).children("tbody")[0] || elem;
          }
          return elem;
        }
        function disableScript(elem) {
          elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
          return elem;
        }
        function restoreScript(elem) {
          if ((elem.type || "").slice(0, 5) === "true/") {
            elem.type = elem.type.slice(5);
          } else {
            elem.removeAttribute("type");
          }
          return elem;
        }
        function cloneCopyEvent(src, dest) {
          var i2, l, type2, pdataOld, udataOld, udataCur, events;
          if (dest.nodeType !== 1) {
            return;
          }
          if (dataPriv.hasData(src)) {
            pdataOld = dataPriv.get(src);
            events = pdataOld.events;
            if (events) {
              dataPriv.remove(dest, "handle events");
              for (type2 in events) {
                for (i2 = 0, l = events[type2].length; i2 < l; i2++) {
                  jQuery2.event.add(dest, type2, events[type2][i2]);
                }
              }
            }
          }
          if (dataUser.hasData(src)) {
            udataOld = dataUser.access(src);
            udataCur = jQuery2.extend({}, udataOld);
            dataUser.set(dest, udataCur);
          }
        }
        function fixInput(src, dest) {
          var nodeName2 = dest.nodeName.toLowerCase();
          if (nodeName2 === "input" && rcheckableType.test(src.type)) {
            dest.checked = src.checked;
          } else if (nodeName2 === "input" || nodeName2 === "textarea") {
            dest.defaultValue = src.defaultValue;
          }
        }
        function domManip(collection, args, callback, ignored) {
          args = flat(args);
          var fragment, first, scripts, hasScripts, node, doc, i2 = 0, l = collection.length, iNoClone = l - 1, value = args[0], valueIsFunction = isFunction(value);
          if (valueIsFunction || l > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value)) {
            return collection.each(function(index) {
              var self = collection.eq(index);
              if (valueIsFunction) {
                args[0] = value.call(this, index, self.html());
              }
              domManip(self, args, callback, ignored);
            });
          }
          if (l) {
            fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
            first = fragment.firstChild;
            if (fragment.childNodes.length === 1) {
              fragment = first;
            }
            if (first || ignored) {
              scripts = jQuery2.map(getAll(fragment, "script"), disableScript);
              hasScripts = scripts.length;
              for (; i2 < l; i2++) {
                node = fragment;
                if (i2 !== iNoClone) {
                  node = jQuery2.clone(node, true, true);
                  if (hasScripts) {
                    jQuery2.merge(scripts, getAll(node, "script"));
                  }
                }
                callback.call(collection[i2], node, i2);
              }
              if (hasScripts) {
                doc = scripts[scripts.length - 1].ownerDocument;
                jQuery2.map(scripts, restoreScript);
                for (i2 = 0; i2 < hasScripts; i2++) {
                  node = scripts[i2];
                  if (rscriptType.test(node.type || "") && !dataPriv.access(node, "globalEval") && jQuery2.contains(doc, node)) {
                    if (node.src && (node.type || "").toLowerCase() !== "module") {
                      if (jQuery2._evalUrl && !node.noModule) {
                        jQuery2._evalUrl(node.src, {
                          nonce: node.nonce || node.getAttribute("nonce")
                        }, doc);
                      }
                    } else {
                      DOMEval(node.textContent.replace(rcleanScript, ""), node, doc);
                    }
                  }
                }
              }
            }
          }
          return collection;
        }
        function remove2(elem, selector, keepData) {
          var node, nodes = selector ? jQuery2.filter(selector, elem) : elem, i2 = 0;
          for (; (node = nodes[i2]) != null; i2++) {
            if (!keepData && node.nodeType === 1) {
              jQuery2.cleanData(getAll(node));
            }
            if (node.parentNode) {
              if (keepData && isAttached(node)) {
                setGlobalEval(getAll(node, "script"));
              }
              node.parentNode.removeChild(node);
            }
          }
          return elem;
        }
        jQuery2.extend({
          htmlPrefilter: function(html) {
            return html;
          },
          clone: function(elem, dataAndEvents, deepDataAndEvents) {
            var i2, l, srcElements, destElements, clone = elem.cloneNode(true), inPage = isAttached(elem);
            if (!support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery2.isXMLDoc(elem)) {
              destElements = getAll(clone);
              srcElements = getAll(elem);
              for (i2 = 0, l = srcElements.length; i2 < l; i2++) {
                fixInput(srcElements[i2], destElements[i2]);
              }
            }
            if (dataAndEvents) {
              if (deepDataAndEvents) {
                srcElements = srcElements || getAll(elem);
                destElements = destElements || getAll(clone);
                for (i2 = 0, l = srcElements.length; i2 < l; i2++) {
                  cloneCopyEvent(srcElements[i2], destElements[i2]);
                }
              } else {
                cloneCopyEvent(elem, clone);
              }
            }
            destElements = getAll(clone, "script");
            if (destElements.length > 0) {
              setGlobalEval(destElements, !inPage && getAll(elem, "script"));
            }
            return clone;
          },
          cleanData: function(elems) {
            var data, elem, type2, special = jQuery2.event.special, i2 = 0;
            for (; (elem = elems[i2]) !== void 0; i2++) {
              if (acceptData(elem)) {
                if (data = elem[dataPriv.expando]) {
                  if (data.events) {
                    for (type2 in data.events) {
                      if (special[type2]) {
                        jQuery2.event.remove(elem, type2);
                      } else {
                        jQuery2.removeEvent(elem, type2, data.handle);
                      }
                    }
                  }
                  elem[dataPriv.expando] = void 0;
                }
                if (elem[dataUser.expando]) {
                  elem[dataUser.expando] = void 0;
                }
              }
            }
          }
        });
        jQuery2.fn.extend({
          detach: function(selector) {
            return remove2(this, selector, true);
          },
          remove: function(selector) {
            return remove2(this, selector);
          },
          text: function(value) {
            return access(this, function(value2) {
              return value2 === void 0 ? jQuery2.text(this) : this.empty().each(function() {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                  this.textContent = value2;
                }
              });
            }, null, value, arguments.length);
          },
          append: function() {
            return domManip(this, arguments, function(elem) {
              if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                var target = manipulationTarget(this, elem);
                target.appendChild(elem);
              }
            });
          },
          prepend: function() {
            return domManip(this, arguments, function(elem) {
              if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                var target = manipulationTarget(this, elem);
                target.insertBefore(elem, target.firstChild);
              }
            });
          },
          before: function() {
            return domManip(this, arguments, function(elem) {
              if (this.parentNode) {
                this.parentNode.insertBefore(elem, this);
              }
            });
          },
          after: function() {
            return domManip(this, arguments, function(elem) {
              if (this.parentNode) {
                this.parentNode.insertBefore(elem, this.nextSibling);
              }
            });
          },
          empty: function() {
            var elem, i2 = 0;
            for (; (elem = this[i2]) != null; i2++) {
              if (elem.nodeType === 1) {
                jQuery2.cleanData(getAll(elem, false));
                elem.textContent = "";
              }
            }
            return this;
          },
          clone: function(dataAndEvents, deepDataAndEvents) {
            dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
            deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
            return this.map(function() {
              return jQuery2.clone(this, dataAndEvents, deepDataAndEvents);
            });
          },
          html: function(value) {
            return access(this, function(value2) {
              var elem = this[0] || {}, i2 = 0, l = this.length;
              if (value2 === void 0 && elem.nodeType === 1) {
                return elem.innerHTML;
              }
              if (typeof value2 === "string" && !rnoInnerhtml.test(value2) && !wrapMap[(rtagName.exec(value2) || ["", ""])[1].toLowerCase()]) {
                value2 = jQuery2.htmlPrefilter(value2);
                try {
                  for (; i2 < l; i2++) {
                    elem = this[i2] || {};
                    if (elem.nodeType === 1) {
                      jQuery2.cleanData(getAll(elem, false));
                      elem.innerHTML = value2;
                    }
                  }
                  elem = 0;
                } catch (e) {
                }
              }
              if (elem) {
                this.empty().append(value2);
              }
            }, null, value, arguments.length);
          },
          replaceWith: function() {
            var ignored = [];
            return domManip(this, arguments, function(elem) {
              var parent = this.parentNode;
              if (jQuery2.inArray(this, ignored) < 0) {
                jQuery2.cleanData(getAll(this));
                if (parent) {
                  parent.replaceChild(elem, this);
                }
              }
            }, ignored);
          }
        });
        jQuery2.each({
          appendTo: "append",
          prependTo: "prepend",
          insertBefore: "before",
          insertAfter: "after",
          replaceAll: "replaceWith"
        }, function(name, original) {
          jQuery2.fn[name] = function(selector) {
            var elems, ret = [], insert = jQuery2(selector), last = insert.length - 1, i2 = 0;
            for (; i2 <= last; i2++) {
              elems = i2 === last ? this : this.clone(true);
              jQuery2(insert[i2])[original](elems);
              push.apply(ret, elems.get());
            }
            return this.pushStack(ret);
          };
        });
        var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");
        var getStyles = function(elem) {
          var view = elem.ownerDocument.defaultView;
          if (!view || !view.opener) {
            view = window2;
          }
          return view.getComputedStyle(elem);
        };
        var swap = function(elem, options, callback) {
          var ret, name, old = {};
          for (name in options) {
            old[name] = elem.style[name];
            elem.style[name] = options[name];
          }
          ret = callback.call(elem);
          for (name in options) {
            elem.style[name] = old[name];
          }
          return ret;
        };
        var rboxStyle = new RegExp(cssExpand.join("|"), "i");
        (function() {
          function computeStyleTests() {
            if (!div) {
              return;
            }
            container.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0";
            div.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%";
            documentElement.appendChild(container).appendChild(div);
            var divStyle = window2.getComputedStyle(div);
            pixelPositionVal = divStyle.top !== "1%";
            reliableMarginLeftVal = roundPixelMeasures(divStyle.marginLeft) === 12;
            div.style.right = "60%";
            pixelBoxStylesVal = roundPixelMeasures(divStyle.right) === 36;
            boxSizingReliableVal = roundPixelMeasures(divStyle.width) === 36;
            div.style.position = "absolute";
            scrollboxSizeVal = roundPixelMeasures(div.offsetWidth / 3) === 12;
            documentElement.removeChild(container);
            div = null;
          }
          function roundPixelMeasures(measure) {
            return Math.round(parseFloat(measure));
          }
          var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal, reliableTrDimensionsVal, reliableMarginLeftVal, container = document2.createElement("div"), div = document2.createElement("div");
          if (!div.style) {
            return;
          }
          div.style.backgroundClip = "content-box";
          div.cloneNode(true).style.backgroundClip = "";
          support.clearCloneStyle = div.style.backgroundClip === "content-box";
          jQuery2.extend(support, {
            boxSizingReliable: function() {
              computeStyleTests();
              return boxSizingReliableVal;
            },
            pixelBoxStyles: function() {
              computeStyleTests();
              return pixelBoxStylesVal;
            },
            pixelPosition: function() {
              computeStyleTests();
              return pixelPositionVal;
            },
            reliableMarginLeft: function() {
              computeStyleTests();
              return reliableMarginLeftVal;
            },
            scrollboxSize: function() {
              computeStyleTests();
              return scrollboxSizeVal;
            },
            reliableTrDimensions: function() {
              var table, tr, trChild, trStyle;
              if (reliableTrDimensionsVal == null) {
                table = document2.createElement("table");
                tr = document2.createElement("tr");
                trChild = document2.createElement("div");
                table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
                tr.style.cssText = "border:1px solid";
                tr.style.height = "1px";
                trChild.style.height = "9px";
                trChild.style.display = "block";
                documentElement.appendChild(table).appendChild(tr).appendChild(trChild);
                trStyle = window2.getComputedStyle(tr);
                reliableTrDimensionsVal = parseInt(trStyle.height, 10) + parseInt(trStyle.borderTopWidth, 10) + parseInt(trStyle.borderBottomWidth, 10) === tr.offsetHeight;
                documentElement.removeChild(table);
              }
              return reliableTrDimensionsVal;
            }
          });
        })();
        function curCSS(elem, name, computed) {
          var width, minWidth, maxWidth, ret, style2 = elem.style;
          computed = computed || getStyles(elem);
          if (computed) {
            ret = computed.getPropertyValue(name) || computed[name];
            if (ret === "" && !isAttached(elem)) {
              ret = jQuery2.style(elem, name);
            }
            if (!support.pixelBoxStyles() && rnumnonpx.test(ret) && rboxStyle.test(name)) {
              width = style2.width;
              minWidth = style2.minWidth;
              maxWidth = style2.maxWidth;
              style2.minWidth = style2.maxWidth = style2.width = ret;
              ret = computed.width;
              style2.width = width;
              style2.minWidth = minWidth;
              style2.maxWidth = maxWidth;
            }
          }
          return ret !== void 0 ? ret + "" : ret;
        }
        function addGetHookIf(conditionFn, hookFn) {
          return {
            get: function() {
              if (conditionFn()) {
                delete this.get;
                return;
              }
              return (this.get = hookFn).apply(this, arguments);
            }
          };
        }
        var cssPrefixes = ["Webkit", "Moz", "ms"], emptyStyle = document2.createElement("div").style, vendorProps = {};
        function vendorPropName(name) {
          var capName = name[0].toUpperCase() + name.slice(1), i2 = cssPrefixes.length;
          while (i2--) {
            name = cssPrefixes[i2] + capName;
            if (name in emptyStyle) {
              return name;
            }
          }
        }
        function finalPropName(name) {
          var final = jQuery2.cssProps[name] || vendorProps[name];
          if (final) {
            return final;
          }
          if (name in emptyStyle) {
            return name;
          }
          return vendorProps[name] = vendorPropName(name) || name;
        }
        var rdisplayswap = /^(none|table(?!-c[ea]).+)/, rcustomProp = /^--/, cssShow = { position: "absolute", visibility: "hidden", display: "block" }, cssNormalTransform = {
          letterSpacing: "0",
          fontWeight: "400"
        };
        function setPositiveNumber(_elem, value, subtract) {
          var matches2 = rcssNum.exec(value);
          return matches2 ? Math.max(0, matches2[2] - (subtract || 0)) + (matches2[3] || "px") : value;
        }
        function boxModelAdjustment(elem, dimension, box, isBorderBox, styles, computedVal) {
          var i2 = dimension === "width" ? 1 : 0, extra = 0, delta = 0;
          if (box === (isBorderBox ? "border" : "content")) {
            return 0;
          }
          for (; i2 < 4; i2 += 2) {
            if (box === "margin") {
              delta += jQuery2.css(elem, box + cssExpand[i2], true, styles);
            }
            if (!isBorderBox) {
              delta += jQuery2.css(elem, "padding" + cssExpand[i2], true, styles);
              if (box !== "padding") {
                delta += jQuery2.css(elem, "border" + cssExpand[i2] + "Width", true, styles);
              } else {
                extra += jQuery2.css(elem, "border" + cssExpand[i2] + "Width", true, styles);
              }
            } else {
              if (box === "content") {
                delta -= jQuery2.css(elem, "padding" + cssExpand[i2], true, styles);
              }
              if (box !== "margin") {
                delta -= jQuery2.css(elem, "border" + cssExpand[i2] + "Width", true, styles);
              }
            }
          }
          if (!isBorderBox && computedVal >= 0) {
            delta += Math.max(0, Math.ceil(
              elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - computedVal - delta - extra - 0.5
            )) || 0;
          }
          return delta;
        }
        function getWidthOrHeight(elem, dimension, extra) {
          var styles = getStyles(elem), boxSizingNeeded = !support.boxSizingReliable() || extra, isBorderBox = boxSizingNeeded && jQuery2.css(elem, "boxSizing", false, styles) === "border-box", valueIsBorderBox = isBorderBox, val = curCSS(elem, dimension, styles), offsetProp = "offset" + dimension[0].toUpperCase() + dimension.slice(1);
          if (rnumnonpx.test(val)) {
            if (!extra) {
              return val;
            }
            val = "auto";
          }
          if ((!support.boxSizingReliable() && isBorderBox || !support.reliableTrDimensions() && nodeName(elem, "tr") || val === "auto" || !parseFloat(val) && jQuery2.css(elem, "display", false, styles) === "inline") && elem.getClientRects().length) {
            isBorderBox = jQuery2.css(elem, "boxSizing", false, styles) === "border-box";
            valueIsBorderBox = offsetProp in elem;
            if (valueIsBorderBox) {
              val = elem[offsetProp];
            }
          }
          val = parseFloat(val) || 0;
          return val + boxModelAdjustment(
            elem,
            dimension,
            extra || (isBorderBox ? "border" : "content"),
            valueIsBorderBox,
            styles,
            val
          ) + "px";
        }
        jQuery2.extend({
          cssHooks: {
            opacity: {
              get: function(elem, computed) {
                if (computed) {
                  var ret = curCSS(elem, "opacity");
                  return ret === "" ? "1" : ret;
                }
              }
            }
          },
          cssNumber: {
            "animationIterationCount": true,
            "columnCount": true,
            "fillOpacity": true,
            "flexGrow": true,
            "flexShrink": true,
            "fontWeight": true,
            "gridArea": true,
            "gridColumn": true,
            "gridColumnEnd": true,
            "gridColumnStart": true,
            "gridRow": true,
            "gridRowEnd": true,
            "gridRowStart": true,
            "lineHeight": true,
            "opacity": true,
            "order": true,
            "orphans": true,
            "widows": true,
            "zIndex": true,
            "zoom": true
          },
          cssProps: {},
          style: function(elem, name, value, extra) {
            if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
              return;
            }
            var ret, type2, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name), style2 = elem.style;
            if (!isCustomProp) {
              name = finalPropName(origName);
            }
            hooks = jQuery2.cssHooks[name] || jQuery2.cssHooks[origName];
            if (value !== void 0) {
              type2 = typeof value;
              if (type2 === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
                value = adjustCSS(elem, name, ret);
                type2 = "number";
              }
              if (value == null || value !== value) {
                return;
              }
              if (type2 === "number" && !isCustomProp) {
                value += ret && ret[3] || (jQuery2.cssNumber[origName] ? "" : "px");
              }
              if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
                style2[name] = "inherit";
              }
              if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== void 0) {
                if (isCustomProp) {
                  style2.setProperty(name, value);
                } else {
                  style2[name] = value;
                }
              }
            } else {
              if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== void 0) {
                return ret;
              }
              return style2[name];
            }
          },
          css: function(elem, name, extra, styles) {
            var val, num, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name);
            if (!isCustomProp) {
              name = finalPropName(origName);
            }
            hooks = jQuery2.cssHooks[name] || jQuery2.cssHooks[origName];
            if (hooks && "get" in hooks) {
              val = hooks.get(elem, true, extra);
            }
            if (val === void 0) {
              val = curCSS(elem, name, styles);
            }
            if (val === "normal" && name in cssNormalTransform) {
              val = cssNormalTransform[name];
            }
            if (extra === "" || extra) {
              num = parseFloat(val);
              return extra === true || isFinite(num) ? num || 0 : val;
            }
            return val;
          }
        });
        jQuery2.each(["height", "width"], function(_i, dimension) {
          jQuery2.cssHooks[dimension] = {
            get: function(elem, computed, extra) {
              if (computed) {
                return rdisplayswap.test(jQuery2.css(elem, "display")) && (!elem.getClientRects().length || !elem.getBoundingClientRect().width) ? swap(elem, cssShow, function() {
                  return getWidthOrHeight(elem, dimension, extra);
                }) : getWidthOrHeight(elem, dimension, extra);
              }
            },
            set: function(elem, value, extra) {
              var matches2, styles = getStyles(elem), scrollboxSizeBuggy = !support.scrollboxSize() && styles.position === "absolute", boxSizingNeeded = scrollboxSizeBuggy || extra, isBorderBox = boxSizingNeeded && jQuery2.css(elem, "boxSizing", false, styles) === "border-box", subtract = extra ? boxModelAdjustment(
                elem,
                dimension,
                extra,
                isBorderBox,
                styles
              ) : 0;
              if (isBorderBox && scrollboxSizeBuggy) {
                subtract -= Math.ceil(
                  elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - parseFloat(styles[dimension]) - boxModelAdjustment(elem, dimension, "border", false, styles) - 0.5
                );
              }
              if (subtract && (matches2 = rcssNum.exec(value)) && (matches2[3] || "px") !== "px") {
                elem.style[dimension] = value;
                value = jQuery2.css(elem, dimension);
              }
              return setPositiveNumber(elem, value, subtract);
            }
          };
        });
        jQuery2.cssHooks.marginLeft = addGetHookIf(
          support.reliableMarginLeft,
          function(elem, computed) {
            if (computed) {
              return (parseFloat(curCSS(elem, "marginLeft")) || elem.getBoundingClientRect().left - swap(elem, { marginLeft: 0 }, function() {
                return elem.getBoundingClientRect().left;
              })) + "px";
            }
          }
        );
        jQuery2.each({
          margin: "",
          padding: "",
          border: "Width"
        }, function(prefix, suffix) {
          jQuery2.cssHooks[prefix + suffix] = {
            expand: function(value) {
              var i2 = 0, expanded = {}, parts = typeof value === "string" ? value.split(" ") : [value];
              for (; i2 < 4; i2++) {
                expanded[prefix + cssExpand[i2] + suffix] = parts[i2] || parts[i2 - 2] || parts[0];
              }
              return expanded;
            }
          };
          if (prefix !== "margin") {
            jQuery2.cssHooks[prefix + suffix].set = setPositiveNumber;
          }
        });
        jQuery2.fn.extend({
          css: function(name, value) {
            return access(this, function(elem, name2, value2) {
              var styles, len, map2 = {}, i2 = 0;
              if (Array.isArray(name2)) {
                styles = getStyles(elem);
                len = name2.length;
                for (; i2 < len; i2++) {
                  map2[name2[i2]] = jQuery2.css(elem, name2[i2], false, styles);
                }
                return map2;
              }
              return value2 !== void 0 ? jQuery2.style(elem, name2, value2) : jQuery2.css(elem, name2);
            }, name, value, arguments.length > 1);
          }
        });
        function Tween(elem, options, prop, end, easing) {
          return new Tween.prototype.init(elem, options, prop, end, easing);
        }
        jQuery2.Tween = Tween;
        Tween.prototype = {
          constructor: Tween,
          init: function(elem, options, prop, end, easing, unit2) {
            this.elem = elem;
            this.prop = prop;
            this.easing = easing || jQuery2.easing._default;
            this.options = options;
            this.start = this.now = this.cur();
            this.end = end;
            this.unit = unit2 || (jQuery2.cssNumber[prop] ? "" : "px");
          },
          cur: function() {
            var hooks = Tween.propHooks[this.prop];
            return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
          },
          run: function(percent) {
            var eased, hooks = Tween.propHooks[this.prop];
            if (this.options.duration) {
              this.pos = eased = jQuery2.easing[this.easing](
                percent,
                this.options.duration * percent,
                0,
                1,
                this.options.duration
              );
            } else {
              this.pos = eased = percent;
            }
            this.now = (this.end - this.start) * eased + this.start;
            if (this.options.step) {
              this.options.step.call(this.elem, this.now, this);
            }
            if (hooks && hooks.set) {
              hooks.set(this);
            } else {
              Tween.propHooks._default.set(this);
            }
            return this;
          }
        };
        Tween.prototype.init.prototype = Tween.prototype;
        Tween.propHooks = {
          _default: {
            get: function(tween) {
              var result;
              if (tween.elem.nodeType !== 1 || tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null) {
                return tween.elem[tween.prop];
              }
              result = jQuery2.css(tween.elem, tween.prop, "");
              return !result || result === "auto" ? 0 : result;
            },
            set: function(tween) {
              if (jQuery2.fx.step[tween.prop]) {
                jQuery2.fx.step[tween.prop](tween);
              } else if (tween.elem.nodeType === 1 && (jQuery2.cssHooks[tween.prop] || tween.elem.style[finalPropName(tween.prop)] != null)) {
                jQuery2.style(tween.elem, tween.prop, tween.now + tween.unit);
              } else {
                tween.elem[tween.prop] = tween.now;
              }
            }
          }
        };
        Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
          set: function(tween) {
            if (tween.elem.nodeType && tween.elem.parentNode) {
              tween.elem[tween.prop] = tween.now;
            }
          }
        };
        jQuery2.easing = {
          linear: function(p) {
            return p;
          },
          swing: function(p) {
            return 0.5 - Math.cos(p * Math.PI) / 2;
          },
          _default: "swing"
        };
        jQuery2.fx = Tween.prototype.init;
        jQuery2.fx.step = {};
        var fxNow, inProgress, rfxtypes = /^(?:toggle|show|hide)$/, rrun = /queueHooks$/;
        function schedule() {
          if (inProgress) {
            if (document2.hidden === false && window2.requestAnimationFrame) {
              window2.requestAnimationFrame(schedule);
            } else {
              window2.setTimeout(schedule, jQuery2.fx.interval);
            }
            jQuery2.fx.tick();
          }
        }
        function createFxNow() {
          window2.setTimeout(function() {
            fxNow = void 0;
          });
          return fxNow = Date.now();
        }
        function genFx(type2, includeWidth) {
          var which, i2 = 0, attrs = { height: type2 };
          includeWidth = includeWidth ? 1 : 0;
          for (; i2 < 4; i2 += 2 - includeWidth) {
            which = cssExpand[i2];
            attrs["margin" + which] = attrs["padding" + which] = type2;
          }
          if (includeWidth) {
            attrs.opacity = attrs.width = type2;
          }
          return attrs;
        }
        function createTween(value, prop, animation) {
          var tween, collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]), index = 0, length = collection.length;
          for (; index < length; index++) {
            if (tween = collection[index].call(animation, prop, value)) {
              return tween;
            }
          }
        }
        function defaultPrefilter(elem, props, opts) {
          var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display, isBox = "width" in props || "height" in props, anim = this, orig = {}, style2 = elem.style, hidden = elem.nodeType && isHiddenWithinTree(elem), dataShow = dataPriv.get(elem, "fxshow");
          if (!opts.queue) {
            hooks = jQuery2._queueHooks(elem, "fx");
            if (hooks.unqueued == null) {
              hooks.unqueued = 0;
              oldfire = hooks.empty.fire;
              hooks.empty.fire = function() {
                if (!hooks.unqueued) {
                  oldfire();
                }
              };
            }
            hooks.unqueued++;
            anim.always(function() {
              anim.always(function() {
                hooks.unqueued--;
                if (!jQuery2.queue(elem, "fx").length) {
                  hooks.empty.fire();
                }
              });
            });
          }
          for (prop in props) {
            value = props[prop];
            if (rfxtypes.test(value)) {
              delete props[prop];
              toggle = toggle || value === "toggle";
              if (value === (hidden ? "hide" : "show")) {
                if (value === "show" && dataShow && dataShow[prop] !== void 0) {
                  hidden = true;
                } else {
                  continue;
                }
              }
              orig[prop] = dataShow && dataShow[prop] || jQuery2.style(elem, prop);
            }
          }
          propTween = !jQuery2.isEmptyObject(props);
          if (!propTween && jQuery2.isEmptyObject(orig)) {
            return;
          }
          if (isBox && elem.nodeType === 1) {
            opts.overflow = [style2.overflow, style2.overflowX, style2.overflowY];
            restoreDisplay = dataShow && dataShow.display;
            if (restoreDisplay == null) {
              restoreDisplay = dataPriv.get(elem, "display");
            }
            display = jQuery2.css(elem, "display");
            if (display === "none") {
              if (restoreDisplay) {
                display = restoreDisplay;
              } else {
                showHide([elem], true);
                restoreDisplay = elem.style.display || restoreDisplay;
                display = jQuery2.css(elem, "display");
                showHide([elem]);
              }
            }
            if (display === "inline" || display === "inline-block" && restoreDisplay != null) {
              if (jQuery2.css(elem, "float") === "none") {
                if (!propTween) {
                  anim.done(function() {
                    style2.display = restoreDisplay;
                  });
                  if (restoreDisplay == null) {
                    display = style2.display;
                    restoreDisplay = display === "none" ? "" : display;
                  }
                }
                style2.display = "inline-block";
              }
            }
          }
          if (opts.overflow) {
            style2.overflow = "hidden";
            anim.always(function() {
              style2.overflow = opts.overflow[0];
              style2.overflowX = opts.overflow[1];
              style2.overflowY = opts.overflow[2];
            });
          }
          propTween = false;
          for (prop in orig) {
            if (!propTween) {
              if (dataShow) {
                if ("hidden" in dataShow) {
                  hidden = dataShow.hidden;
                }
              } else {
                dataShow = dataPriv.access(elem, "fxshow", { display: restoreDisplay });
              }
              if (toggle) {
                dataShow.hidden = !hidden;
              }
              if (hidden) {
                showHide([elem], true);
              }
              anim.done(function() {
                if (!hidden) {
                  showHide([elem]);
                }
                dataPriv.remove(elem, "fxshow");
                for (prop in orig) {
                  jQuery2.style(elem, prop, orig[prop]);
                }
              });
            }
            propTween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
            if (!(prop in dataShow)) {
              dataShow[prop] = propTween.start;
              if (hidden) {
                propTween.end = propTween.start;
                propTween.start = 0;
              }
            }
          }
        }
        function propFilter(props, specialEasing) {
          var index, name, easing, value, hooks;
          for (index in props) {
            name = camelCase(index);
            easing = specialEasing[name];
            value = props[index];
            if (Array.isArray(value)) {
              easing = value[1];
              value = props[index] = value[0];
            }
            if (index !== name) {
              props[name] = value;
              delete props[index];
            }
            hooks = jQuery2.cssHooks[name];
            if (hooks && "expand" in hooks) {
              value = hooks.expand(value);
              delete props[name];
              for (index in value) {
                if (!(index in props)) {
                  props[index] = value[index];
                  specialEasing[index] = easing;
                }
              }
            } else {
              specialEasing[name] = easing;
            }
          }
        }
        function Animation(elem, properties, options) {
          var result, stopped, index = 0, length = Animation.prefilters.length, deferred = jQuery2.Deferred().always(function() {
            delete tick.elem;
          }), tick = function() {
            if (stopped) {
              return false;
            }
            var currentTime = fxNow || createFxNow(), remaining = Math.max(0, animation.startTime + animation.duration - currentTime), temp = remaining / animation.duration || 0, percent = 1 - temp, index2 = 0, length2 = animation.tweens.length;
            for (; index2 < length2; index2++) {
              animation.tweens[index2].run(percent);
            }
            deferred.notifyWith(elem, [animation, percent, remaining]);
            if (percent < 1 && length2) {
              return remaining;
            }
            if (!length2) {
              deferred.notifyWith(elem, [animation, 1, 0]);
            }
            deferred.resolveWith(elem, [animation]);
            return false;
          }, animation = deferred.promise({
            elem,
            props: jQuery2.extend({}, properties),
            opts: jQuery2.extend(true, {
              specialEasing: {},
              easing: jQuery2.easing._default
            }, options),
            originalProperties: properties,
            originalOptions: options,
            startTime: fxNow || createFxNow(),
            duration: options.duration,
            tweens: [],
            createTween: function(prop, end) {
              var tween = jQuery2.Tween(
                elem,
                animation.opts,
                prop,
                end,
                animation.opts.specialEasing[prop] || animation.opts.easing
              );
              animation.tweens.push(tween);
              return tween;
            },
            stop: function(gotoEnd) {
              var index2 = 0, length2 = gotoEnd ? animation.tweens.length : 0;
              if (stopped) {
                return this;
              }
              stopped = true;
              for (; index2 < length2; index2++) {
                animation.tweens[index2].run(1);
              }
              if (gotoEnd) {
                deferred.notifyWith(elem, [animation, 1, 0]);
                deferred.resolveWith(elem, [animation, gotoEnd]);
              } else {
                deferred.rejectWith(elem, [animation, gotoEnd]);
              }
              return this;
            }
          }), props = animation.props;
          propFilter(props, animation.opts.specialEasing);
          for (; index < length; index++) {
            result = Animation.prefilters[index].call(animation, elem, props, animation.opts);
            if (result) {
              if (isFunction(result.stop)) {
                jQuery2._queueHooks(animation.elem, animation.opts.queue).stop = result.stop.bind(result);
              }
              return result;
            }
          }
          jQuery2.map(props, createTween, animation);
          if (isFunction(animation.opts.start)) {
            animation.opts.start.call(elem, animation);
          }
          animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
          jQuery2.fx.timer(
            jQuery2.extend(tick, {
              elem,
              anim: animation,
              queue: animation.opts.queue
            })
          );
          return animation;
        }
        jQuery2.Animation = jQuery2.extend(Animation, {
          tweeners: {
            "*": [function(prop, value) {
              var tween = this.createTween(prop, value);
              adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
              return tween;
            }]
          },
          tweener: function(props, callback) {
            if (isFunction(props)) {
              callback = props;
              props = ["*"];
            } else {
              props = props.match(rnothtmlwhite);
            }
            var prop, index = 0, length = props.length;
            for (; index < length; index++) {
              prop = props[index];
              Animation.tweeners[prop] = Animation.tweeners[prop] || [];
              Animation.tweeners[prop].unshift(callback);
            }
          },
          prefilters: [defaultPrefilter],
          prefilter: function(callback, prepend) {
            if (prepend) {
              Animation.prefilters.unshift(callback);
            } else {
              Animation.prefilters.push(callback);
            }
          }
        });
        jQuery2.speed = function(speed, easing, fn) {
          var opt = speed && typeof speed === "object" ? jQuery2.extend({}, speed) : {
            complete: fn || !fn && easing || isFunction(speed) && speed,
            duration: speed,
            easing: fn && easing || easing && !isFunction(easing) && easing
          };
          if (jQuery2.fx.off) {
            opt.duration = 0;
          } else {
            if (typeof opt.duration !== "number") {
              if (opt.duration in jQuery2.fx.speeds) {
                opt.duration = jQuery2.fx.speeds[opt.duration];
              } else {
                opt.duration = jQuery2.fx.speeds._default;
              }
            }
          }
          if (opt.queue == null || opt.queue === true) {
            opt.queue = "fx";
          }
          opt.old = opt.complete;
          opt.complete = function() {
            if (isFunction(opt.old)) {
              opt.old.call(this);
            }
            if (opt.queue) {
              jQuery2.dequeue(this, opt.queue);
            }
          };
          return opt;
        };
        jQuery2.fn.extend({
          fadeTo: function(speed, to, easing, callback) {
            return this.filter(isHiddenWithinTree).css("opacity", 0).show().end().animate({ opacity: to }, speed, easing, callback);
          },
          animate: function(prop, speed, easing, callback) {
            var empty2 = jQuery2.isEmptyObject(prop), optall = jQuery2.speed(speed, easing, callback), doAnimation = function() {
              var anim = Animation(this, jQuery2.extend({}, prop), optall);
              if (empty2 || dataPriv.get(this, "finish")) {
                anim.stop(true);
              }
            };
            doAnimation.finish = doAnimation;
            return empty2 || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
          },
          stop: function(type2, clearQueue, gotoEnd) {
            var stopQueue = function(hooks) {
              var stop = hooks.stop;
              delete hooks.stop;
              stop(gotoEnd);
            };
            if (typeof type2 !== "string") {
              gotoEnd = clearQueue;
              clearQueue = type2;
              type2 = void 0;
            }
            if (clearQueue) {
              this.queue(type2 || "fx", []);
            }
            return this.each(function() {
              var dequeue = true, index = type2 != null && type2 + "queueHooks", timers = jQuery2.timers, data = dataPriv.get(this);
              if (index) {
                if (data[index] && data[index].stop) {
                  stopQueue(data[index]);
                }
              } else {
                for (index in data) {
                  if (data[index] && data[index].stop && rrun.test(index)) {
                    stopQueue(data[index]);
                  }
                }
              }
              for (index = timers.length; index--; ) {
                if (timers[index].elem === this && (type2 == null || timers[index].queue === type2)) {
                  timers[index].anim.stop(gotoEnd);
                  dequeue = false;
                  timers.splice(index, 1);
                }
              }
              if (dequeue || !gotoEnd) {
                jQuery2.dequeue(this, type2);
              }
            });
          },
          finish: function(type2) {
            if (type2 !== false) {
              type2 = type2 || "fx";
            }
            return this.each(function() {
              var index, data = dataPriv.get(this), queue = data[type2 + "queue"], hooks = data[type2 + "queueHooks"], timers = jQuery2.timers, length = queue ? queue.length : 0;
              data.finish = true;
              jQuery2.queue(this, type2, []);
              if (hooks && hooks.stop) {
                hooks.stop.call(this, true);
              }
              for (index = timers.length; index--; ) {
                if (timers[index].elem === this && timers[index].queue === type2) {
                  timers[index].anim.stop(true);
                  timers.splice(index, 1);
                }
              }
              for (index = 0; index < length; index++) {
                if (queue[index] && queue[index].finish) {
                  queue[index].finish.call(this);
                }
              }
              delete data.finish;
            });
          }
        });
        jQuery2.each(["toggle", "show", "hide"], function(_i, name) {
          var cssFn = jQuery2.fn[name];
          jQuery2.fn[name] = function(speed, easing, callback) {
            return speed == null || typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
          };
        });
        jQuery2.each({
          slideDown: genFx("show"),
          slideUp: genFx("hide"),
          slideToggle: genFx("toggle"),
          fadeIn: { opacity: "show" },
          fadeOut: { opacity: "hide" },
          fadeToggle: { opacity: "toggle" }
        }, function(name, props) {
          jQuery2.fn[name] = function(speed, easing, callback) {
            return this.animate(props, speed, easing, callback);
          };
        });
        jQuery2.timers = [];
        jQuery2.fx.tick = function() {
          var timer2, i2 = 0, timers = jQuery2.timers;
          fxNow = Date.now();
          for (; i2 < timers.length; i2++) {
            timer2 = timers[i2];
            if (!timer2() && timers[i2] === timer2) {
              timers.splice(i2--, 1);
            }
          }
          if (!timers.length) {
            jQuery2.fx.stop();
          }
          fxNow = void 0;
        };
        jQuery2.fx.timer = function(timer2) {
          jQuery2.timers.push(timer2);
          jQuery2.fx.start();
        };
        jQuery2.fx.interval = 13;
        jQuery2.fx.start = function() {
          if (inProgress) {
            return;
          }
          inProgress = true;
          schedule();
        };
        jQuery2.fx.stop = function() {
          inProgress = null;
        };
        jQuery2.fx.speeds = {
          slow: 600,
          fast: 200,
          _default: 400
        };
        jQuery2.fn.delay = function(time, type2) {
          time = jQuery2.fx ? jQuery2.fx.speeds[time] || time : time;
          type2 = type2 || "fx";
          return this.queue(type2, function(next, hooks) {
            var timeout2 = window2.setTimeout(next, time);
            hooks.stop = function() {
              window2.clearTimeout(timeout2);
            };
          });
        };
        (function() {
          var input = document2.createElement("input"), select = document2.createElement("select"), opt = select.appendChild(document2.createElement("option"));
          input.type = "checkbox";
          support.checkOn = input.value !== "";
          support.optSelected = opt.selected;
          input = document2.createElement("input");
          input.value = "t";
          input.type = "radio";
          support.radioValue = input.value === "t";
        })();
        var boolHook, attrHandle = jQuery2.expr.attrHandle;
        jQuery2.fn.extend({
          attr: function(name, value) {
            return access(this, jQuery2.attr, name, value, arguments.length > 1);
          },
          removeAttr: function(name) {
            return this.each(function() {
              jQuery2.removeAttr(this, name);
            });
          }
        });
        jQuery2.extend({
          attr: function(elem, name, value) {
            var ret, hooks, nType = elem.nodeType;
            if (nType === 3 || nType === 8 || nType === 2) {
              return;
            }
            if (typeof elem.getAttribute === "undefined") {
              return jQuery2.prop(elem, name, value);
            }
            if (nType !== 1 || !jQuery2.isXMLDoc(elem)) {
              hooks = jQuery2.attrHooks[name.toLowerCase()] || (jQuery2.expr.match.bool.test(name) ? boolHook : void 0);
            }
            if (value !== void 0) {
              if (value === null) {
                jQuery2.removeAttr(elem, name);
                return;
              }
              if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== void 0) {
                return ret;
              }
              elem.setAttribute(name, value + "");
              return value;
            }
            if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
              return ret;
            }
            ret = jQuery2.find.attr(elem, name);
            return ret == null ? void 0 : ret;
          },
          attrHooks: {
            type: {
              set: function(elem, value) {
                if (!support.radioValue && value === "radio" && nodeName(elem, "input")) {
                  var val = elem.value;
                  elem.setAttribute("type", value);
                  if (val) {
                    elem.value = val;
                  }
                  return value;
                }
              }
            }
          },
          removeAttr: function(elem, value) {
            var name, i2 = 0, attrNames = value && value.match(rnothtmlwhite);
            if (attrNames && elem.nodeType === 1) {
              while (name = attrNames[i2++]) {
                elem.removeAttribute(name);
              }
            }
          }
        });
        boolHook = {
          set: function(elem, value, name) {
            if (value === false) {
              jQuery2.removeAttr(elem, name);
            } else {
              elem.setAttribute(name, name);
            }
            return name;
          }
        };
        jQuery2.each(jQuery2.expr.match.bool.source.match(/\w+/g), function(_i, name) {
          var getter = attrHandle[name] || jQuery2.find.attr;
          attrHandle[name] = function(elem, name2, isXML) {
            var ret, handle, lowercaseName = name2.toLowerCase();
            if (!isXML) {
              handle = attrHandle[lowercaseName];
              attrHandle[lowercaseName] = ret;
              ret = getter(elem, name2, isXML) != null ? lowercaseName : null;
              attrHandle[lowercaseName] = handle;
            }
            return ret;
          };
        });
        var rfocusable = /^(?:input|select|textarea|button)$/i, rclickable = /^(?:a|area)$/i;
        jQuery2.fn.extend({
          prop: function(name, value) {
            return access(this, jQuery2.prop, name, value, arguments.length > 1);
          },
          removeProp: function(name) {
            return this.each(function() {
              delete this[jQuery2.propFix[name] || name];
            });
          }
        });
        jQuery2.extend({
          prop: function(elem, name, value) {
            var ret, hooks, nType = elem.nodeType;
            if (nType === 3 || nType === 8 || nType === 2) {
              return;
            }
            if (nType !== 1 || !jQuery2.isXMLDoc(elem)) {
              name = jQuery2.propFix[name] || name;
              hooks = jQuery2.propHooks[name];
            }
            if (value !== void 0) {
              if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== void 0) {
                return ret;
              }
              return elem[name] = value;
            }
            if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
              return ret;
            }
            return elem[name];
          },
          propHooks: {
            tabIndex: {
              get: function(elem) {
                var tabindex = jQuery2.find.attr(elem, "tabindex");
                if (tabindex) {
                  return parseInt(tabindex, 10);
                }
                if (rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href) {
                  return 0;
                }
                return -1;
              }
            }
          },
          propFix: {
            "for": "htmlFor",
            "class": "className"
          }
        });
        if (!support.optSelected) {
          jQuery2.propHooks.selected = {
            get: function(elem) {
              var parent = elem.parentNode;
              if (parent && parent.parentNode) {
                parent.parentNode.selectedIndex;
              }
              return null;
            },
            set: function(elem) {
              var parent = elem.parentNode;
              if (parent) {
                parent.selectedIndex;
                if (parent.parentNode) {
                  parent.parentNode.selectedIndex;
                }
              }
            }
          };
        }
        jQuery2.each([
          "tabIndex",
          "readOnly",
          "maxLength",
          "cellSpacing",
          "cellPadding",
          "rowSpan",
          "colSpan",
          "useMap",
          "frameBorder",
          "contentEditable"
        ], function() {
          jQuery2.propFix[this.toLowerCase()] = this;
        });
        function stripAndCollapse(value) {
          var tokens = value.match(rnothtmlwhite) || [];
          return tokens.join(" ");
        }
        function getClass(elem) {
          return elem.getAttribute && elem.getAttribute("class") || "";
        }
        function classesToArray(value) {
          if (Array.isArray(value)) {
            return value;
          }
          if (typeof value === "string") {
            return value.match(rnothtmlwhite) || [];
          }
          return [];
        }
        jQuery2.fn.extend({
          addClass: function(value) {
            var classes, elem, cur, curValue, clazz, j2, finalValue, i2 = 0;
            if (isFunction(value)) {
              return this.each(function(j3) {
                jQuery2(this).addClass(value.call(this, j3, getClass(this)));
              });
            }
            classes = classesToArray(value);
            if (classes.length) {
              while (elem = this[i2++]) {
                curValue = getClass(elem);
                cur = elem.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
                if (cur) {
                  j2 = 0;
                  while (clazz = classes[j2++]) {
                    if (cur.indexOf(" " + clazz + " ") < 0) {
                      cur += clazz + " ";
                    }
                  }
                  finalValue = stripAndCollapse(cur);
                  if (curValue !== finalValue) {
                    elem.setAttribute("class", finalValue);
                  }
                }
              }
            }
            return this;
          },
          removeClass: function(value) {
            var classes, elem, cur, curValue, clazz, j2, finalValue, i2 = 0;
            if (isFunction(value)) {
              return this.each(function(j3) {
                jQuery2(this).removeClass(value.call(this, j3, getClass(this)));
              });
            }
            if (!arguments.length) {
              return this.attr("class", "");
            }
            classes = classesToArray(value);
            if (classes.length) {
              while (elem = this[i2++]) {
                curValue = getClass(elem);
                cur = elem.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
                if (cur) {
                  j2 = 0;
                  while (clazz = classes[j2++]) {
                    while (cur.indexOf(" " + clazz + " ") > -1) {
                      cur = cur.replace(" " + clazz + " ", " ");
                    }
                  }
                  finalValue = stripAndCollapse(cur);
                  if (curValue !== finalValue) {
                    elem.setAttribute("class", finalValue);
                  }
                }
              }
            }
            return this;
          },
          toggleClass: function(value, stateVal) {
            var type2 = typeof value, isValidValue = type2 === "string" || Array.isArray(value);
            if (typeof stateVal === "boolean" && isValidValue) {
              return stateVal ? this.addClass(value) : this.removeClass(value);
            }
            if (isFunction(value)) {
              return this.each(function(i2) {
                jQuery2(this).toggleClass(
                  value.call(this, i2, getClass(this), stateVal),
                  stateVal
                );
              });
            }
            return this.each(function() {
              var className, i2, self, classNames;
              if (isValidValue) {
                i2 = 0;
                self = jQuery2(this);
                classNames = classesToArray(value);
                while (className = classNames[i2++]) {
                  if (self.hasClass(className)) {
                    self.removeClass(className);
                  } else {
                    self.addClass(className);
                  }
                }
              } else if (value === void 0 || type2 === "boolean") {
                className = getClass(this);
                if (className) {
                  dataPriv.set(this, "__className__", className);
                }
                if (this.setAttribute) {
                  this.setAttribute(
                    "class",
                    className || value === false ? "" : dataPriv.get(this, "__className__") || ""
                  );
                }
              }
            });
          },
          hasClass: function(selector) {
            var className, elem, i2 = 0;
            className = " " + selector + " ";
            while (elem = this[i2++]) {
              if (elem.nodeType === 1 && (" " + stripAndCollapse(getClass(elem)) + " ").indexOf(className) > -1) {
                return true;
              }
            }
            return false;
          }
        });
        var rreturn = /\r/g;
        jQuery2.fn.extend({
          val: function(value) {
            var hooks, ret, valueIsFunction, elem = this[0];
            if (!arguments.length) {
              if (elem) {
                hooks = jQuery2.valHooks[elem.type] || jQuery2.valHooks[elem.nodeName.toLowerCase()];
                if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== void 0) {
                  return ret;
                }
                ret = elem.value;
                if (typeof ret === "string") {
                  return ret.replace(rreturn, "");
                }
                return ret == null ? "" : ret;
              }
              return;
            }
            valueIsFunction = isFunction(value);
            return this.each(function(i2) {
              var val;
              if (this.nodeType !== 1) {
                return;
              }
              if (valueIsFunction) {
                val = value.call(this, i2, jQuery2(this).val());
              } else {
                val = value;
              }
              if (val == null) {
                val = "";
              } else if (typeof val === "number") {
                val += "";
              } else if (Array.isArray(val)) {
                val = jQuery2.map(val, function(value2) {
                  return value2 == null ? "" : value2 + "";
                });
              }
              hooks = jQuery2.valHooks[this.type] || jQuery2.valHooks[this.nodeName.toLowerCase()];
              if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === void 0) {
                this.value = val;
              }
            });
          }
        });
        jQuery2.extend({
          valHooks: {
            option: {
              get: function(elem) {
                var val = jQuery2.find.attr(elem, "value");
                return val != null ? val : stripAndCollapse(jQuery2.text(elem));
              }
            },
            select: {
              get: function(elem) {
                var value, option, i2, options = elem.options, index = elem.selectedIndex, one2 = elem.type === "select-one", values = one2 ? null : [], max5 = one2 ? index + 1 : options.length;
                if (index < 0) {
                  i2 = max5;
                } else {
                  i2 = one2 ? index : 0;
                }
                for (; i2 < max5; i2++) {
                  option = options[i2];
                  if ((option.selected || i2 === index) && !option.disabled && (!option.parentNode.disabled || !nodeName(option.parentNode, "optgroup"))) {
                    value = jQuery2(option).val();
                    if (one2) {
                      return value;
                    }
                    values.push(value);
                  }
                }
                return values;
              },
              set: function(elem, value) {
                var optionSet, option, options = elem.options, values = jQuery2.makeArray(value), i2 = options.length;
                while (i2--) {
                  option = options[i2];
                  if (option.selected = jQuery2.inArray(jQuery2.valHooks.option.get(option), values) > -1) {
                    optionSet = true;
                  }
                }
                if (!optionSet) {
                  elem.selectedIndex = -1;
                }
                return values;
              }
            }
          }
        });
        jQuery2.each(["radio", "checkbox"], function() {
          jQuery2.valHooks[this] = {
            set: function(elem, value) {
              if (Array.isArray(value)) {
                return elem.checked = jQuery2.inArray(jQuery2(elem).val(), value) > -1;
              }
            }
          };
          if (!support.checkOn) {
            jQuery2.valHooks[this].get = function(elem) {
              return elem.getAttribute("value") === null ? "on" : elem.value;
            };
          }
        });
        support.focusin = "onfocusin" in window2;
        var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, stopPropagationCallback = function(e) {
          e.stopPropagation();
        };
        jQuery2.extend(jQuery2.event, {
          trigger: function(event, data, elem, onlyHandlers) {
            var i2, cur, tmp, bubbleType, ontype, handle, special, lastElement, eventPath = [elem || document2], type2 = hasOwn.call(event, "type") ? event.type : event, namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
            cur = lastElement = tmp = elem = elem || document2;
            if (elem.nodeType === 3 || elem.nodeType === 8) {
              return;
            }
            if (rfocusMorph.test(type2 + jQuery2.event.triggered)) {
              return;
            }
            if (type2.indexOf(".") > -1) {
              namespaces = type2.split(".");
              type2 = namespaces.shift();
              namespaces.sort();
            }
            ontype = type2.indexOf(":") < 0 && "on" + type2;
            event = event[jQuery2.expando] ? event : new jQuery2.Event(type2, typeof event === "object" && event);
            event.isTrigger = onlyHandlers ? 2 : 3;
            event.namespace = namespaces.join(".");
            event.rnamespace = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
            event.result = void 0;
            if (!event.target) {
              event.target = elem;
            }
            data = data == null ? [event] : jQuery2.makeArray(data, [event]);
            special = jQuery2.event.special[type2] || {};
            if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
              return;
            }
            if (!onlyHandlers && !special.noBubble && !isWindow(elem)) {
              bubbleType = special.delegateType || type2;
              if (!rfocusMorph.test(bubbleType + type2)) {
                cur = cur.parentNode;
              }
              for (; cur; cur = cur.parentNode) {
                eventPath.push(cur);
                tmp = cur;
              }
              if (tmp === (elem.ownerDocument || document2)) {
                eventPath.push(tmp.defaultView || tmp.parentWindow || window2);
              }
            }
            i2 = 0;
            while ((cur = eventPath[i2++]) && !event.isPropagationStopped()) {
              lastElement = cur;
              event.type = i2 > 1 ? bubbleType : special.bindType || type2;
              handle = (dataPriv.get(cur, "events") || /* @__PURE__ */ Object.create(null))[event.type] && dataPriv.get(cur, "handle");
              if (handle) {
                handle.apply(cur, data);
              }
              handle = ontype && cur[ontype];
              if (handle && handle.apply && acceptData(cur)) {
                event.result = handle.apply(cur, data);
                if (event.result === false) {
                  event.preventDefault();
                }
              }
            }
            event.type = type2;
            if (!onlyHandlers && !event.isDefaultPrevented()) {
              if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && acceptData(elem)) {
                if (ontype && isFunction(elem[type2]) && !isWindow(elem)) {
                  tmp = elem[ontype];
                  if (tmp) {
                    elem[ontype] = null;
                  }
                  jQuery2.event.triggered = type2;
                  if (event.isPropagationStopped()) {
                    lastElement.addEventListener(type2, stopPropagationCallback);
                  }
                  elem[type2]();
                  if (event.isPropagationStopped()) {
                    lastElement.removeEventListener(type2, stopPropagationCallback);
                  }
                  jQuery2.event.triggered = void 0;
                  if (tmp) {
                    elem[ontype] = tmp;
                  }
                }
              }
            }
            return event.result;
          },
          simulate: function(type2, elem, event) {
            var e = jQuery2.extend(
              new jQuery2.Event(),
              event,
              {
                type: type2,
                isSimulated: true
              }
            );
            jQuery2.event.trigger(e, null, elem);
          }
        });
        jQuery2.fn.extend({
          trigger: function(type2, data) {
            return this.each(function() {
              jQuery2.event.trigger(type2, data, this);
            });
          },
          triggerHandler: function(type2, data) {
            var elem = this[0];
            if (elem) {
              return jQuery2.event.trigger(type2, data, elem, true);
            }
          }
        });
        if (!support.focusin) {
          jQuery2.each({ focus: "focusin", blur: "focusout" }, function(orig, fix) {
            var handler = function(event) {
              jQuery2.event.simulate(fix, event.target, jQuery2.event.fix(event));
            };
            jQuery2.event.special[fix] = {
              setup: function() {
                var doc = this.ownerDocument || this.document || this, attaches = dataPriv.access(doc, fix);
                if (!attaches) {
                  doc.addEventListener(orig, handler, true);
                }
                dataPriv.access(doc, fix, (attaches || 0) + 1);
              },
              teardown: function() {
                var doc = this.ownerDocument || this.document || this, attaches = dataPriv.access(doc, fix) - 1;
                if (!attaches) {
                  doc.removeEventListener(orig, handler, true);
                  dataPriv.remove(doc, fix);
                } else {
                  dataPriv.access(doc, fix, attaches);
                }
              }
            };
          });
        }
        var location2 = window2.location;
        var nonce = { guid: Date.now() };
        var rquery = /\?/;
        jQuery2.parseXML = function(data) {
          var xml, parserErrorElem;
          if (!data || typeof data !== "string") {
            return null;
          }
          try {
            xml = new window2.DOMParser().parseFromString(data, "text/xml");
          } catch (e) {
          }
          parserErrorElem = xml && xml.getElementsByTagName("parsererror")[0];
          if (!xml || parserErrorElem) {
            jQuery2.error("Invalid XML: " + (parserErrorElem ? jQuery2.map(parserErrorElem.childNodes, function(el) {
              return el.textContent;
            }).join("\n") : data));
          }
          return xml;
        };
        var rbracket = /\[\]$/, rCRLF = /\r?\n/g, rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, rsubmittable = /^(?:input|select|textarea|keygen)/i;
        function buildParams(prefix, obj, traditional, add) {
          var name;
          if (Array.isArray(obj)) {
            jQuery2.each(obj, function(i2, v) {
              if (traditional || rbracket.test(prefix)) {
                add(prefix, v);
              } else {
                buildParams(
                  prefix + "[" + (typeof v === "object" && v != null ? i2 : "") + "]",
                  v,
                  traditional,
                  add
                );
              }
            });
          } else if (!traditional && toType(obj) === "object") {
            for (name in obj) {
              buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
            }
          } else {
            add(prefix, obj);
          }
        }
        jQuery2.param = function(a, traditional) {
          var prefix, s = [], add = function(key, valueOrFunction) {
            var value = isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;
            s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? "" : value);
          };
          if (a == null) {
            return "";
          }
          if (Array.isArray(a) || a.jquery && !jQuery2.isPlainObject(a)) {
            jQuery2.each(a, function() {
              add(this.name, this.value);
            });
          } else {
            for (prefix in a) {
              buildParams(prefix, a[prefix], traditional, add);
            }
          }
          return s.join("&");
        };
        jQuery2.fn.extend({
          serialize: function() {
            return jQuery2.param(this.serializeArray());
          },
          serializeArray: function() {
            return this.map(function() {
              var elements = jQuery2.prop(this, "elements");
              return elements ? jQuery2.makeArray(elements) : this;
            }).filter(function() {
              var type2 = this.type;
              return this.name && !jQuery2(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type2) && (this.checked || !rcheckableType.test(type2));
            }).map(function(_i, elem) {
              var val = jQuery2(this).val();
              if (val == null) {
                return null;
              }
              if (Array.isArray(val)) {
                return jQuery2.map(val, function(val2) {
                  return { name: elem.name, value: val2.replace(rCRLF, "\r\n") };
                });
              }
              return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
            }).get();
          }
        });
        var r20 = /%20/g, rhash = /#.*$/, rantiCache = /([?&])_=[^&]*/, rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg, rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, prefilters = {}, transports = {}, allTypes = "*/".concat("*"), originAnchor = document2.createElement("a");
        originAnchor.href = location2.href;
        function addToPrefiltersOrTransports(structure) {
          return function(dataTypeExpression, func) {
            if (typeof dataTypeExpression !== "string") {
              func = dataTypeExpression;
              dataTypeExpression = "*";
            }
            var dataType, i2 = 0, dataTypes = dataTypeExpression.toLowerCase().match(rnothtmlwhite) || [];
            if (isFunction(func)) {
              while (dataType = dataTypes[i2++]) {
                if (dataType[0] === "+") {
                  dataType = dataType.slice(1) || "*";
                  (structure[dataType] = structure[dataType] || []).unshift(func);
                } else {
                  (structure[dataType] = structure[dataType] || []).push(func);
                }
              }
            }
          };
        }
        function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
          var inspected = {}, seekingTransport = structure === transports;
          function inspect(dataType) {
            var selected;
            inspected[dataType] = true;
            jQuery2.each(structure[dataType] || [], function(_, prefilterOrFactory) {
              var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
              if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {
                options.dataTypes.unshift(dataTypeOrTransport);
                inspect(dataTypeOrTransport);
                return false;
              } else if (seekingTransport) {
                return !(selected = dataTypeOrTransport);
              }
            });
            return selected;
          }
          return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
        }
        function ajaxExtend(target, src) {
          var key, deep, flatOptions = jQuery2.ajaxSettings.flatOptions || {};
          for (key in src) {
            if (src[key] !== void 0) {
              (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
            }
          }
          if (deep) {
            jQuery2.extend(true, target, deep);
          }
          return target;
        }
        function ajaxHandleResponses(s, jqXHR, responses) {
          var ct, type2, finalDataType, firstDataType, contents = s.contents, dataTypes = s.dataTypes;
          while (dataTypes[0] === "*") {
            dataTypes.shift();
            if (ct === void 0) {
              ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
            }
          }
          if (ct) {
            for (type2 in contents) {
              if (contents[type2] && contents[type2].test(ct)) {
                dataTypes.unshift(type2);
                break;
              }
            }
          }
          if (dataTypes[0] in responses) {
            finalDataType = dataTypes[0];
          } else {
            for (type2 in responses) {
              if (!dataTypes[0] || s.converters[type2 + " " + dataTypes[0]]) {
                finalDataType = type2;
                break;
              }
              if (!firstDataType) {
                firstDataType = type2;
              }
            }
            finalDataType = finalDataType || firstDataType;
          }
          if (finalDataType) {
            if (finalDataType !== dataTypes[0]) {
              dataTypes.unshift(finalDataType);
            }
            return responses[finalDataType];
          }
        }
        function ajaxConvert(s, response, jqXHR, isSuccess) {
          var conv2, current, conv, tmp, prev, converters = {}, dataTypes = s.dataTypes.slice();
          if (dataTypes[1]) {
            for (conv in s.converters) {
              converters[conv.toLowerCase()] = s.converters[conv];
            }
          }
          current = dataTypes.shift();
          while (current) {
            if (s.responseFields[current]) {
              jqXHR[s.responseFields[current]] = response;
            }
            if (!prev && isSuccess && s.dataFilter) {
              response = s.dataFilter(response, s.dataType);
            }
            prev = current;
            current = dataTypes.shift();
            if (current) {
              if (current === "*") {
                current = prev;
              } else if (prev !== "*" && prev !== current) {
                conv = converters[prev + " " + current] || converters["* " + current];
                if (!conv) {
                  for (conv2 in converters) {
                    tmp = conv2.split(" ");
                    if (tmp[1] === current) {
                      conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
                      if (conv) {
                        if (conv === true) {
                          conv = converters[conv2];
                        } else if (converters[conv2] !== true) {
                          current = tmp[0];
                          dataTypes.unshift(tmp[1]);
                        }
                        break;
                      }
                    }
                  }
                }
                if (conv !== true) {
                  if (conv && s.throws) {
                    response = conv(response);
                  } else {
                    try {
                      response = conv(response);
                    } catch (e) {
                      return {
                        state: "parsererror",
                        error: conv ? e : "No conversion from " + prev + " to " + current
                      };
                    }
                  }
                }
              }
            }
          }
          return { state: "success", data: response };
        }
        jQuery2.extend({
          active: 0,
          lastModified: {},
          etag: {},
          ajaxSettings: {
            url: location2.href,
            type: "GET",
            isLocal: rlocalProtocol.test(location2.protocol),
            global: true,
            processData: true,
            async: true,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
              "*": allTypes,
              text: "text/plain",
              html: "text/html",
              xml: "application/xml, text/xml",
              json: "application/json, text/javascript"
            },
            contents: {
              xml: /\bxml\b/,
              html: /\bhtml/,
              json: /\bjson\b/
            },
            responseFields: {
              xml: "responseXML",
              text: "responseText",
              json: "responseJSON"
            },
            converters: {
              "* text": String,
              "text html": true,
              "text json": JSON.parse,
              "text xml": jQuery2.parseXML
            },
            flatOptions: {
              url: true,
              context: true
            }
          },
          ajaxSetup: function(target, settings) {
            return settings ? ajaxExtend(ajaxExtend(target, jQuery2.ajaxSettings), settings) : ajaxExtend(jQuery2.ajaxSettings, target);
          },
          ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
          ajaxTransport: addToPrefiltersOrTransports(transports),
          ajax: function(url, options) {
            if (typeof url === "object") {
              options = url;
              url = void 0;
            }
            options = options || {};
            var transport, cacheURL, responseHeadersString, responseHeaders, timeoutTimer, urlAnchor, completed2, fireGlobals, i2, uncached, s = jQuery2.ajaxSetup({}, options), callbackContext = s.context || s, globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery2(callbackContext) : jQuery2.event, deferred = jQuery2.Deferred(), completeDeferred = jQuery2.Callbacks("once memory"), statusCode = s.statusCode || {}, requestHeaders = {}, requestHeadersNames = {}, strAbort = "canceled", jqXHR = {
              readyState: 0,
              getResponseHeader: function(key) {
                var match;
                if (completed2) {
                  if (!responseHeaders) {
                    responseHeaders = {};
                    while (match = rheaders.exec(responseHeadersString)) {
                      responseHeaders[match[1].toLowerCase() + " "] = (responseHeaders[match[1].toLowerCase() + " "] || []).concat(match[2]);
                    }
                  }
                  match = responseHeaders[key.toLowerCase() + " "];
                }
                return match == null ? null : match.join(", ");
              },
              getAllResponseHeaders: function() {
                return completed2 ? responseHeadersString : null;
              },
              setRequestHeader: function(name, value) {
                if (completed2 == null) {
                  name = requestHeadersNames[name.toLowerCase()] = requestHeadersNames[name.toLowerCase()] || name;
                  requestHeaders[name] = value;
                }
                return this;
              },
              overrideMimeType: function(type2) {
                if (completed2 == null) {
                  s.mimeType = type2;
                }
                return this;
              },
              statusCode: function(map2) {
                var code;
                if (map2) {
                  if (completed2) {
                    jqXHR.always(map2[jqXHR.status]);
                  } else {
                    for (code in map2) {
                      statusCode[code] = [statusCode[code], map2[code]];
                    }
                  }
                }
                return this;
              },
              abort: function(statusText) {
                var finalText = statusText || strAbort;
                if (transport) {
                  transport.abort(finalText);
                }
                done(0, finalText);
                return this;
              }
            };
            deferred.promise(jqXHR);
            s.url = ((url || s.url || location2.href) + "").replace(rprotocol, location2.protocol + "//");
            s.type = options.method || options.type || s.method || s.type;
            s.dataTypes = (s.dataType || "*").toLowerCase().match(rnothtmlwhite) || [""];
            if (s.crossDomain == null) {
              urlAnchor = document2.createElement("a");
              try {
                urlAnchor.href = s.url;
                urlAnchor.href = urlAnchor.href;
                s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host;
              } catch (e) {
                s.crossDomain = true;
              }
            }
            if (s.data && s.processData && typeof s.data !== "string") {
              s.data = jQuery2.param(s.data, s.traditional);
            }
            inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);
            if (completed2) {
              return jqXHR;
            }
            fireGlobals = jQuery2.event && s.global;
            if (fireGlobals && jQuery2.active++ === 0) {
              jQuery2.event.trigger("ajaxStart");
            }
            s.type = s.type.toUpperCase();
            s.hasContent = !rnoContent.test(s.type);
            cacheURL = s.url.replace(rhash, "");
            if (!s.hasContent) {
              uncached = s.url.slice(cacheURL.length);
              if (s.data && (s.processData || typeof s.data === "string")) {
                cacheURL += (rquery.test(cacheURL) ? "&" : "?") + s.data;
                delete s.data;
              }
              if (s.cache === false) {
                cacheURL = cacheURL.replace(rantiCache, "$1");
                uncached = (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce.guid++ + uncached;
              }
              s.url = cacheURL + uncached;
            } else if (s.data && s.processData && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0) {
              s.data = s.data.replace(r20, "+");
            }
            if (s.ifModified) {
              if (jQuery2.lastModified[cacheURL]) {
                jqXHR.setRequestHeader("If-Modified-Since", jQuery2.lastModified[cacheURL]);
              }
              if (jQuery2.etag[cacheURL]) {
                jqXHR.setRequestHeader("If-None-Match", jQuery2.etag[cacheURL]);
              }
            }
            if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
              jqXHR.setRequestHeader("Content-Type", s.contentType);
            }
            jqXHR.setRequestHeader(
              "Accept",
              s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]
            );
            for (i2 in s.headers) {
              jqXHR.setRequestHeader(i2, s.headers[i2]);
            }
            if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || completed2)) {
              return jqXHR.abort();
            }
            strAbort = "abort";
            completeDeferred.add(s.complete);
            jqXHR.done(s.success);
            jqXHR.fail(s.error);
            transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);
            if (!transport) {
              done(-1, "No Transport");
            } else {
              jqXHR.readyState = 1;
              if (fireGlobals) {
                globalEventContext.trigger("ajaxSend", [jqXHR, s]);
              }
              if (completed2) {
                return jqXHR;
              }
              if (s.async && s.timeout > 0) {
                timeoutTimer = window2.setTimeout(function() {
                  jqXHR.abort("timeout");
                }, s.timeout);
              }
              try {
                completed2 = false;
                transport.send(requestHeaders, done);
              } catch (e) {
                if (completed2) {
                  throw e;
                }
                done(-1, e);
              }
            }
            function done(status, nativeStatusText, responses, headers) {
              var isSuccess, success, error, response, modified, statusText = nativeStatusText;
              if (completed2) {
                return;
              }
              completed2 = true;
              if (timeoutTimer) {
                window2.clearTimeout(timeoutTimer);
              }
              transport = void 0;
              responseHeadersString = headers || "";
              jqXHR.readyState = status > 0 ? 4 : 0;
              isSuccess = status >= 200 && status < 300 || status === 304;
              if (responses) {
                response = ajaxHandleResponses(s, jqXHR, responses);
              }
              if (!isSuccess && jQuery2.inArray("script", s.dataTypes) > -1 && jQuery2.inArray("json", s.dataTypes) < 0) {
                s.converters["text script"] = function() {
                };
              }
              response = ajaxConvert(s, response, jqXHR, isSuccess);
              if (isSuccess) {
                if (s.ifModified) {
                  modified = jqXHR.getResponseHeader("Last-Modified");
                  if (modified) {
                    jQuery2.lastModified[cacheURL] = modified;
                  }
                  modified = jqXHR.getResponseHeader("etag");
                  if (modified) {
                    jQuery2.etag[cacheURL] = modified;
                  }
                }
                if (status === 204 || s.type === "HEAD") {
                  statusText = "nocontent";
                } else if (status === 304) {
                  statusText = "notmodified";
                } else {
                  statusText = response.state;
                  success = response.data;
                  error = response.error;
                  isSuccess = !error;
                }
              } else {
                error = statusText;
                if (status || !statusText) {
                  statusText = "error";
                  if (status < 0) {
                    status = 0;
                  }
                }
              }
              jqXHR.status = status;
              jqXHR.statusText = (nativeStatusText || statusText) + "";
              if (isSuccess) {
                deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
              } else {
                deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
              }
              jqXHR.statusCode(statusCode);
              statusCode = void 0;
              if (fireGlobals) {
                globalEventContext.trigger(
                  isSuccess ? "ajaxSuccess" : "ajaxError",
                  [jqXHR, s, isSuccess ? success : error]
                );
              }
              completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);
              if (fireGlobals) {
                globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
                if (!--jQuery2.active) {
                  jQuery2.event.trigger("ajaxStop");
                }
              }
            }
            return jqXHR;
          },
          getJSON: function(url, data, callback) {
            return jQuery2.get(url, data, callback, "json");
          },
          getScript: function(url, callback) {
            return jQuery2.get(url, void 0, callback, "script");
          }
        });
        jQuery2.each(["get", "post"], function(_i, method) {
          jQuery2[method] = function(url, data, callback, type2) {
            if (isFunction(data)) {
              type2 = type2 || callback;
              callback = data;
              data = void 0;
            }
            return jQuery2.ajax(jQuery2.extend({
              url,
              type: method,
              dataType: type2,
              data,
              success: callback
            }, jQuery2.isPlainObject(url) && url));
          };
        });
        jQuery2.ajaxPrefilter(function(s) {
          var i2;
          for (i2 in s.headers) {
            if (i2.toLowerCase() === "content-type") {
              s.contentType = s.headers[i2] || "";
            }
          }
        });
        jQuery2._evalUrl = function(url, options, doc) {
          return jQuery2.ajax({
            url,
            type: "GET",
            dataType: "script",
            cache: true,
            async: false,
            global: false,
            converters: {
              "text script": function() {
              }
            },
            dataFilter: function(response) {
              jQuery2.globalEval(response, options, doc);
            }
          });
        };
        jQuery2.fn.extend({
          wrapAll: function(html) {
            var wrap;
            if (this[0]) {
              if (isFunction(html)) {
                html = html.call(this[0]);
              }
              wrap = jQuery2(html, this[0].ownerDocument).eq(0).clone(true);
              if (this[0].parentNode) {
                wrap.insertBefore(this[0]);
              }
              wrap.map(function() {
                var elem = this;
                while (elem.firstElementChild) {
                  elem = elem.firstElementChild;
                }
                return elem;
              }).append(this);
            }
            return this;
          },
          wrapInner: function(html) {
            if (isFunction(html)) {
              return this.each(function(i2) {
                jQuery2(this).wrapInner(html.call(this, i2));
              });
            }
            return this.each(function() {
              var self = jQuery2(this), contents = self.contents();
              if (contents.length) {
                contents.wrapAll(html);
              } else {
                self.append(html);
              }
            });
          },
          wrap: function(html) {
            var htmlIsFunction = isFunction(html);
            return this.each(function(i2) {
              jQuery2(this).wrapAll(htmlIsFunction ? html.call(this, i2) : html);
            });
          },
          unwrap: function(selector) {
            this.parent(selector).not("body").each(function() {
              jQuery2(this).replaceWith(this.childNodes);
            });
            return this;
          }
        });
        jQuery2.expr.pseudos.hidden = function(elem) {
          return !jQuery2.expr.pseudos.visible(elem);
        };
        jQuery2.expr.pseudos.visible = function(elem) {
          return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
        };
        jQuery2.ajaxSettings.xhr = function() {
          try {
            return new window2.XMLHttpRequest();
          } catch (e) {
          }
        };
        var xhrSuccessStatus = {
          0: 200,
          1223: 204
        }, xhrSupported = jQuery2.ajaxSettings.xhr();
        support.cors = !!xhrSupported && "withCredentials" in xhrSupported;
        support.ajax = xhrSupported = !!xhrSupported;
        jQuery2.ajaxTransport(function(options) {
          var callback, errorCallback;
          if (support.cors || xhrSupported && !options.crossDomain) {
            return {
              send: function(headers, complete) {
                var i2, xhr = options.xhr();
                xhr.open(
                  options.type,
                  options.url,
                  options.async,
                  options.username,
                  options.password
                );
                if (options.xhrFields) {
                  for (i2 in options.xhrFields) {
                    xhr[i2] = options.xhrFields[i2];
                  }
                }
                if (options.mimeType && xhr.overrideMimeType) {
                  xhr.overrideMimeType(options.mimeType);
                }
                if (!options.crossDomain && !headers["X-Requested-With"]) {
                  headers["X-Requested-With"] = "XMLHttpRequest";
                }
                for (i2 in headers) {
                  xhr.setRequestHeader(i2, headers[i2]);
                }
                callback = function(type2) {
                  return function() {
                    if (callback) {
                      callback = errorCallback = xhr.onload = xhr.onerror = xhr.onabort = xhr.ontimeout = xhr.onreadystatechange = null;
                      if (type2 === "abort") {
                        xhr.abort();
                      } else if (type2 === "error") {
                        if (typeof xhr.status !== "number") {
                          complete(0, "error");
                        } else {
                          complete(
                            xhr.status,
                            xhr.statusText
                          );
                        }
                      } else {
                        complete(
                          xhrSuccessStatus[xhr.status] || xhr.status,
                          xhr.statusText,
                          (xhr.responseType || "text") !== "text" || typeof xhr.responseText !== "string" ? { binary: xhr.response } : { text: xhr.responseText },
                          xhr.getAllResponseHeaders()
                        );
                      }
                    }
                  };
                };
                xhr.onload = callback();
                errorCallback = xhr.onerror = xhr.ontimeout = callback("error");
                if (xhr.onabort !== void 0) {
                  xhr.onabort = errorCallback;
                } else {
                  xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                      window2.setTimeout(function() {
                        if (callback) {
                          errorCallback();
                        }
                      });
                    }
                  };
                }
                callback = callback("abort");
                try {
                  xhr.send(options.hasContent && options.data || null);
                } catch (e) {
                  if (callback) {
                    throw e;
                  }
                }
              },
              abort: function() {
                if (callback) {
                  callback();
                }
              }
            };
          }
        });
        jQuery2.ajaxPrefilter(function(s) {
          if (s.crossDomain) {
            s.contents.script = false;
          }
        });
        jQuery2.ajaxSetup({
          accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
          },
          contents: {
            script: /\b(?:java|ecma)script\b/
          },
          converters: {
            "text script": function(text) {
              jQuery2.globalEval(text);
              return text;
            }
          }
        });
        jQuery2.ajaxPrefilter("script", function(s) {
          if (s.cache === void 0) {
            s.cache = false;
          }
          if (s.crossDomain) {
            s.type = "GET";
          }
        });
        jQuery2.ajaxTransport("script", function(s) {
          if (s.crossDomain || s.scriptAttrs) {
            var script, callback;
            return {
              send: function(_, complete) {
                script = jQuery2("<script>").attr(s.scriptAttrs || {}).prop({ charset: s.scriptCharset, src: s.url }).on("load error", callback = function(evt) {
                  script.remove();
                  callback = null;
                  if (evt) {
                    complete(evt.type === "error" ? 404 : 200, evt.type);
                  }
                });
                document2.head.appendChild(script[0]);
              },
              abort: function() {
                if (callback) {
                  callback();
                }
              }
            };
          }
        });
        var oldCallbacks = [], rjsonp = /(=)\?(?=&|$)|\?\?/;
        jQuery2.ajaxSetup({
          jsonp: "callback",
          jsonpCallback: function() {
            var callback = oldCallbacks.pop() || jQuery2.expando + "_" + nonce.guid++;
            this[callback] = true;
            return callback;
          }
        });
        jQuery2.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
          var callbackName, overwritten, responseContainer, jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : typeof s.data === "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && rjsonp.test(s.data) && "data");
          if (jsonProp || s.dataTypes[0] === "jsonp") {
            callbackName = s.jsonpCallback = isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;
            if (jsonProp) {
              s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
            } else if (s.jsonp !== false) {
              s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
            }
            s.converters["script json"] = function() {
              if (!responseContainer) {
                jQuery2.error(callbackName + " was not called");
              }
              return responseContainer[0];
            };
            s.dataTypes[0] = "json";
            overwritten = window2[callbackName];
            window2[callbackName] = function() {
              responseContainer = arguments;
            };
            jqXHR.always(function() {
              if (overwritten === void 0) {
                jQuery2(window2).removeProp(callbackName);
              } else {
                window2[callbackName] = overwritten;
              }
              if (s[callbackName]) {
                s.jsonpCallback = originalSettings.jsonpCallback;
                oldCallbacks.push(callbackName);
              }
              if (responseContainer && isFunction(overwritten)) {
                overwritten(responseContainer[0]);
              }
              responseContainer = overwritten = void 0;
            });
            return "script";
          }
        });
        support.createHTMLDocument = function() {
          var body = document2.implementation.createHTMLDocument("").body;
          body.innerHTML = "<form></form><form></form>";
          return body.childNodes.length === 2;
        }();
        jQuery2.parseHTML = function(data, context2, keepScripts) {
          if (typeof data !== "string") {
            return [];
          }
          if (typeof context2 === "boolean") {
            keepScripts = context2;
            context2 = false;
          }
          var base, parsed, scripts;
          if (!context2) {
            if (support.createHTMLDocument) {
              context2 = document2.implementation.createHTMLDocument("");
              base = context2.createElement("base");
              base.href = document2.location.href;
              context2.head.appendChild(base);
            } else {
              context2 = document2;
            }
          }
          parsed = rsingleTag.exec(data);
          scripts = !keepScripts && [];
          if (parsed) {
            return [context2.createElement(parsed[1])];
          }
          parsed = buildFragment([data], context2, scripts);
          if (scripts && scripts.length) {
            jQuery2(scripts).remove();
          }
          return jQuery2.merge([], parsed.childNodes);
        };
        jQuery2.fn.load = function(url, params, callback) {
          var selector, type2, response, self = this, off = url.indexOf(" ");
          if (off > -1) {
            selector = stripAndCollapse(url.slice(off));
            url = url.slice(0, off);
          }
          if (isFunction(params)) {
            callback = params;
            params = void 0;
          } else if (params && typeof params === "object") {
            type2 = "POST";
          }
          if (self.length > 0) {
            jQuery2.ajax({
              url,
              type: type2 || "GET",
              dataType: "html",
              data: params
            }).done(function(responseText) {
              response = arguments;
              self.html(selector ? jQuery2("<div>").append(jQuery2.parseHTML(responseText)).find(selector) : responseText);
            }).always(callback && function(jqXHR, status) {
              self.each(function() {
                callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
              });
            });
          }
          return this;
        };
        jQuery2.expr.pseudos.animated = function(elem) {
          return jQuery2.grep(jQuery2.timers, function(fn) {
            return elem === fn.elem;
          }).length;
        };
        jQuery2.offset = {
          setOffset: function(elem, options, i2) {
            var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition, position = jQuery2.css(elem, "position"), curElem = jQuery2(elem), props = {};
            if (position === "static") {
              elem.style.position = "relative";
            }
            curOffset = curElem.offset();
            curCSSTop = jQuery2.css(elem, "top");
            curCSSLeft = jQuery2.css(elem, "left");
            calculatePosition = (position === "absolute" || position === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1;
            if (calculatePosition) {
              curPosition = curElem.position();
              curTop = curPosition.top;
              curLeft = curPosition.left;
            } else {
              curTop = parseFloat(curCSSTop) || 0;
              curLeft = parseFloat(curCSSLeft) || 0;
            }
            if (isFunction(options)) {
              options = options.call(elem, i2, jQuery2.extend({}, curOffset));
            }
            if (options.top != null) {
              props.top = options.top - curOffset.top + curTop;
            }
            if (options.left != null) {
              props.left = options.left - curOffset.left + curLeft;
            }
            if ("using" in options) {
              options.using.call(elem, props);
            } else {
              curElem.css(props);
            }
          }
        };
        jQuery2.fn.extend({
          offset: function(options) {
            if (arguments.length) {
              return options === void 0 ? this : this.each(function(i2) {
                jQuery2.offset.setOffset(this, options, i2);
              });
            }
            var rect, win, elem = this[0];
            if (!elem) {
              return;
            }
            if (!elem.getClientRects().length) {
              return { top: 0, left: 0 };
            }
            rect = elem.getBoundingClientRect();
            win = elem.ownerDocument.defaultView;
            return {
              top: rect.top + win.pageYOffset,
              left: rect.left + win.pageXOffset
            };
          },
          position: function() {
            if (!this[0]) {
              return;
            }
            var offsetParent, offset, doc, elem = this[0], parentOffset = { top: 0, left: 0 };
            if (jQuery2.css(elem, "position") === "fixed") {
              offset = elem.getBoundingClientRect();
            } else {
              offset = this.offset();
              doc = elem.ownerDocument;
              offsetParent = elem.offsetParent || doc.documentElement;
              while (offsetParent && (offsetParent === doc.body || offsetParent === doc.documentElement) && jQuery2.css(offsetParent, "position") === "static") {
                offsetParent = offsetParent.parentNode;
              }
              if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
                parentOffset = jQuery2(offsetParent).offset();
                parentOffset.top += jQuery2.css(offsetParent, "borderTopWidth", true);
                parentOffset.left += jQuery2.css(offsetParent, "borderLeftWidth", true);
              }
            }
            return {
              top: offset.top - parentOffset.top - jQuery2.css(elem, "marginTop", true),
              left: offset.left - parentOffset.left - jQuery2.css(elem, "marginLeft", true)
            };
          },
          offsetParent: function() {
            return this.map(function() {
              var offsetParent = this.offsetParent;
              while (offsetParent && jQuery2.css(offsetParent, "position") === "static") {
                offsetParent = offsetParent.offsetParent;
              }
              return offsetParent || documentElement;
            });
          }
        });
        jQuery2.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function(method, prop) {
          var top2 = "pageYOffset" === prop;
          jQuery2.fn[method] = function(val) {
            return access(this, function(elem, method2, val2) {
              var win;
              if (isWindow(elem)) {
                win = elem;
              } else if (elem.nodeType === 9) {
                win = elem.defaultView;
              }
              if (val2 === void 0) {
                return win ? win[prop] : elem[method2];
              }
              if (win) {
                win.scrollTo(
                  !top2 ? val2 : win.pageXOffset,
                  top2 ? val2 : win.pageYOffset
                );
              } else {
                elem[method2] = val2;
              }
            }, method, val, arguments.length);
          };
        });
        jQuery2.each(["top", "left"], function(_i, prop) {
          jQuery2.cssHooks[prop] = addGetHookIf(
            support.pixelPosition,
            function(elem, computed) {
              if (computed) {
                computed = curCSS(elem, prop);
                return rnumnonpx.test(computed) ? jQuery2(elem).position()[prop] + "px" : computed;
              }
            }
          );
        });
        jQuery2.each({ Height: "height", Width: "width" }, function(name, type2) {
          jQuery2.each({
            padding: "inner" + name,
            content: type2,
            "": "outer" + name
          }, function(defaultExtra, funcName) {
            jQuery2.fn[funcName] = function(margin, value) {
              var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"), extra = defaultExtra || (margin === true || value === true ? "margin" : "border");
              return access(this, function(elem, type3, value2) {
                var doc;
                if (isWindow(elem)) {
                  return funcName.indexOf("outer") === 0 ? elem["inner" + name] : elem.document.documentElement["client" + name];
                }
                if (elem.nodeType === 9) {
                  doc = elem.documentElement;
                  return Math.max(
                    elem.body["scroll" + name],
                    doc["scroll" + name],
                    elem.body["offset" + name],
                    doc["offset" + name],
                    doc["client" + name]
                  );
                }
                return value2 === void 0 ? jQuery2.css(elem, type3, extra) : jQuery2.style(elem, type3, value2, extra);
              }, type2, chainable ? margin : void 0, chainable);
            };
          });
        });
        jQuery2.each([
          "ajaxStart",
          "ajaxStop",
          "ajaxComplete",
          "ajaxError",
          "ajaxSuccess",
          "ajaxSend"
        ], function(_i, type2) {
          jQuery2.fn[type2] = function(fn) {
            return this.on(type2, fn);
          };
        });
        jQuery2.fn.extend({
          bind: function(types, data, fn) {
            return this.on(types, null, data, fn);
          },
          unbind: function(types, fn) {
            return this.off(types, null, fn);
          },
          delegate: function(selector, types, data, fn) {
            return this.on(types, selector, data, fn);
          },
          undelegate: function(selector, types, fn) {
            return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
          },
          hover: function(fnOver, fnOut) {
            return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
          }
        });
        jQuery2.each(
          "blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),
          function(_i, name) {
            jQuery2.fn[name] = function(data, fn) {
              return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
            };
          }
        );
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        jQuery2.proxy = function(fn, context2) {
          var tmp, args, proxy;
          if (typeof context2 === "string") {
            tmp = fn[context2];
            context2 = fn;
            fn = tmp;
          }
          if (!isFunction(fn)) {
            return void 0;
          }
          args = slice3.call(arguments, 2);
          proxy = function() {
            return fn.apply(context2 || this, args.concat(slice3.call(arguments)));
          };
          proxy.guid = fn.guid = fn.guid || jQuery2.guid++;
          return proxy;
        };
        jQuery2.holdReady = function(hold) {
          if (hold) {
            jQuery2.readyWait++;
          } else {
            jQuery2.ready(true);
          }
        };
        jQuery2.isArray = Array.isArray;
        jQuery2.parseJSON = JSON.parse;
        jQuery2.nodeName = nodeName;
        jQuery2.isFunction = isFunction;
        jQuery2.isWindow = isWindow;
        jQuery2.camelCase = camelCase;
        jQuery2.type = toType;
        jQuery2.now = Date.now;
        jQuery2.isNumeric = function(obj) {
          var type2 = jQuery2.type(obj);
          return (type2 === "number" || type2 === "string") && !isNaN(obj - parseFloat(obj));
        };
        jQuery2.trim = function(text) {
          return text == null ? "" : (text + "").replace(rtrim, "");
        };
        if (typeof define === "function" && define.amd) {
          define("jquery", [], function() {
            return jQuery2;
          });
        }
        var _jQuery = window2.jQuery, _$ = window2.$;
        jQuery2.noConflict = function(deep) {
          if (window2.$ === jQuery2) {
            window2.$ = _$;
          }
          if (deep && window2.jQuery === jQuery2) {
            window2.jQuery = _jQuery;
          }
          return jQuery2;
        };
        if (typeof noGlobal === "undefined") {
          window2.jQuery = window2.$ = jQuery2;
        }
        return jQuery2;
      });
    }
  });

  // vendor/logjam/app/assets/javascripts/jquery.js
  var import_jquery;
  var init_jquery = __esm({
    "vendor/logjam/app/assets/javascripts/jquery.js"() {
      import_jquery = __toESM(require_jquery());
      window.jQuery = import_jquery.default;
      window.$ = import_jquery.default;
    }
  });

  // node_modules/jquery-migrate/dist/jquery-migrate.js
  var require_jquery_migrate = __commonJS({
    "node_modules/jquery-migrate/dist/jquery-migrate.js"(exports2, module2) {
      (function(factory) {
        "use strict";
        if (typeof define === "function" && define.amd) {
          define(["jquery"], function(jQuery2) {
            return factory(jQuery2, window);
          });
        } else if (typeof module2 === "object" && module2.exports) {
          module2.exports = factory(require_jquery(), window);
        } else {
          factory(jQuery, window);
        }
      })(function(jQuery2, window2) {
        "use strict";
        jQuery2.migrateVersion = "3.3.2";
        function compareVersions(v1, v2) {
          var i2, rVersionParts = /^(\d+)\.(\d+)\.(\d+)/, v1p = rVersionParts.exec(v1) || [], v2p = rVersionParts.exec(v2) || [];
          for (i2 = 1; i2 <= 3; i2++) {
            if (+v1p[i2] > +v2p[i2]) {
              return 1;
            }
            if (+v1p[i2] < +v2p[i2]) {
              return -1;
            }
          }
          return 0;
        }
        function jQueryVersionSince(version) {
          return compareVersions(jQuery2.fn.jquery, version) >= 0;
        }
        (function() {
          if (!window2.console || !window2.console.log) {
            return;
          }
          if (!jQuery2 || !jQueryVersionSince("3.0.0")) {
            window2.console.log("JQMIGRATE: jQuery 3.0.0+ REQUIRED");
          }
          if (jQuery2.migrateWarnings) {
            window2.console.log("JQMIGRATE: Migrate plugin loaded multiple times");
          }
          window2.console.log("JQMIGRATE: Migrate is installed" + (jQuery2.migrateMute ? "" : " with logging active") + ", version " + jQuery2.migrateVersion);
        })();
        var warnedAbout = {};
        jQuery2.migrateDeduplicateWarnings = true;
        jQuery2.migrateWarnings = [];
        if (jQuery2.migrateTrace === void 0) {
          jQuery2.migrateTrace = true;
        }
        jQuery2.migrateReset = function() {
          warnedAbout = {};
          jQuery2.migrateWarnings.length = 0;
        };
        function migrateWarn(msg) {
          var console2 = window2.console;
          if (!jQuery2.migrateDeduplicateWarnings || !warnedAbout[msg]) {
            warnedAbout[msg] = true;
            jQuery2.migrateWarnings.push(msg);
            if (console2 && console2.warn && !jQuery2.migrateMute) {
              console2.warn("JQMIGRATE: " + msg);
              if (jQuery2.migrateTrace && console2.trace) {
                console2.trace();
              }
            }
          }
        }
        function migrateWarnProp(obj, prop, value, msg) {
          Object.defineProperty(obj, prop, {
            configurable: true,
            enumerable: true,
            get: function() {
              migrateWarn(msg);
              return value;
            },
            set: function(newValue) {
              migrateWarn(msg);
              value = newValue;
            }
          });
        }
        function migrateWarnFunc(obj, prop, newFunc, msg) {
          obj[prop] = function() {
            migrateWarn(msg);
            return newFunc.apply(this, arguments);
          };
        }
        if (window2.document.compatMode === "BackCompat") {
          migrateWarn("jQuery is not compatible with Quirks Mode");
        }
        var findProp, class2type = {}, oldInit = jQuery2.fn.init, oldFind = jQuery2.find, rattrHashTest = /\[(\s*[-\w]+\s*)([~|^$*]?=)\s*([-\w#]*?#[-\w#]*)\s*\]/, rattrHashGlob = /\[(\s*[-\w]+\s*)([~|^$*]?=)\s*([-\w#]*?#[-\w#]*)\s*\]/g, rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        jQuery2.fn.init = function(arg1) {
          var args = Array.prototype.slice.call(arguments);
          if (typeof arg1 === "string" && arg1 === "#") {
            migrateWarn("jQuery( '#' ) is not a valid selector");
            args[0] = [];
          }
          return oldInit.apply(this, args);
        };
        jQuery2.fn.init.prototype = jQuery2.fn;
        jQuery2.find = function(selector) {
          var args = Array.prototype.slice.call(arguments);
          if (typeof selector === "string" && rattrHashTest.test(selector)) {
            try {
              window2.document.querySelector(selector);
            } catch (err1) {
              selector = selector.replace(rattrHashGlob, function(_, attr, op, value) {
                return "[" + attr + op + '"' + value + '"]';
              });
              try {
                window2.document.querySelector(selector);
                migrateWarn("Attribute selector with '#' must be quoted: " + args[0]);
                args[0] = selector;
              } catch (err2) {
                migrateWarn("Attribute selector with '#' was not fixed: " + args[0]);
              }
            }
          }
          return oldFind.apply(this, args);
        };
        for (findProp in oldFind) {
          if (Object.prototype.hasOwnProperty.call(oldFind, findProp)) {
            jQuery2.find[findProp] = oldFind[findProp];
          }
        }
        migrateWarnFunc(
          jQuery2.fn,
          "size",
          function() {
            return this.length;
          },
          "jQuery.fn.size() is deprecated and removed; use the .length property"
        );
        migrateWarnFunc(
          jQuery2,
          "parseJSON",
          function() {
            return JSON.parse.apply(null, arguments);
          },
          "jQuery.parseJSON is deprecated; use JSON.parse"
        );
        migrateWarnFunc(
          jQuery2,
          "holdReady",
          jQuery2.holdReady,
          "jQuery.holdReady is deprecated"
        );
        migrateWarnFunc(
          jQuery2,
          "unique",
          jQuery2.uniqueSort,
          "jQuery.unique is deprecated; use jQuery.uniqueSort"
        );
        migrateWarnProp(
          jQuery2.expr,
          "filters",
          jQuery2.expr.pseudos,
          "jQuery.expr.filters is deprecated; use jQuery.expr.pseudos"
        );
        migrateWarnProp(
          jQuery2.expr,
          ":",
          jQuery2.expr.pseudos,
          "jQuery.expr[':'] is deprecated; use jQuery.expr.pseudos"
        );
        if (jQueryVersionSince("3.1.1")) {
          migrateWarnFunc(
            jQuery2,
            "trim",
            function(text) {
              return text == null ? "" : (text + "").replace(rtrim, "");
            },
            "jQuery.trim is deprecated; use String.prototype.trim"
          );
        }
        if (jQueryVersionSince("3.2.0")) {
          migrateWarnFunc(
            jQuery2,
            "nodeName",
            function(elem, name) {
              return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
            },
            "jQuery.nodeName is deprecated"
          );
          migrateWarnFunc(
            jQuery2,
            "isArray",
            Array.isArray,
            "jQuery.isArray is deprecated; use Array.isArray"
          );
        }
        if (jQueryVersionSince("3.3.0")) {
          migrateWarnFunc(
            jQuery2,
            "isNumeric",
            function(obj) {
              var type2 = typeof obj;
              return (type2 === "number" || type2 === "string") && !isNaN(obj - parseFloat(obj));
            },
            "jQuery.isNumeric() is deprecated"
          );
          jQuery2.each(
            "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
            function(_, name) {
              class2type["[object " + name + "]"] = name.toLowerCase();
            }
          );
          migrateWarnFunc(
            jQuery2,
            "type",
            function(obj) {
              if (obj == null) {
                return obj + "";
              }
              return typeof obj === "object" || typeof obj === "function" ? class2type[Object.prototype.toString.call(obj)] || "object" : typeof obj;
            },
            "jQuery.type is deprecated"
          );
          migrateWarnFunc(
            jQuery2,
            "isFunction",
            function(obj) {
              return typeof obj === "function";
            },
            "jQuery.isFunction() is deprecated"
          );
          migrateWarnFunc(
            jQuery2,
            "isWindow",
            function(obj) {
              return obj != null && obj === obj.window;
            },
            "jQuery.isWindow() is deprecated"
          );
        }
        if (jQuery2.ajax) {
          var oldAjax = jQuery2.ajax, rjsonp = /(=)\?(?=&|$)|\?\?/;
          jQuery2.ajax = function() {
            var jQXHR = oldAjax.apply(this, arguments);
            if (jQXHR.promise) {
              migrateWarnFunc(
                jQXHR,
                "success",
                jQXHR.done,
                "jQXHR.success is deprecated and removed"
              );
              migrateWarnFunc(
                jQXHR,
                "error",
                jQXHR.fail,
                "jQXHR.error is deprecated and removed"
              );
              migrateWarnFunc(
                jQXHR,
                "complete",
                jQXHR.always,
                "jQXHR.complete is deprecated and removed"
              );
            }
            return jQXHR;
          };
          if (!jQueryVersionSince("4.0.0")) {
            jQuery2.ajaxPrefilter("+json", function(s) {
              if (s.jsonp !== false && (rjsonp.test(s.url) || typeof s.data === "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && rjsonp.test(s.data))) {
                migrateWarn("JSON-to-JSONP auto-promotion is deprecated");
              }
            });
          }
        }
        var oldRemoveAttr = jQuery2.fn.removeAttr, oldToggleClass = jQuery2.fn.toggleClass, rmatchNonSpace = /\S+/g;
        jQuery2.fn.removeAttr = function(name) {
          var self = this;
          jQuery2.each(name.match(rmatchNonSpace), function(_i, attr) {
            if (jQuery2.expr.match.bool.test(attr)) {
              migrateWarn("jQuery.fn.removeAttr no longer sets boolean properties: " + attr);
              self.prop(attr, false);
            }
          });
          return oldRemoveAttr.apply(this, arguments);
        };
        jQuery2.fn.toggleClass = function(state) {
          if (state !== void 0 && typeof state !== "boolean") {
            return oldToggleClass.apply(this, arguments);
          }
          migrateWarn("jQuery.fn.toggleClass( boolean ) is deprecated");
          return this.each(function() {
            var className = this.getAttribute && this.getAttribute("class") || "";
            if (className) {
              jQuery2.data(this, "__className__", className);
            }
            if (this.setAttribute) {
              this.setAttribute(
                "class",
                className || state === false ? "" : jQuery2.data(this, "__className__") || ""
              );
            }
          });
        };
        function camelCase(string2) {
          return string2.replace(/-([a-z])/g, function(_, letter) {
            return letter.toUpperCase();
          });
        }
        var oldFnCss, internalSwapCall = false, ralphaStart = /^[a-z]/, rautoPx = /^(?:Border(?:Top|Right|Bottom|Left)?(?:Width|)|(?:Margin|Padding)?(?:Top|Right|Bottom|Left)?|(?:Min|Max)?(?:Width|Height))$/;
        if (jQuery2.swap) {
          jQuery2.each(["height", "width", "reliableMarginRight"], function(_, name) {
            var oldHook = jQuery2.cssHooks[name] && jQuery2.cssHooks[name].get;
            if (oldHook) {
              jQuery2.cssHooks[name].get = function() {
                var ret;
                internalSwapCall = true;
                ret = oldHook.apply(this, arguments);
                internalSwapCall = false;
                return ret;
              };
            }
          });
        }
        jQuery2.swap = function(elem, options, callback, args) {
          var ret, name, old = {};
          if (!internalSwapCall) {
            migrateWarn("jQuery.swap() is undocumented and deprecated");
          }
          for (name in options) {
            old[name] = elem.style[name];
            elem.style[name] = options[name];
          }
          ret = callback.apply(elem, args || []);
          for (name in options) {
            elem.style[name] = old[name];
          }
          return ret;
        };
        if (jQueryVersionSince("3.4.0") && typeof Proxy !== "undefined") {
          jQuery2.cssProps = new Proxy(jQuery2.cssProps || {}, {
            set: function() {
              migrateWarn("JQMIGRATE: jQuery.cssProps is deprecated");
              return Reflect.set.apply(this, arguments);
            }
          });
        }
        if (!jQuery2.cssNumber) {
          jQuery2.cssNumber = {};
        }
        function isAutoPx(prop) {
          return ralphaStart.test(prop) && rautoPx.test(prop[0].toUpperCase() + prop.slice(1));
        }
        oldFnCss = jQuery2.fn.css;
        jQuery2.fn.css = function(name, value) {
          var camelName, origThis = this;
          if (name && typeof name === "object" && !Array.isArray(name)) {
            jQuery2.each(name, function(n, v) {
              jQuery2.fn.css.call(origThis, n, v);
            });
            return this;
          }
          if (typeof value === "number") {
            camelName = camelCase(name);
            if (!isAutoPx(camelName) && !jQuery2.cssNumber[camelName]) {
              migrateWarn('Number-typed values are deprecated for jQuery.fn.css( "' + name + '", value )');
            }
          }
          return oldFnCss.apply(this, arguments);
        };
        var oldData = jQuery2.data;
        jQuery2.data = function(elem, name, value) {
          var curData, sameKeys, key;
          if (name && typeof name === "object" && arguments.length === 2) {
            curData = jQuery2.hasData(elem) && oldData.call(this, elem);
            sameKeys = {};
            for (key in name) {
              if (key !== camelCase(key)) {
                migrateWarn("jQuery.data() always sets/gets camelCased names: " + key);
                curData[key] = name[key];
              } else {
                sameKeys[key] = name[key];
              }
            }
            oldData.call(this, elem, sameKeys);
            return name;
          }
          if (name && typeof name === "string" && name !== camelCase(name)) {
            curData = jQuery2.hasData(elem) && oldData.call(this, elem);
            if (curData && name in curData) {
              migrateWarn("jQuery.data() always sets/gets camelCased names: " + name);
              if (arguments.length > 2) {
                curData[name] = value;
              }
              return curData[name];
            }
          }
          return oldData.apply(this, arguments);
        };
        if (jQuery2.fx) {
          var intervalValue, intervalMsg, oldTweenRun = jQuery2.Tween.prototype.run, linearEasing = function(pct) {
            return pct;
          };
          jQuery2.Tween.prototype.run = function() {
            if (jQuery2.easing[this.easing].length > 1) {
              migrateWarn(
                "'jQuery.easing." + this.easing.toString() + "' should use only one argument"
              );
              jQuery2.easing[this.easing] = linearEasing;
            }
            oldTweenRun.apply(this, arguments);
          };
          intervalValue = jQuery2.fx.interval || 13;
          intervalMsg = "jQuery.fx.interval is deprecated";
          if (window2.requestAnimationFrame) {
            Object.defineProperty(jQuery2.fx, "interval", {
              configurable: true,
              enumerable: true,
              get: function() {
                if (!window2.document.hidden) {
                  migrateWarn(intervalMsg);
                }
                return intervalValue;
              },
              set: function(newValue) {
                migrateWarn(intervalMsg);
                intervalValue = newValue;
              }
            });
          }
        }
        var oldLoad = jQuery2.fn.load, oldEventAdd = jQuery2.event.add, originalFix = jQuery2.event.fix;
        jQuery2.event.props = [];
        jQuery2.event.fixHooks = {};
        migrateWarnProp(
          jQuery2.event.props,
          "concat",
          jQuery2.event.props.concat,
          "jQuery.event.props.concat() is deprecated and removed"
        );
        jQuery2.event.fix = function(originalEvent) {
          var event, type2 = originalEvent.type, fixHook = this.fixHooks[type2], props = jQuery2.event.props;
          if (props.length) {
            migrateWarn("jQuery.event.props are deprecated and removed: " + props.join());
            while (props.length) {
              jQuery2.event.addProp(props.pop());
            }
          }
          if (fixHook && !fixHook._migrated_) {
            fixHook._migrated_ = true;
            migrateWarn("jQuery.event.fixHooks are deprecated and removed: " + type2);
            if ((props = fixHook.props) && props.length) {
              while (props.length) {
                jQuery2.event.addProp(props.pop());
              }
            }
          }
          event = originalFix.call(this, originalEvent);
          return fixHook && fixHook.filter ? fixHook.filter(event, originalEvent) : event;
        };
        jQuery2.event.add = function(elem, types) {
          if (elem === window2 && types === "load" && window2.document.readyState === "complete") {
            migrateWarn("jQuery(window).on('load'...) called after load event occurred");
          }
          return oldEventAdd.apply(this, arguments);
        };
        jQuery2.each(["load", "unload", "error"], function(_, name) {
          jQuery2.fn[name] = function() {
            var args = Array.prototype.slice.call(arguments, 0);
            if (name === "load" && typeof args[0] === "string") {
              return oldLoad.apply(this, args);
            }
            migrateWarn("jQuery.fn." + name + "() is deprecated");
            args.splice(0, 0, name);
            if (arguments.length) {
              return this.on.apply(this, args);
            }
            this.triggerHandler.apply(this, args);
            return this;
          };
        });
        jQuery2.each(
          "blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),
          function(_i, name) {
            jQuery2.fn[name] = function(data, fn) {
              migrateWarn("jQuery.fn." + name + "() event shorthand is deprecated");
              return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
            };
          }
        );
        jQuery2(function() {
          jQuery2(window2.document).triggerHandler("ready");
        });
        jQuery2.event.special.ready = {
          setup: function() {
            if (this === window2.document) {
              migrateWarn("'ready' event is deprecated");
            }
          }
        };
        jQuery2.fn.extend({
          bind: function(types, data, fn) {
            migrateWarn("jQuery.fn.bind() is deprecated");
            return this.on(types, null, data, fn);
          },
          unbind: function(types, fn) {
            migrateWarn("jQuery.fn.unbind() is deprecated");
            return this.off(types, null, fn);
          },
          delegate: function(selector, types, data, fn) {
            migrateWarn("jQuery.fn.delegate() is deprecated");
            return this.on(types, selector, data, fn);
          },
          undelegate: function(selector, types, fn) {
            migrateWarn("jQuery.fn.undelegate() is deprecated");
            return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
          },
          hover: function(fnOver, fnOut) {
            migrateWarn("jQuery.fn.hover() is deprecated");
            return this.on("mouseenter", fnOver).on("mouseleave", fnOut || fnOver);
          }
        });
        var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi, origHtmlPrefilter = jQuery2.htmlPrefilter, makeMarkup = function(html) {
          var doc = window2.document.implementation.createHTMLDocument("");
          doc.body.innerHTML = html;
          return doc.body && doc.body.innerHTML;
        }, warnIfChanged = function(html) {
          var changed = html.replace(rxhtmlTag, "<$1></$2>");
          if (changed !== html && makeMarkup(html) !== makeMarkup(changed)) {
            migrateWarn("HTML tags must be properly nested and closed: " + html);
          }
        };
        jQuery2.UNSAFE_restoreLegacyHtmlPrefilter = function() {
          jQuery2.htmlPrefilter = function(html) {
            warnIfChanged(html);
            return html.replace(rxhtmlTag, "<$1></$2>");
          };
        };
        jQuery2.htmlPrefilter = function(html) {
          warnIfChanged(html);
          return origHtmlPrefilter(html);
        };
        var oldOffset = jQuery2.fn.offset;
        jQuery2.fn.offset = function() {
          var elem = this[0];
          if (elem && (!elem.nodeType || !elem.getBoundingClientRect)) {
            migrateWarn("jQuery.fn.offset() requires a valid DOM element");
            return arguments.length ? this : void 0;
          }
          return oldOffset.apply(this, arguments);
        };
        if (jQuery2.ajax) {
          var oldParam = jQuery2.param;
          jQuery2.param = function(data, traditional) {
            var ajaxTraditional = jQuery2.ajaxSettings && jQuery2.ajaxSettings.traditional;
            if (traditional === void 0 && ajaxTraditional) {
              migrateWarn("jQuery.param() no longer uses jQuery.ajaxSettings.traditional");
              traditional = ajaxTraditional;
            }
            return oldParam.call(this, data, traditional);
          };
        }
        var oldSelf = jQuery2.fn.andSelf || jQuery2.fn.addBack;
        jQuery2.fn.andSelf = function() {
          migrateWarn("jQuery.fn.andSelf() is deprecated and removed, use jQuery.fn.addBack()");
          return oldSelf.apply(this, arguments);
        };
        if (jQuery2.Deferred) {
          var oldDeferred = jQuery2.Deferred, tuples = [
            [
              "resolve",
              "done",
              jQuery2.Callbacks("once memory"),
              jQuery2.Callbacks("once memory"),
              "resolved"
            ],
            [
              "reject",
              "fail",
              jQuery2.Callbacks("once memory"),
              jQuery2.Callbacks("once memory"),
              "rejected"
            ],
            [
              "notify",
              "progress",
              jQuery2.Callbacks("memory"),
              jQuery2.Callbacks("memory")
            ]
          ];
          jQuery2.Deferred = function(func) {
            var deferred = oldDeferred(), promise = deferred.promise();
            deferred.pipe = promise.pipe = function() {
              var fns = arguments;
              migrateWarn("deferred.pipe() is deprecated");
              return jQuery2.Deferred(function(newDefer) {
                jQuery2.each(tuples, function(i2, tuple) {
                  var fn = typeof fns[i2] === "function" && fns[i2];
                  deferred[tuple[1]](function() {
                    var returned = fn && fn.apply(this, arguments);
                    if (returned && typeof returned.promise === "function") {
                      returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify);
                    } else {
                      newDefer[tuple[0] + "With"](
                        this === promise ? newDefer.promise() : this,
                        fn ? [returned] : arguments
                      );
                    }
                  });
                });
                fns = null;
              }).promise();
            };
            if (func) {
              func.call(deferred, deferred);
            }
            return deferred;
          };
          jQuery2.Deferred.exceptionHook = oldDeferred.exceptionHook;
        }
        return jQuery2;
      });
    }
  });

  // vendor/logjam/app/assets/javascripts/jquery.jdpicker.1.1.js
  var require_jquery_jdpicker_1_1 = __commonJS({
    "vendor/logjam/app/assets/javascripts/jquery.jdpicker.1.1.js"(exports, module) {
      jdPicker = function($) {
        function jdPicker(el, opts) {
          if (typeof opts != "object")
            opts = {};
          $.extend(this, jdPicker.DEFAULT_OPTS, opts);
          this.input = $(el);
          this.bindMethodsToObj("show", "hide", "hideIfClickOutside", "keydownHandler", "selectDate");
          this.build();
          this.selectDate();
          this.hide();
        }
        ;
        jdPicker.DEFAULT_OPTS = {
          month_names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
          short_month_names: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          short_day_names: ["S", "M", "T", "W", "T", "F", "S"],
          error_out_of_range: "Selected date is out of range",
          selectable_days: [0, 1, 2, 3, 4, 5, 6],
          non_selectable: [],
          rec_non_selectable: [],
          start_of_week: 1,
          show_week: 0,
          select_week: 0,
          week_label: "",
          date_min: "",
          date_max: "",
          date_format: "YYYY/mm/dd"
        };
        jdPicker.prototype = {
          context_hidden: function() {
            return this.input.parent().is(":hidden");
          },
          build: function() {
            this.wrapp = this.input.wrap('<div class="jdpicker_w">');
            if (!this.context_hidden()) {
              var clearer = $('<span class="date_clearer">&times;</span>');
              clearer.on("click", this.bindToObj(function() {
                this.selectDate();
              }));
              this.input.after(clearer);
            }
            switch (this.date_format) {
              case "dd/mm/YYYY":
                this.reg = new RegExp(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
                this.date_decode = "new Date(matches[3], parseInt(matches[2]-1), matches[1]);";
                this.date_encode = 'this.strpad(date.getDate()) + "/" + this.strpad(date.getMonth()+1) + "/" + date.getFullYear();';
                this.date_encode_s = 'this.strpad(date.getDate()) + "/" + this.strpad(date.getMonth()+1)';
                break;
              case "FF dd YYYY":
                this.reg = new RegExp(/^([a-zA-Z]+) (\d{1,2}) (\d{4})$/);
                this.date_decode = "new Date(matches[3], this.indexFor(this.month_names, matches[1]), matches[2]);";
                this.date_encode = 'this.month_names[date.getMonth()] + " " + this.strpad(date.getDate()) + " " + date.getFullYear();';
                this.date_encode_s = 'this.month_names[date.getMonth()] + " " + this.strpad(date.getDate());';
                break;
              case "dd MM YYYY":
                this.reg = new RegExp(/^(\d{1,2}) ([a-zA-Z]{3}) (\d{4})$/);
                this.date_decode = "new Date(matches[3], this.indexFor(this.short_month_names, matches[2]), matches[1]);";
                this.date_encode = 'this.strpad(date.getDate()) + " " + this.short_month_names[date.getMonth()] + " " + date.getFullYear();';
                this.date_encode_s = 'this.strpad(date.getDate()) + " " + this.short_month_names[date.getMonth()];';
                break;
              case "MM dd YYYY":
                this.reg = new RegExp(/^([a-zA-Z]{3}) (\d{1,2}) (\d{4})$/);
                this.date_decode = "new Date(matches[3], this.indexFor(this.short_month_names, matches[1]), matches[2]);";
                this.date_encode = 'this.short_month_names[date.getMonth()] + " " + this.strpad(date.getDate()) + " " + date.getFullYear();';
                this.date_encode_s = 'this.short_month_names[date.getMonth()] + " " + this.strpad(date.getDate());';
                break;
              case "dd FF YYYY":
                this.reg = new RegExp(/^(\d{1,2}) ([a-zA-Z]+) (\d{4})$/);
                this.date_decode = "new Date(matches[3], this.indexFor(this.month_names, matches[2]), matches[1]);";
                this.date_encode = 'this.strpad(date.getDate()) + " " + this.month_names[date.getMonth()] + " " + date.getFullYear();';
                this.date_encode_s = 'this.strpad(date.getDate()) + " " + this.month_names[date.getMonth()];';
                break;
              case "YYYY/mm/dd":
                this.reg = new RegExp(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
                this.date_decode = "new Date(matches[1], parseInt(matches[2]-1), matches[3]);";
                this.date_encode = 'date.getFullYear() + "/" + this.strpad(date.getMonth()+1) + "/" + this.strpad(date.getDate());';
                this.date_encode_s = 'this.strpad(date.getMonth()+1) + "/" + this.strpad(date.getDate());';
              case "YYYY-mm-dd":
              default:
                this.reg = new RegExp(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
                this.date_decode = "new Date(matches[1], parseInt(matches[2]-1), matches[3]);";
                this.date_encode = 'date.getFullYear() + "-" + this.strpad(date.getMonth()+1) + "-" + this.strpad(date.getDate());';
                this.date_encode_s = 'this.strpad(date.getMonth()+1) + "-" + this.strpad(date.getDate());';
                break;
            }
            if (this.date_max != "" && this.date_max.match(this.reg)) {
              var matches = this.date_max.match(this.reg);
              this.date_max = eval(this.date_decode);
            } else
              this.date_max = "";
            if (this.date_min != "" && this.date_min.match(this.reg)) {
              var matches = this.date_min.match(this.reg);
              this.date_min = eval(this.date_decode);
            } else
              this.date_min = "";
            var monthNav = $('<p class="month_nav"><span class="button prev" title="[Page-Up]"><i class="fa fa-angle-left"></i></span> <span class="month_name"></span> <span class="button next" title="[Page-Down]"><i class="fa fa-angle-right"></i></span></p>');
            this.monthNameSpan = $(".month_name", monthNav);
            $(".prev", monthNav).on("click", this.bindToObj(function() {
              this.moveMonthBy(-1);
              return false;
            }));
            $(".next", monthNav).on("click", this.bindToObj(function() {
              this.moveMonthBy(1);
              return false;
            }));
            this.monthNameSpan.on("dblclick", this.bindToObj(function() {
              this.monthNameSpan.empty().append(this.getMonthSelect());
              $("select", this.monthNameSpan).on("change", this.bindToObj(function() {
                this.moveMonthBy(parseInt($("select :selected", this.monthNameSpan).val()) - this.currentMonth.getMonth());
              }));
            }));
            var yearNav = $('<p class="year_nav"><span class="button prev" title="[Ctrl+Page-Up]"><i class="fa fa-angle-left"></i></span> <span class="year_name" id="year_name"></span> <span class="button next" title="[Ctrl+Page-Down]"><i class="fa fa-angle-right"></i></span></p>');
            this.yearNameSpan = $(".year_name", yearNav);
            $(".prev", yearNav).on("click", this.bindToObj(function() {
              this.moveMonthBy(-12);
              return false;
            }));
            $(".next", yearNav).on("click", this.bindToObj(function() {
              this.moveMonthBy(12);
              return false;
            }));
            this.yearNameSpan.on("dblclick", this.bindToObj(function() {
              if ($(".year_name input", this.rootLayers).length == 0) {
                var initialDate = this.yearNameSpan.html();
                var yearNameInput = $('<input type="text" class="text year_input" value="' + initialDate + '" />');
                this.yearNameSpan.empty().append(yearNameInput);
                $(".year_input", yearNav).on("keyup", this.bindToObj(function() {
                  if ($("input", this.yearNameSpan).val().length == 4 && $("input", this.yearNameSpan).val() != initialDate && parseInt($("input", this.yearNameSpan).val()) == $("input", this.yearNameSpan).val()) {
                    this.moveMonthBy(parseInt(parseInt(parseInt($("input", this.yearNameSpan).val()) - initialDate) * 12));
                  } else if ($("input", this.yearNameSpan).val().length > 4)
                    $("input", this.yearNameSpan).val($("input", this.yearNameSpan).val().substr(0, 4));
                }));
                $("input", this.yearNameSpan).trigger("focus");
                $("input", this.yearNameSpan).trigger("select");
              }
            }));
            var error_msg = $('<div class="error_msg"></div>');
            var nav = $('<div class="nav"></div>').append(error_msg, monthNav, yearNav);
            var tableShell = "<table><thead><tr>";
            if (this.show_week == 1)
              tableShell += '<th class="week_label">' + this.week_label + "</th>";
            $(this.adjustDays(this.short_day_names)).each(function() {
              tableShell += "<th>" + this + "</th>";
            });
            tableShell += "</tr></thead><tbody></tbody></table>";
            var style = this.context_hidden() ? ' style="display:block; position:static; margin:0 auto"' : "";
            this.dateSelector = this.rootLayers = $('<div class="date_selector" ' + style + "></div>").append(nav, tableShell).insertAfter(this.input);
            this.tbody = $("tbody", this.dateSelector);
            this.input.on("change", this.bindToObj(function() {
              this.selectDate();
            }));
            this.selectDate();
          },
          selectMonth: function(date3) {
            var newMonth = new Date(date3.getFullYear(), date3.getMonth(), date3.getDate());
            if (this.isNewDateAllowed(newMonth)) {
              if (!this.currentMonth || !(this.currentMonth.getFullYear() == newMonth.getFullYear() && this.currentMonth.getMonth() == newMonth.getMonth())) {
                this.currentMonth = newMonth;
                var rangeStart = this.rangeStart(date3), rangeEnd = this.rangeEnd(date3);
                var numDays = this.daysBetween(rangeStart, rangeEnd);
                var dayCells = "";
                for (var i2 = 0; i2 <= numDays; i2++) {
                  var currentDay = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate() + i2, 12, 0);
                  if (this.isFirstDayOfWeek(currentDay)) {
                    var firstDayOfWeek = currentDay;
                    var lastDayOfWeek = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate() + 6, 12, 0);
                    if (this.select_week && this.isNewDateAllowed(firstDayOfWeek))
                      dayCells += "<tr date='" + this.dateToString(currentDay) + "' class='selectable_week'>";
                    else
                      dayCells += "<tr>";
                    if (this.show_week == 1)
                      dayCells += '<td class="week_num">' + this.getWeekNum(currentDay) + "</td>";
                  }
                  if (this.select_week == 0 && currentDay.getMonth() == date3.getMonth() && this.isNewDateAllowed(currentDay) && !this.isHoliday(currentDay) || this.select_week == 1 && currentDay.getMonth() == date3.getMonth() && this.isNewDateAllowed(firstDayOfWeek)) {
                    dayCells += '<td class="selectable_day" date="' + this.dateToString(currentDay) + '">' + currentDay.getDate() + "</td>";
                  } else {
                    dayCells += '<td class="unselected_month" date="' + this.dateToString(currentDay) + '">' + currentDay.getDate() + "</td>";
                  }
                  ;
                  if (this.isLastDayOfWeek(currentDay))
                    dayCells += "</tr>";
                }
                ;
                this.tbody.empty().append(dayCells);
                this.monthNameSpan.empty().append(this.monthName(date3));
                this.yearNameSpan.empty().append(this.currentMonth.getFullYear());
                if (this.select_week == 0) {
                  $(".selectable_day", this.tbody).on("click", this.bindToObj(function(event) {
                    this.changeInput($(event.target).attr("date"));
                  }));
                } else {
                  $(".selectable_week", this.tbody).on("click", this.bindToObj(function(event) {
                    this.changeInput($(event.target.parentNode).attr("date"));
                  }));
                }
                $("td[date='" + this.dateToString(new Date()) + "']", this.tbody).addClass("today");
                if (this.select_week == 1) {
                  $("tr", this.tbody).on("mouseover", function() {
                    $(this).addClass("hover");
                  });
                  $("tr", this.tbody).on("mouseout", function() {
                    $(this).removeClass("hover");
                  });
                } else {
                  $("td.selectable_day", this.tbody).on("mouseover", function() {
                    $(this).addClass("hover");
                  });
                  $("td.selectable_day", this.tbody).on("mouseout", function() {
                    $(this).removeClass("hover");
                  });
                }
              }
              ;
              $(".selected", this.tbody).removeClass("selected");
              $('td[date="' + this.selectedDateString + '"], tr[date="' + this.selectedDateString + '"]', this.tbody).addClass("selected");
            } else
              this.show_error(this.error_out_of_range);
          },
          selectDate: function(date3) {
            if (typeof date3 == "undefined") {
              date3 = this.stringToDate(this.input.val());
            }
            ;
            if (!date3)
              date3 = new Date();
            if (this.select_week == 1 && !this.isFirstDayOfWeek(date3))
              date3 = new Date(date3.getFullYear(), date3.getMonth(), date3.getDate() - date3.getDay() + this.start_of_week, 12, 0);
            if (this.isNewDateAllowed(date3)) {
              this.selectedDate = date3;
              this.selectedDateString = this.dateToString(this.selectedDate);
              this.selectMonth(this.selectedDate);
            } else if (this.date_min && this.daysBetween(this.date_min, date3) < 0) {
              this.selectedDate = this.date_min;
              this.selectMonth(this.date_min);
              this.input.val(" ");
            } else {
              this.selectMonth(this.date_max);
              this.input.val(" ");
            }
          },
          isNewDateAllowed: function(date3) {
            return (!this.date_min || this.daysBetween(this.date_min, date3) >= 0) && (!this.date_max || this.daysBetween(date3, this.date_max) >= 0);
          },
          isHoliday: function(date3) {
            return this.indexFor(this.selectable_days, date3.getDay()) === false || this.indexFor(this.selectable, this.dateToString(date3)) === false || this.indexFor(this.non_selectable, this.dateToString(date3)) !== false || this.indexFor(this.rec_non_selectable, this.dateToShortString(date3)) !== false;
          },
          changeInput: function(dateString) {
            this.input.val(dateString).trigger("change");
            if (!this.context_hidden())
              this.hide();
          },
          show: function() {
            $(".error_msg", this.rootLayers).css("display", "none");
            this.rootLayers.show();
            $([window, document.body]).on("click", this.hideIfClickOutside);
            this.input.off("focus", this.show);
            this.input.attr("readonly", true);
            $(document.body).on("keydown", this.keydownHandler);
            this.setPosition();
          },
          hide: function() {
            if (!this.context_hidden()) {
              this.input.prop("readonly", false);
              this.rootLayers.hide();
              $([window, document.body]).off("click", this.hideIfClickOutside);
              this.input.on("focus", this.show);
              $(document.body).off("keydown", this.keydownHandler);
            }
          },
          hideIfClickOutside: function(event) {
            if (event.target != this.input[0] && !this.insideSelector(event)) {
              this.hide();
            }
            ;
          },
          insideSelector: function(event) {
            var offset = this.dateSelector.position();
            offset.right = offset.left + this.dateSelector.outerWidth();
            offset.bottom = offset.top + this.dateSelector.outerHeight();
            return event.pageY < offset.bottom && event.pageY > offset.top && event.pageX < offset.right && event.pageX > offset.left;
          },
          keydownHandler: function(event) {
            switch (event.keyCode) {
              case 9:
              case 27:
                this.hide();
                return;
                break;
              case 13:
                if (this.isNewDateAllowed(this.stringToDate(this.selectedDateString)) && !this.isHoliday(this.stringToDate(this.selectedDateString)))
                  this.changeInput(this.selectedDateString);
                break;
              case 33:
                this.moveDateMonthBy(event.ctrlKey ? -12 : -1);
                break;
              case 34:
                this.moveDateMonthBy(event.ctrlKey ? 12 : 1);
                break;
              case 38:
                this.moveDateBy(-7);
                break;
              case 40:
                this.moveDateBy(7);
                break;
              case 37:
                if (this.select_week == 0)
                  this.moveDateBy(-1);
                break;
              case 39:
                if (this.select_week == 0)
                  this.moveDateBy(1);
                break;
              default:
                return;
            }
            event.preventDefault();
          },
          stringToDate: function(string) {
            var matches;
            if (matches = string.match(this.reg)) {
              if (matches[3] == 0 && matches[2] == 0 && matches[1] == 0)
                return null;
              else
                return eval(this.date_decode);
            } else {
              return null;
            }
            ;
          },
          dateToString: function(date) {
            return eval(this.date_encode);
          },
          dateToShortString: function(date) {
            return eval(this.date_encode_s);
          },
          setPosition: function() {
            var offset = this.input.offset();
            this.rootLayers.css({
              top: offset.top + this.input.outerHeight(),
              left: offset.left
            });
            if (this.ieframe) {
              this.ieframe.css({
                width: this.dateSelector.outerWidth(),
                height: this.dateSelector.outerHeight()
              });
            }
            ;
          },
          moveDateBy: function(amount) {
            var newDate2 = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate() + amount);
            this.selectDate(newDate2);
          },
          moveDateMonthBy: function(amount) {
            var newDate2 = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + amount, this.selectedDate.getDate());
            if (newDate2.getMonth() == this.selectedDate.getMonth() + amount + 1) {
              newDate2.setDate(0);
            }
            ;
            this.selectDate(newDate2);
          },
          moveMonthBy: function(amount) {
            if (amount < 0)
              var newMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + amount + 1, -1);
            else
              var newMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + amount, 1);
            this.selectMonth(newMonth);
          },
          monthName: function(date3) {
            return this.month_names[date3.getMonth()];
          },
          getMonthSelect: function() {
            var month_select = "<select>";
            for (var i2 = 0; i2 < this.month_names.length; i2++) {
              if (i2 == this.currentMonth.getMonth())
                month_select += '<option value="' + i2 + '" selected="selected">' + this.month_names[i2] + "</option>";
              else
                month_select += '<option value="' + i2 + '">' + this.month_names[i2] + "</option>";
            }
            month_select += "</select>";
            return month_select;
          },
          bindToObj: function(fn) {
            var self = this;
            return function() {
              return fn.apply(self, arguments);
            };
          },
          bindMethodsToObj: function() {
            for (var i2 = 0; i2 < arguments.length; i2++) {
              this[arguments[i2]] = this.bindToObj(this[arguments[i2]]);
            }
            ;
          },
          indexFor: function(array2, value) {
            for (var i2 = 0; i2 < array2.length; i2++) {
              if (value == array2[i2])
                return i2;
            }
            ;
            return false;
          },
          monthNum: function(month_name) {
            return this.indexFor(this.month_names, month_name);
          },
          shortMonthNum: function(month_name) {
            return this.indexFor(this.short_month_names, month_name);
          },
          shortDayNum: function(day_name) {
            return this.indexFor(this.short_day_names, day_name);
          },
          daysBetween: function(start2, end) {
            start2 = Date.UTC(start2.getFullYear(), start2.getMonth(), start2.getDate());
            end = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
            return (end - start2) / 864e5;
          },
          changeDayTo: function(dayOfWeek, date3, direction) {
            var difference = direction * (Math.abs(date3.getDay() - dayOfWeek - direction * 7) % 7);
            return new Date(date3.getFullYear(), date3.getMonth(), date3.getDate() + difference);
          },
          rangeStart: function(date3) {
            return this.changeDayTo(this.start_of_week, new Date(date3.getFullYear(), date3.getMonth()), -1);
          },
          rangeEnd: function(date3) {
            return this.changeDayTo((this.start_of_week - 1) % 7, new Date(date3.getFullYear(), date3.getMonth() + 1, 0), 1);
          },
          isFirstDayOfWeek: function(date3) {
            return date3.getDay() == this.start_of_week;
          },
          getWeekNum: function(date3) {
            date_week = new Date(date3.getFullYear(), date3.getMonth(), date3.getDate() + 6);
            var firstDayOfYear = new Date(date_week.getFullYear(), 0, 1, 12, 0);
            var n = parseInt(this.daysBetween(firstDayOfYear, date_week)) + 1;
            return Math.floor((date_week.getDay() + n + 5) / 7) - Math.floor(date_week.getDay() / 5);
          },
          isLastDayOfWeek: function(date3) {
            return date3.getDay() == (this.start_of_week - 1) % 7;
          },
          show_error: function(error) {
            $(".error_msg", this.rootLayers).html(error);
            $(".error_msg", this.rootLayers).slideDown(400, function() {
              setTimeout("$('.error_msg', this.rootLayers).slideUp(200);", 2e3);
            });
          },
          adjustDays: function(days) {
            var newDays = [];
            for (var i2 = 0; i2 < days.length; i2++) {
              newDays[i2] = days[(i2 + this.start_of_week) % 7];
            }
            ;
            return newDays;
          },
          strpad: function(num) {
            if (parseInt(num) < 10)
              return "0" + parseInt(num);
            else
              return parseInt(num);
          }
        };
        $.fn.jdPicker = function(opts) {
          return this.each(function() {
            new jdPicker(this, opts);
          });
        };
        $.jdPicker = { initialize: function(opts) {
          $("input.jdpicker").jdPicker(opts);
        } };
        return jdPicker;
      }(jQuery);
      $($.jdPicker.initialize);
    }
  });

  // vendor/logjam/app/assets/javascripts/jquery.autocomplete.js
  var require_jquery_autocomplete = __commonJS({
    "vendor/logjam/app/assets/javascripts/jquery.autocomplete.js"(exports2) {
      (function(factory) {
        "use strict";
        if (typeof define === "function" && define.amd) {
          define(["jquery"], factory);
        } else if (typeof exports2 === "object" && typeof __require === "function") {
          factory(require_jquery());
        } else {
          factory(jQuery);
        }
      })(function($12) {
        "use strict";
        var utils = function() {
          return {
            escapeRegExChars: function(value) {
              return value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            },
            createNode: function(containerClass) {
              var div = document.createElement("div");
              div.className = containerClass;
              div.style.position = "absolute";
              div.style.display = "none";
              return div;
            }
          };
        }(), keys = {
          ESC: 27,
          TAB: 9,
          RETURN: 13,
          LEFT: 37,
          UP: 38,
          RIGHT: 39,
          DOWN: 40
        };
        function Autocomplete(el, options) {
          var noop2 = function() {
          }, that = this, defaults = {
            ajaxSettings: {},
            autoSelectFirst: false,
            appendTo: document.body,
            serviceUrl: null,
            lookup: null,
            onSelect: null,
            width: "auto",
            minChars: 1,
            maxHeight: 300,
            deferRequestBy: 0,
            params: {},
            formatResult: Autocomplete.formatResult,
            delimiter: null,
            zIndex: 9999,
            type: "GET",
            noCache: false,
            onSearchStart: noop2,
            onSearchComplete: noop2,
            onSearchError: noop2,
            containerClass: "autocomplete-suggestions",
            tabDisabled: false,
            dataType: "text",
            currentRequest: null,
            triggerSelectOnValidInput: true,
            preventBadQueries: true,
            lookupFilter: function(suggestion, originalQuery, queryLowerCase) {
              return suggestion.value.toLowerCase().indexOf(queryLowerCase) !== -1;
            },
            paramName: "query",
            transformResult: function(response) {
              return typeof response === "string" ? $12.parseJSON(response) : response;
            },
            showNoSuggestionNotice: false,
            noSuggestionNotice: "No results",
            orientation: "bottom",
            forceFixPosition: false
          };
          that.element = el;
          that.el = $12(el);
          that.suggestions = [];
          that.badQueries = [];
          that.selectedIndex = -1;
          that.currentValue = that.element.value;
          that.intervalId = 0;
          that.cachedResponse = {};
          that.onChangeInterval = null;
          that.onChange = null;
          that.isLocal = false;
          that.suggestionsContainer = null;
          that.noSuggestionsContainer = null;
          that.options = $12.extend({}, defaults, options);
          that.classes = {
            selected: "autocomplete-selected",
            suggestion: "autocomplete-suggestion"
          };
          that.hint = null;
          that.hintValue = "";
          that.selection = null;
          that.initialize();
          that.setOptions(options);
        }
        Autocomplete.utils = utils;
        $12.Autocomplete = Autocomplete;
        Autocomplete.formatResult = function(suggestion, currentValue) {
          var pattern = "(" + utils.escapeRegExChars(currentValue) + ")";
          return suggestion.value.replace(new RegExp(pattern, "gi"), "<strong>$1</strong>");
        };
        Autocomplete.prototype = {
          killerFn: null,
          initialize: function() {
            var that = this, suggestionSelector = "." + that.classes.suggestion, selected = that.classes.selected, options = that.options, container;
            that.element.setAttribute("autocomplete", "off");
            that.killerFn = function(e) {
              if ($12(e.target).closest("." + that.options.containerClass).length === 0) {
                that.killSuggestions();
                that.disableKillerFn();
              }
            };
            that.noSuggestionsContainer = $12('<div class="autocomplete-no-suggestion"></div>').html(this.options.noSuggestionNotice).get(0);
            that.suggestionsContainer = Autocomplete.utils.createNode(options.containerClass);
            container = $12(that.suggestionsContainer);
            container.appendTo(options.appendTo);
            if (options.width !== "auto") {
              container.width(options.width);
            }
            container.on("mouseover.autocomplete", suggestionSelector, function() {
              that.activate($12(this).data("index"));
            });
            container.on("mouseout.autocomplete", function() {
              that.selectedIndex = -1;
              container.children("." + selected).removeClass(selected);
            });
            container.on("click.autocomplete", suggestionSelector, function() {
              that.select($12(this).data("index"));
            });
            that.fixPositionCapture = function() {
              if (that.visible) {
                that.fixPosition();
              }
            };
            $12(window).on("resize.autocomplete", that.fixPositionCapture);
            that.el.on("keydown.autocomplete", function(e) {
              that.onKeyPress(e);
            });
            that.el.on("keyup.autocomplete", function(e) {
              that.onKeyUp(e);
            });
            that.el.on("blur.autocomplete", function() {
              that.onBlur();
            });
            that.el.on("focus.autocomplete", function() {
              that.onFocus();
            });
            that.el.on("change.autocomplete", function(e) {
              that.onKeyUp(e);
            });
          },
          onFocus: function() {
            var that = this;
            that.fixPosition();
            if (that.options.minChars <= that.el.val().length) {
              that.onValueChange();
            }
          },
          onBlur: function() {
            this.enableKillerFn();
          },
          setOptions: function(suppliedOptions) {
            var that = this, options = that.options;
            $12.extend(options, suppliedOptions);
            that.isLocal = Array.isArray(options.lookup);
            if (that.isLocal) {
              options.lookup = that.verifySuggestionsFormat(options.lookup);
            }
            options.orientation = that.validateOrientation(options.orientation, "bottom");
            $12(that.suggestionsContainer).css({
              "max-height": options.maxHeight + "px",
              "width": options.width + "px",
              "z-index": options.zIndex
            });
          },
          clearCache: function() {
            this.cachedResponse = {};
            this.badQueries = [];
          },
          clear: function() {
            this.clearCache();
            this.currentValue = "";
            this.suggestions = [];
          },
          disable: function() {
            var that = this;
            that.disabled = true;
            clearInterval(that.onChangeInterval);
            if (that.currentRequest) {
              that.currentRequest.abort();
            }
          },
          enable: function() {
            this.disabled = false;
          },
          fixPosition: function() {
            var that = this, $container = $12(that.suggestionsContainer), containerParent = $container.parent().get(0);
            if (containerParent !== document.body && !that.options.forceFixPosition)
              return;
            var orientation = that.options.orientation, containerHeight = $container.outerHeight(), height = that.el.outerHeight(), offset = that.el.offset(), styles = { "top": offset.top, "left": offset.left };
            if (orientation == "auto") {
              var viewPortHeight = $12(window).height(), scrollTop = $12(window).scrollTop(), topOverflow = -scrollTop + offset.top - containerHeight, bottomOverflow = scrollTop + viewPortHeight - (offset.top + height + containerHeight);
              orientation = Math.max(topOverflow, bottomOverflow) === topOverflow ? "top" : "bottom";
            }
            if (orientation === "top") {
              styles.top += -containerHeight;
            } else {
              styles.top += height;
            }
            if (containerParent !== document.body) {
              var opacity = $container.css("opacity"), parentOffsetDiff;
              if (!that.visible) {
                $container.css("opacity", 0).show();
              }
              parentOffsetDiff = $container.offsetParent().offset();
              styles.top -= parentOffsetDiff.top;
              styles.left -= parentOffsetDiff.left;
              if (!that.visible) {
                $container.css("opacity", opacity).hide();
              }
            }
            if (that.options.width === "auto") {
              styles.width = that.el.outerWidth() - 2 + "px";
            }
            $container.css(styles);
          },
          enableKillerFn: function() {
            var that = this;
            $12(document).on("click.autocomplete", that.killerFn);
          },
          disableKillerFn: function() {
            var that = this;
            $12(document).off("click.autocomplete", that.killerFn);
          },
          killSuggestions: function() {
            var that = this;
            that.stopKillSuggestions();
            that.intervalId = window.setInterval(function() {
              that.hide();
              that.stopKillSuggestions();
            }, 50);
          },
          stopKillSuggestions: function() {
            window.clearInterval(this.intervalId);
          },
          isCursorAtEnd: function() {
            var that = this, valLength = that.el.val().length, selectionStart = that.element.selectionStart, range3;
            if (typeof selectionStart === "number") {
              return selectionStart === valLength;
            }
            if (document.selection) {
              range3 = document.selection.createRange();
              range3.moveStart("character", -valLength);
              return valLength === range3.text.length;
            }
            return true;
          },
          onKeyPress: function(e) {
            var that = this;
            if (!that.disabled && !that.visible && e.which === keys.DOWN && that.currentValue) {
              that.suggest();
              return;
            }
            if (that.disabled || !that.visible) {
              return;
            }
            switch (e.which) {
              case keys.ESC:
                that.el.val(that.currentValue);
                that.hide();
                break;
              case keys.RIGHT:
                if (that.hint && that.options.onHint && that.isCursorAtEnd()) {
                  that.selectHint();
                  break;
                }
                return;
              case keys.TAB:
                if (that.hint && that.options.onHint) {
                  that.selectHint();
                  return;
                }
              case keys.RETURN:
                if (that.selectedIndex === -1) {
                  that.hide();
                  return;
                }
                that.select(that.selectedIndex);
                if (e.which === keys.TAB && that.options.tabDisabled === false) {
                  return;
                }
                break;
              case keys.UP:
                that.moveUp();
                break;
              case keys.DOWN:
                that.moveDown();
                break;
              default:
                return;
            }
            e.stopImmediatePropagation();
            e.preventDefault();
          },
          onKeyUp: function(e) {
            var that = this;
            if (that.disabled) {
              return;
            }
            switch (e.which) {
              case keys.UP:
              case keys.DOWN:
                return;
            }
            clearInterval(that.onChangeInterval);
            if (that.currentValue !== that.el.val()) {
              that.findBestHint();
              if (that.options.deferRequestBy > 0) {
                that.onChangeInterval = setInterval(function() {
                  that.onValueChange();
                }, that.options.deferRequestBy);
              } else {
                that.onValueChange();
              }
            }
          },
          onValueChange: function() {
            var that = this, options = that.options, value = that.el.val(), query = that.getQuery(value), index;
            if (that.selection && that.currentValue !== query) {
              that.selection = null;
              (options.onInvalidateSelection || $12.noop).call(that.element);
            }
            clearInterval(that.onChangeInterval);
            that.currentValue = value;
            that.selectedIndex = -1;
            if (options.triggerSelectOnValidInput) {
              index = that.findSuggestionIndex(query);
              if (index !== -1) {
                that.select(index);
                return;
              }
            }
            if (query.length < options.minChars) {
              that.hide();
            } else {
              that.getSuggestions(query);
            }
          },
          findSuggestionIndex: function(query) {
            var that = this, index = -1, queryLowerCase = query.toLowerCase();
            $12.each(that.suggestions, function(i2, suggestion) {
              if (suggestion.value.toLowerCase() === queryLowerCase) {
                index = i2;
                return false;
              }
            });
            return index;
          },
          getQuery: function(value) {
            var delimiter = this.options.delimiter, parts;
            if (!delimiter) {
              return value;
            }
            parts = value.split(delimiter);
            return parts[parts.length - 1].trim();
          },
          getSuggestionsLocal: function(query) {
            var that = this, options = that.options, queryLowerCase = query.toLowerCase(), filter2 = options.lookupFilter, limit = parseInt(options.lookupLimit, 10), data;
            data = {
              suggestions: $12.grep(options.lookup, function(suggestion) {
                return filter2(suggestion, query, queryLowerCase);
              })
            };
            if (limit && data.suggestions.length > limit) {
              data.suggestions = data.suggestions.slice(0, limit);
            }
            return data;
          },
          getSuggestions: function(q) {
            var response, that = this, options = that.options, serviceUrl = options.serviceUrl, params, cacheKey, ajaxSettings;
            options.params[options.paramName] = q;
            params = options.ignoreParams ? null : options.params;
            if (options.onSearchStart.call(that.element, options.params) === false) {
              return;
            }
            if (that.isLocal) {
              response = that.getSuggestionsLocal(q);
            } else {
              if (typeof serviceUrl === "function") {
                serviceUrl = serviceUrl.call(that.element, q);
              }
              cacheKey = serviceUrl + "?" + $12.param(params || {});
              response = that.cachedResponse[cacheKey];
            }
            if (response && Array.isArray(response.suggestions)) {
              that.suggestions = response.suggestions;
              that.suggest();
              options.onSearchComplete.call(that.element, q, response.suggestions);
            } else if (!that.isBadQuery(q)) {
              if (that.currentRequest) {
                that.currentRequest.abort();
              }
              ajaxSettings = {
                url: serviceUrl,
                data: params,
                type: options.type,
                dataType: options.dataType
              };
              $12.extend(ajaxSettings, options.ajaxSettings);
              that.currentRequest = $12.ajax(ajaxSettings).done(function(data) {
                var result;
                that.currentRequest = null;
                result = options.transformResult(data);
                that.processResponse(result, q, cacheKey);
                options.onSearchComplete.call(that.element, q, result.suggestions);
              }).fail(function(jqXHR, textStatus, errorThrown) {
                options.onSearchError.call(that.element, q, jqXHR, textStatus, errorThrown);
              });
            } else {
              options.onSearchComplete.call(that.element, q, []);
            }
          },
          isBadQuery: function(q) {
            if (!this.options.preventBadQueries) {
              return false;
            }
            var badQueries = this.badQueries, i2 = badQueries.length;
            while (i2--) {
              if (q.indexOf(badQueries[i2]) === 0) {
                return true;
              }
            }
            return false;
          },
          hide: function() {
            var that = this;
            that.visible = false;
            that.selectedIndex = -1;
            clearInterval(that.onChangeInterval);
            $12(that.suggestionsContainer).hide();
            that.signalHint(null);
          },
          suggest: function() {
            if (this.suggestions.length === 0) {
              this.options.showNoSuggestionNotice ? this.noSuggestions() : this.hide();
              return;
            }
            var that = this, options = that.options, groupBy = options.groupBy, formatResult = options.formatResult, value = that.getQuery(that.currentValue), className = that.classes.suggestion, classSelected = that.classes.selected, container = $12(that.suggestionsContainer), noSuggestionsContainer = $12(that.noSuggestionsContainer), beforeRender = options.beforeRender, html = "", category, formatGroup = function(suggestion, index2) {
              var currentCategory = suggestion.data[groupBy];
              if (category === currentCategory) {
                return "";
              }
              category = currentCategory;
              return '<div class="autocomplete-group"><strong>' + category + "</strong></div>";
            }, index;
            if (options.triggerSelectOnValidInput) {
              index = that.findSuggestionIndex(value);
              if (index !== -1) {
                that.select(index);
                return;
              }
            }
            $12.each(that.suggestions, function(i2, suggestion) {
              if (groupBy) {
                html += formatGroup(suggestion, value, i2);
              }
              html += '<div class="' + className + '" data-index="' + i2 + '">' + formatResult(suggestion, value) + "</div>";
            });
            this.adjustContainerWidth();
            noSuggestionsContainer.detach();
            container.html(html);
            if (options.autoSelectFirst) {
              that.selectedIndex = 0;
              container.children().first().addClass(classSelected);
            }
            if (typeof beforeRender === "function") {
              beforeRender.call(that.element, container);
            }
            that.fixPosition();
            container.show();
            that.visible = true;
            that.findBestHint();
          },
          noSuggestions: function() {
            var that = this, container = $12(that.suggestionsContainer), noSuggestionsContainer = $12(that.noSuggestionsContainer);
            this.adjustContainerWidth();
            noSuggestionsContainer.detach();
            container.empty();
            container.append(noSuggestionsContainer);
            that.fixPosition();
            container.show();
            that.visible = true;
          },
          adjustContainerWidth: function() {
            var that = this, options = that.options, width, container = $12(that.suggestionsContainer);
            if (options.width === "auto") {
              width = that.el.outerWidth() - 2;
              container.width(width > 0 ? width : 300);
            }
          },
          findBestHint: function() {
            var that = this, value = that.el.val().toLowerCase(), bestMatch = null;
            if (!value) {
              return;
            }
            $12.each(that.suggestions, function(i2, suggestion) {
              var foundMatch = suggestion.value.toLowerCase().indexOf(value) === 0;
              if (foundMatch) {
                bestMatch = suggestion;
              }
              return !foundMatch;
            });
            that.signalHint(bestMatch);
          },
          signalHint: function(suggestion) {
            var hintValue = "", that = this;
            if (suggestion) {
              hintValue = that.currentValue + suggestion.value.substr(that.currentValue.length);
            }
            if (that.hintValue !== hintValue) {
              that.hintValue = hintValue;
              that.hint = suggestion;
              (this.options.onHint || $12.noop)(hintValue);
            }
          },
          verifySuggestionsFormat: function(suggestions) {
            if (suggestions.length && typeof suggestions[0] === "string") {
              return $12.map(suggestions, function(value) {
                return { value, data: null };
              });
            }
            return suggestions;
          },
          validateOrientation: function(orientation, fallback) {
            orientation = (orientation || "").trim().toLowerCase();
            if ($12.inArray(orientation, ["auto", "bottom", "top"]) === -1) {
              orientation = fallback;
            }
            return orientation;
          },
          processResponse: function(result, originalQuery, cacheKey) {
            var that = this, options = that.options;
            result.suggestions = that.verifySuggestionsFormat(result.suggestions);
            if (!options.noCache) {
              that.cachedResponse[cacheKey] = result;
              if (options.preventBadQueries && result.suggestions.length === 0) {
                that.badQueries.push(originalQuery);
              }
            }
            if (originalQuery !== that.getQuery(that.currentValue)) {
              return;
            }
            that.suggestions = result.suggestions;
            that.suggest();
          },
          activate: function(index) {
            var that = this, activeItem, selected = that.classes.selected, container = $12(that.suggestionsContainer), children2 = container.find("." + that.classes.suggestion);
            container.find("." + selected).removeClass(selected);
            that.selectedIndex = index;
            if (that.selectedIndex !== -1 && children2.length > that.selectedIndex) {
              activeItem = children2.get(that.selectedIndex);
              $12(activeItem).addClass(selected);
              return activeItem;
            }
            return null;
          },
          selectHint: function() {
            var that = this, i2 = $12.inArray(that.hint, that.suggestions);
            that.select(i2);
          },
          select: function(i2) {
            var that = this;
            that.hide();
            that.onSelect(i2);
          },
          moveUp: function() {
            var that = this;
            if (that.selectedIndex === -1) {
              return;
            }
            if (that.selectedIndex === 0) {
              $12(that.suggestionsContainer).children().first().removeClass(that.classes.selected);
              that.selectedIndex = -1;
              that.el.val(that.currentValue);
              that.findBestHint();
              return;
            }
            that.adjustScroll(that.selectedIndex - 1);
          },
          moveDown: function() {
            var that = this;
            if (that.selectedIndex === that.suggestions.length - 1) {
              return;
            }
            that.adjustScroll(that.selectedIndex + 1);
          },
          adjustScroll: function(index) {
            var that = this, activeItem = that.activate(index), offsetTop, upperBound, lowerBound, heightDelta = 25;
            if (!activeItem) {
              return;
            }
            offsetTop = activeItem.offsetTop;
            upperBound = $12(that.suggestionsContainer).scrollTop();
            lowerBound = upperBound + that.options.maxHeight - heightDelta;
            if (offsetTop < upperBound) {
              $12(that.suggestionsContainer).scrollTop(offsetTop);
            } else if (offsetTop > lowerBound) {
              $12(that.suggestionsContainer).scrollTop(offsetTop - that.options.maxHeight + heightDelta);
            }
            that.el.val(that.getValue(that.suggestions[index].value));
            that.signalHint(null);
          },
          onSelect: function(index) {
            var that = this, onSelectCallback = that.options.onSelect, suggestion = that.suggestions[index];
            that.currentValue = that.getValue(suggestion.value);
            if (that.currentValue !== that.el.val()) {
              that.el.val(that.currentValue);
            }
            that.signalHint(null);
            that.suggestions = [];
            that.selection = suggestion;
            if (typeof onSelectCallback === "function") {
              onSelectCallback.call(that.element, suggestion);
            }
          },
          getValue: function(value) {
            var that = this, delimiter = that.options.delimiter, currentValue, parts;
            if (!delimiter) {
              return value;
            }
            currentValue = that.currentValue;
            parts = currentValue.split(delimiter);
            if (parts.length === 1) {
              return value;
            }
            return currentValue.substr(0, currentValue.length - parts[parts.length - 1].length) + value;
          },
          dispose: function() {
            var that = this;
            that.el.off(".autocomplete").removeData("autocomplete");
            that.disableKillerFn();
            $12(window).off("resize.autocomplete", that.fixPositionCapture);
            $12(that.suggestionsContainer).remove();
          }
        };
        $12.fn.autocomplete = $12.fn.devbridgeAutocomplete = function(options, args) {
          var dataKey = "autocomplete";
          if (arguments.length === 0) {
            return this.first().data(dataKey);
          }
          return this.each(function() {
            var inputElement = $12(this), instance = inputElement.data(dataKey);
            if (typeof options === "string") {
              if (instance && typeof instance[options] === "function") {
                instance[options](args);
              }
            } else {
              if (instance && instance.dispose) {
                instance.dispose();
              }
              instance = new Autocomplete(this, options);
              inputElement.data(dataKey, instance);
            }
          });
        };
      });
    }
  });

  // vendor/logjam/app/assets/javascripts/jquery.tipsy.js
  var init_jquery_tipsy = __esm({
    "vendor/logjam/app/assets/javascripts/jquery.tipsy.js"() {
      (function($12) {
        function fixTitle($ele) {
          if ($ele.attr("title") || typeof $ele.attr("original-title") != "string") {
            $ele.attr("original-title", $ele.attr("title") || "").removeAttr("title");
          }
        }
        let pixels = (n) => n.toString() + "px";
        function Tipsy(element, options) {
          this.$element = $12(element);
          this.options = options;
          this.enabled = true;
          fixTitle(this.$element);
        }
        Tipsy.prototype = {
          show: function() {
            var title = this.getTitle();
            if (title && this.enabled) {
              var $tip = this.tip();
              this.setTitle(title);
              $tip[0].className = "tipsy";
              $tip.remove().css({ top: 0, left: 0, visibility: "hidden", display: "block" }).appendTo(document.body);
              var pos = $12.extend({}, this.$element.offset(), {
                width: this.$element[0].offsetWidth,
                height: this.$element[0].offsetHeight
              });
              var actualWidth = $tip[0].offsetWidth, actualHeight = $tip[0].offsetHeight;
              var gravity = typeof this.options.gravity == "function" ? this.options.gravity.call(this.$element[0]) : this.options.gravity;
              var tp;
              switch (gravity.charAt(0)) {
                case "n":
                  tp = { top: pos.top + pos.height + this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2 };
                  break;
                case "s":
                  tp = { top: pos.top - actualHeight - this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2 };
                  break;
                case "e":
                  tp = { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth - this.options.offset };
                  break;
                case "w":
                  tp = { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width + this.options.offset };
                  break;
              }
              if (gravity.length == 2) {
                if (gravity.charAt(1) == "w") {
                  tp.left = pos.left + pos.width / 2 - 15;
                } else {
                  tp.left = pos.left + pos.width / 2 - actualWidth + 15;
                }
              }
              $tip.css(tp).addClass("tipsy-" + gravity);
              if (this.options.fade) {
                $tip.stop().css({ opacity: "0", display: "block", visibility: "visible" }).animate({ opacity: this.options.opacity });
              } else {
                $tip.css({ visibility: "visible", opacity: pixels(this.options.opacity) });
              }
            }
          },
          hide: function() {
            if (this.options.fade) {
              this.tip().stop().fadeOut(function() {
                $12(this).remove();
              });
            } else {
              this.tip().remove();
            }
          },
          getTitle: function() {
            var title, $e = this.$element, o = this.options;
            fixTitle($e);
            var title, o = this.options;
            if (typeof o.title == "string") {
              title = $e.attr(o.title == "title" ? "original-title" : o.title);
            } else if (typeof o.title == "function") {
              title = o.title.call($e[0]);
            }
            title = ("" + title).replace(/(^\s*|\s*$)/, "");
            return title || o.fallback;
          },
          setTitle: function(title) {
            this.tip().find(".tipsy-inner")[this.options.html ? "html" : "text"](title);
          },
          tip: function() {
            if (!this.$tip) {
              this.$tip = $12('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"/></div>');
            }
            return this.$tip;
          },
          validate: function() {
            if (!this.$element[0].parentNode) {
              this.hide();
              this.$element = null;
              this.options = null;
            }
          },
          enable: function() {
            this.enabled = true;
          },
          disable: function() {
            this.enabled = false;
          },
          toggleEnabled: function() {
            this.enabled = !this.enabled;
          }
        };
        $12.fn.tipsy = function(options) {
          if (options === true) {
            return this.data("tipsy");
          } else if (typeof options == "string") {
            return this.data("tipsy")[options]();
          }
          options = $12.extend({}, $12.fn.tipsy.defaults, options);
          function get3(ele) {
            var tipsy = $12.data(ele, "tipsy");
            if (!tipsy) {
              tipsy = new Tipsy(ele, $12.fn.tipsy.elementOptions(ele, options));
              $12.data(ele, "tipsy", tipsy);
            }
            return tipsy;
          }
          function enter() {
            var tipsy = get3(this);
            tipsy.hoverState = "in";
            if (options.delayIn == 0) {
              tipsy.show();
            } else {
              setTimeout(function() {
                if (tipsy.hoverState == "in")
                  tipsy.show();
              }, options.delayIn);
            }
          }
          ;
          function move(event) {
            var tipsy = get3(this);
            var tip = $12(tipsy.$tip);
            var tow = tip.width() + 10;
            var toh = tip.height() + 10;
            tipsy.hoverState = "in";
            tipsy.setTitle(tipsy.getTitle());
            if (options.follow == "x") {
              var arrow = $12(tipsy.$tip).children(".tipsy-arrow");
              var aow = $12(arrow).width() + 10;
              if (/^[^w]w$/.test(options.gravity) && arrow.position() != null) {
                var x2 = event.pageX - ($12(arrow).position().left + aow / 2);
              } else if (/^[^e]e$/.test(options.gravity) && arrow.position() != null) {
                var x2 = event.pageX - ($12(arrow).position().left + aow / 2);
              } else {
                if ("w" == options.gravity) {
                  var x2 = event.pageX;
                } else {
                  var x2 = event.pageX - tow / 2;
                }
              }
              $12(tipsy.$tip).css("left", pixels(x2 + options.offsetX));
              $12(tipsy.$tip).css("top", pixels(event.pageY - toh / 2 + options.offsetY));
            } else if (options.follow == "y") {
              if (/^w|^e/.test(options.gravity)) {
                $12(tipsy.$tip).css("top", pixels(event.pageY - toh / 2));
              }
            }
          }
          function leave() {
            var tipsy = get3(this);
            tipsy.hoverState = "out";
            if (options.delayOut == 0) {
              tipsy.hide();
            } else {
              setTimeout(function() {
                if (tipsy.hoverState == "out")
                  tipsy.hide();
              }, options.delayOut);
            }
          }
          ;
          if (!options.live)
            this.each(function() {
              get3(this);
            });
          if (options.trigger != "manual") {
            var eventIn = options.trigger == "hover" ? "mouseenter" : "focus", eventOut = options.trigger == "hover" ? "mouseleave" : "blur", eventMove = "mousemove";
            this.on(eventIn, enter).on(eventOut, leave).on(eventMove, move);
          }
          return this;
        };
        $12.fn.tipsy.defaults = {
          delayIn: 0,
          delayOut: 0,
          fade: false,
          fallback: "",
          gravity: "n",
          html: false,
          live: false,
          offset: 0,
          offsetX: 0,
          offsetY: 0,
          opacity: 1,
          title: "title",
          trigger: "hover",
          follow: false
        };
        $12.fn.tipsy.elementOptions = function(ele, options) {
          return $12.metadata ? $12.extend({}, options, $12(ele).metadata()) : options;
        };
        $12.fn.tipsy.autoNS = function() {
          return $12(this).offset().top > $12(document).scrollTop() + $12(window).height() / 2 ? "s" : "n";
        };
        $12.fn.tipsy.autoWE = function() {
          return $12(this).offset().left > $12(document).scrollLeft() + $12(window).width() / 2 ? "e" : "w";
        };
      })(jQuery);
    }
  });

  // vendor/logjam/app/assets/javascripts/select2.js
  var init_select2 = __esm({
    "vendor/logjam/app/assets/javascripts/select2.js"() {
      (function($12) {
        if (typeof $12.fn.each2 == "undefined") {
          $12.extend($12.fn, {
            each2: function(c) {
              var j2 = $12([0]), i2 = -1, l = this.length;
              while (++i2 < l && (j2.context = j2[0] = this[i2]) && c.call(j2[0], i2, j2) !== false)
                ;
              return this;
            }
          });
        }
      })(jQuery);
      (function($12, undefined2) {
        "use strict";
        if (window.Select2 !== undefined2) {
          return;
        }
        var KEY, AbstractSelect2, SingleSelect2, MultiSelect2, nextUid, sizer, lastMousePosition = { x: 0, y: 0 }, $document, scrollBarDimensions, KEY = {
          TAB: 9,
          ENTER: 13,
          ESC: 27,
          SPACE: 32,
          LEFT: 37,
          UP: 38,
          RIGHT: 39,
          DOWN: 40,
          SHIFT: 16,
          CTRL: 17,
          ALT: 18,
          PAGE_UP: 33,
          PAGE_DOWN: 34,
          HOME: 36,
          END: 35,
          BACKSPACE: 8,
          DELETE: 46,
          isArrow: function(k) {
            k = k.which ? k.which : k;
            switch (k) {
              case KEY.LEFT:
              case KEY.RIGHT:
              case KEY.UP:
              case KEY.DOWN:
                return true;
            }
            return false;
          },
          isControl: function(e) {
            var k = e.which;
            switch (k) {
              case KEY.SHIFT:
              case KEY.CTRL:
              case KEY.ALT:
                return true;
            }
            if (e.metaKey)
              return true;
            return false;
          },
          isFunctionKey: function(k) {
            k = k.which ? k.which : k;
            return k >= 112 && k <= 123;
          }
        }, MEASURE_SCROLLBAR_TEMPLATE = "<div class='select2-measure-scrollbar'></div>", DIACRITICS = { "\u24B6": "A", "\uFF21": "A", "\xC0": "A", "\xC1": "A", "\xC2": "A", "\u1EA6": "A", "\u1EA4": "A", "\u1EAA": "A", "\u1EA8": "A", "\xC3": "A", "\u0100": "A", "\u0102": "A", "\u1EB0": "A", "\u1EAE": "A", "\u1EB4": "A", "\u1EB2": "A", "\u0226": "A", "\u01E0": "A", "\xC4": "A", "\u01DE": "A", "\u1EA2": "A", "\xC5": "A", "\u01FA": "A", "\u01CD": "A", "\u0200": "A", "\u0202": "A", "\u1EA0": "A", "\u1EAC": "A", "\u1EB6": "A", "\u1E00": "A", "\u0104": "A", "\u023A": "A", "\u2C6F": "A", "\uA732": "AA", "\xC6": "AE", "\u01FC": "AE", "\u01E2": "AE", "\uA734": "AO", "\uA736": "AU", "\uA738": "AV", "\uA73A": "AV", "\uA73C": "AY", "\u24B7": "B", "\uFF22": "B", "\u1E02": "B", "\u1E04": "B", "\u1E06": "B", "\u0243": "B", "\u0182": "B", "\u0181": "B", "\u24B8": "C", "\uFF23": "C", "\u0106": "C", "\u0108": "C", "\u010A": "C", "\u010C": "C", "\xC7": "C", "\u1E08": "C", "\u0187": "C", "\u023B": "C", "\uA73E": "C", "\u24B9": "D", "\uFF24": "D", "\u1E0A": "D", "\u010E": "D", "\u1E0C": "D", "\u1E10": "D", "\u1E12": "D", "\u1E0E": "D", "\u0110": "D", "\u018B": "D", "\u018A": "D", "\u0189": "D", "\uA779": "D", "\u01F1": "DZ", "\u01C4": "DZ", "\u01F2": "Dz", "\u01C5": "Dz", "\u24BA": "E", "\uFF25": "E", "\xC8": "E", "\xC9": "E", "\xCA": "E", "\u1EC0": "E", "\u1EBE": "E", "\u1EC4": "E", "\u1EC2": "E", "\u1EBC": "E", "\u0112": "E", "\u1E14": "E", "\u1E16": "E", "\u0114": "E", "\u0116": "E", "\xCB": "E", "\u1EBA": "E", "\u011A": "E", "\u0204": "E", "\u0206": "E", "\u1EB8": "E", "\u1EC6": "E", "\u0228": "E", "\u1E1C": "E", "\u0118": "E", "\u1E18": "E", "\u1E1A": "E", "\u0190": "E", "\u018E": "E", "\u24BB": "F", "\uFF26": "F", "\u1E1E": "F", "\u0191": "F", "\uA77B": "F", "\u24BC": "G", "\uFF27": "G", "\u01F4": "G", "\u011C": "G", "\u1E20": "G", "\u011E": "G", "\u0120": "G", "\u01E6": "G", "\u0122": "G", "\u01E4": "G", "\u0193": "G", "\uA7A0": "G", "\uA77D": "G", "\uA77E": "G", "\u24BD": "H", "\uFF28": "H", "\u0124": "H", "\u1E22": "H", "\u1E26": "H", "\u021E": "H", "\u1E24": "H", "\u1E28": "H", "\u1E2A": "H", "\u0126": "H", "\u2C67": "H", "\u2C75": "H", "\uA78D": "H", "\u24BE": "I", "\uFF29": "I", "\xCC": "I", "\xCD": "I", "\xCE": "I", "\u0128": "I", "\u012A": "I", "\u012C": "I", "\u0130": "I", "\xCF": "I", "\u1E2E": "I", "\u1EC8": "I", "\u01CF": "I", "\u0208": "I", "\u020A": "I", "\u1ECA": "I", "\u012E": "I", "\u1E2C": "I", "\u0197": "I", "\u24BF": "J", "\uFF2A": "J", "\u0134": "J", "\u0248": "J", "\u24C0": "K", "\uFF2B": "K", "\u1E30": "K", "\u01E8": "K", "\u1E32": "K", "\u0136": "K", "\u1E34": "K", "\u0198": "K", "\u2C69": "K", "\uA740": "K", "\uA742": "K", "\uA744": "K", "\uA7A2": "K", "\u24C1": "L", "\uFF2C": "L", "\u013F": "L", "\u0139": "L", "\u013D": "L", "\u1E36": "L", "\u1E38": "L", "\u013B": "L", "\u1E3C": "L", "\u1E3A": "L", "\u0141": "L", "\u023D": "L", "\u2C62": "L", "\u2C60": "L", "\uA748": "L", "\uA746": "L", "\uA780": "L", "\u01C7": "LJ", "\u01C8": "Lj", "\u24C2": "M", "\uFF2D": "M", "\u1E3E": "M", "\u1E40": "M", "\u1E42": "M", "\u2C6E": "M", "\u019C": "M", "\u24C3": "N", "\uFF2E": "N", "\u01F8": "N", "\u0143": "N", "\xD1": "N", "\u1E44": "N", "\u0147": "N", "\u1E46": "N", "\u0145": "N", "\u1E4A": "N", "\u1E48": "N", "\u0220": "N", "\u019D": "N", "\uA790": "N", "\uA7A4": "N", "\u01CA": "NJ", "\u01CB": "Nj", "\u24C4": "O", "\uFF2F": "O", "\xD2": "O", "\xD3": "O", "\xD4": "O", "\u1ED2": "O", "\u1ED0": "O", "\u1ED6": "O", "\u1ED4": "O", "\xD5": "O", "\u1E4C": "O", "\u022C": "O", "\u1E4E": "O", "\u014C": "O", "\u1E50": "O", "\u1E52": "O", "\u014E": "O", "\u022E": "O", "\u0230": "O", "\xD6": "O", "\u022A": "O", "\u1ECE": "O", "\u0150": "O", "\u01D1": "O", "\u020C": "O", "\u020E": "O", "\u01A0": "O", "\u1EDC": "O", "\u1EDA": "O", "\u1EE0": "O", "\u1EDE": "O", "\u1EE2": "O", "\u1ECC": "O", "\u1ED8": "O", "\u01EA": "O", "\u01EC": "O", "\xD8": "O", "\u01FE": "O", "\u0186": "O", "\u019F": "O", "\uA74A": "O", "\uA74C": "O", "\u01A2": "OI", "\uA74E": "OO", "\u0222": "OU", "\u24C5": "P", "\uFF30": "P", "\u1E54": "P", "\u1E56": "P", "\u01A4": "P", "\u2C63": "P", "\uA750": "P", "\uA752": "P", "\uA754": "P", "\u24C6": "Q", "\uFF31": "Q", "\uA756": "Q", "\uA758": "Q", "\u024A": "Q", "\u24C7": "R", "\uFF32": "R", "\u0154": "R", "\u1E58": "R", "\u0158": "R", "\u0210": "R", "\u0212": "R", "\u1E5A": "R", "\u1E5C": "R", "\u0156": "R", "\u1E5E": "R", "\u024C": "R", "\u2C64": "R", "\uA75A": "R", "\uA7A6": "R", "\uA782": "R", "\u24C8": "S", "\uFF33": "S", "\u1E9E": "S", "\u015A": "S", "\u1E64": "S", "\u015C": "S", "\u1E60": "S", "\u0160": "S", "\u1E66": "S", "\u1E62": "S", "\u1E68": "S", "\u0218": "S", "\u015E": "S", "\u2C7E": "S", "\uA7A8": "S", "\uA784": "S", "\u24C9": "T", "\uFF34": "T", "\u1E6A": "T", "\u0164": "T", "\u1E6C": "T", "\u021A": "T", "\u0162": "T", "\u1E70": "T", "\u1E6E": "T", "\u0166": "T", "\u01AC": "T", "\u01AE": "T", "\u023E": "T", "\uA786": "T", "\uA728": "TZ", "\u24CA": "U", "\uFF35": "U", "\xD9": "U", "\xDA": "U", "\xDB": "U", "\u0168": "U", "\u1E78": "U", "\u016A": "U", "\u1E7A": "U", "\u016C": "U", "\xDC": "U", "\u01DB": "U", "\u01D7": "U", "\u01D5": "U", "\u01D9": "U", "\u1EE6": "U", "\u016E": "U", "\u0170": "U", "\u01D3": "U", "\u0214": "U", "\u0216": "U", "\u01AF": "U", "\u1EEA": "U", "\u1EE8": "U", "\u1EEE": "U", "\u1EEC": "U", "\u1EF0": "U", "\u1EE4": "U", "\u1E72": "U", "\u0172": "U", "\u1E76": "U", "\u1E74": "U", "\u0244": "U", "\u24CB": "V", "\uFF36": "V", "\u1E7C": "V", "\u1E7E": "V", "\u01B2": "V", "\uA75E": "V", "\u0245": "V", "\uA760": "VY", "\u24CC": "W", "\uFF37": "W", "\u1E80": "W", "\u1E82": "W", "\u0174": "W", "\u1E86": "W", "\u1E84": "W", "\u1E88": "W", "\u2C72": "W", "\u24CD": "X", "\uFF38": "X", "\u1E8A": "X", "\u1E8C": "X", "\u24CE": "Y", "\uFF39": "Y", "\u1EF2": "Y", "\xDD": "Y", "\u0176": "Y", "\u1EF8": "Y", "\u0232": "Y", "\u1E8E": "Y", "\u0178": "Y", "\u1EF6": "Y", "\u1EF4": "Y", "\u01B3": "Y", "\u024E": "Y", "\u1EFE": "Y", "\u24CF": "Z", "\uFF3A": "Z", "\u0179": "Z", "\u1E90": "Z", "\u017B": "Z", "\u017D": "Z", "\u1E92": "Z", "\u1E94": "Z", "\u01B5": "Z", "\u0224": "Z", "\u2C7F": "Z", "\u2C6B": "Z", "\uA762": "Z", "\u24D0": "a", "\uFF41": "a", "\u1E9A": "a", "\xE0": "a", "\xE1": "a", "\xE2": "a", "\u1EA7": "a", "\u1EA5": "a", "\u1EAB": "a", "\u1EA9": "a", "\xE3": "a", "\u0101": "a", "\u0103": "a", "\u1EB1": "a", "\u1EAF": "a", "\u1EB5": "a", "\u1EB3": "a", "\u0227": "a", "\u01E1": "a", "\xE4": "a", "\u01DF": "a", "\u1EA3": "a", "\xE5": "a", "\u01FB": "a", "\u01CE": "a", "\u0201": "a", "\u0203": "a", "\u1EA1": "a", "\u1EAD": "a", "\u1EB7": "a", "\u1E01": "a", "\u0105": "a", "\u2C65": "a", "\u0250": "a", "\uA733": "aa", "\xE6": "ae", "\u01FD": "ae", "\u01E3": "ae", "\uA735": "ao", "\uA737": "au", "\uA739": "av", "\uA73B": "av", "\uA73D": "ay", "\u24D1": "b", "\uFF42": "b", "\u1E03": "b", "\u1E05": "b", "\u1E07": "b", "\u0180": "b", "\u0183": "b", "\u0253": "b", "\u24D2": "c", "\uFF43": "c", "\u0107": "c", "\u0109": "c", "\u010B": "c", "\u010D": "c", "\xE7": "c", "\u1E09": "c", "\u0188": "c", "\u023C": "c", "\uA73F": "c", "\u2184": "c", "\u24D3": "d", "\uFF44": "d", "\u1E0B": "d", "\u010F": "d", "\u1E0D": "d", "\u1E11": "d", "\u1E13": "d", "\u1E0F": "d", "\u0111": "d", "\u018C": "d", "\u0256": "d", "\u0257": "d", "\uA77A": "d", "\u01F3": "dz", "\u01C6": "dz", "\u24D4": "e", "\uFF45": "e", "\xE8": "e", "\xE9": "e", "\xEA": "e", "\u1EC1": "e", "\u1EBF": "e", "\u1EC5": "e", "\u1EC3": "e", "\u1EBD": "e", "\u0113": "e", "\u1E15": "e", "\u1E17": "e", "\u0115": "e", "\u0117": "e", "\xEB": "e", "\u1EBB": "e", "\u011B": "e", "\u0205": "e", "\u0207": "e", "\u1EB9": "e", "\u1EC7": "e", "\u0229": "e", "\u1E1D": "e", "\u0119": "e", "\u1E19": "e", "\u1E1B": "e", "\u0247": "e", "\u025B": "e", "\u01DD": "e", "\u24D5": "f", "\uFF46": "f", "\u1E1F": "f", "\u0192": "f", "\uA77C": "f", "\u24D6": "g", "\uFF47": "g", "\u01F5": "g", "\u011D": "g", "\u1E21": "g", "\u011F": "g", "\u0121": "g", "\u01E7": "g", "\u0123": "g", "\u01E5": "g", "\u0260": "g", "\uA7A1": "g", "\u1D79": "g", "\uA77F": "g", "\u24D7": "h", "\uFF48": "h", "\u0125": "h", "\u1E23": "h", "\u1E27": "h", "\u021F": "h", "\u1E25": "h", "\u1E29": "h", "\u1E2B": "h", "\u1E96": "h", "\u0127": "h", "\u2C68": "h", "\u2C76": "h", "\u0265": "h", "\u0195": "hv", "\u24D8": "i", "\uFF49": "i", "\xEC": "i", "\xED": "i", "\xEE": "i", "\u0129": "i", "\u012B": "i", "\u012D": "i", "\xEF": "i", "\u1E2F": "i", "\u1EC9": "i", "\u01D0": "i", "\u0209": "i", "\u020B": "i", "\u1ECB": "i", "\u012F": "i", "\u1E2D": "i", "\u0268": "i", "\u0131": "i", "\u24D9": "j", "\uFF4A": "j", "\u0135": "j", "\u01F0": "j", "\u0249": "j", "\u24DA": "k", "\uFF4B": "k", "\u1E31": "k", "\u01E9": "k", "\u1E33": "k", "\u0137": "k", "\u1E35": "k", "\u0199": "k", "\u2C6A": "k", "\uA741": "k", "\uA743": "k", "\uA745": "k", "\uA7A3": "k", "\u24DB": "l", "\uFF4C": "l", "\u0140": "l", "\u013A": "l", "\u013E": "l", "\u1E37": "l", "\u1E39": "l", "\u013C": "l", "\u1E3D": "l", "\u1E3B": "l", "\u017F": "l", "\u0142": "l", "\u019A": "l", "\u026B": "l", "\u2C61": "l", "\uA749": "l", "\uA781": "l", "\uA747": "l", "\u01C9": "lj", "\u24DC": "m", "\uFF4D": "m", "\u1E3F": "m", "\u1E41": "m", "\u1E43": "m", "\u0271": "m", "\u026F": "m", "\u24DD": "n", "\uFF4E": "n", "\u01F9": "n", "\u0144": "n", "\xF1": "n", "\u1E45": "n", "\u0148": "n", "\u1E47": "n", "\u0146": "n", "\u1E4B": "n", "\u1E49": "n", "\u019E": "n", "\u0272": "n", "\u0149": "n", "\uA791": "n", "\uA7A5": "n", "\u01CC": "nj", "\u24DE": "o", "\uFF4F": "o", "\xF2": "o", "\xF3": "o", "\xF4": "o", "\u1ED3": "o", "\u1ED1": "o", "\u1ED7": "o", "\u1ED5": "o", "\xF5": "o", "\u1E4D": "o", "\u022D": "o", "\u1E4F": "o", "\u014D": "o", "\u1E51": "o", "\u1E53": "o", "\u014F": "o", "\u022F": "o", "\u0231": "o", "\xF6": "o", "\u022B": "o", "\u1ECF": "o", "\u0151": "o", "\u01D2": "o", "\u020D": "o", "\u020F": "o", "\u01A1": "o", "\u1EDD": "o", "\u1EDB": "o", "\u1EE1": "o", "\u1EDF": "o", "\u1EE3": "o", "\u1ECD": "o", "\u1ED9": "o", "\u01EB": "o", "\u01ED": "o", "\xF8": "o", "\u01FF": "o", "\u0254": "o", "\uA74B": "o", "\uA74D": "o", "\u0275": "o", "\u01A3": "oi", "\u0223": "ou", "\uA74F": "oo", "\u24DF": "p", "\uFF50": "p", "\u1E55": "p", "\u1E57": "p", "\u01A5": "p", "\u1D7D": "p", "\uA751": "p", "\uA753": "p", "\uA755": "p", "\u24E0": "q", "\uFF51": "q", "\u024B": "q", "\uA757": "q", "\uA759": "q", "\u24E1": "r", "\uFF52": "r", "\u0155": "r", "\u1E59": "r", "\u0159": "r", "\u0211": "r", "\u0213": "r", "\u1E5B": "r", "\u1E5D": "r", "\u0157": "r", "\u1E5F": "r", "\u024D": "r", "\u027D": "r", "\uA75B": "r", "\uA7A7": "r", "\uA783": "r", "\u24E2": "s", "\uFF53": "s", "\xDF": "s", "\u015B": "s", "\u1E65": "s", "\u015D": "s", "\u1E61": "s", "\u0161": "s", "\u1E67": "s", "\u1E63": "s", "\u1E69": "s", "\u0219": "s", "\u015F": "s", "\u023F": "s", "\uA7A9": "s", "\uA785": "s", "\u1E9B": "s", "\u24E3": "t", "\uFF54": "t", "\u1E6B": "t", "\u1E97": "t", "\u0165": "t", "\u1E6D": "t", "\u021B": "t", "\u0163": "t", "\u1E71": "t", "\u1E6F": "t", "\u0167": "t", "\u01AD": "t", "\u0288": "t", "\u2C66": "t", "\uA787": "t", "\uA729": "tz", "\u24E4": "u", "\uFF55": "u", "\xF9": "u", "\xFA": "u", "\xFB": "u", "\u0169": "u", "\u1E79": "u", "\u016B": "u", "\u1E7B": "u", "\u016D": "u", "\xFC": "u", "\u01DC": "u", "\u01D8": "u", "\u01D6": "u", "\u01DA": "u", "\u1EE7": "u", "\u016F": "u", "\u0171": "u", "\u01D4": "u", "\u0215": "u", "\u0217": "u", "\u01B0": "u", "\u1EEB": "u", "\u1EE9": "u", "\u1EEF": "u", "\u1EED": "u", "\u1EF1": "u", "\u1EE5": "u", "\u1E73": "u", "\u0173": "u", "\u1E77": "u", "\u1E75": "u", "\u0289": "u", "\u24E5": "v", "\uFF56": "v", "\u1E7D": "v", "\u1E7F": "v", "\u028B": "v", "\uA75F": "v", "\u028C": "v", "\uA761": "vy", "\u24E6": "w", "\uFF57": "w", "\u1E81": "w", "\u1E83": "w", "\u0175": "w", "\u1E87": "w", "\u1E85": "w", "\u1E98": "w", "\u1E89": "w", "\u2C73": "w", "\u24E7": "x", "\uFF58": "x", "\u1E8B": "x", "\u1E8D": "x", "\u24E8": "y", "\uFF59": "y", "\u1EF3": "y", "\xFD": "y", "\u0177": "y", "\u1EF9": "y", "\u0233": "y", "\u1E8F": "y", "\xFF": "y", "\u1EF7": "y", "\u1E99": "y", "\u1EF5": "y", "\u01B4": "y", "\u024F": "y", "\u1EFF": "y", "\u24E9": "z", "\uFF5A": "z", "\u017A": "z", "\u1E91": "z", "\u017C": "z", "\u017E": "z", "\u1E93": "z", "\u1E95": "z", "\u01B6": "z", "\u0225": "z", "\u0240": "z", "\u2C6C": "z", "\uA763": "z", "\u0386": "\u0391", "\u0388": "\u0395", "\u0389": "\u0397", "\u038A": "\u0399", "\u03AA": "\u0399", "\u038C": "\u039F", "\u038E": "\u03A5", "\u03AB": "\u03A5", "\u038F": "\u03A9", "\u03AC": "\u03B1", "\u03AD": "\u03B5", "\u03AE": "\u03B7", "\u03AF": "\u03B9", "\u03CA": "\u03B9", "\u0390": "\u03B9", "\u03CC": "\u03BF", "\u03CD": "\u03C5", "\u03CB": "\u03C5", "\u03B0": "\u03C5", "\u03C9": "\u03C9", "\u03C2": "\u03C3" };
        $document = $12(document);
        nextUid = function() {
          var counter = 1;
          return function() {
            return counter++;
          };
        }();
        function reinsertElement(element) {
          var placeholder = $12(document.createTextNode(""));
          element.before(placeholder);
          placeholder.before(element);
          placeholder.remove();
        }
        function stripDiacritics(str) {
          function match(a) {
            return DIACRITICS[a] || a;
          }
          return str.replace(/[^\u0000-\u007E]/g, match);
        }
        function indexOf(value, array2) {
          var i2 = 0, l = array2.length;
          for (; i2 < l; i2 = i2 + 1) {
            if (equal(value, array2[i2]))
              return i2;
          }
          return -1;
        }
        function measureScrollbar() {
          var $template = $12(MEASURE_SCROLLBAR_TEMPLATE);
          $template.appendTo("body");
          var dim = {
            width: $template.width() - $template[0].clientWidth,
            height: $template.height() - $template[0].clientHeight
          };
          $template.remove();
          return dim;
        }
        function equal(a, b) {
          if (a === b)
            return true;
          if (a === undefined2 || b === undefined2)
            return false;
          if (a === null || b === null)
            return false;
          if (a.constructor === String)
            return a + "" === b + "";
          if (b.constructor === String)
            return b + "" === a + "";
          return false;
        }
        function splitVal(string2, separator) {
          var val, i2, l;
          if (string2 === null || string2.length < 1)
            return [];
          val = string2.split(separator);
          for (i2 = 0, l = val.length; i2 < l; i2 = i2 + 1)
            val[i2] = val[i2].trim();
          return val;
        }
        function getSideBorderPadding(element) {
          return element.outerWidth(false) - element.width();
        }
        function installKeyUpChangeEvent(element) {
          var key = "keyup-change-value";
          element.on("keydown", function() {
            if ($12.data(element, key) === undefined2) {
              $12.data(element, key, element.val());
            }
          });
          element.on("keyup", function() {
            var val = $12.data(element, key);
            if (val !== undefined2 && element.val() !== val) {
              $12.removeData(element, key);
              element.trigger("keyup-change");
            }
          });
        }
        function installFilteredMouseMove(element) {
          element.on("mousemove", function(e) {
            var lastpos = lastMousePosition;
            if (lastpos === undefined2 || lastpos.x !== e.pageX || lastpos.y !== e.pageY) {
              $12(e.target).trigger("mousemove-filtered", e);
            }
          });
        }
        function debounce(quietMillis, fn, ctx) {
          ctx = ctx || undefined2;
          var timeout2;
          return function() {
            var args = arguments;
            window.clearTimeout(timeout2);
            timeout2 = window.setTimeout(function() {
              fn.apply(ctx, args);
            }, quietMillis);
          };
        }
        function installDebouncedScroll(threshold, element) {
          var notify = debounce(threshold, function(e) {
            element.trigger("scroll-debounced", e);
          });
          element.on("scroll", function(e) {
            if (indexOf(e.target, element.get()) >= 0)
              notify(e);
          });
        }
        function focus($el) {
          if ($el[0] === document.activeElement)
            return;
          window.setTimeout(function() {
            var el = $el[0], pos = $el.val().length, range3;
            $el.trigger("focus");
            var isVisible = el.offsetWidth > 0 || el.offsetHeight > 0;
            if (isVisible && el === document.activeElement) {
              if (el.setSelectionRange) {
                el.setSelectionRange(pos, pos);
              } else if (el.createTextRange) {
                range3 = el.createTextRange();
                range3.collapse(false);
                range3.select();
              }
            }
          }, 0);
        }
        function getCursorInfo(el) {
          el = $12(el)[0];
          var offset = 0;
          var length = 0;
          if ("selectionStart" in el) {
            offset = el.selectionStart;
            length = el.selectionEnd - offset;
          } else if ("selection" in document) {
            el.trigger("focus");
            var sel = document.selection.createRange();
            length = document.selection.createRange().text.length;
            sel.moveStart("character", -el.value.length);
            offset = sel.text.length - length;
          }
          return { offset, length };
        }
        function killEvent(event) {
          event.preventDefault();
          event.stopPropagation();
        }
        function killEventImmediately(event) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
        function measureTextWidth(e) {
          if (!sizer) {
            var style2 = e[0].currentStyle || window.getComputedStyle(e[0], null);
            sizer = $12(document.createElement("div")).css({
              position: "absolute",
              left: "-10000px",
              top: "-10000px",
              display: "none",
              fontSize: style2.fontSize,
              fontFamily: style2.fontFamily,
              fontStyle: style2.fontStyle,
              fontWeight: style2.fontWeight,
              letterSpacing: style2.letterSpacing,
              textTransform: style2.textTransform,
              whiteSpace: "nowrap"
            });
            sizer.attr("class", "select2-sizer");
            $12("body").append(sizer);
          }
          sizer.text(e.val());
          return sizer.width();
        }
        function syncCssClasses(dest, src, adapter) {
          var classes, replacements = [], adapted;
          classes = dest.attr("class");
          if (classes) {
            classes = "" + classes.trim();
            $12(classes.split(/\s+/)).each2(function() {
              if (this.indexOf("select2-") === 0) {
                replacements.push(this);
              }
            });
          }
          classes = src.attr("class");
          if (classes) {
            classes = "" + classes.trim();
            $12(classes.split(/\s+/)).each2(function() {
              if (this.indexOf("select2-") !== 0) {
                adapted = adapter(this);
                if (adapted) {
                  replacements.push(adapted);
                }
              }
            });
          }
          dest.attr("class", replacements.join(" "));
        }
        function markMatch(text, term, markup, escapeMarkup) {
          var match = stripDiacritics(text.toUpperCase()).indexOf(stripDiacritics(term.toUpperCase())), tl = term.length;
          if (match < 0) {
            markup.push(escapeMarkup(text));
            return;
          }
          markup.push(escapeMarkup(text.substring(0, match)));
          markup.push("<span class='select2-match'>");
          markup.push(escapeMarkup(text.substring(match, match + tl)));
          markup.push("</span>");
          markup.push(escapeMarkup(text.substring(match + tl, text.length)));
        }
        function defaultEscapeMarkup(markup) {
          var replace_map = {
            "\\": "&#92;",
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
            "/": "&#47;"
          };
          return String(markup).replace(/[&<>"'\/\\]/g, function(match) {
            return replace_map[match];
          });
        }
        function ajax(options) {
          var timeout2, handler = null, quietMillis = options.quietMillis || 100, ajaxUrl = options.url, self = this;
          return function(query) {
            window.clearTimeout(timeout2);
            timeout2 = window.setTimeout(function() {
              var data = options.data, url = ajaxUrl, transport = options.transport || $12.fn.select2.ajaxDefaults.transport, deprecated = {
                type: options.type || "GET",
                cache: options.cache || false,
                jsonpCallback: options.jsonpCallback || undefined2,
                dataType: options.dataType || "json"
              }, params = $12.extend({}, $12.fn.select2.ajaxDefaults.params, deprecated);
              data = data ? data.call(self, query.term, query.page, query.context) : null;
              url = typeof url === "function" ? url.call(self, query.term, query.page, query.context) : url;
              if (handler && typeof handler.abort === "function") {
                handler.abort();
              }
              if (options.params) {
                if (typeof options.params === "function") {
                  $12.extend(params, options.params.call(self));
                } else {
                  $12.extend(params, options.params);
                }
              }
              $12.extend(params, {
                url,
                dataType: options.dataType,
                data,
                success: function(data2) {
                  var results = options.results(data2, query.page, query);
                  query.callback(results);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                  var results = {
                    hasError: true,
                    jqXHR,
                    textStatus,
                    errorThrown
                  };
                  query.callback(results);
                }
              });
              handler = transport.call(self, params);
            }, quietMillis);
          };
        }
        let isFunction = (fn) => typeof fn === "function";
        function local(options) {
          var data = options, dataText, tmp, text = function(item) {
            return "" + item.text;
          };
          if (Array.isArray(data)) {
            tmp = data;
            data = { results: tmp };
          }
          if (isFunction(data) === false) {
            tmp = data;
            data = function() {
              return tmp;
            };
          }
          var dataItem = data();
          if (dataItem.text) {
            text = dataItem.text;
            if (!isFunction(text)) {
              dataText = dataItem.text;
              text = function(item) {
                return item[dataText];
              };
            }
          }
          return function(query) {
            var t = query.term, filtered = { results: [] }, process;
            if (t === "") {
              query.callback(data());
              return;
            }
            process = function(datum2, collection) {
              var group, attr;
              datum2 = datum2[0];
              if (datum2.children) {
                group = {};
                for (attr in datum2) {
                  if (datum2.hasOwnProperty(attr))
                    group[attr] = datum2[attr];
                }
                group.children = [];
                $12(datum2.children).each2(function(i2, childDatum) {
                  process(childDatum, group.children);
                });
                if (group.children.length || query.matcher(t, text(group), datum2)) {
                  collection.push(group);
                }
              } else {
                if (query.matcher(t, text(datum2), datum2)) {
                  collection.push(datum2);
                }
              }
            };
            $12(data().results).each2(function(i2, datum2) {
              process(datum2, filtered.results);
            });
            query.callback(filtered);
          };
        }
        function tags(data) {
          var isFunc = isFunction(data);
          return function(query) {
            var t = query.term, filtered = { results: [] };
            var result = isFunc ? data(query) : data;
            if (Array.isArray(result)) {
              $12(result).each(function() {
                var isObject = this.text !== undefined2, text = isObject ? this.text : this;
                if (t === "" || query.matcher(t, text)) {
                  filtered.results.push(isObject ? this : { id: this, text: this });
                }
              });
              query.callback(filtered);
            }
          };
        }
        function checkFormatter(formatter, formatterName) {
          if (isFunction(formatter))
            return true;
          if (!formatter)
            return false;
          if (typeof formatter === "string")
            return true;
          throw new Error(formatterName + " must be a string, function, or falsy value");
        }
        function evaluate(val, context2) {
          if (isFunction(val)) {
            var args = Array.prototype.slice.call(arguments, 2);
            return val.apply(context2, args);
          }
          return val;
        }
        function countResults(results) {
          var count = 0;
          $12.each(results, function(i2, item) {
            if (item.children) {
              count += countResults(item.children);
            } else {
              count++;
            }
          });
          return count;
        }
        function defaultTokenizer(input, selection2, selectCallback, opts) {
          var original = input, dupe = false, token, index, i2, l, separator;
          if (!opts.createSearchChoice || !opts.tokenSeparators || opts.tokenSeparators.length < 1)
            return undefined2;
          while (true) {
            index = -1;
            for (i2 = 0, l = opts.tokenSeparators.length; i2 < l; i2++) {
              separator = opts.tokenSeparators[i2];
              index = input.indexOf(separator);
              if (index >= 0)
                break;
            }
            if (index < 0)
              break;
            token = input.substring(0, index);
            input = input.substring(index + separator.length);
            if (token.length > 0) {
              token = opts.createSearchChoice.call(this, token, selection2);
              if (token !== undefined2 && token !== null && opts.id(token) !== undefined2 && opts.id(token) !== null) {
                dupe = false;
                for (i2 = 0, l = selection2.length; i2 < l; i2++) {
                  if (equal(opts.id(token), opts.id(selection2[i2]))) {
                    dupe = true;
                    break;
                  }
                }
                if (!dupe)
                  selectCallback(token);
              }
            }
          }
          if (original !== input)
            return input;
        }
        function cleanupJQueryElements() {
          var self = this;
          $12.each(arguments, function(i2, element) {
            self[element].remove();
            self[element] = null;
          });
        }
        function clazz(SuperClass, methods) {
          var constructor = function() {
          };
          constructor.prototype = new SuperClass();
          constructor.prototype.constructor = constructor;
          constructor.prototype.parent = SuperClass.prototype;
          constructor.prototype = $12.extend(constructor.prototype, methods);
          return constructor;
        }
        AbstractSelect2 = clazz(Object, {
          bind: function(func) {
            var self = this;
            return function() {
              func.apply(self, arguments);
            };
          },
          init: function(opts) {
            var results, search, resultsSelector = ".select2-results";
            this.opts = opts = this.prepareOpts(opts);
            this.id = opts.id;
            if (opts.element.data("select2") !== undefined2 && opts.element.data("select2") !== null) {
              opts.element.data("select2").destroy();
            }
            this.container = this.createContainer();
            this.liveRegion = $12("<span>", {
              role: "status",
              "aria-live": "polite"
            }).addClass("select2-hidden-accessible").appendTo(document.body);
            this.containerId = "s2id_" + (opts.element.attr("id") || "autogen" + nextUid());
            this.containerEventName = this.containerId.replace(/([.])/g, "_").replace(/([;&,\-\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, "\\$1");
            this.container.attr("id", this.containerId);
            this.container.attr("title", opts.element.attr("title"));
            this.body = $12("body");
            syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);
            this.container.attr("style", opts.element.attr("style"));
            this.container.css(evaluate(opts.containerCss, this.opts.element));
            this.container.addClass(evaluate(opts.containerCssClass, this.opts.element));
            this.elementTabIndex = this.opts.element.attr("tabindex");
            this.opts.element.data("select2", this).attr("tabindex", "-1").before(this.container).on("click.select2", killEvent);
            this.container.data("select2", this);
            this.dropdown = this.container.find(".select2-drop");
            syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);
            this.dropdown.addClass(evaluate(opts.dropdownCssClass, this.opts.element));
            this.dropdown.data("select2", this);
            this.dropdown.on("click", killEvent);
            this.results = results = this.container.find(resultsSelector);
            this.search = search = this.container.find("input.select2-input");
            this.queryCount = 0;
            this.resultsPage = 0;
            this.context = null;
            this.initContainer();
            this.container.on("click", killEvent);
            installFilteredMouseMove(this.results);
            this.dropdown.on("mousemove-filtered", resultsSelector, this.bind(this.highlightUnderEvent));
            this.dropdown.on("touchstart touchmove touchend", resultsSelector, this.bind(function(event) {
              this._touchEvent = true;
              this.highlightUnderEvent(event);
            }));
            this.dropdown.on("touchmove", resultsSelector, this.bind(this.touchMoved));
            this.dropdown.on("touchstart touchend", resultsSelector, this.bind(this.clearTouchMoved));
            this.dropdown.on("click", this.bind(function(event) {
              if (this._touchEvent) {
                this._touchEvent = false;
                this.selectHighlighted();
              }
            }));
            installDebouncedScroll(80, this.results);
            this.dropdown.on("scroll-debounced", resultsSelector, this.bind(this.loadMoreIfNeeded));
            $12(this.container).on("change", ".select2-input", function(e) {
              e.stopPropagation();
            });
            $12(this.dropdown).on("change", ".select2-input", function(e) {
              e.stopPropagation();
            });
            if ($12.fn.mousewheel) {
              results.mousewheel(function(e, delta, deltaX, deltaY) {
                var top2 = results.scrollTop();
                if (deltaY > 0 && top2 - deltaY <= 0) {
                  results.scrollTop(0);
                  killEvent(e);
                } else if (deltaY < 0 && results.get(0).scrollHeight - results.scrollTop() + deltaY <= results.height()) {
                  results.scrollTop(results.get(0).scrollHeight - results.height());
                  killEvent(e);
                }
              });
            }
            installKeyUpChangeEvent(search);
            search.on("keyup-change input paste", this.bind(this.updateResults));
            search.on("focus", function() {
              search.addClass("select2-focused");
            });
            search.on("blur", function() {
              search.removeClass("select2-focused");
            });
            this.dropdown.on("mouseup", resultsSelector, this.bind(function(e) {
              if ($12(e.target).closest(".select2-result-selectable").length > 0) {
                this.highlightUnderEvent(e);
                this.selectHighlighted(e);
              }
            }));
            this.dropdown.on("click mouseup mousedown touchstart touchend focusin", function(e) {
              e.stopPropagation();
            });
            this.nextSearchTerm = undefined2;
            if (isFunction(this.opts.initSelection)) {
              this.initSelection();
              this.monitorSource();
            }
            if (opts.maximumInputLength !== null) {
              this.search.attr("maxlength", opts.maximumInputLength);
            }
            var disabled = opts.element.prop("disabled");
            if (disabled === undefined2)
              disabled = false;
            this.enable(!disabled);
            var readonly = opts.element.prop("readonly");
            if (readonly === undefined2)
              readonly = false;
            this.readonly(readonly);
            scrollBarDimensions = scrollBarDimensions || measureScrollbar();
            this.autofocus = opts.element.prop("autofocus");
            opts.element.prop("autofocus", false);
            if (this.autofocus)
              this.trigger("focus");
            this.search.attr("placeholder", opts.searchInputPlaceholder);
          },
          destroy: function() {
            var element = this.opts.element, select2 = element.data("select2"), self = this;
            this.close();
            if (element.length && element[0].detachEvent) {
              element.each(function() {
                this.detachEvent("onpropertychange", self._sync);
              });
            }
            if (this.propertyObserver) {
              this.propertyObserver.disconnect();
              this.propertyObserver = null;
            }
            this._sync = null;
            if (select2 !== undefined2) {
              select2.container.remove();
              select2.liveRegion.remove();
              select2.dropdown.remove();
              element.removeClass("select2-offscreen").removeData("select2").off(".select2").prop("autofocus", this.autofocus || false);
              if (this.elementTabIndex) {
                element.attr({ tabindex: this.elementTabIndex });
              } else {
                element.removeAttr("tabindex");
              }
              element.show();
            }
            cleanupJQueryElements.call(
              this,
              "container",
              "liveRegion",
              "dropdown",
              "results",
              "search"
            );
          },
          optionToData: function(element) {
            if (element.is("option")) {
              return {
                id: element.prop("value"),
                text: element.text(),
                element: element.get(),
                css: element.attr("class"),
                disabled: element.prop("disabled"),
                locked: equal(element.attr("locked"), "locked") || equal(element.data("locked"), true)
              };
            } else if (element.is("optgroup")) {
              return {
                text: element.attr("label"),
                children: [],
                element: element.get(),
                css: element.attr("class")
              };
            }
          },
          prepareOpts: function(opts) {
            var element, select, idKey, ajaxUrl, self = this;
            element = opts.element;
            if (element.get(0).tagName.toLowerCase() === "select") {
              this.select = select = opts.element;
            }
            if (select) {
              $12.each(["id", "multiple", "ajax", "query", "createSearchChoice", "initSelection", "data", "tags"], function() {
                if (this in opts) {
                  throw new Error("Option '" + this + "' is not allowed for Select2 when attached to a <select> element.");
                }
              });
            }
            opts = $12.extend({}, {
              populateResults: function(container, results, query) {
                var populate, id2 = this.opts.id, liveRegion = this.liveRegion;
                populate = function(results2, container2, depth) {
                  var i2, l, result, selectable, disabled, compound, node, label, innerContainer, formatted;
                  results2 = opts.sortResults(results2, container2, query);
                  var nodes = [];
                  for (i2 = 0, l = results2.length; i2 < l; i2 = i2 + 1) {
                    result = results2[i2];
                    disabled = result.disabled === true;
                    selectable = !disabled && id2(result) !== undefined2;
                    compound = result.children && result.children.length > 0;
                    node = $12("<li></li>");
                    node.addClass("select2-results-dept-" + depth);
                    node.addClass("select2-result");
                    node.addClass(selectable ? "select2-result-selectable" : "select2-result-unselectable");
                    if (disabled) {
                      node.addClass("select2-disabled");
                    }
                    if (compound) {
                      node.addClass("select2-result-with-children");
                    }
                    node.addClass(self.opts.formatResultCssClass(result));
                    node.attr("role", "presentation");
                    label = $12(document.createElement("div"));
                    label.addClass("select2-result-label");
                    label.attr("id", "select2-result-label-" + nextUid());
                    label.attr("role", "option");
                    label.attr("title", result.text);
                    formatted = opts.formatResult(result, label, query, self.opts.escapeMarkup);
                    if (formatted !== undefined2) {
                      label.html(formatted);
                      node.append(label);
                    }
                    if (compound) {
                      innerContainer = $12("<ul></ul>");
                      innerContainer.addClass("select2-result-sub");
                      populate(result.children, innerContainer, depth + 1);
                      node.append(innerContainer);
                    }
                    node.data("select2-data", result);
                    nodes.push(node[0]);
                  }
                  container2.append(nodes);
                  liveRegion.text(opts.formatMatches(results2.length));
                };
                populate(results, container, 0);
              }
            }, $12.fn.select2.defaults, opts);
            if (typeof opts.id !== "function") {
              idKey = opts.id;
              opts.id = function(e) {
                return e[idKey];
              };
            }
            if (Array.isArray(opts.element.data("select2Tags"))) {
              if ("tags" in opts) {
                throw "tags specified as both an attribute 'data-select2-tags' and in options of Select2 " + opts.element.attr("id");
              }
              opts.tags = opts.element.data("select2Tags");
            }
            if (select) {
              opts.query = this.bind(function(query) {
                var data = { results: [], more: false }, term = query.term, children2, placeholderOption, process;
                process = function(element2, collection) {
                  var group;
                  if (element2.is("option")) {
                    if (query.matcher(term, element2.text(), element2)) {
                      collection.push(self.optionToData(element2));
                    }
                  } else if (element2.is("optgroup")) {
                    group = self.optionToData(element2);
                    element2.children().each2(function(i2, elm) {
                      process(elm, group.children);
                    });
                    if (group.children.length > 0) {
                      collection.push(group);
                    }
                  }
                };
                children2 = element.children();
                if (this.getPlaceholder() !== undefined2 && children2.length > 0) {
                  placeholderOption = this.getPlaceholderOption();
                  if (placeholderOption) {
                    children2 = children2.not(placeholderOption);
                  }
                }
                children2.each2(function(i2, elm) {
                  process(elm, data.results);
                });
                query.callback(data);
              });
              opts.id = function(e) {
                return e.id;
              };
            } else {
              if (!("query" in opts)) {
                if ("ajax" in opts) {
                  ajaxUrl = opts.element.data("ajax-url");
                  if (ajaxUrl && ajaxUrl.length > 0) {
                    opts.ajax.url = ajaxUrl;
                  }
                  opts.query = ajax.call(opts.element, opts.ajax);
                } else if ("data" in opts) {
                  opts.query = local(opts.data);
                } else if ("tags" in opts) {
                  opts.query = tags(opts.tags);
                  if (opts.createSearchChoice === undefined2) {
                    opts.createSearchChoice = function(term) {
                      return { id: term.trim(), text: term.trim() };
                    };
                  }
                  if (opts.initSelection === undefined2) {
                    opts.initSelection = function(element2, callback) {
                      var data = [];
                      $12(splitVal(element2.val(), opts.separator)).each(function() {
                        var obj = { id: this, text: this }, tags2 = opts.tags;
                        if (isFunction(tags2))
                          tags2 = tags2();
                        $12(tags2).each(function() {
                          if (equal(this.id, obj.id)) {
                            obj = this;
                            return false;
                          }
                        });
                        data.push(obj);
                      });
                      callback(data);
                    };
                  }
                }
              }
            }
            if (typeof opts.query !== "function") {
              throw "query function not defined for Select2 " + opts.element.attr("id");
            }
            if (opts.createSearchChoicePosition === "top") {
              opts.createSearchChoicePosition = function(list, item) {
                list.unshift(item);
              };
            } else if (opts.createSearchChoicePosition === "bottom") {
              opts.createSearchChoicePosition = function(list, item) {
                list.push(item);
              };
            } else if (typeof opts.createSearchChoicePosition !== "function") {
              throw "invalid createSearchChoicePosition option must be 'top', 'bottom' or a custom function";
            }
            return opts;
          },
          monitorSource: function() {
            var el = this.opts.element, observer, self = this;
            el.on("change.select2", this.bind(function(e) {
              if (this.opts.element.data("select2-change-triggered") !== true) {
                this.initSelection();
              }
            }));
            this._sync = this.bind(function() {
              var disabled = el.prop("disabled");
              if (disabled === undefined2)
                disabled = false;
              this.enable(!disabled);
              var readonly = el.prop("readonly");
              if (readonly === undefined2)
                readonly = false;
              this.readonly(readonly);
              syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);
              this.container.addClass(evaluate(this.opts.containerCssClass, this.opts.element));
              syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);
              this.dropdown.addClass(evaluate(this.opts.dropdownCssClass, this.opts.element));
            });
            if (el.length && el[0].attachEvent) {
              el.each(function() {
                this.attachEvent("onpropertychange", self._sync);
              });
            }
            observer = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
            if (observer !== undefined2) {
              if (this.propertyObserver) {
                delete this.propertyObserver;
                this.propertyObserver = null;
              }
              this.propertyObserver = new observer(function(mutations) {
                $12.each(mutations, self._sync);
              });
              this.propertyObserver.observe(el.get(0), { attributes: true, subtree: false });
            }
          },
          triggerSelect: function(data) {
            var evt = $12.Event("select2-selecting", { val: this.id(data), object: data, choice: data });
            this.opts.element.trigger(evt);
            return !evt.isDefaultPrevented();
          },
          triggerChange: function(details) {
            details = details || {};
            details = $12.extend({}, details, { type: "change", val: this.val() });
            this.opts.element.data("select2-change-triggered", true);
            this.opts.element.trigger(details);
            this.opts.element.data("select2-change-triggered", false);
            this.opts.element.trigger("click");
            if (this.opts.blurOnChange)
              this.opts.element.blur();
          },
          isInterfaceEnabled: function() {
            return this.enabledInterface === true;
          },
          enableInterface: function() {
            var enabled = this._enabled && !this._readonly, disabled = !enabled;
            if (enabled === this.enabledInterface)
              return false;
            this.container.toggleClass("select2-container-disabled", disabled);
            this.close();
            this.enabledInterface = enabled;
            return true;
          },
          enable: function(enabled) {
            if (enabled === undefined2)
              enabled = true;
            if (this._enabled === enabled)
              return;
            this._enabled = enabled;
            this.opts.element.prop("disabled", !enabled);
            this.enableInterface();
          },
          disable: function() {
            this.enable(false);
          },
          readonly: function(enabled) {
            if (enabled === undefined2)
              enabled = false;
            if (this._readonly === enabled)
              return;
            this._readonly = enabled;
            this.opts.element.prop("readonly", enabled);
            this.enableInterface();
          },
          opened: function() {
            return this.container ? this.container.hasClass("select2-dropdown-open") : false;
          },
          positionDropdown: function() {
            var $dropdown = this.dropdown, offset = this.container.offset(), height = this.container.outerHeight(false), width = this.container.outerWidth(false), dropHeight = $dropdown.outerHeight(false), $window = $12(window), windowWidth = $window.width(), windowHeight = $window.height(), viewPortRight = $window.scrollLeft() + windowWidth, viewportBottom = $window.scrollTop() + windowHeight, dropTop = offset.top + height, dropLeft = offset.left, enoughRoomBelow = dropTop + dropHeight <= viewportBottom, enoughRoomAbove = offset.top - dropHeight >= $window.scrollTop(), dropWidth = $dropdown.outerWidth(false), enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight, aboveNow = $dropdown.hasClass("select2-drop-above"), bodyOffset, above, changeDirection, css, resultsListNode;
            if (aboveNow) {
              above = true;
              if (!enoughRoomAbove && enoughRoomBelow) {
                changeDirection = true;
                above = false;
              }
            } else {
              above = false;
              if (!enoughRoomBelow && enoughRoomAbove) {
                changeDirection = true;
                above = true;
              }
            }
            if (changeDirection) {
              $dropdown.hide();
              offset = this.container.offset();
              height = this.container.outerHeight(false);
              width = this.container.outerWidth(false);
              dropHeight = $dropdown.outerHeight(false);
              viewPortRight = $window.scrollLeft() + windowWidth;
              viewportBottom = $window.scrollTop() + windowHeight;
              dropTop = offset.top + height;
              dropLeft = offset.left;
              dropWidth = $dropdown.outerWidth(false);
              enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight;
              $dropdown.show();
              this.focusSearch();
            }
            if (this.opts.dropdownAutoWidth) {
              resultsListNode = $12(".select2-results", $dropdown)[0];
              $dropdown.addClass("select2-drop-auto-width");
              $dropdown.css("width", "");
              dropWidth = $dropdown.outerWidth(false) + (resultsListNode.scrollHeight === resultsListNode.clientHeight ? 0 : scrollBarDimensions.width);
              dropWidth > width ? width = dropWidth : dropWidth = width;
              dropHeight = $dropdown.outerHeight(false);
              enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight;
            } else {
              this.container.removeClass("select2-drop-auto-width");
            }
            if (this.body.css("position") !== "static") {
              bodyOffset = this.body.offset();
              dropTop -= bodyOffset.top;
              dropLeft -= bodyOffset.left;
            }
            if (!enoughRoomOnRight) {
              dropLeft = offset.left + this.container.outerWidth(false) - dropWidth;
            }
            css = {
              left: dropLeft,
              width
            };
            if (above) {
              css.top = offset.top - dropHeight;
              css.bottom = "auto";
              this.container.addClass("select2-drop-above");
              $dropdown.addClass("select2-drop-above");
            } else {
              css.top = dropTop;
              css.bottom = "auto";
              this.container.removeClass("select2-drop-above");
              $dropdown.removeClass("select2-drop-above");
            }
            css = $12.extend(css, evaluate(this.opts.dropdownCss, this.opts.element));
            $dropdown.css(css);
          },
          shouldOpen: function() {
            var event;
            if (this.opened())
              return false;
            if (this._enabled === false || this._readonly === true)
              return false;
            event = $12.Event("select2-opening");
            this.opts.element.trigger(event);
            return !event.isDefaultPrevented();
          },
          clearDropdownAlignmentPreference: function() {
            this.container.removeClass("select2-drop-above");
            this.dropdown.removeClass("select2-drop-above");
          },
          open: function() {
            if (!this.shouldOpen())
              return false;
            this.opening();
            $document.on("mousemove.select2Event", function(e) {
              lastMousePosition.x = e.pageX;
              lastMousePosition.y = e.pageY;
            });
            return true;
          },
          opening: function() {
            var cid = this.containerEventName, scroll = "scroll." + cid, resize = "resize." + cid, orient = "orientationchange." + cid, mask;
            this.container.addClass("select2-dropdown-open").addClass("select2-container-active");
            this.clearDropdownAlignmentPreference();
            if (this.dropdown[0] !== this.body.children().last()[0]) {
              this.dropdown.detach().appendTo(this.body);
            }
            mask = $12("#select2-drop-mask");
            if (mask.length == 0) {
              mask = $12(document.createElement("div"));
              mask.attr("id", "select2-drop-mask").attr("class", "select2-drop-mask");
              mask.hide();
              mask.appendTo(this.body);
              mask.on("mousedown touchstart click", function(e) {
                reinsertElement(mask);
                var dropdown = $12("#select2-drop"), self;
                if (dropdown.length > 0) {
                  self = dropdown.data("select2");
                  if (self.opts.selectOnBlur) {
                    self.selectHighlighted({ noFocus: true });
                  }
                  self.close();
                  e.preventDefault();
                  e.stopPropagation();
                }
              });
            }
            if (this.dropdown.prev()[0] !== mask[0]) {
              this.dropdown.before(mask);
            }
            $12("#select2-drop").removeAttr("id");
            this.dropdown.attr("id", "select2-drop");
            mask.show();
            this.positionDropdown();
            this.dropdown.show();
            this.positionDropdown();
            this.dropdown.addClass("select2-drop-active");
            var that = this;
            this.container.parents().add(window).each(function() {
              $12(this).on(resize + " " + scroll + " " + orient, function(e) {
                if (that.opened())
                  that.positionDropdown();
              });
            });
          },
          close: function() {
            if (!this.opened())
              return;
            var cid = this.containerEventName, scroll = "scroll." + cid, resize = "resize." + cid, orient = "orientationchange." + cid;
            this.container.parents().add(window).each(function() {
              $12(this).off(scroll).off(resize).off(orient);
            });
            this.clearDropdownAlignmentPreference();
            $12("#select2-drop-mask").hide();
            this.dropdown.removeAttr("id");
            this.dropdown.hide();
            this.container.removeClass("select2-dropdown-open").removeClass("select2-container-active");
            this.results.empty();
            $document.off("mousemove.select2Event");
            this.clearSearch();
            this.search.removeClass("select2-active");
            this.opts.element.trigger($12.Event("select2-close"));
          },
          externalSearch: function(term) {
            this.open();
            this.search.val(term);
            this.updateResults(false);
          },
          clearSearch: function() {
          },
          getMaximumSelectionSize: function() {
            return evaluate(this.opts.maximumSelectionSize, this.opts.element);
          },
          ensureHighlightVisible: function() {
            var results = this.results, children2, index, child, hb, rb, y2, more, topOffset;
            index = this.highlight();
            if (index < 0)
              return;
            if (index == 0) {
              results.scrollTop(0);
              return;
            }
            children2 = this.findHighlightableChoices().find(".select2-result-label");
            child = $12(children2[index]);
            topOffset = (child.offset() || {}).top || 0;
            hb = topOffset + child.outerHeight(true);
            if (index === children2.length - 1) {
              more = results.find("li.select2-more-results");
              if (more.length > 0) {
                hb = more.offset().top + more.outerHeight(true);
              }
            }
            rb = results.offset().top + results.outerHeight(true);
            if (hb > rb) {
              results.scrollTop(results.scrollTop() + (hb - rb));
            }
            y2 = topOffset - results.offset().top;
            if (y2 < 0 && child.css("display") != "none") {
              results.scrollTop(results.scrollTop() + y2);
            }
          },
          findHighlightableChoices: function() {
            return this.results.find(".select2-result-selectable:not(.select2-disabled):not(.select2-selected)");
          },
          moveHighlight: function(delta) {
            var choices = this.findHighlightableChoices(), index = this.highlight();
            while (index > -1 && index < choices.length) {
              index += delta;
              var choice = $12(choices[index]);
              if (choice.hasClass("select2-result-selectable") && !choice.hasClass("select2-disabled") && !choice.hasClass("select2-selected")) {
                this.highlight(index);
                break;
              }
            }
          },
          highlight: function(index) {
            var choices = this.findHighlightableChoices(), choice, data;
            if (arguments.length === 0) {
              return indexOf(choices.filter(".select2-highlighted")[0], choices.get());
            }
            if (index >= choices.length)
              index = choices.length - 1;
            if (index < 0)
              index = 0;
            this.removeHighlight();
            choice = $12(choices[index]);
            choice.addClass("select2-highlighted");
            this.search.attr("aria-activedescendant", choice.find(".select2-result-label").attr("id"));
            this.ensureHighlightVisible();
            this.liveRegion.text(choice.text());
            data = choice.data("select2-data");
            if (data) {
              this.opts.element.trigger({ type: "select2-highlight", val: this.id(data), choice: data });
            }
          },
          removeHighlight: function() {
            this.results.find(".select2-highlighted").removeClass("select2-highlighted");
          },
          touchMoved: function() {
            this._touchMoved = true;
          },
          clearTouchMoved: function() {
            this._touchMoved = false;
          },
          countSelectableResults: function() {
            return this.findHighlightableChoices().length;
          },
          highlightUnderEvent: function(event) {
            var el = $12(event.target).closest(".select2-result-selectable");
            if (el.length > 0 && !el.is(".select2-highlighted")) {
              var choices = this.findHighlightableChoices();
              this.highlight(choices.index(el));
            } else if (el.length == 0) {
              this.removeHighlight();
            }
          },
          loadMoreIfNeeded: function() {
            var results = this.results, more = results.find("li.select2-more-results"), below, page = this.resultsPage + 1, self = this, term = this.search.val(), context2 = this.context;
            if (more.length === 0)
              return;
            below = more.offset().top - results.offset().top - results.height();
            if (below <= this.opts.loadMorePadding) {
              more.addClass("select2-active");
              this.opts.query({
                element: this.opts.element,
                term,
                page,
                context: context2,
                matcher: this.opts.matcher,
                callback: this.bind(function(data) {
                  if (!self.opened())
                    return;
                  self.opts.populateResults.call(this, results, data.results, { term, page, context: context2 });
                  self.postprocessResults(data, false, false);
                  if (data.more === true) {
                    more.detach().appendTo(results).text(evaluate(self.opts.formatLoadMore, self.opts.element, page + 1));
                    window.setTimeout(function() {
                      self.loadMoreIfNeeded();
                    }, 10);
                  } else {
                    more.remove();
                  }
                  self.positionDropdown();
                  self.resultsPage = page;
                  self.context = data.context;
                  this.opts.element.trigger({ type: "select2-loaded", items: data });
                })
              });
            }
          },
          tokenize: function() {
          },
          updateResults: function(initial) {
            var search = this.search, results = this.results, opts = this.opts, data, self = this, input, term = search.val(), lastTerm = $12.data(this.container, "select2-last-term"), queryNumber;
            if (initial !== true && lastTerm && equal(term, lastTerm))
              return;
            $12.data(this.container, "select2-last-term", term);
            if (initial !== true && (this.showSearchInput === false || !this.opened())) {
              return;
            }
            function postRender() {
              search.removeClass("select2-active");
              self.positionDropdown();
              if (results.find(".select2-no-results,.select2-selection-limit,.select2-searching").length) {
                self.liveRegion.text(results.text());
              } else {
                self.liveRegion.text(self.opts.formatMatches(results.find(".select2-result-selectable").length));
              }
            }
            function render(html) {
              results.html(html);
              postRender();
            }
            queryNumber = ++this.queryCount;
            var maxSelSize = this.getMaximumSelectionSize();
            if (maxSelSize >= 1) {
              data = this.data();
              if (Array.isArray(data) && data.length >= maxSelSize && checkFormatter(opts.formatSelectionTooBig, "formatSelectionTooBig")) {
                render("<li class='select2-selection-limit'>" + evaluate(opts.formatSelectionTooBig, opts.element, maxSelSize) + "</li>");
                return;
              }
            }
            if (search.val().length < opts.minimumInputLength) {
              if (checkFormatter(opts.formatInputTooShort, "formatInputTooShort")) {
                render("<li class='select2-no-results'>" + evaluate(opts.formatInputTooShort, opts.element, search.val(), opts.minimumInputLength) + "</li>");
              } else {
                render("");
              }
              if (initial && this.showSearch)
                this.showSearch(true);
              return;
            }
            if (opts.maximumInputLength && search.val().length > opts.maximumInputLength) {
              if (checkFormatter(opts.formatInputTooLong, "formatInputTooLong")) {
                render("<li class='select2-no-results'>" + evaluate(opts.formatInputTooLong, opts.element, search.val(), opts.maximumInputLength) + "</li>");
              } else {
                render("");
              }
              return;
            }
            if (opts.formatSearching && this.findHighlightableChoices().length === 0) {
              render("<li class='select2-searching'>" + evaluate(opts.formatSearching, opts.element) + "</li>");
            }
            search.addClass("select2-active");
            this.removeHighlight();
            input = this.tokenize();
            if (input != undefined2 && input != null) {
              search.val(input);
            }
            this.resultsPage = 1;
            opts.query({
              element: opts.element,
              term: search.val(),
              page: this.resultsPage,
              context: null,
              matcher: opts.matcher,
              callback: this.bind(function(data2) {
                var def;
                if (queryNumber != this.queryCount) {
                  return;
                }
                if (!this.opened()) {
                  this.search.removeClass("select2-active");
                  return;
                }
                if (data2.hasError !== undefined2 && checkFormatter(opts.formatAjaxError, "formatAjaxError")) {
                  render("<li class='select2-ajax-error'>" + evaluate(opts.formatAjaxError, opts.element, data2.jqXHR, data2.textStatus, data2.errorThrown) + "</li>");
                  return;
                }
                this.context = data2.context === undefined2 ? null : data2.context;
                if (this.opts.createSearchChoice && search.val() !== "") {
                  def = this.opts.createSearchChoice.call(self, search.val(), data2.results);
                  if (def !== undefined2 && def !== null && self.id(def) !== undefined2 && self.id(def) !== null) {
                    if ($12(data2.results).filter(
                      function() {
                        return equal(self.id(this), self.id(def));
                      }
                    ).length === 0) {
                      this.opts.createSearchChoicePosition(data2.results, def);
                    }
                  }
                }
                if (data2.results.length === 0 && checkFormatter(opts.formatNoMatches, "formatNoMatches")) {
                  render("<li class='select2-no-results'>" + evaluate(opts.formatNoMatches, opts.element, search.val()) + "</li>");
                  return;
                }
                results.empty();
                self.opts.populateResults.call(this, results, data2.results, { term: search.val(), page: this.resultsPage, context: null });
                if (data2.more === true && checkFormatter(opts.formatLoadMore, "formatLoadMore")) {
                  results.append("<li class='select2-more-results'>" + opts.escapeMarkup(evaluate(opts.formatLoadMore, opts.element, this.resultsPage)) + "</li>");
                  window.setTimeout(function() {
                    self.loadMoreIfNeeded();
                  }, 10);
                }
                this.postprocessResults(data2, initial);
                postRender();
                this.opts.element.trigger({ type: "select2-loaded", items: data2 });
              })
            });
          },
          cancel: function() {
            this.close();
          },
          blur: function() {
            if (this.opts.selectOnBlur)
              this.selectHighlighted({ noFocus: true });
            this.close();
            this.container.removeClass("select2-container-active");
            if (this.search[0] === document.activeElement) {
              this.search.blur();
            }
            this.clearSearch();
            this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
          },
          focusSearch: function() {
            focus(this.search);
          },
          selectHighlighted: function(options) {
            if (this._touchMoved) {
              this.clearTouchMoved();
              return;
            }
            var index = this.highlight(), highlighted = this.results.find(".select2-highlighted"), data = highlighted.closest(".select2-result").data("select2-data");
            if (data) {
              this.highlight(index);
              this.onSelect(data, options);
            } else if (options && options.noFocus) {
              this.close();
            }
          },
          getPlaceholder: function() {
            var placeholderOption;
            return this.opts.element.attr("placeholder") || this.opts.element.attr("data-placeholder") || this.opts.element.data("placeholder") || this.opts.placeholder || ((placeholderOption = this.getPlaceholderOption()) !== undefined2 ? placeholderOption.text() : undefined2);
          },
          getPlaceholderOption: function() {
            if (this.select) {
              var firstOption = this.select.children("option").first();
              if (this.opts.placeholderOption !== undefined2) {
                return this.opts.placeholderOption === "first" && firstOption || typeof this.opts.placeholderOption === "function" && this.opts.placeholderOption(this.select);
              } else if (firstOption.text().trim() === "" && firstOption.val() === "") {
                return firstOption;
              }
            }
          },
          initContainerWidth: function() {
            function resolveContainerWidth() {
              var style2, attrs, matches2, i2, l, attr;
              if (this.opts.width === "off") {
                return null;
              } else if (this.opts.width === "element") {
                return this.opts.element.outerWidth(false) === 0 ? "auto" : this.opts.element.outerWidth(false) + "px";
              } else if (this.opts.width === "copy" || this.opts.width === "resolve") {
                style2 = this.opts.element.attr("style");
                if (style2 !== undefined2) {
                  attrs = style2.split(";");
                  for (i2 = 0, l = attrs.length; i2 < l; i2 = i2 + 1) {
                    attr = attrs[i2].replace(/\s/g, "");
                    matches2 = attr.match(/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i);
                    if (matches2 !== null && matches2.length >= 1)
                      return matches2[1];
                  }
                }
                if (this.opts.width === "resolve") {
                  style2 = this.opts.element.css("width");
                  if (style2.indexOf("%") > 0)
                    return style2;
                  return this.opts.element.outerWidth(false) === 0 ? "auto" : this.opts.element.outerWidth(false) + "px";
                }
                return null;
              } else if (isFunction(this.opts.width)) {
                return this.opts.width();
              } else {
                return this.opts.width;
              }
            }
            ;
            var width = resolveContainerWidth.call(this);
            if (width !== null) {
              this.container.css("width", width);
            }
          }
        });
        SingleSelect2 = clazz(AbstractSelect2, {
          createContainer: function() {
            var container = $12(document.createElement("div")).attr({
              "class": "select2-container"
            }).html([
              "<a href='javascript:void(0)' class='select2-choice' tabindex='-1'>",
              "   <span class='select2-chosen'>&#160;</span><abbr class='select2-search-choice-close'></abbr>",
              "   <span class='select2-arrow' role='presentation'><b role='presentation'></b></span>",
              "</a>",
              "<label for='' class='select2-offscreen'></label>",
              "<input class='select2-focusser select2-offscreen' type='text' aria-haspopup='true' role='button' />",
              "<div class='select2-drop select2-display-none'>",
              "   <div class='select2-search'>",
              "       <label for='' class='select2-offscreen'></label>",
              "       <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input' role='combobox' aria-expanded='true'",
              "       aria-autocomplete='list' />",
              "   </div>",
              "   <ul class='select2-results' role='listbox'>",
              "   </ul>",
              "</div>"
            ].join(""));
            return container;
          },
          enableInterface: function() {
            if (this.parent.enableInterface.apply(this, arguments)) {
              this.focusser.prop("disabled", !this.isInterfaceEnabled());
            }
          },
          opening: function() {
            var el, range3, len;
            if (this.opts.minimumResultsForSearch >= 0) {
              this.showSearch(true);
            }
            this.parent.opening.apply(this, arguments);
            if (this.showSearchInput !== false) {
              this.search.val(this.focusser.val());
            }
            if (this.opts.shouldFocusInput(this)) {
              this.search.trigger("focus");
              el = this.search.get(0);
              if (el.createTextRange) {
                range3 = el.createTextRange();
                range3.collapse(false);
                range3.select();
              } else if (el.setSelectionRange) {
                len = this.search.val().length;
                el.setSelectionRange(len, len);
              }
            }
            if (this.search.val() === "") {
              if (this.nextSearchTerm != undefined2) {
                this.search.val(this.nextSearchTerm);
                this.search.select();
              }
            }
            this.focusser.prop("disabled", true).val("");
            this.updateResults(true);
            this.opts.element.trigger($12.Event("select2-open"));
          },
          close: function() {
            if (!this.opened())
              return;
            this.parent.close.apply(this, arguments);
            this.focusser.prop("disabled", false);
            if (this.opts.shouldFocusInput(this)) {
              this.focusser.trigger("focus");
            }
          },
          focus: function() {
            if (this.opened()) {
              this.close();
            } else {
              this.focusser.prop("disabled", false);
              if (this.opts.shouldFocusInput(this)) {
                this.focusser.trigger("focus");
              }
            }
          },
          isFocused: function() {
            return this.container.hasClass("select2-container-active");
          },
          cancel: function() {
            this.parent.cancel.apply(this, arguments);
            this.focusser.prop("disabled", false);
            if (this.opts.shouldFocusInput(this)) {
              this.focusser.trigger("focus");
            }
          },
          destroy: function() {
            $12("label[for='" + this.focusser.attr("id") + "']").attr("for", this.opts.element.attr("id"));
            this.parent.destroy.apply(this, arguments);
            cleanupJQueryElements.call(
              this,
              "selection",
              "focusser"
            );
          },
          initContainer: function() {
            var selection2, container = this.container, dropdown = this.dropdown, idSuffix = nextUid(), elementLabel;
            if (this.opts.minimumResultsForSearch < 0) {
              this.showSearch(false);
            } else {
              this.showSearch(true);
            }
            this.selection = selection2 = container.find(".select2-choice");
            this.focusser = container.find(".select2-focusser");
            selection2.find(".select2-chosen").attr("id", "select2-chosen-" + idSuffix);
            this.focusser.attr("aria-labelledby", "select2-chosen-" + idSuffix);
            this.results.attr("id", "select2-results-" + idSuffix);
            this.search.attr("aria-owns", "select2-results-" + idSuffix);
            this.focusser.attr("id", "s2id_autogen" + idSuffix);
            elementLabel = $12("label[for='" + this.opts.element.attr("id") + "']");
            this.focusser.prev().text(elementLabel.text()).attr("for", this.focusser.attr("id"));
            var originalTitle = this.opts.element.attr("title");
            this.opts.element.attr("title", originalTitle || elementLabel.text());
            this.focusser.attr("tabindex", this.elementTabIndex);
            this.search.attr("id", this.focusser.attr("id") + "_search");
            this.search.prev().text($12("label[for='" + this.focusser.attr("id") + "']").text()).attr("for", this.search.attr("id"));
            this.search.on("keydown", this.bind(function(e) {
              if (!this.isInterfaceEnabled())
                return;
              if (229 == e.keyCode)
                return;
              if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                killEvent(e);
                return;
              }
              switch (e.which) {
                case KEY.UP:
                case KEY.DOWN:
                  this.moveHighlight(e.which === KEY.UP ? -1 : 1);
                  killEvent(e);
                  return;
                case KEY.ENTER:
                  this.selectHighlighted();
                  killEvent(e);
                  return;
                case KEY.TAB:
                  this.selectHighlighted({ noFocus: true });
                  return;
                case KEY.ESC:
                  this.cancel(e);
                  killEvent(e);
                  return;
              }
            }));
            this.search.on("blur", this.bind(function(e) {
              if (document.activeElement === this.body.get(0)) {
                window.setTimeout(this.bind(function() {
                  if (this.opened()) {
                    this.search.trigger("focus");
                  }
                }), 0);
              }
            }));
            this.focusser.on("keydown", this.bind(function(e) {
              if (!this.isInterfaceEnabled())
                return;
              if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) {
                return;
              }
              if (this.opts.openOnEnter === false && e.which === KEY.ENTER) {
                killEvent(e);
                return;
              }
              if (e.which == KEY.DOWN || e.which == KEY.UP || e.which == KEY.ENTER && this.opts.openOnEnter) {
                if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey)
                  return;
                this.open();
                killEvent(e);
                return;
              }
              if (e.which == KEY.DELETE || e.which == KEY.BACKSPACE) {
                if (this.opts.allowClear) {
                  this.clear();
                }
                killEvent(e);
                return;
              }
            }));
            installKeyUpChangeEvent(this.focusser);
            this.focusser.on("keyup-change input", this.bind(function(e) {
              if (this.opts.minimumResultsForSearch >= 0) {
                e.stopPropagation();
                if (this.opened())
                  return;
                this.open();
              }
            }));
            selection2.on("mousedown touchstart", "abbr", this.bind(function(e) {
              if (!this.isInterfaceEnabled())
                return;
              this.clear();
              killEventImmediately(e);
              this.close();
              this.selection.trigger("focus");
            }));
            selection2.on("mousedown touchstart", this.bind(function(e) {
              reinsertElement(selection2);
              if (!this.container.hasClass("select2-container-active")) {
                this.opts.element.trigger($12.Event("select2-focus"));
              }
              if (this.opened()) {
                this.close();
              } else if (this.isInterfaceEnabled()) {
                this.open();
              }
              killEvent(e);
            }));
            dropdown.on("mousedown touchstart", this.bind(function() {
              if (this.opts.shouldFocusInput(this)) {
                this.search.trigger("focus");
              }
            }));
            selection2.on("focus", this.bind(function(e) {
              killEvent(e);
            }));
            this.focusser.on("focus", this.bind(function() {
              if (!this.container.hasClass("select2-container-active")) {
                this.opts.element.trigger($12.Event("select2-focus"));
              }
              this.container.addClass("select2-container-active");
            })).on("blur", this.bind(function() {
              if (!this.opened()) {
                this.container.removeClass("select2-container-active");
                this.opts.element.trigger($12.Event("select2-blur"));
              }
            }));
            this.search.on("focus", this.bind(function() {
              if (!this.container.hasClass("select2-container-active")) {
                this.opts.element.trigger($12.Event("select2-focus"));
              }
              this.container.addClass("select2-container-active");
            }));
            this.initContainerWidth();
            this.opts.element.addClass("select2-offscreen");
            this.setPlaceholder();
          },
          clear: function(triggerChange) {
            var data = this.selection.data("select2-data");
            if (data) {
              var evt = $12.Event("select2-clearing");
              this.opts.element.trigger(evt);
              if (evt.isDefaultPrevented()) {
                return;
              }
              var placeholderOption = this.getPlaceholderOption();
              this.opts.element.val(placeholderOption ? placeholderOption.val() : "");
              this.selection.find(".select2-chosen").empty();
              this.selection.removeData("select2-data");
              this.setPlaceholder();
              if (triggerChange !== false) {
                this.opts.element.trigger({ type: "select2-removed", val: this.id(data), choice: data });
                this.triggerChange({ removed: data });
              }
            }
          },
          initSelection: function() {
            var selected;
            if (this.isPlaceholderOptionSelected()) {
              this.updateSelection(null);
              this.close();
              this.setPlaceholder();
            } else {
              var self = this;
              this.opts.initSelection.call(null, this.opts.element, function(selected2) {
                if (selected2 !== undefined2 && selected2 !== null) {
                  self.updateSelection(selected2);
                  self.close();
                  self.setPlaceholder();
                  self.nextSearchTerm = self.opts.nextSearchTerm(selected2, self.search.val());
                }
              });
            }
          },
          isPlaceholderOptionSelected: function() {
            var placeholderOption;
            if (this.getPlaceholder() === undefined2)
              return false;
            return (placeholderOption = this.getPlaceholderOption()) !== undefined2 && placeholderOption.prop("selected") || this.opts.element.val() === "" || this.opts.element.val() === undefined2 || this.opts.element.val() === null;
          },
          prepareOpts: function() {
            var opts = this.parent.prepareOpts.apply(this, arguments), self = this;
            if (opts.element.get(0).tagName.toLowerCase() === "select") {
              opts.initSelection = function(element, callback) {
                var selected = element.find("option").filter(function() {
                  return this.selected && !this.disabled;
                });
                callback(self.optionToData(selected));
              };
            } else if ("data" in opts) {
              opts.initSelection = opts.initSelection || function(element, callback) {
                var id2 = element.val();
                var match = null;
                opts.query({
                  matcher: function(term, text, el) {
                    var is_match = equal(id2, opts.id(el));
                    if (is_match) {
                      match = el;
                    }
                    return is_match;
                  },
                  callback: !isFunction(callback) ? $12.noop : function() {
                    callback(match);
                  }
                });
              };
            }
            return opts;
          },
          getPlaceholder: function() {
            if (this.select) {
              if (this.getPlaceholderOption() === undefined2) {
                return undefined2;
              }
            }
            return this.parent.getPlaceholder.apply(this, arguments);
          },
          setPlaceholder: function() {
            var placeholder = this.getPlaceholder();
            if (this.isPlaceholderOptionSelected() && placeholder !== undefined2) {
              if (this.select && this.getPlaceholderOption() === undefined2)
                return;
              this.selection.find(".select2-chosen").html(this.opts.escapeMarkup(placeholder));
              this.selection.addClass("select2-default");
              this.container.removeClass("select2-allowclear");
            }
          },
          postprocessResults: function(data, initial, noHighlightUpdate) {
            var selected = 0, self = this, showSearchInput = true;
            this.findHighlightableChoices().each2(function(i2, elm) {
              if (equal(self.id(elm.data("select2-data")), self.opts.element.val())) {
                selected = i2;
                return false;
              }
            });
            if (noHighlightUpdate !== false) {
              if (initial === true && selected >= 0) {
                this.highlight(selected);
              } else {
                this.highlight(0);
              }
            }
            if (initial === true) {
              var min4 = this.opts.minimumResultsForSearch;
              if (min4 >= 0) {
                this.showSearch(countResults(data.results) >= min4);
              }
            }
          },
          showSearch: function(showSearchInput) {
            if (this.showSearchInput === showSearchInput)
              return;
            this.showSearchInput = showSearchInput;
            this.dropdown.find(".select2-search").toggleClass("select2-search-hidden", !showSearchInput);
            this.dropdown.find(".select2-search").toggleClass("select2-offscreen", !showSearchInput);
            $12(this.dropdown, this.container).toggleClass("select2-with-searchbox", showSearchInput);
          },
          onSelect: function(data, options) {
            if (!this.triggerSelect(data)) {
              return;
            }
            var old = this.opts.element.val(), oldData = this.data();
            this.opts.element.val(this.id(data));
            this.updateSelection(data);
            this.opts.element.trigger({ type: "select2-selected", val: this.id(data), choice: data });
            this.nextSearchTerm = this.opts.nextSearchTerm(data, this.search.val());
            this.close();
            if ((!options || !options.noFocus) && this.opts.shouldFocusInput(this)) {
              this.focusser.trigger("focus");
            }
            if (!equal(old, this.id(data))) {
              this.triggerChange({ added: data, removed: oldData });
            }
          },
          updateSelection: function(data) {
            var container = this.selection.find(".select2-chosen"), formatted, cssClass;
            this.selection.data("select2-data", data);
            container.empty();
            if (data !== null) {
              formatted = this.opts.formatSelection(data, container, this.opts.escapeMarkup);
            }
            if (formatted !== undefined2) {
              container.append(formatted);
            }
            cssClass = this.opts.formatSelectionCssClass(data, container);
            if (cssClass !== undefined2) {
              container.addClass(cssClass);
            }
            this.selection.removeClass("select2-default");
            if (this.opts.allowClear && this.getPlaceholder() !== undefined2) {
              this.container.addClass("select2-allowclear");
            }
          },
          val: function() {
            var val, triggerChange = false, data = null, self = this, oldData = this.data();
            if (arguments.length === 0) {
              return this.opts.element.val();
            }
            val = arguments[0];
            if (arguments.length > 1) {
              triggerChange = arguments[1];
            }
            if (this.select) {
              this.select.val(val).find("option").filter(function() {
                return this.selected;
              }).each2(function(i2, elm) {
                data = self.optionToData(elm);
                return false;
              });
              this.updateSelection(data);
              this.setPlaceholder();
              if (triggerChange) {
                this.triggerChange({ added: data, removed: oldData });
              }
            } else {
              if (!val && val !== 0) {
                this.clear(triggerChange);
                return;
              }
              if (this.opts.initSelection === undefined2) {
                throw new Error("cannot call val() if initSelection() is not defined");
              }
              this.opts.element.val(val);
              this.opts.initSelection(this.opts.element, function(data2) {
                self.opts.element.val(!data2 ? "" : self.id(data2));
                self.updateSelection(data2);
                self.setPlaceholder();
                if (triggerChange) {
                  self.triggerChange({ added: data2, removed: oldData });
                }
              });
            }
          },
          clearSearch: function() {
            this.search.val("");
            this.focusser.val("");
          },
          data: function(value) {
            var data, triggerChange = false;
            if (arguments.length === 0) {
              data = this.selection.data("select2-data");
              if (data == undefined2)
                data = null;
              return data;
            } else {
              if (arguments.length > 1) {
                triggerChange = arguments[1];
              }
              if (!value) {
                this.clear(triggerChange);
              } else {
                data = this.data();
                this.opts.element.val(!value ? "" : this.id(value));
                this.updateSelection(value);
                if (triggerChange) {
                  this.triggerChange({ added: value, removed: data });
                }
              }
            }
          }
        });
        MultiSelect2 = clazz(AbstractSelect2, {
          createContainer: function() {
            var container = $12(document.createElement("div")).attr({
              "class": "select2-container select2-container-multi"
            }).html([
              "<ul class='select2-choices'>",
              "  <li class='select2-search-field'>",
              "    <label for='' class='select2-offscreen'></label>",
              "    <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input'>",
              "  </li>",
              "</ul>",
              "<div class='select2-drop select2-drop-multi select2-display-none'>",
              "   <ul class='select2-results'>",
              "   </ul>",
              "</div>"
            ].join(""));
            return container;
          },
          prepareOpts: function() {
            var opts = this.parent.prepareOpts.apply(this, arguments), self = this;
            if (opts.element.get(0).tagName.toLowerCase() === "select") {
              opts.initSelection = function(element, callback) {
                var data = [];
                element.find("option").filter(function() {
                  return this.selected && !this.disabled;
                }).each2(function(i2, elm) {
                  data.push(self.optionToData(elm));
                });
                callback(data);
              };
            } else if ("data" in opts) {
              opts.initSelection = opts.initSelection || function(element, callback) {
                var ids = splitVal(element.val(), opts.separator);
                var matches2 = [];
                opts.query({
                  matcher: function(term, text, el) {
                    var is_match = $12.grep(ids, function(id2) {
                      return equal(id2, opts.id(el));
                    }).length;
                    if (is_match) {
                      matches2.push(el);
                    }
                    return is_match;
                  },
                  callback: !isFunction(callback) ? $12.noop : function() {
                    var ordered = [];
                    for (var i2 = 0; i2 < ids.length; i2++) {
                      var id2 = ids[i2];
                      for (var j2 = 0; j2 < matches2.length; j2++) {
                        var match = matches2[j2];
                        if (equal(id2, opts.id(match))) {
                          ordered.push(match);
                          matches2.splice(j2, 1);
                          break;
                        }
                      }
                    }
                    callback(ordered);
                  }
                });
              };
            }
            return opts;
          },
          selectChoice: function(choice) {
            var selected = this.container.find(".select2-search-choice-focus");
            if (selected.length && choice && choice[0] == selected[0]) {
            } else {
              if (selected.length) {
                this.opts.element.trigger("choice-deselected", selected);
              }
              selected.removeClass("select2-search-choice-focus");
              if (choice && choice.length) {
                this.close();
                choice.addClass("select2-search-choice-focus");
                this.opts.element.trigger("choice-selected", choice);
              }
            }
          },
          destroy: function() {
            $12("label[for='" + this.search.attr("id") + "']").attr("for", this.opts.element.attr("id"));
            this.parent.destroy.apply(this, arguments);
            cleanupJQueryElements.call(
              this,
              "searchContainer",
              "selection"
            );
          },
          initContainer: function() {
            var selector = ".select2-choices", selection2;
            this.searchContainer = this.container.find(".select2-search-field");
            this.selection = selection2 = this.container.find(selector);
            var _this = this;
            this.selection.on("click", ".select2-search-choice:not(.select2-locked)", function(e) {
              _this.search[0].trigger("focus");
              _this.selectChoice($12(this));
            });
            this.search.attr("id", "s2id_autogen" + nextUid());
            this.search.prev().text($12("label[for='" + this.opts.element.attr("id") + "']").text()).attr("for", this.search.attr("id"));
            this.search.on("input paste", this.bind(function() {
              if (this.search.attr("placeholder") && this.search.val().length == 0)
                return;
              if (!this.isInterfaceEnabled())
                return;
              if (!this.opened()) {
                this.open();
              }
            }));
            this.search.attr("tabindex", this.elementTabIndex);
            this.keydowns = 0;
            this.search.on("keydown", this.bind(function(e) {
              if (!this.isInterfaceEnabled())
                return;
              ++this.keydowns;
              var selected = selection2.find(".select2-search-choice-focus");
              var prev = selected.prev(".select2-search-choice:not(.select2-locked)");
              var next = selected.next(".select2-search-choice:not(.select2-locked)");
              var pos = getCursorInfo(this.search);
              if (selected.length && (e.which == KEY.LEFT || e.which == KEY.RIGHT || e.which == KEY.BACKSPACE || e.which == KEY.DELETE || e.which == KEY.ENTER)) {
                var selectedChoice = selected;
                if (e.which == KEY.LEFT && prev.length) {
                  selectedChoice = prev;
                } else if (e.which == KEY.RIGHT) {
                  selectedChoice = next.length ? next : null;
                } else if (e.which === KEY.BACKSPACE) {
                  if (this.unselect(selected.first())) {
                    this.search.width(10);
                    selectedChoice = prev.length ? prev : next;
                  }
                } else if (e.which == KEY.DELETE) {
                  if (this.unselect(selected.first())) {
                    this.search.width(10);
                    selectedChoice = next.length ? next : null;
                  }
                } else if (e.which == KEY.ENTER) {
                  selectedChoice = null;
                }
                this.selectChoice(selectedChoice);
                killEvent(e);
                if (!selectedChoice || !selectedChoice.length) {
                  this.open();
                }
                return;
              } else if ((e.which === KEY.BACKSPACE && this.keydowns == 1 || e.which == KEY.LEFT) && (pos.offset == 0 && !pos.length)) {
                this.selectChoice(selection2.find(".select2-search-choice:not(.select2-locked)").last());
                killEvent(e);
                return;
              } else {
                this.selectChoice(null);
              }
              if (this.opened()) {
                switch (e.which) {
                  case KEY.UP:
                  case KEY.DOWN:
                    this.moveHighlight(e.which === KEY.UP ? -1 : 1);
                    killEvent(e);
                    return;
                  case KEY.ENTER:
                    this.selectHighlighted();
                    killEvent(e);
                    return;
                  case KEY.TAB:
                    this.selectHighlighted({ noFocus: true });
                    this.close();
                    return;
                  case KEY.ESC:
                    this.cancel(e);
                    killEvent(e);
                    return;
                }
              }
              if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.BACKSPACE || e.which === KEY.ESC) {
                return;
              }
              if (e.which === KEY.ENTER) {
                if (this.opts.openOnEnter === false) {
                  return;
                } else if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) {
                  return;
                }
              }
              this.open();
              if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                killEvent(e);
              }
              if (e.which === KEY.ENTER) {
                killEvent(e);
              }
            }));
            this.search.on(
              "keyup",
              this.bind(function(e) {
                this.keydowns = 0;
                this.resizeSearch();
              })
            );
            this.search.on("blur", this.bind(function(e) {
              this.container.removeClass("select2-container-active");
              this.search.removeClass("select2-focused");
              this.selectChoice(null);
              if (!this.opened())
                this.clearSearch();
              e.stopImmediatePropagation();
              this.opts.element.trigger($12.Event("select2-blur"));
            }));
            this.container.on("click", selector, this.bind(function(e) {
              if (!this.isInterfaceEnabled())
                return;
              if ($12(e.target).closest(".select2-search-choice").length > 0) {
                return;
              }
              this.selectChoice(null);
              this.clearPlaceholder();
              if (!this.container.hasClass("select2-container-active")) {
                this.opts.element.trigger($12.Event("select2-focus"));
              }
              this.open();
              this.focusSearch();
              e.preventDefault();
            }));
            this.container.on("focus", selector, this.bind(function() {
              if (!this.isInterfaceEnabled())
                return;
              if (!this.container.hasClass("select2-container-active")) {
                this.opts.element.trigger($12.Event("select2-focus"));
              }
              this.container.addClass("select2-container-active");
              this.dropdown.addClass("select2-drop-active");
              this.clearPlaceholder();
            }));
            this.initContainerWidth();
            this.opts.element.addClass("select2-offscreen");
            this.clearSearch();
          },
          enableInterface: function() {
            if (this.parent.enableInterface.apply(this, arguments)) {
              this.search.prop("disabled", !this.isInterfaceEnabled());
            }
          },
          initSelection: function() {
            var data;
            if (this.opts.element.val() === "" && this.opts.element.text() === "") {
              this.updateSelection([]);
              this.close();
              this.clearSearch();
            }
            if (this.select || this.opts.element.val() !== "") {
              var self = this;
              this.opts.initSelection.call(null, this.opts.element, function(data2) {
                if (data2 !== undefined2 && data2 !== null) {
                  self.updateSelection(data2);
                  self.close();
                  self.clearSearch();
                }
              });
            }
          },
          clearSearch: function() {
            var placeholder = this.getPlaceholder(), maxWidth = this.getMaxSearchWidth();
            if (placeholder !== undefined2 && this.getVal().length === 0 && this.search.hasClass("select2-focused") === false) {
              this.search.val(placeholder).addClass("select2-default");
              this.search.width(maxWidth > 0 ? maxWidth : this.container.css("width"));
            } else {
              this.search.val("").width(10);
            }
          },
          clearPlaceholder: function() {
            if (this.search.hasClass("select2-default")) {
              this.search.val("").removeClass("select2-default");
            }
          },
          opening: function() {
            this.clearPlaceholder();
            this.resizeSearch();
            this.parent.opening.apply(this, arguments);
            this.focusSearch();
            if (this.search.val() === "") {
              if (this.nextSearchTerm != undefined2) {
                this.search.val(this.nextSearchTerm);
                this.search.select();
              }
            }
            this.updateResults(true);
            if (this.opts.shouldFocusInput(this)) {
              this.search.trigger("focus");
            }
            this.opts.element.trigger($12.Event("select2-open"));
          },
          close: function() {
            if (!this.opened())
              return;
            this.parent.close.apply(this, arguments);
          },
          focus: function() {
            this.close();
            this.search.trigger("focus");
          },
          isFocused: function() {
            return this.search.hasClass("select2-focused");
          },
          updateSelection: function(data) {
            var ids = [], filtered = [], self = this;
            $12(data).each(function() {
              if (indexOf(self.id(this), ids) < 0) {
                ids.push(self.id(this));
                filtered.push(this);
              }
            });
            data = filtered;
            this.selection.find(".select2-search-choice").remove();
            $12(data).each(function() {
              self.addSelectedChoice(this);
            });
            self.postprocessResults();
          },
          tokenize: function() {
            var input = this.search.val();
            input = this.opts.tokenizer.call(this, input, this.data(), this.bind(this.onSelect), this.opts);
            if (input != null && input != undefined2) {
              this.search.val(input);
              if (input.length > 0) {
                this.open();
              }
            }
          },
          onSelect: function(data, options) {
            if (!this.triggerSelect(data) || data.text === "") {
              return;
            }
            this.addSelectedChoice(data);
            this.opts.element.trigger({ type: "selected", val: this.id(data), choice: data });
            this.nextSearchTerm = this.opts.nextSearchTerm(data, this.search.val());
            this.clearSearch();
            this.updateResults();
            if (this.select || !this.opts.closeOnSelect)
              this.postprocessResults(data, false, this.opts.closeOnSelect === true);
            if (this.opts.closeOnSelect) {
              this.close();
              this.search.width(10);
            } else {
              if (this.countSelectableResults() > 0) {
                this.search.width(10);
                this.resizeSearch();
                if (this.getMaximumSelectionSize() > 0 && this.val().length >= this.getMaximumSelectionSize()) {
                  this.updateResults(true);
                } else {
                  if (this.nextSearchTerm != undefined2) {
                    this.search.val(this.nextSearchTerm);
                    this.updateResults();
                    this.search.select();
                  }
                }
                this.positionDropdown();
              } else {
                this.close();
                this.search.width(10);
              }
            }
            this.triggerChange({ added: data });
            if (!options || !options.noFocus)
              this.focusSearch();
          },
          cancel: function() {
            this.close();
            this.focusSearch();
          },
          addSelectedChoice: function(data) {
            var enableChoice = !data.locked, enabledItem = $12(
              "<li class='select2-search-choice'>    <div></div>    <a href='#' class='select2-search-choice-close' tabindex='-1'></a></li>"
            ), disabledItem = $12(
              "<li class='select2-search-choice select2-locked'><div></div></li>"
            );
            var choice = enableChoice ? enabledItem : disabledItem, id2 = this.id(data), val = this.getVal(), formatted, cssClass;
            formatted = this.opts.formatSelection(data, choice.find("div"), this.opts.escapeMarkup);
            if (formatted != undefined2) {
              choice.find("div").replaceWith("<div>" + formatted + "</div>");
            }
            cssClass = this.opts.formatSelectionCssClass(data, choice.find("div"));
            if (cssClass != undefined2) {
              choice.addClass(cssClass);
            }
            if (enableChoice) {
              choice.find(".select2-search-choice-close").on("mousedown", killEvent).on("click dblclick", this.bind(function(e) {
                if (!this.isInterfaceEnabled())
                  return;
                this.unselect($12(e.target));
                this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
                killEvent(e);
                this.close();
                this.focusSearch();
              })).on("focus", this.bind(function() {
                if (!this.isInterfaceEnabled())
                  return;
                this.container.addClass("select2-container-active");
                this.dropdown.addClass("select2-drop-active");
              }));
            }
            choice.data("select2-data", data);
            choice.insertBefore(this.searchContainer);
            val.push(id2);
            this.setVal(val);
          },
          unselect: function(selected) {
            var val = this.getVal(), data, index;
            selected = selected.closest(".select2-search-choice");
            if (selected.length === 0) {
              throw "Invalid argument: " + selected + ". Must be .select2-search-choice";
            }
            data = selected.data("select2-data");
            if (!data) {
              return;
            }
            var evt = $12.Event("select2-removing");
            evt.val = this.id(data);
            evt.choice = data;
            this.opts.element.trigger(evt);
            if (evt.isDefaultPrevented()) {
              return false;
            }
            while ((index = indexOf(this.id(data), val)) >= 0) {
              val.splice(index, 1);
              this.setVal(val);
              if (this.select)
                this.postprocessResults();
            }
            selected.remove();
            this.opts.element.trigger({ type: "select2-removed", val: this.id(data), choice: data });
            this.triggerChange({ removed: data });
            return true;
          },
          postprocessResults: function(data, initial, noHighlightUpdate) {
            var val = this.getVal(), choices = this.results.find(".select2-result"), compound = this.results.find(".select2-result-with-children"), self = this;
            choices.each2(function(i2, choice) {
              var id2 = self.id(choice.data("select2-data"));
              if (indexOf(id2, val) >= 0) {
                choice.addClass("select2-selected");
                choice.find(".select2-result-selectable").addClass("select2-selected");
              }
            });
            compound.each2(function(i2, choice) {
              if (!choice.is(".select2-result-selectable") && choice.find(".select2-result-selectable:not(.select2-selected)").length === 0) {
                choice.addClass("select2-selected");
              }
            });
            if (this.highlight() == -1 && noHighlightUpdate !== false) {
              self.highlight(0);
            }
            if (!this.opts.createSearchChoice && !choices.filter(".select2-result:not(.select2-selected)").length > 0) {
              if (!data || data && !data.more && this.results.find(".select2-no-results").length === 0) {
                if (checkFormatter(self.opts.formatNoMatches, "formatNoMatches")) {
                  this.results.append("<li class='select2-no-results'>" + evaluate(self.opts.formatNoMatches, self.opts.element, self.search.val()) + "</li>");
                }
              }
            }
          },
          getMaxSearchWidth: function() {
            return this.selection.width() - getSideBorderPadding(this.search);
          },
          resizeSearch: function() {
            var minimumWidth, left2, maxWidth, containerLeft, searchWidth, sideBorderPadding = getSideBorderPadding(this.search);
            minimumWidth = measureTextWidth(this.search) + 10;
            left2 = this.search.offset().left;
            maxWidth = this.selection.width();
            containerLeft = this.selection.offset().left;
            searchWidth = maxWidth - (left2 - containerLeft) - sideBorderPadding;
            if (searchWidth < minimumWidth) {
              searchWidth = maxWidth - sideBorderPadding;
            }
            if (searchWidth < 40) {
              searchWidth = maxWidth - sideBorderPadding;
            }
            if (searchWidth <= 0) {
              searchWidth = minimumWidth;
            }
            this.search.width(Math.floor(searchWidth));
          },
          getVal: function() {
            var val;
            if (this.select) {
              val = this.select.val();
              return val === null ? [] : val;
            } else {
              val = this.opts.element.val();
              return splitVal(val, this.opts.separator);
            }
          },
          setVal: function(val) {
            var unique;
            if (this.select) {
              this.select.val(val);
            } else {
              unique = [];
              $12(val).each(function() {
                if (indexOf(this, unique) < 0)
                  unique.push(this);
              });
              this.opts.element.val(unique.length === 0 ? "" : unique.join(this.opts.separator));
            }
          },
          buildChangeDetails: function(old, current) {
            var current = current.slice(0), old = old.slice(0);
            for (var i2 = 0; i2 < current.length; i2++) {
              for (var j2 = 0; j2 < old.length; j2++) {
                if (equal(this.opts.id(current[i2]), this.opts.id(old[j2]))) {
                  current.splice(i2, 1);
                  if (i2 > 0) {
                    i2--;
                  }
                  old.splice(j2, 1);
                  j2--;
                }
              }
            }
            return { added: current, removed: old };
          },
          val: function(val, triggerChange) {
            var oldData, self = this;
            if (arguments.length === 0) {
              return this.getVal();
            }
            oldData = this.data();
            if (!oldData.length)
              oldData = [];
            if (!val && val !== 0) {
              this.opts.element.val("");
              this.updateSelection([]);
              this.clearSearch();
              if (triggerChange) {
                this.triggerChange({ added: this.data(), removed: oldData });
              }
              return;
            }
            this.setVal(val);
            if (this.select) {
              this.opts.initSelection(this.select, this.bind(this.updateSelection));
              if (triggerChange) {
                this.triggerChange(this.buildChangeDetails(oldData, this.data()));
              }
            } else {
              if (this.opts.initSelection === undefined2) {
                throw new Error("val() cannot be called if initSelection() is not defined");
              }
              this.opts.initSelection(this.opts.element, function(data) {
                var ids = $12.map(data, self.id);
                self.setVal(ids);
                self.updateSelection(data);
                self.clearSearch();
                if (triggerChange) {
                  self.triggerChange(self.buildChangeDetails(oldData, self.data()));
                }
              });
            }
            this.clearSearch();
          },
          onSortStart: function() {
            if (this.select) {
              throw new Error("Sorting of elements is not supported when attached to <select>. Attach to <input type='hidden'/> instead.");
            }
            this.search.width(0);
            this.searchContainer.hide();
          },
          onSortEnd: function() {
            var val = [], self = this;
            this.searchContainer.show();
            this.searchContainer.appendTo(this.searchContainer.parent());
            this.resizeSearch();
            this.selection.find(".select2-search-choice").each(function() {
              val.push(self.opts.id($12(this).data("select2-data")));
            });
            this.setVal(val);
            this.triggerChange();
          },
          data: function(values, triggerChange) {
            var self = this, ids, old;
            if (arguments.length === 0) {
              return this.selection.children(".select2-search-choice").map(function() {
                return $12(this).data("select2-data");
              }).get();
            } else {
              old = this.data();
              if (!values) {
                values = [];
              }
              ids = $12.map(values, function(e) {
                return self.opts.id(e);
              });
              this.setVal(ids);
              this.updateSelection(values);
              this.clearSearch();
              if (triggerChange) {
                this.triggerChange(this.buildChangeDetails(old, this.data()));
              }
            }
          }
        });
        $12.fn.select2 = function() {
          var args = Array.prototype.slice.call(arguments, 0), opts, select2, method, value, multiple, allowedMethods = ["val", "destroy", "opened", "open", "close", "focus", "isFocused", "container", "dropdown", "onSortStart", "onSortEnd", "enable", "disable", "readonly", "positionDropdown", "data", "search"], valueMethods = ["opened", "isFocused", "container", "dropdown"], propertyMethods = ["val", "data"], methodsMap = { search: "externalSearch" };
          this.each(function() {
            if (args.length === 0 || typeof args[0] === "object") {
              opts = args.length === 0 ? {} : $12.extend({}, args[0]);
              opts.element = $12(this);
              if (opts.element.get(0).tagName.toLowerCase() === "select") {
                multiple = opts.element.prop("multiple");
              } else {
                multiple = opts.multiple || false;
                if ("tags" in opts) {
                  opts.multiple = multiple = true;
                }
              }
              select2 = multiple ? new window.Select2["class"].multi() : new window.Select2["class"].single();
              select2.init(opts);
            } else if (typeof args[0] === "string") {
              if (indexOf(args[0], allowedMethods) < 0) {
                throw "Unknown method: " + args[0];
              }
              value = undefined2;
              select2 = $12(this).data("select2");
              if (select2 === undefined2)
                return;
              method = args[0];
              if (method === "container") {
                value = select2.container;
              } else if (method === "dropdown") {
                value = select2.dropdown;
              } else {
                if (methodsMap[method])
                  method = methodsMap[method];
                value = select2[method].apply(select2, args.slice(1));
              }
              if (indexOf(args[0], valueMethods) >= 0 || indexOf(args[0], propertyMethods) >= 0 && args.length == 1) {
                return false;
              }
            } else {
              throw "Invalid arguments to select2 plugin: " + args;
            }
          });
          return value === undefined2 ? this : value;
        };
        $12.fn.select2.defaults = {
          width: "copy",
          loadMorePadding: 0,
          closeOnSelect: true,
          openOnEnter: true,
          containerCss: {},
          dropdownCss: {},
          containerCssClass: "",
          dropdownCssClass: "",
          formatResult: function(result, container, query, escapeMarkup) {
            var markup = [];
            markMatch(result.text, query.term, markup, escapeMarkup);
            return markup.join("");
          },
          formatSelection: function(data, container, escapeMarkup) {
            return data ? escapeMarkup(data.text) : undefined2;
          },
          sortResults: function(results, container, query) {
            return results;
          },
          formatResultCssClass: function(data) {
            return data.css;
          },
          formatSelectionCssClass: function(data, container) {
            return undefined2;
          },
          minimumResultsForSearch: 0,
          minimumInputLength: 0,
          maximumInputLength: null,
          maximumSelectionSize: 0,
          id: function(e) {
            return e == undefined2 ? null : e.id;
          },
          matcher: function(term, text) {
            return stripDiacritics("" + text).toUpperCase().indexOf(stripDiacritics("" + term).toUpperCase()) >= 0;
          },
          separator: ",",
          tokenSeparators: [],
          tokenizer: defaultTokenizer,
          escapeMarkup: defaultEscapeMarkup,
          blurOnChange: false,
          selectOnBlur: false,
          adaptContainerCssClass: function(c) {
            return c;
          },
          adaptDropdownCssClass: function(c) {
            return null;
          },
          nextSearchTerm: function(selectedObject, currentSearchTerm) {
            return undefined2;
          },
          searchInputPlaceholder: "",
          createSearchChoicePosition: "top",
          shouldFocusInput: function(instance) {
            var supportsTouchEvents = "ontouchstart" in window || navigator.msMaxTouchPoints > 0;
            if (!supportsTouchEvents) {
              return true;
            }
            if (instance.opts.minimumResultsForSearch < 0) {
              return false;
            }
            return true;
          }
        };
        $12.fn.select2.locales = [];
        $12.fn.select2.locales["en"] = {
          formatMatches: function(matches2) {
            if (matches2 === 1) {
              return "One result is available, press enter to select it.";
            }
            return matches2 + " results are available, use up and down arrow keys to navigate.";
          },
          formatNoMatches: function() {
            return "No matches found";
          },
          formatAjaxError: function(jqXHR, textStatus, errorThrown) {
            return "Loading failed";
          },
          formatInputTooShort: function(input, min4) {
            var n = min4 - input.length;
            return "Please enter " + n + " or more character" + (n == 1 ? "" : "s");
          },
          formatInputTooLong: function(input, max5) {
            var n = input.length - max5;
            return "Please delete " + n + " character" + (n == 1 ? "" : "s");
          },
          formatSelectionTooBig: function(limit) {
            return "You can only select " + limit + " item" + (limit == 1 ? "" : "s");
          },
          formatLoadMore: function(pageNumber) {
            return "Loading more results\u2026";
          },
          formatSearching: function() {
            return "Searching\u2026";
          }
        };
        $12.extend($12.fn.select2.defaults, $12.fn.select2.locales["en"]);
        $12.fn.select2.ajaxDefaults = {
          transport: $12.ajax,
          params: {
            type: "GET",
            cache: false,
            dataType: "json"
          }
        };
        window.Select2 = {
          query: {
            ajax,
            local,
            tags
          },
          util: {
            debounce,
            markMatch,
            escapeMarkup: defaultEscapeMarkup,
            stripDiacritics
          },
          "class": {
            "abstract": AbstractSelect2,
            "single": SingleSelect2,
            "multi": MultiSelect2
          }
        };
      })(jQuery);
    }
  });

  // vendor/logjam/app/assets/javascripts/logjam-filter.js
  function install_logjam_lines_filter() {
    var ALIAS_DATA_LOGJAM_TAGS = "data-logjam-tags", ATTRIBUTE_SELECTOR_LOGJAM_TAGS = "[data-logjam-tags]", CLASSNAME_LOGJAM_TAGS_FILTER_ROOT = "logjam-tags-filter-root", CLASSNAME_SELECTOR_LOGJAM_TAGS_FILTER_ROOT = ".logjam-tags-filter-root", regXWhiteSpaceSequence = /\s+/;
    function createTagNameListFromItems(itemList) {
      var tagNameTable = {};
      return itemList.reduce(function(collector, listItem) {
        return collector.concat(
          $(listItem).attr(ALIAS_DATA_LOGJAM_TAGS).split(regXWhiteSpaceSequence)
        );
      }, []).reduce(function(collector, tagName) {
        if (tagNameTable[tagName] !== tagName && tagName != "") {
          collector.push(tagNameTable[tagName] = tagName);
        }
        return collector;
      }, []);
    }
    ;
    function createTagNameFilterFragment() {
      return $([
        '<span class="' + CLASSNAME_LOGJAM_TAGS_FILTER_ROOT + '">',
        '  <select size="1">',
        "  </select>",
        "</span>"
      ].join(""))[0];
    }
    ;
    function getTagNameFilterFragment($itemsRoot) {
      return $itemsRoot.find(CLASSNAME_SELECTOR_LOGJAM_TAGS_FILTER_ROOT)[0] || createTagNameFilterFragment();
    }
    ;
    function removeAllFilterFragments($itemsRoot) {
      $itemsRoot.find(CLASSNAME_SELECTOR_LOGJAM_TAGS_FILTER_ROOT).remove();
    }
    ;
    function addTagNameToAllListItems(listItems, tagName) {
      listItems.forEach(function(item) {
        var $item = $(item), tagNameList = $item.attr(ALIAS_DATA_LOGJAM_TAGS).split(regXWhiteSpaceSequence);
        if (tagNameList.indexOf(tagName) < 0) {
          tagNameList.push(tagName);
          $item.attr(ALIAS_DATA_LOGJAM_TAGS, tagNameList.join(" "));
        }
      });
    }
    ;
    function applyTagNameFilter(evt) {
      var filterSelector = evt.target, tagName = filterSelector.options[filterSelector.options.selectedIndex].value, $itemsRoot = $(filterSelector).closest("#request-lines"), itemsRoot = $itemsRoot[0], itemsList = $itemsRoot.find(".logline").toArray(), filteredItems = itemsList.reduce(function(collector, item) {
        if ($(item).attr(ALIAS_DATA_LOGJAM_TAGS).split(regXWhiteSpaceSequence).indexOf(tagName) >= 0) {
          collector.matching.push(item);
        } else {
          collector.unmatching.push(item);
        }
        return collector;
      }, { matching: [], unmatching: [] });
      filteredItems.matching.forEach(function(item) {
        item.style.display = "";
      });
      filteredItems.unmatching.forEach(function(item) {
        item.style.display = "none";
      });
    }
    ;
    function initializeTagNameFilters($itemsRoot, tagNameList) {
      var filterFragment = getTagNameFilterFragment($itemsRoot), filterSelector = filterFragment && filterFragment.getElementsByTagName("select")[0];
      removeAllFilterFragments($itemsRoot);
      addTagNameToAllListItems($itemsRoot.find(".logline").toArray(), "all");
      if (filterSelector) {
        filterSelector.options.length = 0;
        filterSelector.options[0] = new Option("show all", "all");
        tagNameList.forEach(function(tagName, idx) {
          filterSelector.options[idx + 1] = new Option(tagName, tagName);
        });
        $(filterSelector).bind("change", applyTagNameFilter);
        $itemsRoot.find("legend").append(filterFragment);
      }
    }
    ;
    function initialize() {
      var $itemsRoot = $("#single-request #request-lines"), itemsRoot = $itemsRoot[0], sortableItemList = $itemsRoot.find(ATTRIBUTE_SELECTOR_LOGJAM_TAGS).toArray() || [], tagNameList = createTagNameListFromItems(sortableItemList);
      if (tagNameList.length) {
        initializeTagNameFilters($itemsRoot, tagNameList);
      }
    }
    ;
    initialize();
  }
  var init_logjam_filter = __esm({
    "vendor/logjam/app/assets/javascripts/logjam-filter.js"() {
      window.install_logjam_lines_filter = install_logjam_lines_filter;
    }
  });

  // node_modules/urijs/src/punycode.js
  var require_punycode = __commonJS({
    "node_modules/urijs/src/punycode.js"(exports2, module2) {
      (function(root2) {
        var freeExports = typeof exports2 == "object" && exports2 && !exports2.nodeType && exports2;
        var freeModule = typeof module2 == "object" && module2 && !module2.nodeType && module2;
        var freeGlobal = typeof global == "object" && global;
        if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
          root2 = freeGlobal;
        }
        var punycode, maxInt = 2147483647, base = 36, tMin = 1, tMax = 26, skew = 38, damp = 700, initialBias = 72, initialN = 128, delimiter = "-", regexPunycode = /^xn--/, regexNonASCII = /[^\x20-\x7E]/, regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, errors = {
          "overflow": "Overflow: input needs wider integers to process",
          "not-basic": "Illegal input >= 0x80 (not a basic code point)",
          "invalid-input": "Invalid input"
        }, baseMinusTMin = base - tMin, floor = Math.floor, stringFromCharCode = String.fromCharCode, key;
        function error(type2) {
          throw new RangeError(errors[type2]);
        }
        function map2(array2, fn) {
          var length = array2.length;
          var result = [];
          while (length--) {
            result[length] = fn(array2[length]);
          }
          return result;
        }
        function mapDomain(string2, fn) {
          var parts = string2.split("@");
          var result = "";
          if (parts.length > 1) {
            result = parts[0] + "@";
            string2 = parts[1];
          }
          string2 = string2.replace(regexSeparators, ".");
          var labels = string2.split(".");
          var encoded = map2(labels, fn).join(".");
          return result + encoded;
        }
        function ucs2decode(string2) {
          var output = [], counter = 0, length = string2.length, value, extra;
          while (counter < length) {
            value = string2.charCodeAt(counter++);
            if (value >= 55296 && value <= 56319 && counter < length) {
              extra = string2.charCodeAt(counter++);
              if ((extra & 64512) == 56320) {
                output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
              } else {
                output.push(value);
                counter--;
              }
            } else {
              output.push(value);
            }
          }
          return output;
        }
        function ucs2encode(array2) {
          return map2(array2, function(value) {
            var output = "";
            if (value > 65535) {
              value -= 65536;
              output += stringFromCharCode(value >>> 10 & 1023 | 55296);
              value = 56320 | value & 1023;
            }
            output += stringFromCharCode(value);
            return output;
          }).join("");
        }
        function basicToDigit(codePoint) {
          if (codePoint - 48 < 10) {
            return codePoint - 22;
          }
          if (codePoint - 65 < 26) {
            return codePoint - 65;
          }
          if (codePoint - 97 < 26) {
            return codePoint - 97;
          }
          return base;
        }
        function digitToBasic(digit, flag) {
          return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
        }
        function adapt(delta, numPoints, firstTime) {
          var k = 0;
          delta = firstTime ? floor(delta / damp) : delta >> 1;
          delta += floor(delta / numPoints);
          for (; delta > baseMinusTMin * tMax >> 1; k += base) {
            delta = floor(delta / baseMinusTMin);
          }
          return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
        }
        function decode(input) {
          var output = [], inputLength = input.length, out, i2 = 0, n = initialN, bias = initialBias, basic, j2, index, oldi, w, k, digit, t, baseMinusT;
          basic = input.lastIndexOf(delimiter);
          if (basic < 0) {
            basic = 0;
          }
          for (j2 = 0; j2 < basic; ++j2) {
            if (input.charCodeAt(j2) >= 128) {
              error("not-basic");
            }
            output.push(input.charCodeAt(j2));
          }
          for (index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
            for (oldi = i2, w = 1, k = base; ; k += base) {
              if (index >= inputLength) {
                error("invalid-input");
              }
              digit = basicToDigit(input.charCodeAt(index++));
              if (digit >= base || digit > floor((maxInt - i2) / w)) {
                error("overflow");
              }
              i2 += digit * w;
              t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
              if (digit < t) {
                break;
              }
              baseMinusT = base - t;
              if (w > floor(maxInt / baseMinusT)) {
                error("overflow");
              }
              w *= baseMinusT;
            }
            out = output.length + 1;
            bias = adapt(i2 - oldi, out, oldi == 0);
            if (floor(i2 / out) > maxInt - n) {
              error("overflow");
            }
            n += floor(i2 / out);
            i2 %= out;
            output.splice(i2++, 0, n);
          }
          return ucs2encode(output);
        }
        function encode(input) {
          var n, delta, handledCPCount, basicLength, bias, j2, m, q, k, t, currentValue, output = [], inputLength, handledCPCountPlusOne, baseMinusT, qMinusT;
          input = ucs2decode(input);
          inputLength = input.length;
          n = initialN;
          delta = 0;
          bias = initialBias;
          for (j2 = 0; j2 < inputLength; ++j2) {
            currentValue = input[j2];
            if (currentValue < 128) {
              output.push(stringFromCharCode(currentValue));
            }
          }
          handledCPCount = basicLength = output.length;
          if (basicLength) {
            output.push(delimiter);
          }
          while (handledCPCount < inputLength) {
            for (m = maxInt, j2 = 0; j2 < inputLength; ++j2) {
              currentValue = input[j2];
              if (currentValue >= n && currentValue < m) {
                m = currentValue;
              }
            }
            handledCPCountPlusOne = handledCPCount + 1;
            if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
              error("overflow");
            }
            delta += (m - n) * handledCPCountPlusOne;
            n = m;
            for (j2 = 0; j2 < inputLength; ++j2) {
              currentValue = input[j2];
              if (currentValue < n && ++delta > maxInt) {
                error("overflow");
              }
              if (currentValue == n) {
                for (q = delta, k = base; ; k += base) {
                  t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
                  if (q < t) {
                    break;
                  }
                  qMinusT = q - t;
                  baseMinusT = base - t;
                  output.push(
                    stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
                  );
                  q = floor(qMinusT / baseMinusT);
                }
                output.push(stringFromCharCode(digitToBasic(q, 0)));
                bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
                delta = 0;
                ++handledCPCount;
              }
            }
            ++delta;
            ++n;
          }
          return output.join("");
        }
        function toUnicode(input) {
          return mapDomain(input, function(string2) {
            return regexPunycode.test(string2) ? decode(string2.slice(4).toLowerCase()) : string2;
          });
        }
        function toASCII(input) {
          return mapDomain(input, function(string2) {
            return regexNonASCII.test(string2) ? "xn--" + encode(string2) : string2;
          });
        }
        punycode = {
          "version": "1.3.2",
          "ucs2": {
            "decode": ucs2decode,
            "encode": ucs2encode
          },
          "decode": decode,
          "encode": encode,
          "toASCII": toASCII,
          "toUnicode": toUnicode
        };
        if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
          define("punycode", function() {
            return punycode;
          });
        } else if (freeExports && freeModule) {
          if (module2.exports == freeExports) {
            freeModule.exports = punycode;
          } else {
            for (key in punycode) {
              punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
            }
          }
        } else {
          root2.punycode = punycode;
        }
      })(exports2);
    }
  });

  // node_modules/urijs/src/IPv6.js
  var require_IPv6 = __commonJS({
    "node_modules/urijs/src/IPv6.js"(exports2, module2) {
      (function(root2, factory) {
        "use strict";
        if (typeof module2 === "object" && module2.exports) {
          module2.exports = factory();
        } else if (typeof define === "function" && define.amd) {
          define(factory);
        } else {
          root2.IPv6 = factory(root2);
        }
      })(exports2, function(root2) {
        "use strict";
        var _IPv6 = root2 && root2.IPv6;
        function bestPresentation(address) {
          var _address = address.toLowerCase();
          var segments = _address.split(":");
          var length = segments.length;
          var total = 8;
          if (segments[0] === "" && segments[1] === "" && segments[2] === "") {
            segments.shift();
            segments.shift();
          } else if (segments[0] === "" && segments[1] === "") {
            segments.shift();
          } else if (segments[length - 1] === "" && segments[length - 2] === "") {
            segments.pop();
          }
          length = segments.length;
          if (segments[length - 1].indexOf(".") !== -1) {
            total = 7;
          }
          var pos;
          for (pos = 0; pos < length; pos++) {
            if (segments[pos] === "") {
              break;
            }
          }
          if (pos < total) {
            segments.splice(pos, 1, "0000");
            while (segments.length < total) {
              segments.splice(pos, 0, "0000");
            }
          }
          var _segments;
          for (var i2 = 0; i2 < total; i2++) {
            _segments = segments[i2].split("");
            for (var j2 = 0; j2 < 3; j2++) {
              if (_segments[0] === "0" && _segments.length > 1) {
                _segments.splice(0, 1);
              } else {
                break;
              }
            }
            segments[i2] = _segments.join("");
          }
          var best = -1;
          var _best = 0;
          var _current = 0;
          var current = -1;
          var inzeroes = false;
          for (i2 = 0; i2 < total; i2++) {
            if (inzeroes) {
              if (segments[i2] === "0") {
                _current += 1;
              } else {
                inzeroes = false;
                if (_current > _best) {
                  best = current;
                  _best = _current;
                }
              }
            } else {
              if (segments[i2] === "0") {
                inzeroes = true;
                current = i2;
                _current = 1;
              }
            }
          }
          if (_current > _best) {
            best = current;
            _best = _current;
          }
          if (_best > 1) {
            segments.splice(best, _best, "");
          }
          length = segments.length;
          var result = "";
          if (segments[0] === "") {
            result = ":";
          }
          for (i2 = 0; i2 < length; i2++) {
            result += segments[i2];
            if (i2 === length - 1) {
              break;
            }
            result += ":";
          }
          if (segments[length - 1] === "") {
            result += ":";
          }
          return result;
        }
        function noConflict() {
          if (root2.IPv6 === this) {
            root2.IPv6 = _IPv6;
          }
          return this;
        }
        return {
          best: bestPresentation,
          noConflict
        };
      });
    }
  });

  // node_modules/urijs/src/SecondLevelDomains.js
  var require_SecondLevelDomains = __commonJS({
    "node_modules/urijs/src/SecondLevelDomains.js"(exports2, module2) {
      (function(root2, factory) {
        "use strict";
        if (typeof module2 === "object" && module2.exports) {
          module2.exports = factory();
        } else if (typeof define === "function" && define.amd) {
          define(factory);
        } else {
          root2.SecondLevelDomains = factory(root2);
        }
      })(exports2, function(root2) {
        "use strict";
        var _SecondLevelDomains = root2 && root2.SecondLevelDomains;
        var SLD = {
          list: {
            "ac": " com gov mil net org ",
            "ae": " ac co gov mil name net org pro sch ",
            "af": " com edu gov net org ",
            "al": " com edu gov mil net org ",
            "ao": " co ed gv it og pb ",
            "ar": " com edu gob gov int mil net org tur ",
            "at": " ac co gv or ",
            "au": " asn com csiro edu gov id net org ",
            "ba": " co com edu gov mil net org rs unbi unmo unsa untz unze ",
            "bb": " biz co com edu gov info net org store tv ",
            "bh": " biz cc com edu gov info net org ",
            "bn": " com edu gov net org ",
            "bo": " com edu gob gov int mil net org tv ",
            "br": " adm adv agr am arq art ato b bio blog bmd cim cng cnt com coop ecn edu eng esp etc eti far flog fm fnd fot fst g12 ggf gov imb ind inf jor jus lel mat med mil mus net nom not ntr odo org ppg pro psc psi qsl rec slg srv tmp trd tur tv vet vlog wiki zlg ",
            "bs": " com edu gov net org ",
            "bz": " du et om ov rg ",
            "ca": " ab bc mb nb nf nl ns nt nu on pe qc sk yk ",
            "ck": " biz co edu gen gov info net org ",
            "cn": " ac ah bj com cq edu fj gd gov gs gx gz ha hb he hi hl hn jl js jx ln mil net nm nx org qh sc sd sh sn sx tj tw xj xz yn zj ",
            "co": " com edu gov mil net nom org ",
            "cr": " ac c co ed fi go or sa ",
            "cy": " ac biz com ekloges gov ltd name net org parliament press pro tm ",
            "do": " art com edu gob gov mil net org sld web ",
            "dz": " art asso com edu gov net org pol ",
            "ec": " com edu fin gov info med mil net org pro ",
            "eg": " com edu eun gov mil name net org sci ",
            "er": " com edu gov ind mil net org rochest w ",
            "es": " com edu gob nom org ",
            "et": " biz com edu gov info name net org ",
            "fj": " ac biz com info mil name net org pro ",
            "fk": " ac co gov net nom org ",
            "fr": " asso com f gouv nom prd presse tm ",
            "gg": " co net org ",
            "gh": " com edu gov mil org ",
            "gn": " ac com gov net org ",
            "gr": " com edu gov mil net org ",
            "gt": " com edu gob ind mil net org ",
            "gu": " com edu gov net org ",
            "hk": " com edu gov idv net org ",
            "hu": " 2000 agrar bolt casino city co erotica erotika film forum games hotel info ingatlan jogasz konyvelo lakas media news org priv reklam sex shop sport suli szex tm tozsde utazas video ",
            "id": " ac co go mil net or sch web ",
            "il": " ac co gov idf k12 muni net org ",
            "in": " ac co edu ernet firm gen gov i ind mil net nic org res ",
            "iq": " com edu gov i mil net org ",
            "ir": " ac co dnssec gov i id net org sch ",
            "it": " edu gov ",
            "je": " co net org ",
            "jo": " com edu gov mil name net org sch ",
            "jp": " ac ad co ed go gr lg ne or ",
            "ke": " ac co go info me mobi ne or sc ",
            "kh": " com edu gov mil net org per ",
            "ki": " biz com de edu gov info mob net org tel ",
            "km": " asso com coop edu gouv k medecin mil nom notaires pharmaciens presse tm veterinaire ",
            "kn": " edu gov net org ",
            "kr": " ac busan chungbuk chungnam co daegu daejeon es gangwon go gwangju gyeongbuk gyeonggi gyeongnam hs incheon jeju jeonbuk jeonnam k kg mil ms ne or pe re sc seoul ulsan ",
            "kw": " com edu gov net org ",
            "ky": " com edu gov net org ",
            "kz": " com edu gov mil net org ",
            "lb": " com edu gov net org ",
            "lk": " assn com edu gov grp hotel int ltd net ngo org sch soc web ",
            "lr": " com edu gov net org ",
            "lv": " asn com conf edu gov id mil net org ",
            "ly": " com edu gov id med net org plc sch ",
            "ma": " ac co gov m net org press ",
            "mc": " asso tm ",
            "me": " ac co edu gov its net org priv ",
            "mg": " com edu gov mil nom org prd tm ",
            "mk": " com edu gov inf name net org pro ",
            "ml": " com edu gov net org presse ",
            "mn": " edu gov org ",
            "mo": " com edu gov net org ",
            "mt": " com edu gov net org ",
            "mv": " aero biz com coop edu gov info int mil museum name net org pro ",
            "mw": " ac co com coop edu gov int museum net org ",
            "mx": " com edu gob net org ",
            "my": " com edu gov mil name net org sch ",
            "nf": " arts com firm info net other per rec store web ",
            "ng": " biz com edu gov mil mobi name net org sch ",
            "ni": " ac co com edu gob mil net nom org ",
            "np": " com edu gov mil net org ",
            "nr": " biz com edu gov info net org ",
            "om": " ac biz co com edu gov med mil museum net org pro sch ",
            "pe": " com edu gob mil net nom org sld ",
            "ph": " com edu gov i mil net ngo org ",
            "pk": " biz com edu fam gob gok gon gop gos gov net org web ",
            "pl": " art bialystok biz com edu gda gdansk gorzow gov info katowice krakow lodz lublin mil net ngo olsztyn org poznan pwr radom slupsk szczecin torun warszawa waw wroc wroclaw zgora ",
            "pr": " ac biz com edu est gov info isla name net org pro prof ",
            "ps": " com edu gov net org plo sec ",
            "pw": " belau co ed go ne or ",
            "ro": " arts com firm info nom nt org rec store tm www ",
            "rs": " ac co edu gov in org ",
            "sb": " com edu gov net org ",
            "sc": " com edu gov net org ",
            "sh": " co com edu gov net nom org ",
            "sl": " com edu gov net org ",
            "st": " co com consulado edu embaixada gov mil net org principe saotome store ",
            "sv": " com edu gob org red ",
            "sz": " ac co org ",
            "tr": " av bbs bel biz com dr edu gen gov info k12 name net org pol tel tsk tv web ",
            "tt": " aero biz cat co com coop edu gov info int jobs mil mobi museum name net org pro tel travel ",
            "tw": " club com ebiz edu game gov idv mil net org ",
            "mu": " ac co com gov net or org ",
            "mz": " ac co edu gov org ",
            "na": " co com ",
            "nz": " ac co cri geek gen govt health iwi maori mil net org parliament school ",
            "pa": " abo ac com edu gob ing med net nom org sld ",
            "pt": " com edu gov int net nome org publ ",
            "py": " com edu gov mil net org ",
            "qa": " com edu gov mil net org ",
            "re": " asso com nom ",
            "ru": " ac adygeya altai amur arkhangelsk astrakhan bashkiria belgorod bir bryansk buryatia cbg chel chelyabinsk chita chukotka chuvashia com dagestan e-burg edu gov grozny int irkutsk ivanovo izhevsk jar joshkar-ola kalmykia kaluga kamchatka karelia kazan kchr kemerovo khabarovsk khakassia khv kirov koenig komi kostroma kranoyarsk kuban kurgan kursk lipetsk magadan mari mari-el marine mil mordovia mosreg msk murmansk nalchik net nnov nov novosibirsk nsk omsk orenburg org oryol penza perm pp pskov ptz rnd ryazan sakhalin samara saratov simbirsk smolensk spb stavropol stv surgut tambov tatarstan tom tomsk tsaritsyn tsk tula tuva tver tyumen udm udmurtia ulan-ude vladikavkaz vladimir vladivostok volgograd vologda voronezh vrn vyatka yakutia yamal yekaterinburg yuzhno-sakhalinsk ",
            "rw": " ac co com edu gouv gov int mil net ",
            "sa": " com edu gov med net org pub sch ",
            "sd": " com edu gov info med net org tv ",
            "se": " a ac b bd c d e f g h i k l m n o org p parti pp press r s t tm u w x y z ",
            "sg": " com edu gov idn net org per ",
            "sn": " art com edu gouv org perso univ ",
            "sy": " com edu gov mil net news org ",
            "th": " ac co go in mi net or ",
            "tj": " ac biz co com edu go gov info int mil name net nic org test web ",
            "tn": " agrinet com defense edunet ens fin gov ind info intl mincom nat net org perso rnrt rns rnu tourism ",
            "tz": " ac co go ne or ",
            "ua": " biz cherkassy chernigov chernovtsy ck cn co com crimea cv dn dnepropetrovsk donetsk dp edu gov if in ivano-frankivsk kh kharkov kherson khmelnitskiy kiev kirovograd km kr ks kv lg lugansk lutsk lviv me mk net nikolaev od odessa org pl poltava pp rovno rv sebastopol sumy te ternopil uzhgorod vinnica vn zaporizhzhe zhitomir zp zt ",
            "ug": " ac co go ne or org sc ",
            "uk": " ac bl british-library co cym gov govt icnet jet lea ltd me mil mod national-library-scotland nel net nhs nic nls org orgn parliament plc police sch scot soc ",
            "us": " dni fed isa kids nsn ",
            "uy": " com edu gub mil net org ",
            "ve": " co com edu gob info mil net org web ",
            "vi": " co com k12 net org ",
            "vn": " ac biz com edu gov health info int name net org pro ",
            "ye": " co com gov ltd me net org plc ",
            "yu": " ac co edu gov org ",
            "za": " ac agric alt bourse city co cybernet db edu gov grondar iaccess imt inca landesign law mil net ngo nis nom olivetti org pix school tm web ",
            "zm": " ac co com edu gov net org sch ",
            "com": "ar br cn de eu gb gr hu jpn kr no qc ru sa se uk us uy za ",
            "net": "gb jp se uk ",
            "org": "ae",
            "de": "com "
          },
          has: function(domain) {
            var tldOffset = domain.lastIndexOf(".");
            if (tldOffset <= 0 || tldOffset >= domain.length - 1) {
              return false;
            }
            var sldOffset = domain.lastIndexOf(".", tldOffset - 1);
            if (sldOffset <= 0 || sldOffset >= tldOffset - 1) {
              return false;
            }
            var sldList = SLD.list[domain.slice(tldOffset + 1)];
            if (!sldList) {
              return false;
            }
            return sldList.indexOf(" " + domain.slice(sldOffset + 1, tldOffset) + " ") >= 0;
          },
          is: function(domain) {
            var tldOffset = domain.lastIndexOf(".");
            if (tldOffset <= 0 || tldOffset >= domain.length - 1) {
              return false;
            }
            var sldOffset = domain.lastIndexOf(".", tldOffset - 1);
            if (sldOffset >= 0) {
              return false;
            }
            var sldList = SLD.list[domain.slice(tldOffset + 1)];
            if (!sldList) {
              return false;
            }
            return sldList.indexOf(" " + domain.slice(0, tldOffset) + " ") >= 0;
          },
          get: function(domain) {
            var tldOffset = domain.lastIndexOf(".");
            if (tldOffset <= 0 || tldOffset >= domain.length - 1) {
              return null;
            }
            var sldOffset = domain.lastIndexOf(".", tldOffset - 1);
            if (sldOffset <= 0 || sldOffset >= tldOffset - 1) {
              return null;
            }
            var sldList = SLD.list[domain.slice(tldOffset + 1)];
            if (!sldList) {
              return null;
            }
            if (sldList.indexOf(" " + domain.slice(sldOffset + 1, tldOffset) + " ") < 0) {
              return null;
            }
            return domain.slice(sldOffset + 1);
          },
          noConflict: function() {
            if (root2.SecondLevelDomains === this) {
              root2.SecondLevelDomains = _SecondLevelDomains;
            }
            return this;
          }
        };
        return SLD;
      });
    }
  });

  // node_modules/urijs/src/URI.js
  var require_URI = __commonJS({
    "node_modules/urijs/src/URI.js"(exports2, module2) {
      (function(root2, factory) {
        "use strict";
        if (typeof module2 === "object" && module2.exports) {
          module2.exports = factory(require_punycode(), require_IPv6(), require_SecondLevelDomains());
        } else if (typeof define === "function" && define.amd) {
          define(["./punycode", "./IPv6", "./SecondLevelDomains"], factory);
        } else {
          root2.URI = factory(root2.punycode, root2.IPv6, root2.SecondLevelDomains, root2);
        }
      })(exports2, function(punycode, IPv6, SLD, root2) {
        "use strict";
        var _URI = root2 && root2.URI;
        function URI3(url, base) {
          var _urlSupplied = arguments.length >= 1;
          var _baseSupplied = arguments.length >= 2;
          if (!(this instanceof URI3)) {
            if (_urlSupplied) {
              if (_baseSupplied) {
                return new URI3(url, base);
              }
              return new URI3(url);
            }
            return new URI3();
          }
          if (url === void 0) {
            if (_urlSupplied) {
              throw new TypeError("undefined is not a valid argument for URI");
            }
            if (typeof location !== "undefined") {
              url = location.href + "";
            } else {
              url = "";
            }
          }
          if (url === null) {
            if (_urlSupplied) {
              throw new TypeError("null is not a valid argument for URI");
            }
          }
          this.href(url);
          if (base !== void 0) {
            return this.absoluteTo(base);
          }
          return this;
        }
        function isInteger(value) {
          return /^[0-9]+$/.test(value);
        }
        URI3.version = "1.19.11";
        var p = URI3.prototype;
        var hasOwn = Object.prototype.hasOwnProperty;
        function escapeRegEx(string2) {
          return string2.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
        }
        function getType(value) {
          if (value === void 0) {
            return "Undefined";
          }
          return String(Object.prototype.toString.call(value)).slice(8, -1);
        }
        function isArray(obj) {
          return getType(obj) === "Array";
        }
        function filterArrayValues(data, value) {
          var lookup = {};
          var i2, length;
          if (getType(value) === "RegExp") {
            lookup = null;
          } else if (isArray(value)) {
            for (i2 = 0, length = value.length; i2 < length; i2++) {
              lookup[value[i2]] = true;
            }
          } else {
            lookup[value] = true;
          }
          for (i2 = 0, length = data.length; i2 < length; i2++) {
            var _match = lookup && lookup[data[i2]] !== void 0 || !lookup && value.test(data[i2]);
            if (_match) {
              data.splice(i2, 1);
              length--;
              i2--;
            }
          }
          return data;
        }
        function arrayContains(list, value) {
          var i2, length;
          if (isArray(value)) {
            for (i2 = 0, length = value.length; i2 < length; i2++) {
              if (!arrayContains(list, value[i2])) {
                return false;
              }
            }
            return true;
          }
          var _type = getType(value);
          for (i2 = 0, length = list.length; i2 < length; i2++) {
            if (_type === "RegExp") {
              if (typeof list[i2] === "string" && list[i2].match(value)) {
                return true;
              }
            } else if (list[i2] === value) {
              return true;
            }
          }
          return false;
        }
        function arraysEqual(one2, two) {
          if (!isArray(one2) || !isArray(two)) {
            return false;
          }
          if (one2.length !== two.length) {
            return false;
          }
          one2.sort();
          two.sort();
          for (var i2 = 0, l = one2.length; i2 < l; i2++) {
            if (one2[i2] !== two[i2]) {
              return false;
            }
          }
          return true;
        }
        function trimSlashes(text) {
          var trim_expression = /^\/+|\/+$/g;
          return text.replace(trim_expression, "");
        }
        URI3._parts = function() {
          return {
            protocol: null,
            username: null,
            password: null,
            hostname: null,
            urn: null,
            port: null,
            path: null,
            query: null,
            fragment: null,
            preventInvalidHostname: URI3.preventInvalidHostname,
            duplicateQueryParameters: URI3.duplicateQueryParameters,
            escapeQuerySpace: URI3.escapeQuerySpace
          };
        };
        URI3.preventInvalidHostname = false;
        URI3.duplicateQueryParameters = false;
        URI3.escapeQuerySpace = true;
        URI3.protocol_expression = /^[a-z][a-z0-9.+-]*$/i;
        URI3.idn_expression = /[^a-z0-9\._-]/i;
        URI3.punycode_expression = /(xn--)/i;
        URI3.ip4_expression = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
        URI3.ip6_expression = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
        URI3.find_uri_expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
        URI3.findUri = {
          start: /\b(?:([a-z][a-z0-9.+-]*:\/\/)|www\.)/gi,
          end: /[\s\r\n]|$/,
          trim: /[`!()\[\]{};:'".,<>?«»“”„‘’]+$/,
          parens: /(\([^\)]*\)|\[[^\]]*\]|\{[^}]*\}|<[^>]*>)/g
        };
        URI3.leading_whitespace_expression = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/;
        URI3.ascii_tab_whitespace = /[\u0009\u000A\u000D]+/g;
        URI3.defaultPorts = {
          http: "80",
          https: "443",
          ftp: "21",
          gopher: "70",
          ws: "80",
          wss: "443"
        };
        URI3.hostProtocols = [
          "http",
          "https"
        ];
        URI3.invalid_hostname_characters = /[^a-zA-Z0-9\.\-:_]/;
        URI3.domAttributes = {
          "a": "href",
          "blockquote": "cite",
          "link": "href",
          "base": "href",
          "script": "src",
          "form": "action",
          "img": "src",
          "area": "href",
          "iframe": "src",
          "embed": "src",
          "source": "src",
          "track": "src",
          "input": "src",
          "audio": "src",
          "video": "src"
        };
        URI3.getDomAttribute = function(node) {
          if (!node || !node.nodeName) {
            return void 0;
          }
          var nodeName = node.nodeName.toLowerCase();
          if (nodeName === "input" && node.type !== "image") {
            return void 0;
          }
          return URI3.domAttributes[nodeName];
        };
        function escapeForDumbFirefox36(value) {
          return escape(value);
        }
        function strictEncodeURIComponent(string2) {
          return encodeURIComponent(string2).replace(/[!'()*]/g, escapeForDumbFirefox36).replace(/\*/g, "%2A");
        }
        URI3.encode = strictEncodeURIComponent;
        URI3.decode = decodeURIComponent;
        URI3.iso8859 = function() {
          URI3.encode = escape;
          URI3.decode = unescape;
        };
        URI3.unicode = function() {
          URI3.encode = strictEncodeURIComponent;
          URI3.decode = decodeURIComponent;
        };
        URI3.characters = {
          pathname: {
            encode: {
              expression: /%(24|26|2B|2C|3B|3D|3A|40)/ig,
              map: {
                "%24": "$",
                "%26": "&",
                "%2B": "+",
                "%2C": ",",
                "%3B": ";",
                "%3D": "=",
                "%3A": ":",
                "%40": "@"
              }
            },
            decode: {
              expression: /[\/\?#]/g,
              map: {
                "/": "%2F",
                "?": "%3F",
                "#": "%23"
              }
            }
          },
          reserved: {
            encode: {
              expression: /%(21|23|24|26|27|28|29|2A|2B|2C|2F|3A|3B|3D|3F|40|5B|5D)/ig,
              map: {
                "%3A": ":",
                "%2F": "/",
                "%3F": "?",
                "%23": "#",
                "%5B": "[",
                "%5D": "]",
                "%40": "@",
                "%21": "!",
                "%24": "$",
                "%26": "&",
                "%27": "'",
                "%28": "(",
                "%29": ")",
                "%2A": "*",
                "%2B": "+",
                "%2C": ",",
                "%3B": ";",
                "%3D": "="
              }
            }
          },
          urnpath: {
            encode: {
              expression: /%(21|24|27|28|29|2A|2B|2C|3B|3D|40)/ig,
              map: {
                "%21": "!",
                "%24": "$",
                "%27": "'",
                "%28": "(",
                "%29": ")",
                "%2A": "*",
                "%2B": "+",
                "%2C": ",",
                "%3B": ";",
                "%3D": "=",
                "%40": "@"
              }
            },
            decode: {
              expression: /[\/\?#:]/g,
              map: {
                "/": "%2F",
                "?": "%3F",
                "#": "%23",
                ":": "%3A"
              }
            }
          }
        };
        URI3.encodeQuery = function(string2, escapeQuerySpace) {
          var escaped = URI3.encode(string2 + "");
          if (escapeQuerySpace === void 0) {
            escapeQuerySpace = URI3.escapeQuerySpace;
          }
          return escapeQuerySpace ? escaped.replace(/%20/g, "+") : escaped;
        };
        URI3.decodeQuery = function(string2, escapeQuerySpace) {
          string2 += "";
          if (escapeQuerySpace === void 0) {
            escapeQuerySpace = URI3.escapeQuerySpace;
          }
          try {
            return URI3.decode(escapeQuerySpace ? string2.replace(/\+/g, "%20") : string2);
          } catch (e) {
            return string2;
          }
        };
        var _parts = { "encode": "encode", "decode": "decode" };
        var _part;
        var generateAccessor = function(_group, _part2) {
          return function(string2) {
            try {
              return URI3[_part2](string2 + "").replace(URI3.characters[_group][_part2].expression, function(c) {
                return URI3.characters[_group][_part2].map[c];
              });
            } catch (e) {
              return string2;
            }
          };
        };
        for (_part in _parts) {
          URI3[_part + "PathSegment"] = generateAccessor("pathname", _parts[_part]);
          URI3[_part + "UrnPathSegment"] = generateAccessor("urnpath", _parts[_part]);
        }
        var generateSegmentedPathFunction = function(_sep, _codingFuncName, _innerCodingFuncName) {
          return function(string2) {
            var actualCodingFunc;
            if (!_innerCodingFuncName) {
              actualCodingFunc = URI3[_codingFuncName];
            } else {
              actualCodingFunc = function(string3) {
                return URI3[_codingFuncName](URI3[_innerCodingFuncName](string3));
              };
            }
            var segments = (string2 + "").split(_sep);
            for (var i2 = 0, length = segments.length; i2 < length; i2++) {
              segments[i2] = actualCodingFunc(segments[i2]);
            }
            return segments.join(_sep);
          };
        };
        URI3.decodePath = generateSegmentedPathFunction("/", "decodePathSegment");
        URI3.decodeUrnPath = generateSegmentedPathFunction(":", "decodeUrnPathSegment");
        URI3.recodePath = generateSegmentedPathFunction("/", "encodePathSegment", "decode");
        URI3.recodeUrnPath = generateSegmentedPathFunction(":", "encodeUrnPathSegment", "decode");
        URI3.encodeReserved = generateAccessor("reserved", "encode");
        URI3.parse = function(string2, parts) {
          var pos;
          if (!parts) {
            parts = {
              preventInvalidHostname: URI3.preventInvalidHostname
            };
          }
          string2 = string2.replace(URI3.leading_whitespace_expression, "");
          string2 = string2.replace(URI3.ascii_tab_whitespace, "");
          pos = string2.indexOf("#");
          if (pos > -1) {
            parts.fragment = string2.substring(pos + 1) || null;
            string2 = string2.substring(0, pos);
          }
          pos = string2.indexOf("?");
          if (pos > -1) {
            parts.query = string2.substring(pos + 1) || null;
            string2 = string2.substring(0, pos);
          }
          string2 = string2.replace(/^(https?|ftp|wss?)?:+[/\\]*/i, "$1://");
          string2 = string2.replace(/^[/\\]{2,}/i, "//");
          if (string2.substring(0, 2) === "//") {
            parts.protocol = null;
            string2 = string2.substring(2);
            string2 = URI3.parseAuthority(string2, parts);
          } else {
            pos = string2.indexOf(":");
            if (pos > -1) {
              parts.protocol = string2.substring(0, pos) || null;
              if (parts.protocol && !parts.protocol.match(URI3.protocol_expression)) {
                parts.protocol = void 0;
              } else if (string2.substring(pos + 1, pos + 3).replace(/\\/g, "/") === "//") {
                string2 = string2.substring(pos + 3);
                string2 = URI3.parseAuthority(string2, parts);
              } else {
                string2 = string2.substring(pos + 1);
                parts.urn = true;
              }
            }
          }
          parts.path = string2;
          return parts;
        };
        URI3.parseHost = function(string2, parts) {
          if (!string2) {
            string2 = "";
          }
          string2 = string2.replace(/\\/g, "/");
          var pos = string2.indexOf("/");
          var bracketPos;
          var t;
          if (pos === -1) {
            pos = string2.length;
          }
          if (string2.charAt(0) === "[") {
            bracketPos = string2.indexOf("]");
            parts.hostname = string2.substring(1, bracketPos) || null;
            parts.port = string2.substring(bracketPos + 2, pos) || null;
            if (parts.port === "/") {
              parts.port = null;
            }
          } else {
            var firstColon = string2.indexOf(":");
            var firstSlash = string2.indexOf("/");
            var nextColon = string2.indexOf(":", firstColon + 1);
            if (nextColon !== -1 && (firstSlash === -1 || nextColon < firstSlash)) {
              parts.hostname = string2.substring(0, pos) || null;
              parts.port = null;
            } else {
              t = string2.substring(0, pos).split(":");
              parts.hostname = t[0] || null;
              parts.port = t[1] || null;
            }
          }
          if (parts.hostname && string2.substring(pos).charAt(0) !== "/") {
            pos++;
            string2 = "/" + string2;
          }
          if (parts.preventInvalidHostname) {
            URI3.ensureValidHostname(parts.hostname, parts.protocol);
          }
          if (parts.port) {
            URI3.ensureValidPort(parts.port);
          }
          return string2.substring(pos) || "/";
        };
        URI3.parseAuthority = function(string2, parts) {
          string2 = URI3.parseUserinfo(string2, parts);
          return URI3.parseHost(string2, parts);
        };
        URI3.parseUserinfo = function(string2, parts) {
          var _string = string2;
          var firstBackSlash = string2.indexOf("\\");
          if (firstBackSlash !== -1) {
            string2 = string2.replace(/\\/g, "/");
          }
          var firstSlash = string2.indexOf("/");
          var pos = string2.lastIndexOf("@", firstSlash > -1 ? firstSlash : string2.length - 1);
          var t;
          if (pos > -1 && (firstSlash === -1 || pos < firstSlash)) {
            t = string2.substring(0, pos).split(":");
            parts.username = t[0] ? URI3.decode(t[0]) : null;
            t.shift();
            parts.password = t[0] ? URI3.decode(t.join(":")) : null;
            string2 = _string.substring(pos + 1);
          } else {
            parts.username = null;
            parts.password = null;
          }
          return string2;
        };
        URI3.parseQuery = function(string2, escapeQuerySpace) {
          if (!string2) {
            return {};
          }
          string2 = string2.replace(/&+/g, "&").replace(/^\?*&*|&+$/g, "");
          if (!string2) {
            return {};
          }
          var items = {};
          var splits = string2.split("&");
          var length = splits.length;
          var v, name, value;
          for (var i2 = 0; i2 < length; i2++) {
            v = splits[i2].split("=");
            name = URI3.decodeQuery(v.shift(), escapeQuerySpace);
            value = v.length ? URI3.decodeQuery(v.join("="), escapeQuerySpace) : null;
            if (name === "__proto__") {
              continue;
            } else if (hasOwn.call(items, name)) {
              if (typeof items[name] === "string" || items[name] === null) {
                items[name] = [items[name]];
              }
              items[name].push(value);
            } else {
              items[name] = value;
            }
          }
          return items;
        };
        URI3.build = function(parts) {
          var t = "";
          var requireAbsolutePath = false;
          if (parts.protocol) {
            t += parts.protocol + ":";
          }
          if (!parts.urn && (t || parts.hostname)) {
            t += "//";
            requireAbsolutePath = true;
          }
          t += URI3.buildAuthority(parts) || "";
          if (typeof parts.path === "string") {
            if (parts.path.charAt(0) !== "/" && requireAbsolutePath) {
              t += "/";
            }
            t += parts.path;
          }
          if (typeof parts.query === "string" && parts.query) {
            t += "?" + parts.query;
          }
          if (typeof parts.fragment === "string" && parts.fragment) {
            t += "#" + parts.fragment;
          }
          return t;
        };
        URI3.buildHost = function(parts) {
          var t = "";
          if (!parts.hostname) {
            return "";
          } else if (URI3.ip6_expression.test(parts.hostname)) {
            t += "[" + parts.hostname + "]";
          } else {
            t += parts.hostname;
          }
          if (parts.port) {
            t += ":" + parts.port;
          }
          return t;
        };
        URI3.buildAuthority = function(parts) {
          return URI3.buildUserinfo(parts) + URI3.buildHost(parts);
        };
        URI3.buildUserinfo = function(parts) {
          var t = "";
          if (parts.username) {
            t += URI3.encode(parts.username);
          }
          if (parts.password) {
            t += ":" + URI3.encode(parts.password);
          }
          if (t) {
            t += "@";
          }
          return t;
        };
        URI3.buildQuery = function(data, duplicateQueryParameters, escapeQuerySpace) {
          var t = "";
          var unique, key, i2, length;
          for (key in data) {
            if (key === "__proto__") {
              continue;
            } else if (hasOwn.call(data, key)) {
              if (isArray(data[key])) {
                unique = {};
                for (i2 = 0, length = data[key].length; i2 < length; i2++) {
                  if (data[key][i2] !== void 0 && unique[data[key][i2] + ""] === void 0) {
                    t += "&" + URI3.buildQueryParameter(key, data[key][i2], escapeQuerySpace);
                    if (duplicateQueryParameters !== true) {
                      unique[data[key][i2] + ""] = true;
                    }
                  }
                }
              } else if (data[key] !== void 0) {
                t += "&" + URI3.buildQueryParameter(key, data[key], escapeQuerySpace);
              }
            }
          }
          return t.substring(1);
        };
        URI3.buildQueryParameter = function(name, value, escapeQuerySpace) {
          return URI3.encodeQuery(name, escapeQuerySpace) + (value !== null ? "=" + URI3.encodeQuery(value, escapeQuerySpace) : "");
        };
        URI3.addQuery = function(data, name, value) {
          if (typeof name === "object") {
            for (var key in name) {
              if (hasOwn.call(name, key)) {
                URI3.addQuery(data, key, name[key]);
              }
            }
          } else if (typeof name === "string") {
            if (data[name] === void 0) {
              data[name] = value;
              return;
            } else if (typeof data[name] === "string") {
              data[name] = [data[name]];
            }
            if (!isArray(value)) {
              value = [value];
            }
            data[name] = (data[name] || []).concat(value);
          } else {
            throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");
          }
        };
        URI3.setQuery = function(data, name, value) {
          if (typeof name === "object") {
            for (var key in name) {
              if (hasOwn.call(name, key)) {
                URI3.setQuery(data, key, name[key]);
              }
            }
          } else if (typeof name === "string") {
            data[name] = value === void 0 ? null : value;
          } else {
            throw new TypeError("URI.setQuery() accepts an object, string as the name parameter");
          }
        };
        URI3.removeQuery = function(data, name, value) {
          var i2, length, key;
          if (isArray(name)) {
            for (i2 = 0, length = name.length; i2 < length; i2++) {
              data[name[i2]] = void 0;
            }
          } else if (getType(name) === "RegExp") {
            for (key in data) {
              if (name.test(key)) {
                data[key] = void 0;
              }
            }
          } else if (typeof name === "object") {
            for (key in name) {
              if (hasOwn.call(name, key)) {
                URI3.removeQuery(data, key, name[key]);
              }
            }
          } else if (typeof name === "string") {
            if (value !== void 0) {
              if (getType(value) === "RegExp") {
                if (!isArray(data[name]) && value.test(data[name])) {
                  data[name] = void 0;
                } else {
                  data[name] = filterArrayValues(data[name], value);
                }
              } else if (data[name] === String(value) && (!isArray(value) || value.length === 1)) {
                data[name] = void 0;
              } else if (isArray(data[name])) {
                data[name] = filterArrayValues(data[name], value);
              }
            } else {
              data[name] = void 0;
            }
          } else {
            throw new TypeError("URI.removeQuery() accepts an object, string, RegExp as the first parameter");
          }
        };
        URI3.hasQuery = function(data, name, value, withinArray) {
          switch (getType(name)) {
            case "String":
              break;
            case "RegExp":
              for (var key in data) {
                if (hasOwn.call(data, key)) {
                  if (name.test(key) && (value === void 0 || URI3.hasQuery(data, key, value))) {
                    return true;
                  }
                }
              }
              return false;
            case "Object":
              for (var _key in name) {
                if (hasOwn.call(name, _key)) {
                  if (!URI3.hasQuery(data, _key, name[_key])) {
                    return false;
                  }
                }
              }
              return true;
            default:
              throw new TypeError("URI.hasQuery() accepts a string, regular expression or object as the name parameter");
          }
          switch (getType(value)) {
            case "Undefined":
              return name in data;
            case "Boolean":
              var _booly = Boolean(isArray(data[name]) ? data[name].length : data[name]);
              return value === _booly;
            case "Function":
              return !!value(data[name], name, data);
            case "Array":
              if (!isArray(data[name])) {
                return false;
              }
              var op = withinArray ? arrayContains : arraysEqual;
              return op(data[name], value);
            case "RegExp":
              if (!isArray(data[name])) {
                return Boolean(data[name] && data[name].match(value));
              }
              if (!withinArray) {
                return false;
              }
              return arrayContains(data[name], value);
            case "Number":
              value = String(value);
            case "String":
              if (!isArray(data[name])) {
                return data[name] === value;
              }
              if (!withinArray) {
                return false;
              }
              return arrayContains(data[name], value);
            default:
              throw new TypeError("URI.hasQuery() accepts undefined, boolean, string, number, RegExp, Function as the value parameter");
          }
        };
        URI3.joinPaths = function() {
          var input = [];
          var segments = [];
          var nonEmptySegments = 0;
          for (var i2 = 0; i2 < arguments.length; i2++) {
            var url = new URI3(arguments[i2]);
            input.push(url);
            var _segments = url.segment();
            for (var s = 0; s < _segments.length; s++) {
              if (typeof _segments[s] === "string") {
                segments.push(_segments[s]);
              }
              if (_segments[s]) {
                nonEmptySegments++;
              }
            }
          }
          if (!segments.length || !nonEmptySegments) {
            return new URI3("");
          }
          var uri = new URI3("").segment(segments);
          if (input[0].path() === "" || input[0].path().slice(0, 1) === "/") {
            uri.path("/" + uri.path());
          }
          return uri.normalize();
        };
        URI3.commonPath = function(one2, two) {
          var length = Math.min(one2.length, two.length);
          var pos;
          for (pos = 0; pos < length; pos++) {
            if (one2.charAt(pos) !== two.charAt(pos)) {
              pos--;
              break;
            }
          }
          if (pos < 1) {
            return one2.charAt(0) === two.charAt(0) && one2.charAt(0) === "/" ? "/" : "";
          }
          if (one2.charAt(pos) !== "/" || two.charAt(pos) !== "/") {
            pos = one2.substring(0, pos).lastIndexOf("/");
          }
          return one2.substring(0, pos + 1);
        };
        URI3.withinString = function(string2, callback, options) {
          options || (options = {});
          var _start = options.start || URI3.findUri.start;
          var _end = options.end || URI3.findUri.end;
          var _trim = options.trim || URI3.findUri.trim;
          var _parens = options.parens || URI3.findUri.parens;
          var _attributeOpen = /[a-z0-9-]=["']?$/i;
          _start.lastIndex = 0;
          while (true) {
            var match = _start.exec(string2);
            if (!match) {
              break;
            }
            var start2 = match.index;
            if (options.ignoreHtml) {
              var attributeOpen = string2.slice(Math.max(start2 - 3, 0), start2);
              if (attributeOpen && _attributeOpen.test(attributeOpen)) {
                continue;
              }
            }
            var end = start2 + string2.slice(start2).search(_end);
            var slice3 = string2.slice(start2, end);
            var parensEnd = -1;
            while (true) {
              var parensMatch = _parens.exec(slice3);
              if (!parensMatch) {
                break;
              }
              var parensMatchEnd = parensMatch.index + parensMatch[0].length;
              parensEnd = Math.max(parensEnd, parensMatchEnd);
            }
            if (parensEnd > -1) {
              slice3 = slice3.slice(0, parensEnd) + slice3.slice(parensEnd).replace(_trim, "");
            } else {
              slice3 = slice3.replace(_trim, "");
            }
            if (slice3.length <= match[0].length) {
              continue;
            }
            if (options.ignore && options.ignore.test(slice3)) {
              continue;
            }
            end = start2 + slice3.length;
            var result = callback(slice3, start2, end, string2);
            if (result === void 0) {
              _start.lastIndex = end;
              continue;
            }
            result = String(result);
            string2 = string2.slice(0, start2) + result + string2.slice(end);
            _start.lastIndex = start2 + result.length;
          }
          _start.lastIndex = 0;
          return string2;
        };
        URI3.ensureValidHostname = function(v, protocol) {
          var hasHostname = !!v;
          var hasProtocol = !!protocol;
          var rejectEmptyHostname = false;
          if (hasProtocol) {
            rejectEmptyHostname = arrayContains(URI3.hostProtocols, protocol);
          }
          if (rejectEmptyHostname && !hasHostname) {
            throw new TypeError("Hostname cannot be empty, if protocol is " + protocol);
          } else if (v && v.match(URI3.invalid_hostname_characters)) {
            if (!punycode) {
              throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-:_] and Punycode.js is not available');
            }
            if (punycode.toASCII(v).match(URI3.invalid_hostname_characters)) {
              throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-:_]');
            }
          }
        };
        URI3.ensureValidPort = function(v) {
          if (!v) {
            return;
          }
          var port = Number(v);
          if (isInteger(port) && port > 0 && port < 65536) {
            return;
          }
          throw new TypeError('Port "' + v + '" is not a valid port');
        };
        URI3.noConflict = function(removeAll) {
          if (removeAll) {
            var unconflicted = {
              URI: this.noConflict()
            };
            if (root2.URITemplate && typeof root2.URITemplate.noConflict === "function") {
              unconflicted.URITemplate = root2.URITemplate.noConflict();
            }
            if (root2.IPv6 && typeof root2.IPv6.noConflict === "function") {
              unconflicted.IPv6 = root2.IPv6.noConflict();
            }
            if (root2.SecondLevelDomains && typeof root2.SecondLevelDomains.noConflict === "function") {
              unconflicted.SecondLevelDomains = root2.SecondLevelDomains.noConflict();
            }
            return unconflicted;
          } else if (root2.URI === this) {
            root2.URI = _URI;
          }
          return this;
        };
        p.build = function(deferBuild) {
          if (deferBuild === true) {
            this._deferred_build = true;
          } else if (deferBuild === void 0 || this._deferred_build) {
            this._string = URI3.build(this._parts);
            this._deferred_build = false;
          }
          return this;
        };
        p.clone = function() {
          return new URI3(this);
        };
        p.valueOf = p.toString = function() {
          return this.build(false)._string;
        };
        function generateSimpleAccessor(_part2) {
          return function(v, build) {
            if (v === void 0) {
              return this._parts[_part2] || "";
            } else {
              this._parts[_part2] = v || null;
              this.build(!build);
              return this;
            }
          };
        }
        function generatePrefixAccessor(_part2, _key) {
          return function(v, build) {
            if (v === void 0) {
              return this._parts[_part2] || "";
            } else {
              if (v !== null) {
                v = v + "";
                if (v.charAt(0) === _key) {
                  v = v.substring(1);
                }
              }
              this._parts[_part2] = v;
              this.build(!build);
              return this;
            }
          };
        }
        p.protocol = generateSimpleAccessor("protocol");
        p.username = generateSimpleAccessor("username");
        p.password = generateSimpleAccessor("password");
        p.hostname = generateSimpleAccessor("hostname");
        p.port = generateSimpleAccessor("port");
        p.query = generatePrefixAccessor("query", "?");
        p.fragment = generatePrefixAccessor("fragment", "#");
        p.search = function(v, build) {
          var t = this.query(v, build);
          return typeof t === "string" && t.length ? "?" + t : t;
        };
        p.hash = function(v, build) {
          var t = this.fragment(v, build);
          return typeof t === "string" && t.length ? "#" + t : t;
        };
        p.pathname = function(v, build) {
          if (v === void 0 || v === true) {
            var res = this._parts.path || (this._parts.hostname ? "/" : "");
            return v ? (this._parts.urn ? URI3.decodeUrnPath : URI3.decodePath)(res) : res;
          } else {
            if (this._parts.urn) {
              this._parts.path = v ? URI3.recodeUrnPath(v) : "";
            } else {
              this._parts.path = v ? URI3.recodePath(v) : "/";
            }
            this.build(!build);
            return this;
          }
        };
        p.path = p.pathname;
        p.href = function(href, build) {
          var key;
          if (href === void 0) {
            return this.toString();
          }
          this._string = "";
          this._parts = URI3._parts();
          var _URI2 = href instanceof URI3;
          var _object = typeof href === "object" && (href.hostname || href.path || href.pathname);
          if (href.nodeName) {
            var attribute = URI3.getDomAttribute(href);
            href = href[attribute] || "";
            _object = false;
          }
          if (!_URI2 && _object && href.pathname !== void 0) {
            href = href.toString();
          }
          if (typeof href === "string" || href instanceof String) {
            this._parts = URI3.parse(String(href), this._parts);
          } else if (_URI2 || _object) {
            var src = _URI2 ? href._parts : href;
            for (key in src) {
              if (key === "query") {
                continue;
              }
              if (hasOwn.call(this._parts, key)) {
                this._parts[key] = src[key];
              }
            }
            if (src.query) {
              this.query(src.query, false);
            }
          } else {
            throw new TypeError("invalid input");
          }
          this.build(!build);
          return this;
        };
        p.is = function(what) {
          var ip = false;
          var ip4 = false;
          var ip6 = false;
          var name = false;
          var sld = false;
          var idn = false;
          var punycode2 = false;
          var relative = !this._parts.urn;
          if (this._parts.hostname) {
            relative = false;
            ip4 = URI3.ip4_expression.test(this._parts.hostname);
            ip6 = URI3.ip6_expression.test(this._parts.hostname);
            ip = ip4 || ip6;
            name = !ip;
            sld = name && SLD && SLD.has(this._parts.hostname);
            idn = name && URI3.idn_expression.test(this._parts.hostname);
            punycode2 = name && URI3.punycode_expression.test(this._parts.hostname);
          }
          switch (what.toLowerCase()) {
            case "relative":
              return relative;
            case "absolute":
              return !relative;
            case "domain":
            case "name":
              return name;
            case "sld":
              return sld;
            case "ip":
              return ip;
            case "ip4":
            case "ipv4":
            case "inet4":
              return ip4;
            case "ip6":
            case "ipv6":
            case "inet6":
              return ip6;
            case "idn":
              return idn;
            case "url":
              return !this._parts.urn;
            case "urn":
              return !!this._parts.urn;
            case "punycode":
              return punycode2;
          }
          return null;
        };
        var _protocol = p.protocol;
        var _port = p.port;
        var _hostname = p.hostname;
        p.protocol = function(v, build) {
          if (v) {
            v = v.replace(/:(\/\/)?$/, "");
            if (!v.match(URI3.protocol_expression)) {
              throw new TypeError('Protocol "' + v + `" contains characters other than [A-Z0-9.+-] or doesn't start with [A-Z]`);
            }
          }
          return _protocol.call(this, v, build);
        };
        p.scheme = p.protocol;
        p.port = function(v, build) {
          if (this._parts.urn) {
            return v === void 0 ? "" : this;
          }
          if (v !== void 0) {
            if (v === 0) {
              v = null;
            }
            if (v) {
              v += "";
              if (v.charAt(0) === ":") {
                v = v.substring(1);
              }
              URI3.ensureValidPort(v);
            }
          }
          return _port.call(this, v, build);
        };
        p.hostname = function(v, build) {
          if (this._parts.urn) {
            return v === void 0 ? "" : this;
          }
          if (v !== void 0) {
            var x2 = { preventInvalidHostname: this._parts.preventInvalidHostname };
            var res = URI3.parseHost(v, x2);
            if (res !== "/") {
              throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
            }
            v = x2.hostname;
            if (this._parts.preventInvalidHostname) {
              URI3.ensureValidHostname(v, this._parts.protocol);
            }
          }
          return _hostname.call(this, v, build);
        };
        p.origin = function(v, build) {
          if (this._parts.urn) {
            return v === void 0 ? "" : this;
          }
          if (v === void 0) {
            var protocol = this.protocol();
            var authority = this.authority();
            if (!authority) {
              return "";
            }
            return (protocol ? protocol + "://" : "") + this.authority();
          } else {
            var origin = URI3(v);
            this.protocol(origin.protocol()).authority(origin.authority()).build(!build);
            return this;
          }
        };
        p.host = function(v, build) {
          if (this._parts.urn) {
            return v === void 0 ? "" : this;
          }
          if (v === void 0) {
            return this._parts.hostname ? URI3.buildHost(this._parts) : "";
          } else {
            var res = URI3.parseHost(v, this._parts);
            if (res !== "/") {
              throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
            }
            this.build(!build);
            return this;
          }
        };
        p.authority = function(v, build) {
          if (this._parts.urn) {
            return v === void 0 ? "" : this;
          }
          if (v === void 0) {
            return this._parts.hostname ? URI3.buildAuthority(this._parts) : "";
          } else {
            var res = URI3.parseAuthority(v, this._parts);
            if (res !== "/") {
              throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
            }
            this.build(!build);
            return this;
          }
        };
        p.userinfo = function(v, build) {
          if (this._parts.urn) {
            return v === void 0 ? "" : this;
          }
          if (v === void 0) {
            var t = URI3.buildUserinfo(this._parts);
            return t ? t.substring(0, t.length - 1) : t;
          } else {
            if (v[v.length - 1] !== "@") {
              v += "@";
            }
            URI3.parseUserinfo(v, this._parts);
            this.build(!build);
            return this;
          }
        };
        p.resource = function(v, build) {
          var parts;
          if (v === void 0) {
            return this.path() + this.search() + this.hash();
          }
          parts = URI3.parse(v);
          this._parts.path = parts.path;
          this._parts.query = parts.query;
          this._parts.fragment = parts.fragment;
          this.build(!build);
          return this;
        };
        p.subdomain = function(v, build) {
          if (this._parts.urn) {
            return v === void 0 ? "" : this;
          }
          if (v === void 0) {
            if (!this._parts.hostname || this.is("IP")) {
              return "";
            }
            var end = this._parts.hostname.length - this.domain().length - 1;
            return this._parts.hostname.substring(0, end) || "";
          } else {
            var e = this._parts.hostname.length - this.domain().length;
            var sub = this._parts.hostname.substring(0, e);
            var replace = new RegExp("^" + escapeRegEx(sub));
            if (v && v.charAt(v.length - 1) !== ".") {
              v += ".";
            }
            if (v.indexOf(":") !== -1) {
              throw new TypeError("Domains cannot contain colons");
            }
            if (v) {
              URI3.ensureValidHostname(v, this._parts.protocol);
            }
            this._parts.hostname = this._parts.hostname.replace(replace, v);
            this.build(!build);
            return this;
          }
        };
        p.domain = function(v, build) {
          if (this._parts.urn) {
            return v === void 0 ? "" : this;
          }
          if (typeof v === "boolean") {
            build = v;
            v = void 0;
          }
          if (v === void 0) {
            if (!this._parts.hostname || this.is("IP")) {
              return "";
            }
            var t = this._parts.hostname.match(/\./g);
            if (t && t.length < 2) {
              return this._parts.hostname;
            }
            var end = this._parts.hostname.length - this.tld(build).length - 1;
            end = this._parts.hostname.lastIndexOf(".", end - 1) + 1;
            return this._parts.hostname.substring(end) || "";
          } else {
            if (!v) {
              throw new TypeError("cannot set domain empty");
            }
            if (v.indexOf(":") !== -1) {
              throw new TypeError("Domains cannot contain colons");
            }
            URI3.ensureValidHostname(v, this._parts.protocol);
            if (!this._parts.hostname || this.is("IP")) {
              this._parts.hostname = v;
            } else {
              var replace = new RegExp(escapeRegEx(this.domain()) + "$");
              this._parts.hostname = this._parts.hostname.replace(replace, v);
            }
            this.build(!build);
            return this;
          }
        };
        p.tld = function(v, build) {
          if (this._parts.urn) {
            return v === void 0 ? "" : this;
          }
          if (typeof v === "boolean") {
            build = v;
            v = void 0;
          }
          if (v === void 0) {
            if (!this._parts.hostname || this.is("IP")) {
              return "";
            }
            var pos = this._parts.hostname.lastIndexOf(".");
            var tld = this._parts.hostname.substring(pos + 1);
            if (build !== true && SLD && SLD.list[tld.toLowerCase()]) {
              return SLD.get(this._parts.hostname) || tld;
            }
            return tld;
          } else {
            var replace;
            if (!v) {
              throw new TypeError("cannot set TLD empty");
            } else if (v.match(/[^a-zA-Z0-9-]/)) {
              if (SLD && SLD.is(v)) {
                replace = new RegExp(escapeRegEx(this.tld()) + "$");
                this._parts.hostname = this._parts.hostname.replace(replace, v);
              } else {
                throw new TypeError('TLD "' + v + '" contains characters other than [A-Z0-9]');
              }
            } else if (!this._parts.hostname || this.is("IP")) {
              throw new ReferenceError("cannot set TLD on non-domain host");
            } else {
              replace = new RegExp(escapeRegEx(this.tld()) + "$");
              this._parts.hostname = this._parts.hostname.replace(replace, v);
            }
            this.build(!build);
            return this;
          }
        };
        p.directory = function(v, build) {
          if (this._parts.urn) {
            return v === void 0 ? "" : this;
          }
          if (v === void 0 || v === true) {
            if (!this._parts.path && !this._parts.hostname) {
              return "";
            }
            if (this._parts.path === "/") {
              return "/";
            }
            var end = this._parts.path.length - this.filename().length - 1;
            var res = this._parts.path.substring(0, end) || (this._parts.hostname ? "/" : "");
            return v ? URI3.decodePath(res) : res;
          } else {
            var e = this._parts.path.length - this.filename().length;
            var directory = this._parts.path.substring(0, e);
            var replace = new RegExp("^" + escapeRegEx(directory));
            if (!this.is("relative")) {
              if (!v) {
                v = "/";
              }
              if (v.charAt(0) !== "/") {
                v = "/" + v;
              }
            }
            if (v && v.charAt(v.length - 1) !== "/") {
              v += "/";
            }
            v = URI3.recodePath(v);
            this._parts.path = this._parts.path.replace(replace, v);
            this.build(!build);
            return this;
          }
        };
        p.filename = function(v, build) {
          if (this._parts.urn) {
            return v === void 0 ? "" : this;
          }
          if (typeof v !== "string") {
            if (!this._parts.path || this._parts.path === "/") {
              return "";
            }
            var pos = this._parts.path.lastIndexOf("/");
            var res = this._parts.path.substring(pos + 1);
            return v ? URI3.decodePathSegment(res) : res;
          } else {
            var mutatedDirectory = false;
            if (v.charAt(0) === "/") {
              v = v.substring(1);
            }
            if (v.match(/\.?\//)) {
              mutatedDirectory = true;
            }
            var replace = new RegExp(escapeRegEx(this.filename()) + "$");
            v = URI3.recodePath(v);
            this._parts.path = this._parts.path.replace(replace, v);
            if (mutatedDirectory) {
              this.normalizePath(build);
            } else {
              this.build(!build);
            }
            return this;
          }
        };
        p.suffix = function(v, build) {
          if (this._parts.urn) {
            return v === void 0 ? "" : this;
          }
          if (v === void 0 || v === true) {
            if (!this._parts.path || this._parts.path === "/") {
              return "";
            }
            var filename = this.filename();
            var pos = filename.lastIndexOf(".");
            var s, res;
            if (pos === -1) {
              return "";
            }
            s = filename.substring(pos + 1);
            res = /^[a-z0-9%]+$/i.test(s) ? s : "";
            return v ? URI3.decodePathSegment(res) : res;
          } else {
            if (v.charAt(0) === ".") {
              v = v.substring(1);
            }
            var suffix = this.suffix();
            var replace;
            if (!suffix) {
              if (!v) {
                return this;
              }
              this._parts.path += "." + URI3.recodePath(v);
            } else if (!v) {
              replace = new RegExp(escapeRegEx("." + suffix) + "$");
            } else {
              replace = new RegExp(escapeRegEx(suffix) + "$");
            }
            if (replace) {
              v = URI3.recodePath(v);
              this._parts.path = this._parts.path.replace(replace, v);
            }
            this.build(!build);
            return this;
          }
        };
        p.segment = function(segment, v, build) {
          var separator = this._parts.urn ? ":" : "/";
          var path2 = this.path();
          var absolute = path2.substring(0, 1) === "/";
          var segments = path2.split(separator);
          if (segment !== void 0 && typeof segment !== "number") {
            build = v;
            v = segment;
            segment = void 0;
          }
          if (segment !== void 0 && typeof segment !== "number") {
            throw new Error('Bad segment "' + segment + '", must be 0-based integer');
          }
          if (absolute) {
            segments.shift();
          }
          if (segment < 0) {
            segment = Math.max(segments.length + segment, 0);
          }
          if (v === void 0) {
            return segment === void 0 ? segments : segments[segment];
          } else if (segment === null || segments[segment] === void 0) {
            if (isArray(v)) {
              segments = [];
              for (var i2 = 0, l = v.length; i2 < l; i2++) {
                if (!v[i2].length && (!segments.length || !segments[segments.length - 1].length)) {
                  continue;
                }
                if (segments.length && !segments[segments.length - 1].length) {
                  segments.pop();
                }
                segments.push(trimSlashes(v[i2]));
              }
            } else if (v || typeof v === "string") {
              v = trimSlashes(v);
              if (segments[segments.length - 1] === "") {
                segments[segments.length - 1] = v;
              } else {
                segments.push(v);
              }
            }
          } else {
            if (v) {
              segments[segment] = trimSlashes(v);
            } else {
              segments.splice(segment, 1);
            }
          }
          if (absolute) {
            segments.unshift("");
          }
          return this.path(segments.join(separator), build);
        };
        p.segmentCoded = function(segment, v, build) {
          var segments, i2, l;
          if (typeof segment !== "number") {
            build = v;
            v = segment;
            segment = void 0;
          }
          if (v === void 0) {
            segments = this.segment(segment, v, build);
            if (!isArray(segments)) {
              segments = segments !== void 0 ? URI3.decode(segments) : void 0;
            } else {
              for (i2 = 0, l = segments.length; i2 < l; i2++) {
                segments[i2] = URI3.decode(segments[i2]);
              }
            }
            return segments;
          }
          if (!isArray(v)) {
            v = typeof v === "string" || v instanceof String ? URI3.encode(v) : v;
          } else {
            for (i2 = 0, l = v.length; i2 < l; i2++) {
              v[i2] = URI3.encode(v[i2]);
            }
          }
          return this.segment(segment, v, build);
        };
        var q = p.query;
        p.query = function(v, build) {
          if (v === true) {
            return URI3.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
          } else if (typeof v === "function") {
            var data = URI3.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
            var result = v.call(this, data);
            this._parts.query = URI3.buildQuery(result || data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
            this.build(!build);
            return this;
          } else if (v !== void 0 && typeof v !== "string") {
            this._parts.query = URI3.buildQuery(v, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
            this.build(!build);
            return this;
          } else {
            return q.call(this, v, build);
          }
        };
        p.setQuery = function(name, value, build) {
          var data = URI3.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
          if (typeof name === "string" || name instanceof String) {
            data[name] = value !== void 0 ? value : null;
          } else if (typeof name === "object") {
            for (var key in name) {
              if (hasOwn.call(name, key)) {
                data[key] = name[key];
              }
            }
          } else {
            throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");
          }
          this._parts.query = URI3.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
          if (typeof name !== "string") {
            build = value;
          }
          this.build(!build);
          return this;
        };
        p.addQuery = function(name, value, build) {
          var data = URI3.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
          URI3.addQuery(data, name, value === void 0 ? null : value);
          this._parts.query = URI3.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
          if (typeof name !== "string") {
            build = value;
          }
          this.build(!build);
          return this;
        };
        p.removeQuery = function(name, value, build) {
          var data = URI3.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
          URI3.removeQuery(data, name, value);
          this._parts.query = URI3.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
          if (typeof name !== "string") {
            build = value;
          }
          this.build(!build);
          return this;
        };
        p.hasQuery = function(name, value, withinArray) {
          var data = URI3.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
          return URI3.hasQuery(data, name, value, withinArray);
        };
        p.setSearch = p.setQuery;
        p.addSearch = p.addQuery;
        p.removeSearch = p.removeQuery;
        p.hasSearch = p.hasQuery;
        p.normalize = function() {
          if (this._parts.urn) {
            return this.normalizeProtocol(false).normalizePath(false).normalizeQuery(false).normalizeFragment(false).build();
          }
          return this.normalizeProtocol(false).normalizeHostname(false).normalizePort(false).normalizePath(false).normalizeQuery(false).normalizeFragment(false).build();
        };
        p.normalizeProtocol = function(build) {
          if (typeof this._parts.protocol === "string") {
            this._parts.protocol = this._parts.protocol.toLowerCase();
            this.build(!build);
          }
          return this;
        };
        p.normalizeHostname = function(build) {
          if (this._parts.hostname) {
            if (this.is("IDN") && punycode) {
              this._parts.hostname = punycode.toASCII(this._parts.hostname);
            } else if (this.is("IPv6") && IPv6) {
              this._parts.hostname = IPv6.best(this._parts.hostname);
            }
            this._parts.hostname = this._parts.hostname.toLowerCase();
            this.build(!build);
          }
          return this;
        };
        p.normalizePort = function(build) {
          if (typeof this._parts.protocol === "string" && this._parts.port === URI3.defaultPorts[this._parts.protocol]) {
            this._parts.port = null;
            this.build(!build);
          }
          return this;
        };
        p.normalizePath = function(build) {
          var _path = this._parts.path;
          if (!_path) {
            return this;
          }
          if (this._parts.urn) {
            this._parts.path = URI3.recodeUrnPath(this._parts.path);
            this.build(!build);
            return this;
          }
          if (this._parts.path === "/") {
            return this;
          }
          _path = URI3.recodePath(_path);
          var _was_relative;
          var _leadingParents = "";
          var _parent, _pos;
          if (_path.charAt(0) !== "/") {
            _was_relative = true;
            _path = "/" + _path;
          }
          if (_path.slice(-3) === "/.." || _path.slice(-2) === "/.") {
            _path += "/";
          }
          _path = _path.replace(/(\/(\.\/)+)|(\/\.$)/g, "/").replace(/\/{2,}/g, "/");
          if (_was_relative) {
            _leadingParents = _path.substring(1).match(/^(\.\.\/)+/) || "";
            if (_leadingParents) {
              _leadingParents = _leadingParents[0];
            }
          }
          while (true) {
            _parent = _path.search(/\/\.\.(\/|$)/);
            if (_parent === -1) {
              break;
            } else if (_parent === 0) {
              _path = _path.substring(3);
              continue;
            }
            _pos = _path.substring(0, _parent).lastIndexOf("/");
            if (_pos === -1) {
              _pos = _parent;
            }
            _path = _path.substring(0, _pos) + _path.substring(_parent + 3);
          }
          if (_was_relative && this.is("relative")) {
            _path = _leadingParents + _path.substring(1);
          }
          this._parts.path = _path;
          this.build(!build);
          return this;
        };
        p.normalizePathname = p.normalizePath;
        p.normalizeQuery = function(build) {
          if (typeof this._parts.query === "string") {
            if (!this._parts.query.length) {
              this._parts.query = null;
            } else {
              this.query(URI3.parseQuery(this._parts.query, this._parts.escapeQuerySpace));
            }
            this.build(!build);
          }
          return this;
        };
        p.normalizeFragment = function(build) {
          if (!this._parts.fragment) {
            this._parts.fragment = null;
            this.build(!build);
          }
          return this;
        };
        p.normalizeSearch = p.normalizeQuery;
        p.normalizeHash = p.normalizeFragment;
        p.iso8859 = function() {
          var e = URI3.encode;
          var d = URI3.decode;
          URI3.encode = escape;
          URI3.decode = decodeURIComponent;
          try {
            this.normalize();
          } finally {
            URI3.encode = e;
            URI3.decode = d;
          }
          return this;
        };
        p.unicode = function() {
          var e = URI3.encode;
          var d = URI3.decode;
          URI3.encode = strictEncodeURIComponent;
          URI3.decode = unescape;
          try {
            this.normalize();
          } finally {
            URI3.encode = e;
            URI3.decode = d;
          }
          return this;
        };
        p.readable = function() {
          var uri = this.clone();
          uri.username("").password("").normalize();
          var t = "";
          if (uri._parts.protocol) {
            t += uri._parts.protocol + "://";
          }
          if (uri._parts.hostname) {
            if (uri.is("punycode") && punycode) {
              t += punycode.toUnicode(uri._parts.hostname);
              if (uri._parts.port) {
                t += ":" + uri._parts.port;
              }
            } else {
              t += uri.host();
            }
          }
          if (uri._parts.hostname && uri._parts.path && uri._parts.path.charAt(0) !== "/") {
            t += "/";
          }
          t += uri.path(true);
          if (uri._parts.query) {
            var q2 = "";
            for (var i2 = 0, qp = uri._parts.query.split("&"), l = qp.length; i2 < l; i2++) {
              var kv = (qp[i2] || "").split("=");
              q2 += "&" + URI3.decodeQuery(kv[0], this._parts.escapeQuerySpace).replace(/&/g, "%26");
              if (kv[1] !== void 0) {
                q2 += "=" + URI3.decodeQuery(kv[1], this._parts.escapeQuerySpace).replace(/&/g, "%26");
              }
            }
            t += "?" + q2.substring(1);
          }
          t += URI3.decodeQuery(uri.hash(), true);
          return t;
        };
        p.absoluteTo = function(base) {
          var resolved = this.clone();
          var properties = ["protocol", "username", "password", "hostname", "port"];
          var basedir, i2, p2;
          if (this._parts.urn) {
            throw new Error("URNs do not have any generally defined hierarchical components");
          }
          if (!(base instanceof URI3)) {
            base = new URI3(base);
          }
          if (resolved._parts.protocol) {
            return resolved;
          } else {
            resolved._parts.protocol = base._parts.protocol;
          }
          if (this._parts.hostname) {
            return resolved;
          }
          for (i2 = 0; p2 = properties[i2]; i2++) {
            resolved._parts[p2] = base._parts[p2];
          }
          if (!resolved._parts.path) {
            resolved._parts.path = base._parts.path;
            if (!resolved._parts.query) {
              resolved._parts.query = base._parts.query;
            }
          } else {
            if (resolved._parts.path.substring(-2) === "..") {
              resolved._parts.path += "/";
            }
            if (resolved.path().charAt(0) !== "/") {
              basedir = base.directory();
              basedir = basedir ? basedir : base.path().indexOf("/") === 0 ? "/" : "";
              resolved._parts.path = (basedir ? basedir + "/" : "") + resolved._parts.path;
              resolved.normalizePath();
            }
          }
          resolved.build();
          return resolved;
        };
        p.relativeTo = function(base) {
          var relative = this.clone().normalize();
          var relativeParts, baseParts, common, relativePath, basePath;
          if (relative._parts.urn) {
            throw new Error("URNs do not have any generally defined hierarchical components");
          }
          base = new URI3(base).normalize();
          relativeParts = relative._parts;
          baseParts = base._parts;
          relativePath = relative.path();
          basePath = base.path();
          if (relativePath.charAt(0) !== "/") {
            throw new Error("URI is already relative");
          }
          if (basePath.charAt(0) !== "/") {
            throw new Error("Cannot calculate a URI relative to another relative URI");
          }
          if (relativeParts.protocol === baseParts.protocol) {
            relativeParts.protocol = null;
          }
          if (relativeParts.username !== baseParts.username || relativeParts.password !== baseParts.password) {
            return relative.build();
          }
          if (relativeParts.protocol !== null || relativeParts.username !== null || relativeParts.password !== null) {
            return relative.build();
          }
          if (relativeParts.hostname === baseParts.hostname && relativeParts.port === baseParts.port) {
            relativeParts.hostname = null;
            relativeParts.port = null;
          } else {
            return relative.build();
          }
          if (relativePath === basePath) {
            relativeParts.path = "";
            return relative.build();
          }
          common = URI3.commonPath(relativePath, basePath);
          if (!common) {
            return relative.build();
          }
          var parents = baseParts.path.substring(common.length).replace(/[^\/]*$/, "").replace(/.*?\//g, "../");
          relativeParts.path = parents + relativeParts.path.substring(common.length) || "./";
          return relative.build();
        };
        p.equals = function(uri) {
          var one2 = this.clone();
          var two = new URI3(uri);
          var one_map = {};
          var two_map = {};
          var checked = {};
          var one_query, two_query, key;
          one2.normalize();
          two.normalize();
          if (one2.toString() === two.toString()) {
            return true;
          }
          one_query = one2.query();
          two_query = two.query();
          one2.query("");
          two.query("");
          if (one2.toString() !== two.toString()) {
            return false;
          }
          if (one_query.length !== two_query.length) {
            return false;
          }
          one_map = URI3.parseQuery(one_query, this._parts.escapeQuerySpace);
          two_map = URI3.parseQuery(two_query, this._parts.escapeQuerySpace);
          for (key in one_map) {
            if (hasOwn.call(one_map, key)) {
              if (!isArray(one_map[key])) {
                if (one_map[key] !== two_map[key]) {
                  return false;
                }
              } else if (!arraysEqual(one_map[key], two_map[key])) {
                return false;
              }
              checked[key] = true;
            }
          }
          for (key in two_map) {
            if (hasOwn.call(two_map, key)) {
              if (!checked[key]) {
                return false;
              }
            }
          }
          return true;
        };
        p.preventInvalidHostname = function(v) {
          this._parts.preventInvalidHostname = !!v;
          return this;
        };
        p.duplicateQueryParameters = function(v) {
          this._parts.duplicateQueryParameters = !!v;
          return this;
        };
        p.escapeQuerySpace = function(v) {
          this._parts.escapeQuerySpace = !!v;
          return this;
        };
        return URI3;
      });
    }
  });

  // vendor/logjam/app/assets/javascripts/page-context.js
  var context, page_context_default;
  var init_page_context = __esm({
    "vendor/logjam/app/assets/javascripts/page-context.js"() {
      context = {
        parameters: null,
        parameter_defaults: null,
        self_url: null,
        home_url: null,
        history_url: null,
        selectable_days: null,
        action_auto_complete_url: null,
        application_auto_complete_url: null
      };
      page_context_default = context;
      window.page_context = context;
    }
  });

  // vendor/logjam/app/assets/javascripts/logjam-header.js
  function submit_filter_form() {
    var selected_date = (0, import_jquery2.default)("#datepicker").val().replace(/-/g, "/");
    if (selected_date.match(/\d\d\d\d\/\d\d\/\d\d/)) {
      var old_action = (0, import_jquery2.default)("#filter-form").attr("action");
      var old_date = old_action.match(/\d\d\d\d\/\d\d\/\d\d/);
      if (old_date) {
        (0, import_jquery2.default)("#filter-form").attr("action", old_action.replace(old_date[0], selected_date));
      }
    }
    let defaults = page_context_default.parameter_defaults;
    var action = new import_urijs.default((0, import_jquery2.default)("#filter-form").attr("action"));
    var x2 = (0, import_jquery2.default)("#filter-form").serialize();
    var uri = new import_urijs.default();
    uri.pathname(action.pathname().replace(/\/show\/.*$/, ""));
    uri.search(x2);
    uri.removeSearch("utf8").removeSearch("page", defaults.page).removeSearch("resource", defaults.resource).removeSearch("section", defaults.section).removeSearch("scale", defaults.scale).removeSearch("time_range", defaults.time_range).removeSearch("grouping", defaults.grouping).removeSearch("grouping_function", defaults.grouping_function).removeSearch("error_type", defaults.error_type).removeSearch("start_minute", defaults.start_minute).removeSearch("end_minute", defaults.end_minute).removeSearch("auto_refresh", defaults.auto_refresh).removeSearch("kind", defaults.kind).removeSearch("interval", defaults.interval);
    document.location.href = uri.toString();
  }
  function go_home() {
    let defaults = page_context_default.parameter_defaults;
    let home_url = page_context_default.home_url;
    (0, import_jquery2.default)("#page").val(defaults.page);
    (0, import_jquery2.default)("#grouping").val(defaults.grouping);
    (0, import_jquery2.default)("#resource").val(defaults.resource);
    (0, import_jquery2.default)("#section").val(defaults.section);
    (0, import_jquery2.default)("#scale").val(defaults.scale);
    (0, import_jquery2.default)("#kind").val(defaults.kind);
    (0, import_jquery2.default)("#grouping-function").val(defaults.grouping_function);
    (0, import_jquery2.default)("#error-type").val(defaults.error_type);
    (0, import_jquery2.default)("#start-minute").val(defaults.start_minute);
    (0, import_jquery2.default)("#end-minute").val(defaults.end_minute);
    (0, import_jquery2.default)("#interval").val(defaults.interval);
    (0, import_jquery2.default)("#time-range").val(defaults.time_range);
    (0, import_jquery2.default)("#auto_refresh").val(defaults.auto_refresh);
    (0, import_jquery2.default)("#filter-form").attr("action", home_url);
    (0, import_jquery2.default)("#filter-form").trigger("submit");
  }
  function view_selected_pages() {
    if (page_context_default.parameters.time_range == "date") {
      (0, import_jquery2.default)("#filter-form").attr("action", page_context_default.self_url);
    } else {
      (0, import_jquery2.default)("#filter-form").attr("action", page_context_default.history_url);
    }
    (0, import_jquery2.default)("#filter-form").trigger("submit");
  }
  function view_grouping(grouping) {
    let defaults = page_context_default.parameter_defaults;
    let home_url = page_context_default.home_url;
    (0, import_jquery2.default)("#grouping").val(grouping);
    (0, import_jquery2.default)("#time-range").val(defaults.time_range);
    (0, import_jquery2.default)("#filter-form").attr("action", home_url);
    (0, import_jquery2.default)("#filter-form").trigger("submit");
  }
  function view_resource(resource) {
    let parameters = page_context_default.parameters;
    let defaults = page_context_default.parameter_defaults;
    let home_url = page_context_default.home_url;
    (0, import_jquery2.default)("#resource").val(resource);
    (0, import_jquery2.default)("#time-range").val(defaults.time_range);
    if (parameters.action != "totals_overview") {
      (0, import_jquery2.default)("#filter-form").attr("action", home_url);
    }
    if (parameters.grouping_function == "apdex" && !(resource.match(/time/) || resource == "dom_interactive")) {
      (0, import_jquery2.default)("#grouping-function").val(defaults.grouping_function);
    }
    let frontendResources = ["page_time", "navigation_time", "connect_time", "request_time", "response_time", "processing_time", "load_time", "dom_interactive", "ajax_time", "style_nodes", "script_nodes", "html_nodes"];
    if (frontendResources.indexOf(resource) > -1) {
      (0, import_jquery2.default)("#section").val("frontend");
    } else {
      (0, import_jquery2.default)("#section").val("backend");
    }
    (0, import_jquery2.default)("#filter-form").trigger("submit");
  }
  function view_time_range(time_range) {
    let history_url = page_context_default.history_url;
    (0, import_jquery2.default)("#time-range").val(time_range);
    if (time_range == "date") {
      (0, import_jquery2.default)("#filter-form").attr("action", document.home_url);
    } else {
      (0, import_jquery2.default)("#filter-form").attr("action", history_url);
    }
    (0, import_jquery2.default)("#filter-form").trigger("submit");
  }
  function view_date(date3) {
    let home_url = page_context_default.home_url;
    (0, import_jquery2.default)("#datepicker").val(date3.toJSON().substr(0, 10));
    (0, import_jquery2.default)("#time-range").val("date");
    (0, import_jquery2.default)("#filter-form").attr("action", home_url);
    submit_filter_form();
  }
  function sort_by(order) {
    (0, import_jquery2.default)("#grouping-function").val(order);
    (0, import_jquery2.default)("#filter-form").trigger("submit");
  }
  function initialize_header() {
    (0, import_jquery2.default)("#filter-form").on("submit", function(event) {
      event.preventDefault();
      submit_filter_form();
    });
    let parameters = page_context_default.parameters;
    let selectable_days = page_context_default.selectable_days;
    if (parameters.time_range == "date") {
      (0, import_jquery2.default)("#datepicker").jdPicker({
        date_format: "YYYY-mm-dd",
        selectable: selectable_days,
        error_out_of_range: "No data for that date."
      });
    }
    let action_auto_complete_url = page_context_default.action_auto_complete_url;
    (0, import_jquery2.default)("#namespace-suggest").select2({
      width: 300,
      minimumInputLength: 0,
      ajax: {
        url: action_auto_complete_url,
        dataType: "json",
        data: function(term, page) {
          return { query: term };
        },
        results: function(data, page) {
          var array2 = [];
          if (data.query.length > 0) {
            array2.push({ id: 0, text: data.query });
          }
          data.suggestions.forEach(function(item, index) {
            array2.push({ id: index + 1, text: item });
          });
          return { results: array2 };
        }
      }
    });
    (0, import_jquery2.default)("#namespace-suggest").on("change", function(value) {
      (0, import_jquery2.default)("#page").val(value.added.text);
      submit_filter_form();
    });
    (0, import_jquery2.default)("#namespace-suggest").on("blur", function(value) {
      (0, import_jquery2.default)("#namespace-suggest").select2("close");
      submit_filter_form();
    });
    (0, import_jquery2.default)("#application-suggest").select2({
      width: 150,
      minimumInputLength: 0
    });
    (0, import_jquery2.default)("#application-suggest").on("change", function(value) {
      (0, import_jquery2.default)("#app").val(value.added.text);
      submit_filter_form();
    });
    (0, import_jquery2.default)("#application-suggest").on("blur", function(value) {
      (0, import_jquery2.default)("#application-suggest").select2("close");
      submit_filter_form();
    });
    (0, import_jquery2.default)("#view-backend").on("click", function() {
      (0, import_jquery2.default)("#section").val("backend");
      submit_filter_form();
    });
    (0, import_jquery2.default)("#view-frontend").on("click", function() {
      (0, import_jquery2.default)("#section").val("frontend");
      submit_filter_form();
    });
    (0, import_jquery2.default)("#view-linear-scale").on("click", function() {
      (0, import_jquery2.default)("#scale").val("linear");
      submit_filter_form();
    });
    (0, import_jquery2.default)("#view-log-scale").on("click", function() {
      (0, import_jquery2.default)("#scale").val("logarithmic");
      submit_filter_form();
    });
    (0, import_jquery2.default)("#view-apdex-total-time").on("click", function() {
      (0, import_jquery2.default)("#section").val("backend");
      (0, import_jquery2.default)("#resource").val("total_time");
      submit_filter_form();
    });
    (0, import_jquery2.default)("#view-apdex-page-time").on("click", function() {
      (0, import_jquery2.default)("#resource").val("page_time");
      (0, import_jquery2.default)("#section").val("frontend");
      submit_filter_form();
    });
    (0, import_jquery2.default)("#view-apdex-ajax-time").on("click", function() {
      (0, import_jquery2.default)("#resource").val("ajax_time");
      (0, import_jquery2.default)("#section").val("frontend");
      submit_filter_form();
    });
  }
  var import_urijs, import_jquery2;
  var init_logjam_header = __esm({
    "vendor/logjam/app/assets/javascripts/logjam-header.js"() {
      import_urijs = __toESM(require_URI());
      import_jquery2 = __toESM(require_jquery());
      init_page_context();
      window.submit_filter_form = submit_filter_form;
      window.go_home = go_home;
      window.view_selected_pages = view_selected_pages;
      window.view_grouping = view_grouping;
      window.view_resource = view_resource;
      window.view_time_range = view_time_range;
      window.sort_by = sort_by;
      window.initialize_header = initialize_header;
    }
  });

  // node_modules/d3-array/src/ascending.js
  function ascending(a, b) {
    return a == null || b == null ? NaN : a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }
  var init_ascending = __esm({
    "node_modules/d3-array/src/ascending.js"() {
    }
  });

  // node_modules/d3-array/src/descending.js
  function descending(a, b) {
    return a == null || b == null ? NaN : b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
  }
  var init_descending = __esm({
    "node_modules/d3-array/src/descending.js"() {
    }
  });

  // node_modules/d3-array/src/bisector.js
  function bisector(f) {
    let compare1, compare2, delta;
    if (f.length !== 2) {
      compare1 = ascending;
      compare2 = (d, x2) => ascending(f(d), x2);
      delta = (d, x2) => f(d) - x2;
    } else {
      compare1 = f === ascending || f === descending ? f : zero;
      compare2 = f;
      delta = f;
    }
    function left2(a, x2, lo = 0, hi = a.length) {
      if (lo < hi) {
        if (compare1(x2, x2) !== 0)
          return hi;
        do {
          const mid = lo + hi >>> 1;
          if (compare2(a[mid], x2) < 0)
            lo = mid + 1;
          else
            hi = mid;
        } while (lo < hi);
      }
      return lo;
    }
    function right2(a, x2, lo = 0, hi = a.length) {
      if (lo < hi) {
        if (compare1(x2, x2) !== 0)
          return hi;
        do {
          const mid = lo + hi >>> 1;
          if (compare2(a[mid], x2) <= 0)
            lo = mid + 1;
          else
            hi = mid;
        } while (lo < hi);
      }
      return lo;
    }
    function center2(a, x2, lo = 0, hi = a.length) {
      const i2 = left2(a, x2, lo, hi - 1);
      return i2 > lo && delta(a[i2 - 1], x2) > -delta(a[i2], x2) ? i2 - 1 : i2;
    }
    return { left: left2, center: center2, right: right2 };
  }
  function zero() {
    return 0;
  }
  var init_bisector = __esm({
    "node_modules/d3-array/src/bisector.js"() {
      init_ascending();
      init_descending();
    }
  });

  // node_modules/d3-array/src/number.js
  function number(x2) {
    return x2 === null ? NaN : +x2;
  }
  var init_number = __esm({
    "node_modules/d3-array/src/number.js"() {
    }
  });

  // node_modules/d3-array/src/bisect.js
  var ascendingBisect, bisectRight, bisectLeft, bisectCenter, bisect_default;
  var init_bisect = __esm({
    "node_modules/d3-array/src/bisect.js"() {
      init_ascending();
      init_bisector();
      init_number();
      ascendingBisect = bisector(ascending);
      bisectRight = ascendingBisect.right;
      bisectLeft = ascendingBisect.left;
      bisectCenter = bisector(number).center;
      bisect_default = bisectRight;
    }
  });

  // node_modules/d3-array/src/extent.js
  function extent(values, valueof) {
    let min4;
    let max5;
    if (valueof === void 0) {
      for (const value of values) {
        if (value != null) {
          if (min4 === void 0) {
            if (value >= value)
              min4 = max5 = value;
          } else {
            if (min4 > value)
              min4 = value;
            if (max5 < value)
              max5 = value;
          }
        }
      }
    } else {
      let index = -1;
      for (let value of values) {
        if ((value = valueof(value, ++index, values)) != null) {
          if (min4 === void 0) {
            if (value >= value)
              min4 = max5 = value;
          } else {
            if (min4 > value)
              min4 = value;
            if (max5 < value)
              max5 = value;
          }
        }
      }
    }
    return [min4, max5];
  }
  var init_extent = __esm({
    "node_modules/d3-array/src/extent.js"() {
    }
  });

  // node_modules/internmap/src/index.js
  function intern_get({ _intern, _key }, value) {
    const key = _key(value);
    return _intern.has(key) ? _intern.get(key) : value;
  }
  function intern_set({ _intern, _key }, value) {
    const key = _key(value);
    if (_intern.has(key))
      return _intern.get(key);
    _intern.set(key, value);
    return value;
  }
  function intern_delete({ _intern, _key }, value) {
    const key = _key(value);
    if (_intern.has(key)) {
      value = _intern.get(key);
      _intern.delete(key);
    }
    return value;
  }
  function keyof(value) {
    return value !== null && typeof value === "object" ? value.valueOf() : value;
  }
  var InternMap;
  var init_src = __esm({
    "node_modules/internmap/src/index.js"() {
      InternMap = class extends Map {
        constructor(entries, key = keyof) {
          super();
          Object.defineProperties(this, { _intern: { value: /* @__PURE__ */ new Map() }, _key: { value: key } });
          if (entries != null)
            for (const [key2, value] of entries)
              this.set(key2, value);
        }
        get(key) {
          return super.get(intern_get(this, key));
        }
        has(key) {
          return super.has(intern_get(this, key));
        }
        set(key, value) {
          return super.set(intern_set(this, key), value);
        }
        delete(key) {
          return super.delete(intern_delete(this, key));
        }
      };
    }
  });

  // node_modules/d3-array/src/ticks.js
  function tickSpec(start2, stop, count) {
    const step = (stop - start2) / Math.max(0, count), power = Math.floor(Math.log10(step)), error = step / Math.pow(10, power), factor = error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1;
    let i1, i2, inc;
    if (power < 0) {
      inc = Math.pow(10, -power) / factor;
      i1 = Math.round(start2 * inc);
      i2 = Math.round(stop * inc);
      if (i1 / inc < start2)
        ++i1;
      if (i2 / inc > stop)
        --i2;
      inc = -inc;
    } else {
      inc = Math.pow(10, power) * factor;
      i1 = Math.round(start2 / inc);
      i2 = Math.round(stop / inc);
      if (i1 * inc < start2)
        ++i1;
      if (i2 * inc > stop)
        --i2;
    }
    if (i2 < i1 && 0.5 <= count && count < 2)
      return tickSpec(start2, stop, count * 2);
    return [i1, i2, inc];
  }
  function ticks(start2, stop, count) {
    stop = +stop, start2 = +start2, count = +count;
    if (!(count > 0))
      return [];
    if (start2 === stop)
      return [start2];
    const reverse = stop < start2, [i1, i2, inc] = reverse ? tickSpec(stop, start2, count) : tickSpec(start2, stop, count);
    if (!(i2 >= i1))
      return [];
    const n = i2 - i1 + 1, ticks2 = new Array(n);
    if (reverse) {
      if (inc < 0)
        for (let i3 = 0; i3 < n; ++i3)
          ticks2[i3] = (i2 - i3) / -inc;
      else
        for (let i3 = 0; i3 < n; ++i3)
          ticks2[i3] = (i2 - i3) * inc;
    } else {
      if (inc < 0)
        for (let i3 = 0; i3 < n; ++i3)
          ticks2[i3] = (i1 + i3) / -inc;
      else
        for (let i3 = 0; i3 < n; ++i3)
          ticks2[i3] = (i1 + i3) * inc;
    }
    return ticks2;
  }
  function tickIncrement(start2, stop, count) {
    stop = +stop, start2 = +start2, count = +count;
    return tickSpec(start2, stop, count)[2];
  }
  function tickStep(start2, stop, count) {
    stop = +stop, start2 = +start2, count = +count;
    const reverse = stop < start2, inc = reverse ? tickIncrement(stop, start2, count) : tickIncrement(start2, stop, count);
    return (reverse ? -1 : 1) * (inc < 0 ? 1 / -inc : inc);
  }
  var e10, e5, e2;
  var init_ticks = __esm({
    "node_modules/d3-array/src/ticks.js"() {
      e10 = Math.sqrt(50);
      e5 = Math.sqrt(10);
      e2 = Math.sqrt(2);
    }
  });

  // node_modules/d3-array/src/max.js
  function max(values, valueof) {
    let max5;
    if (valueof === void 0) {
      for (const value of values) {
        if (value != null && (max5 < value || max5 === void 0 && value >= value)) {
          max5 = value;
        }
      }
    } else {
      let index = -1;
      for (let value of values) {
        if ((value = valueof(value, ++index, values)) != null && (max5 < value || max5 === void 0 && value >= value)) {
          max5 = value;
        }
      }
    }
    return max5;
  }
  var init_max = __esm({
    "node_modules/d3-array/src/max.js"() {
    }
  });

  // node_modules/d3-array/src/min.js
  function min(values, valueof) {
    let min4;
    if (valueof === void 0) {
      for (const value of values) {
        if (value != null && (min4 > value || min4 === void 0 && value >= value)) {
          min4 = value;
        }
      }
    } else {
      let index = -1;
      for (let value of values) {
        if ((value = valueof(value, ++index, values)) != null && (min4 > value || min4 === void 0 && value >= value)) {
          min4 = value;
        }
      }
    }
    return min4;
  }
  var init_min = __esm({
    "node_modules/d3-array/src/min.js"() {
    }
  });

  // node_modules/d3-array/src/range.js
  function range(start2, stop, step) {
    start2 = +start2, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start2, start2 = 0, 1) : n < 3 ? 1 : +step;
    var i2 = -1, n = Math.max(0, Math.ceil((stop - start2) / step)) | 0, range3 = new Array(n);
    while (++i2 < n) {
      range3[i2] = start2 + i2 * step;
    }
    return range3;
  }
  var init_range = __esm({
    "node_modules/d3-array/src/range.js"() {
    }
  });

  // node_modules/d3-array/src/sum.js
  function sum(values, valueof) {
    let sum2 = 0;
    if (valueof === void 0) {
      for (let value of values) {
        if (value = +value) {
          sum2 += value;
        }
      }
    } else {
      let index = -1;
      for (let value of values) {
        if (value = +valueof(value, ++index, values)) {
          sum2 += value;
        }
      }
    }
    return sum2;
  }
  var init_sum = __esm({
    "node_modules/d3-array/src/sum.js"() {
    }
  });

  // node_modules/d3-array/src/index.js
  var init_src2 = __esm({
    "node_modules/d3-array/src/index.js"() {
      init_bisect();
      init_bisector();
      init_descending();
      init_extent();
      init_max();
      init_min();
      init_range();
      init_sum();
      init_ticks();
      init_src();
    }
  });

  // node_modules/d3-axis/src/identity.js
  function identity_default(x2) {
    return x2;
  }
  var init_identity = __esm({
    "node_modules/d3-axis/src/identity.js"() {
    }
  });

  // node_modules/d3-axis/src/axis.js
  function translateX(x2) {
    return "translate(" + x2 + ",0)";
  }
  function translateY(y2) {
    return "translate(0," + y2 + ")";
  }
  function number2(scale) {
    return (d) => +scale(d);
  }
  function center(scale, offset) {
    offset = Math.max(0, scale.bandwidth() - offset * 2) / 2;
    if (scale.round())
      offset = Math.round(offset);
    return (d) => +scale(d) + offset;
  }
  function entering() {
    return !this.__axis;
  }
  function axis(orient, scale) {
    var tickArguments = [], tickValues = null, tickFormat2 = null, tickSizeInner = 6, tickSizeOuter = 6, tickPadding = 3, offset = typeof window !== "undefined" && window.devicePixelRatio > 1 ? 0 : 0.5, k = orient === top || orient === left ? -1 : 1, x2 = orient === left || orient === right ? "x" : "y", transform2 = orient === top || orient === bottom ? translateX : translateY;
    function axis2(context2) {
      var values = tickValues == null ? scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain() : tickValues, format2 = tickFormat2 == null ? scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity_default : tickFormat2, spacing = Math.max(tickSizeInner, 0) + tickPadding, range3 = scale.range(), range0 = +range3[0] + offset, range1 = +range3[range3.length - 1] + offset, position = (scale.bandwidth ? center : number2)(scale.copy(), offset), selection2 = context2.selection ? context2.selection() : context2, path2 = selection2.selectAll(".domain").data([null]), tick = selection2.selectAll(".tick").data(values, scale).order(), tickExit = tick.exit(), tickEnter = tick.enter().append("g").attr("class", "tick"), line = tick.select("line"), text = tick.select("text");
      path2 = path2.merge(path2.enter().insert("path", ".tick").attr("class", "domain").attr("stroke", "currentColor"));
      tick = tick.merge(tickEnter);
      line = line.merge(tickEnter.append("line").attr("stroke", "currentColor").attr(x2 + "2", k * tickSizeInner));
      text = text.merge(tickEnter.append("text").attr("fill", "currentColor").attr(x2, k * spacing).attr("dy", orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em"));
      if (context2 !== selection2) {
        path2 = path2.transition(context2);
        tick = tick.transition(context2);
        line = line.transition(context2);
        text = text.transition(context2);
        tickExit = tickExit.transition(context2).attr("opacity", epsilon).attr("transform", function(d) {
          return isFinite(d = position(d)) ? transform2(d + offset) : this.getAttribute("transform");
        });
        tickEnter.attr("opacity", epsilon).attr("transform", function(d) {
          var p = this.parentNode.__axis;
          return transform2((p && isFinite(p = p(d)) ? p : position(d)) + offset);
        });
      }
      tickExit.remove();
      path2.attr("d", orient === left || orient === right ? tickSizeOuter ? "M" + k * tickSizeOuter + "," + range0 + "H" + offset + "V" + range1 + "H" + k * tickSizeOuter : "M" + offset + "," + range0 + "V" + range1 : tickSizeOuter ? "M" + range0 + "," + k * tickSizeOuter + "V" + offset + "H" + range1 + "V" + k * tickSizeOuter : "M" + range0 + "," + offset + "H" + range1);
      tick.attr("opacity", 1).attr("transform", function(d) {
        return transform2(position(d) + offset);
      });
      line.attr(x2 + "2", k * tickSizeInner);
      text.attr(x2, k * spacing).text(format2);
      selection2.filter(entering).attr("fill", "none").attr("font-size", 10).attr("font-family", "sans-serif").attr("text-anchor", orient === right ? "start" : orient === left ? "end" : "middle");
      selection2.each(function() {
        this.__axis = position;
      });
    }
    axis2.scale = function(_) {
      return arguments.length ? (scale = _, axis2) : scale;
    };
    axis2.ticks = function() {
      return tickArguments = Array.from(arguments), axis2;
    };
    axis2.tickArguments = function(_) {
      return arguments.length ? (tickArguments = _ == null ? [] : Array.from(_), axis2) : tickArguments.slice();
    };
    axis2.tickValues = function(_) {
      return arguments.length ? (tickValues = _ == null ? null : Array.from(_), axis2) : tickValues && tickValues.slice();
    };
    axis2.tickFormat = function(_) {
      return arguments.length ? (tickFormat2 = _, axis2) : tickFormat2;
    };
    axis2.tickSize = function(_) {
      return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis2) : tickSizeInner;
    };
    axis2.tickSizeInner = function(_) {
      return arguments.length ? (tickSizeInner = +_, axis2) : tickSizeInner;
    };
    axis2.tickSizeOuter = function(_) {
      return arguments.length ? (tickSizeOuter = +_, axis2) : tickSizeOuter;
    };
    axis2.tickPadding = function(_) {
      return arguments.length ? (tickPadding = +_, axis2) : tickPadding;
    };
    axis2.offset = function(_) {
      return arguments.length ? (offset = +_, axis2) : offset;
    };
    return axis2;
  }
  function axisBottom(scale) {
    return axis(bottom, scale);
  }
  function axisLeft(scale) {
    return axis(left, scale);
  }
  var top, right, bottom, left, epsilon;
  var init_axis = __esm({
    "node_modules/d3-axis/src/axis.js"() {
      init_identity();
      top = 1;
      right = 2;
      bottom = 3;
      left = 4;
      epsilon = 1e-6;
    }
  });

  // node_modules/d3-axis/src/index.js
  var init_src3 = __esm({
    "node_modules/d3-axis/src/index.js"() {
      init_axis();
    }
  });

  // node_modules/d3-dispatch/src/dispatch.js
  function dispatch() {
    for (var i2 = 0, n = arguments.length, _ = {}, t; i2 < n; ++i2) {
      if (!(t = arguments[i2] + "") || t in _ || /[\s.]/.test(t))
        throw new Error("illegal type: " + t);
      _[t] = [];
    }
    return new Dispatch(_);
  }
  function Dispatch(_) {
    this._ = _;
  }
  function parseTypenames(typenames, types) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i2 = t.indexOf(".");
      if (i2 >= 0)
        name = t.slice(i2 + 1), t = t.slice(0, i2);
      if (t && !types.hasOwnProperty(t))
        throw new Error("unknown type: " + t);
      return { type: t, name };
    });
  }
  function get(type2, name) {
    for (var i2 = 0, n = type2.length, c; i2 < n; ++i2) {
      if ((c = type2[i2]).name === name) {
        return c.value;
      }
    }
  }
  function set(type2, name, callback) {
    for (var i2 = 0, n = type2.length; i2 < n; ++i2) {
      if (type2[i2].name === name) {
        type2[i2] = noop, type2 = type2.slice(0, i2).concat(type2.slice(i2 + 1));
        break;
      }
    }
    if (callback != null)
      type2.push({ name, value: callback });
    return type2;
  }
  var noop, dispatch_default;
  var init_dispatch = __esm({
    "node_modules/d3-dispatch/src/dispatch.js"() {
      noop = { value: () => {
      } };
      Dispatch.prototype = dispatch.prototype = {
        constructor: Dispatch,
        on: function(typename, callback) {
          var _ = this._, T = parseTypenames(typename + "", _), t, i2 = -1, n = T.length;
          if (arguments.length < 2) {
            while (++i2 < n)
              if ((t = (typename = T[i2]).type) && (t = get(_[t], typename.name)))
                return t;
            return;
          }
          if (callback != null && typeof callback !== "function")
            throw new Error("invalid callback: " + callback);
          while (++i2 < n) {
            if (t = (typename = T[i2]).type)
              _[t] = set(_[t], typename.name, callback);
            else if (callback == null)
              for (t in _)
                _[t] = set(_[t], typename.name, null);
          }
          return this;
        },
        copy: function() {
          var copy3 = {}, _ = this._;
          for (var t in _)
            copy3[t] = _[t].slice();
          return new Dispatch(copy3);
        },
        call: function(type2, that) {
          if ((n = arguments.length - 2) > 0)
            for (var args = new Array(n), i2 = 0, n, t; i2 < n; ++i2)
              args[i2] = arguments[i2 + 2];
          if (!this._.hasOwnProperty(type2))
            throw new Error("unknown type: " + type2);
          for (t = this._[type2], i2 = 0, n = t.length; i2 < n; ++i2)
            t[i2].value.apply(that, args);
        },
        apply: function(type2, that, args) {
          if (!this._.hasOwnProperty(type2))
            throw new Error("unknown type: " + type2);
          for (var t = this._[type2], i2 = 0, n = t.length; i2 < n; ++i2)
            t[i2].value.apply(that, args);
        }
      };
      dispatch_default = dispatch;
    }
  });

  // node_modules/d3-dispatch/src/index.js
  var init_src4 = __esm({
    "node_modules/d3-dispatch/src/index.js"() {
      init_dispatch();
    }
  });

  // node_modules/d3-selection/src/namespaces.js
  var xhtml, namespaces_default;
  var init_namespaces = __esm({
    "node_modules/d3-selection/src/namespaces.js"() {
      xhtml = "http://www.w3.org/1999/xhtml";
      namespaces_default = {
        svg: "http://www.w3.org/2000/svg",
        xhtml,
        xlink: "http://www.w3.org/1999/xlink",
        xml: "http://www.w3.org/XML/1998/namespace",
        xmlns: "http://www.w3.org/2000/xmlns/"
      };
    }
  });

  // node_modules/d3-selection/src/namespace.js
  function namespace_default(name) {
    var prefix = name += "", i2 = prefix.indexOf(":");
    if (i2 >= 0 && (prefix = name.slice(0, i2)) !== "xmlns")
      name = name.slice(i2 + 1);
    return namespaces_default.hasOwnProperty(prefix) ? { space: namespaces_default[prefix], local: name } : name;
  }
  var init_namespace = __esm({
    "node_modules/d3-selection/src/namespace.js"() {
      init_namespaces();
    }
  });

  // node_modules/d3-selection/src/creator.js
  function creatorInherit(name) {
    return function() {
      var document2 = this.ownerDocument, uri = this.namespaceURI;
      return uri === xhtml && document2.documentElement.namespaceURI === xhtml ? document2.createElement(name) : document2.createElementNS(uri, name);
    };
  }
  function creatorFixed(fullname) {
    return function() {
      return this.ownerDocument.createElementNS(fullname.space, fullname.local);
    };
  }
  function creator_default(name) {
    var fullname = namespace_default(name);
    return (fullname.local ? creatorFixed : creatorInherit)(fullname);
  }
  var init_creator = __esm({
    "node_modules/d3-selection/src/creator.js"() {
      init_namespace();
      init_namespaces();
    }
  });

  // node_modules/d3-selection/src/selector.js
  function none() {
  }
  function selector_default(selector) {
    return selector == null ? none : function() {
      return this.querySelector(selector);
    };
  }
  var init_selector = __esm({
    "node_modules/d3-selection/src/selector.js"() {
    }
  });

  // node_modules/d3-selection/src/selection/select.js
  function select_default(select) {
    if (typeof select !== "function")
      select = selector_default(select);
    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j2 = 0; j2 < m; ++j2) {
      for (var group = groups[j2], n = group.length, subgroup = subgroups[j2] = new Array(n), node, subnode, i2 = 0; i2 < n; ++i2) {
        if ((node = group[i2]) && (subnode = select.call(node, node.__data__, i2, group))) {
          if ("__data__" in node)
            subnode.__data__ = node.__data__;
          subgroup[i2] = subnode;
        }
      }
    }
    return new Selection(subgroups, this._parents);
  }
  var init_select = __esm({
    "node_modules/d3-selection/src/selection/select.js"() {
      init_selection();
      init_selector();
    }
  });

  // node_modules/d3-selection/src/array.js
  function array(x2) {
    return x2 == null ? [] : Array.isArray(x2) ? x2 : Array.from(x2);
  }
  var init_array = __esm({
    "node_modules/d3-selection/src/array.js"() {
    }
  });

  // node_modules/d3-selection/src/selectorAll.js
  function empty() {
    return [];
  }
  function selectorAll_default(selector) {
    return selector == null ? empty : function() {
      return this.querySelectorAll(selector);
    };
  }
  var init_selectorAll = __esm({
    "node_modules/d3-selection/src/selectorAll.js"() {
    }
  });

  // node_modules/d3-selection/src/selection/selectAll.js
  function arrayAll(select) {
    return function() {
      return array(select.apply(this, arguments));
    };
  }
  function selectAll_default(select) {
    if (typeof select === "function")
      select = arrayAll(select);
    else
      select = selectorAll_default(select);
    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j2 = 0; j2 < m; ++j2) {
      for (var group = groups[j2], n = group.length, node, i2 = 0; i2 < n; ++i2) {
        if (node = group[i2]) {
          subgroups.push(select.call(node, node.__data__, i2, group));
          parents.push(node);
        }
      }
    }
    return new Selection(subgroups, parents);
  }
  var init_selectAll = __esm({
    "node_modules/d3-selection/src/selection/selectAll.js"() {
      init_selection();
      init_array();
      init_selectorAll();
    }
  });

  // node_modules/d3-selection/src/matcher.js
  function matcher_default(selector) {
    return function() {
      return this.matches(selector);
    };
  }
  function childMatcher(selector) {
    return function(node) {
      return node.matches(selector);
    };
  }
  var init_matcher = __esm({
    "node_modules/d3-selection/src/matcher.js"() {
    }
  });

  // node_modules/d3-selection/src/selection/selectChild.js
  function childFind(match) {
    return function() {
      return find.call(this.children, match);
    };
  }
  function childFirst() {
    return this.firstElementChild;
  }
  function selectChild_default(match) {
    return this.select(match == null ? childFirst : childFind(typeof match === "function" ? match : childMatcher(match)));
  }
  var find;
  var init_selectChild = __esm({
    "node_modules/d3-selection/src/selection/selectChild.js"() {
      init_matcher();
      find = Array.prototype.find;
    }
  });

  // node_modules/d3-selection/src/selection/selectChildren.js
  function children() {
    return Array.from(this.children);
  }
  function childrenFilter(match) {
    return function() {
      return filter.call(this.children, match);
    };
  }
  function selectChildren_default(match) {
    return this.selectAll(match == null ? children : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
  }
  var filter;
  var init_selectChildren = __esm({
    "node_modules/d3-selection/src/selection/selectChildren.js"() {
      init_matcher();
      filter = Array.prototype.filter;
    }
  });

  // node_modules/d3-selection/src/selection/filter.js
  function filter_default(match) {
    if (typeof match !== "function")
      match = matcher_default(match);
    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j2 = 0; j2 < m; ++j2) {
      for (var group = groups[j2], n = group.length, subgroup = subgroups[j2] = [], node, i2 = 0; i2 < n; ++i2) {
        if ((node = group[i2]) && match.call(node, node.__data__, i2, group)) {
          subgroup.push(node);
        }
      }
    }
    return new Selection(subgroups, this._parents);
  }
  var init_filter = __esm({
    "node_modules/d3-selection/src/selection/filter.js"() {
      init_selection();
      init_matcher();
    }
  });

  // node_modules/d3-selection/src/selection/sparse.js
  function sparse_default(update) {
    return new Array(update.length);
  }
  var init_sparse = __esm({
    "node_modules/d3-selection/src/selection/sparse.js"() {
    }
  });

  // node_modules/d3-selection/src/selection/enter.js
  function enter_default() {
    return new Selection(this._enter || this._groups.map(sparse_default), this._parents);
  }
  function EnterNode(parent, datum2) {
    this.ownerDocument = parent.ownerDocument;
    this.namespaceURI = parent.namespaceURI;
    this._next = null;
    this._parent = parent;
    this.__data__ = datum2;
  }
  var init_enter = __esm({
    "node_modules/d3-selection/src/selection/enter.js"() {
      init_sparse();
      init_selection();
      EnterNode.prototype = {
        constructor: EnterNode,
        appendChild: function(child) {
          return this._parent.insertBefore(child, this._next);
        },
        insertBefore: function(child, next) {
          return this._parent.insertBefore(child, next);
        },
        querySelector: function(selector) {
          return this._parent.querySelector(selector);
        },
        querySelectorAll: function(selector) {
          return this._parent.querySelectorAll(selector);
        }
      };
    }
  });

  // node_modules/d3-selection/src/constant.js
  function constant_default(x2) {
    return function() {
      return x2;
    };
  }
  var init_constant = __esm({
    "node_modules/d3-selection/src/constant.js"() {
    }
  });

  // node_modules/d3-selection/src/selection/data.js
  function bindIndex(parent, group, enter, update, exit, data) {
    var i2 = 0, node, groupLength = group.length, dataLength = data.length;
    for (; i2 < dataLength; ++i2) {
      if (node = group[i2]) {
        node.__data__ = data[i2];
        update[i2] = node;
      } else {
        enter[i2] = new EnterNode(parent, data[i2]);
      }
    }
    for (; i2 < groupLength; ++i2) {
      if (node = group[i2]) {
        exit[i2] = node;
      }
    }
  }
  function bindKey(parent, group, enter, update, exit, data, key) {
    var i2, node, nodeByKeyValue = /* @__PURE__ */ new Map(), groupLength = group.length, dataLength = data.length, keyValues = new Array(groupLength), keyValue;
    for (i2 = 0; i2 < groupLength; ++i2) {
      if (node = group[i2]) {
        keyValues[i2] = keyValue = key.call(node, node.__data__, i2, group) + "";
        if (nodeByKeyValue.has(keyValue)) {
          exit[i2] = node;
        } else {
          nodeByKeyValue.set(keyValue, node);
        }
      }
    }
    for (i2 = 0; i2 < dataLength; ++i2) {
      keyValue = key.call(parent, data[i2], i2, data) + "";
      if (node = nodeByKeyValue.get(keyValue)) {
        update[i2] = node;
        node.__data__ = data[i2];
        nodeByKeyValue.delete(keyValue);
      } else {
        enter[i2] = new EnterNode(parent, data[i2]);
      }
    }
    for (i2 = 0; i2 < groupLength; ++i2) {
      if ((node = group[i2]) && nodeByKeyValue.get(keyValues[i2]) === node) {
        exit[i2] = node;
      }
    }
  }
  function datum(node) {
    return node.__data__;
  }
  function data_default(value, key) {
    if (!arguments.length)
      return Array.from(this, datum);
    var bind = key ? bindKey : bindIndex, parents = this._parents, groups = this._groups;
    if (typeof value !== "function")
      value = constant_default(value);
    for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j2 = 0; j2 < m; ++j2) {
      var parent = parents[j2], group = groups[j2], groupLength = group.length, data = arraylike(value.call(parent, parent && parent.__data__, j2, parents)), dataLength = data.length, enterGroup = enter[j2] = new Array(dataLength), updateGroup = update[j2] = new Array(dataLength), exitGroup = exit[j2] = new Array(groupLength);
      bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);
      for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
        if (previous = enterGroup[i0]) {
          if (i0 >= i1)
            i1 = i0 + 1;
          while (!(next = updateGroup[i1]) && ++i1 < dataLength)
            ;
          previous._next = next || null;
        }
      }
    }
    update = new Selection(update, parents);
    update._enter = enter;
    update._exit = exit;
    return update;
  }
  function arraylike(data) {
    return typeof data === "object" && "length" in data ? data : Array.from(data);
  }
  var init_data = __esm({
    "node_modules/d3-selection/src/selection/data.js"() {
      init_selection();
      init_enter();
      init_constant();
    }
  });

  // node_modules/d3-selection/src/selection/exit.js
  function exit_default() {
    return new Selection(this._exit || this._groups.map(sparse_default), this._parents);
  }
  var init_exit = __esm({
    "node_modules/d3-selection/src/selection/exit.js"() {
      init_sparse();
      init_selection();
    }
  });

  // node_modules/d3-selection/src/selection/join.js
  function join_default(onenter, onupdate, onexit) {
    var enter = this.enter(), update = this, exit = this.exit();
    if (typeof onenter === "function") {
      enter = onenter(enter);
      if (enter)
        enter = enter.selection();
    } else {
      enter = enter.append(onenter + "");
    }
    if (onupdate != null) {
      update = onupdate(update);
      if (update)
        update = update.selection();
    }
    if (onexit == null)
      exit.remove();
    else
      onexit(exit);
    return enter && update ? enter.merge(update).order() : update;
  }
  var init_join = __esm({
    "node_modules/d3-selection/src/selection/join.js"() {
    }
  });

  // node_modules/d3-selection/src/selection/merge.js
  function merge_default(context2) {
    var selection2 = context2.selection ? context2.selection() : context2;
    for (var groups0 = this._groups, groups1 = selection2._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j2 = 0; j2 < m; ++j2) {
      for (var group0 = groups0[j2], group1 = groups1[j2], n = group0.length, merge = merges[j2] = new Array(n), node, i2 = 0; i2 < n; ++i2) {
        if (node = group0[i2] || group1[i2]) {
          merge[i2] = node;
        }
      }
    }
    for (; j2 < m0; ++j2) {
      merges[j2] = groups0[j2];
    }
    return new Selection(merges, this._parents);
  }
  var init_merge = __esm({
    "node_modules/d3-selection/src/selection/merge.js"() {
      init_selection();
    }
  });

  // node_modules/d3-selection/src/selection/order.js
  function order_default() {
    for (var groups = this._groups, j2 = -1, m = groups.length; ++j2 < m; ) {
      for (var group = groups[j2], i2 = group.length - 1, next = group[i2], node; --i2 >= 0; ) {
        if (node = group[i2]) {
          if (next && node.compareDocumentPosition(next) ^ 4)
            next.parentNode.insertBefore(node, next);
          next = node;
        }
      }
    }
    return this;
  }
  var init_order = __esm({
    "node_modules/d3-selection/src/selection/order.js"() {
    }
  });

  // node_modules/d3-selection/src/selection/sort.js
  function sort_default(compare) {
    if (!compare)
      compare = ascending2;
    function compareNode(a, b) {
      return a && b ? compare(a.__data__, b.__data__) : !a - !b;
    }
    for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j2 = 0; j2 < m; ++j2) {
      for (var group = groups[j2], n = group.length, sortgroup = sortgroups[j2] = new Array(n), node, i2 = 0; i2 < n; ++i2) {
        if (node = group[i2]) {
          sortgroup[i2] = node;
        }
      }
      sortgroup.sort(compareNode);
    }
    return new Selection(sortgroups, this._parents).order();
  }
  function ascending2(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }
  var init_sort = __esm({
    "node_modules/d3-selection/src/selection/sort.js"() {
      init_selection();
    }
  });

  // node_modules/d3-selection/src/selection/call.js
  function call_default() {
    var callback = arguments[0];
    arguments[0] = this;
    callback.apply(null, arguments);
    return this;
  }
  var init_call = __esm({
    "node_modules/d3-selection/src/selection/call.js"() {
    }
  });

  // node_modules/d3-selection/src/selection/nodes.js
  function nodes_default() {
    return Array.from(this);
  }
  var init_nodes = __esm({
    "node_modules/d3-selection/src/selection/nodes.js"() {
    }
  });

  // node_modules/d3-selection/src/selection/node.js
  function node_default() {
    for (var groups = this._groups, j2 = 0, m = groups.length; j2 < m; ++j2) {
      for (var group = groups[j2], i2 = 0, n = group.length; i2 < n; ++i2) {
        var node = group[i2];
        if (node)
          return node;
      }
    }
    return null;
  }
  var init_node = __esm({
    "node_modules/d3-selection/src/selection/node.js"() {
    }
  });

  // node_modules/d3-selection/src/selection/size.js
  function size_default() {
    let size = 0;
    for (const node of this)
      ++size;
    return size;
  }
  var init_size = __esm({
    "node_modules/d3-selection/src/selection/size.js"() {
    }
  });

  // node_modules/d3-selection/src/selection/empty.js
  function empty_default() {
    return !this.node();
  }
  var init_empty = __esm({
    "node_modules/d3-selection/src/selection/empty.js"() {
    }
  });

  // node_modules/d3-selection/src/selection/each.js
  function each_default(callback) {
    for (var groups = this._groups, j2 = 0, m = groups.length; j2 < m; ++j2) {
      for (var group = groups[j2], i2 = 0, n = group.length, node; i2 < n; ++i2) {
        if (node = group[i2])
          callback.call(node, node.__data__, i2, group);
      }
    }
    return this;
  }
  var init_each = __esm({
    "node_modules/d3-selection/src/selection/each.js"() {
    }
  });

  // node_modules/d3-selection/src/selection/attr.js
  function attrRemove(name) {
    return function() {
      this.removeAttribute(name);
    };
  }
  function attrRemoveNS(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }
  function attrConstant(name, value) {
    return function() {
      this.setAttribute(name, value);
    };
  }
  function attrConstantNS(fullname, value) {
    return function() {
      this.setAttributeNS(fullname.space, fullname.local, value);
    };
  }
  function attrFunction(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null)
        this.removeAttribute(name);
      else
        this.setAttribute(name, v);
    };
  }
  function attrFunctionNS(fullname, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null)
        this.removeAttributeNS(fullname.space, fullname.local);
      else
        this.setAttributeNS(fullname.space, fullname.local, v);
    };
  }
  function attr_default(name, value) {
    var fullname = namespace_default(name);
    if (arguments.length < 2) {
      var node = this.node();
      return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
    }
    return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
  }
  var init_attr = __esm({
    "node_modules/d3-selection/src/selection/attr.js"() {
      init_namespace();
    }
  });

  // node_modules/d3-selection/src/window.js
  function window_default(node) {
    return node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView;
  }
  var init_window = __esm({
    "node_modules/d3-selection/src/window.js"() {
    }
  });

  // node_modules/d3-selection/src/selection/style.js
  function styleRemove(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }
  function styleConstant(name, value, priority) {
    return function() {
      this.style.setProperty(name, value, priority);
    };
  }
  function styleFunction(name, value, priority) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null)
        this.style.removeProperty(name);
      else
        this.style.setProperty(name, v, priority);
    };
  }
  function style_default(name, value, priority) {
    return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value === "function" ? styleFunction : styleConstant)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
  }
  function styleValue(node, name) {
    return node.style.getPropertyValue(name) || window_default(node).getComputedStyle(node, null).getPropertyValue(name);
  }
  var init_style = __esm({
    "node_modules/d3-selection/src/selection/style.js"() {
      init_window();
    }
  });

  // node_modules/d3-selection/src/selection/property.js
  function propertyRemove(name) {
    return function() {
      delete this[name];
    };
  }
  function propertyConstant(name, value) {
    return function() {
      this[name] = value;
    };
  }
  function propertyFunction(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null)
        delete this[name];
      else
        this[name] = v;
    };
  }
  function property_default(name, value) {
    return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
  }
  var init_property = __esm({
    "node_modules/d3-selection/src/selection/property.js"() {
    }
  });

  // node_modules/d3-selection/src/selection/classed.js
  function classArray(string2) {
    return string2.trim().split(/^|\s+/);
  }
  function classList(node) {
    return node.classList || new ClassList(node);
  }
  function ClassList(node) {
    this._node = node;
    this._names = classArray(node.getAttribute("class") || "");
  }
  function classedAdd(node, names) {
    var list = classList(node), i2 = -1, n = names.length;
    while (++i2 < n)
      list.add(names[i2]);
  }
  function classedRemove(node, names) {
    var list = classList(node), i2 = -1, n = names.length;
    while (++i2 < n)
      list.remove(names[i2]);
  }
  function classedTrue(names) {
    return function() {
      classedAdd(this, names);
    };
  }
  function classedFalse(names) {
    return function() {
      classedRemove(this, names);
    };
  }
  function classedFunction(names, value) {
    return function() {
      (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
    };
  }
  function classed_default(name, value) {
    var names = classArray(name + "");
    if (arguments.length < 2) {
      var list = classList(this.node()), i2 = -1, n = names.length;
      while (++i2 < n)
        if (!list.contains(names[i2]))
          return false;
      return true;
    }
    return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
  }
  var init_classed = __esm({
    "node_modules/d3-selection/src/selection/classed.js"() {
      ClassList.prototype = {
        add: function(name) {
          var i2 = this._names.indexOf(name);
          if (i2 < 0) {
            this._names.push(name);
            this._node.setAttribute("class", this._names.join(" "));
          }
        },
        remove: function(name) {
          var i2 = this._names.indexOf(name);
          if (i2 >= 0) {
            this._names.splice(i2, 1);
            this._node.setAttribute("class", this._names.join(" "));
          }
        },
        contains: function(name) {
          return this._names.indexOf(name) >= 0;
        }
      };
    }
  });

  // node_modules/d3-selection/src/selection/text.js
  function textRemove() {
    this.textContent = "";
  }
  function textConstant(value) {
    return function() {
      this.textContent = value;
    };
  }
  function textFunction(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.textContent = v == null ? "" : v;
    };
  }
  function text_default(value) {
    return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction : textConstant)(value)) : this.node().textContent;
  }
  var init_text = __esm({
    "node_modules/d3-selection/src/selection/text.js"() {
    }
  });

  // node_modules/d3-selection/src/selection/html.js
  function htmlRemove() {
    this.innerHTML = "";
  }
  function htmlConstant(value) {
    return function() {
      this.innerHTML = value;
    };
  }
  function htmlFunction(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.innerHTML = v == null ? "" : v;
    };
  }
  function html_default(value) {
    return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
  }
  var init_html = __esm({
    "node_modules/d3-selection/src/selection/html.js"() {
    }
  });

  // node_modules/d3-selection/src/selection/raise.js
  function raise() {
    if (this.nextSibling)
      this.parentNode.appendChild(this);
  }
  function raise_default() {
    return this.each(raise);
  }
  var init_raise = __esm({
    "node_modules/d3-selection/src/selection/raise.js"() {
    }
  });

  // node_modules/d3-selection/src/selection/lower.js
  function lower() {
    if (this.previousSibling)
      this.parentNode.insertBefore(this, this.parentNode.firstChild);
  }
  function lower_default() {
    return this.each(lower);
  }
  var init_lower = __esm({
    "node_modules/d3-selection/src/selection/lower.js"() {
    }
  });

  // node_modules/d3-selection/src/selection/append.js
  function append_default(name) {
    var create2 = typeof name === "function" ? name : creator_default(name);
    return this.select(function() {
      return this.appendChild(create2.apply(this, arguments));
    });
  }
  var init_append = __esm({
    "node_modules/d3-selection/src/selection/append.js"() {
      init_creator();
    }
  });

  // node_modules/d3-selection/src/selection/insert.js
  function constantNull() {
    return null;
  }
  function insert_default(name, before) {
    var create2 = typeof name === "function" ? name : creator_default(name), select = before == null ? constantNull : typeof before === "function" ? before : selector_default(before);
    return this.select(function() {
      return this.insertBefore(create2.apply(this, arguments), select.apply(this, arguments) || null);
    });
  }
  var init_insert = __esm({
    "node_modules/d3-selection/src/selection/insert.js"() {
      init_creator();
      init_selector();
    }
  });

  // node_modules/d3-selection/src/selection/remove.js
  function remove() {
    var parent = this.parentNode;
    if (parent)
      parent.removeChild(this);
  }
  function remove_default() {
    return this.each(remove);
  }
  var init_remove = __esm({
    "node_modules/d3-selection/src/selection/remove.js"() {
    }
  });

  // node_modules/d3-selection/src/selection/clone.js
  function selection_cloneShallow() {
    var clone = this.cloneNode(false), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
  }
  function selection_cloneDeep() {
    var clone = this.cloneNode(true), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
  }
  function clone_default(deep) {
    return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
  }
  var init_clone = __esm({
    "node_modules/d3-selection/src/selection/clone.js"() {
    }
  });

  // node_modules/d3-selection/src/selection/datum.js
  function datum_default(value) {
    return arguments.length ? this.property("__data__", value) : this.node().__data__;
  }
  var init_datum = __esm({
    "node_modules/d3-selection/src/selection/datum.js"() {
    }
  });

  // node_modules/d3-selection/src/selection/on.js
  function contextListener(listener) {
    return function(event) {
      listener.call(this, event, this.__data__);
    };
  }
  function parseTypenames2(typenames) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i2 = t.indexOf(".");
      if (i2 >= 0)
        name = t.slice(i2 + 1), t = t.slice(0, i2);
      return { type: t, name };
    });
  }
  function onRemove(typename) {
    return function() {
      var on = this.__on;
      if (!on)
        return;
      for (var j2 = 0, i2 = -1, m = on.length, o; j2 < m; ++j2) {
        if (o = on[j2], (!typename.type || o.type === typename.type) && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
        } else {
          on[++i2] = o;
        }
      }
      if (++i2)
        on.length = i2;
      else
        delete this.__on;
    };
  }
  function onAdd(typename, value, options) {
    return function() {
      var on = this.__on, o, listener = contextListener(value);
      if (on)
        for (var j2 = 0, m = on.length; j2 < m; ++j2) {
          if ((o = on[j2]).type === typename.type && o.name === typename.name) {
            this.removeEventListener(o.type, o.listener, o.options);
            this.addEventListener(o.type, o.listener = listener, o.options = options);
            o.value = value;
            return;
          }
        }
      this.addEventListener(typename.type, listener, options);
      o = { type: typename.type, name: typename.name, value, listener, options };
      if (!on)
        this.__on = [o];
      else
        on.push(o);
    };
  }
  function on_default(typename, value, options) {
    var typenames = parseTypenames2(typename + ""), i2, n = typenames.length, t;
    if (arguments.length < 2) {
      var on = this.node().__on;
      if (on)
        for (var j2 = 0, m = on.length, o; j2 < m; ++j2) {
          for (i2 = 0, o = on[j2]; i2 < n; ++i2) {
            if ((t = typenames[i2]).type === o.type && t.name === o.name) {
              return o.value;
            }
          }
        }
      return;
    }
    on = value ? onAdd : onRemove;
    for (i2 = 0; i2 < n; ++i2)
      this.each(on(typenames[i2], value, options));
    return this;
  }
  var init_on = __esm({
    "node_modules/d3-selection/src/selection/on.js"() {
    }
  });

  // node_modules/d3-selection/src/selection/dispatch.js
  function dispatchEvent(node, type2, params) {
    var window2 = window_default(node), event = window2.CustomEvent;
    if (typeof event === "function") {
      event = new event(type2, params);
    } else {
      event = window2.document.createEvent("Event");
      if (params)
        event.initEvent(type2, params.bubbles, params.cancelable), event.detail = params.detail;
      else
        event.initEvent(type2, false, false);
    }
    node.dispatchEvent(event);
  }
  function dispatchConstant(type2, params) {
    return function() {
      return dispatchEvent(this, type2, params);
    };
  }
  function dispatchFunction(type2, params) {
    return function() {
      return dispatchEvent(this, type2, params.apply(this, arguments));
    };
  }
  function dispatch_default2(type2, params) {
    return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type2, params));
  }
  var init_dispatch2 = __esm({
    "node_modules/d3-selection/src/selection/dispatch.js"() {
      init_window();
    }
  });

  // node_modules/d3-selection/src/selection/iterator.js
  function* iterator_default() {
    for (var groups = this._groups, j2 = 0, m = groups.length; j2 < m; ++j2) {
      for (var group = groups[j2], i2 = 0, n = group.length, node; i2 < n; ++i2) {
        if (node = group[i2])
          yield node;
      }
    }
  }
  var init_iterator = __esm({
    "node_modules/d3-selection/src/selection/iterator.js"() {
    }
  });

  // node_modules/d3-selection/src/selection/index.js
  function Selection(groups, parents) {
    this._groups = groups;
    this._parents = parents;
  }
  function selection() {
    return new Selection([[document.documentElement]], root);
  }
  function selection_selection() {
    return this;
  }
  var root, selection_default;
  var init_selection = __esm({
    "node_modules/d3-selection/src/selection/index.js"() {
      init_select();
      init_selectAll();
      init_selectChild();
      init_selectChildren();
      init_filter();
      init_data();
      init_enter();
      init_exit();
      init_join();
      init_merge();
      init_order();
      init_sort();
      init_call();
      init_nodes();
      init_node();
      init_size();
      init_empty();
      init_each();
      init_attr();
      init_style();
      init_property();
      init_classed();
      init_text();
      init_html();
      init_raise();
      init_lower();
      init_append();
      init_insert();
      init_remove();
      init_clone();
      init_datum();
      init_on();
      init_dispatch2();
      init_iterator();
      root = [null];
      Selection.prototype = selection.prototype = {
        constructor: Selection,
        select: select_default,
        selectAll: selectAll_default,
        selectChild: selectChild_default,
        selectChildren: selectChildren_default,
        filter: filter_default,
        data: data_default,
        enter: enter_default,
        exit: exit_default,
        join: join_default,
        merge: merge_default,
        selection: selection_selection,
        order: order_default,
        sort: sort_default,
        call: call_default,
        nodes: nodes_default,
        node: node_default,
        size: size_default,
        empty: empty_default,
        each: each_default,
        attr: attr_default,
        style: style_default,
        property: property_default,
        classed: classed_default,
        text: text_default,
        html: html_default,
        raise: raise_default,
        lower: lower_default,
        append: append_default,
        insert: insert_default,
        remove: remove_default,
        clone: clone_default,
        datum: datum_default,
        on: on_default,
        dispatch: dispatch_default2,
        [Symbol.iterator]: iterator_default
      };
      selection_default = selection;
    }
  });

  // node_modules/d3-selection/src/select.js
  function select_default2(selector) {
    return typeof selector === "string" ? new Selection([[document.querySelector(selector)]], [document.documentElement]) : new Selection([[selector]], root);
  }
  var init_select3 = __esm({
    "node_modules/d3-selection/src/select.js"() {
      init_selection();
    }
  });

  // node_modules/d3-selection/src/sourceEvent.js
  function sourceEvent_default(event) {
    let sourceEvent;
    while (sourceEvent = event.sourceEvent)
      event = sourceEvent;
    return event;
  }
  var init_sourceEvent = __esm({
    "node_modules/d3-selection/src/sourceEvent.js"() {
    }
  });

  // node_modules/d3-selection/src/pointer.js
  function pointer_default(event, node) {
    event = sourceEvent_default(event);
    if (node === void 0)
      node = event.currentTarget;
    if (node) {
      var svg = node.ownerSVGElement || node;
      if (svg.createSVGPoint) {
        var point4 = svg.createSVGPoint();
        point4.x = event.clientX, point4.y = event.clientY;
        point4 = point4.matrixTransform(node.getScreenCTM().inverse());
        return [point4.x, point4.y];
      }
      if (node.getBoundingClientRect) {
        var rect = node.getBoundingClientRect();
        return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
      }
    }
    return [event.pageX, event.pageY];
  }
  var init_pointer = __esm({
    "node_modules/d3-selection/src/pointer.js"() {
      init_sourceEvent();
    }
  });

  // node_modules/d3-selection/src/selectAll.js
  function selectAll_default2(selector) {
    return typeof selector === "string" ? new Selection([document.querySelectorAll(selector)], [document.documentElement]) : new Selection([array(selector)], root);
  }
  var init_selectAll2 = __esm({
    "node_modules/d3-selection/src/selectAll.js"() {
      init_array();
      init_selection();
    }
  });

  // node_modules/d3-selection/src/index.js
  var init_src5 = __esm({
    "node_modules/d3-selection/src/index.js"() {
      init_matcher();
      init_namespace();
      init_pointer();
      init_select3();
      init_selectAll2();
      init_selection();
      init_selector();
      init_selectorAll();
      init_style();
    }
  });

  // node_modules/d3-drag/src/index.js
  var init_src6 = __esm({
    "node_modules/d3-drag/src/index.js"() {
    }
  });

  // node_modules/d3-color/src/define.js
  function define_default(constructor, factory, prototype) {
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
  }
  function extend(parent, definition) {
    var prototype = Object.create(parent.prototype);
    for (var key in definition)
      prototype[key] = definition[key];
    return prototype;
  }
  var init_define = __esm({
    "node_modules/d3-color/src/define.js"() {
    }
  });

  // node_modules/d3-color/src/color.js
  function Color() {
  }
  function color_formatHex() {
    return this.rgb().formatHex();
  }
  function color_formatHex8() {
    return this.rgb().formatHex8();
  }
  function color_formatHsl() {
    return hslConvert(this).formatHsl();
  }
  function color_formatRgb() {
    return this.rgb().formatRgb();
  }
  function color(format2) {
    var m, l;
    format2 = (format2 + "").trim().toLowerCase();
    return (m = reHex.exec(format2)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) : l === 3 ? new Rgb(m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, (m & 15) << 4 | m & 15, 1) : l === 8 ? rgba(m >> 24 & 255, m >> 16 & 255, m >> 8 & 255, (m & 255) / 255) : l === 4 ? rgba(m >> 12 & 15 | m >> 8 & 240, m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, ((m & 15) << 4 | m & 15) / 255) : null) : (m = reRgbInteger.exec(format2)) ? new Rgb(m[1], m[2], m[3], 1) : (m = reRgbPercent.exec(format2)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) : (m = reRgbaInteger.exec(format2)) ? rgba(m[1], m[2], m[3], m[4]) : (m = reRgbaPercent.exec(format2)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) : (m = reHslPercent.exec(format2)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) : (m = reHslaPercent.exec(format2)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) : named.hasOwnProperty(format2) ? rgbn(named[format2]) : format2 === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
  }
  function rgbn(n) {
    return new Rgb(n >> 16 & 255, n >> 8 & 255, n & 255, 1);
  }
  function rgba(r, g, b, a) {
    if (a <= 0)
      r = g = b = NaN;
    return new Rgb(r, g, b, a);
  }
  function rgbConvert(o) {
    if (!(o instanceof Color))
      o = color(o);
    if (!o)
      return new Rgb();
    o = o.rgb();
    return new Rgb(o.r, o.g, o.b, o.opacity);
  }
  function rgb(r, g, b, opacity) {
    return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
  }
  function Rgb(r, g, b, opacity) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
    this.opacity = +opacity;
  }
  function rgb_formatHex() {
    return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
  }
  function rgb_formatHex8() {
    return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
  }
  function rgb_formatRgb() {
    const a = clampa(this.opacity);
    return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
  }
  function clampa(opacity) {
    return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
  }
  function clampi(value) {
    return Math.max(0, Math.min(255, Math.round(value) || 0));
  }
  function hex(value) {
    value = clampi(value);
    return (value < 16 ? "0" : "") + value.toString(16);
  }
  function hsla(h, s, l, a) {
    if (a <= 0)
      h = s = l = NaN;
    else if (l <= 0 || l >= 1)
      h = s = NaN;
    else if (s <= 0)
      h = NaN;
    return new Hsl(h, s, l, a);
  }
  function hslConvert(o) {
    if (o instanceof Hsl)
      return new Hsl(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Color))
      o = color(o);
    if (!o)
      return new Hsl();
    if (o instanceof Hsl)
      return o;
    o = o.rgb();
    var r = o.r / 255, g = o.g / 255, b = o.b / 255, min4 = Math.min(r, g, b), max5 = Math.max(r, g, b), h = NaN, s = max5 - min4, l = (max5 + min4) / 2;
    if (s) {
      if (r === max5)
        h = (g - b) / s + (g < b) * 6;
      else if (g === max5)
        h = (b - r) / s + 2;
      else
        h = (r - g) / s + 4;
      s /= l < 0.5 ? max5 + min4 : 2 - max5 - min4;
      h *= 60;
    } else {
      s = l > 0 && l < 1 ? 0 : h;
    }
    return new Hsl(h, s, l, o.opacity);
  }
  function hsl(h, s, l, opacity) {
    return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
  }
  function Hsl(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }
  function clamph(value) {
    value = (value || 0) % 360;
    return value < 0 ? value + 360 : value;
  }
  function clampt(value) {
    return Math.max(0, Math.min(1, value || 0));
  }
  function hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
  }
  var darker, brighter, reI, reN, reP, reHex, reRgbInteger, reRgbPercent, reRgbaInteger, reRgbaPercent, reHslPercent, reHslaPercent, named;
  var init_color = __esm({
    "node_modules/d3-color/src/color.js"() {
      init_define();
      darker = 0.7;
      brighter = 1 / darker;
      reI = "\\s*([+-]?\\d+)\\s*";
      reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*";
      reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
      reHex = /^#([0-9a-f]{3,8})$/;
      reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`);
      reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`);
      reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`);
      reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`);
      reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`);
      reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);
      named = {
        aliceblue: 15792383,
        antiquewhite: 16444375,
        aqua: 65535,
        aquamarine: 8388564,
        azure: 15794175,
        beige: 16119260,
        bisque: 16770244,
        black: 0,
        blanchedalmond: 16772045,
        blue: 255,
        blueviolet: 9055202,
        brown: 10824234,
        burlywood: 14596231,
        cadetblue: 6266528,
        chartreuse: 8388352,
        chocolate: 13789470,
        coral: 16744272,
        cornflowerblue: 6591981,
        cornsilk: 16775388,
        crimson: 14423100,
        cyan: 65535,
        darkblue: 139,
        darkcyan: 35723,
        darkgoldenrod: 12092939,
        darkgray: 11119017,
        darkgreen: 25600,
        darkgrey: 11119017,
        darkkhaki: 12433259,
        darkmagenta: 9109643,
        darkolivegreen: 5597999,
        darkorange: 16747520,
        darkorchid: 10040012,
        darkred: 9109504,
        darksalmon: 15308410,
        darkseagreen: 9419919,
        darkslateblue: 4734347,
        darkslategray: 3100495,
        darkslategrey: 3100495,
        darkturquoise: 52945,
        darkviolet: 9699539,
        deeppink: 16716947,
        deepskyblue: 49151,
        dimgray: 6908265,
        dimgrey: 6908265,
        dodgerblue: 2003199,
        firebrick: 11674146,
        floralwhite: 16775920,
        forestgreen: 2263842,
        fuchsia: 16711935,
        gainsboro: 14474460,
        ghostwhite: 16316671,
        gold: 16766720,
        goldenrod: 14329120,
        gray: 8421504,
        green: 32768,
        greenyellow: 11403055,
        grey: 8421504,
        honeydew: 15794160,
        hotpink: 16738740,
        indianred: 13458524,
        indigo: 4915330,
        ivory: 16777200,
        khaki: 15787660,
        lavender: 15132410,
        lavenderblush: 16773365,
        lawngreen: 8190976,
        lemonchiffon: 16775885,
        lightblue: 11393254,
        lightcoral: 15761536,
        lightcyan: 14745599,
        lightgoldenrodyellow: 16448210,
        lightgray: 13882323,
        lightgreen: 9498256,
        lightgrey: 13882323,
        lightpink: 16758465,
        lightsalmon: 16752762,
        lightseagreen: 2142890,
        lightskyblue: 8900346,
        lightslategray: 7833753,
        lightslategrey: 7833753,
        lightsteelblue: 11584734,
        lightyellow: 16777184,
        lime: 65280,
        limegreen: 3329330,
        linen: 16445670,
        magenta: 16711935,
        maroon: 8388608,
        mediumaquamarine: 6737322,
        mediumblue: 205,
        mediumorchid: 12211667,
        mediumpurple: 9662683,
        mediumseagreen: 3978097,
        mediumslateblue: 8087790,
        mediumspringgreen: 64154,
        mediumturquoise: 4772300,
        mediumvioletred: 13047173,
        midnightblue: 1644912,
        mintcream: 16121850,
        mistyrose: 16770273,
        moccasin: 16770229,
        navajowhite: 16768685,
        navy: 128,
        oldlace: 16643558,
        olive: 8421376,
        olivedrab: 7048739,
        orange: 16753920,
        orangered: 16729344,
        orchid: 14315734,
        palegoldenrod: 15657130,
        palegreen: 10025880,
        paleturquoise: 11529966,
        palevioletred: 14381203,
        papayawhip: 16773077,
        peachpuff: 16767673,
        peru: 13468991,
        pink: 16761035,
        plum: 14524637,
        powderblue: 11591910,
        purple: 8388736,
        rebeccapurple: 6697881,
        red: 16711680,
        rosybrown: 12357519,
        royalblue: 4286945,
        saddlebrown: 9127187,
        salmon: 16416882,
        sandybrown: 16032864,
        seagreen: 3050327,
        seashell: 16774638,
        sienna: 10506797,
        silver: 12632256,
        skyblue: 8900331,
        slateblue: 6970061,
        slategray: 7372944,
        slategrey: 7372944,
        snow: 16775930,
        springgreen: 65407,
        steelblue: 4620980,
        tan: 13808780,
        teal: 32896,
        thistle: 14204888,
        tomato: 16737095,
        turquoise: 4251856,
        violet: 15631086,
        wheat: 16113331,
        white: 16777215,
        whitesmoke: 16119285,
        yellow: 16776960,
        yellowgreen: 10145074
      };
      define_default(Color, color, {
        copy(channels) {
          return Object.assign(new this.constructor(), this, channels);
        },
        displayable() {
          return this.rgb().displayable();
        },
        hex: color_formatHex,
        formatHex: color_formatHex,
        formatHex8: color_formatHex8,
        formatHsl: color_formatHsl,
        formatRgb: color_formatRgb,
        toString: color_formatRgb
      });
      define_default(Rgb, rgb, extend(Color, {
        brighter(k) {
          k = k == null ? brighter : Math.pow(brighter, k);
          return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
        },
        darker(k) {
          k = k == null ? darker : Math.pow(darker, k);
          return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
        },
        rgb() {
          return this;
        },
        clamp() {
          return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
        },
        displayable() {
          return -0.5 <= this.r && this.r < 255.5 && (-0.5 <= this.g && this.g < 255.5) && (-0.5 <= this.b && this.b < 255.5) && (0 <= this.opacity && this.opacity <= 1);
        },
        hex: rgb_formatHex,
        formatHex: rgb_formatHex,
        formatHex8: rgb_formatHex8,
        formatRgb: rgb_formatRgb,
        toString: rgb_formatRgb
      }));
      define_default(Hsl, hsl, extend(Color, {
        brighter(k) {
          k = k == null ? brighter : Math.pow(brighter, k);
          return new Hsl(this.h, this.s, this.l * k, this.opacity);
        },
        darker(k) {
          k = k == null ? darker : Math.pow(darker, k);
          return new Hsl(this.h, this.s, this.l * k, this.opacity);
        },
        rgb() {
          var h = this.h % 360 + (this.h < 0) * 360, s = isNaN(h) || isNaN(this.s) ? 0 : this.s, l = this.l, m2 = l + (l < 0.5 ? l : 1 - l) * s, m1 = 2 * l - m2;
          return new Rgb(
            hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
            hsl2rgb(h, m1, m2),
            hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
            this.opacity
          );
        },
        clamp() {
          return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
        },
        displayable() {
          return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && (0 <= this.l && this.l <= 1) && (0 <= this.opacity && this.opacity <= 1);
        },
        formatHsl() {
          const a = clampa(this.opacity);
          return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
        }
      }));
    }
  });

  // node_modules/d3-color/src/index.js
  var init_src7 = __esm({
    "node_modules/d3-color/src/index.js"() {
      init_color();
    }
  });

  // node_modules/d3-interpolate/src/basis.js
  function basis(t12, v0, v1, v2, v3) {
    var t2 = t12 * t12, t3 = t2 * t12;
    return ((1 - 3 * t12 + 3 * t2 - t3) * v0 + (4 - 6 * t2 + 3 * t3) * v1 + (1 + 3 * t12 + 3 * t2 - 3 * t3) * v2 + t3 * v3) / 6;
  }
  function basis_default(values) {
    var n = values.length - 1;
    return function(t) {
      var i2 = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n), v1 = values[i2], v2 = values[i2 + 1], v0 = i2 > 0 ? values[i2 - 1] : 2 * v1 - v2, v3 = i2 < n - 1 ? values[i2 + 2] : 2 * v2 - v1;
      return basis((t - i2 / n) * n, v0, v1, v2, v3);
    };
  }
  var init_basis = __esm({
    "node_modules/d3-interpolate/src/basis.js"() {
    }
  });

  // node_modules/d3-interpolate/src/basisClosed.js
  function basisClosed_default(values) {
    var n = values.length;
    return function(t) {
      var i2 = Math.floor(((t %= 1) < 0 ? ++t : t) * n), v0 = values[(i2 + n - 1) % n], v1 = values[i2 % n], v2 = values[(i2 + 1) % n], v3 = values[(i2 + 2) % n];
      return basis((t - i2 / n) * n, v0, v1, v2, v3);
    };
  }
  var init_basisClosed = __esm({
    "node_modules/d3-interpolate/src/basisClosed.js"() {
      init_basis();
    }
  });

  // node_modules/d3-interpolate/src/constant.js
  var constant_default2;
  var init_constant2 = __esm({
    "node_modules/d3-interpolate/src/constant.js"() {
      constant_default2 = (x2) => () => x2;
    }
  });

  // node_modules/d3-interpolate/src/color.js
  function linear(a, d) {
    return function(t) {
      return a + t * d;
    };
  }
  function exponential(a, b, y2) {
    return a = Math.pow(a, y2), b = Math.pow(b, y2) - a, y2 = 1 / y2, function(t) {
      return Math.pow(a + t * b, y2);
    };
  }
  function gamma(y2) {
    return (y2 = +y2) === 1 ? nogamma : function(a, b) {
      return b - a ? exponential(a, b, y2) : constant_default2(isNaN(a) ? b : a);
    };
  }
  function nogamma(a, b) {
    var d = b - a;
    return d ? linear(a, d) : constant_default2(isNaN(a) ? b : a);
  }
  var init_color2 = __esm({
    "node_modules/d3-interpolate/src/color.js"() {
      init_constant2();
    }
  });

  // node_modules/d3-interpolate/src/rgb.js
  function rgbSpline(spline) {
    return function(colors) {
      var n = colors.length, r = new Array(n), g = new Array(n), b = new Array(n), i2, color2;
      for (i2 = 0; i2 < n; ++i2) {
        color2 = rgb(colors[i2]);
        r[i2] = color2.r || 0;
        g[i2] = color2.g || 0;
        b[i2] = color2.b || 0;
      }
      r = spline(r);
      g = spline(g);
      b = spline(b);
      color2.opacity = 1;
      return function(t) {
        color2.r = r(t);
        color2.g = g(t);
        color2.b = b(t);
        return color2 + "";
      };
    };
  }
  var rgb_default, rgbBasis, rgbBasisClosed;
  var init_rgb = __esm({
    "node_modules/d3-interpolate/src/rgb.js"() {
      init_src7();
      init_basis();
      init_basisClosed();
      init_color2();
      rgb_default = function rgbGamma(y2) {
        var color2 = gamma(y2);
        function rgb2(start2, end) {
          var r = color2((start2 = rgb(start2)).r, (end = rgb(end)).r), g = color2(start2.g, end.g), b = color2(start2.b, end.b), opacity = nogamma(start2.opacity, end.opacity);
          return function(t) {
            start2.r = r(t);
            start2.g = g(t);
            start2.b = b(t);
            start2.opacity = opacity(t);
            return start2 + "";
          };
        }
        rgb2.gamma = rgbGamma;
        return rgb2;
      }(1);
      rgbBasis = rgbSpline(basis_default);
      rgbBasisClosed = rgbSpline(basisClosed_default);
    }
  });

  // node_modules/d3-interpolate/src/numberArray.js
  function numberArray_default(a, b) {
    if (!b)
      b = [];
    var n = a ? Math.min(b.length, a.length) : 0, c = b.slice(), i2;
    return function(t) {
      for (i2 = 0; i2 < n; ++i2)
        c[i2] = a[i2] * (1 - t) + b[i2] * t;
      return c;
    };
  }
  function isNumberArray(x2) {
    return ArrayBuffer.isView(x2) && !(x2 instanceof DataView);
  }
  var init_numberArray = __esm({
    "node_modules/d3-interpolate/src/numberArray.js"() {
    }
  });

  // node_modules/d3-interpolate/src/array.js
  function genericArray(a, b) {
    var nb = b ? b.length : 0, na = a ? Math.min(nb, a.length) : 0, x2 = new Array(na), c = new Array(nb), i2;
    for (i2 = 0; i2 < na; ++i2)
      x2[i2] = value_default(a[i2], b[i2]);
    for (; i2 < nb; ++i2)
      c[i2] = b[i2];
    return function(t) {
      for (i2 = 0; i2 < na; ++i2)
        c[i2] = x2[i2](t);
      return c;
    };
  }
  var init_array2 = __esm({
    "node_modules/d3-interpolate/src/array.js"() {
      init_value();
    }
  });

  // node_modules/d3-interpolate/src/date.js
  function date_default(a, b) {
    var d = new Date();
    return a = +a, b = +b, function(t) {
      return d.setTime(a * (1 - t) + b * t), d;
    };
  }
  var init_date = __esm({
    "node_modules/d3-interpolate/src/date.js"() {
    }
  });

  // node_modules/d3-interpolate/src/number.js
  function number_default(a, b) {
    return a = +a, b = +b, function(t) {
      return a * (1 - t) + b * t;
    };
  }
  var init_number2 = __esm({
    "node_modules/d3-interpolate/src/number.js"() {
    }
  });

  // node_modules/d3-interpolate/src/object.js
  function object_default(a, b) {
    var i2 = {}, c = {}, k;
    if (a === null || typeof a !== "object")
      a = {};
    if (b === null || typeof b !== "object")
      b = {};
    for (k in b) {
      if (k in a) {
        i2[k] = value_default(a[k], b[k]);
      } else {
        c[k] = b[k];
      }
    }
    return function(t) {
      for (k in i2)
        c[k] = i2[k](t);
      return c;
    };
  }
  var init_object = __esm({
    "node_modules/d3-interpolate/src/object.js"() {
      init_value();
    }
  });

  // node_modules/d3-interpolate/src/string.js
  function zero2(b) {
    return function() {
      return b;
    };
  }
  function one(b) {
    return function(t) {
      return b(t) + "";
    };
  }
  function string_default(a, b) {
    var bi = reA.lastIndex = reB.lastIndex = 0, am, bm, bs, i2 = -1, s = [], q = [];
    a = a + "", b = b + "";
    while ((am = reA.exec(a)) && (bm = reB.exec(b))) {
      if ((bs = bm.index) > bi) {
        bs = b.slice(bi, bs);
        if (s[i2])
          s[i2] += bs;
        else
          s[++i2] = bs;
      }
      if ((am = am[0]) === (bm = bm[0])) {
        if (s[i2])
          s[i2] += bm;
        else
          s[++i2] = bm;
      } else {
        s[++i2] = null;
        q.push({ i: i2, x: number_default(am, bm) });
      }
      bi = reB.lastIndex;
    }
    if (bi < b.length) {
      bs = b.slice(bi);
      if (s[i2])
        s[i2] += bs;
      else
        s[++i2] = bs;
    }
    return s.length < 2 ? q[0] ? one(q[0].x) : zero2(b) : (b = q.length, function(t) {
      for (var i3 = 0, o; i3 < b; ++i3)
        s[(o = q[i3]).i] = o.x(t);
      return s.join("");
    });
  }
  var reA, reB;
  var init_string = __esm({
    "node_modules/d3-interpolate/src/string.js"() {
      init_number2();
      reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
      reB = new RegExp(reA.source, "g");
    }
  });

  // node_modules/d3-interpolate/src/value.js
  function value_default(a, b) {
    var t = typeof b, c;
    return b == null || t === "boolean" ? constant_default2(b) : (t === "number" ? number_default : t === "string" ? (c = color(b)) ? (b = c, rgb_default) : string_default : b instanceof color ? rgb_default : b instanceof Date ? date_default : isNumberArray(b) ? numberArray_default : Array.isArray(b) ? genericArray : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object_default : number_default)(a, b);
  }
  var init_value = __esm({
    "node_modules/d3-interpolate/src/value.js"() {
      init_src7();
      init_rgb();
      init_array2();
      init_date();
      init_number2();
      init_object();
      init_string();
      init_constant2();
      init_numberArray();
    }
  });

  // node_modules/d3-interpolate/src/round.js
  function round_default(a, b) {
    return a = +a, b = +b, function(t) {
      return Math.round(a * (1 - t) + b * t);
    };
  }
  var init_round = __esm({
    "node_modules/d3-interpolate/src/round.js"() {
    }
  });

  // node_modules/d3-interpolate/src/transform/decompose.js
  function decompose_default(a, b, c, d, e, f) {
    var scaleX, scaleY, skewX;
    if (scaleX = Math.sqrt(a * a + b * b))
      a /= scaleX, b /= scaleX;
    if (skewX = a * c + b * d)
      c -= a * skewX, d -= b * skewX;
    if (scaleY = Math.sqrt(c * c + d * d))
      c /= scaleY, d /= scaleY, skewX /= scaleY;
    if (a * d < b * c)
      a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
    return {
      translateX: e,
      translateY: f,
      rotate: Math.atan2(b, a) * degrees,
      skewX: Math.atan(skewX) * degrees,
      scaleX,
      scaleY
    };
  }
  var degrees, identity;
  var init_decompose = __esm({
    "node_modules/d3-interpolate/src/transform/decompose.js"() {
      degrees = 180 / Math.PI;
      identity = {
        translateX: 0,
        translateY: 0,
        rotate: 0,
        skewX: 0,
        scaleX: 1,
        scaleY: 1
      };
    }
  });

  // node_modules/d3-interpolate/src/transform/parse.js
  function parseCss(value) {
    const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
    return m.isIdentity ? identity : decompose_default(m.a, m.b, m.c, m.d, m.e, m.f);
  }
  function parseSvg(value) {
    if (value == null)
      return identity;
    if (!svgNode)
      svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgNode.setAttribute("transform", value);
    if (!(value = svgNode.transform.baseVal.consolidate()))
      return identity;
    value = value.matrix;
    return decompose_default(value.a, value.b, value.c, value.d, value.e, value.f);
  }
  var svgNode;
  var init_parse = __esm({
    "node_modules/d3-interpolate/src/transform/parse.js"() {
      init_decompose();
    }
  });

  // node_modules/d3-interpolate/src/transform/index.js
  function interpolateTransform(parse, pxComma, pxParen, degParen) {
    function pop(s) {
      return s.length ? s.pop() + " " : "";
    }
    function translate(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i2 = s.push("translate(", null, pxComma, null, pxParen);
        q.push({ i: i2 - 4, x: number_default(xa, xb) }, { i: i2 - 2, x: number_default(ya, yb) });
      } else if (xb || yb) {
        s.push("translate(" + xb + pxComma + yb + pxParen);
      }
    }
    function rotate(a, b, s, q) {
      if (a !== b) {
        if (a - b > 180)
          b += 360;
        else if (b - a > 180)
          a += 360;
        q.push({ i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: number_default(a, b) });
      } else if (b) {
        s.push(pop(s) + "rotate(" + b + degParen);
      }
    }
    function skewX(a, b, s, q) {
      if (a !== b) {
        q.push({ i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: number_default(a, b) });
      } else if (b) {
        s.push(pop(s) + "skewX(" + b + degParen);
      }
    }
    function scale(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i2 = s.push(pop(s) + "scale(", null, ",", null, ")");
        q.push({ i: i2 - 4, x: number_default(xa, xb) }, { i: i2 - 2, x: number_default(ya, yb) });
      } else if (xb !== 1 || yb !== 1) {
        s.push(pop(s) + "scale(" + xb + "," + yb + ")");
      }
    }
    return function(a, b) {
      var s = [], q = [];
      a = parse(a), b = parse(b);
      translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
      rotate(a.rotate, b.rotate, s, q);
      skewX(a.skewX, b.skewX, s, q);
      scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
      a = b = null;
      return function(t) {
        var i2 = -1, n = q.length, o;
        while (++i2 < n)
          s[(o = q[i2]).i] = o.x(t);
        return s.join("");
      };
    };
  }
  var interpolateTransformCss, interpolateTransformSvg;
  var init_transform = __esm({
    "node_modules/d3-interpolate/src/transform/index.js"() {
      init_number2();
      init_parse();
      interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
      interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");
    }
  });

  // node_modules/d3-interpolate/src/index.js
  var init_src8 = __esm({
    "node_modules/d3-interpolate/src/index.js"() {
      init_value();
      init_number2();
      init_round();
      init_string();
      init_transform();
      init_rgb();
    }
  });

  // node_modules/d3-timer/src/timer.js
  function now() {
    return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
  }
  function clearNow() {
    clockNow = 0;
  }
  function Timer() {
    this._call = this._time = this._next = null;
  }
  function timer(callback, delay, time) {
    var t = new Timer();
    t.restart(callback, delay, time);
    return t;
  }
  function timerFlush() {
    now();
    ++frame;
    var t = taskHead, e;
    while (t) {
      if ((e = clockNow - t._time) >= 0)
        t._call.call(void 0, e);
      t = t._next;
    }
    --frame;
  }
  function wake() {
    clockNow = (clockLast = clock.now()) + clockSkew;
    frame = timeout = 0;
    try {
      timerFlush();
    } finally {
      frame = 0;
      nap();
      clockNow = 0;
    }
  }
  function poke() {
    var now2 = clock.now(), delay = now2 - clockLast;
    if (delay > pokeDelay)
      clockSkew -= delay, clockLast = now2;
  }
  function nap() {
    var t02, t12 = taskHead, t2, time = Infinity;
    while (t12) {
      if (t12._call) {
        if (time > t12._time)
          time = t12._time;
        t02 = t12, t12 = t12._next;
      } else {
        t2 = t12._next, t12._next = null;
        t12 = t02 ? t02._next = t2 : taskHead = t2;
      }
    }
    taskTail = t02;
    sleep(time);
  }
  function sleep(time) {
    if (frame)
      return;
    if (timeout)
      timeout = clearTimeout(timeout);
    var delay = time - clockNow;
    if (delay > 24) {
      if (time < Infinity)
        timeout = setTimeout(wake, time - clock.now() - clockSkew);
      if (interval)
        interval = clearInterval(interval);
    } else {
      if (!interval)
        clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
      frame = 1, setFrame(wake);
    }
  }
  var frame, timeout, interval, pokeDelay, taskHead, taskTail, clockLast, clockNow, clockSkew, clock, setFrame;
  var init_timer = __esm({
    "node_modules/d3-timer/src/timer.js"() {
      frame = 0;
      timeout = 0;
      interval = 0;
      pokeDelay = 1e3;
      clockLast = 0;
      clockNow = 0;
      clockSkew = 0;
      clock = typeof performance === "object" && performance.now ? performance : Date;
      setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) {
        setTimeout(f, 17);
      };
      Timer.prototype = timer.prototype = {
        constructor: Timer,
        restart: function(callback, delay, time) {
          if (typeof callback !== "function")
            throw new TypeError("callback is not a function");
          time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
          if (!this._next && taskTail !== this) {
            if (taskTail)
              taskTail._next = this;
            else
              taskHead = this;
            taskTail = this;
          }
          this._call = callback;
          this._time = time;
          sleep();
        },
        stop: function() {
          if (this._call) {
            this._call = null;
            this._time = Infinity;
            sleep();
          }
        }
      };
    }
  });

  // node_modules/d3-timer/src/timeout.js
  function timeout_default(callback, delay, time) {
    var t = new Timer();
    delay = delay == null ? 0 : +delay;
    t.restart((elapsed) => {
      t.stop();
      callback(elapsed + delay);
    }, delay, time);
    return t;
  }
  var init_timeout = __esm({
    "node_modules/d3-timer/src/timeout.js"() {
      init_timer();
    }
  });

  // node_modules/d3-timer/src/index.js
  var init_src9 = __esm({
    "node_modules/d3-timer/src/index.js"() {
      init_timer();
      init_timeout();
    }
  });

  // node_modules/d3-transition/src/transition/schedule.js
  function schedule_default(node, name, id2, index, group, timing) {
    var schedules = node.__transition;
    if (!schedules)
      node.__transition = {};
    else if (id2 in schedules)
      return;
    create(node, id2, {
      name,
      index,
      group,
      on: emptyOn,
      tween: emptyTween,
      time: timing.time,
      delay: timing.delay,
      duration: timing.duration,
      ease: timing.ease,
      timer: null,
      state: CREATED
    });
  }
  function init(node, id2) {
    var schedule = get2(node, id2);
    if (schedule.state > CREATED)
      throw new Error("too late; already scheduled");
    return schedule;
  }
  function set2(node, id2) {
    var schedule = get2(node, id2);
    if (schedule.state > STARTED)
      throw new Error("too late; already running");
    return schedule;
  }
  function get2(node, id2) {
    var schedule = node.__transition;
    if (!schedule || !(schedule = schedule[id2]))
      throw new Error("transition not found");
    return schedule;
  }
  function create(node, id2, self) {
    var schedules = node.__transition, tween;
    schedules[id2] = self;
    self.timer = timer(schedule, 0, self.time);
    function schedule(elapsed) {
      self.state = SCHEDULED;
      self.timer.restart(start2, self.delay, self.time);
      if (self.delay <= elapsed)
        start2(elapsed - self.delay);
    }
    function start2(elapsed) {
      var i2, j2, n, o;
      if (self.state !== SCHEDULED)
        return stop();
      for (i2 in schedules) {
        o = schedules[i2];
        if (o.name !== self.name)
          continue;
        if (o.state === STARTED)
          return timeout_default(start2);
        if (o.state === RUNNING) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("interrupt", node, node.__data__, o.index, o.group);
          delete schedules[i2];
        } else if (+i2 < id2) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("cancel", node, node.__data__, o.index, o.group);
          delete schedules[i2];
        }
      }
      timeout_default(function() {
        if (self.state === STARTED) {
          self.state = RUNNING;
          self.timer.restart(tick, self.delay, self.time);
          tick(elapsed);
        }
      });
      self.state = STARTING;
      self.on.call("start", node, node.__data__, self.index, self.group);
      if (self.state !== STARTING)
        return;
      self.state = STARTED;
      tween = new Array(n = self.tween.length);
      for (i2 = 0, j2 = -1; i2 < n; ++i2) {
        if (o = self.tween[i2].value.call(node, node.__data__, self.index, self.group)) {
          tween[++j2] = o;
        }
      }
      tween.length = j2 + 1;
    }
    function tick(elapsed) {
      var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1), i2 = -1, n = tween.length;
      while (++i2 < n) {
        tween[i2].call(node, t);
      }
      if (self.state === ENDING) {
        self.on.call("end", node, node.__data__, self.index, self.group);
        stop();
      }
    }
    function stop() {
      self.state = ENDED;
      self.timer.stop();
      delete schedules[id2];
      for (var i2 in schedules)
        return;
      delete node.__transition;
    }
  }
  var emptyOn, emptyTween, CREATED, SCHEDULED, STARTING, STARTED, RUNNING, ENDING, ENDED;
  var init_schedule = __esm({
    "node_modules/d3-transition/src/transition/schedule.js"() {
      init_src4();
      init_src9();
      emptyOn = dispatch_default("start", "end", "cancel", "interrupt");
      emptyTween = [];
      CREATED = 0;
      SCHEDULED = 1;
      STARTING = 2;
      STARTED = 3;
      RUNNING = 4;
      ENDING = 5;
      ENDED = 6;
    }
  });

  // node_modules/d3-transition/src/interrupt.js
  function interrupt_default(node, name) {
    var schedules = node.__transition, schedule, active, empty2 = true, i2;
    if (!schedules)
      return;
    name = name == null ? null : name + "";
    for (i2 in schedules) {
      if ((schedule = schedules[i2]).name !== name) {
        empty2 = false;
        continue;
      }
      active = schedule.state > STARTING && schedule.state < ENDING;
      schedule.state = ENDED;
      schedule.timer.stop();
      schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
      delete schedules[i2];
    }
    if (empty2)
      delete node.__transition;
  }
  var init_interrupt = __esm({
    "node_modules/d3-transition/src/interrupt.js"() {
      init_schedule();
    }
  });

  // node_modules/d3-transition/src/selection/interrupt.js
  function interrupt_default2(name) {
    return this.each(function() {
      interrupt_default(this, name);
    });
  }
  var init_interrupt2 = __esm({
    "node_modules/d3-transition/src/selection/interrupt.js"() {
      init_interrupt();
    }
  });

  // node_modules/d3-transition/src/transition/tween.js
  function tweenRemove(id2, name) {
    var tween0, tween1;
    return function() {
      var schedule = set2(this, id2), tween = schedule.tween;
      if (tween !== tween0) {
        tween1 = tween0 = tween;
        for (var i2 = 0, n = tween1.length; i2 < n; ++i2) {
          if (tween1[i2].name === name) {
            tween1 = tween1.slice();
            tween1.splice(i2, 1);
            break;
          }
        }
      }
      schedule.tween = tween1;
    };
  }
  function tweenFunction(id2, name, value) {
    var tween0, tween1;
    if (typeof value !== "function")
      throw new Error();
    return function() {
      var schedule = set2(this, id2), tween = schedule.tween;
      if (tween !== tween0) {
        tween1 = (tween0 = tween).slice();
        for (var t = { name, value }, i2 = 0, n = tween1.length; i2 < n; ++i2) {
          if (tween1[i2].name === name) {
            tween1[i2] = t;
            break;
          }
        }
        if (i2 === n)
          tween1.push(t);
      }
      schedule.tween = tween1;
    };
  }
  function tween_default(name, value) {
    var id2 = this._id;
    name += "";
    if (arguments.length < 2) {
      var tween = get2(this.node(), id2).tween;
      for (var i2 = 0, n = tween.length, t; i2 < n; ++i2) {
        if ((t = tween[i2]).name === name) {
          return t.value;
        }
      }
      return null;
    }
    return this.each((value == null ? tweenRemove : tweenFunction)(id2, name, value));
  }
  function tweenValue(transition2, name, value) {
    var id2 = transition2._id;
    transition2.each(function() {
      var schedule = set2(this, id2);
      (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
    });
    return function(node) {
      return get2(node, id2).value[name];
    };
  }
  var init_tween = __esm({
    "node_modules/d3-transition/src/transition/tween.js"() {
      init_schedule();
    }
  });

  // node_modules/d3-transition/src/transition/interpolate.js
  function interpolate_default(a, b) {
    var c;
    return (typeof b === "number" ? number_default : b instanceof color ? rgb_default : (c = color(b)) ? (b = c, rgb_default) : string_default)(a, b);
  }
  var init_interpolate = __esm({
    "node_modules/d3-transition/src/transition/interpolate.js"() {
      init_src7();
      init_src8();
    }
  });

  // node_modules/d3-transition/src/transition/attr.js
  function attrRemove2(name) {
    return function() {
      this.removeAttribute(name);
    };
  }
  function attrRemoveNS2(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }
  function attrConstant2(name, interpolate, value1) {
    var string00, string1 = value1 + "", interpolate0;
    return function() {
      var string0 = this.getAttribute(name);
      return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
    };
  }
  function attrConstantNS2(fullname, interpolate, value1) {
    var string00, string1 = value1 + "", interpolate0;
    return function() {
      var string0 = this.getAttributeNS(fullname.space, fullname.local);
      return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
    };
  }
  function attrFunction2(name, interpolate, value) {
    var string00, string10, interpolate0;
    return function() {
      var string0, value1 = value(this), string1;
      if (value1 == null)
        return void this.removeAttribute(name);
      string0 = this.getAttribute(name);
      string1 = value1 + "";
      return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }
  function attrFunctionNS2(fullname, interpolate, value) {
    var string00, string10, interpolate0;
    return function() {
      var string0, value1 = value(this), string1;
      if (value1 == null)
        return void this.removeAttributeNS(fullname.space, fullname.local);
      string0 = this.getAttributeNS(fullname.space, fullname.local);
      string1 = value1 + "";
      return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }
  function attr_default2(name, value) {
    var fullname = namespace_default(name), i2 = fullname === "transform" ? interpolateTransformSvg : interpolate_default;
    return this.attrTween(name, typeof value === "function" ? (fullname.local ? attrFunctionNS2 : attrFunction2)(fullname, i2, tweenValue(this, "attr." + name, value)) : value == null ? (fullname.local ? attrRemoveNS2 : attrRemove2)(fullname) : (fullname.local ? attrConstantNS2 : attrConstant2)(fullname, i2, value));
  }
  var init_attr2 = __esm({
    "node_modules/d3-transition/src/transition/attr.js"() {
      init_src8();
      init_src5();
      init_tween();
      init_interpolate();
    }
  });

  // node_modules/d3-transition/src/transition/attrTween.js
  function attrInterpolate(name, i2) {
    return function(t) {
      this.setAttribute(name, i2.call(this, t));
    };
  }
  function attrInterpolateNS(fullname, i2) {
    return function(t) {
      this.setAttributeNS(fullname.space, fullname.local, i2.call(this, t));
    };
  }
  function attrTweenNS(fullname, value) {
    var t02, i0;
    function tween() {
      var i2 = value.apply(this, arguments);
      if (i2 !== i0)
        t02 = (i0 = i2) && attrInterpolateNS(fullname, i2);
      return t02;
    }
    tween._value = value;
    return tween;
  }
  function attrTween(name, value) {
    var t02, i0;
    function tween() {
      var i2 = value.apply(this, arguments);
      if (i2 !== i0)
        t02 = (i0 = i2) && attrInterpolate(name, i2);
      return t02;
    }
    tween._value = value;
    return tween;
  }
  function attrTween_default(name, value) {
    var key = "attr." + name;
    if (arguments.length < 2)
      return (key = this.tween(key)) && key._value;
    if (value == null)
      return this.tween(key, null);
    if (typeof value !== "function")
      throw new Error();
    var fullname = namespace_default(name);
    return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
  }
  var init_attrTween = __esm({
    "node_modules/d3-transition/src/transition/attrTween.js"() {
      init_src5();
    }
  });

  // node_modules/d3-transition/src/transition/delay.js
  function delayFunction(id2, value) {
    return function() {
      init(this, id2).delay = +value.apply(this, arguments);
    };
  }
  function delayConstant(id2, value) {
    return value = +value, function() {
      init(this, id2).delay = value;
    };
  }
  function delay_default(value) {
    var id2 = this._id;
    return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id2, value)) : get2(this.node(), id2).delay;
  }
  var init_delay = __esm({
    "node_modules/d3-transition/src/transition/delay.js"() {
      init_schedule();
    }
  });

  // node_modules/d3-transition/src/transition/duration.js
  function durationFunction(id2, value) {
    return function() {
      set2(this, id2).duration = +value.apply(this, arguments);
    };
  }
  function durationConstant(id2, value) {
    return value = +value, function() {
      set2(this, id2).duration = value;
    };
  }
  function duration_default(value) {
    var id2 = this._id;
    return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id2, value)) : get2(this.node(), id2).duration;
  }
  var init_duration = __esm({
    "node_modules/d3-transition/src/transition/duration.js"() {
      init_schedule();
    }
  });

  // node_modules/d3-transition/src/transition/ease.js
  function easeConstant(id2, value) {
    if (typeof value !== "function")
      throw new Error();
    return function() {
      set2(this, id2).ease = value;
    };
  }
  function ease_default(value) {
    var id2 = this._id;
    return arguments.length ? this.each(easeConstant(id2, value)) : get2(this.node(), id2).ease;
  }
  var init_ease = __esm({
    "node_modules/d3-transition/src/transition/ease.js"() {
      init_schedule();
    }
  });

  // node_modules/d3-transition/src/transition/easeVarying.js
  function easeVarying(id2, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (typeof v !== "function")
        throw new Error();
      set2(this, id2).ease = v;
    };
  }
  function easeVarying_default(value) {
    if (typeof value !== "function")
      throw new Error();
    return this.each(easeVarying(this._id, value));
  }
  var init_easeVarying = __esm({
    "node_modules/d3-transition/src/transition/easeVarying.js"() {
      init_schedule();
    }
  });

  // node_modules/d3-transition/src/transition/filter.js
  function filter_default2(match) {
    if (typeof match !== "function")
      match = matcher_default(match);
    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j2 = 0; j2 < m; ++j2) {
      for (var group = groups[j2], n = group.length, subgroup = subgroups[j2] = [], node, i2 = 0; i2 < n; ++i2) {
        if ((node = group[i2]) && match.call(node, node.__data__, i2, group)) {
          subgroup.push(node);
        }
      }
    }
    return new Transition(subgroups, this._parents, this._name, this._id);
  }
  var init_filter2 = __esm({
    "node_modules/d3-transition/src/transition/filter.js"() {
      init_src5();
      init_transition2();
    }
  });

  // node_modules/d3-transition/src/transition/merge.js
  function merge_default2(transition2) {
    if (transition2._id !== this._id)
      throw new Error();
    for (var groups0 = this._groups, groups1 = transition2._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j2 = 0; j2 < m; ++j2) {
      for (var group0 = groups0[j2], group1 = groups1[j2], n = group0.length, merge = merges[j2] = new Array(n), node, i2 = 0; i2 < n; ++i2) {
        if (node = group0[i2] || group1[i2]) {
          merge[i2] = node;
        }
      }
    }
    for (; j2 < m0; ++j2) {
      merges[j2] = groups0[j2];
    }
    return new Transition(merges, this._parents, this._name, this._id);
  }
  var init_merge2 = __esm({
    "node_modules/d3-transition/src/transition/merge.js"() {
      init_transition2();
    }
  });

  // node_modules/d3-transition/src/transition/on.js
  function start(name) {
    return (name + "").trim().split(/^|\s+/).every(function(t) {
      var i2 = t.indexOf(".");
      if (i2 >= 0)
        t = t.slice(0, i2);
      return !t || t === "start";
    });
  }
  function onFunction(id2, name, listener) {
    var on0, on1, sit = start(name) ? init : set2;
    return function() {
      var schedule = sit(this, id2), on = schedule.on;
      if (on !== on0)
        (on1 = (on0 = on).copy()).on(name, listener);
      schedule.on = on1;
    };
  }
  function on_default2(name, listener) {
    var id2 = this._id;
    return arguments.length < 2 ? get2(this.node(), id2).on.on(name) : this.each(onFunction(id2, name, listener));
  }
  var init_on2 = __esm({
    "node_modules/d3-transition/src/transition/on.js"() {
      init_schedule();
    }
  });

  // node_modules/d3-transition/src/transition/remove.js
  function removeFunction(id2) {
    return function() {
      var parent = this.parentNode;
      for (var i2 in this.__transition)
        if (+i2 !== id2)
          return;
      if (parent)
        parent.removeChild(this);
    };
  }
  function remove_default2() {
    return this.on("end.remove", removeFunction(this._id));
  }
  var init_remove2 = __esm({
    "node_modules/d3-transition/src/transition/remove.js"() {
    }
  });

  // node_modules/d3-transition/src/transition/select.js
  function select_default3(select) {
    var name = this._name, id2 = this._id;
    if (typeof select !== "function")
      select = selector_default(select);
    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j2 = 0; j2 < m; ++j2) {
      for (var group = groups[j2], n = group.length, subgroup = subgroups[j2] = new Array(n), node, subnode, i2 = 0; i2 < n; ++i2) {
        if ((node = group[i2]) && (subnode = select.call(node, node.__data__, i2, group))) {
          if ("__data__" in node)
            subnode.__data__ = node.__data__;
          subgroup[i2] = subnode;
          schedule_default(subgroup[i2], name, id2, i2, subgroup, get2(node, id2));
        }
      }
    }
    return new Transition(subgroups, this._parents, name, id2);
  }
  var init_select4 = __esm({
    "node_modules/d3-transition/src/transition/select.js"() {
      init_src5();
      init_transition2();
      init_schedule();
    }
  });

  // node_modules/d3-transition/src/transition/selectAll.js
  function selectAll_default3(select) {
    var name = this._name, id2 = this._id;
    if (typeof select !== "function")
      select = selectorAll_default(select);
    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j2 = 0; j2 < m; ++j2) {
      for (var group = groups[j2], n = group.length, node, i2 = 0; i2 < n; ++i2) {
        if (node = group[i2]) {
          for (var children2 = select.call(node, node.__data__, i2, group), child, inherit2 = get2(node, id2), k = 0, l = children2.length; k < l; ++k) {
            if (child = children2[k]) {
              schedule_default(child, name, id2, k, children2, inherit2);
            }
          }
          subgroups.push(children2);
          parents.push(node);
        }
      }
    }
    return new Transition(subgroups, parents, name, id2);
  }
  var init_selectAll3 = __esm({
    "node_modules/d3-transition/src/transition/selectAll.js"() {
      init_src5();
      init_transition2();
      init_schedule();
    }
  });

  // node_modules/d3-transition/src/transition/selection.js
  function selection_default2() {
    return new Selection2(this._groups, this._parents);
  }
  var Selection2;
  var init_selection2 = __esm({
    "node_modules/d3-transition/src/transition/selection.js"() {
      init_src5();
      Selection2 = selection_default.prototype.constructor;
    }
  });

  // node_modules/d3-transition/src/transition/style.js
  function styleNull(name, interpolate) {
    var string00, string10, interpolate0;
    return function() {
      var string0 = styleValue(this, name), string1 = (this.style.removeProperty(name), styleValue(this, name));
      return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = interpolate(string00 = string0, string10 = string1);
    };
  }
  function styleRemove2(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }
  function styleConstant2(name, interpolate, value1) {
    var string00, string1 = value1 + "", interpolate0;
    return function() {
      var string0 = styleValue(this, name);
      return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
    };
  }
  function styleFunction2(name, interpolate, value) {
    var string00, string10, interpolate0;
    return function() {
      var string0 = styleValue(this, name), value1 = value(this), string1 = value1 + "";
      if (value1 == null)
        string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
      return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }
  function styleMaybeRemove(id2, name) {
    var on0, on1, listener0, key = "style." + name, event = "end." + key, remove2;
    return function() {
      var schedule = set2(this, id2), on = schedule.on, listener = schedule.value[key] == null ? remove2 || (remove2 = styleRemove2(name)) : void 0;
      if (on !== on0 || listener0 !== listener)
        (on1 = (on0 = on).copy()).on(event, listener0 = listener);
      schedule.on = on1;
    };
  }
  function style_default2(name, value, priority) {
    var i2 = (name += "") === "transform" ? interpolateTransformCss : interpolate_default;
    return value == null ? this.styleTween(name, styleNull(name, i2)).on("end.style." + name, styleRemove2(name)) : typeof value === "function" ? this.styleTween(name, styleFunction2(name, i2, tweenValue(this, "style." + name, value))).each(styleMaybeRemove(this._id, name)) : this.styleTween(name, styleConstant2(name, i2, value), priority).on("end.style." + name, null);
  }
  var init_style2 = __esm({
    "node_modules/d3-transition/src/transition/style.js"() {
      init_src8();
      init_src5();
      init_schedule();
      init_tween();
      init_interpolate();
    }
  });

  // node_modules/d3-transition/src/transition/styleTween.js
  function styleInterpolate(name, i2, priority) {
    return function(t) {
      this.style.setProperty(name, i2.call(this, t), priority);
    };
  }
  function styleTween(name, value, priority) {
    var t, i0;
    function tween() {
      var i2 = value.apply(this, arguments);
      if (i2 !== i0)
        t = (i0 = i2) && styleInterpolate(name, i2, priority);
      return t;
    }
    tween._value = value;
    return tween;
  }
  function styleTween_default(name, value, priority) {
    var key = "style." + (name += "");
    if (arguments.length < 2)
      return (key = this.tween(key)) && key._value;
    if (value == null)
      return this.tween(key, null);
    if (typeof value !== "function")
      throw new Error();
    return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
  }
  var init_styleTween = __esm({
    "node_modules/d3-transition/src/transition/styleTween.js"() {
    }
  });

  // node_modules/d3-transition/src/transition/text.js
  function textConstant2(value) {
    return function() {
      this.textContent = value;
    };
  }
  function textFunction2(value) {
    return function() {
      var value1 = value(this);
      this.textContent = value1 == null ? "" : value1;
    };
  }
  function text_default2(value) {
    return this.tween("text", typeof value === "function" ? textFunction2(tweenValue(this, "text", value)) : textConstant2(value == null ? "" : value + ""));
  }
  var init_text2 = __esm({
    "node_modules/d3-transition/src/transition/text.js"() {
      init_tween();
    }
  });

  // node_modules/d3-transition/src/transition/textTween.js
  function textInterpolate(i2) {
    return function(t) {
      this.textContent = i2.call(this, t);
    };
  }
  function textTween(value) {
    var t02, i0;
    function tween() {
      var i2 = value.apply(this, arguments);
      if (i2 !== i0)
        t02 = (i0 = i2) && textInterpolate(i2);
      return t02;
    }
    tween._value = value;
    return tween;
  }
  function textTween_default(value) {
    var key = "text";
    if (arguments.length < 1)
      return (key = this.tween(key)) && key._value;
    if (value == null)
      return this.tween(key, null);
    if (typeof value !== "function")
      throw new Error();
    return this.tween(key, textTween(value));
  }
  var init_textTween = __esm({
    "node_modules/d3-transition/src/transition/textTween.js"() {
    }
  });

  // node_modules/d3-transition/src/transition/transition.js
  function transition_default() {
    var name = this._name, id0 = this._id, id1 = newId();
    for (var groups = this._groups, m = groups.length, j2 = 0; j2 < m; ++j2) {
      for (var group = groups[j2], n = group.length, node, i2 = 0; i2 < n; ++i2) {
        if (node = group[i2]) {
          var inherit2 = get2(node, id0);
          schedule_default(node, name, id1, i2, group, {
            time: inherit2.time + inherit2.delay + inherit2.duration,
            delay: 0,
            duration: inherit2.duration,
            ease: inherit2.ease
          });
        }
      }
    }
    return new Transition(groups, this._parents, name, id1);
  }
  var init_transition = __esm({
    "node_modules/d3-transition/src/transition/transition.js"() {
      init_transition2();
      init_schedule();
    }
  });

  // node_modules/d3-transition/src/transition/end.js
  function end_default() {
    var on0, on1, that = this, id2 = that._id, size = that.size();
    return new Promise(function(resolve, reject) {
      var cancel = { value: reject }, end = { value: function() {
        if (--size === 0)
          resolve();
      } };
      that.each(function() {
        var schedule = set2(this, id2), on = schedule.on;
        if (on !== on0) {
          on1 = (on0 = on).copy();
          on1._.cancel.push(cancel);
          on1._.interrupt.push(cancel);
          on1._.end.push(end);
        }
        schedule.on = on1;
      });
      if (size === 0)
        resolve();
    });
  }
  var init_end = __esm({
    "node_modules/d3-transition/src/transition/end.js"() {
      init_schedule();
    }
  });

  // node_modules/d3-transition/src/transition/index.js
  function Transition(groups, parents, name, id2) {
    this._groups = groups;
    this._parents = parents;
    this._name = name;
    this._id = id2;
  }
  function transition(name) {
    return selection_default().transition(name);
  }
  function newId() {
    return ++id;
  }
  var id, selection_prototype;
  var init_transition2 = __esm({
    "node_modules/d3-transition/src/transition/index.js"() {
      init_src5();
      init_attr2();
      init_attrTween();
      init_delay();
      init_duration();
      init_ease();
      init_easeVarying();
      init_filter2();
      init_merge2();
      init_on2();
      init_remove2();
      init_select4();
      init_selectAll3();
      init_selection2();
      init_style2();
      init_styleTween();
      init_text2();
      init_textTween();
      init_transition();
      init_tween();
      init_end();
      id = 0;
      selection_prototype = selection_default.prototype;
      Transition.prototype = transition.prototype = {
        constructor: Transition,
        select: select_default3,
        selectAll: selectAll_default3,
        selectChild: selection_prototype.selectChild,
        selectChildren: selection_prototype.selectChildren,
        filter: filter_default2,
        merge: merge_default2,
        selection: selection_default2,
        transition: transition_default,
        call: selection_prototype.call,
        nodes: selection_prototype.nodes,
        node: selection_prototype.node,
        size: selection_prototype.size,
        empty: selection_prototype.empty,
        each: selection_prototype.each,
        on: on_default2,
        attr: attr_default2,
        attrTween: attrTween_default,
        style: style_default2,
        styleTween: styleTween_default,
        text: text_default2,
        textTween: textTween_default,
        remove: remove_default2,
        tween: tween_default,
        delay: delay_default,
        duration: duration_default,
        ease: ease_default,
        easeVarying: easeVarying_default,
        end: end_default,
        [Symbol.iterator]: selection_prototype[Symbol.iterator]
      };
    }
  });

  // node_modules/d3-ease/src/linear.js
  var linear2;
  var init_linear = __esm({
    "node_modules/d3-ease/src/linear.js"() {
      linear2 = (t) => +t;
    }
  });

  // node_modules/d3-ease/src/cubic.js
  function cubicInOut(t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
  }
  var init_cubic = __esm({
    "node_modules/d3-ease/src/cubic.js"() {
    }
  });

  // node_modules/d3-ease/src/index.js
  var init_src10 = __esm({
    "node_modules/d3-ease/src/index.js"() {
      init_linear();
      init_cubic();
    }
  });

  // node_modules/d3-transition/src/selection/transition.js
  function inherit(node, id2) {
    var timing;
    while (!(timing = node.__transition) || !(timing = timing[id2])) {
      if (!(node = node.parentNode)) {
        throw new Error(`transition ${id2} not found`);
      }
    }
    return timing;
  }
  function transition_default2(name) {
    var id2, timing;
    if (name instanceof Transition) {
      id2 = name._id, name = name._name;
    } else {
      id2 = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
    }
    for (var groups = this._groups, m = groups.length, j2 = 0; j2 < m; ++j2) {
      for (var group = groups[j2], n = group.length, node, i2 = 0; i2 < n; ++i2) {
        if (node = group[i2]) {
          schedule_default(node, name, id2, i2, group, timing || inherit(node, id2));
        }
      }
    }
    return new Transition(groups, this._parents, name, id2);
  }
  var defaultTiming;
  var init_transition3 = __esm({
    "node_modules/d3-transition/src/selection/transition.js"() {
      init_transition2();
      init_schedule();
      init_src10();
      init_src9();
      defaultTiming = {
        time: null,
        delay: 0,
        duration: 250,
        ease: cubicInOut
      };
    }
  });

  // node_modules/d3-transition/src/selection/index.js
  var init_selection3 = __esm({
    "node_modules/d3-transition/src/selection/index.js"() {
      init_src5();
      init_interrupt2();
      init_transition3();
      selection_default.prototype.interrupt = interrupt_default2;
      selection_default.prototype.transition = transition_default2;
    }
  });

  // node_modules/d3-transition/src/index.js
  var init_src11 = __esm({
    "node_modules/d3-transition/src/index.js"() {
      init_selection3();
    }
  });

  // node_modules/d3-brush/src/constant.js
  var init_constant3 = __esm({
    "node_modules/d3-brush/src/constant.js"() {
    }
  });

  // node_modules/d3-brush/src/event.js
  var init_event = __esm({
    "node_modules/d3-brush/src/event.js"() {
    }
  });

  // node_modules/d3-brush/src/noevent.js
  var init_noevent = __esm({
    "node_modules/d3-brush/src/noevent.js"() {
    }
  });

  // node_modules/d3-brush/src/brush.js
  function number1(e) {
    return [+e[0], +e[1]];
  }
  function number22(e) {
    return [number1(e[0]), number1(e[1])];
  }
  function type(t) {
    return { type: t };
  }
  var abs, max2, min2, X, Y, XY;
  var init_brush = __esm({
    "node_modules/d3-brush/src/brush.js"() {
      init_src11();
      init_constant3();
      init_event();
      init_noevent();
      ({ abs, max: max2, min: min2 } = Math);
      X = {
        name: "x",
        handles: ["w", "e"].map(type),
        input: function(x2, e) {
          return x2 == null ? null : [[+x2[0], e[0][1]], [+x2[1], e[1][1]]];
        },
        output: function(xy) {
          return xy && [xy[0][0], xy[1][0]];
        }
      };
      Y = {
        name: "y",
        handles: ["n", "s"].map(type),
        input: function(y2, e) {
          return y2 == null ? null : [[e[0][0], +y2[0]], [e[1][0], +y2[1]]];
        },
        output: function(xy) {
          return xy && [xy[0][1], xy[1][1]];
        }
      };
      XY = {
        name: "xy",
        handles: ["n", "w", "e", "s", "nw", "ne", "sw", "se"].map(type),
        input: function(xy) {
          return xy == null ? null : number22(xy);
        },
        output: function(xy) {
          return xy;
        }
      };
    }
  });

  // node_modules/d3-brush/src/index.js
  var init_src12 = __esm({
    "node_modules/d3-brush/src/index.js"() {
      init_brush();
    }
  });

  // node_modules/d3-chord/src/math.js
  var abs2, cos, sin, pi, halfPi, tau, max3, epsilon2;
  var init_math = __esm({
    "node_modules/d3-chord/src/math.js"() {
      abs2 = Math.abs;
      cos = Math.cos;
      sin = Math.sin;
      pi = Math.PI;
      halfPi = pi / 2;
      tau = pi * 2;
      max3 = Math.max;
      epsilon2 = 1e-12;
    }
  });

  // node_modules/d3-chord/src/chord.js
  function range2(i2, j2) {
    return Array.from({ length: j2 - i2 }, (_, k) => i2 + k);
  }
  function compareValue(compare) {
    return function(a, b) {
      return compare(
        a.source.value + a.target.value,
        b.source.value + b.target.value
      );
    };
  }
  function chord_default() {
    return chord(false, false);
  }
  function chord(directed, transpose) {
    var padAngle = 0, sortGroups = null, sortSubgroups = null, sortChords = null;
    function chord2(matrix) {
      var n = matrix.length, groupSums = new Array(n), groupIndex = range2(0, n), chords = new Array(n * n), groups = new Array(n), k = 0, dx;
      matrix = Float64Array.from({ length: n * n }, transpose ? (_, i2) => matrix[i2 % n][i2 / n | 0] : (_, i2) => matrix[i2 / n | 0][i2 % n]);
      for (let i2 = 0; i2 < n; ++i2) {
        let x2 = 0;
        for (let j2 = 0; j2 < n; ++j2)
          x2 += matrix[i2 * n + j2] + directed * matrix[j2 * n + i2];
        k += groupSums[i2] = x2;
      }
      k = max3(0, tau - padAngle * n) / k;
      dx = k ? padAngle : tau / n;
      {
        let x2 = 0;
        if (sortGroups)
          groupIndex.sort((a, b) => sortGroups(groupSums[a], groupSums[b]));
        for (const i2 of groupIndex) {
          const x0 = x2;
          if (directed) {
            const subgroupIndex = range2(~n + 1, n).filter((j2) => j2 < 0 ? matrix[~j2 * n + i2] : matrix[i2 * n + j2]);
            if (sortSubgroups)
              subgroupIndex.sort((a, b) => sortSubgroups(a < 0 ? -matrix[~a * n + i2] : matrix[i2 * n + a], b < 0 ? -matrix[~b * n + i2] : matrix[i2 * n + b]));
            for (const j2 of subgroupIndex) {
              if (j2 < 0) {
                const chord3 = chords[~j2 * n + i2] || (chords[~j2 * n + i2] = { source: null, target: null });
                chord3.target = { index: i2, startAngle: x2, endAngle: x2 += matrix[~j2 * n + i2] * k, value: matrix[~j2 * n + i2] };
              } else {
                const chord3 = chords[i2 * n + j2] || (chords[i2 * n + j2] = { source: null, target: null });
                chord3.source = { index: i2, startAngle: x2, endAngle: x2 += matrix[i2 * n + j2] * k, value: matrix[i2 * n + j2] };
              }
            }
            groups[i2] = { index: i2, startAngle: x0, endAngle: x2, value: groupSums[i2] };
          } else {
            const subgroupIndex = range2(0, n).filter((j2) => matrix[i2 * n + j2] || matrix[j2 * n + i2]);
            if (sortSubgroups)
              subgroupIndex.sort((a, b) => sortSubgroups(matrix[i2 * n + a], matrix[i2 * n + b]));
            for (const j2 of subgroupIndex) {
              let chord3;
              if (i2 < j2) {
                chord3 = chords[i2 * n + j2] || (chords[i2 * n + j2] = { source: null, target: null });
                chord3.source = { index: i2, startAngle: x2, endAngle: x2 += matrix[i2 * n + j2] * k, value: matrix[i2 * n + j2] };
              } else {
                chord3 = chords[j2 * n + i2] || (chords[j2 * n + i2] = { source: null, target: null });
                chord3.target = { index: i2, startAngle: x2, endAngle: x2 += matrix[i2 * n + j2] * k, value: matrix[i2 * n + j2] };
                if (i2 === j2)
                  chord3.source = chord3.target;
              }
              if (chord3.source && chord3.target && chord3.source.value < chord3.target.value) {
                const source = chord3.source;
                chord3.source = chord3.target;
                chord3.target = source;
              }
            }
            groups[i2] = { index: i2, startAngle: x0, endAngle: x2, value: groupSums[i2] };
          }
          x2 += dx;
        }
      }
      chords = Object.values(chords);
      chords.groups = groups;
      return sortChords ? chords.sort(sortChords) : chords;
    }
    chord2.padAngle = function(_) {
      return arguments.length ? (padAngle = max3(0, _), chord2) : padAngle;
    };
    chord2.sortGroups = function(_) {
      return arguments.length ? (sortGroups = _, chord2) : sortGroups;
    };
    chord2.sortSubgroups = function(_) {
      return arguments.length ? (sortSubgroups = _, chord2) : sortSubgroups;
    };
    chord2.sortChords = function(_) {
      return arguments.length ? (_ == null ? sortChords = null : (sortChords = compareValue(_))._ = _, chord2) : sortChords && sortChords._;
    };
    return chord2;
  }
  var init_chord = __esm({
    "node_modules/d3-chord/src/chord.js"() {
      init_math();
    }
  });

  // node_modules/d3-path/src/path.js
  function append(strings) {
    this._ += strings[0];
    for (let i2 = 1, n = strings.length; i2 < n; ++i2) {
      this._ += arguments[i2] + strings[i2];
    }
  }
  function appendRound(digits) {
    let d = Math.floor(digits);
    if (!(d >= 0))
      throw new Error(`invalid digits: ${digits}`);
    if (d > 15)
      return append;
    const k = 10 ** d;
    return function(strings) {
      this._ += strings[0];
      for (let i2 = 1, n = strings.length; i2 < n; ++i2) {
        this._ += Math.round(arguments[i2] * k) / k + strings[i2];
      }
    };
  }
  function path() {
    return new Path();
  }
  var pi2, tau2, epsilon3, tauEpsilon, Path;
  var init_path = __esm({
    "node_modules/d3-path/src/path.js"() {
      pi2 = Math.PI;
      tau2 = 2 * pi2;
      epsilon3 = 1e-6;
      tauEpsilon = tau2 - epsilon3;
      Path = class {
        constructor(digits) {
          this._x0 = this._y0 = this._x1 = this._y1 = null;
          this._ = "";
          this._append = digits == null ? append : appendRound(digits);
        }
        moveTo(x2, y2) {
          this._append`M${this._x0 = this._x1 = +x2},${this._y0 = this._y1 = +y2}`;
        }
        closePath() {
          if (this._x1 !== null) {
            this._x1 = this._x0, this._y1 = this._y0;
            this._append`Z`;
          }
        }
        lineTo(x2, y2) {
          this._append`L${this._x1 = +x2},${this._y1 = +y2}`;
        }
        quadraticCurveTo(x1, y1, x2, y2) {
          this._append`Q${+x1},${+y1},${this._x1 = +x2},${this._y1 = +y2}`;
        }
        bezierCurveTo(x1, y1, x2, y2, x3, y3) {
          this._append`C${+x1},${+y1},${+x2},${+y2},${this._x1 = +x3},${this._y1 = +y3}`;
        }
        arcTo(x1, y1, x2, y2, r) {
          x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
          if (r < 0)
            throw new Error(`negative radius: ${r}`);
          let x0 = this._x1, y0 = this._y1, x21 = x2 - x1, y21 = y2 - y1, x01 = x0 - x1, y01 = y0 - y1, l01_2 = x01 * x01 + y01 * y01;
          if (this._x1 === null) {
            this._append`M${this._x1 = x1},${this._y1 = y1}`;
          } else if (!(l01_2 > epsilon3))
            ;
          else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon3) || !r) {
            this._append`L${this._x1 = x1},${this._y1 = y1}`;
          } else {
            let x20 = x2 - x0, y20 = y2 - y0, l21_2 = x21 * x21 + y21 * y21, l20_2 = x20 * x20 + y20 * y20, l21 = Math.sqrt(l21_2), l01 = Math.sqrt(l01_2), l = r * Math.tan((pi2 - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2), t01 = l / l01, t21 = l / l21;
            if (Math.abs(t01 - 1) > epsilon3) {
              this._append`L${x1 + t01 * x01},${y1 + t01 * y01}`;
            }
            this._append`A${r},${r},0,0,${+(y01 * x20 > x01 * y20)},${this._x1 = x1 + t21 * x21},${this._y1 = y1 + t21 * y21}`;
          }
        }
        arc(x2, y2, r, a0, a1, ccw) {
          x2 = +x2, y2 = +y2, r = +r, ccw = !!ccw;
          if (r < 0)
            throw new Error(`negative radius: ${r}`);
          let dx = r * Math.cos(a0), dy = r * Math.sin(a0), x0 = x2 + dx, y0 = y2 + dy, cw = 1 ^ ccw, da = ccw ? a0 - a1 : a1 - a0;
          if (this._x1 === null) {
            this._append`M${x0},${y0}`;
          } else if (Math.abs(this._x1 - x0) > epsilon3 || Math.abs(this._y1 - y0) > epsilon3) {
            this._append`L${x0},${y0}`;
          }
          if (!r)
            return;
          if (da < 0)
            da = da % tau2 + tau2;
          if (da > tauEpsilon) {
            this._append`A${r},${r},0,1,${cw},${x2 - dx},${y2 - dy}A${r},${r},0,1,${cw},${this._x1 = x0},${this._y1 = y0}`;
          } else if (da > epsilon3) {
            this._append`A${r},${r},0,${+(da >= pi2)},${cw},${this._x1 = x2 + r * Math.cos(a1)},${this._y1 = y2 + r * Math.sin(a1)}`;
          }
        }
        rect(x2, y2, w, h) {
          this._append`M${this._x0 = this._x1 = +x2},${this._y0 = this._y1 = +y2}h${w = +w}v${+h}h${-w}Z`;
        }
        toString() {
          return this._;
        }
      };
      path.prototype = Path.prototype;
    }
  });

  // node_modules/d3-path/src/index.js
  var init_src13 = __esm({
    "node_modules/d3-path/src/index.js"() {
      init_path();
    }
  });

  // node_modules/d3-chord/src/array.js
  var slice;
  var init_array3 = __esm({
    "node_modules/d3-chord/src/array.js"() {
      slice = Array.prototype.slice;
    }
  });

  // node_modules/d3-chord/src/constant.js
  function constant_default4(x2) {
    return function() {
      return x2;
    };
  }
  var init_constant4 = __esm({
    "node_modules/d3-chord/src/constant.js"() {
    }
  });

  // node_modules/d3-chord/src/ribbon.js
  function defaultSource(d) {
    return d.source;
  }
  function defaultTarget(d) {
    return d.target;
  }
  function defaultRadius(d) {
    return d.radius;
  }
  function defaultStartAngle(d) {
    return d.startAngle;
  }
  function defaultEndAngle(d) {
    return d.endAngle;
  }
  function defaultPadAngle() {
    return 0;
  }
  function ribbon(headRadius) {
    var source = defaultSource, target = defaultTarget, sourceRadius = defaultRadius, targetRadius = defaultRadius, startAngle = defaultStartAngle, endAngle = defaultEndAngle, padAngle = defaultPadAngle, context2 = null;
    function ribbon2() {
      var buffer, s = source.apply(this, arguments), t = target.apply(this, arguments), ap = padAngle.apply(this, arguments) / 2, argv = slice.call(arguments), sr = +sourceRadius.apply(this, (argv[0] = s, argv)), sa0 = startAngle.apply(this, argv) - halfPi, sa1 = endAngle.apply(this, argv) - halfPi, tr = +targetRadius.apply(this, (argv[0] = t, argv)), ta0 = startAngle.apply(this, argv) - halfPi, ta1 = endAngle.apply(this, argv) - halfPi;
      if (!context2)
        context2 = buffer = path();
      if (ap > epsilon2) {
        if (abs2(sa1 - sa0) > ap * 2 + epsilon2)
          sa1 > sa0 ? (sa0 += ap, sa1 -= ap) : (sa0 -= ap, sa1 += ap);
        else
          sa0 = sa1 = (sa0 + sa1) / 2;
        if (abs2(ta1 - ta0) > ap * 2 + epsilon2)
          ta1 > ta0 ? (ta0 += ap, ta1 -= ap) : (ta0 -= ap, ta1 += ap);
        else
          ta0 = ta1 = (ta0 + ta1) / 2;
      }
      context2.moveTo(sr * cos(sa0), sr * sin(sa0));
      context2.arc(0, 0, sr, sa0, sa1);
      if (sa0 !== ta0 || sa1 !== ta1) {
        if (headRadius) {
          var hr = +headRadius.apply(this, arguments), tr2 = tr - hr, ta2 = (ta0 + ta1) / 2;
          context2.quadraticCurveTo(0, 0, tr2 * cos(ta0), tr2 * sin(ta0));
          context2.lineTo(tr * cos(ta2), tr * sin(ta2));
          context2.lineTo(tr2 * cos(ta1), tr2 * sin(ta1));
        } else {
          context2.quadraticCurveTo(0, 0, tr * cos(ta0), tr * sin(ta0));
          context2.arc(0, 0, tr, ta0, ta1);
        }
      }
      context2.quadraticCurveTo(0, 0, sr * cos(sa0), sr * sin(sa0));
      context2.closePath();
      if (buffer)
        return context2 = null, buffer + "" || null;
    }
    if (headRadius)
      ribbon2.headRadius = function(_) {
        return arguments.length ? (headRadius = typeof _ === "function" ? _ : constant_default4(+_), ribbon2) : headRadius;
      };
    ribbon2.radius = function(_) {
      return arguments.length ? (sourceRadius = targetRadius = typeof _ === "function" ? _ : constant_default4(+_), ribbon2) : sourceRadius;
    };
    ribbon2.sourceRadius = function(_) {
      return arguments.length ? (sourceRadius = typeof _ === "function" ? _ : constant_default4(+_), ribbon2) : sourceRadius;
    };
    ribbon2.targetRadius = function(_) {
      return arguments.length ? (targetRadius = typeof _ === "function" ? _ : constant_default4(+_), ribbon2) : targetRadius;
    };
    ribbon2.startAngle = function(_) {
      return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant_default4(+_), ribbon2) : startAngle;
    };
    ribbon2.endAngle = function(_) {
      return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant_default4(+_), ribbon2) : endAngle;
    };
    ribbon2.padAngle = function(_) {
      return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant_default4(+_), ribbon2) : padAngle;
    };
    ribbon2.source = function(_) {
      return arguments.length ? (source = _, ribbon2) : source;
    };
    ribbon2.target = function(_) {
      return arguments.length ? (target = _, ribbon2) : target;
    };
    ribbon2.context = function(_) {
      return arguments.length ? (context2 = _ == null ? null : _, ribbon2) : context2;
    };
    return ribbon2;
  }
  function ribbon_default() {
    return ribbon();
  }
  var init_ribbon = __esm({
    "node_modules/d3-chord/src/ribbon.js"() {
      init_src13();
      init_array3();
      init_constant4();
      init_math();
    }
  });

  // node_modules/d3-chord/src/index.js
  var init_src14 = __esm({
    "node_modules/d3-chord/src/index.js"() {
      init_chord();
      init_ribbon();
    }
  });

  // node_modules/d3-contour/src/index.js
  var init_src15 = __esm({
    "node_modules/d3-contour/src/index.js"() {
    }
  });

  // node_modules/d3-delaunay/src/index.js
  var init_src16 = __esm({
    "node_modules/d3-delaunay/src/index.js"() {
    }
  });

  // node_modules/d3-dsv/src/index.js
  var init_src17 = __esm({
    "node_modules/d3-dsv/src/index.js"() {
    }
  });

  // node_modules/d3-fetch/src/json.js
  function responseJson(response) {
    if (!response.ok)
      throw new Error(response.status + " " + response.statusText);
    if (response.status === 204 || response.status === 205)
      return;
    return response.json();
  }
  function json_default(input, init2) {
    return fetch(input, init2).then(responseJson);
  }
  var init_json = __esm({
    "node_modules/d3-fetch/src/json.js"() {
    }
  });

  // node_modules/d3-fetch/src/index.js
  var init_src18 = __esm({
    "node_modules/d3-fetch/src/index.js"() {
      init_json();
    }
  });

  // node_modules/d3-quadtree/src/index.js
  var init_src19 = __esm({
    "node_modules/d3-quadtree/src/index.js"() {
    }
  });

  // node_modules/d3-force/src/index.js
  var init_src20 = __esm({
    "node_modules/d3-force/src/index.js"() {
    }
  });

  // node_modules/d3-format/src/formatDecimal.js
  function formatDecimal_default(x2) {
    return Math.abs(x2 = Math.round(x2)) >= 1e21 ? x2.toLocaleString("en").replace(/,/g, "") : x2.toString(10);
  }
  function formatDecimalParts(x2, p) {
    if ((i2 = (x2 = p ? x2.toExponential(p - 1) : x2.toExponential()).indexOf("e")) < 0)
      return null;
    var i2, coefficient = x2.slice(0, i2);
    return [
      coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
      +x2.slice(i2 + 1)
    ];
  }
  var init_formatDecimal = __esm({
    "node_modules/d3-format/src/formatDecimal.js"() {
    }
  });

  // node_modules/d3-format/src/exponent.js
  function exponent_default(x2) {
    return x2 = formatDecimalParts(Math.abs(x2)), x2 ? x2[1] : NaN;
  }
  var init_exponent = __esm({
    "node_modules/d3-format/src/exponent.js"() {
      init_formatDecimal();
    }
  });

  // node_modules/d3-format/src/formatGroup.js
  function formatGroup_default(grouping, thousands) {
    return function(value, width) {
      var i2 = value.length, t = [], j2 = 0, g = grouping[0], length = 0;
      while (i2 > 0 && g > 0) {
        if (length + g + 1 > width)
          g = Math.max(1, width - length);
        t.push(value.substring(i2 -= g, i2 + g));
        if ((length += g + 1) > width)
          break;
        g = grouping[j2 = (j2 + 1) % grouping.length];
      }
      return t.reverse().join(thousands);
    };
  }
  var init_formatGroup = __esm({
    "node_modules/d3-format/src/formatGroup.js"() {
    }
  });

  // node_modules/d3-format/src/formatNumerals.js
  function formatNumerals_default(numerals) {
    return function(value) {
      return value.replace(/[0-9]/g, function(i2) {
        return numerals[+i2];
      });
    };
  }
  var init_formatNumerals = __esm({
    "node_modules/d3-format/src/formatNumerals.js"() {
    }
  });

  // node_modules/d3-format/src/formatSpecifier.js
  function formatSpecifier(specifier) {
    if (!(match = re.exec(specifier)))
      throw new Error("invalid format: " + specifier);
    var match;
    return new FormatSpecifier({
      fill: match[1],
      align: match[2],
      sign: match[3],
      symbol: match[4],
      zero: match[5],
      width: match[6],
      comma: match[7],
      precision: match[8] && match[8].slice(1),
      trim: match[9],
      type: match[10]
    });
  }
  function FormatSpecifier(specifier) {
    this.fill = specifier.fill === void 0 ? " " : specifier.fill + "";
    this.align = specifier.align === void 0 ? ">" : specifier.align + "";
    this.sign = specifier.sign === void 0 ? "-" : specifier.sign + "";
    this.symbol = specifier.symbol === void 0 ? "" : specifier.symbol + "";
    this.zero = !!specifier.zero;
    this.width = specifier.width === void 0 ? void 0 : +specifier.width;
    this.comma = !!specifier.comma;
    this.precision = specifier.precision === void 0 ? void 0 : +specifier.precision;
    this.trim = !!specifier.trim;
    this.type = specifier.type === void 0 ? "" : specifier.type + "";
  }
  var re;
  var init_formatSpecifier = __esm({
    "node_modules/d3-format/src/formatSpecifier.js"() {
      re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
      formatSpecifier.prototype = FormatSpecifier.prototype;
      FormatSpecifier.prototype.toString = function() {
        return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
      };
    }
  });

  // node_modules/d3-format/src/formatTrim.js
  function formatTrim_default(s) {
    out:
      for (var n = s.length, i2 = 1, i0 = -1, i1; i2 < n; ++i2) {
        switch (s[i2]) {
          case ".":
            i0 = i1 = i2;
            break;
          case "0":
            if (i0 === 0)
              i0 = i2;
            i1 = i2;
            break;
          default:
            if (!+s[i2])
              break out;
            if (i0 > 0)
              i0 = 0;
            break;
        }
      }
    return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
  }
  var init_formatTrim = __esm({
    "node_modules/d3-format/src/formatTrim.js"() {
    }
  });

  // node_modules/d3-format/src/formatPrefixAuto.js
  function formatPrefixAuto_default(x2, p) {
    var d = formatDecimalParts(x2, p);
    if (!d)
      return x2 + "";
    var coefficient = d[0], exponent = d[1], i2 = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1, n = coefficient.length;
    return i2 === n ? coefficient : i2 > n ? coefficient + new Array(i2 - n + 1).join("0") : i2 > 0 ? coefficient.slice(0, i2) + "." + coefficient.slice(i2) : "0." + new Array(1 - i2).join("0") + formatDecimalParts(x2, Math.max(0, p + i2 - 1))[0];
  }
  var prefixExponent;
  var init_formatPrefixAuto = __esm({
    "node_modules/d3-format/src/formatPrefixAuto.js"() {
      init_formatDecimal();
    }
  });

  // node_modules/d3-format/src/formatRounded.js
  function formatRounded_default(x2, p) {
    var d = formatDecimalParts(x2, p);
    if (!d)
      return x2 + "";
    var coefficient = d[0], exponent = d[1];
    return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1) : coefficient + new Array(exponent - coefficient.length + 2).join("0");
  }
  var init_formatRounded = __esm({
    "node_modules/d3-format/src/formatRounded.js"() {
      init_formatDecimal();
    }
  });

  // node_modules/d3-format/src/formatTypes.js
  var formatTypes_default;
  var init_formatTypes = __esm({
    "node_modules/d3-format/src/formatTypes.js"() {
      init_formatDecimal();
      init_formatPrefixAuto();
      init_formatRounded();
      formatTypes_default = {
        "%": (x2, p) => (x2 * 100).toFixed(p),
        "b": (x2) => Math.round(x2).toString(2),
        "c": (x2) => x2 + "",
        "d": formatDecimal_default,
        "e": (x2, p) => x2.toExponential(p),
        "f": (x2, p) => x2.toFixed(p),
        "g": (x2, p) => x2.toPrecision(p),
        "o": (x2) => Math.round(x2).toString(8),
        "p": (x2, p) => formatRounded_default(x2 * 100, p),
        "r": formatRounded_default,
        "s": formatPrefixAuto_default,
        "X": (x2) => Math.round(x2).toString(16).toUpperCase(),
        "x": (x2) => Math.round(x2).toString(16)
      };
    }
  });

  // node_modules/d3-format/src/identity.js
  function identity_default2(x2) {
    return x2;
  }
  var init_identity2 = __esm({
    "node_modules/d3-format/src/identity.js"() {
    }
  });

  // node_modules/d3-format/src/locale.js
  function locale_default(locale3) {
    var group = locale3.grouping === void 0 || locale3.thousands === void 0 ? identity_default2 : formatGroup_default(map.call(locale3.grouping, Number), locale3.thousands + ""), currencyPrefix = locale3.currency === void 0 ? "" : locale3.currency[0] + "", currencySuffix = locale3.currency === void 0 ? "" : locale3.currency[1] + "", decimal = locale3.decimal === void 0 ? "." : locale3.decimal + "", numerals = locale3.numerals === void 0 ? identity_default2 : formatNumerals_default(map.call(locale3.numerals, String)), percent = locale3.percent === void 0 ? "%" : locale3.percent + "", minus = locale3.minus === void 0 ? "\u2212" : locale3.minus + "", nan = locale3.nan === void 0 ? "NaN" : locale3.nan + "";
    function newFormat(specifier) {
      specifier = formatSpecifier(specifier);
      var fill = specifier.fill, align = specifier.align, sign2 = specifier.sign, symbol = specifier.symbol, zero3 = specifier.zero, width = specifier.width, comma = specifier.comma, precision = specifier.precision, trim = specifier.trim, type2 = specifier.type;
      if (type2 === "n")
        comma = true, type2 = "g";
      else if (!formatTypes_default[type2])
        precision === void 0 && (precision = 12), trim = true, type2 = "g";
      if (zero3 || fill === "0" && align === "=")
        zero3 = true, fill = "0", align = "=";
      var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type2) ? "0" + type2.toLowerCase() : "", suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type2) ? percent : "";
      var formatType = formatTypes_default[type2], maybeSuffix = /[defgprs%]/.test(type2);
      precision = precision === void 0 ? 6 : /[gprs]/.test(type2) ? Math.max(1, Math.min(21, precision)) : Math.max(0, Math.min(20, precision));
      function format2(value) {
        var valuePrefix = prefix, valueSuffix = suffix, i2, n, c;
        if (type2 === "c") {
          valueSuffix = formatType(value) + valueSuffix;
          value = "";
        } else {
          value = +value;
          var valueNegative = value < 0 || 1 / value < 0;
          value = isNaN(value) ? nan : formatType(Math.abs(value), precision);
          if (trim)
            value = formatTrim_default(value);
          if (valueNegative && +value === 0 && sign2 !== "+")
            valueNegative = false;
          valuePrefix = (valueNegative ? sign2 === "(" ? sign2 : minus : sign2 === "-" || sign2 === "(" ? "" : sign2) + valuePrefix;
          valueSuffix = (type2 === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign2 === "(" ? ")" : "");
          if (maybeSuffix) {
            i2 = -1, n = value.length;
            while (++i2 < n) {
              if (c = value.charCodeAt(i2), 48 > c || c > 57) {
                valueSuffix = (c === 46 ? decimal + value.slice(i2 + 1) : value.slice(i2)) + valueSuffix;
                value = value.slice(0, i2);
                break;
              }
            }
          }
        }
        if (comma && !zero3)
          value = group(value, Infinity);
        var length = valuePrefix.length + value.length + valueSuffix.length, padding = length < width ? new Array(width - length + 1).join(fill) : "";
        if (comma && zero3)
          value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";
        switch (align) {
          case "<":
            value = valuePrefix + value + valueSuffix + padding;
            break;
          case "=":
            value = valuePrefix + padding + value + valueSuffix;
            break;
          case "^":
            value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
            break;
          default:
            value = padding + valuePrefix + value + valueSuffix;
            break;
        }
        return numerals(value);
      }
      format2.toString = function() {
        return specifier + "";
      };
      return format2;
    }
    function formatPrefix2(specifier, value) {
      var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)), e = Math.max(-8, Math.min(8, Math.floor(exponent_default(value) / 3))) * 3, k = Math.pow(10, -e), prefix = prefixes[8 + e / 3];
      return function(value2) {
        return f(k * value2) + prefix;
      };
    }
    return {
      format: newFormat,
      formatPrefix: formatPrefix2
    };
  }
  var map, prefixes;
  var init_locale = __esm({
    "node_modules/d3-format/src/locale.js"() {
      init_exponent();
      init_formatGroup();
      init_formatNumerals();
      init_formatSpecifier();
      init_formatTrim();
      init_formatTypes();
      init_formatPrefixAuto();
      init_identity2();
      map = Array.prototype.map;
      prefixes = ["y", "z", "a", "f", "p", "n", "\xB5", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
    }
  });

  // node_modules/d3-format/src/defaultLocale.js
  function defaultLocale(definition) {
    locale = locale_default(definition);
    format = locale.format;
    formatPrefix = locale.formatPrefix;
    return locale;
  }
  var locale, format, formatPrefix;
  var init_defaultLocale = __esm({
    "node_modules/d3-format/src/defaultLocale.js"() {
      init_locale();
      defaultLocale({
        thousands: ",",
        grouping: [3],
        currency: ["$", ""]
      });
    }
  });

  // node_modules/d3-format/src/precisionFixed.js
  function precisionFixed_default(step) {
    return Math.max(0, -exponent_default(Math.abs(step)));
  }
  var init_precisionFixed = __esm({
    "node_modules/d3-format/src/precisionFixed.js"() {
      init_exponent();
    }
  });

  // node_modules/d3-format/src/precisionPrefix.js
  function precisionPrefix_default(step, value) {
    return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent_default(value) / 3))) * 3 - exponent_default(Math.abs(step)));
  }
  var init_precisionPrefix = __esm({
    "node_modules/d3-format/src/precisionPrefix.js"() {
      init_exponent();
    }
  });

  // node_modules/d3-format/src/precisionRound.js
  function precisionRound_default(step, max5) {
    step = Math.abs(step), max5 = Math.abs(max5) - step;
    return Math.max(0, exponent_default(max5) - exponent_default(step)) + 1;
  }
  var init_precisionRound = __esm({
    "node_modules/d3-format/src/precisionRound.js"() {
      init_exponent();
    }
  });

  // node_modules/d3-format/src/index.js
  var init_src21 = __esm({
    "node_modules/d3-format/src/index.js"() {
      init_defaultLocale();
      init_formatSpecifier();
      init_precisionFixed();
      init_precisionPrefix();
      init_precisionRound();
    }
  });

  // node_modules/d3-geo/src/index.js
  var init_src22 = __esm({
    "node_modules/d3-geo/src/index.js"() {
    }
  });

  // node_modules/d3-hierarchy/src/index.js
  var init_src23 = __esm({
    "node_modules/d3-hierarchy/src/index.js"() {
    }
  });

  // node_modules/d3-polygon/src/index.js
  var init_src24 = __esm({
    "node_modules/d3-polygon/src/index.js"() {
    }
  });

  // node_modules/d3-random/src/index.js
  var init_src25 = __esm({
    "node_modules/d3-random/src/index.js"() {
    }
  });

  // node_modules/d3-scale/src/init.js
  function initRange(domain, range3) {
    switch (arguments.length) {
      case 0:
        break;
      case 1:
        this.range(domain);
        break;
      default:
        this.range(range3).domain(domain);
        break;
    }
    return this;
  }
  function initInterpolator(domain, interpolator) {
    switch (arguments.length) {
      case 0:
        break;
      case 1: {
        if (typeof domain === "function")
          this.interpolator(domain);
        else
          this.range(domain);
        break;
      }
      default: {
        this.domain(domain);
        if (typeof interpolator === "function")
          this.interpolator(interpolator);
        else
          this.range(interpolator);
        break;
      }
    }
    return this;
  }
  var init_init = __esm({
    "node_modules/d3-scale/src/init.js"() {
    }
  });

  // node_modules/d3-scale/src/ordinal.js
  function ordinal() {
    var index = new InternMap(), domain = [], range3 = [], unknown = implicit;
    function scale(d) {
      let i2 = index.get(d);
      if (i2 === void 0) {
        if (unknown !== implicit)
          return unknown;
        index.set(d, i2 = domain.push(d) - 1);
      }
      return range3[i2 % range3.length];
    }
    scale.domain = function(_) {
      if (!arguments.length)
        return domain.slice();
      domain = [], index = new InternMap();
      for (const value of _) {
        if (index.has(value))
          continue;
        index.set(value, domain.push(value) - 1);
      }
      return scale;
    };
    scale.range = function(_) {
      return arguments.length ? (range3 = Array.from(_), scale) : range3.slice();
    };
    scale.unknown = function(_) {
      return arguments.length ? (unknown = _, scale) : unknown;
    };
    scale.copy = function() {
      return ordinal(domain, range3).unknown(unknown);
    };
    initRange.apply(scale, arguments);
    return scale;
  }
  var implicit;
  var init_ordinal = __esm({
    "node_modules/d3-scale/src/ordinal.js"() {
      init_src2();
      init_init();
      implicit = Symbol("implicit");
    }
  });

  // node_modules/d3-scale/src/band.js
  function band() {
    var scale = ordinal().unknown(void 0), domain = scale.domain, ordinalRange = scale.range, r0 = 0, r1 = 1, step, bandwidth, round = false, paddingInner = 0, paddingOuter = 0, align = 0.5;
    delete scale.unknown;
    function rescale() {
      var n = domain().length, reverse = r1 < r0, start2 = reverse ? r1 : r0, stop = reverse ? r0 : r1;
      step = (stop - start2) / Math.max(1, n - paddingInner + paddingOuter * 2);
      if (round)
        step = Math.floor(step);
      start2 += (stop - start2 - step * (n - paddingInner)) * align;
      bandwidth = step * (1 - paddingInner);
      if (round)
        start2 = Math.round(start2), bandwidth = Math.round(bandwidth);
      var values = range(n).map(function(i2) {
        return start2 + step * i2;
      });
      return ordinalRange(reverse ? values.reverse() : values);
    }
    scale.domain = function(_) {
      return arguments.length ? (domain(_), rescale()) : domain();
    };
    scale.range = function(_) {
      return arguments.length ? ([r0, r1] = _, r0 = +r0, r1 = +r1, rescale()) : [r0, r1];
    };
    scale.rangeRound = function(_) {
      return [r0, r1] = _, r0 = +r0, r1 = +r1, round = true, rescale();
    };
    scale.bandwidth = function() {
      return bandwidth;
    };
    scale.step = function() {
      return step;
    };
    scale.round = function(_) {
      return arguments.length ? (round = !!_, rescale()) : round;
    };
    scale.padding = function(_) {
      return arguments.length ? (paddingInner = Math.min(1, paddingOuter = +_), rescale()) : paddingInner;
    };
    scale.paddingInner = function(_) {
      return arguments.length ? (paddingInner = Math.min(1, _), rescale()) : paddingInner;
    };
    scale.paddingOuter = function(_) {
      return arguments.length ? (paddingOuter = +_, rescale()) : paddingOuter;
    };
    scale.align = function(_) {
      return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
    };
    scale.copy = function() {
      return band(domain(), [r0, r1]).round(round).paddingInner(paddingInner).paddingOuter(paddingOuter).align(align);
    };
    return initRange.apply(rescale(), arguments);
  }
  var init_band = __esm({
    "node_modules/d3-scale/src/band.js"() {
      init_src2();
      init_init();
      init_ordinal();
    }
  });

  // node_modules/d3-scale/src/constant.js
  function constants(x2) {
    return function() {
      return x2;
    };
  }
  var init_constant5 = __esm({
    "node_modules/d3-scale/src/constant.js"() {
    }
  });

  // node_modules/d3-scale/src/number.js
  function number3(x2) {
    return +x2;
  }
  var init_number3 = __esm({
    "node_modules/d3-scale/src/number.js"() {
    }
  });

  // node_modules/d3-scale/src/continuous.js
  function identity2(x2) {
    return x2;
  }
  function normalize(a, b) {
    return (b -= a = +a) ? function(x2) {
      return (x2 - a) / b;
    } : constants(isNaN(b) ? NaN : 0.5);
  }
  function clamper(a, b) {
    var t;
    if (a > b)
      t = a, a = b, b = t;
    return function(x2) {
      return Math.max(a, Math.min(b, x2));
    };
  }
  function bimap(domain, range3, interpolate) {
    var d0 = domain[0], d1 = domain[1], r0 = range3[0], r1 = range3[1];
    if (d1 < d0)
      d0 = normalize(d1, d0), r0 = interpolate(r1, r0);
    else
      d0 = normalize(d0, d1), r0 = interpolate(r0, r1);
    return function(x2) {
      return r0(d0(x2));
    };
  }
  function polymap(domain, range3, interpolate) {
    var j2 = Math.min(domain.length, range3.length) - 1, d = new Array(j2), r = new Array(j2), i2 = -1;
    if (domain[j2] < domain[0]) {
      domain = domain.slice().reverse();
      range3 = range3.slice().reverse();
    }
    while (++i2 < j2) {
      d[i2] = normalize(domain[i2], domain[i2 + 1]);
      r[i2] = interpolate(range3[i2], range3[i2 + 1]);
    }
    return function(x2) {
      var i3 = bisect_default(domain, x2, 1, j2) - 1;
      return r[i3](d[i3](x2));
    };
  }
  function copy(source, target) {
    return target.domain(source.domain()).range(source.range()).interpolate(source.interpolate()).clamp(source.clamp()).unknown(source.unknown());
  }
  function transformer() {
    var domain = unit, range3 = unit, interpolate = value_default, transform2, untransform, unknown, clamp = identity2, piecewise, output, input;
    function rescale() {
      var n = Math.min(domain.length, range3.length);
      if (clamp !== identity2)
        clamp = clamper(domain[0], domain[n - 1]);
      piecewise = n > 2 ? polymap : bimap;
      output = input = null;
      return scale;
    }
    function scale(x2) {
      return x2 == null || isNaN(x2 = +x2) ? unknown : (output || (output = piecewise(domain.map(transform2), range3, interpolate)))(transform2(clamp(x2)));
    }
    scale.invert = function(y2) {
      return clamp(untransform((input || (input = piecewise(range3, domain.map(transform2), number_default)))(y2)));
    };
    scale.domain = function(_) {
      return arguments.length ? (domain = Array.from(_, number3), rescale()) : domain.slice();
    };
    scale.range = function(_) {
      return arguments.length ? (range3 = Array.from(_), rescale()) : range3.slice();
    };
    scale.rangeRound = function(_) {
      return range3 = Array.from(_), interpolate = round_default, rescale();
    };
    scale.clamp = function(_) {
      return arguments.length ? (clamp = _ ? true : identity2, rescale()) : clamp !== identity2;
    };
    scale.interpolate = function(_) {
      return arguments.length ? (interpolate = _, rescale()) : interpolate;
    };
    scale.unknown = function(_) {
      return arguments.length ? (unknown = _, scale) : unknown;
    };
    return function(t, u) {
      transform2 = t, untransform = u;
      return rescale();
    };
  }
  function continuous() {
    return transformer()(identity2, identity2);
  }
  var unit;
  var init_continuous = __esm({
    "node_modules/d3-scale/src/continuous.js"() {
      init_src2();
      init_src8();
      init_constant5();
      init_number3();
      unit = [0, 1];
    }
  });

  // node_modules/d3-scale/src/tickFormat.js
  function tickFormat(start2, stop, count, specifier) {
    var step = tickStep(start2, stop, count), precision;
    specifier = formatSpecifier(specifier == null ? ",f" : specifier);
    switch (specifier.type) {
      case "s": {
        var value = Math.max(Math.abs(start2), Math.abs(stop));
        if (specifier.precision == null && !isNaN(precision = precisionPrefix_default(step, value)))
          specifier.precision = precision;
        return formatPrefix(specifier, value);
      }
      case "":
      case "e":
      case "g":
      case "p":
      case "r": {
        if (specifier.precision == null && !isNaN(precision = precisionRound_default(step, Math.max(Math.abs(start2), Math.abs(stop)))))
          specifier.precision = precision - (specifier.type === "e");
        break;
      }
      case "f":
      case "%": {
        if (specifier.precision == null && !isNaN(precision = precisionFixed_default(step)))
          specifier.precision = precision - (specifier.type === "%") * 2;
        break;
      }
    }
    return format(specifier);
  }
  var init_tickFormat = __esm({
    "node_modules/d3-scale/src/tickFormat.js"() {
      init_src2();
      init_src21();
    }
  });

  // node_modules/d3-scale/src/linear.js
  function linearish(scale) {
    var domain = scale.domain;
    scale.ticks = function(count) {
      var d = domain();
      return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
    };
    scale.tickFormat = function(count, specifier) {
      var d = domain();
      return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
    };
    scale.nice = function(count) {
      if (count == null)
        count = 10;
      var d = domain();
      var i0 = 0;
      var i1 = d.length - 1;
      var start2 = d[i0];
      var stop = d[i1];
      var prestep;
      var step;
      var maxIter = 10;
      if (stop < start2) {
        step = start2, start2 = stop, stop = step;
        step = i0, i0 = i1, i1 = step;
      }
      while (maxIter-- > 0) {
        step = tickIncrement(start2, stop, count);
        if (step === prestep) {
          d[i0] = start2;
          d[i1] = stop;
          return domain(d);
        } else if (step > 0) {
          start2 = Math.floor(start2 / step) * step;
          stop = Math.ceil(stop / step) * step;
        } else if (step < 0) {
          start2 = Math.ceil(start2 * step) / step;
          stop = Math.floor(stop * step) / step;
        } else {
          break;
        }
        prestep = step;
      }
      return scale;
    };
    return scale;
  }
  function linear3() {
    var scale = continuous();
    scale.copy = function() {
      return copy(scale, linear3());
    };
    initRange.apply(scale, arguments);
    return linearish(scale);
  }
  var init_linear2 = __esm({
    "node_modules/d3-scale/src/linear.js"() {
      init_src2();
      init_continuous();
      init_init();
      init_tickFormat();
    }
  });

  // node_modules/d3-scale/src/nice.js
  function nice(domain, interval2) {
    domain = domain.slice();
    var i0 = 0, i1 = domain.length - 1, x0 = domain[i0], x1 = domain[i1], t;
    if (x1 < x0) {
      t = i0, i0 = i1, i1 = t;
      t = x0, x0 = x1, x1 = t;
    }
    domain[i0] = interval2.floor(x0);
    domain[i1] = interval2.ceil(x1);
    return domain;
  }
  var init_nice = __esm({
    "node_modules/d3-scale/src/nice.js"() {
    }
  });

  // node_modules/d3-scale/src/log.js
  function transformLog(x2) {
    return Math.log(x2);
  }
  function transformExp(x2) {
    return Math.exp(x2);
  }
  function transformLogn(x2) {
    return -Math.log(-x2);
  }
  function transformExpn(x2) {
    return -Math.exp(-x2);
  }
  function pow10(x2) {
    return isFinite(x2) ? +("1e" + x2) : x2 < 0 ? 0 : x2;
  }
  function powp(base) {
    return base === 10 ? pow10 : base === Math.E ? Math.exp : (x2) => Math.pow(base, x2);
  }
  function logp(base) {
    return base === Math.E ? Math.log : base === 10 && Math.log10 || base === 2 && Math.log2 || (base = Math.log(base), (x2) => Math.log(x2) / base);
  }
  function reflect(f) {
    return (x2, k) => -f(-x2, k);
  }
  function loggish(transform2) {
    const scale = transform2(transformLog, transformExp);
    const domain = scale.domain;
    let base = 10;
    let logs;
    let pows;
    function rescale() {
      logs = logp(base), pows = powp(base);
      if (domain()[0] < 0) {
        logs = reflect(logs), pows = reflect(pows);
        transform2(transformLogn, transformExpn);
      } else {
        transform2(transformLog, transformExp);
      }
      return scale;
    }
    scale.base = function(_) {
      return arguments.length ? (base = +_, rescale()) : base;
    };
    scale.domain = function(_) {
      return arguments.length ? (domain(_), rescale()) : domain();
    };
    scale.ticks = (count) => {
      const d = domain();
      let u = d[0];
      let v = d[d.length - 1];
      const r = v < u;
      if (r)
        [u, v] = [v, u];
      let i2 = logs(u);
      let j2 = logs(v);
      let k;
      let t;
      const n = count == null ? 10 : +count;
      let z = [];
      if (!(base % 1) && j2 - i2 < n) {
        i2 = Math.floor(i2), j2 = Math.ceil(j2);
        if (u > 0)
          for (; i2 <= j2; ++i2) {
            for (k = 1; k < base; ++k) {
              t = i2 < 0 ? k / pows(-i2) : k * pows(i2);
              if (t < u)
                continue;
              if (t > v)
                break;
              z.push(t);
            }
          }
        else
          for (; i2 <= j2; ++i2) {
            for (k = base - 1; k >= 1; --k) {
              t = i2 > 0 ? k / pows(-i2) : k * pows(i2);
              if (t < u)
                continue;
              if (t > v)
                break;
              z.push(t);
            }
          }
        if (z.length * 2 < n)
          z = ticks(u, v, n);
      } else {
        z = ticks(i2, j2, Math.min(j2 - i2, n)).map(pows);
      }
      return r ? z.reverse() : z;
    };
    scale.tickFormat = (count, specifier) => {
      if (count == null)
        count = 10;
      if (specifier == null)
        specifier = base === 10 ? "s" : ",";
      if (typeof specifier !== "function") {
        if (!(base % 1) && (specifier = formatSpecifier(specifier)).precision == null)
          specifier.trim = true;
        specifier = format(specifier);
      }
      if (count === Infinity)
        return specifier;
      const k = Math.max(1, base * count / scale.ticks().length);
      return (d) => {
        let i2 = d / pows(Math.round(logs(d)));
        if (i2 * base < base - 0.5)
          i2 *= base;
        return i2 <= k ? specifier(d) : "";
      };
    };
    scale.nice = () => {
      return domain(nice(domain(), {
        floor: (x2) => pows(Math.floor(logs(x2))),
        ceil: (x2) => pows(Math.ceil(logs(x2)))
      }));
    };
    return scale;
  }
  function log() {
    const scale = loggish(transformer()).domain([1, 10]);
    scale.copy = () => copy(scale, log()).base(scale.base());
    initRange.apply(scale, arguments);
    return scale;
  }
  var init_log = __esm({
    "node_modules/d3-scale/src/log.js"() {
      init_src2();
      init_src21();
      init_nice();
      init_continuous();
      init_init();
    }
  });

  // node_modules/d3-time/src/interval.js
  function timeInterval(floori, offseti, count, field) {
    function interval2(date3) {
      return floori(date3 = arguments.length === 0 ? new Date() : new Date(+date3)), date3;
    }
    interval2.floor = (date3) => {
      return floori(date3 = new Date(+date3)), date3;
    };
    interval2.ceil = (date3) => {
      return floori(date3 = new Date(date3 - 1)), offseti(date3, 1), floori(date3), date3;
    };
    interval2.round = (date3) => {
      const d0 = interval2(date3), d1 = interval2.ceil(date3);
      return date3 - d0 < d1 - date3 ? d0 : d1;
    };
    interval2.offset = (date3, step) => {
      return offseti(date3 = new Date(+date3), step == null ? 1 : Math.floor(step)), date3;
    };
    interval2.range = (start2, stop, step) => {
      const range3 = [];
      start2 = interval2.ceil(start2);
      step = step == null ? 1 : Math.floor(step);
      if (!(start2 < stop) || !(step > 0))
        return range3;
      let previous;
      do
        range3.push(previous = new Date(+start2)), offseti(start2, step), floori(start2);
      while (previous < start2 && start2 < stop);
      return range3;
    };
    interval2.filter = (test) => {
      return timeInterval((date3) => {
        if (date3 >= date3)
          while (floori(date3), !test(date3))
            date3.setTime(date3 - 1);
      }, (date3, step) => {
        if (date3 >= date3) {
          if (step < 0)
            while (++step <= 0) {
              while (offseti(date3, -1), !test(date3)) {
              }
            }
          else
            while (--step >= 0) {
              while (offseti(date3, 1), !test(date3)) {
              }
            }
        }
      });
    };
    if (count) {
      interval2.count = (start2, end) => {
        t0.setTime(+start2), t1.setTime(+end);
        floori(t0), floori(t1);
        return Math.floor(count(t0, t1));
      };
      interval2.every = (step) => {
        step = Math.floor(step);
        return !isFinite(step) || !(step > 0) ? null : !(step > 1) ? interval2 : interval2.filter(field ? (d) => field(d) % step === 0 : (d) => interval2.count(0, d) % step === 0);
      };
    }
    return interval2;
  }
  var t0, t1;
  var init_interval = __esm({
    "node_modules/d3-time/src/interval.js"() {
      t0 = new Date();
      t1 = new Date();
    }
  });

  // node_modules/d3-time/src/millisecond.js
  var millisecond, milliseconds;
  var init_millisecond = __esm({
    "node_modules/d3-time/src/millisecond.js"() {
      init_interval();
      millisecond = timeInterval(() => {
      }, (date3, step) => {
        date3.setTime(+date3 + step);
      }, (start2, end) => {
        return end - start2;
      });
      millisecond.every = (k) => {
        k = Math.floor(k);
        if (!isFinite(k) || !(k > 0))
          return null;
        if (!(k > 1))
          return millisecond;
        return timeInterval((date3) => {
          date3.setTime(Math.floor(date3 / k) * k);
        }, (date3, step) => {
          date3.setTime(+date3 + step * k);
        }, (start2, end) => {
          return (end - start2) / k;
        });
      };
      milliseconds = millisecond.range;
    }
  });

  // node_modules/d3-time/src/duration.js
  var durationSecond, durationMinute, durationHour, durationDay, durationWeek, durationMonth, durationYear;
  var init_duration2 = __esm({
    "node_modules/d3-time/src/duration.js"() {
      durationSecond = 1e3;
      durationMinute = durationSecond * 60;
      durationHour = durationMinute * 60;
      durationDay = durationHour * 24;
      durationWeek = durationDay * 7;
      durationMonth = durationDay * 30;
      durationYear = durationDay * 365;
    }
  });

  // node_modules/d3-time/src/second.js
  var second, seconds;
  var init_second = __esm({
    "node_modules/d3-time/src/second.js"() {
      init_interval();
      init_duration2();
      second = timeInterval((date3) => {
        date3.setTime(date3 - date3.getMilliseconds());
      }, (date3, step) => {
        date3.setTime(+date3 + step * durationSecond);
      }, (start2, end) => {
        return (end - start2) / durationSecond;
      }, (date3) => {
        return date3.getUTCSeconds();
      });
      seconds = second.range;
    }
  });

  // node_modules/d3-time/src/minute.js
  var timeMinute, timeMinutes, utcMinute, utcMinutes;
  var init_minute = __esm({
    "node_modules/d3-time/src/minute.js"() {
      init_interval();
      init_duration2();
      timeMinute = timeInterval((date3) => {
        date3.setTime(date3 - date3.getMilliseconds() - date3.getSeconds() * durationSecond);
      }, (date3, step) => {
        date3.setTime(+date3 + step * durationMinute);
      }, (start2, end) => {
        return (end - start2) / durationMinute;
      }, (date3) => {
        return date3.getMinutes();
      });
      timeMinutes = timeMinute.range;
      utcMinute = timeInterval((date3) => {
        date3.setUTCSeconds(0, 0);
      }, (date3, step) => {
        date3.setTime(+date3 + step * durationMinute);
      }, (start2, end) => {
        return (end - start2) / durationMinute;
      }, (date3) => {
        return date3.getUTCMinutes();
      });
      utcMinutes = utcMinute.range;
    }
  });

  // node_modules/d3-time/src/hour.js
  var timeHour, timeHours, utcHour, utcHours;
  var init_hour = __esm({
    "node_modules/d3-time/src/hour.js"() {
      init_interval();
      init_duration2();
      timeHour = timeInterval((date3) => {
        date3.setTime(date3 - date3.getMilliseconds() - date3.getSeconds() * durationSecond - date3.getMinutes() * durationMinute);
      }, (date3, step) => {
        date3.setTime(+date3 + step * durationHour);
      }, (start2, end) => {
        return (end - start2) / durationHour;
      }, (date3) => {
        return date3.getHours();
      });
      timeHours = timeHour.range;
      utcHour = timeInterval((date3) => {
        date3.setUTCMinutes(0, 0, 0);
      }, (date3, step) => {
        date3.setTime(+date3 + step * durationHour);
      }, (start2, end) => {
        return (end - start2) / durationHour;
      }, (date3) => {
        return date3.getUTCHours();
      });
      utcHours = utcHour.range;
    }
  });

  // node_modules/d3-time/src/day.js
  var timeDay, timeDays, utcDay, utcDays, unixDay, unixDays;
  var init_day = __esm({
    "node_modules/d3-time/src/day.js"() {
      init_interval();
      init_duration2();
      timeDay = timeInterval(
        (date3) => date3.setHours(0, 0, 0, 0),
        (date3, step) => date3.setDate(date3.getDate() + step),
        (start2, end) => (end - start2 - (end.getTimezoneOffset() - start2.getTimezoneOffset()) * durationMinute) / durationDay,
        (date3) => date3.getDate() - 1
      );
      timeDays = timeDay.range;
      utcDay = timeInterval((date3) => {
        date3.setUTCHours(0, 0, 0, 0);
      }, (date3, step) => {
        date3.setUTCDate(date3.getUTCDate() + step);
      }, (start2, end) => {
        return (end - start2) / durationDay;
      }, (date3) => {
        return date3.getUTCDate() - 1;
      });
      utcDays = utcDay.range;
      unixDay = timeInterval((date3) => {
        date3.setUTCHours(0, 0, 0, 0);
      }, (date3, step) => {
        date3.setUTCDate(date3.getUTCDate() + step);
      }, (start2, end) => {
        return (end - start2) / durationDay;
      }, (date3) => {
        return Math.floor(date3 / durationDay);
      });
      unixDays = unixDay.range;
    }
  });

  // node_modules/d3-time/src/week.js
  function timeWeekday(i2) {
    return timeInterval((date3) => {
      date3.setDate(date3.getDate() - (date3.getDay() + 7 - i2) % 7);
      date3.setHours(0, 0, 0, 0);
    }, (date3, step) => {
      date3.setDate(date3.getDate() + step * 7);
    }, (start2, end) => {
      return (end - start2 - (end.getTimezoneOffset() - start2.getTimezoneOffset()) * durationMinute) / durationWeek;
    });
  }
  function utcWeekday(i2) {
    return timeInterval((date3) => {
      date3.setUTCDate(date3.getUTCDate() - (date3.getUTCDay() + 7 - i2) % 7);
      date3.setUTCHours(0, 0, 0, 0);
    }, (date3, step) => {
      date3.setUTCDate(date3.getUTCDate() + step * 7);
    }, (start2, end) => {
      return (end - start2) / durationWeek;
    });
  }
  var timeSunday, timeMonday, timeTuesday, timeWednesday, timeThursday, timeFriday, timeSaturday, timeSundays, timeMondays, timeTuesdays, timeWednesdays, timeThursdays, timeFridays, timeSaturdays, utcSunday, utcMonday, utcTuesday, utcWednesday, utcThursday, utcFriday, utcSaturday, utcSundays, utcMondays, utcTuesdays, utcWednesdays, utcThursdays, utcFridays, utcSaturdays;
  var init_week = __esm({
    "node_modules/d3-time/src/week.js"() {
      init_interval();
      init_duration2();
      timeSunday = timeWeekday(0);
      timeMonday = timeWeekday(1);
      timeTuesday = timeWeekday(2);
      timeWednesday = timeWeekday(3);
      timeThursday = timeWeekday(4);
      timeFriday = timeWeekday(5);
      timeSaturday = timeWeekday(6);
      timeSundays = timeSunday.range;
      timeMondays = timeMonday.range;
      timeTuesdays = timeTuesday.range;
      timeWednesdays = timeWednesday.range;
      timeThursdays = timeThursday.range;
      timeFridays = timeFriday.range;
      timeSaturdays = timeSaturday.range;
      utcSunday = utcWeekday(0);
      utcMonday = utcWeekday(1);
      utcTuesday = utcWeekday(2);
      utcWednesday = utcWeekday(3);
      utcThursday = utcWeekday(4);
      utcFriday = utcWeekday(5);
      utcSaturday = utcWeekday(6);
      utcSundays = utcSunday.range;
      utcMondays = utcMonday.range;
      utcTuesdays = utcTuesday.range;
      utcWednesdays = utcWednesday.range;
      utcThursdays = utcThursday.range;
      utcFridays = utcFriday.range;
      utcSaturdays = utcSaturday.range;
    }
  });

  // node_modules/d3-time/src/month.js
  var timeMonth, timeMonths, utcMonth, utcMonths;
  var init_month = __esm({
    "node_modules/d3-time/src/month.js"() {
      init_interval();
      timeMonth = timeInterval((date3) => {
        date3.setDate(1);
        date3.setHours(0, 0, 0, 0);
      }, (date3, step) => {
        date3.setMonth(date3.getMonth() + step);
      }, (start2, end) => {
        return end.getMonth() - start2.getMonth() + (end.getFullYear() - start2.getFullYear()) * 12;
      }, (date3) => {
        return date3.getMonth();
      });
      timeMonths = timeMonth.range;
      utcMonth = timeInterval((date3) => {
        date3.setUTCDate(1);
        date3.setUTCHours(0, 0, 0, 0);
      }, (date3, step) => {
        date3.setUTCMonth(date3.getUTCMonth() + step);
      }, (start2, end) => {
        return end.getUTCMonth() - start2.getUTCMonth() + (end.getUTCFullYear() - start2.getUTCFullYear()) * 12;
      }, (date3) => {
        return date3.getUTCMonth();
      });
      utcMonths = utcMonth.range;
    }
  });

  // node_modules/d3-time/src/year.js
  var timeYear, timeYears, utcYear, utcYears;
  var init_year = __esm({
    "node_modules/d3-time/src/year.js"() {
      init_interval();
      timeYear = timeInterval((date3) => {
        date3.setMonth(0, 1);
        date3.setHours(0, 0, 0, 0);
      }, (date3, step) => {
        date3.setFullYear(date3.getFullYear() + step);
      }, (start2, end) => {
        return end.getFullYear() - start2.getFullYear();
      }, (date3) => {
        return date3.getFullYear();
      });
      timeYear.every = (k) => {
        return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : timeInterval((date3) => {
          date3.setFullYear(Math.floor(date3.getFullYear() / k) * k);
          date3.setMonth(0, 1);
          date3.setHours(0, 0, 0, 0);
        }, (date3, step) => {
          date3.setFullYear(date3.getFullYear() + step * k);
        });
      };
      timeYears = timeYear.range;
      utcYear = timeInterval((date3) => {
        date3.setUTCMonth(0, 1);
        date3.setUTCHours(0, 0, 0, 0);
      }, (date3, step) => {
        date3.setUTCFullYear(date3.getUTCFullYear() + step);
      }, (start2, end) => {
        return end.getUTCFullYear() - start2.getUTCFullYear();
      }, (date3) => {
        return date3.getUTCFullYear();
      });
      utcYear.every = (k) => {
        return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : timeInterval((date3) => {
          date3.setUTCFullYear(Math.floor(date3.getUTCFullYear() / k) * k);
          date3.setUTCMonth(0, 1);
          date3.setUTCHours(0, 0, 0, 0);
        }, (date3, step) => {
          date3.setUTCFullYear(date3.getUTCFullYear() + step * k);
        });
      };
      utcYears = utcYear.range;
    }
  });

  // node_modules/d3-time/src/ticks.js
  function ticker(year, month, week, day, hour, minute) {
    const tickIntervals = [
      [second, 1, durationSecond],
      [second, 5, 5 * durationSecond],
      [second, 15, 15 * durationSecond],
      [second, 30, 30 * durationSecond],
      [minute, 1, durationMinute],
      [minute, 5, 5 * durationMinute],
      [minute, 15, 15 * durationMinute],
      [minute, 30, 30 * durationMinute],
      [hour, 1, durationHour],
      [hour, 3, 3 * durationHour],
      [hour, 6, 6 * durationHour],
      [hour, 12, 12 * durationHour],
      [day, 1, durationDay],
      [day, 2, 2 * durationDay],
      [week, 1, durationWeek],
      [month, 1, durationMonth],
      [month, 3, 3 * durationMonth],
      [year, 1, durationYear]
    ];
    function ticks2(start2, stop, count) {
      const reverse = stop < start2;
      if (reverse)
        [start2, stop] = [stop, start2];
      const interval2 = count && typeof count.range === "function" ? count : tickInterval(start2, stop, count);
      const ticks3 = interval2 ? interval2.range(start2, +stop + 1) : [];
      return reverse ? ticks3.reverse() : ticks3;
    }
    function tickInterval(start2, stop, count) {
      const target = Math.abs(stop - start2) / count;
      const i2 = bisector(([, , step2]) => step2).right(tickIntervals, target);
      if (i2 === tickIntervals.length)
        return year.every(tickStep(start2 / durationYear, stop / durationYear, count));
      if (i2 === 0)
        return millisecond.every(Math.max(tickStep(start2, stop, count), 1));
      const [t, step] = tickIntervals[target / tickIntervals[i2 - 1][2] < tickIntervals[i2][2] / target ? i2 - 1 : i2];
      return t.every(step);
    }
    return [ticks2, tickInterval];
  }
  var utcTicks, utcTickInterval, timeTicks, timeTickInterval;
  var init_ticks2 = __esm({
    "node_modules/d3-time/src/ticks.js"() {
      init_src2();
      init_duration2();
      init_millisecond();
      init_second();
      init_minute();
      init_hour();
      init_day();
      init_week();
      init_month();
      init_year();
      [utcTicks, utcTickInterval] = ticker(utcYear, utcMonth, utcSunday, unixDay, utcHour, utcMinute);
      [timeTicks, timeTickInterval] = ticker(timeYear, timeMonth, timeSunday, timeDay, timeHour, timeMinute);
    }
  });

  // node_modules/d3-time/src/index.js
  var init_src26 = __esm({
    "node_modules/d3-time/src/index.js"() {
      init_second();
      init_minute();
      init_hour();
      init_day();
      init_week();
      init_month();
      init_year();
      init_ticks2();
    }
  });

  // node_modules/d3-time-format/src/locale.js
  function localDate(d) {
    if (0 <= d.y && d.y < 100) {
      var date3 = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
      date3.setFullYear(d.y);
      return date3;
    }
    return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
  }
  function utcDate(d) {
    if (0 <= d.y && d.y < 100) {
      var date3 = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
      date3.setUTCFullYear(d.y);
      return date3;
    }
    return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
  }
  function newDate(y2, m, d) {
    return { y: y2, m, d, H: 0, M: 0, S: 0, L: 0 };
  }
  function formatLocale(locale3) {
    var locale_dateTime = locale3.dateTime, locale_date = locale3.date, locale_time = locale3.time, locale_periods = locale3.periods, locale_weekdays = locale3.days, locale_shortWeekdays = locale3.shortDays, locale_months = locale3.months, locale_shortMonths = locale3.shortMonths;
    var periodRe = formatRe(locale_periods), periodLookup = formatLookup(locale_periods), weekdayRe = formatRe(locale_weekdays), weekdayLookup = formatLookup(locale_weekdays), shortWeekdayRe = formatRe(locale_shortWeekdays), shortWeekdayLookup = formatLookup(locale_shortWeekdays), monthRe = formatRe(locale_months), monthLookup = formatLookup(locale_months), shortMonthRe = formatRe(locale_shortMonths), shortMonthLookup = formatLookup(locale_shortMonths);
    var formats = {
      "a": formatShortWeekday,
      "A": formatWeekday,
      "b": formatShortMonth,
      "B": formatMonth,
      "c": null,
      "d": formatDayOfMonth,
      "e": formatDayOfMonth,
      "f": formatMicroseconds,
      "g": formatYearISO,
      "G": formatFullYearISO,
      "H": formatHour24,
      "I": formatHour12,
      "j": formatDayOfYear,
      "L": formatMilliseconds,
      "m": formatMonthNumber,
      "M": formatMinutes,
      "p": formatPeriod,
      "q": formatQuarter,
      "Q": formatUnixTimestamp,
      "s": formatUnixTimestampSeconds,
      "S": formatSeconds,
      "u": formatWeekdayNumberMonday,
      "U": formatWeekNumberSunday,
      "V": formatWeekNumberISO,
      "w": formatWeekdayNumberSunday,
      "W": formatWeekNumberMonday,
      "x": null,
      "X": null,
      "y": formatYear,
      "Y": formatFullYear,
      "Z": formatZone,
      "%": formatLiteralPercent
    };
    var utcFormats = {
      "a": formatUTCShortWeekday,
      "A": formatUTCWeekday,
      "b": formatUTCShortMonth,
      "B": formatUTCMonth,
      "c": null,
      "d": formatUTCDayOfMonth,
      "e": formatUTCDayOfMonth,
      "f": formatUTCMicroseconds,
      "g": formatUTCYearISO,
      "G": formatUTCFullYearISO,
      "H": formatUTCHour24,
      "I": formatUTCHour12,
      "j": formatUTCDayOfYear,
      "L": formatUTCMilliseconds,
      "m": formatUTCMonthNumber,
      "M": formatUTCMinutes,
      "p": formatUTCPeriod,
      "q": formatUTCQuarter,
      "Q": formatUnixTimestamp,
      "s": formatUnixTimestampSeconds,
      "S": formatUTCSeconds,
      "u": formatUTCWeekdayNumberMonday,
      "U": formatUTCWeekNumberSunday,
      "V": formatUTCWeekNumberISO,
      "w": formatUTCWeekdayNumberSunday,
      "W": formatUTCWeekNumberMonday,
      "x": null,
      "X": null,
      "y": formatUTCYear,
      "Y": formatUTCFullYear,
      "Z": formatUTCZone,
      "%": formatLiteralPercent
    };
    var parses = {
      "a": parseShortWeekday,
      "A": parseWeekday,
      "b": parseShortMonth,
      "B": parseMonth,
      "c": parseLocaleDateTime,
      "d": parseDayOfMonth,
      "e": parseDayOfMonth,
      "f": parseMicroseconds,
      "g": parseYear,
      "G": parseFullYear,
      "H": parseHour24,
      "I": parseHour24,
      "j": parseDayOfYear,
      "L": parseMilliseconds,
      "m": parseMonthNumber,
      "M": parseMinutes,
      "p": parsePeriod,
      "q": parseQuarter,
      "Q": parseUnixTimestamp,
      "s": parseUnixTimestampSeconds,
      "S": parseSeconds,
      "u": parseWeekdayNumberMonday,
      "U": parseWeekNumberSunday,
      "V": parseWeekNumberISO,
      "w": parseWeekdayNumberSunday,
      "W": parseWeekNumberMonday,
      "x": parseLocaleDate,
      "X": parseLocaleTime,
      "y": parseYear,
      "Y": parseFullYear,
      "Z": parseZone,
      "%": parseLiteralPercent
    };
    formats.x = newFormat(locale_date, formats);
    formats.X = newFormat(locale_time, formats);
    formats.c = newFormat(locale_dateTime, formats);
    utcFormats.x = newFormat(locale_date, utcFormats);
    utcFormats.X = newFormat(locale_time, utcFormats);
    utcFormats.c = newFormat(locale_dateTime, utcFormats);
    function newFormat(specifier, formats2) {
      return function(date3) {
        var string2 = [], i2 = -1, j2 = 0, n = specifier.length, c, pad2, format2;
        if (!(date3 instanceof Date))
          date3 = new Date(+date3);
        while (++i2 < n) {
          if (specifier.charCodeAt(i2) === 37) {
            string2.push(specifier.slice(j2, i2));
            if ((pad2 = pads[c = specifier.charAt(++i2)]) != null)
              c = specifier.charAt(++i2);
            else
              pad2 = c === "e" ? " " : "0";
            if (format2 = formats2[c])
              c = format2(date3, pad2);
            string2.push(c);
            j2 = i2 + 1;
          }
        }
        string2.push(specifier.slice(j2, i2));
        return string2.join("");
      };
    }
    function newParse(specifier, Z) {
      return function(string2) {
        var d = newDate(1900, void 0, 1), i2 = parseSpecifier(d, specifier, string2 += "", 0), week, day;
        if (i2 != string2.length)
          return null;
        if ("Q" in d)
          return new Date(d.Q);
        if ("s" in d)
          return new Date(d.s * 1e3 + ("L" in d ? d.L : 0));
        if (Z && !("Z" in d))
          d.Z = 0;
        if ("p" in d)
          d.H = d.H % 12 + d.p * 12;
        if (d.m === void 0)
          d.m = "q" in d ? d.q : 0;
        if ("V" in d) {
          if (d.V < 1 || d.V > 53)
            return null;
          if (!("w" in d))
            d.w = 1;
          if ("Z" in d) {
            week = utcDate(newDate(d.y, 0, 1)), day = week.getUTCDay();
            week = day > 4 || day === 0 ? utcMonday.ceil(week) : utcMonday(week);
            week = utcDay.offset(week, (d.V - 1) * 7);
            d.y = week.getUTCFullYear();
            d.m = week.getUTCMonth();
            d.d = week.getUTCDate() + (d.w + 6) % 7;
          } else {
            week = localDate(newDate(d.y, 0, 1)), day = week.getDay();
            week = day > 4 || day === 0 ? timeMonday.ceil(week) : timeMonday(week);
            week = timeDay.offset(week, (d.V - 1) * 7);
            d.y = week.getFullYear();
            d.m = week.getMonth();
            d.d = week.getDate() + (d.w + 6) % 7;
          }
        } else if ("W" in d || "U" in d) {
          if (!("w" in d))
            d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
          day = "Z" in d ? utcDate(newDate(d.y, 0, 1)).getUTCDay() : localDate(newDate(d.y, 0, 1)).getDay();
          d.m = 0;
          d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day + 5) % 7 : d.w + d.U * 7 - (day + 6) % 7;
        }
        if ("Z" in d) {
          d.H += d.Z / 100 | 0;
          d.M += d.Z % 100;
          return utcDate(d);
        }
        return localDate(d);
      };
    }
    function parseSpecifier(d, specifier, string2, j2) {
      var i2 = 0, n = specifier.length, m = string2.length, c, parse;
      while (i2 < n) {
        if (j2 >= m)
          return -1;
        c = specifier.charCodeAt(i2++);
        if (c === 37) {
          c = specifier.charAt(i2++);
          parse = parses[c in pads ? specifier.charAt(i2++) : c];
          if (!parse || (j2 = parse(d, string2, j2)) < 0)
            return -1;
        } else if (c != string2.charCodeAt(j2++)) {
          return -1;
        }
      }
      return j2;
    }
    function parsePeriod(d, string2, i2) {
      var n = periodRe.exec(string2.slice(i2));
      return n ? (d.p = periodLookup.get(n[0].toLowerCase()), i2 + n[0].length) : -1;
    }
    function parseShortWeekday(d, string2, i2) {
      var n = shortWeekdayRe.exec(string2.slice(i2));
      return n ? (d.w = shortWeekdayLookup.get(n[0].toLowerCase()), i2 + n[0].length) : -1;
    }
    function parseWeekday(d, string2, i2) {
      var n = weekdayRe.exec(string2.slice(i2));
      return n ? (d.w = weekdayLookup.get(n[0].toLowerCase()), i2 + n[0].length) : -1;
    }
    function parseShortMonth(d, string2, i2) {
      var n = shortMonthRe.exec(string2.slice(i2));
      return n ? (d.m = shortMonthLookup.get(n[0].toLowerCase()), i2 + n[0].length) : -1;
    }
    function parseMonth(d, string2, i2) {
      var n = monthRe.exec(string2.slice(i2));
      return n ? (d.m = monthLookup.get(n[0].toLowerCase()), i2 + n[0].length) : -1;
    }
    function parseLocaleDateTime(d, string2, i2) {
      return parseSpecifier(d, locale_dateTime, string2, i2);
    }
    function parseLocaleDate(d, string2, i2) {
      return parseSpecifier(d, locale_date, string2, i2);
    }
    function parseLocaleTime(d, string2, i2) {
      return parseSpecifier(d, locale_time, string2, i2);
    }
    function formatShortWeekday(d) {
      return locale_shortWeekdays[d.getDay()];
    }
    function formatWeekday(d) {
      return locale_weekdays[d.getDay()];
    }
    function formatShortMonth(d) {
      return locale_shortMonths[d.getMonth()];
    }
    function formatMonth(d) {
      return locale_months[d.getMonth()];
    }
    function formatPeriod(d) {
      return locale_periods[+(d.getHours() >= 12)];
    }
    function formatQuarter(d) {
      return 1 + ~~(d.getMonth() / 3);
    }
    function formatUTCShortWeekday(d) {
      return locale_shortWeekdays[d.getUTCDay()];
    }
    function formatUTCWeekday(d) {
      return locale_weekdays[d.getUTCDay()];
    }
    function formatUTCShortMonth(d) {
      return locale_shortMonths[d.getUTCMonth()];
    }
    function formatUTCMonth(d) {
      return locale_months[d.getUTCMonth()];
    }
    function formatUTCPeriod(d) {
      return locale_periods[+(d.getUTCHours() >= 12)];
    }
    function formatUTCQuarter(d) {
      return 1 + ~~(d.getUTCMonth() / 3);
    }
    return {
      format: function(specifier) {
        var f = newFormat(specifier += "", formats);
        f.toString = function() {
          return specifier;
        };
        return f;
      },
      parse: function(specifier) {
        var p = newParse(specifier += "", false);
        p.toString = function() {
          return specifier;
        };
        return p;
      },
      utcFormat: function(specifier) {
        var f = newFormat(specifier += "", utcFormats);
        f.toString = function() {
          return specifier;
        };
        return f;
      },
      utcParse: function(specifier) {
        var p = newParse(specifier += "", true);
        p.toString = function() {
          return specifier;
        };
        return p;
      }
    };
  }
  function pad(value, fill, width) {
    var sign2 = value < 0 ? "-" : "", string2 = (sign2 ? -value : value) + "", length = string2.length;
    return sign2 + (length < width ? new Array(width - length + 1).join(fill) + string2 : string2);
  }
  function requote(s) {
    return s.replace(requoteRe, "\\$&");
  }
  function formatRe(names) {
    return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
  }
  function formatLookup(names) {
    return new Map(names.map((name, i2) => [name.toLowerCase(), i2]));
  }
  function parseWeekdayNumberSunday(d, string2, i2) {
    var n = numberRe.exec(string2.slice(i2, i2 + 1));
    return n ? (d.w = +n[0], i2 + n[0].length) : -1;
  }
  function parseWeekdayNumberMonday(d, string2, i2) {
    var n = numberRe.exec(string2.slice(i2, i2 + 1));
    return n ? (d.u = +n[0], i2 + n[0].length) : -1;
  }
  function parseWeekNumberSunday(d, string2, i2) {
    var n = numberRe.exec(string2.slice(i2, i2 + 2));
    return n ? (d.U = +n[0], i2 + n[0].length) : -1;
  }
  function parseWeekNumberISO(d, string2, i2) {
    var n = numberRe.exec(string2.slice(i2, i2 + 2));
    return n ? (d.V = +n[0], i2 + n[0].length) : -1;
  }
  function parseWeekNumberMonday(d, string2, i2) {
    var n = numberRe.exec(string2.slice(i2, i2 + 2));
    return n ? (d.W = +n[0], i2 + n[0].length) : -1;
  }
  function parseFullYear(d, string2, i2) {
    var n = numberRe.exec(string2.slice(i2, i2 + 4));
    return n ? (d.y = +n[0], i2 + n[0].length) : -1;
  }
  function parseYear(d, string2, i2) {
    var n = numberRe.exec(string2.slice(i2, i2 + 2));
    return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2e3), i2 + n[0].length) : -1;
  }
  function parseZone(d, string2, i2) {
    var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string2.slice(i2, i2 + 6));
    return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i2 + n[0].length) : -1;
  }
  function parseQuarter(d, string2, i2) {
    var n = numberRe.exec(string2.slice(i2, i2 + 1));
    return n ? (d.q = n[0] * 3 - 3, i2 + n[0].length) : -1;
  }
  function parseMonthNumber(d, string2, i2) {
    var n = numberRe.exec(string2.slice(i2, i2 + 2));
    return n ? (d.m = n[0] - 1, i2 + n[0].length) : -1;
  }
  function parseDayOfMonth(d, string2, i2) {
    var n = numberRe.exec(string2.slice(i2, i2 + 2));
    return n ? (d.d = +n[0], i2 + n[0].length) : -1;
  }
  function parseDayOfYear(d, string2, i2) {
    var n = numberRe.exec(string2.slice(i2, i2 + 3));
    return n ? (d.m = 0, d.d = +n[0], i2 + n[0].length) : -1;
  }
  function parseHour24(d, string2, i2) {
    var n = numberRe.exec(string2.slice(i2, i2 + 2));
    return n ? (d.H = +n[0], i2 + n[0].length) : -1;
  }
  function parseMinutes(d, string2, i2) {
    var n = numberRe.exec(string2.slice(i2, i2 + 2));
    return n ? (d.M = +n[0], i2 + n[0].length) : -1;
  }
  function parseSeconds(d, string2, i2) {
    var n = numberRe.exec(string2.slice(i2, i2 + 2));
    return n ? (d.S = +n[0], i2 + n[0].length) : -1;
  }
  function parseMilliseconds(d, string2, i2) {
    var n = numberRe.exec(string2.slice(i2, i2 + 3));
    return n ? (d.L = +n[0], i2 + n[0].length) : -1;
  }
  function parseMicroseconds(d, string2, i2) {
    var n = numberRe.exec(string2.slice(i2, i2 + 6));
    return n ? (d.L = Math.floor(n[0] / 1e3), i2 + n[0].length) : -1;
  }
  function parseLiteralPercent(d, string2, i2) {
    var n = percentRe.exec(string2.slice(i2, i2 + 1));
    return n ? i2 + n[0].length : -1;
  }
  function parseUnixTimestamp(d, string2, i2) {
    var n = numberRe.exec(string2.slice(i2));
    return n ? (d.Q = +n[0], i2 + n[0].length) : -1;
  }
  function parseUnixTimestampSeconds(d, string2, i2) {
    var n = numberRe.exec(string2.slice(i2));
    return n ? (d.s = +n[0], i2 + n[0].length) : -1;
  }
  function formatDayOfMonth(d, p) {
    return pad(d.getDate(), p, 2);
  }
  function formatHour24(d, p) {
    return pad(d.getHours(), p, 2);
  }
  function formatHour12(d, p) {
    return pad(d.getHours() % 12 || 12, p, 2);
  }
  function formatDayOfYear(d, p) {
    return pad(1 + timeDay.count(timeYear(d), d), p, 3);
  }
  function formatMilliseconds(d, p) {
    return pad(d.getMilliseconds(), p, 3);
  }
  function formatMicroseconds(d, p) {
    return formatMilliseconds(d, p) + "000";
  }
  function formatMonthNumber(d, p) {
    return pad(d.getMonth() + 1, p, 2);
  }
  function formatMinutes(d, p) {
    return pad(d.getMinutes(), p, 2);
  }
  function formatSeconds(d, p) {
    return pad(d.getSeconds(), p, 2);
  }
  function formatWeekdayNumberMonday(d) {
    var day = d.getDay();
    return day === 0 ? 7 : day;
  }
  function formatWeekNumberSunday(d, p) {
    return pad(timeSunday.count(timeYear(d) - 1, d), p, 2);
  }
  function dISO(d) {
    var day = d.getDay();
    return day >= 4 || day === 0 ? timeThursday(d) : timeThursday.ceil(d);
  }
  function formatWeekNumberISO(d, p) {
    d = dISO(d);
    return pad(timeThursday.count(timeYear(d), d) + (timeYear(d).getDay() === 4), p, 2);
  }
  function formatWeekdayNumberSunday(d) {
    return d.getDay();
  }
  function formatWeekNumberMonday(d, p) {
    return pad(timeMonday.count(timeYear(d) - 1, d), p, 2);
  }
  function formatYear(d, p) {
    return pad(d.getFullYear() % 100, p, 2);
  }
  function formatYearISO(d, p) {
    d = dISO(d);
    return pad(d.getFullYear() % 100, p, 2);
  }
  function formatFullYear(d, p) {
    return pad(d.getFullYear() % 1e4, p, 4);
  }
  function formatFullYearISO(d, p) {
    var day = d.getDay();
    d = day >= 4 || day === 0 ? timeThursday(d) : timeThursday.ceil(d);
    return pad(d.getFullYear() % 1e4, p, 4);
  }
  function formatZone(d) {
    var z = d.getTimezoneOffset();
    return (z > 0 ? "-" : (z *= -1, "+")) + pad(z / 60 | 0, "0", 2) + pad(z % 60, "0", 2);
  }
  function formatUTCDayOfMonth(d, p) {
    return pad(d.getUTCDate(), p, 2);
  }
  function formatUTCHour24(d, p) {
    return pad(d.getUTCHours(), p, 2);
  }
  function formatUTCHour12(d, p) {
    return pad(d.getUTCHours() % 12 || 12, p, 2);
  }
  function formatUTCDayOfYear(d, p) {
    return pad(1 + utcDay.count(utcYear(d), d), p, 3);
  }
  function formatUTCMilliseconds(d, p) {
    return pad(d.getUTCMilliseconds(), p, 3);
  }
  function formatUTCMicroseconds(d, p) {
    return formatUTCMilliseconds(d, p) + "000";
  }
  function formatUTCMonthNumber(d, p) {
    return pad(d.getUTCMonth() + 1, p, 2);
  }
  function formatUTCMinutes(d, p) {
    return pad(d.getUTCMinutes(), p, 2);
  }
  function formatUTCSeconds(d, p) {
    return pad(d.getUTCSeconds(), p, 2);
  }
  function formatUTCWeekdayNumberMonday(d) {
    var dow = d.getUTCDay();
    return dow === 0 ? 7 : dow;
  }
  function formatUTCWeekNumberSunday(d, p) {
    return pad(utcSunday.count(utcYear(d) - 1, d), p, 2);
  }
  function UTCdISO(d) {
    var day = d.getUTCDay();
    return day >= 4 || day === 0 ? utcThursday(d) : utcThursday.ceil(d);
  }
  function formatUTCWeekNumberISO(d, p) {
    d = UTCdISO(d);
    return pad(utcThursday.count(utcYear(d), d) + (utcYear(d).getUTCDay() === 4), p, 2);
  }
  function formatUTCWeekdayNumberSunday(d) {
    return d.getUTCDay();
  }
  function formatUTCWeekNumberMonday(d, p) {
    return pad(utcMonday.count(utcYear(d) - 1, d), p, 2);
  }
  function formatUTCYear(d, p) {
    return pad(d.getUTCFullYear() % 100, p, 2);
  }
  function formatUTCYearISO(d, p) {
    d = UTCdISO(d);
    return pad(d.getUTCFullYear() % 100, p, 2);
  }
  function formatUTCFullYear(d, p) {
    return pad(d.getUTCFullYear() % 1e4, p, 4);
  }
  function formatUTCFullYearISO(d, p) {
    var day = d.getUTCDay();
    d = day >= 4 || day === 0 ? utcThursday(d) : utcThursday.ceil(d);
    return pad(d.getUTCFullYear() % 1e4, p, 4);
  }
  function formatUTCZone() {
    return "+0000";
  }
  function formatLiteralPercent() {
    return "%";
  }
  function formatUnixTimestamp(d) {
    return +d;
  }
  function formatUnixTimestampSeconds(d) {
    return Math.floor(+d / 1e3);
  }
  var pads, numberRe, percentRe, requoteRe;
  var init_locale2 = __esm({
    "node_modules/d3-time-format/src/locale.js"() {
      init_src26();
      pads = { "-": "", "_": " ", "0": "0" };
      numberRe = /^\s*\d+/;
      percentRe = /^%/;
      requoteRe = /[\\^$*+?|[\]().{}]/g;
    }
  });

  // node_modules/d3-time-format/src/defaultLocale.js
  function defaultLocale2(definition) {
    locale2 = formatLocale(definition);
    timeFormat = locale2.format;
    timeParse = locale2.parse;
    utcFormat = locale2.utcFormat;
    utcParse = locale2.utcParse;
    return locale2;
  }
  var locale2, timeFormat, timeParse, utcFormat, utcParse;
  var init_defaultLocale2 = __esm({
    "node_modules/d3-time-format/src/defaultLocale.js"() {
      init_locale2();
      defaultLocale2({
        dateTime: "%x, %X",
        date: "%-m/%-d/%Y",
        time: "%-I:%M:%S %p",
        periods: ["AM", "PM"],
        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      });
    }
  });

  // node_modules/d3-time-format/src/index.js
  var init_src27 = __esm({
    "node_modules/d3-time-format/src/index.js"() {
      init_defaultLocale2();
    }
  });

  // node_modules/d3-scale/src/time.js
  function date2(t) {
    return new Date(t);
  }
  function number4(t) {
    return t instanceof Date ? +t : +new Date(+t);
  }
  function calendar(ticks2, tickInterval, year, month, week, day, hour, minute, second2, format2) {
    var scale = continuous(), invert = scale.invert, domain = scale.domain;
    var formatMillisecond = format2(".%L"), formatSecond = format2(":%S"), formatMinute = format2("%I:%M"), formatHour = format2("%I %p"), formatDay = format2("%a %d"), formatWeek = format2("%b %d"), formatMonth = format2("%B"), formatYear2 = format2("%Y");
    function tickFormat2(date3) {
      return (second2(date3) < date3 ? formatMillisecond : minute(date3) < date3 ? formatSecond : hour(date3) < date3 ? formatMinute : day(date3) < date3 ? formatHour : month(date3) < date3 ? week(date3) < date3 ? formatDay : formatWeek : year(date3) < date3 ? formatMonth : formatYear2)(date3);
    }
    scale.invert = function(y2) {
      return new Date(invert(y2));
    };
    scale.domain = function(_) {
      return arguments.length ? domain(Array.from(_, number4)) : domain().map(date2);
    };
    scale.ticks = function(interval2) {
      var d = domain();
      return ticks2(d[0], d[d.length - 1], interval2 == null ? 10 : interval2);
    };
    scale.tickFormat = function(count, specifier) {
      return specifier == null ? tickFormat2 : format2(specifier);
    };
    scale.nice = function(interval2) {
      var d = domain();
      if (!interval2 || typeof interval2.range !== "function")
        interval2 = tickInterval(d[0], d[d.length - 1], interval2 == null ? 10 : interval2);
      return interval2 ? domain(nice(d, interval2)) : scale;
    };
    scale.copy = function() {
      return copy(scale, calendar(ticks2, tickInterval, year, month, week, day, hour, minute, second2, format2));
    };
    return scale;
  }
  var init_time = __esm({
    "node_modules/d3-scale/src/time.js"() {
      init_continuous();
      init_nice();
    }
  });

  // node_modules/d3-scale/src/utcTime.js
  function utcTime() {
    return initRange.apply(calendar(utcTicks, utcTickInterval, utcYear, utcMonth, utcSunday, utcDay, utcHour, utcMinute, second, utcFormat).domain([Date.UTC(2e3, 0, 1), Date.UTC(2e3, 0, 2)]), arguments);
  }
  var init_utcTime = __esm({
    "node_modules/d3-scale/src/utcTime.js"() {
      init_src26();
      init_src27();
      init_time();
      init_init();
    }
  });

  // node_modules/d3-scale/src/sequential.js
  function transformer2() {
    var x0 = 0, x1 = 1, t02, t12, k10, transform2, interpolator = identity2, clamp = false, unknown;
    function scale(x2) {
      return x2 == null || isNaN(x2 = +x2) ? unknown : interpolator(k10 === 0 ? 0.5 : (x2 = (transform2(x2) - t02) * k10, clamp ? Math.max(0, Math.min(1, x2)) : x2));
    }
    scale.domain = function(_) {
      return arguments.length ? ([x0, x1] = _, t02 = transform2(x0 = +x0), t12 = transform2(x1 = +x1), k10 = t02 === t12 ? 0 : 1 / (t12 - t02), scale) : [x0, x1];
    };
    scale.clamp = function(_) {
      return arguments.length ? (clamp = !!_, scale) : clamp;
    };
    scale.interpolator = function(_) {
      return arguments.length ? (interpolator = _, scale) : interpolator;
    };
    function range3(interpolate) {
      return function(_) {
        var r0, r1;
        return arguments.length ? ([r0, r1] = _, interpolator = interpolate(r0, r1), scale) : [interpolator(0), interpolator(1)];
      };
    }
    scale.range = range3(value_default);
    scale.rangeRound = range3(round_default);
    scale.unknown = function(_) {
      return arguments.length ? (unknown = _, scale) : unknown;
    };
    return function(t) {
      transform2 = t, t02 = t(x0), t12 = t(x1), k10 = t02 === t12 ? 0 : 1 / (t12 - t02);
      return scale;
    };
  }
  function copy2(source, target) {
    return target.domain(source.domain()).interpolator(source.interpolator()).clamp(source.clamp()).unknown(source.unknown());
  }
  function sequential() {
    var scale = linearish(transformer2()(identity2));
    scale.copy = function() {
      return copy2(scale, sequential());
    };
    return initInterpolator.apply(scale, arguments);
  }
  var init_sequential = __esm({
    "node_modules/d3-scale/src/sequential.js"() {
      init_src8();
      init_continuous();
      init_init();
      init_linear2();
    }
  });

  // node_modules/d3-scale/src/index.js
  var init_src28 = __esm({
    "node_modules/d3-scale/src/index.js"() {
      init_band();
      init_linear2();
      init_log();
      init_ordinal();
      init_utcTime();
      init_sequential();
    }
  });

  // node_modules/d3-scale-chromatic/src/colors.js
  function colors_default(specifier) {
    var n = specifier.length / 6 | 0, colors = new Array(n), i2 = 0;
    while (i2 < n)
      colors[i2] = "#" + specifier.slice(i2 * 6, ++i2 * 6);
    return colors;
  }
  var init_colors = __esm({
    "node_modules/d3-scale-chromatic/src/colors.js"() {
    }
  });

  // node_modules/d3-scale-chromatic/src/ramp.js
  var ramp_default;
  var init_ramp = __esm({
    "node_modules/d3-scale-chromatic/src/ramp.js"() {
      init_src8();
      ramp_default = (scheme4) => rgbBasis(scheme4[scheme4.length - 1]);
    }
  });

  // node_modules/d3-scale-chromatic/src/sequential-single/Blues.js
  var scheme, Blues_default;
  var init_Blues = __esm({
    "node_modules/d3-scale-chromatic/src/sequential-single/Blues.js"() {
      init_colors();
      init_ramp();
      scheme = new Array(3).concat(
        "deebf79ecae13182bd",
        "eff3ffbdd7e76baed62171b5",
        "eff3ffbdd7e76baed63182bd08519c",
        "eff3ffc6dbef9ecae16baed63182bd08519c",
        "eff3ffc6dbef9ecae16baed64292c62171b5084594",
        "f7fbffdeebf7c6dbef9ecae16baed64292c62171b5084594",
        "f7fbffdeebf7c6dbef9ecae16baed64292c62171b508519c08306b"
      ).map(colors_default);
      Blues_default = ramp_default(scheme);
    }
  });

  // node_modules/d3-scale-chromatic/src/sequential-single/Greens.js
  var scheme2, Greens_default;
  var init_Greens = __esm({
    "node_modules/d3-scale-chromatic/src/sequential-single/Greens.js"() {
      init_colors();
      init_ramp();
      scheme2 = new Array(3).concat(
        "e5f5e0a1d99b31a354",
        "edf8e9bae4b374c476238b45",
        "edf8e9bae4b374c47631a354006d2c",
        "edf8e9c7e9c0a1d99b74c47631a354006d2c",
        "edf8e9c7e9c0a1d99b74c47641ab5d238b45005a32",
        "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45005a32",
        "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45006d2c00441b"
      ).map(colors_default);
      Greens_default = ramp_default(scheme2);
    }
  });

  // node_modules/d3-scale-chromatic/src/sequential-single/Reds.js
  var scheme3, Reds_default;
  var init_Reds = __esm({
    "node_modules/d3-scale-chromatic/src/sequential-single/Reds.js"() {
      init_colors();
      init_ramp();
      scheme3 = new Array(3).concat(
        "fee0d2fc9272de2d26",
        "fee5d9fcae91fb6a4acb181d",
        "fee5d9fcae91fb6a4ade2d26a50f15",
        "fee5d9fcbba1fc9272fb6a4ade2d26a50f15",
        "fee5d9fcbba1fc9272fb6a4aef3b2ccb181d99000d",
        "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181d99000d",
        "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181da50f1567000d"
      ).map(colors_default);
      Reds_default = ramp_default(scheme3);
    }
  });

  // node_modules/d3-scale-chromatic/src/index.js
  var init_src29 = __esm({
    "node_modules/d3-scale-chromatic/src/index.js"() {
      init_Blues();
      init_Greens();
      init_Reds();
    }
  });

  // node_modules/d3-shape/src/constant.js
  function constant_default5(x2) {
    return function constant() {
      return x2;
    };
  }
  var init_constant6 = __esm({
    "node_modules/d3-shape/src/constant.js"() {
    }
  });

  // node_modules/d3-shape/src/math.js
  function acos(x2) {
    return x2 > 1 ? 0 : x2 < -1 ? pi3 : Math.acos(x2);
  }
  function asin(x2) {
    return x2 >= 1 ? halfPi2 : x2 <= -1 ? -halfPi2 : Math.asin(x2);
  }
  var abs3, atan2, cos2, max4, min3, sin2, sqrt, epsilon4, pi3, halfPi2, tau3;
  var init_math2 = __esm({
    "node_modules/d3-shape/src/math.js"() {
      abs3 = Math.abs;
      atan2 = Math.atan2;
      cos2 = Math.cos;
      max4 = Math.max;
      min3 = Math.min;
      sin2 = Math.sin;
      sqrt = Math.sqrt;
      epsilon4 = 1e-12;
      pi3 = Math.PI;
      halfPi2 = pi3 / 2;
      tau3 = 2 * pi3;
    }
  });

  // node_modules/d3-shape/src/path.js
  function withPath(shape) {
    let digits = 3;
    shape.digits = function(_) {
      if (!arguments.length)
        return digits;
      if (_ == null) {
        digits = null;
      } else {
        const d = Math.floor(_);
        if (!(d >= 0))
          throw new RangeError(`invalid digits: ${_}`);
        digits = d;
      }
      return shape;
    };
    return () => new Path(digits);
  }
  var init_path2 = __esm({
    "node_modules/d3-shape/src/path.js"() {
      init_src13();
    }
  });

  // node_modules/d3-shape/src/arc.js
  function arcInnerRadius(d) {
    return d.innerRadius;
  }
  function arcOuterRadius(d) {
    return d.outerRadius;
  }
  function arcStartAngle(d) {
    return d.startAngle;
  }
  function arcEndAngle(d) {
    return d.endAngle;
  }
  function arcPadAngle(d) {
    return d && d.padAngle;
  }
  function intersect(x0, y0, x1, y1, x2, y2, x3, y3) {
    var x10 = x1 - x0, y10 = y1 - y0, x32 = x3 - x2, y32 = y3 - y2, t = y32 * x10 - x32 * y10;
    if (t * t < epsilon4)
      return;
    t = (x32 * (y0 - y2) - y32 * (x0 - x2)) / t;
    return [x0 + t * x10, y0 + t * y10];
  }
  function cornerTangents(x0, y0, x1, y1, r1, rc, cw) {
    var x01 = x0 - x1, y01 = y0 - y1, lo = (cw ? rc : -rc) / sqrt(x01 * x01 + y01 * y01), ox = lo * y01, oy = -lo * x01, x11 = x0 + ox, y11 = y0 + oy, x10 = x1 + ox, y10 = y1 + oy, x00 = (x11 + x10) / 2, y00 = (y11 + y10) / 2, dx = x10 - x11, dy = y10 - y11, d2 = dx * dx + dy * dy, r = r1 - rc, D = x11 * y10 - x10 * y11, d = (dy < 0 ? -1 : 1) * sqrt(max4(0, r * r * d2 - D * D)), cx0 = (D * dy - dx * d) / d2, cy0 = (-D * dx - dy * d) / d2, cx1 = (D * dy + dx * d) / d2, cy1 = (-D * dx + dy * d) / d2, dx0 = cx0 - x00, dy0 = cy0 - y00, dx1 = cx1 - x00, dy1 = cy1 - y00;
    if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1)
      cx0 = cx1, cy0 = cy1;
    return {
      cx: cx0,
      cy: cy0,
      x01: -ox,
      y01: -oy,
      x11: cx0 * (r1 / r - 1),
      y11: cy0 * (r1 / r - 1)
    };
  }
  function arc_default() {
    var innerRadius = arcInnerRadius, outerRadius = arcOuterRadius, cornerRadius = constant_default5(0), padRadius = null, startAngle = arcStartAngle, endAngle = arcEndAngle, padAngle = arcPadAngle, context2 = null, path2 = withPath(arc);
    function arc() {
      var buffer, r, r0 = +innerRadius.apply(this, arguments), r1 = +outerRadius.apply(this, arguments), a0 = startAngle.apply(this, arguments) - halfPi2, a1 = endAngle.apply(this, arguments) - halfPi2, da = abs3(a1 - a0), cw = a1 > a0;
      if (!context2)
        context2 = buffer = path2();
      if (r1 < r0)
        r = r1, r1 = r0, r0 = r;
      if (!(r1 > epsilon4))
        context2.moveTo(0, 0);
      else if (da > tau3 - epsilon4) {
        context2.moveTo(r1 * cos2(a0), r1 * sin2(a0));
        context2.arc(0, 0, r1, a0, a1, !cw);
        if (r0 > epsilon4) {
          context2.moveTo(r0 * cos2(a1), r0 * sin2(a1));
          context2.arc(0, 0, r0, a1, a0, cw);
        }
      } else {
        var a01 = a0, a11 = a1, a00 = a0, a10 = a1, da0 = da, da1 = da, ap = padAngle.apply(this, arguments) / 2, rp = ap > epsilon4 && (padRadius ? +padRadius.apply(this, arguments) : sqrt(r0 * r0 + r1 * r1)), rc = min3(abs3(r1 - r0) / 2, +cornerRadius.apply(this, arguments)), rc0 = rc, rc1 = rc, t02, t12;
        if (rp > epsilon4) {
          var p0 = asin(rp / r0 * sin2(ap)), p1 = asin(rp / r1 * sin2(ap));
          if ((da0 -= p0 * 2) > epsilon4)
            p0 *= cw ? 1 : -1, a00 += p0, a10 -= p0;
          else
            da0 = 0, a00 = a10 = (a0 + a1) / 2;
          if ((da1 -= p1 * 2) > epsilon4)
            p1 *= cw ? 1 : -1, a01 += p1, a11 -= p1;
          else
            da1 = 0, a01 = a11 = (a0 + a1) / 2;
        }
        var x01 = r1 * cos2(a01), y01 = r1 * sin2(a01), x10 = r0 * cos2(a10), y10 = r0 * sin2(a10);
        if (rc > epsilon4) {
          var x11 = r1 * cos2(a11), y11 = r1 * sin2(a11), x00 = r0 * cos2(a00), y00 = r0 * sin2(a00), oc;
          if (da < pi3) {
            if (oc = intersect(x01, y01, x00, y00, x11, y11, x10, y10)) {
              var ax = x01 - oc[0], ay = y01 - oc[1], bx = x11 - oc[0], by = y11 - oc[1], kc = 1 / sin2(acos((ax * bx + ay * by) / (sqrt(ax * ax + ay * ay) * sqrt(bx * bx + by * by))) / 2), lc = sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
              rc0 = min3(rc, (r0 - lc) / (kc - 1));
              rc1 = min3(rc, (r1 - lc) / (kc + 1));
            } else {
              rc0 = rc1 = 0;
            }
          }
        }
        if (!(da1 > epsilon4))
          context2.moveTo(x01, y01);
        else if (rc1 > epsilon4) {
          t02 = cornerTangents(x00, y00, x01, y01, r1, rc1, cw);
          t12 = cornerTangents(x11, y11, x10, y10, r1, rc1, cw);
          context2.moveTo(t02.cx + t02.x01, t02.cy + t02.y01);
          if (rc1 < rc)
            context2.arc(t02.cx, t02.cy, rc1, atan2(t02.y01, t02.x01), atan2(t12.y01, t12.x01), !cw);
          else {
            context2.arc(t02.cx, t02.cy, rc1, atan2(t02.y01, t02.x01), atan2(t02.y11, t02.x11), !cw);
            context2.arc(0, 0, r1, atan2(t02.cy + t02.y11, t02.cx + t02.x11), atan2(t12.cy + t12.y11, t12.cx + t12.x11), !cw);
            context2.arc(t12.cx, t12.cy, rc1, atan2(t12.y11, t12.x11), atan2(t12.y01, t12.x01), !cw);
          }
        } else
          context2.moveTo(x01, y01), context2.arc(0, 0, r1, a01, a11, !cw);
        if (!(r0 > epsilon4) || !(da0 > epsilon4))
          context2.lineTo(x10, y10);
        else if (rc0 > epsilon4) {
          t02 = cornerTangents(x10, y10, x11, y11, r0, -rc0, cw);
          t12 = cornerTangents(x01, y01, x00, y00, r0, -rc0, cw);
          context2.lineTo(t02.cx + t02.x01, t02.cy + t02.y01);
          if (rc0 < rc)
            context2.arc(t02.cx, t02.cy, rc0, atan2(t02.y01, t02.x01), atan2(t12.y01, t12.x01), !cw);
          else {
            context2.arc(t02.cx, t02.cy, rc0, atan2(t02.y01, t02.x01), atan2(t02.y11, t02.x11), !cw);
            context2.arc(0, 0, r0, atan2(t02.cy + t02.y11, t02.cx + t02.x11), atan2(t12.cy + t12.y11, t12.cx + t12.x11), cw);
            context2.arc(t12.cx, t12.cy, rc0, atan2(t12.y11, t12.x11), atan2(t12.y01, t12.x01), !cw);
          }
        } else
          context2.arc(0, 0, r0, a10, a00, cw);
      }
      context2.closePath();
      if (buffer)
        return context2 = null, buffer + "" || null;
    }
    arc.centroid = function() {
      var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2, a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - pi3 / 2;
      return [cos2(a) * r, sin2(a) * r];
    };
    arc.innerRadius = function(_) {
      return arguments.length ? (innerRadius = typeof _ === "function" ? _ : constant_default5(+_), arc) : innerRadius;
    };
    arc.outerRadius = function(_) {
      return arguments.length ? (outerRadius = typeof _ === "function" ? _ : constant_default5(+_), arc) : outerRadius;
    };
    arc.cornerRadius = function(_) {
      return arguments.length ? (cornerRadius = typeof _ === "function" ? _ : constant_default5(+_), arc) : cornerRadius;
    };
    arc.padRadius = function(_) {
      return arguments.length ? (padRadius = _ == null ? null : typeof _ === "function" ? _ : constant_default5(+_), arc) : padRadius;
    };
    arc.startAngle = function(_) {
      return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant_default5(+_), arc) : startAngle;
    };
    arc.endAngle = function(_) {
      return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant_default5(+_), arc) : endAngle;
    };
    arc.padAngle = function(_) {
      return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant_default5(+_), arc) : padAngle;
    };
    arc.context = function(_) {
      return arguments.length ? (context2 = _ == null ? null : _, arc) : context2;
    };
    return arc;
  }
  var init_arc = __esm({
    "node_modules/d3-shape/src/arc.js"() {
      init_constant6();
      init_math2();
      init_path2();
    }
  });

  // node_modules/d3-shape/src/array.js
  function array_default(x2) {
    return typeof x2 === "object" && "length" in x2 ? x2 : Array.from(x2);
  }
  var slice2;
  var init_array4 = __esm({
    "node_modules/d3-shape/src/array.js"() {
      slice2 = Array.prototype.slice;
    }
  });

  // node_modules/d3-shape/src/curve/linear.js
  function Linear(context2) {
    this._context = context2;
  }
  function linear_default(context2) {
    return new Linear(context2);
  }
  var init_linear3 = __esm({
    "node_modules/d3-shape/src/curve/linear.js"() {
      Linear.prototype = {
        areaStart: function() {
          this._line = 0;
        },
        areaEnd: function() {
          this._line = NaN;
        },
        lineStart: function() {
          this._point = 0;
        },
        lineEnd: function() {
          if (this._line || this._line !== 0 && this._point === 1)
            this._context.closePath();
          this._line = 1 - this._line;
        },
        point: function(x2, y2) {
          x2 = +x2, y2 = +y2;
          switch (this._point) {
            case 0:
              this._point = 1;
              this._line ? this._context.lineTo(x2, y2) : this._context.moveTo(x2, y2);
              break;
            case 1:
              this._point = 2;
            default:
              this._context.lineTo(x2, y2);
              break;
          }
        }
      };
    }
  });

  // node_modules/d3-shape/src/point.js
  function x(p) {
    return p[0];
  }
  function y(p) {
    return p[1];
  }
  var init_point = __esm({
    "node_modules/d3-shape/src/point.js"() {
    }
  });

  // node_modules/d3-shape/src/line.js
  function line_default(x2, y2) {
    var defined = constant_default5(true), context2 = null, curve = linear_default, output = null, path2 = withPath(line);
    x2 = typeof x2 === "function" ? x2 : x2 === void 0 ? x : constant_default5(x2);
    y2 = typeof y2 === "function" ? y2 : y2 === void 0 ? y : constant_default5(y2);
    function line(data) {
      var i2, n = (data = array_default(data)).length, d, defined0 = false, buffer;
      if (context2 == null)
        output = curve(buffer = path2());
      for (i2 = 0; i2 <= n; ++i2) {
        if (!(i2 < n && defined(d = data[i2], i2, data)) === defined0) {
          if (defined0 = !defined0)
            output.lineStart();
          else
            output.lineEnd();
        }
        if (defined0)
          output.point(+x2(d, i2, data), +y2(d, i2, data));
      }
      if (buffer)
        return output = null, buffer + "" || null;
    }
    line.x = function(_) {
      return arguments.length ? (x2 = typeof _ === "function" ? _ : constant_default5(+_), line) : x2;
    };
    line.y = function(_) {
      return arguments.length ? (y2 = typeof _ === "function" ? _ : constant_default5(+_), line) : y2;
    };
    line.defined = function(_) {
      return arguments.length ? (defined = typeof _ === "function" ? _ : constant_default5(!!_), line) : defined;
    };
    line.curve = function(_) {
      return arguments.length ? (curve = _, context2 != null && (output = curve(context2)), line) : curve;
    };
    line.context = function(_) {
      return arguments.length ? (_ == null ? context2 = output = null : output = curve(context2 = _), line) : context2;
    };
    return line;
  }
  var init_line = __esm({
    "node_modules/d3-shape/src/line.js"() {
      init_array4();
      init_constant6();
      init_linear3();
      init_path2();
      init_point();
    }
  });

  // node_modules/d3-shape/src/area.js
  function area_default(x0, y0, y1) {
    var x1 = null, defined = constant_default5(true), context2 = null, curve = linear_default, output = null, path2 = withPath(area);
    x0 = typeof x0 === "function" ? x0 : x0 === void 0 ? x : constant_default5(+x0);
    y0 = typeof y0 === "function" ? y0 : y0 === void 0 ? constant_default5(0) : constant_default5(+y0);
    y1 = typeof y1 === "function" ? y1 : y1 === void 0 ? y : constant_default5(+y1);
    function area(data) {
      var i2, j2, k, n = (data = array_default(data)).length, d, defined0 = false, buffer, x0z = new Array(n), y0z = new Array(n);
      if (context2 == null)
        output = curve(buffer = path2());
      for (i2 = 0; i2 <= n; ++i2) {
        if (!(i2 < n && defined(d = data[i2], i2, data)) === defined0) {
          if (defined0 = !defined0) {
            j2 = i2;
            output.areaStart();
            output.lineStart();
          } else {
            output.lineEnd();
            output.lineStart();
            for (k = i2 - 1; k >= j2; --k) {
              output.point(x0z[k], y0z[k]);
            }
            output.lineEnd();
            output.areaEnd();
          }
        }
        if (defined0) {
          x0z[i2] = +x0(d, i2, data), y0z[i2] = +y0(d, i2, data);
          output.point(x1 ? +x1(d, i2, data) : x0z[i2], y1 ? +y1(d, i2, data) : y0z[i2]);
        }
      }
      if (buffer)
        return output = null, buffer + "" || null;
    }
    function arealine() {
      return line_default().defined(defined).curve(curve).context(context2);
    }
    area.x = function(_) {
      return arguments.length ? (x0 = typeof _ === "function" ? _ : constant_default5(+_), x1 = null, area) : x0;
    };
    area.x0 = function(_) {
      return arguments.length ? (x0 = typeof _ === "function" ? _ : constant_default5(+_), area) : x0;
    };
    area.x1 = function(_) {
      return arguments.length ? (x1 = _ == null ? null : typeof _ === "function" ? _ : constant_default5(+_), area) : x1;
    };
    area.y = function(_) {
      return arguments.length ? (y0 = typeof _ === "function" ? _ : constant_default5(+_), y1 = null, area) : y0;
    };
    area.y0 = function(_) {
      return arguments.length ? (y0 = typeof _ === "function" ? _ : constant_default5(+_), area) : y0;
    };
    area.y1 = function(_) {
      return arguments.length ? (y1 = _ == null ? null : typeof _ === "function" ? _ : constant_default5(+_), area) : y1;
    };
    area.lineX0 = area.lineY0 = function() {
      return arealine().x(x0).y(y0);
    };
    area.lineY1 = function() {
      return arealine().x(x0).y(y1);
    };
    area.lineX1 = function() {
      return arealine().x(x1).y(y0);
    };
    area.defined = function(_) {
      return arguments.length ? (defined = typeof _ === "function" ? _ : constant_default5(!!_), area) : defined;
    };
    area.curve = function(_) {
      return arguments.length ? (curve = _, context2 != null && (output = curve(context2)), area) : curve;
    };
    area.context = function(_) {
      return arguments.length ? (_ == null ? context2 = output = null : output = curve(context2 = _), area) : context2;
    };
    return area;
  }
  var init_area = __esm({
    "node_modules/d3-shape/src/area.js"() {
      init_array4();
      init_constant6();
      init_linear3();
      init_line();
      init_path2();
      init_point();
    }
  });

  // node_modules/d3-shape/src/descending.js
  function descending_default(a, b) {
    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
  }
  var init_descending2 = __esm({
    "node_modules/d3-shape/src/descending.js"() {
    }
  });

  // node_modules/d3-shape/src/identity.js
  function identity_default3(d) {
    return d;
  }
  var init_identity3 = __esm({
    "node_modules/d3-shape/src/identity.js"() {
    }
  });

  // node_modules/d3-shape/src/pie.js
  function pie_default() {
    var value = identity_default3, sortValues = descending_default, sort = null, startAngle = constant_default5(0), endAngle = constant_default5(tau3), padAngle = constant_default5(0);
    function pie(data) {
      var i2, n = (data = array_default(data)).length, j2, k, sum2 = 0, index = new Array(n), arcs = new Array(n), a0 = +startAngle.apply(this, arguments), da = Math.min(tau3, Math.max(-tau3, endAngle.apply(this, arguments) - a0)), a1, p = Math.min(Math.abs(da) / n, padAngle.apply(this, arguments)), pa = p * (da < 0 ? -1 : 1), v;
      for (i2 = 0; i2 < n; ++i2) {
        if ((v = arcs[index[i2] = i2] = +value(data[i2], i2, data)) > 0) {
          sum2 += v;
        }
      }
      if (sortValues != null)
        index.sort(function(i3, j3) {
          return sortValues(arcs[i3], arcs[j3]);
        });
      else if (sort != null)
        index.sort(function(i3, j3) {
          return sort(data[i3], data[j3]);
        });
      for (i2 = 0, k = sum2 ? (da - n * pa) / sum2 : 0; i2 < n; ++i2, a0 = a1) {
        j2 = index[i2], v = arcs[j2], a1 = a0 + (v > 0 ? v * k : 0) + pa, arcs[j2] = {
          data: data[j2],
          index: i2,
          value: v,
          startAngle: a0,
          endAngle: a1,
          padAngle: p
        };
      }
      return arcs;
    }
    pie.value = function(_) {
      return arguments.length ? (value = typeof _ === "function" ? _ : constant_default5(+_), pie) : value;
    };
    pie.sortValues = function(_) {
      return arguments.length ? (sortValues = _, sort = null, pie) : sortValues;
    };
    pie.sort = function(_) {
      return arguments.length ? (sort = _, sortValues = null, pie) : sort;
    };
    pie.startAngle = function(_) {
      return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant_default5(+_), pie) : startAngle;
    };
    pie.endAngle = function(_) {
      return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant_default5(+_), pie) : endAngle;
    };
    pie.padAngle = function(_) {
      return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant_default5(+_), pie) : padAngle;
    };
    return pie;
  }
  var init_pie = __esm({
    "node_modules/d3-shape/src/pie.js"() {
      init_array4();
      init_constant6();
      init_descending2();
      init_identity3();
      init_math2();
    }
  });

  // node_modules/d3-shape/src/symbol/circle.js
  var circle_default;
  var init_circle = __esm({
    "node_modules/d3-shape/src/symbol/circle.js"() {
      init_math2();
      circle_default = {
        draw(context2, size) {
          const r = sqrt(size / pi3);
          context2.moveTo(r, 0);
          context2.arc(0, 0, r, 0, tau3);
        }
      };
    }
  });

  // node_modules/d3-shape/src/symbol.js
  function Symbol2(type2, size) {
    let context2 = null, path2 = withPath(symbol);
    type2 = typeof type2 === "function" ? type2 : constant_default5(type2 || circle_default);
    size = typeof size === "function" ? size : constant_default5(size === void 0 ? 64 : +size);
    function symbol() {
      let buffer;
      if (!context2)
        context2 = buffer = path2();
      type2.apply(this, arguments).draw(context2, +size.apply(this, arguments));
      if (buffer)
        return context2 = null, buffer + "" || null;
    }
    symbol.type = function(_) {
      return arguments.length ? (type2 = typeof _ === "function" ? _ : constant_default5(_), symbol) : type2;
    };
    symbol.size = function(_) {
      return arguments.length ? (size = typeof _ === "function" ? _ : constant_default5(+_), symbol) : size;
    };
    symbol.context = function(_) {
      return arguments.length ? (context2 = _ == null ? null : _, symbol) : context2;
    };
    return symbol;
  }
  var init_symbol = __esm({
    "node_modules/d3-shape/src/symbol.js"() {
      init_constant6();
      init_path2();
      init_circle();
    }
  });

  // node_modules/d3-shape/src/curve/cardinal.js
  function point2(that, x2, y2) {
    that._context.bezierCurveTo(
      that._x1 + that._k * (that._x2 - that._x0),
      that._y1 + that._k * (that._y2 - that._y0),
      that._x2 + that._k * (that._x1 - x2),
      that._y2 + that._k * (that._y1 - y2),
      that._x2,
      that._y2
    );
  }
  function Cardinal(context2, tension) {
    this._context = context2;
    this._k = (1 - tension) / 6;
  }
  var cardinal_default;
  var init_cardinal = __esm({
    "node_modules/d3-shape/src/curve/cardinal.js"() {
      Cardinal.prototype = {
        areaStart: function() {
          this._line = 0;
        },
        areaEnd: function() {
          this._line = NaN;
        },
        lineStart: function() {
          this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
          this._point = 0;
        },
        lineEnd: function() {
          switch (this._point) {
            case 2:
              this._context.lineTo(this._x2, this._y2);
              break;
            case 3:
              point2(this, this._x1, this._y1);
              break;
          }
          if (this._line || this._line !== 0 && this._point === 1)
            this._context.closePath();
          this._line = 1 - this._line;
        },
        point: function(x2, y2) {
          x2 = +x2, y2 = +y2;
          switch (this._point) {
            case 0:
              this._point = 1;
              this._line ? this._context.lineTo(x2, y2) : this._context.moveTo(x2, y2);
              break;
            case 1:
              this._point = 2;
              this._x1 = x2, this._y1 = y2;
              break;
            case 2:
              this._point = 3;
            default:
              point2(this, x2, y2);
              break;
          }
          this._x0 = this._x1, this._x1 = this._x2, this._x2 = x2;
          this._y0 = this._y1, this._y1 = this._y2, this._y2 = y2;
        }
      };
      cardinal_default = function custom(tension) {
        function cardinal(context2) {
          return new Cardinal(context2, tension);
        }
        cardinal.tension = function(tension2) {
          return custom(+tension2);
        };
        return cardinal;
      }(0);
    }
  });

  // node_modules/d3-shape/src/curve/monotone.js
  function sign(x2) {
    return x2 < 0 ? -1 : 1;
  }
  function slope3(that, x2, y2) {
    var h0 = that._x1 - that._x0, h1 = x2 - that._x1, s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0), s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0), p = (s0 * h1 + s1 * h0) / (h0 + h1);
    return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
  }
  function slope2(that, t) {
    var h = that._x1 - that._x0;
    return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
  }
  function point3(that, t02, t12) {
    var x0 = that._x0, y0 = that._y0, x1 = that._x1, y1 = that._y1, dx = (x1 - x0) / 3;
    that._context.bezierCurveTo(x0 + dx, y0 + dx * t02, x1 - dx, y1 - dx * t12, x1, y1);
  }
  function MonotoneX(context2) {
    this._context = context2;
  }
  function MonotoneY(context2) {
    this._context = new ReflectContext(context2);
  }
  function ReflectContext(context2) {
    this._context = context2;
  }
  function monotoneX(context2) {
    return new MonotoneX(context2);
  }
  function monotoneY(context2) {
    return new MonotoneY(context2);
  }
  var init_monotone = __esm({
    "node_modules/d3-shape/src/curve/monotone.js"() {
      MonotoneX.prototype = {
        areaStart: function() {
          this._line = 0;
        },
        areaEnd: function() {
          this._line = NaN;
        },
        lineStart: function() {
          this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN;
          this._point = 0;
        },
        lineEnd: function() {
          switch (this._point) {
            case 2:
              this._context.lineTo(this._x1, this._y1);
              break;
            case 3:
              point3(this, this._t0, slope2(this, this._t0));
              break;
          }
          if (this._line || this._line !== 0 && this._point === 1)
            this._context.closePath();
          this._line = 1 - this._line;
        },
        point: function(x2, y2) {
          var t12 = NaN;
          x2 = +x2, y2 = +y2;
          if (x2 === this._x1 && y2 === this._y1)
            return;
          switch (this._point) {
            case 0:
              this._point = 1;
              this._line ? this._context.lineTo(x2, y2) : this._context.moveTo(x2, y2);
              break;
            case 1:
              this._point = 2;
              break;
            case 2:
              this._point = 3;
              point3(this, slope2(this, t12 = slope3(this, x2, y2)), t12);
              break;
            default:
              point3(this, this._t0, t12 = slope3(this, x2, y2));
              break;
          }
          this._x0 = this._x1, this._x1 = x2;
          this._y0 = this._y1, this._y1 = y2;
          this._t0 = t12;
        }
      };
      (MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function(x2, y2) {
        MonotoneX.prototype.point.call(this, y2, x2);
      };
      ReflectContext.prototype = {
        moveTo: function(x2, y2) {
          this._context.moveTo(y2, x2);
        },
        closePath: function() {
          this._context.closePath();
        },
        lineTo: function(x2, y2) {
          this._context.lineTo(y2, x2);
        },
        bezierCurveTo: function(x1, y1, x2, y2, x3, y3) {
          this._context.bezierCurveTo(y1, x1, y2, x2, y3, x3);
        }
      };
    }
  });

  // node_modules/d3-shape/src/curve/step.js
  function Step(context2, t) {
    this._context = context2;
    this._t = t;
  }
  function stepAfter(context2) {
    return new Step(context2, 1);
  }
  var init_step = __esm({
    "node_modules/d3-shape/src/curve/step.js"() {
      Step.prototype = {
        areaStart: function() {
          this._line = 0;
        },
        areaEnd: function() {
          this._line = NaN;
        },
        lineStart: function() {
          this._x = this._y = NaN;
          this._point = 0;
        },
        lineEnd: function() {
          if (0 < this._t && this._t < 1 && this._point === 2)
            this._context.lineTo(this._x, this._y);
          if (this._line || this._line !== 0 && this._point === 1)
            this._context.closePath();
          if (this._line >= 0)
            this._t = 1 - this._t, this._line = 1 - this._line;
        },
        point: function(x2, y2) {
          x2 = +x2, y2 = +y2;
          switch (this._point) {
            case 0:
              this._point = 1;
              this._line ? this._context.lineTo(x2, y2) : this._context.moveTo(x2, y2);
              break;
            case 1:
              this._point = 2;
            default: {
              if (this._t <= 0) {
                this._context.lineTo(this._x, y2);
                this._context.lineTo(x2, y2);
              } else {
                var x1 = this._x * (1 - this._t) + x2 * this._t;
                this._context.lineTo(x1, this._y);
                this._context.lineTo(x1, y2);
              }
              break;
            }
          }
          this._x = x2, this._y = y2;
        }
      };
    }
  });

  // node_modules/d3-shape/src/offset/none.js
  function none_default(series, order) {
    if (!((n = series.length) > 1))
      return;
    for (var i2 = 1, j2, s0, s1 = series[order[0]], n, m = s1.length; i2 < n; ++i2) {
      s0 = s1, s1 = series[order[i2]];
      for (j2 = 0; j2 < m; ++j2) {
        s1[j2][1] += s1[j2][0] = isNaN(s0[j2][1]) ? s0[j2][0] : s0[j2][1];
      }
    }
  }
  var init_none = __esm({
    "node_modules/d3-shape/src/offset/none.js"() {
    }
  });

  // node_modules/d3-shape/src/order/none.js
  function none_default2(series) {
    var n = series.length, o = new Array(n);
    while (--n >= 0)
      o[n] = n;
    return o;
  }
  var init_none2 = __esm({
    "node_modules/d3-shape/src/order/none.js"() {
    }
  });

  // node_modules/d3-shape/src/stack.js
  function stackValue(d, key) {
    return d[key];
  }
  function stackSeries(key) {
    const series = [];
    series.key = key;
    return series;
  }
  function stack_default() {
    var keys = constant_default5([]), order = none_default2, offset = none_default, value = stackValue;
    function stack(data) {
      var sz = Array.from(keys.apply(this, arguments), stackSeries), i2, n = sz.length, j2 = -1, oz;
      for (const d of data) {
        for (i2 = 0, ++j2; i2 < n; ++i2) {
          (sz[i2][j2] = [0, +value(d, sz[i2].key, j2, data)]).data = d;
        }
      }
      for (i2 = 0, oz = array_default(order(sz)); i2 < n; ++i2) {
        sz[oz[i2]].index = i2;
      }
      offset(sz, oz);
      return sz;
    }
    stack.keys = function(_) {
      return arguments.length ? (keys = typeof _ === "function" ? _ : constant_default5(Array.from(_)), stack) : keys;
    };
    stack.value = function(_) {
      return arguments.length ? (value = typeof _ === "function" ? _ : constant_default5(+_), stack) : value;
    };
    stack.order = function(_) {
      return arguments.length ? (order = _ == null ? none_default2 : typeof _ === "function" ? _ : constant_default5(Array.from(_)), stack) : order;
    };
    stack.offset = function(_) {
      return arguments.length ? (offset = _ == null ? none_default : _, stack) : offset;
    };
    return stack;
  }
  var init_stack = __esm({
    "node_modules/d3-shape/src/stack.js"() {
      init_array4();
      init_constant6();
      init_none();
      init_none2();
    }
  });

  // node_modules/d3-shape/src/index.js
  var init_src30 = __esm({
    "node_modules/d3-shape/src/index.js"() {
      init_arc();
      init_area();
      init_line();
      init_pie();
      init_symbol();
      init_circle();
      init_cardinal();
      init_monotone();
      init_step();
      init_stack();
    }
  });

  // node_modules/d3-zoom/src/constant.js
  var init_constant7 = __esm({
    "node_modules/d3-zoom/src/constant.js"() {
    }
  });

  // node_modules/d3-zoom/src/event.js
  var init_event2 = __esm({
    "node_modules/d3-zoom/src/event.js"() {
    }
  });

  // node_modules/d3-zoom/src/transform.js
  function Transform(k, x2, y2) {
    this.k = k;
    this.x = x2;
    this.y = y2;
  }
  function transform(node) {
    while (!node.__zoom)
      if (!(node = node.parentNode))
        return identity3;
    return node.__zoom;
  }
  var identity3;
  var init_transform2 = __esm({
    "node_modules/d3-zoom/src/transform.js"() {
      Transform.prototype = {
        constructor: Transform,
        scale: function(k) {
          return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
        },
        translate: function(x2, y2) {
          return x2 === 0 & y2 === 0 ? this : new Transform(this.k, this.x + this.k * x2, this.y + this.k * y2);
        },
        apply: function(point4) {
          return [point4[0] * this.k + this.x, point4[1] * this.k + this.y];
        },
        applyX: function(x2) {
          return x2 * this.k + this.x;
        },
        applyY: function(y2) {
          return y2 * this.k + this.y;
        },
        invert: function(location2) {
          return [(location2[0] - this.x) / this.k, (location2[1] - this.y) / this.k];
        },
        invertX: function(x2) {
          return (x2 - this.x) / this.k;
        },
        invertY: function(y2) {
          return (y2 - this.y) / this.k;
        },
        rescaleX: function(x2) {
          return x2.copy().domain(x2.range().map(this.invertX, this).map(x2.invert, x2));
        },
        rescaleY: function(y2) {
          return y2.copy().domain(y2.range().map(this.invertY, this).map(y2.invert, y2));
        },
        toString: function() {
          return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
        }
      };
      identity3 = new Transform(1, 0, 0);
      transform.prototype = Transform.prototype;
    }
  });

  // node_modules/d3-zoom/src/noevent.js
  var init_noevent2 = __esm({
    "node_modules/d3-zoom/src/noevent.js"() {
    }
  });

  // node_modules/d3-zoom/src/zoom.js
  var init_zoom = __esm({
    "node_modules/d3-zoom/src/zoom.js"() {
      init_src11();
      init_constant7();
      init_event2();
      init_transform2();
      init_noevent2();
    }
  });

  // node_modules/d3-zoom/src/index.js
  var init_src31 = __esm({
    "node_modules/d3-zoom/src/index.js"() {
      init_zoom();
      init_transform2();
    }
  });

  // node_modules/d3/src/index.js
  var init_src32 = __esm({
    "node_modules/d3/src/index.js"() {
      init_src2();
      init_src3();
      init_src12();
      init_src14();
      init_src7();
      init_src15();
      init_src16();
      init_src4();
      init_src6();
      init_src17();
      init_src10();
      init_src18();
      init_src20();
      init_src21();
      init_src22();
      init_src23();
      init_src8();
      init_src13();
      init_src24();
      init_src19();
      init_src25();
      init_src28();
      init_src29();
      init_src5();
      init_src30();
      init_src26();
      init_src27();
      init_src9();
      init_src11();
      init_src31();
    }
  });

  // vendor/logjam/app/assets/javascripts/logjam-echart.js
  function logjam_echart(params) {
    var data = params.data, events = params.events, url = params.url, highlight = params.highlight, max_y = params.max_y, max_x = params.max_x, start2 = params.start_minute, end = params.end_minute, h = params.height, w = (0, import_jquery3.default)(params.parent).width(), w_r = w - 30, x2 = linear3().domain([0, 1440 / 2]).range([0, w_r]), y2 = linear3().domain([0, max_y]).range([h, 0]).nice(), tooltip_formatter = format(",.2s"), tooltip_timeformatter = format("02d");
    var allow_selection = start2 != null && end != null;
    var vis = select_default2(params.parent).append("svg").attr("width", w).attr("height", events.length == 0 ? h : h + 5).style("stroke", "lightsteelblue").style("strokeWidth", 1).on("mousedown", mouse_down_event).on("mouseup", mouse_up_event).on("mouseover", mouse_over_event).on("mousemove", mouse_over_event).on("mouseout", mouse_over_out).style("cursor", () => url ? "pointer" : "arrow").on("click", mouse_click_event);
    vis.selectAll(".rlabel").data([20]).enter().append("text").attr("class", "rlabel").style("font", "8px Helvetica Neue").attr("text-anchor", "end").attr("dy", ".75em").attr("x", w - 1).text(tooltip_formatter(max_y));
    var line = line_default().x((d) => x2(d[0])).y((d) => y2(d[1])).curve(monotoneY);
    var tooltip = (0, import_jquery3.default)(params.parent + " svg");
    var tooltip_text = "";
    tooltip.tipsy({
      trigger: "hover",
      follow: "x",
      offsetY: -20,
      gravity: "s",
      html: false,
      title: () => tooltip_text
    });
    function mouse_click_event(e) {
      if (ignore_click) {
        ignore_click = false;
        return;
      }
      if (url)
        document.location = url;
    }
    function mouse_down_event(e, d) {
      var p = pointer_default(e);
      var di = Math.ceil(x2.invert(p[0])) - 1;
      if (allow_selection) {
        mouse_down_start = di;
        mouse_down_end = di;
        start_time_selection(di);
      }
    }
    function mouse_up_event(e, d) {
      e.stopPropagation();
      var p = pointer_default(e);
      var di = Math.ceil(x2.invert(p[0])) - 1;
      update_time_selection(di);
      if (allow_selection) {
        finish_time_selection();
      }
    }
    function mouse_over_event(e, d) {
      var p = pointer_default(e);
      var di = Math.ceil(x2.invert(p[0])) - 1;
      if (di < 0)
        di = 0;
      var xc = data[di];
      var n = 0;
      var m = 2 * di;
      var hour = tooltip_timeformatter(Math.floor(m / 60));
      var minute1 = tooltip_timeformatter(Math.floor(m % 60));
      var minute2 = tooltip_timeformatter(Math.floor(m % 60 + 1));
      if (xc) {
        n = xc[1];
      }
      tooltip_text = tooltip_formatter(n <= 0 ? 0 : n) + " ~ " + hour + ":" + minute1 + " - " + hour + ":" + minute2;
      if (allow_selection) {
        update_time_selection(di);
      }
    }
    function mouse_over_out() {
      tooltip_text = "";
    }
    vis.append("svg:path").attr("d", line(data)).style("stroke", highlight ? "#ff0000" : "#006567").style("fill", "none");
    var xaxis = vis.append("svg:line").style("fill", "#999").style("stroke", "#999").attr("x1", 0).attr("y1", h).attr("x2", w_r).attr("y2", h);
    if (allow_selection) {
      vis.append("rect").attr("class", "selection").attr("y", 0).attr("height", h).attr("x", x2(start2 / 2)).attr("width", x2(end / 2) - x2(start2 / 2) + 1).attr("display", start2 > 0 || end < 1440 ? null : "none").style("pointer-events", "none").style("stroke", "none").style("fill", "rgba(255,0,0,0.3)");
    }
    vis.selectAll(".event").data(events).enter().append("polygon").attr("class", "event").attr("points", (d, i2) => {
      var xCenter = x2(d[0] / 2), y3 = h + 5, p1 = [xCenter - 4, y3], p2 = [xCenter + 4, y3], p3 = [xCenter, y3 - 5];
      var what = [p1, p2, p3].map((point4) => point4[0] + "," + point4[1]).join(" ");
      return what;
    }).style("stroke", "rgba(255,0,0,0)").style("fill", "rgba(255,0,0,0.7)").on("mouseover", mouse_over_triangle_event).on("mousemove", mouse_over_triangle_event).on("mouseout", mouse_over_triangle_out);
    var event_tooltip_text = "";
    function mouse_over_triangle_event(e, d) {
      event_tooltip_text = d[1].split("\n").map((s) => (0, import_jquery3.default)("<p>").text(s).html()).join("<br>");
    }
    function mouse_over_triangle_out() {
      event_tooltip_text = "";
    }
    var event_tooltip_options = {
      trigger: "hover",
      follow: "x",
      offset: 0,
      offsetX: 10,
      offsetY: 20,
      gravity: "w",
      html: true,
      title: () => event_tooltip_text
    };
    if (events.length > 0) {
      (0, import_jquery3.default)(".event").tipsy(event_tooltip_options);
    }
    function start_time_selection(di) {
      vis.selectAll(".selection").attr("x", x2(di)).attr("width", 1).attr("display", null);
    }
    var mouse_down_start = -1;
    var mouse_down_end = -1;
    var ignore_click = false;
    function valid_minute(m) {
      if (m < 0)
        return 0;
      else if (m > 1440 / 2)
        return 1440 / 2;
      else
        return m;
    }
    function update_time_selection(di) {
      if (mouse_down_start > 0) {
        var m = valid_minute(di);
        mouse_down_end = m;
        if (m >= mouse_down_start) {
          vis.selectAll(".selection").attr("width", x2(m) - x2(mouse_down_start) + 1);
        } else {
          vis.selectAll(".selection").attr("x", x2(m)).attr("width", x2(mouse_down_start) - x2(m) + 1);
        }
      }
    }
    function finish_time_selection() {
      if (mouse_down_start >= 0) {
        if (mouse_down_end >= mouse_down_start)
          select_minutes(mouse_down_start, mouse_down_end);
        else
          select_minutes(mouse_down_end, mouse_down_start);
        mouse_down_start = -1;
        mouse_down_end = -1;
        ignore_click = true;
      }
    }
    function restore_selection() {
      mouse_down_start = -1;
      mouse_down_end = -1;
      vis.selectAll(".selection").attr("x", x2(start2 / 2)).attr("width", x2(end / 2) - x2(start2 / 2) + 1).attr("display", start2 > 0 ? null : "none");
    }
    function select_minutes(start3, end2) {
      var uri = new import_urijs2.default(url);
      uri.removeSearch(["start_minute", "end_minute"]).addSearch("start_minute", 2 * start3).addSearch("end_minute", 2 * end2);
      document.location.href = uri.toString();
    }
    if (allow_selection) {
      (0, import_jquery3.default)(document).on("mouseup", finish_time_selection);
    }
  }
  function adjustWidthOfFirstTwoColumns() {
    var rows = (0, import_jquery3.default)("tr.full_stats");
    var nameWidths = rows.map(() => (0, import_jquery3.default)(this).children().first().width());
    var maxNameWidth = Math.max.apply(null, nameWidths);
    var numWidths = rows.map(() => (0, import_jquery3.default)(this).children().first().next().width());
    var maxNumWidth = Math.max.apply(null, numWidths);
    rows.each(function() {
      var name = (0, import_jquery3.default)(this).children().first();
      var num = name.next();
      name.width(maxNameWidth);
      num.width(maxNumWidth);
    });
  }
  var import_jquery3, import_urijs2;
  var init_logjam_echart = __esm({
    "vendor/logjam/app/assets/javascripts/logjam-echart.js"() {
      init_src32();
      import_jquery3 = __toESM(require_jquery());
      import_urijs2 = __toESM(require_URI());
      window.logjam_echart = logjam_echart;
      window.adjustWidthOfFirstTwoColumns = adjustWidthOfFirstTwoColumns;
    }
  });

  // vendor/logjam/app/assets/javascripts/logjam-apdex-chart.js
  function logjam_apdex_chart(params) {
    var data = params.data;
    var max_y = params.max_y;
    var max_x = params.max_x;
    var min_y = params.min_y;
    var h = params.height;
    var w = $(params.parent).width();
    var x2 = linear3().domain([0, 1440 / 2]).range([0, w]);
    var y2 = linear3().domain([min_y, 1]).range([h, 0]).nice();
    var tooltip_formatter = format(",.3r");
    var tooltip_timeformatter = format("02d");
    var vis = select_default2(params.parent).append("svg").attr("width", w).attr("height", h).style("stroke", "lightsteelblue").style("strokeWidth", 1).style("fill", "steelblue").on("mouseover", mouse_over_event).on("mousemove", mouse_over_event).on("mouseout", mouse_over_out);
    var xaxis = vis.append("svg:line").style("fill", "#999").style("stroke", "#999").attr("x1", 0).attr("y1", h).attr("x2", w).attr("y2", h);
    var goal = line_default().x((d, i2) => x2(d[0])).y(() => y2(0.94));
    var area = area_default().x((d, i2) => x2(d[0])).y0((d) => y2(0)).y1((d) => y2(d[1])).curve(monotoneX);
    var tooltip = $(params.parent + " svg");
    var tooltip_text = "";
    tooltip.tipsy({
      trigger: "hover",
      follow: "x",
      offsetY: -20,
      gravity: "s",
      html: false,
      title: () => tooltip_text
    });
    function mouse_over_event(e, d) {
      var p = pointer_default(e);
      var di = Math.ceil(x2.invert(p[0])) - 1;
      if (di < 0)
        di = 0;
      var xc = data[di];
      var n = 0;
      var m = 2 * di;
      var hour = tooltip_timeformatter(Math.floor(m / 60));
      var minute1 = tooltip_timeformatter(Math.floor(m % 60));
      var minute2 = tooltip_timeformatter(Math.floor(m % 60 + 1));
      if (xc) {
        n = xc[1];
      }
      tooltip_text = tooltip_formatter(n <= 0 ? 0 : n) + " ~ " + hour + ":" + minute1 + "-" + minute2;
    }
    function mouse_over_out() {
      tooltip_text = "";
    }
    vis.append("svg:path").attr("d", area(data)).style("stroke", "steelblue").style("fill", "lightsteelblue");
    vis.append("svg:path").attr("d", goal(data)).style("stroke", "red").style("fill", "none");
    vis.selectAll(".rlabel").data([20]).enter().append("text").attr("class", "rlabel").style("font", "8px Helvetica Neue").attr("text-anchor", "end").attr("dy", ".75em").attr("x", w - 1).text(tooltip_formatter(max_y));
  }
  var init_logjam_apdex_chart = __esm({
    "vendor/logjam/app/assets/javascripts/logjam-apdex-chart.js"() {
      init_src32();
      window.logjam_apdex_chart = logjam_apdex_chart;
    }
  });

  // vendor/logjam/app/assets/javascripts/logjam-simple-pie.js
  function logjam_simple_pie(params) {
    var data = params.data;
    var legend = params.legend;
    var container = params.container;
    var w = params.w, h = params.h, r = w / 2, s = sum(data), a = linear3([0, s]).range([0, 2 * Math.PI]), color2 = ordinal().range(params.color);
    var vis = select_default2(container).append("svg").data([data]).attr("width", w).attr("height", h);
    if (params.onclick) {
      vis.style("cursor", "pointer").on("click", () => window.eval(params.onclick));
    }
    var donut = pie_default(), arc = arc_default().innerRadius(0).outerRadius(r);
    var arcs = vis.selectAll("g.arc").data(donut).enter().append("g").attr("class", "arc").style("font", "10px sans-serif").attr("transform", "translate(" + r + "," + r + ")");
    arcs.append("path").attr("fill", (d, i2) => color2(i2)).attr("d", arc);
    arcs.append("text").style("cursor", "default").attr("transform", (d) => "translate(" + arc.centroid(d) + ")").attr("dy", ".35em").attr("text-anchor", "middle").attr("display", (d) => d.value / s > 0.1 ? null : "none").text((d, i2) => (100 * d.value / s).toFixed() + "%");
  }
  var init_logjam_simple_pie = __esm({
    "vendor/logjam/app/assets/javascripts/logjam-simple-pie.js"() {
      init_src32();
      window.logjam_simple_pie = logjam_simple_pie;
    }
  });

  // vendor/logjam/app/assets/javascripts/logjam-resource-plot.js
  function logjam_resource_plot(params) {
    var events = params.events, data = params.data, interval2 = params.interval, colors = params.colors, legend = params.legend, request_counts = params.request_counts, gc_time = params.gc_time, dom_interactive = params.dom_interactive, total_time_max = params.total_time_max, max_y = params.max_y, zoomed_max_y = params.zoomed_max_y, start_minute = params.start_minute, end_minute = params.end_minute, container = params.container, max_request_count = max(request_counts);
    var zoom_interval = 1;
    function get_height() {
      var enlarged_size = (0, import_jquery4.default)("#enlarged-plot").height() - 130;
      if (enlarged_size > 0) {
        return enlarged_size;
      }
      var parent_height = (0, import_jquery4.default)(container).parent(".item").height() - 100;
      return parent_height > 170 ? parent_height : 170;
    }
    var w = document.getElementById(container.slice(1)).offsetWidth - 60 < 400 ? 626 : document.getElementById(container.slice(1)).offsetWidth - 60, h = get_height(), xticks = range(25).map((h2) => h2 / interval2 * 60), x2 = linear3().domain([0, 1440 / interval2]).range([0, w]), y2 = linear3().domain([0, zoomed_max_y]).range([h, 0]).nice(), y22 = linear3().domain([0, max_request_count]).range([50, 0]).nice();
    function submit_minutes(start2, end, resource) {
      (0, import_jquery4.default)("#start-minute").val("" + start2);
      (0, import_jquery4.default)("#end-minute").val("" + end);
      (0, import_jquery4.default)("#grouping").val("request");
      submit_resource(resource);
    }
    function submit_resource(resource, event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      if (resource != "requests/second" && resource != "free slots") {
        (0, import_jquery4.default)("#resource").val(resource.replace(/ /g, "_"));
        (0, import_jquery4.default)("#filter-form").attr("action", page_context_default.home_url);
        submit_filter_form();
      }
    }
    function restrict_minutes(p, resource) {
      var start2 = Math.max(0, Math.floor(x2.invert(p[0])) * interval2 - interval2);
      var end = start2 + interval2;
      submit_minutes(start2, end, resource);
    }
    function select_minutes(start2, end) {
      if (mouse_down_resource != "") {
        submit_minutes(start2 * interval2, end * interval2, mouse_down_resource);
      } else {
        submit_minutes(start2 * interval2, end * interval2, (0, import_jquery4.default)("#resource").val());
      }
    }
    function reset_minutes() {
      if (start_minute > 0 || end_minute < 1440) {
        ignore_click = true;
        submit_minutes(0, 1440, (0, import_jquery4.default)("#resource").val());
      }
    }
    function root_panel_click(e, d) {
      if (!ignore_click)
        zoom_in_or_out();
      else
        ignore_click = false;
    }
    var vis = select_default2(params.container).append("svg").attr("width", w + 50).attr("height", h + 80).style("stroke", "#999").style("strokeWidth", 1).on("click", root_panel_click).on("mousemove", mouse_over_root).on("mouseup", mouse_up_over_root).append("g").attr("transform", "translate(40,10)");
    vis.append("svg:text").attr("class", "label").attr("dy", h + 30).attr("dx", w / 2).style("font", "12px Helvetica Neue").attr("text-anchor", "middle").text("Time of day");
    vis.selectAll(".zoom_rect1").data([1]).enter().append("rect").attr("class", "zoom_rect1").attr("y", h + 15).attr("x", w - 55).attr("width", 55).attr("height", 20).attr("rx", 5).attr("ry", 5).style("fill", "rgba(0,0,255,0.1)").style("stroke", "rgba(128,128,128,0.7)").style("cursor", "pointer").exit().remove();
    vis.selectAll(".zoom_button").data([1]).enter().append("svg:text").attr("class", "zoom_button").attr("dy", h + 30).attr("dx", w - 3).style("font", "11px Helvetica Neue").style("fill", "rgba(0,0,255,0.7)").style("cursor", "pointer").attr("text-anchor", "end").text("Zoom out").exit().remove();
    if (start_minute > 0 || end_minute < 1440) {
      vis.selectAll(".zoom_rect2").data([1]).enter().append("rect").attr("class", "zoom_rect2").attr("y", h + 15).attr("x", 0).attr("width", 100).attr("height", 20).attr("rx", 5).attr("ry", 5).style("fill", "rgba(0,0,255,0.1)").style("stroke", "rgba(128,128,128,0.7)").style("cursor", "pointer").exit().remove();
      vis.selectAll(".show_all_button").data([1]).enter().append("svg:text").attr("class", "show_all_button").attr("dy", h + 30).attr("dx", 4).style("font", "11px Helvetica Neue").style("fill", "rgba(0,0,255,0.7)").style("cursor", "pointer").attr("text-anchor", "start").text("Lift time restriction").on("click", reset_minutes).exit().remove();
    }
    vis.selectAll(".yrule").data(xticks).enter().append("line").attr("class", "yrule").style("stroke", (d, i2) => i2 % 24 == 0 ? "#999" : "rgba(128,128,128,.2)").attr("x1", x2).attr("y1", 0).attr("x2", x2).attr("y2", h);
    var y_tick_precision;
    var y_ticks_formatter;
    var tooltip_formatter;
    if (params.plot_kind == "memory" || params.plot_kind == "heap") {
      y_ticks_formatter = (d) => format(".0f")(d / 1e3) + "k";
      tooltip_formatter = (d) => format(".0f")(d / 1e3) + "k";
    } else {
      y_tick_precision = params.max_y < 10 || params.zoomed_max_y < 10 ? ".1f" : ".0f";
      y_ticks_formatter = format(y_tick_precision);
      if (params.plot_kind == "time")
        tooltip_formatter = (d) => format(".1f")(d) + " ms";
      else
        tooltip_formatter = format("s");
    }
    vis.selectAll(".xlabel").data(xticks).enter().append("text").attr("class", "xlabel").attr("x", x2).attr("y", h).attr("dx", 0).attr("dy", 12).attr("text-anchor", "middle").style("font", "8px Helvetica Neue").text((d) => d * interval2 / 60);
    vis.append("svg:text").attr("class", "label").attr("dy", -25).attr("dx", -h / 2).style("font", "12px Helvetica Neue").attr("text-anchor", "middle").attr("transform", "rotate(270)").text(params.ylabel);
    function draw_grid() {
      var vgrid = vis.selectAll(".xrule").data(y2.ticks(10));
      vgrid.enter().append("line").attr("class", "xrule").style("stroke", (d, i2) => i2 == 0 ? "#999" : "rgba(128,128,128,.2)").attr("y1", y2).attr("x1", 0).attr("y2", y2).attr("x2", w);
      vgrid.exit().remove();
      var vlabels = vis.selectAll(".ylabel").data(y2.ticks(10));
      vlabels.enter().append("text").attr("class", "ylabel").attr("x", 0).attr("y", y2).attr("dx", -10).attr("dy", 3).attr("text-anchor", "middle").style("font", "8px Helvetica Neue").text(y_ticks_formatter);
      vlabels.exit().remove();
      vgrid.transition().duration(zoom_interval).attr("y1", y2).attr("y2", y2);
      vlabels.transition().duration(zoom_interval).attr("y", y2).text(y_ticks_formatter);
    }
    draw_grid();
    vis.selectAll(".legend").data(legend).enter().append("svg:text").attr("class", "legend").attr("x", (d, i2) => 10 + 120 * Math.floor(i2 / 2)).attr("y", (d, i2) => h + 50 + 14 * (i2 % 2)).on("click", (e, d) => submit_resource(d, e)).style("font", "10px sans-serif").style("cursor", "pointer").text(String);
    vis.selectAll(".legendmark").data(legend).enter().append("svg:circle").attr("class", "legendmark").attr("transform", "translate(-7,-3)").attr("cx", (d, i2) => 10 + 120 * Math.floor(i2 / 2)).attr("cy", (d, i2) => h + 50 + 14 * (i2 % 2)).attr("r", 4).on("click", (e, d) => submit_resource(d, e)).style("cursor", "pointer").style("stroke", (d, i2) => colors[i2]).style("fill", (d, i2) => colors[i2]);
    var request_count_formatter = format(max_request_count < 10 ? ",.1f" : ",.0f");
    vis.selectAll(".rlabel").data([50, 25, 0]).enter().append("text").attr("class", "rlabel").style("font", "10px Helvetica Neue").attr("text-anchor", "end").attr("y", (d, i2) => 50 - i2 * 25 - 1).attr("x", w - 1).text((d) => request_count_formatter(y22.invert(d)));
    var request_area = area_default().x((d) => x2(d.x + 0.5)).y0((d) => y22(d.y0)).y1((d) => y22(d.y + d.y0)).curve(monotoneX);
    var request_data = request_counts.map((d, i2) => ({ x: i2, y: d, y0: 0 }));
    vis.append("rect").style("cursor", "pointer").on("click", reset_minutes).attr("y", 0).attr("x", 0).attr("width", w).attr("height", 50).style("stroke", "none").style("fill", "rgba(128,128,128,.05)");
    var event_tooltip_text = "";
    function mouse_over_event(e, d) {
      console.log(d);
      var mouseCoords = pointer_default(e);
      select_default2("#eventLine" + events.findIndex((x3) => x3 == d)).style("stroke", "rgba(255,0,0,.5)");
      event_tooltip_text = d[1].split("\n").map((s) => (0, import_jquery4.default)("<p>").text(s).html()).join("<br>");
    }
    function mouse_over_out() {
      event_tooltip_text = "";
      selectAll_default2(".eventLine").style("stroke", "rgba(255,0,0,.0)");
    }
    vis.selectAll(".eventLine").data(events).enter().append("line").attr("class", "eventLine").attr("id", (d, i2) => "eventLine" + i2).style("stroke", "rgba(255,0,0,.0)").style("stroke-width", "3").attr("x1", (d, i2) => x2(d[0] / interval2)).attr("y1", 0).attr("x2", (d, i2) => x2(d[0] / interval2)).attr("y2", h).on("mouseover", mouse_over_event).on("mousemove", mouse_over_event).on("mouseout", mouse_over_out);
    vis.append("line").attr("y1", 0).attr("x1", 0).attr("y2", 0).attr("x2", w).style("stroke", "#999").style("fill", "none");
    var request_tooltip_text = "";
    var mouse_down_start = -1;
    var mouse_down_end = -1;
    var mouse_down_resource = "";
    var ignore_click = false;
    function valid_minute(m) {
      if (m < 0)
        return 0;
      else if (m > 1440 / interval2)
        return 1440 / interval2;
      else
        return m;
    }
    function log_selection(prefix) {
      console.log("" + prefix + "[" + mouse_down_start + "," + mouse_down_end + "]");
    }
    function restore_selection() {
      mouse_down_start = -1;
      mouse_down_end = -1;
      mouse_down_resource = "";
      vis.selectAll(".selection").attr("x", x2(start_minute / interval2)).attr("width", x2(end_minute / interval2) - x2(start_minute / interval2) + 1).attr("display", start_minute > 0 || end_minute < 1440 ? null : "none");
    }
    (0, import_jquery4.default)(document).on("mouseup", finish_time_selection);
    function start_time_selection(di, event) {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }
      vis.selectAll(".selection").attr("x", x2(di)).attr("width", 1).attr("height", h).attr("display", null);
    }
    function update_time_selection(di, event) {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }
      if (mouse_down_start > 0) {
        var m = valid_minute(di);
        mouse_down_end = m;
        if (m >= mouse_down_start) {
          vis.selectAll(".selection").attr("width", x2(m) - x2(mouse_down_start) + 1);
        } else {
          vis.selectAll(".selection").attr("x", x2(m)).attr("width", x2(mouse_down_start) - x2(m) + 1);
        }
      }
    }
    function finish_time_selection(event) {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }
      if (mouse_down_start >= 0) {
        if (mouse_down_end >= mouse_down_start)
          select_minutes(mouse_down_start, mouse_down_end);
        else
          select_minutes(mouse_down_end, mouse_down_start);
        mouse_down_start = -1;
        mouse_down_end = -1;
        mouse_down_resource = "";
        ignore_click = true;
      }
    }
    function mouse_over_requests(e, d) {
      e.stopPropagation();
      var p = pointer_default(e);
      var di = Math.ceil(x2.invert(p[0])) - 1;
      request_tooltip_text = format("d")(request_counts[di]) + " req/sec" + time_suffix(di * interval2);
      update_time_selection(di);
    }
    function mouse_down_over_requests(e, d) {
      var p = pointer_default(e);
      var di = Math.ceil(x2.invert(p[0])) - 1;
      mouse_down_start = di;
      mouse_down_end = di;
      start_time_selection(di, e);
    }
    function mouse_up_over_requests(e, d) {
      var p = pointer_default(e);
      var di = Math.ceil(x2.invert(p[0])) - 1;
      update_time_selection(di);
      finish_time_selection(e);
    }
    function mouse_out_of_requests() {
      request_tooltip_text = "";
    }
    function mouse_over_root(e, d) {
      var p = pointer_default(e);
      var di = Math.ceil(x2.invert(p[0] - 40)) - 1;
      update_time_selection(di);
    }
    function mouse_up_over_root(e, d) {
      var p = pointer_default(e);
      var di = Math.ceil(x2.invert(p[0] - 40)) - 1;
      update_time_selection(di);
      finish_time_selection();
    }
    vis.selectAll(".request_count").data([request_data]).enter().append("path").attr("class", "request_count").style("fill", "rgba(128,128,128,0.2)").style("cursor", "pointer").on("mousedown", mouse_down_over_requests).on("mouseup", mouse_up_over_requests).on("mouseover", mouse_over_requests).on("mousemove", mouse_over_requests).on("mouseout", mouse_out_of_requests).style("stroke", "rgba(128,128,128,0.3)").style("stroke-width", 1).attr("d", request_area);
    (0, import_jquery4.default)(".request_count").tipsy({
      trigger: "hover",
      follow: "x",
      offset: 0,
      offsetX: 0,
      offsetY: -20,
      gravity: "s",
      html: false,
      title: () => request_tooltip_text
    });
    (0, import_jquery4.default)(".selection").tipsy({
      trigger: "hover",
      follow: "x",
      offset: 0,
      offsetX: 0,
      offsetY: -20,
      gravity: "s",
      html: false,
      title: () => request_tooltip_text
    });
    var layer_tooltip_text = "";
    var tooltime_formatter = format("02d");
    function time_suffix(n) {
      var h2 = Math.floor(n / 60);
      var m = Math.floor(n % 60);
      return " ~ " + tooltime_formatter(h2) + ":" + tooltime_formatter(m);
    }
    function mouse_down_over_layer(e, d) {
      var p = pointer_default(e);
      var di = Math.ceil(x2.invert(p[0])) - 1;
      mouse_down_start = di;
      mouse_down_end = di;
      mouse_down_resource = d.key;
      start_time_selection(di);
    }
    function mouse_over_layer(e, d) {
      var p = pointer_default(e);
      var di = Math.ceil(x2.invert(p[0])) - 1;
      var dp = data[d.index][di];
      layer_tooltip_text = tooltip_formatter(dp[1]) + " " + d.key + time_suffix(dp[0] * interval2);
      update_time_selection(dp[0]);
    }
    function prepare_data(d) {
      var res = [];
      for (let minute = 0; minute < d[0].length; minute++) {
        let e = { minute };
        for (let i2 = 0; i2 < d.length; i2++) {
          e[legend[i2]] = d[i2][minute][1];
        }
        res.push(e);
      }
      return res;
    }
    function prepare_keys(d) {
      return legend.slice(0, d.length);
    }
    var stackedData = stack_default().keys(prepare_keys(data))(prepare_data(data));
    var area = area_default().x((d) => x2(d.data.minute + 0.5)).y0((d) => y2(d[0])).y1((d) => y2(d[1])).curve(monotoneX);
    vis.selectAll(".layer").data(stackedData).enter().append("path").attr("class", "layer").style("fill", (d, i2) => colors[i2]).style("cursor", (d, i2) => legend[i2] == "free slots" ? "arrow" : "pointer").on("mousedown", mouse_down_over_layer).on("mousemove", mouse_over_layer).on("mouseover", mouse_over_layer).on("mouseout", (e, d) => {
      layer_tooltip_text = "";
    }).style("stroke", "none").attr("d", area);
    (0, import_jquery4.default)(".layer").tipsy({
      trigger: "hover",
      follow: "x",
      offset: 0,
      offsetX: 0,
      offsetY: -20,
      gravity: "s",
      html: false,
      title: () => layer_tooltip_text
    });
    if (gc_time != null) {
      var gc_line = line_default().x((d) => x2(d[0] + 0.5)).y((d) => y2(d[1])).curve(cardinal_default);
      var glg = vis.append("g").data([gc_time]);
      var da_gc_line = glg.append("path").attr("class", "gc_time").attr("d", gc_line).style("stroke", "rgba(0,0,0,.9)").style("fill", "none");
    }
    if (total_time_max != null) {
      var total_time_max_line = line_default().x((d) => x2(d[0] + 0.5)).y((d) => y2(d[1])).curve(stepAfter);
      var dlg = vis.append("g").data([total_time_max]);
      var da_total_time_max_line = dlg.append("path").attr("class", "total_time_max").attr("d", total_time_max_line).style("stroke", "rgba(0,0,0,0)").style("fill", "none");
    }
    if (dom_interactive != null) {
      var interactive_line = line_default().x((d) => x2(d[0] + 0.5)).y((d) => y2(d[1])).curve(cardinal_default);
      var dlg = vis.append("g").data([dom_interactive]);
      var da_interactive_line = dlg.append("path").attr("class", "dom_interactive").attr("d", interactive_line).style("stroke", "rgba(94,73,234,.9)").style("fill", "none");
    }
    var zoomed = true;
    function zoom_in_or_out() {
      var new_max_y = zoomed ? max_y : zoomed_max_y;
      zoomed = !zoomed;
      y2.domain([0, new_max_y]).nice();
      redraw();
    }
    vis.append("rect").attr("class", "selection").attr("y", 0).attr("height", 50).attr("x", x2(start_minute / interval2)).attr("width", x2(end_minute / interval2) - x2(start_minute / interval2) + 1).attr("display", start_minute > 0 || end_minute < 1440 ? null : "none").style("pointer-events", "none").style("stroke", "none").style("fill", "rgba(255,0,0,0.3)");
    function redraw() {
      draw_grid();
      vis.selectAll(".layer").transition().duration(zoom_interval).attr("d", area);
      if (gc_time != null) {
        da_gc_line.transition().duration(zoom_interval).attr("d", gc_line);
      }
      ;
      if (total_time_max != null) {
        da_total_time_max_line.transition().duration(zoom_interval).style("stroke", zoomed ? "rgba(0,0,0,0)" : "rgba(0,0,0,0.8)").attr("d", total_time_max_line);
      }
      ;
      if (dom_interactive != null) {
        da_interactive_line.transition().duration(zoom_interval).attr("d", interactive_line);
      }
      ;
      vis.selectAll(".zoom_button").transition().duration(zoom_interval).text(zoomed ? "Zoom out" : "Zoom in");
    }
    vis.selectAll(".event").data(events).enter().append("polygon").attr("class", "event").attr("points", (d, i2) => {
      var xCenter = x2(d[0] / interval2), y3 = h + 5, p1 = [xCenter - 4, y3], p2 = [xCenter + 4, y3], p3 = [xCenter, y3 - 5];
      var what = [p1, p2, p3].map((point4) => point4[0] + "," + point4[1]).join(" ");
      return what;
    }).style("stroke", "rgba(255,0,0,0)").style("fill", "rgba(255,0,0,0.7)").on("mouseover", mouse_over_event).on("mousemove", mouse_over_event).on("mouseout", mouse_over_out);
    var event_tip_options = {
      trigger: "hover",
      follow: "x",
      offset: 0,
      offsetX: 10,
      offsetY: 20,
      gravity: "w",
      html: true,
      title: () => event_tooltip_text
    };
    (0, import_jquery4.default)(".event").tipsy(event_tip_options);
    (0, import_jquery4.default)(".eventLine").tipsy(event_tip_options);
  }
  var import_jquery4;
  var init_logjam_resource_plot = __esm({
    "vendor/logjam/app/assets/javascripts/logjam-resource-plot.js"() {
      init_src32();
      import_jquery4 = __toESM(require_jquery());
      init_page_context();
      init_logjam_header();
      window.logjam_resource_plot = logjam_resource_plot;
    }
  });

  // vendor/logjam/app/assets/javascripts/logjam-quants-plot.js
  function logjam_quants_plot(params, resource, id2, label, scale) {
    function get_height() {
      var height = (0, import_jquery5.default)("#" + id2).height() - 100;
      if (height > 0)
        return height;
      else
        return 500;
    }
    var w = document.getElementById(id2).offsetWidth - 120, h = get_height(), legend = params.legend, color2 = params.color_map[resource], formatter = format(".0s"), bucket_values = params.buckets.map((d) => d.bucket);
    var x2 = band().domain(bucket_values).paddingInner([0.01]).paddingOuter([0.01]).range([0, w]);
    var y2 = (scale == "linear" ? linear3 : log)().domain([0.1, params.max_y]).range([h, 0]);
    var vis = select_default2("#" + id2).append("svg").attr("width", w + 100).attr("height", h + 100).append("g").attr("transform", "translate(50,50)");
    vis.append("svg:text").attr("dy", h + 40).attr("dx", w / 2).style("font", "12px sans-serif").attr("text-anchor", "middle").attr("text-transform", "capitalize").text(label);
    var xaxis = vis.append("svg:line").style("fill", "#999").style("stroke", "#999").attr("x1", 0).attr("y1", h).attr("x2", w).attr("y2", h);
    vis.selectAll(".xtick").data(bucket_values).enter().append("line").attr("class", "xtick").attr("x1", (d) => x2(d) + x2.bandwidth()).attr("x2", (d) => x2(d) + x2.bandwidth()).attr("y1", h).attr("y2", h + 5).style("fill", "#999").style("stroke", "#999");
    vis.selectAll(".xlabel").data(bucket_values).enter().append("text").attr("class", "xlabel").attr("x", (d) => x2(d) + x2.bandwidth()).attr("y", h).attr("dy", 17).attr("text-anchor", "middle").style("font", "8px sans-serif").text(formatter);
    vis.append("svg:text").attr("dy", -40).attr("dx", -h / 2).style("font", "12px sans-serif").attr("text-anchor", "middle").attr("transform", "rotate(270)").text("Number of requests");
    var yaxis = vis.append("svg:line").style("fill", "#999").style("stroke", "#999").attr("x1", 0).attr("y1", h).attr("x2", 0).attr("y2", 0);
    vis.selectAll(".ytick").data(y2.ticks()).enter().append("line").attr("class", "ytick").attr("x1", 0).attr("x2", -5).attr("y1", y2).attr("y2", y2).style("fill", "#999").style("stroke", "#999").attr("display", (d, i2) => i2 > 0 && i2 % 9 == 0 ? null : "none");
    vis.selectAll(".ylabel").data(y2.ticks()).enter().append("text").attr("class", "ylabel").attr("x", 0).attr("y", (d) => y2(d)).attr("dx", -17).attr("text-anchor", "middle").attr("display", (d, i2) => i2 > 0 && i2 % 9 == 0 ? null : "none").style("font", "9px sans-serif").text(formatter);
    function draw_percentile(xp, key, j2) {
      var a = [x2(xp) + x2.bandwidth(), 0];
      var b = [x2(xp) + x2.bandwidth(), h];
      vis.append("svg:line").style("fill", "rgba(0,0,0,0.5)").style("stroke", "rgba(0,0,0,0.5)").attr("x1", a[0]).attr("y1", a[1]).attr("x2", b[0]).attr("y2", b[1]);
      vis.append("svg:path").attr("transform", "translate(" + a[0] + "," + a[1] + ")").attr("d", Symbol2().type(circle_default).size(64)).style("stroke", "#aaa").style("fill", "#aaa");
      vis.append("svg:text").attr("dx", a[0]).attr("dy", a[1] - 10).attr("text-anchor", "middle").style("font", "10px sans-serif").text(key);
    }
    function draw_percentiles() {
      var pos = 0;
      var xp90 = params.percentiles[resource].p90;
      var xp95 = params.percentiles[resource].p95;
      var xp99 = params.percentiles[resource].p99;
      if (xp90 != xp95) {
        draw_percentile(xp90, "p90", pos);
        pos += 1;
      }
      if (xp95 != xp99) {
        draw_percentile(xp95, "p95", pos);
        pos += 1;
      }
      draw_percentile(xp99, "p99", pos);
    }
    draw_percentiles();
    vis.selectAll(".bar").data(params.buckets).enter().append("rect").attr("class", "bar").style("fill", color2).attr("x", (d) => x2(d.bucket)).attr("y", (d) => y2(d[resource])).attr("width", x2.bandwidth()).attr("height", (d) => h - y2(d[resource])).on("mousemove", mouse_over_bar).on("mouseover", mouse_over_bar).on("mouseout", mouse_over_out);
    var tooltip_text = "";
    var tooltip_formatter = format(".2s");
    function mouse_over_bar(e, d) {
      tooltip_text = tooltip_formatter(d[resource]) + " requests";
    }
    function mouse_over_out() {
      tooltip_text = "";
    }
    (0, import_jquery5.default)(".bar").tipsy({
      trigger: "hover",
      follow: "x",
      offset: 0,
      offsetX: 0,
      offsetY: -20,
      gravity: "s",
      html: false,
      title: () => tooltip_text
    });
  }
  var import_jquery5;
  var init_logjam_quants_plot = __esm({
    "vendor/logjam/app/assets/javascripts/logjam-quants-plot.js"() {
      init_src32();
      import_jquery5 = __toESM(require_jquery());
      window.logjam_quants_plot = logjam_quants_plot;
    }
  });

  // vendor/logjam/app/assets/javascripts/logjam-heatmap-plot.js
  function logjam_heatmap_plot(params) {
    var data = params.data, interval2 = params.interval, container = params.container, resource = params.resource;
    var B = params.data["0"].length;
    function get_height() {
      var enlarged_size = (0, import_jquery6.default)("#enlarged-plot").height() - 130;
      if (enlarged_size > 0) {
        return enlarged_size;
      }
      var parent_height = (0, import_jquery6.default)(container).parent(".item").height() - 100;
      return parent_height > 170 ? parent_height : 170;
    }
    var w = document.getElementById(container.slice(1)).offsetWidth - 60 < 400 ? 626 : document.getElementById(container.slice(1)).offsetWidth - 60, h = get_height(), xticks = range(25).map((h2) => h2 / interval2 * 60), x2 = linear3().domain([0, 1440 / interval2]).range([0, w]), y2 = linear3().domain([0, B]).range([h, 0]).nice(), cardWidth = x2(2) - x2(1) + 1, cardHeight = h / B;
    var tiles = [];
    for (var key in data)
      tiles = tiles.concat(data[key].map((d, i2) => {
        return {
          minute: +key,
          bucket: i2,
          value: d
        };
      }).filter((e) => e.value > 0));
    var origMaxValue = max(tiles, (d) => d.value);
    if (params.scale == "logarithmic") {
      tiles.forEach((d) => {
        d.value = Math.log(d.value);
      });
    }
    ;
    var maxValue = max(tiles, (d) => d.value);
    var maxBucket = max(tiles, (d) => d.bucket);
    var colorInterpolator;
    if (resource == "page_time") {
      colorInterpolator = Greens_default;
    } else if (resource == "ajax_time") {
      colorInterpolator = Reds_default;
    } else {
      colorInterpolator = Blues_default;
    }
    var color2 = sequential(colorInterpolator).domain([-0.1 * maxValue, maxValue]);
    var vis = select_default2(params.container).append("svg").attr("width", w + 50).attr("height", h + 80).style("stroke", "#999").style("strokeWidth", 1).append("g").attr("transform", "translate(40,30)");
    vis.append("svg:text").attr("class", "label").attr("dy", h + 30).attr("dx", w / 2).style("font", "12px Helvetica Neue").attr("text-anchor", "middle").text("Time of day");
    vis.append("line").attr("class", "xrule").style("stroke", "#999").attr("y1", h).attr("x1", 0).attr("y2", h).attr("x2", w);
    vis.selectAll(".xlabel").data(xticks).enter().append("text").attr("class", "xlabel").attr("x", x2).attr("y", h).attr("dx", 0).attr("dy", 12).attr("text-anchor", "middle").style("font", "8px Helvetica Neue").text((d) => d * interval2 / 60);
    vis.append("svg:text").attr("class", "label").attr("dy", -30).attr("dx", -h / 2).style("font", "12px Helvetica Neue").attr("text-anchor", "middle").attr("transform", "rotate(270)").text("Response Time");
    vis.append("line").attr("class", "yrule").style("stroke", "#999").attr("y1", h).attr("x1", 0).attr("y2", 0).attr("x2", 0);
    var ylabels = [
      "0ms",
      "1ms",
      "3ms",
      "10ms",
      "30ms",
      "0.1s",
      "0.3s",
      "1s",
      "3s",
      "10s",
      "30s",
      "100s",
      "5m",
      "17m",
      "50m",
      "2.6h",
      "8.3h",
      "1.2d",
      "3.5d"
    ];
    vis.selectAll(".ylabel").data(y2.ticks(maxBucket)).enter().append("text").attr("class", "ylabel").attr("x", 0).attr("y", y2).attr("dx", -3).attr("dy", 0).attr("text-anchor", "end").style("font", "8px Helvetica Neue").text((d, i2) => ylabels[i2]);
    var cards = vis.selectAll(".card").data(tiles, (d) => d.minute + ":" + d.bucket);
    var tooltip_text = "";
    var tooltip_formatter = format(",d");
    function format2(value) {
      if (params.scale == "logarithmic")
        value = Math.pow(Math.E, value);
      return tooltip_formatter(value) + " requests";
    }
    cards.append("title");
    cards.enter().append("rect").attr("x", (d) => x2(d.minute)).attr("y", (d) => y2(d.bucket + 1)).attr("class", "card").attr("width", cardWidth).attr("height", cardHeight).on("mousemove", function(e, d) {
      tooltip_text = format2(d.value);
    }).on("mouseover", function(e, d) {
      tooltip_text = format2(d.value);
    }).on("mouseout", function(e, d) {
      tooltip_text = "";
    }).style("stroke-width", 0).style("fill", function(d) {
      return color2(d.value);
    });
    cards.transition().duration(1e3).style("fill", function(d) {
      return color2(d.value);
    });
    cards.select("title").text(function(d) {
      return d.value;
    });
    cards.exit().remove();
    (0, import_jquery6.default)(".card").tipsy({
      trigger: "hover",
      follow: "x",
      offset: 0,
      offsetX: 0,
      offsetY: -20,
      gravity: "s",
      html: false,
      title: function() {
        return tooltip_text;
      }
    });
    var legendWidth = w / 2 - 70 - 1;
    var legendScale = linear3().domain([1, origMaxValue]).range([0, legendWidth - 1]);
    var legend = axisBottom().scale(legendScale).tickArguments([10, "s"]);
    vis.append("g").attr("transform", "translate(0," + (h + 35) + ")").call(legend);
    vis.selectAll(".mybars").data(range(legendWidth)).enter().append("rect").attr("class", "mybars").attr("x", function(d, i2) {
      return i2;
    }).attr("y", h + 20).attr("height", 15).attr("width", 1).style("stroke", "none").style("fill", function(d, i2) {
      return color2(maxValue * 1 / legendWidth * i2);
    });
  }
  var import_jquery6;
  var init_logjam_heatmap_plot = __esm({
    "vendor/logjam/app/assets/javascripts/logjam-heatmap-plot.js"() {
      init_src32();
      import_jquery6 = __toESM(require_jquery());
      window.logjam_heatmap_plot = logjam_heatmap_plot;
    }
  });

  // vendor/logjam/app/assets/javascripts/logjam-history-bar-chart.js
  function logjam_history_bar_chart(data, divid, metric, params, kind) {
    var week_end_colors = params.week_end_colors;
    var week_day_colors = params.week_day_colors;
    var title = metric.replace(/_/g, " ");
    if (title == "apdex score")
      title = "apdex score \xABtotal time\xBB";
    else if (title == "papdex score")
      title = "apdex score \xABpage time\xBB";
    else if (title == "xapdex score")
      title = "apdex score \xABajax time\xBB";
    function week_day(date3) {
      var day = date3.getDay();
      return day > 0 && day < 6;
    }
    function bar_color(date3, metric2) {
      return week_day(date3) ? week_day_colors[metric2] : week_end_colors[metric2];
    }
    function bar_class(date3) {
      return week_day(date3) ? "bar weekday" : "bar weekend";
    }
    function is_metric() {
      return kind == "m";
    }
    var margin = { top: 25, right: 80, bottom: 50, left: 80 }, width = document.getElementById("request-history").offsetWidth - margin.left - margin.right - 80, height = 150 - margin.top - margin.bottom, date_min = min(data, (d) => d.date), date_max = max(data, (d) => d.date), relevant_data = data.filter((d) => is_metric() ? metric in d : metric in d.exception_counts), data_min = min(relevant_data, (d) => is_metric() ? d[metric] : d.exception_counts[metric]), data_max = max(relevant_data, (d) => is_metric() ? d[metric] : d.exception_counts[metric]);
    if (typeof data_min == "undefined" || data_min == 0 && data_max == 0)
      return;
    if (data_min == data_max || metric == "request_count")
      data_min = 0;
    date_max = timeDay.offset(date_max, 1);
    var formatter;
    if (metric.match(/(apdex|xapdex|papdex)_score/i)) {
      data_max = 1;
      data_min = min([0.92, data_min]);
      formatter = format(".2f");
    } else if (metric.match(/request_count|errors|warnings|exceptions|five_hundreds/i) || !is_metric()) {
      if (data_max - data_min > 10) {
        formatter = format(",.0d");
      } else {
        formatter = format(",.3r");
      }
    } else if (metric == "availability") {
      formatter = format(",.5r");
    } else {
      formatter = format(",.3r");
    }
    var x2 = utcTime().range([0, width]);
    var y2 = linear3().range([height, 0]);
    var xAxis = axisBottom(x2);
    var yAxis = axisLeft(y2).ticks(5).tickFormat(formatter);
    var svg = select_default2("#" + divid).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    x2.domain([date_min, date_max]);
    y2.domain([data_min, data_max]).nice(5);
    svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
    svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("class", "title").attr("y", -20).attr("x", 1).attr("dy", ".71em").style("text-anchor", "start").text(title);
    var bar_tooltip_text = "";
    var tooltip_formatter = format(",r");
    var date_formatter = timeFormat("%b %d");
    var exception_formatter = format(",d");
    function mouse_over_bar(e, d) {
      bar_tooltip_text = date_formatter(d.date) + " ~ " + (is_metric() ? tooltip_formatter(d[metric]) : exception_formatter(d.exception_counts[metric]));
    }
    function mouse_out_of_bar(e, d) {
      bar_tooltip_text = "";
    }
    var bar_width = x2(data[data.length - 1].date) - x2(data[data.length - 2].date) - 0.1;
    svg.selectAll(".bar").data(relevant_data).enter().append("rect").attr("class", (d) => bar_class(d.date)).attr("x", (d) => x2(d.date)).attr("width", bar_width).attr("y", (d) => y2(is_metric() ? d[metric] : d.exception_counts[metric])).attr("height", (d) => height - y2(is_metric() ? d[metric] : d.exception_counts[metric])).attr("cursor", "pointer").style("fill", (d) => bar_color(d.date, metric)).on("click", (e, d) => view_date(d.date)).on("mousemove", mouse_over_bar).on("mouseover", mouse_over_bar).on("mouseout", mouse_out_of_bar);
    (0, import_jquery7.default)(".bar").tipsy({
      trigger: "hover",
      follow: "x",
      offset: 0,
      offsetX: 0,
      offsetY: -20,
      gravity: "s",
      html: false,
      title: () => bar_tooltip_text
    });
  }
  var import_jquery7;
  var init_logjam_history_bar_chart = __esm({
    "vendor/logjam/app/assets/javascripts/logjam-history-bar-chart.js"() {
      init_src32();
      import_jquery7 = __toESM(require_jquery());
      init_logjam_header();
      window.logjam_history_bar_chart = logjam_history_bar_chart;
    }
  });

  // vendor/logjam/app/assets/javascripts/logjam-livestream.js
  function logjam_live_stream_chart(params) {
    var resources = params.resources;
    var colors = params.colors;
    var connection_status = "disconnected";
    var legend = params.legend;
    var warning_level = 3;
    var update_interval = 1;
    var transparent_ico_path = params.transparent_ico_path;
    var response_filter = [];
    var w = parseInt(document.getElementById("live-stream-chart").offsetWidth - 100, 10), h = 300, slice3 = 10, x2 = linear3().domain([0, 600]).range([0, w]), y2 = linear3().domain([0, 100]).range([h, 0]).nice(), y22 = linear3([0, 0]).range([50, 0]).nice(), color_map = ordinal().domain(colors);
    var c = color_map.range();
    function zeros() {
      return range(600 / slice3 + 2).map(() => 0);
    }
    var data = range(resources.length).map(zeros);
    var request_counts = zeros();
    var vis = select_default2("#live-stream-chart").append("svg").attr("width", w + 70).attr("height", h + 70).style("stroke", "#999").style("strokeWidth", 1).append("g").attr("transform", "translate(40,10)");
    function connection_status_color() {
      switch (connection_status) {
        case "connected":
          return "rgba(123,128,128,.5)";
        case "connecting":
          return "rgba(0,128,128,.5)";
        case "disconnected":
          return "rgba(123,0,0,.5)";
        default:
          return "black";
      }
    }
    var status_label = vis.append("text").attr("x", 4).attr("y", 4).attr("text-anchor", "start").attr("dy", ".71em").style("font", "bold 14px Helvetica Neue").style("fill", connection_status_color).style("stroke", "none").text(connection_status);
    vis.selectAll(".yrule").data(x2.ticks(600 / slice3)).enter().append("line").attr("class", "yrule").style("stroke", (d, i2) => i2 % 60 == 0 ? "#999" : "rgba(128,128,128,.2)").attr("x1", x2).attr("y1", 0).attr("x2", x2).attr("y2", h);
    vis.selectAll(".x-axis-label").data(x2.ticks(6)).enter().append("text").attr("x", x2).attr("y", h + 5).attr("dx", 2).attr("text-anchor", "middle").attr("dy", ".71em").style("font", "10px Helvetica Neue").style("fill", "#000").style("stroke", "none").attr("display", (d) => d && d / slice3 % 10 == 0 ? null : "none").text((d) => "t" + (d / slice3 - 60));
    vis.append("line").attr("y1", 0).attr("x1", 0).attr("y2", 0).attr("x2", w).style("stroke", "#999").style("fill", "none");
    vis.append("svg:text").attr("class", "label").attr("dy", -25).attr("dx", -h / 2).style("font", "14px Helvetica Neue").style("fill", "#999").style("stroke", "none").attr("text-anchor", "middle").attr("transform", "rotate(270)").text("Response time (ms)");
    function init_row(r) {
      return r.map((d, i2) => {
        return { x: i2, y: d, y0: 0 };
      });
    }
    function init_stack2(data2) {
      return data2.map((r) => {
        return init_row(r);
      });
    }
    function compute_stack(d) {
      for (i = 1; i < d.length; i++) {
        for (j = 0; j < d[i].length; j++) {
          d[i][j].y0 = d[i - 1][j].y0 + d[i - 1][j].y;
        }
      }
    }
    var ldata = init_stack2(data);
    compute_stack(ldata);
    var area = area_default().x((d) => x2(d.x * slice3)).y0((d) => y2(d.y0)).y1((d) => y2(d.y + d.y0)).curve(monotoneX);
    vis.append("svg:clipPath").attr("id", "clip").append("svg:rect").attr("width", w).attr("height", h);
    var clip = vis.append("g").attr("clip-path", "url(#clip)");
    var pane = clip.append("g");
    pane.selectAll(".layer").data(ldata).enter().append("path").attr("class", "layer").style("fill", (d, i2) => colors[i2]).style("stroke", (d, i2) => colors[i2]).attr("d", area);
    var request_area = area_default().x((d) => x2(d.x * slice3)).y0((d) => y22(d.y0)).y1((d) => y22(d.y + d.y0)).curve(monotoneX);
    var request_data = init_row(request_counts);
    pane.selectAll(".request_count").data([request_data]).enter().append("path").attr("class", "request_count").style("fill", "rgba(128,128,128,0.3)").style("stroke", "rgba(64,64,64,0.3)").attr("d", request_area);
    vis.selectAll(".legend").data(legend).enter().append("svg:text").attr("class", "legend").attr("x", (d, i2) => 10 + 120 * Math.floor(i2 / 2)).attr("y", (d, i2) => h + 30 + 14 * (i2 % 2)).style("font", "10px Helvetica Neue").style("stroke", "none").style("fill", "#000").text(String);
    vis.selectAll(".legendmark").data(legend).enter().append("svg:circle").attr("class", "legendmark").attr("transform", "translate(-7,-3)").attr("cx", (d, i2) => 10 + 120 * Math.floor(i2 / 2)).attr("cy", (d, i2) => h + 30 + 14 * (i2 % 2)).attr("r", 4).style("stroke", (d, i2) => colors[i2]).style("fill", (d, i2) => colors[i2]);
    var request_count_formatter = format(",.2r");
    var perf_data_formatter = format(",.2r");
    vis.selectAll(".rlabel").data([50, 25, 0]).enter().append("text").style("stroke", "none").style("fill", "#000").attr("class", "rlabel").style("font", "10px Helvetica Neue").attr("text-anchor", "end").attr("y", (d, i2) => 50 - i2 * 25 - 1).attr("x", w - 1).text((d) => request_count_formatter(y22.invert(d)));
    function re_scale() {
      var max_y = 0;
      var num_areas = data.length;
      var num_slots = data[0].length;
      for (var i2 = 0; i2 < num_slots; ++i2) {
        var sum_slot = 0;
        for (var j2 = 0; j2 < num_areas; ++j2)
          sum_slot += data[j2][i2];
        if (sum_slot > max_y)
          max_y = sum_slot;
      }
      ;
      var max_requests = max(request_counts);
      y2 = linear3().domain([0, max_y]).range([h, 0]).nice();
      y22 = linear3().domain([0, max_requests]).range([50, 0]).nice();
      if (max_requests < 10) {
        request_count_formatter = format(",.2r");
      } else {
        request_count_formatter = format(",.0d");
      }
      if (max_y < 10) {
        perf_data_formatter = format(",.2r");
      } else {
        perf_data_formatter = format(",.0d");
      }
    }
    ;
    function update_chart(values) {
      var count = values["count"];
      request_counts.push(count);
      request_counts.shift();
      for (var i2 = 0, len = resources.length; i2 < len; ++i2) {
        var val = values[resources[i2]];
        if (count == 0 || val == null)
          val = 0;
        else
          val /= count;
        data[i2].push(val);
        data[i2].shift();
      }
      ;
      re_scale();
      redraw();
    }
    ;
    function severity_label(i2) {
      switch (i2) {
        case 0:
          return "debug";
        case 1:
          return "info";
        case 2:
          return "warn";
        case 3:
          return "error";
        case 4:
          return "fatal";
        default:
          return "unknown";
      }
    }
    ;
    function severity_image(i2) {
      var label = severity_label(i2);
      return "<img src ='" + transparent_ico_path + "' class='bg" + label + "' /> " + label.toUpperCase();
    }
    function error_url(request_id, time) {
      var date3 = time.slice(0, 10).replace(/-/g, "/");
      return "/" + date3 + "/show/" + request_id + "?" + params.app_env;
    }
    function get_parameter_by_name(name, url) {
      if (!url)
        url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
      if (!results)
        return null;
      if (!results[2])
        return "";
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    function initialize_filter() {
      var exclude_response = get_parameter_by_name("exclude_response");
      if (exclude_response) {
        response_filter = exclude_response.split(",").map((value) => parseInt(value, 10));
      }
    }
    function update_errors(errors) {
      var table = (0, import_jquery8.default)("#recent-errors");
      var list = (0, import_jquery8.default)("#recent-errors-head");
      var today = new Date().toISOString().slice(0, 10);
      for (var i2 = 0, len = errors.length; i2 < len; ++i2) {
        var e = errors[i2];
        var severity_value = e["severity"];
        if (severity_value < warning_level) {
          continue;
        }
        var response_code = e["response_code"];
        if (import_jquery8.default.inArray(response_code, response_filter) > -1) {
          continue;
        }
        var severity = severity_image(severity_value);
        var action = e["action"];
        var date3 = e["time"].slice(0, 10);
        var time = date3 == today ? e["time"].slice(11, 19) : e["time"];
        var desc = e["description"].substring(0, 80);
        var url = error_url(e["request_id"], e["time"]);
        var new_row = (0, import_jquery8.default)("<tr class='full_stats'><td>" + severity + "</td><td>" + response_code + "</td><td>" + time + "</td><td>" + action + "</td><td>" + desc + "</td></tr>");
        new_row.hide().addClass("new_error clickable");
        var onclick = function(u) {
          return function() {
            window.open(u, "_blank");
          };
        }(url);
        new_row.children().on("click", onclick);
        var rows = (0, import_jquery8.default)("#recent-errors tr");
        var l = rows.size() - 20;
        for (var j2 = 0; j2 < l; ++j2) {
          rows.last().remove();
        }
        new_row.removeAttr("style");
        list.after(new_row);
        var remove_color = function(row) {
          return function() {
            window.setTimeout(function() {
              row.removeClass("new_error");
            }, 1e4);
          };
        };
        new_row.fadeIn(2e3, remove_color(new_row));
      }
    }
    ;
    function update_anomaly_score(value) {
      var score = value["score"];
      var is_anomaly = value["anomaly"];
      (0, import_jquery8.default)("#anomaly-score-value").html(format(".2f")(score));
      (0, import_jquery8.default)("#anomaly-score-value").css("color", is_anomaly ? "red" : "green");
      (0, import_jquery8.default)("#anomaly-score").show();
    }
    ;
    function update_view(value) {
      if (Array.isArray(value)) {
        update_errors(value);
      } else if ("anomaly" in value)
        update_anomaly_score(value);
      else {
        update_chart(value);
        (0, import_jquery8.default)("#livestream-updated-at").html(new Date().toLocaleTimeString());
      }
    }
    ;
    var ws = null;
    function redraw() {
      ldata = init_stack2(data);
      compute_stack(ldata);
      request_data = init_row(request_counts);
      pane.selectAll(".layer").data(ldata).attr("d", area);
      pane.selectAll(".request_count").data([request_data]).attr("d", request_area);
      pane.attr("transform", "translate(" + x2(0) + ")").transition().ease(linear2).duration(update_interval).attr("transform", "translate(" + x2(-slice3) + ")");
      vis.selectAll(".rlabel").data([50, 25, 0]).transition().duration(100).text((d) => request_count_formatter(y22.invert(d)));
      var vgrid = vis.selectAll(".xrule").data(y2.ticks(10));
      vgrid.enter().append("line").attr("class", "xrule").style("stroke", (d, i2) => d ? "rgba(128,128,128,.2)" : "#999").attr("y1", y2).attr("x1", 0).attr("y2", y2).attr("x2", w);
      vgrid.exit().remove();
      vgrid.transition().duration(100).attr("y1", y2).attr("y2", y2);
      var vlabels = vis.selectAll(".ylabel").data(y2.ticks(10));
      vlabels.enter().append("text").attr("class", "ylabel").attr("text-anchor", "middle").style("font", "10px Helvetica Neue").style("stroke", "none").style("fill", "#000").text(perf_data_formatter).attr("x", 0).attr("y", y2).attr("dx", -10).attr("dy", 3);
      vlabels.exit().remove();
      vlabels.transition().duration(100).attr("y", y2).text(String);
    }
    function change_connection_status(new_status) {
      if (new_status != connection_status) {
        connection_status = new_status;
        status_label.transition().text(new_status).style("fill", connection_status_color);
      }
    }
    var timeoutID = null;
    function reconnect() {
      if (document.hidden)
        return;
      var button = (0, import_jquery8.default)("#stream-toggle");
      if (button.val() == "not-paused") {
        change_connection_status("connecting");
        if (timeoutID != null)
          window.clearTimeout(timeoutID);
        timeoutID = window.setTimeout(connect_callback, 3e3);
      }
    }
    ;
    function connect_callback() {
      timeoutID = null;
      connect_chart();
    }
    function connect_chart() {
      if (ws == null) {
        var Socket = "MozWebSocket" in window ? window.MozWebSocket : window.WebSocket;
        ws = new Socket(params.socket_url);
        ws.onmessage = (evt) => {
          update_view(JSON.parse(evt.data));
        };
        ws.onclose = () => {
          console.log("received close on websocket");
          change_connection_status("disconnected");
          ws = null;
          reconnect();
        };
        ws.onopen = () => {
          change_connection_status("connected");
          ws.send(params.socket_greeting);
        };
        ws.onerror = () => {
          console.log("websocket error");
          change_connection_status("disconnected");
          ws = null;
          reconnect();
        };
        if (timeoutID != null)
          timeoutID = window.setTimeout(reconnect, 3e3);
      }
    }
    ;
    function disconnect_chart() {
      if (ws != null) {
        ws.close();
        ws = null;
      }
      change_connection_status("disconnected");
    }
    function toggle_stream(button) {
      button.toggleClass("active");
      if (button.val() == "paused") {
        button.val("not-paused");
        connect_chart();
      } else {
        button.val("paused");
        disconnect_chart();
      }
    }
    function toggle_warnings(button) {
      button.toggleClass("active");
      if (button.val() == "not-shown") {
        button.val("shown");
        warning_level = 2;
      } else {
        button.val("not-shown");
        warning_level = 3;
      }
    }
    function toggle_smoothness(button) {
      button.toggleClass("active");
      if (button.val() == "smooth updates") {
        button.val("discrete updates");
        update_interval = 1e3;
      } else {
        button.val("smooth updates");
        update_interval = 1;
      }
    }
    function pause_on_hide(button) {
      if (button.val() == "paused")
        return;
      if (document.hidden) {
        disconnect_chart();
      } else {
        connect_chart();
      }
    }
    (0, import_jquery8.default)(function() {
      initialize_filter();
      (0, import_jquery8.default)("#stream-toggle").on("click", function() {
        toggle_stream((0, import_jquery8.default)(this));
      });
      (0, import_jquery8.default)("#warnin-toggle").on("click", function() {
        toggle_warnings((0, import_jquery8.default)(this));
      });
      (0, import_jquery8.default)("#smooth-toggle").on("click", function() {
        toggle_smoothness((0, import_jquery8.default)(this));
      });
      (0, import_jquery8.default)(document).on("visibilitychange", function() {
        pause_on_hide((0, import_jquery8.default)("#stream-toggle"));
      });
      connect_chart();
    });
  }
  var import_jquery8;
  var init_logjam_livestream = __esm({
    "vendor/logjam/app/assets/javascripts/logjam-livestream.js"() {
      init_src32();
      import_jquery8 = __toESM(require_jquery());
      window.logjam_live_stream_chart = logjam_live_stream_chart;
    }
  });

  // vendor/logjam/app/assets/javascripts/logjam-call-graph.js
  function logjam_graph_app_data(appCallers) {
    var r1 = 800 / 2, r0 = r1 - 120, w = 1400, h = w, cw = 700, ch = 420;
    function colors(s) {
      return s.match(/.{6}/g).map((x2) => "#" + x2);
    }
    ;
    var category20c = colors("1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5");
    var fill = ordinal(category20c);
    var chord2 = chord_default().padAngle(0.02).sortSubgroups(descending).sortChords(descending);
    var arc = arc_default().innerRadius(r0).outerRadius(r0 + 20);
    var svg = select_default2("#call-graph-display").append("svg").attr("width", w).attr("height", h).append("g").attr("transform", "translate(" + cw + "," + ch + ")");
    var info = select_default2("#call-graph-info");
    var indexByName = {}, nameByIndex = {}, appNames = /* @__PURE__ */ new Set(), n = 0;
    var scale = log().domain(extent(appCallers, (d) => d.count));
    function appName(name) {
      return name;
    }
    appCallers.forEach((app) => {
      appNames.add(app.source);
      appNames.add(app.target);
    });
    Array.from(appNames.values()).sort().forEach((name) => {
      name = appName(name);
      if (!(name in indexByName)) {
        nameByIndex[n] = name;
        indexByName[name] = n++;
      }
    });
    var matrix = [], scaled_matrix = [];
    for (var i2 = 0; i2 < n; i2++) {
      matrix[i2] = [];
      scaled_matrix[i2] = [];
      for (var j2 = 0; j2 < n; j2++) {
        matrix[i2][j2] = 0;
        scaled_matrix[i2][j2] = 0;
      }
    }
    appCallers.forEach((d) => {
      var source = indexByName[appName(d.target)], row = matrix[source], scaled_row = scaled_matrix[source], index = indexByName[appName(d.source)];
      if (!row) {
        row = matrix[source] = [];
        for (var i3 = -1; ++i3 < n; )
          row[i3] = 0;
      }
      row[index] = d.count;
      if (!scaled_row) {
        scaled_row = scaled_matrix[source] = [];
        for (var j3 = -1; ++j3 < n; )
          scaled_row[j3] = 0;
      }
      scaled_row[index] = scale(d.count);
    });
    function call_info_text(d) {
      var ti = d.target.index, si = d.source.index, caller = nameByIndex[ti], callee = nameByIndex[si], n2 = matrix[si][ti], m = matrix[ti][si];
      var text = caller + " called " + callee + " " + formatter(n2) + " times.";
      if (m > 0) {
        text += "</br>" + callee + " called " + caller + " " + formatter(m) + " times.";
      }
      return text;
    }
    var g = svg.append("g").datum(chord2(scaled_matrix));
    var group = g.append("g").attr("class", "groups").selectAll("g").data((chords) => chords.groups).enter().append("g");
    group.append("path").style("fill", (d) => fill(d.index)).style("stroke", (d) => fill(d.index)).attr("d", arc).on("mouseover", (e, d) => {
      svg.selectAll("path.chord").classed("active", (x2) => x2.source.index == d.index || x2.target.index == d.index);
    }).on("mouseout", (e, d) => {
    });
    group.append("text").each((d, i3) => {
      d.angle = (d.startAngle + d.endAngle) / 2;
    }).attr("dy", ".35em").attr("fill", (d) => d.value == 0 ? "green" : "black").attr("text-anchor", (d) => d.angle > Math.PI ? "end" : null).attr(
      "transform",
      (d) => "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (r0 + 45) + ")" + (d.angle > Math.PI ? "rotate(180)" : "")
    ).text((d) => nameByIndex[d.index]).on("mouseover", (e, d) => {
      svg.selectAll("path.chord").classed("active", (x2) => x2.source.index == d.index || x2.target.index == d.index);
    }).on("mouseout", (e, d) => {
    });
    var formatter = format(",.0f");
    g.append("g").attr("class", "ribbons").selectAll("path").data((chords) => chords).enter().append("path").attr("class", "chord").attr("d", ribbon_default().radius(r0)).style("fill", (d) => fill(d.source.index)).style("stroke", (d) => rgb(fill(d.source.index)).darker()).on("mouseover", (e, d) => {
      svg.selectAll(".active").classed("active", false);
      info.html(call_info_text(d));
    }).on("mouseout", (e, d) => {
      svg.selectAll(".active").classed("active", false);
      info.text("");
    });
    function fade(opacity) {
      return (g2, i3) => {
        svg.selectAll("path.chord").filter((d) => d.source.index != i3 && d.target.index != i3).transition().style("opacity", opacity);
      };
    }
  }
  function logjam_load_graph_data(group, json_urls) {
    selectAll_default2("svg").remove();
    $("#spinner").show();
    json_default(json_urls[group]).then((appCallers) => {
      logjam_graph_app_data(appCallers);
      $("#spinner").hide();
    });
  }
  var init_logjam_call_graph = __esm({
    "vendor/logjam/app/assets/javascripts/logjam-call-graph.js"() {
      init_src32();
      window.logjam_load_graph_data = logjam_load_graph_data;
    }
  });

  // vendor/logjam/app/assets/javascripts/logjam-ready.js
  var import_jquery9;
  var init_logjam_ready = __esm({
    "vendor/logjam/app/assets/javascripts/logjam-ready.js"() {
      import_jquery9 = __toESM(require_jquery());
      (0, import_jquery9.default)(document).ready(function() {
        var mobile = navigator.userAgent.match(/iPad|iPhone/i) != null;
        if (!mobile) {
          (0, import_jquery9.default)("*[title]").tipsy({ gravity: "nw", offset: 10, delayIn: 250, delayOut: 0, fade: false });
        }
        (0, import_jquery9.default)(window).on("beforeunload", function(e) {
          (0, import_jquery9.default)(".tipsy").remove();
        });
        (0, import_jquery9.default)(".clickable[data-href]").on("click", function(event) {
          var href = (0, import_jquery9.default)(this).data("href");
          if (event.which == 2 || event.metaKey) {
            window.open(href);
          } else {
            document.location.href = href;
          }
          return true;
        });
      });
    }
  });

  // vendor/logjam/app/assets/javascripts/logjam-mobile.js
  var import_jquery10;
  var init_logjam_mobile = __esm({
    "vendor/logjam/app/assets/javascripts/logjam-mobile.js"() {
      import_jquery10 = __toESM(require_jquery());
      (0, import_jquery10.default)(function() {
        (0, import_jquery10.default)("#mobile-trigger").on("click", function(event) {
          event.preventDefault();
          (0, import_jquery10.default)("body").toggleClass("sidebar-visible");
        });
      });
    }
  });

  // vendor/logjam/app/assets/javascripts/logjam-keyboard-controls.js
  var import_jquery11;
  var init_logjam_keyboard_controls = __esm({
    "vendor/logjam/app/assets/javascripts/logjam-keyboard-controls.js"() {
      import_jquery11 = __toESM(require_jquery());
      init_logjam_header();
      (0, import_jquery11.default)(document).on("keydown", function(event) {
        if (event.ctrlKey && !event.shiftKey && event.keyCode === 70) {
          event.preventDefault();
          (0, import_jquery11.default)(".date_clearer").trigger("click");
          (0, import_jquery11.default)("#application-suggest").select2("close");
          (0, import_jquery11.default)("#namespace-suggest").select2("open");
        }
        if (event.ctrlKey && event.shiftKey && event.keyCode === 65 && (0, import_jquery11.default)(".application-chooser").length > -1) {
          event.preventDefault();
          (0, import_jquery11.default)(".date_clearer").trigger("click");
          (0, import_jquery11.default)("#namespace-suggest").select2("close");
          (0, import_jquery11.default)("#application-suggest").select2("open");
        }
        if (event.ctrlKey && event.shiftKey && event.keyCode === 68) {
          event.preventDefault();
          (0, import_jquery11.default)("#namespace-suggest").select2("close");
          (0, import_jquery11.default)("#application-suggest").select2("close");
          (0, import_jquery11.default)("#datepicker").trigger("focus");
        }
        if (event.ctrlKey && event.shiftKey && event.keyCode === 82) {
          event.preventDefault();
          (0, import_jquery11.default)("#auto-refresh").trigger("click");
        }
        if (event.ctrlKey && event.shiftKey && event.keyCode === 66) {
          event.preventDefault();
          (0, import_jquery11.default)("#section").val("backend");
          submit_filter_form();
        }
        if (event.ctrlKey && event.shiftKey && event.keyCode === 70) {
          event.preventDefault();
          (0, import_jquery11.default)("#section").val("frontend");
          submit_filter_form();
        }
      });
    }
  });

  // vendor/logjam/app/assets/javascripts/logjam_application.js
  var logjam_application_exports = {};
  var import_jquery_migrate, import_jquery_jdpicker_1_1, import_jquery_autocomplete;
  var init_logjam_application = __esm({
    "vendor/logjam/app/assets/javascripts/logjam_application.js"() {
      init_logjam_monitoring();
      init_jquery();
      import_jquery_migrate = __toESM(require_jquery_migrate());
      import_jquery_jdpicker_1_1 = __toESM(require_jquery_jdpicker_1_1());
      import_jquery_autocomplete = __toESM(require_jquery_autocomplete());
      init_jquery_tipsy();
      init_select2();
      init_logjam_filter();
      init_logjam_header();
      init_logjam_echart();
      init_logjam_apdex_chart();
      init_logjam_simple_pie();
      init_logjam_resource_plot();
      init_logjam_quants_plot();
      init_logjam_heatmap_plot();
      init_logjam_history_bar_chart();
      init_logjam_livestream();
      init_logjam_call_graph();
      init_logjam_ready();
      init_logjam_mobile();
      init_logjam_keyboard_controls();
      init_src2();
      window.d3max = max;
    }
  });

  // app/javascript/application.js
  init_logjam_application();
})();
/*!
 * URI.js - Mutating URLs
 *
 * Version: 1.19.11
 *
 * Author: Rodney Rehm
 * Web: http://medialize.github.io/URI.js/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *
 */
/*!
 * URI.js - Mutating URLs
 * IPv6 Support
 *
 * Version: 1.19.11
 *
 * Author: Rodney Rehm
 * Web: http://medialize.github.io/URI.js/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *
 */
/*!
 * URI.js - Mutating URLs
 * Second Level Domain (SLD) Support
 *
 * Version: 1.19.11
 *
 * Author: Rodney Rehm
 * Web: http://medialize.github.io/URI.js/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *
 */
/*!
 * jQuery JavaScript Library v3.6.0
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2021-03-02T17:08Z
 */
/*!
 * jQuery Migrate - v3.3.2 - 2020-11-17T23:22Z
 * Copyright OpenJS Foundation and other contributors
 */
/*! https://mths.be/punycode v1.4.0 by @mathias */
//# sourceMappingURL=/assets/application.js-f229c76c2df7f39266813fe2d365b6168f77273403e12bcf09f6b67a21008cc0.map
//!
;
