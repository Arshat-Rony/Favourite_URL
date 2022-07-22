// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"scripts/createstore.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// creating a store for redux
var createStore = function createStore(reducer, init) {
  var store = {};
  store.state = init;
  store.listeners = [];

  store.getState = function () {
    return store.state;
  };

  store.subscribe = function (listener) {
    return store.listeners.push(listener);
  };

  store.dispatch = function (action) {
    store.state = reducer(store.state, action);
    store.listeners.forEach(function (listener) {
      return listener();
    });
  };

  return store;
};

var _default = createStore;
exports.default = _default;
},{}],"scripts/reducer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var init = [];
var bookmarks;
var favourites;

var reducer = function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : init;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case "ADD_BOOKMARK":
      {
        console.log(action.payload);
        return state.concat(action.payload);
      }

    case "REMOVE_BOOKMARK":
      {
        return bookmarks = state.filter(function (bookmark) {
          return bookmark.id !== action.payload;
        });
      }

    case "TOGGLE_FAVOURITE":
      {
        return favourites = state.map(function (bookmark) {
          if (bookmark.id === action.payload) {
            bookmark.isFav = !bookmark.isFav;
          }

          return bookmark;
        });
      }
  }
};

var _default = reducer;
exports.default = _default;
},{}],"scripts/createList.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _app = require("./app");

var createListItem = function createListItem(bookmark) {
  var li = document.createElement('li');
  li.className = 'list-group-item d-flex justify-content-between align-items-center';
  var div = document.createElement('div');
  div.className = "d-flex justify-content-center align-items-center gap-4";
  var img = document.createElement('img');
  img.src = "//logo.clearbit.com/".concat(bookmark.name);
  img.className = 'avatar';
  var text = document.createElement('p');
  text.innerHTML = bookmark.name;
  text.className = 'domain_text  ml-4 mt-3 text-primary fw-semibold';

  text.onclick = function () {
    window.open("".concat(bookmark.url), '_blank');
  };

  div.append(img, text);
  var icons = document.createElement('div');
  icons.className = 'ml-auto';
  var fav = document.createElement('span');
  fav.className = "icon ".concat(bookmark.isFav && "text-danger fs-5");
  var i = document.createElement('i');
  i.className = "".concat(bookmark.isFav ? "fas" : "far", " fa-heart");
  fav.appendChild(i);

  fav.onclick = function () {
    _app.store.dispatch({
      type: "TOGGLE_FAVOURITE",
      payload: bookmark.id
    });

    localStorage.setItem("bookmarks", JSON.stringify(_app.store.getState()));
  };

  var remove = document.createElement('span');
  remove.innerHTML = "<i class=\"fas fa-trash\"><i>";
  remove.className = 'icon mx-3 ';

  remove.onclick = function () {
    _app.store.dispatch({
      type: "REMOVE_BOOKMARK",
      payload: bookmark.id
    });

    localStorage.setItem("bookmarks", JSON.stringify(_app.store.getState()));
  };

  icons.append(fav, remove);
  li.append(div, icons);
  return li;
};

var _default = createListItem;
exports.default = _default;
},{"./app":"scripts/app.js"}],"scripts/app.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.store = void 0;

var _createstore = _interopRequireDefault(require("./createstore"));

var _reducer = _interopRequireDefault(require("./reducer"));

var _createList = _interopRequireDefault(require("./createList"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var init = []; // checking data of localStorage 

if (localStorage.getItem('bookmarks')) {
  init = JSON.parse(localStorage.getItem("bookmarks"));
}

var store = (0, _createstore.default)(_reducer.default, init);
exports.store = store;
console.log(store);

window.onload = function () {
  var urlInput = document.getElementById('urlInput');
  var favouriteBookmarks = document.getElementById("favouriteBookmarks");
  var allBookmarks = document.getElementById('allBookmarks');
  var toalFavList = document.getElementById("totalFavList");
  var totalBookmark = document.getElementById("totalBookMark");

  if (store.getState().length > 0) {
    // rendering previous data form localstorage 
    store.getState().forEach(function (bookmark) {
      if (bookmark.isFav == false) {
        var li = (0, _createList.default)(bookmark);
        allBookmarks.appendChild(li);
      }
    }); // rendering previous favouriteBookmarks from localstorage 

    store.getState().forEach(function (bookmark) {
      if (bookmark.isFav) {
        var li = (0, _createList.default)(bookmark);
        favouriteBookmarks.appendChild(li);
      }
    });
  } // adding eventListener to the input key up 


  urlInput.onkeyup = function (e) {
    if (e.key === 'Enter') {
      var url = e.target.value;
      var name = nameFromUrl(url);
      var isFav = false;
      var id = genRanHex(16);

      if (store.getState().length > 0) {
        var exist = store.getState().filter(function (bookmark) {
          return bookmark.name == name;
        });

        if (exist == []) {
          console.log(exist);
          e.target.value = '';
          return;
        }
      }

      store.dispatch({
        type: 'ADD_BOOKMARK',
        payload: {
          url: url,
          name: name,
          isFav: isFav,
          id: id
        }
      });
      localStorage.setItem("bookmarks", JSON.stringify(store.getState()));
      e.target.value = '';
    }
  }; // new subscribe for all link to add bookmarks


  store.subscribe(function () {
    allBookmarks.innerHTML = '';
    store.getState().forEach(function (bookmark) {
      if (bookmark.isFav == false) {
        var li = (0, _createList.default)(bookmark);
        allBookmarks.appendChild(li);
      }
    });
  }); //new subscribe for favourite bookmarks 

  store.subscribe(function () {
    favouriteBookmarks.innerHTML = '';
    store.getState().forEach(function (bookmark) {
      if (bookmark.isFav) {
        var li = (0, _createList.default)(bookmark);
        favouriteBookmarks.appendChild(li);
      }
    });
  });
  var favArray = store.getState().filter(function (b) {
    return b.isFav !== false;
  });
  var totalArray = store.getState().filter(function (b) {
    return b.isFav == false;
  });
  toalFavList.textContent = favArray.length;
  totalBookmark.textContent = totalArray.length;
}; // getting the domain name from an url 


var nameFromUrl = function nameFromUrl(url) {
  return url.match(/:\/\/(.[^/]+)/)[1];
}; // generating randomBytes 


var genRanHex = function genRanHex(size) {
  return _toConsumableArray(Array(size)).map(function () {
    return Math.floor(Math.random() * 16).toString(16);
  }).join('');
};
},{"./createstore":"scripts/createstore.js","./reducer":"scripts/reducer.js","./createList":"scripts/createList.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57980" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","scripts/app.js"], null)
//# sourceMappingURL=/app.c09d0a7b.js.map