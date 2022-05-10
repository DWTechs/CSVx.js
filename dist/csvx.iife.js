/** MIT License
 *
 * Copyright (c) 2018 Ludovic CLUBER
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice (including the next
 * paragraph) shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * https://github.com/DWTechs/CSVx.js
 */
var CSVx = (function (exports) {
  'use strict';

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _createForOfIteratorHelperLoose(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (it) return (it = it.call(o)).next.bind(it);

    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var runtime = {exports: {}};

  (function (module) {
    var runtime = function (exports) {

      var Op = Object.prototype;
      var hasOwn = Op.hasOwnProperty;
      var undefined$1; // More compressible than void 0.

      var $Symbol = typeof Symbol === "function" ? Symbol : {};
      var iteratorSymbol = $Symbol.iterator || "@@iterator";
      var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
      var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

      function define(obj, key, value) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
        return obj[key];
      }

      try {
        // IE 8 has a broken Object.defineProperty that only works on DOM objects.
        define({}, "");
      } catch (err) {
        define = function define(obj, key, value) {
          return obj[key] = value;
        };
      }

      function wrap(innerFn, outerFn, self, tryLocsList) {
        // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
        var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
        var generator = Object.create(protoGenerator.prototype);
        var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
        // .throw, and .return methods.

        generator._invoke = makeInvokeMethod(innerFn, self, context);
        return generator;
      }

      exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
      // record like context.tryEntries[i].completion. This interface could
      // have been (and was previously) designed to take a closure to be
      // invoked without arguments, but in all the cases we care about we
      // already have an existing method we want to call, so there's no need
      // to create a new function object. We can even get away with assuming
      // the method takes exactly one argument, since that happens to be true
      // in every case, so we don't have to touch the arguments object. The
      // only additional allocation required is the completion record, which
      // has a stable shape and so hopefully should be cheap to allocate.

      function tryCatch(fn, obj, arg) {
        try {
          return {
            type: "normal",
            arg: fn.call(obj, arg)
          };
        } catch (err) {
          return {
            type: "throw",
            arg: err
          };
        }
      }

      var GenStateSuspendedStart = "suspendedStart";
      var GenStateSuspendedYield = "suspendedYield";
      var GenStateExecuting = "executing";
      var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
      // breaking out of the dispatch switch statement.

      var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
      // .constructor.prototype properties for functions that return Generator
      // objects. For full spec compliance, you may wish to configure your
      // minifier not to mangle the names of these two functions.

      function Generator() {}

      function GeneratorFunction() {}

      function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
      // don't natively support it.


      var IteratorPrototype = {};
      define(IteratorPrototype, iteratorSymbol, function () {
        return this;
      });
      var getProto = Object.getPrototypeOf;
      var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

      if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
        // This environment has a native %IteratorPrototype%; use it instead
        // of the polyfill.
        IteratorPrototype = NativeIteratorPrototype;
      }

      var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
      GeneratorFunction.prototype = GeneratorFunctionPrototype;
      define(Gp, "constructor", GeneratorFunctionPrototype);
      define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
      GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"); // Helper for defining the .next, .throw, and .return methods of the
      // Iterator interface in terms of a single ._invoke method.

      function defineIteratorMethods(prototype) {
        ["next", "throw", "return"].forEach(function (method) {
          define(prototype, method, function (arg) {
            return this._invoke(method, arg);
          });
        });
      }

      exports.isGeneratorFunction = function (genFun) {
        var ctor = typeof genFun === "function" && genFun.constructor;
        return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
      };

      exports.mark = function (genFun) {
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
        } else {
          genFun.__proto__ = GeneratorFunctionPrototype;
          define(genFun, toStringTagSymbol, "GeneratorFunction");
        }

        genFun.prototype = Object.create(Gp);
        return genFun;
      }; // Within the body of any async function, `await x` is transformed to
      // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
      // `hasOwn.call(value, "__await")` to determine if the yielded value is
      // meant to be awaited.


      exports.awrap = function (arg) {
        return {
          __await: arg
        };
      };

      function AsyncIterator(generator, PromiseImpl) {
        function invoke(method, arg, resolve, reject) {
          var record = tryCatch(generator[method], generator, arg);

          if (record.type === "throw") {
            reject(record.arg);
          } else {
            var result = record.arg;
            var value = result.value;

            if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
              return PromiseImpl.resolve(value.__await).then(function (value) {
                invoke("next", value, resolve, reject);
              }, function (err) {
                invoke("throw", err, resolve, reject);
              });
            }

            return PromiseImpl.resolve(value).then(function (unwrapped) {
              // When a yielded Promise is resolved, its final value becomes
              // the .value of the Promise<{value,done}> result for the
              // current iteration.
              result.value = unwrapped;
              resolve(result);
            }, function (error) {
              // If a rejected Promise was yielded, throw the rejection back
              // into the async generator function so it can be handled there.
              return invoke("throw", error, resolve, reject);
            });
          }
        }

        var previousPromise;

        function enqueue(method, arg) {
          function callInvokeWithMethodAndArg() {
            return new PromiseImpl(function (resolve, reject) {
              invoke(method, arg, resolve, reject);
            });
          }

          return previousPromise = // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
        } // Define the unified helper method that is used to implement .next,
        // .throw, and .return (see defineIteratorMethods).


        this._invoke = enqueue;
      }

      defineIteratorMethods(AsyncIterator.prototype);
      define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
        return this;
      });
      exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
      // AsyncIterator objects; they just return a Promise for the value of
      // the final result produced by the iterator.

      exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
        if (PromiseImpl === void 0) PromiseImpl = Promise;
        var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
        return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function (result) {
          return result.done ? result.value : iter.next();
        });
      };

      function makeInvokeMethod(innerFn, self, context) {
        var state = GenStateSuspendedStart;
        return function invoke(method, arg) {
          if (state === GenStateExecuting) {
            throw new Error("Generator is already running");
          }

          if (state === GenStateCompleted) {
            if (method === "throw") {
              throw arg;
            } // Be forgiving, per 25.3.3.3.3 of the spec:
            // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


            return doneResult();
          }

          context.method = method;
          context.arg = arg;

          while (true) {
            var delegate = context.delegate;

            if (delegate) {
              var delegateResult = maybeInvokeDelegate(delegate, context);

              if (delegateResult) {
                if (delegateResult === ContinueSentinel) continue;
                return delegateResult;
              }
            }

            if (context.method === "next") {
              // Setting context._sent for legacy support of Babel's
              // function.sent implementation.
              context.sent = context._sent = context.arg;
            } else if (context.method === "throw") {
              if (state === GenStateSuspendedStart) {
                state = GenStateCompleted;
                throw context.arg;
              }

              context.dispatchException(context.arg);
            } else if (context.method === "return") {
              context.abrupt("return", context.arg);
            }

            state = GenStateExecuting;
            var record = tryCatch(innerFn, self, context);

            if (record.type === "normal") {
              // If an exception is thrown from innerFn, we leave state ===
              // GenStateExecuting and loop back for another invocation.
              state = context.done ? GenStateCompleted : GenStateSuspendedYield;

              if (record.arg === ContinueSentinel) {
                continue;
              }

              return {
                value: record.arg,
                done: context.done
              };
            } else if (record.type === "throw") {
              state = GenStateCompleted; // Dispatch the exception by looping back around to the
              // context.dispatchException(context.arg) call above.

              context.method = "throw";
              context.arg = record.arg;
            }
          }
        };
      } // Call delegate.iterator[context.method](context.arg) and handle the
      // result, either by returning a { value, done } result from the
      // delegate iterator, or by modifying context.method and context.arg,
      // setting context.delegate to null, and returning the ContinueSentinel.


      function maybeInvokeDelegate(delegate, context) {
        var method = delegate.iterator[context.method];

        if (method === undefined$1) {
          // A .throw or .return when the delegate iterator has no .throw
          // method always terminates the yield* loop.
          context.delegate = null;

          if (context.method === "throw") {
            // Note: ["return"] must be used for ES3 parsing compatibility.
            if (delegate.iterator["return"]) {
              // If the delegate iterator has a return method, give it a
              // chance to clean up.
              context.method = "return";
              context.arg = undefined$1;
              maybeInvokeDelegate(delegate, context);

              if (context.method === "throw") {
                // If maybeInvokeDelegate(context) changed context.method from
                // "return" to "throw", let that override the TypeError below.
                return ContinueSentinel;
              }
            }

            context.method = "throw";
            context.arg = new TypeError("The iterator does not provide a 'throw' method");
          }

          return ContinueSentinel;
        }

        var record = tryCatch(method, delegate.iterator, context.arg);

        if (record.type === "throw") {
          context.method = "throw";
          context.arg = record.arg;
          context.delegate = null;
          return ContinueSentinel;
        }

        var info = record.arg;

        if (!info) {
          context.method = "throw";
          context.arg = new TypeError("iterator result is not an object");
          context.delegate = null;
          return ContinueSentinel;
        }

        if (info.done) {
          // Assign the result of the finished delegate to the temporary
          // variable specified by delegate.resultName (see delegateYield).
          context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

          context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
          // exception, let the outer generator proceed normally. If
          // context.method was "next", forget context.arg since it has been
          // "consumed" by the delegate iterator. If context.method was
          // "return", allow the original .return call to continue in the
          // outer generator.

          if (context.method !== "return") {
            context.method = "next";
            context.arg = undefined$1;
          }
        } else {
          // Re-yield the result returned by the delegate method.
          return info;
        } // The delegate iterator is finished, so forget it and continue with
        // the outer generator.


        context.delegate = null;
        return ContinueSentinel;
      } // Define Generator.prototype.{next,throw,return} in terms of the
      // unified ._invoke helper method.


      defineIteratorMethods(Gp);
      define(Gp, toStringTagSymbol, "Generator"); // A Generator should always return itself as the iterator object when the
      // @@iterator function is called on it. Some browsers' implementations of the
      // iterator prototype chain incorrectly implement this, causing the Generator
      // object to not be returned from this call. This ensures that doesn't happen.
      // See https://github.com/facebook/regenerator/issues/274 for more details.

      define(Gp, iteratorSymbol, function () {
        return this;
      });
      define(Gp, "toString", function () {
        return "[object Generator]";
      });

      function pushTryEntry(locs) {
        var entry = {
          tryLoc: locs[0]
        };

        if (1 in locs) {
          entry.catchLoc = locs[1];
        }

        if (2 in locs) {
          entry.finallyLoc = locs[2];
          entry.afterLoc = locs[3];
        }

        this.tryEntries.push(entry);
      }

      function resetTryEntry(entry) {
        var record = entry.completion || {};
        record.type = "normal";
        delete record.arg;
        entry.completion = record;
      }

      function Context(tryLocsList) {
        // The root entry object (effectively a try statement without a catch
        // or a finally block) gives us a place to store values thrown from
        // locations where there is no enclosing try statement.
        this.tryEntries = [{
          tryLoc: "root"
        }];
        tryLocsList.forEach(pushTryEntry, this);
        this.reset(true);
      }

      exports.keys = function (object) {
        var keys = [];

        for (var key in object) {
          keys.push(key);
        }

        keys.reverse(); // Rather than returning an object with a next method, we keep
        // things simple and return the next function itself.

        return function next() {
          while (keys.length) {
            var key = keys.pop();

            if (key in object) {
              next.value = key;
              next.done = false;
              return next;
            }
          } // To avoid creating an additional object, we just hang the .value
          // and .done properties off the next function object itself. This
          // also ensures that the minifier will not anonymize the function.


          next.done = true;
          return next;
        };
      };

      function values(iterable) {
        if (iterable) {
          var iteratorMethod = iterable[iteratorSymbol];

          if (iteratorMethod) {
            return iteratorMethod.call(iterable);
          }

          if (typeof iterable.next === "function") {
            return iterable;
          }

          if (!isNaN(iterable.length)) {
            var i = -1,
                next = function next() {
              while (++i < iterable.length) {
                if (hasOwn.call(iterable, i)) {
                  next.value = iterable[i];
                  next.done = false;
                  return next;
                }
              }

              next.value = undefined$1;
              next.done = true;
              return next;
            };

            return next.next = next;
          }
        } // Return an iterator with no values.


        return {
          next: doneResult
        };
      }

      exports.values = values;

      function doneResult() {
        return {
          value: undefined$1,
          done: true
        };
      }

      Context.prototype = {
        constructor: Context,
        reset: function reset(skipTempReset) {
          this.prev = 0;
          this.next = 0; // Resetting context._sent for legacy support of Babel's
          // function.sent implementation.

          this.sent = this._sent = undefined$1;
          this.done = false;
          this.delegate = null;
          this.method = "next";
          this.arg = undefined$1;
          this.tryEntries.forEach(resetTryEntry);

          if (!skipTempReset) {
            for (var name in this) {
              // Not sure about the optimal order of these conditions:
              if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
                this[name] = undefined$1;
              }
            }
          }
        },
        stop: function stop() {
          this.done = true;
          var rootEntry = this.tryEntries[0];
          var rootRecord = rootEntry.completion;

          if (rootRecord.type === "throw") {
            throw rootRecord.arg;
          }

          return this.rval;
        },
        dispatchException: function dispatchException(exception) {
          if (this.done) {
            throw exception;
          }

          var context = this;

          function handle(loc, caught) {
            record.type = "throw";
            record.arg = exception;
            context.next = loc;

            if (caught) {
              // If the dispatched exception was caught by a catch block,
              // then let that catch block handle the exception normally.
              context.method = "next";
              context.arg = undefined$1;
            }

            return !!caught;
          }

          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            var record = entry.completion;

            if (entry.tryLoc === "root") {
              // Exception thrown outside of any try block that could handle
              // it, so set the completion value of the entire function to
              // throw the exception.
              return handle("end");
            }

            if (entry.tryLoc <= this.prev) {
              var hasCatch = hasOwn.call(entry, "catchLoc");
              var hasFinally = hasOwn.call(entry, "finallyLoc");

              if (hasCatch && hasFinally) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                } else if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }
              } else if (hasCatch) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                }
              } else if (hasFinally) {
                if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }
              } else {
                throw new Error("try statement without catch or finally");
              }
            }
          }
        },
        abrupt: function abrupt(type, arg) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];

            if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
              var finallyEntry = entry;
              break;
            }
          }

          if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
            // Ignore the finally entry if control is not jumping to a
            // location outside the try/catch block.
            finallyEntry = null;
          }

          var record = finallyEntry ? finallyEntry.completion : {};
          record.type = type;
          record.arg = arg;

          if (finallyEntry) {
            this.method = "next";
            this.next = finallyEntry.finallyLoc;
            return ContinueSentinel;
          }

          return this.complete(record);
        },
        complete: function complete(record, afterLoc) {
          if (record.type === "throw") {
            throw record.arg;
          }

          if (record.type === "break" || record.type === "continue") {
            this.next = record.arg;
          } else if (record.type === "return") {
            this.rval = this.arg = record.arg;
            this.method = "return";
            this.next = "end";
          } else if (record.type === "normal" && afterLoc) {
            this.next = afterLoc;
          }

          return ContinueSentinel;
        },
        finish: function finish(finallyLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];

            if (entry.finallyLoc === finallyLoc) {
              this.complete(entry.completion, entry.afterLoc);
              resetTryEntry(entry);
              return ContinueSentinel;
            }
          }
        },
        "catch": function _catch(tryLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];

            if (entry.tryLoc === tryLoc) {
              var record = entry.completion;

              if (record.type === "throw") {
                var thrown = record.arg;
                resetTryEntry(entry);
              }

              return thrown;
            }
          } // The context.catch method must only be called with a location
          // argument that corresponds to a known catch block.


          throw new Error("illegal catch attempt");
        },
        delegateYield: function delegateYield(iterable, resultName, nextLoc) {
          this.delegate = {
            iterator: values(iterable),
            resultName: resultName,
            nextLoc: nextLoc
          };

          if (this.method === "next") {
            // Deliberately forget the last sent value so that we don't
            // accidentally pass it on to the delegate.
            this.arg = undefined$1;
          }

          return ContinueSentinel;
        }
      }; // Regardless of whether this script is executing as a CommonJS module
      // or not, return the runtime object so that we can declare the variable
      // regeneratorRuntime in the outer scope, which allows this module to be
      // injected easily by `bin/regenerator --include-runtime script.js`.

      return exports;
    }( // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
    module.exports );

    try {
      regeneratorRuntime = runtime;
    } catch (accidentalStrictMode) {
      // This module should not be running in strict mode, so the above
      // assignment should always work unless something is misconfigured. Just
      // in case runtime.js accidentally runs in strict mode, in modern engines
      // we can explicitly access globalThis. In older engines we can escape
      // strict mode using a global Function call. This could conceivably fail
      // if a Content Security Policy forbids using Function, but in that case
      // the proper solution is to fix the accidental strict mode problem. If
      // you've misconfigured your bundler to force strict mode and applied a
      // CSP to forbid Function, and you're not willing to fix either of those
      // problems, please detail your unique predicament in a GitHub issue.
      if (typeof globalThis === "object") {
        globalThis.regeneratorRuntime = runtime;
      } else {
        Function("r", "regeneratorRuntime = r")(runtime);
      }
    }
  })(runtime);

  function isArray(array) {
    return !isNil(array) && array.constructor === Array;
  }

  function isObject(object) {
    return object !== null && typeof object === "object" && !isArray(object);
  }

  function isNil(nil) {
    return nil == null;
  }

  var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function (resolve) {
        resolve(value);
      });
    }

    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }

      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }

      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }

      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var Export = /*#__PURE__*/function () {
    function Export() {}

    Export.data = function data(filename, _data, options) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _iterator, _step, row, table, labels;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _iterator = _createForOfIteratorHelperLoose(_data);

              case 1:
                if ((_step = _iterator()).done) {
                  _context.next = 7;
                  break;
                }

                row = _step.value;

                if (isObject(row)) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt("return", false);

              case 5:
                _context.next = 1;
                break;

              case 7:
                if (!filename) {
                  filename = 'export';
                }

                if (options) {
                  this.setOptions(options);
                }

                table = '';
                labels = [];

                if (!this.options.customLabels) {
                  labels = this.createLabels(_data);
                } else {
                  labels = this.createCustomLabels(this.options.customLabels);
                }

                if (this.options.labels) {
                  table += this.createLabelsRow(labels);
                }

                table += this.createTable(_data);

                if (!this.options.save) {
                  _context.next = 19;
                  break;
                }

                _context.next = 17;
                return this.save(table, filename);

              case 17:
                _context.next = 20;
                break;

              case 19:
                this.download(table, filename);

              case 20:
                return _context.abrupt("return", true);

              case 21:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
    };

    Export.setOptions = function setOptions(options) {
      for (var property in options) {
        if (options.hasOwnProperty(property) && this.options.hasOwnProperty(property)) {
          this.options[property] = options[property] || this.options[property];
        }
      }
    };

    Export.download = function download(table, filename) {
      var encodedTable = "data:" + this.options.data + ";charset=" + this.options.charset + "," + escape(table);

      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(encodedTable, filename);
      } else {
        var link = document.createElement('a');
        link.setAttribute('href', encodedTable);
        link.setAttribute('download', filename + '.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };

    Export.save = function save(table, filename) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var encodedTable, fileHandle, fileStream;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                encodedTable = table;
                _context2.next = 3;
                return window.showSaveFilePicker({
                  suggestedName: filename + '.csv'
                });

              case 3:
                fileHandle = _context2.sent;
                _context2.next = 6;
                return fileHandle.createWritable();

              case 6:
                fileStream = _context2.sent;
                _context2.next = 9;
                return fileStream.write(new Blob([encodedTable], {
                  type: this.options.data + ";charset=" + this.options.charset,
                  endings: 'native'
                }));

              case 9:
                _context2.next = 11;
                return fileStream.close();

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));
    };

    Export.createTable = function createTable(data) {
      var _a;

      var table = '';

      for (var _iterator2 = _createForOfIteratorHelperLoose(data), _step2; !(_step2 = _iterator2()).done;) {
        var row = _step2.value;
        var parsedRow = '';

        for (var property in this.options.customLabels) {
          if (this.options.customLabels.hasOwnProperty(property)) {
            parsedRow += this.createField((_a = row[property]) !== null && _a !== void 0 ? _a : '');
          }
        }

        table += this.createRow(parsedRow);
      }

      return table;
    };

    Export.createLabels = function createLabels(data) {
      var params = [];

      for (var _iterator3 = _createForOfIteratorHelperLoose(data), _step3; !(_step3 = _iterator3()).done;) {
        var row = _step3.value;
        var i = 0;

        var _loop = function _loop(property) {
          if (row.hasOwnProperty(property)) {
            var newProperty = params.find(function (value) {
              return value === property;
            });

            if (!newProperty) {
              params.splice(i, 0, property);
            }

            i++;
          }
        };

        for (var property in row) {
          _loop(property);
        }
      }

      this.options.customLabels = {};

      for (var _i = 0, _params = params; _i < _params.length; _i++) {
        var param = _params[_i];
        this.options.customLabels[param] = param;
      }

      return params;
    };

    Export.createCustomLabels = function createCustomLabels(customLabels) {
      var params = [];

      for (var property in customLabels) {
        if (customLabels.hasOwnProperty(property)) {
          params.push(customLabels[property]);
        }
      }

      return params;
    };

    Export.createLabelsRow = function createLabelsRow(labels) {
      var parsedRow = '';

      for (var _iterator4 = _createForOfIteratorHelperLoose(labels), _step4; !(_step4 = _iterator4()).done;) {
        var label = _step4.value;
        parsedRow += this.createField(label);
      }

      return this.createRow(parsedRow);
    };

    Export.createRow = function createRow(row) {
      return row.slice(0, -1) + this.options.CRLF;
    };

    Export.createField = function createField(content) {
      return this.options.quote + content + this.options.quote + this.options.separator;
    };

    return Export;
  }();
  Export.options = {
    data: 'text/csv',
    charset: 'utf-8',
    labels: true,
    quote: '"',
    separator: ',',
    CRLF: '\r\n',
    customLabels: null,
    save: false
  };

  var Convert = /*#__PURE__*/function () {
    function Convert() {}

    Convert.setOptions = function setOptions(options) {
      this.setObject('options', options);
    };

    Convert.setCSS = function setCSS(css) {
      this.setObject('css', css);
    };

    Convert.array = function array(data, options, css) {
      if (options) {
        this.setOptions(options);
      }

      if (css) {
        this.setCSS(css);
      }

      var rows = data.trim().split(this.options.CRLF).filter(Boolean);

      if (!rows.length) {
        return false;
      }

      var array = [];

      for (var _iterator = _createForOfIteratorHelperLoose(rows), _step; !(_step = _iterator()).done;) {
        var row = _step.value;
        var cells = row.split(this.options.separator);

        if (this.options.quote) {
          for (var i = 0; i < cells.length; i++) {
            cells[i] = cells[i].slice(1, -1);
          }
        }

        array.push(cells);
      }

      return array;
    };

    Convert.table = function table(data, options, css) {
      var array = this.array(data, options, css);

      if (array) {
        var thead = '';
        var table = [];

        for (var i = 0; i < array.length; i++) {
          var cellType = 'td';
          var style = '';

          if (!i && this.options.labels) {
            cellType = 'th';

            if (this.css.th) {
              style = ' class = "' + this.css.th + '"';
            }

            thead = '<thead>' + this.createTr(array[i], cellType, style) + '</thead>';
          } else {
            table.push(this.createTr(array[i], cellType, ''));
          }
        }

        if (thead || table.length) {
          var _style = this.css.table ? 'class="' + this.css.table + '"' : '';

          return '<table ' + _style + '>' + thead + '<tbody>' + table.join('') + '</tbody></table>';
        }
      }

      return false;
    };

    Convert.createTr = function createTr(row, cellType, style) {
      return '<tr><' + cellType + style + '>' + row.join('</' + cellType + '><' + cellType + style + '>') + '</' + cellType + '></tr>';
    };

    Convert.setObject = function setObject(parameterName, newObject) {
      for (var property in newObject) {
        if (newObject.hasOwnProperty(property) && this[parameterName].hasOwnProperty(property)) {
          this[parameterName][property] = newObject[property];
        }
      }
    };

    return Convert;
  }();
  Convert.options = {
    labels: true,
    quote: '"',
    separator: ',',
    CRLF: '\r\n'
  };
  Convert.css = {
    table: '',
    th: ''
  };

  exports.Convert = Convert;
  exports.Export = Export;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
