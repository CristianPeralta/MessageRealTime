webpackJsonp([0],[
/* 0 */,
/* 1 */,
/* 2 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["default"] = addStylesClient;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__listToStyles__ = __webpack_require__(28);
/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/



var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

function addStylesClient (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = Object(__WEBPACK_IMPORTED_MODULE_0__listToStyles__["a" /* default */])(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = Object(__WEBPACK_IMPORTED_MODULE_0__listToStyles__["a" /* default */])(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = normalizeComponent;
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  scriptExports = scriptExports || {}

  // ES6 modules interop
  var type = typeof scriptExports.default
  if (type === 'object' || type === 'function') {
    scriptExports = scriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 5 */,
/* 6 */,
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services_Api__ = __webpack_require__(34);


/* harmony default export */ __webpack_exports__["a"] = ({
  signup: function signup(params) {
    return Object(__WEBPACK_IMPORTED_MODULE_0__services_Api__["a" /* default */])().post('signup', params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  login: function login(params) {
    return Object(__WEBPACK_IMPORTED_MODULE_0__services_Api__["a" /* default */])().post('login', params);
  },
  user: function user() {
    return Object(__WEBPACK_IMPORTED_MODULE_0__services_Api__["a" /* default */])().get('user');
  },
  logout: function logout() {
    return Object(__WEBPACK_IMPORTED_MODULE_0__services_Api__["a" /* default */])().post('logout');
  },
  getMessages: function getMessages() {
    return Object(__WEBPACK_IMPORTED_MODULE_0__services_Api__["a" /* default */])().get('messages');
  }
});

/***/ }),
/* 8 */,
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'App'
});

/***/ }),
/* 10 */,
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services_ChatServices__ = __webpack_require__(7);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'Message',
  props: ['user']
});

/***/ }),
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'Notification',
  data: function data() {
    return {
      data: 'This is a component Notification'
    };
  }
});

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services_ChatServices__ = __webpack_require__(7);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'Login',
  data: function data() {
    return {
      email: '',
      password: '',
      session: {}
    };
  },
  created: function created() {
    this.getUser();
  },

  methods: {
    login: function login() {
      var _this = this;

      __WEBPACK_IMPORTED_MODULE_0__services_ChatServices__["a" /* default */].login({
        email: this.email,
        password: this.password
      }).then(function (response) {
        var user = response.data;
        _this.$router.push({ name: 'Home' });
      });
    },
    getUser: function getUser() {
      var _this2 = this;

      __WEBPACK_IMPORTED_MODULE_0__services_ChatServices__["a" /* default */].user().then(function (response) {
        console.log(response);
        _this2.session = response.data;
      });
    }
  }
});

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services_ChatServices__ = __webpack_require__(7);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'SignUp',
  data: function data() {
    return {
      username: '',
      email: '',
      photo: {},
      preview: 'https://image.flaticon.com/icons/svg/179/179948.svg',
      password: '',
      confirmPassword: ''
    };
  },

  methods: {
    processFile: function processFile(e) {
      this.photo = e.target.files[0];
      this.preview = URL.createObjectURL(e.target.files[0]);
    },
    sendForm: function sendForm() {
      var _this = this;

      if (this.password === this.confirmPassword) {

        var form = new FormData();
        form.append('username', this.username);
        form.append('email', this.email);
        form.append('password', this.password);
        form.append('photo', this.photo);

        __WEBPACK_IMPORTED_MODULE_0__services_ChatServices__["a" /* default */].signup(form).then(function (response) {
          var user = response.data;
          _this.$router.push({ name: 'Home' });
        });
      } else {
        alert('Password doesnt match');
      }
    }
  }
});

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__App__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__router__ = __webpack_require__(30);




__WEBPACK_IMPORTED_MODULE_0_vue___default.a.config.productionTip = false;

var vm = new __WEBPACK_IMPORTED_MODULE_0_vue___default.a({
    el: '#app',
    router: __WEBPACK_IMPORTED_MODULE_2__router__["a" /* default */],
    components: { App: __WEBPACK_IMPORTED_MODULE_1__App__["a" /* default */] },
    template: '<App></App>'
});

/***/ }),
/* 23 */,
/* 24 */,
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__ = __webpack_require__(9);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_04c2046b_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_App_vue__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_component_normalizer__ = __webpack_require__(4);
var disposed = false
function injectStyle (context) {
  if (disposed) return
  __webpack_require__(26)
}
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null

var Component = Object(__WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_component_normalizer__["a" /* default */])(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_04c2046b_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_App_vue__["a" /* render */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_04c2046b_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_App_vue__["b" /* staticRenderFns */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\App.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-04c2046b", Component.options)
  } else {
    hotAPI.reload("data-v-04c2046b", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(27);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("48718cdb", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-04c2046b\",\"scoped\":false,\"sourceMap\":false}!../node_modules/sass-loader/lib/loader.js!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./App.vue", function() {
     var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-04c2046b\",\"scoped\":false,\"sourceMap\":false}!../node_modules/sass-loader/lib/loader.js!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./App.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports


// module
exports.push([module.i, "\n.container {\n  margin: 0;\n  padding: 0;\n}\n.notification {\n  background: red;\n}\n", ""]);

// exports


/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = listToStyles;
/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { attrs: { id: "app" } }, [
    _c("div", { staticClass: "container" }, [_c("router-view")], 1)
  ])
}
var staticRenderFns = []
render._withStripped = true

if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-04c2046b", { render: render, staticRenderFns: staticRenderFns })
  }
}

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_router__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_Home__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_Notification__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_Login__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_SignUp__ = __webpack_require__(62);







__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_1_vue_router__["default"]);

/* harmony default export */ __webpack_exports__["a"] = (new __WEBPACK_IMPORTED_MODULE_1_vue_router__["default"]({
  routes: [{
    path: '/',
    name: 'Login',
    component: __WEBPACK_IMPORTED_MODULE_4__components_Login__["a" /* default */]
  }, {
    path: '/signup',
    name: 'SignUp',
    component: __WEBPACK_IMPORTED_MODULE_5__components_SignUp__["a" /* default */]
  }, {
    path: '/home',
    name: 'Home',
    component: __WEBPACK_IMPORTED_MODULE_2__components_Home__["a" /* default */],
    props: true
  }, {
    path: '/notification',
    name: 'Notification',
    component: __WEBPACK_IMPORTED_MODULE_3__components_Notification__["a" /* default */]
  }]
}));

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Message_vue__ = __webpack_require__(11);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_72764eb2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Message_vue__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_component_normalizer__ = __webpack_require__(4);
var disposed = false
function injectStyle (context) {
  if (disposed) return
  __webpack_require__(32)
}
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null

var Component = Object(__WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_component_normalizer__["a" /* default */])(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Message_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_72764eb2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Message_vue__["a" /* render */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_72764eb2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Message_vue__["b" /* staticRenderFns */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\components\\Message.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-72764eb2", Component.options)
  } else {
    hotAPI.reload("data-v-72764eb2", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(33);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("4fdacf32", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-72764eb2\",\"scoped\":false,\"sourceMap\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Message.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-72764eb2\",\"scoped\":false,\"sourceMap\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Message.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);


/* harmony default export */ __webpack_exports__["a"] = (function () {
  return __WEBPACK_IMPORTED_MODULE_0_axios___default.a.create({
    baseURL: 'http://localhost:5000'
  });
});

/***/ }),
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("article", { staticClass: "post" }, [
    _c("div", { staticClass: "media" }, [
      _c("div", { staticClass: "media-left" }, [
        _c("p", { staticClass: "image is-32x32" }, [
          _c("img", { attrs: { src: _vm.user.photo } })
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "media-content" }, [
        _c("div", { staticClass: "content" }, [
          _c("p", [
            _c("a", { attrs: { href: "#" } }, [
              _vm._v(_vm._s(_vm.user.username))
            ]),
            _vm._v(" 5 minutes ago   \n        ")
          ])
        ])
      ])
    ]),
    _vm._v(" "),
    _c("h4", [_vm._t("default")], 2)
  ])
}
var staticRenderFns = []
render._withStripped = true

if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-72764eb2", { render: render, staticRenderFns: staticRenderFns })
  }
}

/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Notification_vue__ = __webpack_require__(19);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3a58017b_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Notification_vue__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_component_normalizer__ = __webpack_require__(4);
var disposed = false
function injectStyle (context) {
  if (disposed) return
  __webpack_require__(55)
}
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null

var Component = Object(__WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_component_normalizer__["a" /* default */])(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Notification_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3a58017b_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Notification_vue__["a" /* render */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3a58017b_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Notification_vue__["b" /* staticRenderFns */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\components\\Notification.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3a58017b", Component.options)
  } else {
    hotAPI.reload("data-v-3a58017b", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(56);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("b6d54146", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3a58017b\",\"scoped\":false,\"sourceMap\":false}!../../node_modules/sass-loader/lib/loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Notification.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3a58017b\",\"scoped\":false,\"sourceMap\":false}!../../node_modules/sass-loader/lib/loader.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Notification.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports


// module
exports.push([module.i, "\n.notification {\n  background: yellow;\n}\n", ""]);

// exports


/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "notification" }, [
    _c("h1", [_vm._v(_vm._s(_vm.data))])
  ])
}
var staticRenderFns = []
render._withStripped = true

if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-3a58017b", { render: render, staticRenderFns: staticRenderFns })
  }
}

/***/ }),
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Login_vue__ = __webpack_require__(20);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_9fcfedee_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Login_vue__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_component_normalizer__ = __webpack_require__(4);
var disposed = false
function injectStyle (context) {
  if (disposed) return
  __webpack_require__(59)
}
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null

var Component = Object(__WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_component_normalizer__["a" /* default */])(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Login_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_9fcfedee_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Login_vue__["a" /* render */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_9fcfedee_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Login_vue__["b" /* staticRenderFns */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\components\\Login.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-9fcfedee", Component.options)
  } else {
    hotAPI.reload("data-v-9fcfedee", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(60);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("60fe7b84", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-9fcfedee\",\"scoped\":false,\"sourceMap\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Login.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-9fcfedee\",\"scoped\":false,\"sourceMap\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Login.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports
exports.push([module.i, "@import url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css);", ""]);
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,700);", ""]);
exports.push([module.i, "@import url(https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.0/css/bulma.min.css);", ""]);

// module
exports.push([module.i, "\nhtml,body {\r\n    font-family: 'Open Sans', serif;\r\n    font-size: 14px;\r\n    font-weight: 300;\n}\n.container{\r\n    margin:0;\r\n    padding: 0;\n}\n.hero.is-success {\r\n    background: #F2F6FA;\n}\n.hero .nav, .hero.is-success .nav {\r\n    -webkit-box-shadow: none;\r\n    box-shadow: none;\n}\n.box {\r\n    margin-top: 5rem;\n}\n.avatar {\r\n    margin-top: -70px;\r\n    padding-bottom: 20px;\n}\n.avatar img {\r\n    padding: 5px;\r\n    background: #fff;\r\n    border-radius: 50%;\r\n    -webkit-box-shadow: 0 2px 3px rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.1);\r\n    box-shadow: 0 2px 3px rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.1);\n}\ninput {\r\n    font-weight: 300;\n}\np {\r\n    font-weight: 700;\n}\np.subtitle {\r\n    padding-top: 1rem;\n}\r\n", ""]);

// exports


/***/ }),
/* 61 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "section",
    { staticClass: "hero is-success is-fullheight container" },
    [
      _c("div", { staticClass: "hero-body" }, [
        _c("div", { staticClass: "container has-text-centered" }, [
          _c("div", { staticClass: "column is-4 is-offset-4" }, [
            _c("h3", { staticClass: "title has-text-grey" }, [_vm._v("Login")]),
            _vm._v(" "),
            _c("p", {
              model: {
                value: _vm.session.username,
                callback: function($$v) {
                  _vm.$set(_vm.session, "username", $$v)
                },
                expression: "session.username"
              }
            }),
            _vm._v(" "),
            _c("p", { staticClass: "subtitle has-text-grey" }, [
              _vm._v("Please login to proceed.")
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "box" }, [
              _vm._m(0),
              _vm._v(" "),
              _c("div", { staticClass: "field" }, [
                _c("div", { staticClass: "control" }, [
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.email,
                        expression: "email"
                      }
                    ],
                    staticClass: "input is-large",
                    attrs: {
                      type: "email",
                      placeholder: "Your Email",
                      autofocus: ""
                    },
                    domProps: { value: _vm.email },
                    on: {
                      input: function($event) {
                        if ($event.target.composing) {
                          return
                        }
                        _vm.email = $event.target.value
                      }
                    }
                  })
                ])
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "field" }, [
                _c("div", { staticClass: "control" }, [
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.password,
                        expression: "password"
                      }
                    ],
                    staticClass: "input is-large",
                    attrs: { type: "password", placeholder: "Your Password" },
                    domProps: { value: _vm.password },
                    on: {
                      input: function($event) {
                        if ($event.target.composing) {
                          return
                        }
                        _vm.password = $event.target.value
                      }
                    }
                  })
                ])
              ]),
              _vm._v(" "),
              _c(
                "button",
                {
                  staticClass: "button is-block is-info is-large is-fullwidth",
                  on: {
                    click: function($event) {
                      _vm.login()
                    }
                  }
                },
                [_vm._v("Login")]
              )
            ]),
            _vm._v(" "),
            _c(
              "p",
              { staticClass: "has-text-grey" },
              [
                _c("router-link", { attrs: { to: "/signup", exact: "" } }, [
                  _c("a", [_vm._v("Sign Up")]),
                  _vm._v("  · \n          ")
                ]),
                _vm._v(" "),
                _c("a", { attrs: { href: "../" } }, [_vm._v("Need Help?")])
              ],
              1
            )
          ])
        ])
      ])
    ]
  )
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("figure", { staticClass: "avatar" }, [
      _c("img", {
        attrs: {
          height: "128",
          width: "128",
          src: "https://www.viniloscasa.com/img/message.png"
        }
      })
    ])
  }
]
render._withStripped = true

if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-9fcfedee", { render: render, staticRenderFns: staticRenderFns })
  }
}

/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_SignUp_vue__ = __webpack_require__(21);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_68a7f148_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_SignUp_vue__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_component_normalizer__ = __webpack_require__(4);
var disposed = false
function injectStyle (context) {
  if (disposed) return
  __webpack_require__(63)
}
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null

var Component = Object(__WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_component_normalizer__["a" /* default */])(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_SignUp_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_68a7f148_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_SignUp_vue__["a" /* render */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_68a7f148_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_SignUp_vue__["b" /* staticRenderFns */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\components\\SignUp.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-68a7f148", Component.options)
  } else {
    hotAPI.reload("data-v-68a7f148", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(64);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("ab77ae04", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-68a7f148\",\"scoped\":false,\"sourceMap\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./SignUp.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-68a7f148\",\"scoped\":false,\"sourceMap\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./SignUp.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports
exports.push([module.i, "@import url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css);", ""]);
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,700);", ""]);
exports.push([module.i, "@import url(https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.0/css/bulma.min.css);", ""]);

// module
exports.push([module.i, "\nhtml,body {\r\n    font-family: 'Open Sans', serif;\r\n    font-size: 14px;\r\n    font-weight: 300;\n}\n.container{\r\n    margin:0;\r\n    padding: 0;\n}\n.hero.is-success {\r\n    background: #F2F6FA;\n}\n.hero .nav, .hero.is-success .nav {\r\n    -webkit-box-shadow: none;\r\n    box-shadow: none;\n}\n.box {\r\n    margin-top: 5rem;\n}\n.avatar {\r\n    margin-top: -70px;\r\n    padding-bottom: 20px;\n}\n.avatar img {\r\n    padding: 5px;\r\n    background: #fff;\r\n    border-radius: 50%;\r\n    -webkit-box-shadow: 0 2px 3px rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.1);\r\n    box-shadow: 0 2px 3px rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.1);\n}\ninput {\r\n    font-weight: 300;\n}\np {\r\n    font-weight: 700;\n}\np.subtitle {\r\n    padding-top: 1rem;\n}\r\n", ""]);

// exports


/***/ }),
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "section",
    { staticClass: "hero is-success is-fullheight container" },
    [
      _c("div", {}),
      _vm._v(" "),
      _c("div", { staticClass: "container has-text-centered" }, [
        _c("div", { staticClass: "column is-4 is-offset-4" }, [
          _c("h3", { staticClass: "title has-text-grey" }, [_vm._v("Sign Up")]),
          _vm._v(" "),
          _c("div", { staticClass: "box" }, [
            _c("figure", { staticClass: "avatar" }, [
              _c("img", {
                attrs: { height: "128", width: "128", src: _vm.preview }
              }),
              _vm._v(" "),
              _c("div", { staticClass: "file is-centered" }, [
                _c("label", { staticClass: "file-label" }, [
                  _c("input", {
                    staticClass: "file-input",
                    attrs: { type: "file" },
                    on: {
                      change: function($event) {
                        _vm.processFile($event)
                      }
                    }
                  }),
                  _vm._v(" "),
                  _vm._m(0)
                ])
              ])
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "field" }, [
              _c("div", { staticClass: "control" }, [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.username,
                      expression: "username"
                    }
                  ],
                  staticClass: "input is-large",
                  attrs: {
                    type: "text",
                    placeholder: "Your UserName",
                    autofocus: ""
                  },
                  domProps: { value: _vm.username },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.username = $event.target.value
                    }
                  }
                })
              ])
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "field" }, [
              _c("div", { staticClass: "control" }, [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.email,
                      expression: "email"
                    }
                  ],
                  staticClass: "input is-large",
                  attrs: { type: "email", placeholder: "Your Email" },
                  domProps: { value: _vm.email },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.email = $event.target.value
                    }
                  }
                })
              ])
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "field" }, [
              _c("div", { staticClass: "control" }, [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.password,
                      expression: "password"
                    }
                  ],
                  staticClass: "input is-large",
                  attrs: { type: "password", placeholder: "Your Password" },
                  domProps: { value: _vm.password },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.password = $event.target.value
                    }
                  }
                })
              ])
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "field" }, [
              _c("div", { staticClass: "control" }, [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.confirmPassword,
                      expression: "confirmPassword"
                    }
                  ],
                  staticClass: "input is-large",
                  attrs: { type: "password", placeholder: "Confirm Password" },
                  domProps: { value: _vm.confirmPassword },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.confirmPassword = $event.target.value
                    }
                  }
                })
              ])
            ]),
            _vm._v(" "),
            _c(
              "button",
              {
                staticClass: "button is-block is-info is-large is-fullwidth",
                on: {
                  click: function($event) {
                    _vm.sendForm()
                  }
                }
              },
              [_vm._v("Sign Me Up")]
            )
          ]),
          _vm._v(" "),
          _c(
            "p",
            { staticClass: "has-text-grey" },
            [
              _c("router-link", { attrs: { to: "/", exact: "" } }, [
                _c("a", [_vm._v("Sign In")]),
                _vm._v("  · \n          ")
              ]),
              _vm._v(" "),
              _c("a", { attrs: { href: "../" } }, [_vm._v("Need Help?")])
            ],
            1
          )
        ])
      ])
    ]
  )
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "file-cta" }, [
      _c("span", { staticClass: "file-icon" }, [
        _c("i", { staticClass: "fas fa-upload" })
      ]),
      _vm._v(" "),
      _c("span", { staticClass: "file-label" }, [
        _vm._v("\n                    Choose a file…\n                  ")
      ])
    ])
  }
]
render._withStripped = true

if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-68a7f148", { render: render, staticRenderFns: staticRenderFns })
  }
}

/***/ }),
/* 66 */,
/* 67 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_socket_io__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_socket_io___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue_socket_io__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_ChatServices__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_Message__ = __webpack_require__(31);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_1_vue_socket_io___default.a, 'ws://localhost:5000');

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'Home',
  data: function data() {
    return {
      message: 'Hello World',
      messages: [],
      user: {},
      menu: false,
      text: ''
    };
  },

  components: {
    Message: __WEBPACK_IMPORTED_MODULE_3__components_Message__["a" /* default */]
  },
  sockets: {
    connect: function connect() {
      console.log('socket connected');
    },
    customEmit: function customEmit(val) {
      console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)');
    }
  },
  created: function created() {
    this.getUser();
    this.getMessages();
  },

  methods: {
    getUser: function getUser() {
      var _this = this;

      __WEBPACK_IMPORTED_MODULE_2__services_ChatServices__["a" /* default */].user().then(function (response) {
        console.log(response);
        _this.user = response.data;
      });
    },
    logout: function logout() {
      var _this2 = this;

      __WEBPACK_IMPORTED_MODULE_2__services_ChatServices__["a" /* default */].logout().then(function (response) {
        _this2.$router.push({ name: 'Login' });
      });
    },
    menuActive: function menuActive() {
      this.menu = !this.menu;
    },
    getMessages: function getMessages() {
      var _this3 = this;

      __WEBPACK_IMPORTED_MODULE_2__services_ChatServices__["a" /* default */].getMessages().then(function (response) {
        _this3.messages = response.data;
      });
    },
    addMessage: function addMessage() {
      var _this4 = this;

      __WEBPACK_IMPORTED_MODULE_2__services_ChatServices__["a" /* default */].addMessage().then(function (response) {
        _this4.messages.push(response.data);
      });
    }
  }
});

/***/ }),
/* 68 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Home_vue__ = __webpack_require__(67);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_fed36922_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Home_vue__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_component_normalizer__ = __webpack_require__(4);
var disposed = false
function injectStyle (context) {
  if (disposed) return
  __webpack_require__(69)
}
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null

var Component = Object(__WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_component_normalizer__["a" /* default */])(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Home_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_fed36922_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Home_vue__["a" /* render */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_fed36922_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Home_vue__["b" /* staticRenderFns */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\components\\Home.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-fed36922", Component.options)
  } else {
    hotAPI.reload("data-v-fed36922", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(70);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(3).default
var update = add("d9bc327c", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-fed36922\",\"scoped\":false,\"sourceMap\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Home.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-fed36922\",\"scoped\":false,\"sourceMap\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Home.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports
exports.push([module.i, "@import url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css);", ""]);
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,700);", ""]);
exports.push([module.i, "@import url(https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.0/css/bulma.min.css);", ""]);

// module
exports.push([module.i, "\nhtml,body {\r\n  font-family: 'Open Sans', serif;\r\n  background: #F2F6FA;\n}\nfooter {\r\n  background-color: #F2F6FA !important;\n}\n.topNav {\r\n  border-top: 5px solid #3498DB;\n}\n.topNav .container {\r\n  border-bottom: 1px solid #E6EAEE;\n}\n.container .columns {\r\n  margin: 3rem 0;\n}\n.navbar-menu .navbar-item {\r\n  padding: 0 2rem;\n}\naside.menu {\r\n  padding-top: 3rem;\n}\naside.menu .menu-list {\r\n  line-height: 1.5;\n}\naside.menu .menu-label {\r\n  padding-left: 10px;\r\n  font-weight: 700;\n}\n.button.is-primary.is-alt {\r\n  background: #00c6ff;\r\n  background: -webkit-linear-gradient(to bottom, #0072ff, #00c6ff);\r\n  background: linear-gradient(to bottom, #0072ff, #00c6ff);\r\n  font-weight: 700;\r\n  font-size: 14px;\r\n  height: 3rem;\r\n  line-height: 2.8;\n}\n.media-left img {\r\n  border-radius: 50%;\n}\n.media-content p {\r\n  font-size: 14px;\r\n  line-height: 2.3;\r\n  font-weight: 700;\r\n  color: #8F99A3;\n}\narticle.post {\r\n  margin: 1rem;\r\n  padding-bottom: 1rem;\r\n  border-bottom: 1px solid #E6EAEE;\n}\narticle.post:last-child {\r\n  padding-bottom: 0;\r\n  border-bottom: none;\n}\r\n", ""]);

// exports


/***/ }),
/* 71 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", {}, [
    _c("nav", { staticClass: "navbar topNav" }, [
      _c("div", { staticClass: "container" }, [
        _c("div", { staticClass: "navbar-menu", attrs: { id: "topNav" } }, [
          _vm._m(0),
          _vm._v(" "),
          _c("div", { staticClass: "navbar-end" }, [
            _c(
              "div",
              {
                staticClass: "navbar-item has-dropdown",
                class: { "is-active": _vm.menu },
                on: {
                  click: function($event) {
                    _vm.menuActive()
                  }
                }
              },
              [
                _c("a", { staticClass: "navbar-link" }, [
                  _c("img", {
                    attrs: { height: "40", width: "40", src: _vm.user.photo }
                  }),
                  _vm._v(
                    "\n              " +
                      _vm._s(_vm.user.username) +
                      "\n            "
                  )
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "navbar-dropdown is-right" }, [
                  _c("a", { staticClass: "navbar-item" }, [
                    _vm._v("\n                Profile\n              ")
                  ]),
                  _vm._v(" "),
                  _c(
                    "a",
                    {
                      staticClass: "navbar-item",
                      on: {
                        click: function($event) {
                          _vm.logout()
                        }
                      }
                    },
                    [_vm._v("\n                Logut\n              ")]
                  )
                ])
              ]
            )
          ])
        ])
      ])
    ]),
    _vm._v(" "),
    _c("section", { staticClass: "container" }, [
      _c(
        "div",
        {
          staticClass: "columns",
          staticStyle: { "margin-left": "3rem", "margin-top": "0px" }
        },
        [
          _vm._m(1),
          _vm._v(" "),
          _c("div", { staticClass: "column is-9" }, [
            _c(
              "div",
              { staticClass: "box content" },
              [
                _c("Message", { attrs: { user: _vm.user } }, [
                  _vm._v("\n            This is my first message\n          ")
                ]),
                _vm._v(" "),
                _c("article", { staticClass: "post" }, [
                  _c("div", { staticClass: "media" }, [
                    _c("div", { staticClass: "media-left" }, [
                      _c("p", { staticClass: "image is-32x32" }, [
                        _c("img", { attrs: { src: _vm.user.photo } })
                      ])
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "media-content" }, [
                      _c("div", { staticClass: "content" }, [
                        _c("p", [
                          _c("a", { attrs: { href: "#" } }, [
                            _vm._v("You (" + _vm._s(_vm.user.username) + ")")
                          ]),
                          _vm._v("  \n                  ")
                        ])
                      ])
                    ])
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "field" }, [
                    _c("div", { staticClass: "control" }, [
                      _c("textarea", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.text,
                            expression: "text"
                          }
                        ],
                        staticClass: "textarea is-large",
                        attrs: { type: "text", placeholder: "Your message" },
                        domProps: { value: _vm.text },
                        on: {
                          input: function($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.text = $event.target.value
                          }
                        }
                      })
                    ])
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "control" }, [
                    _c(
                      "button",
                      {
                        staticClass: "button is-primary",
                        on: {
                          click: function($event) {
                            _vm.addMessage()
                          }
                        }
                      },
                      [_vm._v("Submit")]
                    )
                  ])
                ])
              ],
              1
            )
          ])
        ]
      )
    ]),
    _vm._v(" "),
    _vm._m(2)
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "navbar-start" }, [
      _c("a", { staticClass: "navbar-item" }, [
        _vm._v("\n            Home\n          ")
      ])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "column is-3" }, [
      _c("aside", { staticClass: "menu" }, [
        _c("p", { staticClass: "menu-label" }, [
          _vm._v("\n            Channels\n          ")
        ]),
        _vm._v(" "),
        _c("ul", { staticClass: "menu-list" }, [
          _c("li", [_c("a", [_vm._v("Health")])]),
          _vm._v(" "),
          _c("li", [_c("a", [_vm._v("Games")])]),
          _vm._v(" "),
          _c("li", [_c("a", [_vm._v("Sports")])]),
          _vm._v(" "),
          _c("li", [_c("a", [_vm._v("Music")])]),
          _vm._v(" "),
          _c("li", [_c("a", [_vm._v("Love")])]),
          _vm._v(" "),
          _c("li", [_c("a", [_vm._v("IT")])])
        ])
      ])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("footer", { staticClass: "footer" }, [
      _c("div", { staticClass: "container" }, [
        _c("div", { staticClass: "content has-text-centered" }, [
          _c("p", [
            _c("strong", [_vm._v("Bulma Templates")]),
            _vm._v(" by "),
            _c("a", { attrs: { href: "https://github.com/dansup" } }, [
              _vm._v("Daniel Supernault")
            ]),
            _vm._v(". The source code is licensed\n          "),
            _c(
              "a",
              {
                attrs: {
                  href: "http://opensource.org/licenses/mit-license.php"
                }
              },
              [_vm._v("MIT")]
            ),
            _vm._v(".\n        ")
          ]),
          _vm._v(" "),
          _c("p", [
            _c(
              "a",
              {
                staticClass: "icon",
                attrs: { href: "https://github.com/dansup/bulma-templates" }
              },
              [_c("i", { staticClass: "fa fa-github" })]
            )
          ])
        ])
      ])
    ])
  }
]
render._withStripped = true

if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-fed36922", { render: render, staticRenderFns: staticRenderFns })
  }
}

/***/ })
],[22]);