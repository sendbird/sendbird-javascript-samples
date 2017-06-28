/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 316);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(2)
  , core      = __webpack_require__(24)
  , hide      = __webpack_require__(12)
  , redefine  = __webpack_require__(13)
  , ctx       = __webpack_require__(25)
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE] || (exports[PROTOTYPE] = {})
    , key, own, out, exp;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if(target)redefine(target, key, out, type & $export.U);
    // export
    if(exports[key] != out)hide(exports, key, exp);
    if(IS_PROTO && expProto[key] != out)expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var store      = __webpack_require__(60)('wks')
  , uid        = __webpack_require__(40)
  , Symbol     = __webpack_require__(2).Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(3)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var anObject       = __webpack_require__(1)
  , IE8_DOM_DEFINE = __webpack_require__(97)
  , toPrimitive    = __webpack_require__(23)
  , dP             = Object.defineProperty;

exports.f = __webpack_require__(6) ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(31)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(19);
module.exports = function(it){
  return Object(defined(it));
};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(7)
  , createDesc = __webpack_require__(30);
module.exports = __webpack_require__(6) ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(2)
  , hide      = __webpack_require__(12)
  , has       = __webpack_require__(10)
  , SRC       = __webpack_require__(40)('src')
  , TO_STRING = 'toString'
  , $toString = Function[TO_STRING]
  , TPL       = ('' + $toString).split(TO_STRING);

__webpack_require__(24).inspectSource = function(it){
  return $toString.call(it);
};

(module.exports = function(O, key, val, safe){
  var isFunction = typeof val == 'function';
  if(isFunction)has(val, 'name') || hide(val, 'name', key);
  if(O[key] === val)return;
  if(isFunction)has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if(O === global){
    O[key] = val;
  } else {
    if(!safe){
      delete O[key];
      hide(O, key, val);
    } else {
      if(O[key])O[key] = val;
      else hide(O, key, val);
    }
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString(){
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0)
  , fails   = __webpack_require__(3)
  , defined = __webpack_require__(19)
  , quot    = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function(string, tag, attribute, value) {
  var S  = String(defined(string))
    , p1 = '<' + tag;
  if(attribute !== '')p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
module.exports = function(NAME, exec){
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function(){
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(49)
  , defined = __webpack_require__(19);
module.exports = function(it){
  return IObject(defined(it));
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var pIE            = __webpack_require__(50)
  , createDesc     = __webpack_require__(30)
  , toIObject      = __webpack_require__(15)
  , toPrimitive    = __webpack_require__(23)
  , has            = __webpack_require__(10)
  , IE8_DOM_DEFINE = __webpack_require__(97)
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(6) ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = __webpack_require__(10)
  , toObject    = __webpack_require__(9)
  , IE_PROTO    = __webpack_require__(77)('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

/***/ }),
/* 18 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};

/***/ }),
/* 19 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(3);

module.exports = function(method, arg){
  return !!method && fails(function(){
    arg ? method.call(null, function(){}, 1) : method.call(null);
  });
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx      = __webpack_require__(25)
  , IObject  = __webpack_require__(49)
  , toObject = __webpack_require__(9)
  , toLength = __webpack_require__(8)
  , asc      = __webpack_require__(129);
module.exports = function(TYPE, $create){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX
    , create        = $create || asc;
  return function($this, callbackfn, that){
    var O      = toObject($this)
      , self   = IObject(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(0)
  , core    = __webpack_require__(24)
  , fails   = __webpack_require__(3);
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(4);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ }),
/* 24 */
/***/ (function(module, exports) {

var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(11);
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var Map     = __webpack_require__(113)
  , $export = __webpack_require__(0)
  , shared  = __webpack_require__(60)('metadata')
  , store   = shared.store || (shared.store = new (__webpack_require__(116)));

var getOrCreateMetadataMap = function(target, targetKey, create){
  var targetMetadata = store.get(target);
  if(!targetMetadata){
    if(!create)return undefined;
    store.set(target, targetMetadata = new Map);
  }
  var keyMetadata = targetMetadata.get(targetKey);
  if(!keyMetadata){
    if(!create)return undefined;
    targetMetadata.set(targetKey, keyMetadata = new Map);
  } return keyMetadata;
};
var ordinaryHasOwnMetadata = function(MetadataKey, O, P){
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? false : metadataMap.has(MetadataKey);
};
var ordinaryGetOwnMetadata = function(MetadataKey, O, P){
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? undefined : metadataMap.get(MetadataKey);
};
var ordinaryDefineOwnMetadata = function(MetadataKey, MetadataValue, O, P){
  getOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
};
var ordinaryOwnMetadataKeys = function(target, targetKey){
  var metadataMap = getOrCreateMetadataMap(target, targetKey, false)
    , keys        = [];
  if(metadataMap)metadataMap.forEach(function(_, key){ keys.push(key); });
  return keys;
};
var toMetaKey = function(it){
  return it === undefined || typeof it == 'symbol' ? it : String(it);
};
var exp = function(O){
  $export($export.S, 'Reflect', O);
};

module.exports = {
  store: store,
  map: getOrCreateMetadataMap,
  has: ordinaryHasOwnMetadata,
  get: ordinaryGetOwnMetadata,
  set: ordinaryDefineOwnMetadata,
  keys: ordinaryOwnMetadataKeys,
  key: toMetaKey,
  exp: exp
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

if(__webpack_require__(6)){
  var LIBRARY             = __webpack_require__(33)
    , global              = __webpack_require__(2)
    , fails               = __webpack_require__(3)
    , $export             = __webpack_require__(0)
    , $typed              = __webpack_require__(61)
    , $buffer             = __webpack_require__(84)
    , ctx                 = __webpack_require__(25)
    , anInstance          = __webpack_require__(32)
    , propertyDesc        = __webpack_require__(30)
    , hide                = __webpack_require__(12)
    , redefineAll         = __webpack_require__(37)
    , toInteger           = __webpack_require__(31)
    , toLength            = __webpack_require__(8)
    , toIndex             = __webpack_require__(39)
    , toPrimitive         = __webpack_require__(23)
    , has                 = __webpack_require__(10)
    , same                = __webpack_require__(110)
    , classof             = __webpack_require__(48)
    , isObject            = __webpack_require__(4)
    , toObject            = __webpack_require__(9)
    , isArrayIter         = __webpack_require__(69)
    , create              = __webpack_require__(34)
    , getPrototypeOf      = __webpack_require__(17)
    , gOPN                = __webpack_require__(35).f
    , getIterFn           = __webpack_require__(86)
    , uid                 = __webpack_require__(40)
    , wks                 = __webpack_require__(5)
    , createArrayMethod   = __webpack_require__(21)
    , createArrayIncludes = __webpack_require__(51)
    , speciesConstructor  = __webpack_require__(78)
    , ArrayIterators      = __webpack_require__(87)
    , Iterators           = __webpack_require__(44)
    , $iterDetect         = __webpack_require__(57)
    , setSpecies          = __webpack_require__(38)
    , arrayFill           = __webpack_require__(62)
    , arrayCopyWithin     = __webpack_require__(90)
    , $DP                 = __webpack_require__(7)
    , $GOPD               = __webpack_require__(16)
    , dP                  = $DP.f
    , gOPD                = $GOPD.f
    , RangeError          = global.RangeError
    , TypeError           = global.TypeError
    , Uint8Array          = global.Uint8Array
    , ARRAY_BUFFER        = 'ArrayBuffer'
    , SHARED_BUFFER       = 'Shared' + ARRAY_BUFFER
    , BYTES_PER_ELEMENT   = 'BYTES_PER_ELEMENT'
    , PROTOTYPE           = 'prototype'
    , ArrayProto          = Array[PROTOTYPE]
    , $ArrayBuffer        = $buffer.ArrayBuffer
    , $DataView           = $buffer.DataView
    , arrayForEach        = createArrayMethod(0)
    , arrayFilter         = createArrayMethod(2)
    , arraySome           = createArrayMethod(3)
    , arrayEvery          = createArrayMethod(4)
    , arrayFind           = createArrayMethod(5)
    , arrayFindIndex      = createArrayMethod(6)
    , arrayIncludes       = createArrayIncludes(true)
    , arrayIndexOf        = createArrayIncludes(false)
    , arrayValues         = ArrayIterators.values
    , arrayKeys           = ArrayIterators.keys
    , arrayEntries        = ArrayIterators.entries
    , arrayLastIndexOf    = ArrayProto.lastIndexOf
    , arrayReduce         = ArrayProto.reduce
    , arrayReduceRight    = ArrayProto.reduceRight
    , arrayJoin           = ArrayProto.join
    , arraySort           = ArrayProto.sort
    , arraySlice          = ArrayProto.slice
    , arrayToString       = ArrayProto.toString
    , arrayToLocaleString = ArrayProto.toLocaleString
    , ITERATOR            = wks('iterator')
    , TAG                 = wks('toStringTag')
    , TYPED_CONSTRUCTOR   = uid('typed_constructor')
    , DEF_CONSTRUCTOR     = uid('def_constructor')
    , ALL_CONSTRUCTORS    = $typed.CONSTR
    , TYPED_ARRAY         = $typed.TYPED
    , VIEW                = $typed.VIEW
    , WRONG_LENGTH        = 'Wrong length!';

  var $map = createArrayMethod(1, function(O, length){
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function(){
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function(){
    new Uint8Array(1).set({});
  });

  var strictToLength = function(it, SAME){
    if(it === undefined)throw TypeError(WRONG_LENGTH);
    var number = +it
      , length = toLength(it);
    if(SAME && !same(number, length))throw RangeError(WRONG_LENGTH);
    return length;
  };

  var toOffset = function(it, BYTES){
    var offset = toInteger(it);
    if(offset < 0 || offset % BYTES)throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function(it){
    if(isObject(it) && TYPED_ARRAY in it)return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function(C, length){
    if(!(isObject(C) && TYPED_CONSTRUCTOR in C)){
      throw TypeError('It is not a typed array constructor!');
    } return new C(length);
  };

  var speciesFromList = function(O, list){
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function(C, list){
    var index  = 0
      , length = list.length
      , result = allocate(C, length);
    while(length > index)result[index] = list[index++];
    return result;
  };

  var addGetter = function(it, key, internal){
    dP(it, key, {get: function(){ return this._d[internal]; }});
  };

  var $from = function from(source /*, mapfn, thisArg */){
    var O       = toObject(source)
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , iterFn  = getIterFn(O)
      , i, length, values, result, step, iterator;
    if(iterFn != undefined && !isArrayIter(iterFn)){
      for(iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++){
        values.push(step.value);
      } O = values;
    }
    if(mapping && aLen > 2)mapfn = ctx(mapfn, arguments[2], 2);
    for(i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++){
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of(/*...items*/){
    var index  = 0
      , length = arguments.length
      , result = allocate(this, length);
    while(length > index)result[index] = arguments[index++];
    return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function(){ arrayToLocaleString.call(new Uint8Array(1)); });

  var $toLocaleString = function toLocaleString(){
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /*, end */){
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /*, thisArg */){
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /*, start, end */){ // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /*, thisArg */){
      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
        arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /*, thisArg */){
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /*, thisArg */){
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /*, thisArg */){
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /*, fromIndex */){
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /*, fromIndex */){
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator){ // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /*, fromIndex */){ // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /*, thisArg */){
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /*, initialValue */){ // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /*, initialValue */){ // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse(){
      var that   = this
        , length = validate(that).length
        , middle = Math.floor(length / 2)
        , index  = 0
        , value;
      while(index < middle){
        value         = that[index];
        that[index++] = that[--length];
        that[length]  = value;
      } return that;
    },
    some: function some(callbackfn /*, thisArg */){
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn){
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end){
      var O      = validate(this)
        , length = O.length
        , $begin = toIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
        O.buffer,
        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
        toLength((end === undefined ? length : toIndex(end, length)) - $begin)
      );
    }
  };

  var $slice = function slice(start, end){
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /*, offset */){
    validate(this);
    var offset = toOffset(arguments[1], 1)
      , length = this.length
      , src    = toObject(arrayLike)
      , len    = toLength(src.length)
      , index  = 0;
    if(len + offset > length)throw RangeError(WRONG_LENGTH);
    while(index < len)this[offset + index] = src[index++];
  };

  var $iterators = {
    entries: function entries(){
      return arrayEntries.call(validate(this));
    },
    keys: function keys(){
      return arrayKeys.call(validate(this));
    },
    values: function values(){
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function(target, key){
    return isObject(target)
      && target[TYPED_ARRAY]
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key){
    return isTAIndex(target, key = toPrimitive(key, true))
      ? propertyDesc(2, target[key])
      : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc){
    if(isTAIndex(target, key = toPrimitive(key, true))
      && isObject(desc)
      && has(desc, 'value')
      && !has(desc, 'get')
      && !has(desc, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !desc.configurable
      && (!has(desc, 'writable') || desc.writable)
      && (!has(desc, 'enumerable') || desc.enumerable)
    ){
      target[key] = desc.value;
      return target;
    } else return dP(target, key, desc);
  };

  if(!ALL_CONSTRUCTORS){
    $GOPD.f = $getDesc;
    $DP.f   = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty:           $setDesc
  });

  if(fails(function(){ arrayToString.call({}); })){
    arrayToString = arrayToLocaleString = function toString(){
      return arrayJoin.call(this);
    }
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice:          $slice,
    set:            $set,
    constructor:    function(){ /* noop */ },
    toString:       arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function(){ return this[TYPED_ARRAY]; }
  });

  module.exports = function(KEY, BYTES, wrapper, CLAMPED){
    CLAMPED = !!CLAMPED;
    var NAME       = KEY + (CLAMPED ? 'Clamped' : '') + 'Array'
      , ISNT_UINT8 = NAME != 'Uint8Array'
      , GETTER     = 'get' + KEY
      , SETTER     = 'set' + KEY
      , TypedArray = global[NAME]
      , Base       = TypedArray || {}
      , TAC        = TypedArray && getPrototypeOf(TypedArray)
      , FORCED     = !TypedArray || !$typed.ABV
      , O          = {}
      , TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function(that, index){
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function(that, index, value){
      var data = that._d;
      if(CLAMPED)value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function(that, index){
      dP(that, index, {
        get: function(){
          return getter(this, index);
        },
        set: function(value){
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if(FORCED){
      TypedArray = wrapper(function(that, data, $offset, $length){
        anInstance(that, TypedArray, NAME, '_d');
        var index  = 0
          , offset = 0
          , buffer, byteLength, length, klass;
        if(!isObject(data)){
          length     = strictToLength(data, true)
          byteLength = length * BYTES;
          buffer     = new $ArrayBuffer(byteLength);
        } else if(data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER){
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if($length === undefined){
            if($len % BYTES)throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if(byteLength < 0)throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if(byteLength + offset > $len)throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if(TYPED_ARRAY in data){
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }
        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });
        while(index < length)addElement(that, index++);
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if(!$iterDetect(function(iter){
      // V8 works with iterators, but fails in many other cases
      // https://code.google.com/p/v8/issues/detail?id=4552
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)){
      TypedArray = wrapper(function(that, data, $offset, $length){
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if(!isObject(data))return new Base(strictToLength(data, ISNT_UINT8));
        if(data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER){
          return $length !== undefined
            ? new Base(data, toOffset($offset, BYTES), $length)
            : $offset !== undefined
              ? new Base(data, toOffset($offset, BYTES))
              : new Base(data);
        }
        if(TYPED_ARRAY in data)return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function(key){
        if(!(key in TypedArray))hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if(!LIBRARY)TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator   = TypedArrayPrototype[ITERATOR]
      , CORRECT_ITER_NAME = !!$nativeIterator && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined)
      , $iterator         = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if(CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)){
      dP(TypedArrayPrototype, TAG, {
        get: function(){ return NAME; }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES,
      from: $from,
      of: $of
    });

    if(!(BYTES_PER_ELEMENT in TypedArrayPrototype))hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, {set: $set});

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    $export($export.P + $export.F * (TypedArrayPrototype.toString != arrayToString), NAME, {toString: arrayToString});

    $export($export.P + $export.F * fails(function(){
      new TypedArray(1).slice();
    }), NAME, {slice: $slice});

    $export($export.P + $export.F * (fails(function(){
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString()
    }) || !fails(function(){
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, {toLocaleString: $toLocaleString});

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if(!LIBRARY && !CORRECT_ITER_NAME)hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function(){ /* empty */ };

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var className = exports.className = {
  WIDGET_BTN: 'widget',
  NOTIFICATION: 'notification',

  ACTIVE: 'active',
  DISABLED: 'disabled',

  CHANNEL_BOARD: 'channel-board',
  BOARD_TOP: 'board-top',
  OPTION_MENU: 'option-menu',
  OPTION_CONTENT: 'option-content',

  TITLE: 'title',
  INPUT: 'input',
  BTN: 'btn',
  ITEM: 'item',
  IMAGE: 'image',
  TOP: 'top',
  COUNT: 'count',
  TIME: 'time',
  UNREAD: 'unread',

  CONTENT: 'content',
  LOGIN_FORM: 'login-form',
  LOGIN_BTN: 'login-btn',
  USER_ID: 'user-id',
  NICKNAME: 'nickname',

  CHANNEL_LIST: 'channel-list',
  CONTENT_TOP: 'content-top',
  CONTENT_BOTTOM: 'content-bottom',
  LAST_MESSAGE: 'last-message',
  EMPTY_ITEM: 'empty-item',

  CHAT_SECTION: 'chat-section',
  CHAT_BOARD: 'chat-board',
  MESSAGE_CONTENT: 'message-content',
  MESSAGE_LIST: 'message-list',
  TYPING: 'typing',
  TEXT: 'text',
  FILE_MESSAGE: 'file-message',
  FILE: 'file',
  FILE_ICON: 'file-icon',
  FILE_NAME: 'file-name',
  FILE_DOWNLOAD: 'file-download',
  FILE_TEXT: 'file-text',
  MESSAGE_SET: 'message-set',
  USER: 'user',
  MESSAGE_ITEM: 'message-item',
  MESSAGE: 'message',
  USER_CONTENT: 'user-content',
  NEW_CHAT_BTN: 'new-chat-btn',
  USER_SELECT: 'user-select',
  USER_ITEM: 'user-item',
  LEAVE_POPUP: 'leave-popup',
  LEAVE_BTN: 'leave-btn',
  CANCEL_BTN: 'cancel-btn',
  ADMIN_MESSAGE: 'admin-message',

  POPUP: 'popup',
  MEMBERS: 'members',
  INVITE: 'invite',
  POPUP_BODY: 'popup-body',
  POPUP_TOP: 'popup-top',
  POPUP_CONTENT: 'popup-content',
  POPUP_BOTTOM: 'popup-bottom',
  INVITE_BTN: 'invite-btn',
  IMAGE_ME: 'image-me',

  TOOLTIP: 'tooltip',

  IC_LOGIN: 'ic-login',
  IC_CONNECTED: 'ic-connected',
  IC_MINIMIZE: 'ic-minimize',
  IC_OPTION: 'ic-option',
  IC_NEW_CHAT: 'ic-new-chat',
  IC_CLOSE: 'ic-close',
  IC_MEMBERS: 'ic-members',
  IC_INVITE: 'ic-invite',
  IC_LEAVE: 'ic-leave',

  FADE_IN: 'sb-fade-in',
  FADE_OUT: 'sb-fade-out',
  SPINNER: 'sb-spinner'

};

var styleValue = exports.styleValue = {
  CURSOR_INIT: '',
  CURSOR_DEFAULT: 'default'
};

var MAX_COUNT = exports.MAX_COUNT = '+9';
var MAX_FONT_ZISE = exports.MAX_FONT_ZISE = '11';

var TYPE_STRING = exports.TYPE_STRING = 'string';

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var META     = __webpack_require__(40)('meta')
  , isObject = __webpack_require__(4)
  , has      = __webpack_require__(10)
  , setDesc  = __webpack_require__(7).f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !__webpack_require__(3)(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

/***/ }),
/* 31 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = false;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = __webpack_require__(1)
  , dPs         = __webpack_require__(103)
  , enumBugKeys = __webpack_require__(65)
  , IE_PROTO    = __webpack_require__(77)('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(64)('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(67).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = __webpack_require__(105)
  , hiddenKeys = __webpack_require__(65).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = __webpack_require__(105)
  , enumBugKeys = __webpack_require__(65);

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__(13);
module.exports = function(target, src, safe){
  for(var key in src)redefine(target, key, src[key], safe);
  return target;
};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global      = __webpack_require__(2)
  , dP          = __webpack_require__(7)
  , DESCRIPTORS = __webpack_require__(6)
  , SPECIES     = __webpack_require__(5)('species');

module.exports = function(KEY){
  var C = global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(31)
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ }),
/* 40 */
/***/ (function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hide = hide;
exports.show = show;
exports.hasClass = hasClass;
exports.addClass = addClass;
exports.removeClass = removeClass;
exports.isEmptyString = isEmptyString;
exports.removeWhiteSpace = removeWhiteSpace;
exports.getFullHeight = getFullHeight;
exports.insertMessageInList = insertMessageInList;
exports.getLastItem = getLastItem;
var ANIMATION_EVENT = 'animationend';
var ANIMATION_REGEX = 'sb-fade.*';
var DISPLAY_NONE = 'none';
var DISPLAY_BLOCK = 'block';

var hasClassRegex = function hasClassRegex(target, classNameRegex) {
  return new RegExp('(^| )' + classNameRegex + '( |$)', 'gi').test(target.className);
};

function hide(target) {
  if (target) {
    if (hasClassRegex(target, ANIMATION_REGEX)) {
      var _hideAnimationEvent = void 0;
      target.addEventListener(ANIMATION_EVENT, _hideAnimationEvent = function hideAnimationEvent() {
        target.style.display = DISPLAY_NONE;
        target.removeEventListener(ANIMATION_EVENT, _hideAnimationEvent, false);
      });
    } else {
      target.style.display = DISPLAY_NONE;
    }
  }
}

function show(target, displayType) {
  if (target) {
    displayType ? target.style.display = displayType : target.style.display = DISPLAY_BLOCK;
  }
}

function hasClass() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return args.reduce(function (target, className) {
    if (target.classList) {
      return target.classList.contains(className);
    } else {
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(target.className);
    }
  });
}

function addClass() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return args.reduce(function (target, className) {
    if (target.classList) {
      if (!(className in target.classList)) {
        target.classList.add(className);
      }
    } else {
      if (target.className.indexOf(className) < 0) {
        target.className += ' ' + className;
      }
    }
    return target;
  });
}

function removeClass() {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  return args.reduce(function (target, className) {
    if (target.classList) {
      target.classList.remove(className);
    } else {
      target.className = target.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), '');
    }
    return target;
  });
}

function isEmptyString(target) {
  return !!(target == null || target == undefined || target.length == 0);
}

function removeWhiteSpace(target) {
  return target.replace(/ /g, '');
}

function getFullHeight(target) {
  var height = target.offsetHeight;
  var style = getComputedStyle(target);
  height += parseInt(style.marginTop) + parseInt(style.marginBottom);
  return height;
}

function insertMessageInList(target, index, item) {
  return target.splice(index, 0, item);
}

function getLastItem(target) {
  return target.length < 1 ? null : target[target.length - 1];
}

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__(5)('unscopables')
  , ArrayProto  = Array.prototype;
if(ArrayProto[UNSCOPABLES] == undefined)__webpack_require__(12)(ArrayProto, UNSCOPABLES, {});
module.exports = function(key){
  ArrayProto[UNSCOPABLES][key] = true;
};

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var ctx         = __webpack_require__(25)
  , call        = __webpack_require__(99)
  , isArrayIter = __webpack_require__(69)
  , anObject    = __webpack_require__(1)
  , toLength    = __webpack_require__(8)
  , getIterFn   = __webpack_require__(86)
  , BREAK       = {}
  , RETURN      = {};
var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator, result;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if(result === BREAK || result === RETURN)return result;
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    result = call(iterator, f, step.value, entries);
    if(result === BREAK || result === RETURN)return result;
  }
};
exports.BREAK  = BREAK;
exports.RETURN = RETURN;

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = {};

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(7).f
  , has = __webpack_require__(10)
  , TAG = __webpack_require__(5)('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0)
  , defined = __webpack_require__(19)
  , fails   = __webpack_require__(3)
  , spaces  = __webpack_require__(82)
  , space   = '[' + spaces + ']'
  , non     = '\u200b\u0085'
  , ltrim   = RegExp('^' + space + space + '*')
  , rtrim   = RegExp(space + space + '*$');

var exporter = function(KEY, exec, ALIAS){
  var exp   = {};
  var FORCE = fails(function(){
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if(ALIAS)exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function(string, TYPE){
  string = String(defined(string));
  if(TYPE & 1)string = string.replace(ltrim, '');
  if(TYPE & 2)string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(315);

var _utils = __webpack_require__(41);

var _consts = __webpack_require__(28);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Element = function () {
  function Element() {
    _classCallCheck(this, Element);

    this.tagName = {
      DIV: 'div',
      SPAN: 'span',
      INPUT: 'input',
      UL: 'ul',
      LI: 'li',
      TIME: 'time',
      LABEL: 'label',
      A: 'a',
      IMG: 'img'
    };
    this.eventName = {
      CLICK: 'click',
      KEYDOWN: 'keydown',
      KEYUP: 'keyup',
      CHANGE: 'change',
      SCROLL: 'scroll',
      PASTE: 'paste'
    };
  }

  /*
  Create Elements
   */


  _createClass(Element, [{
    key: 'createDiv',
    value: function createDiv() {
      return document.createElement(this.tagName.DIV);
    }
  }, {
    key: 'createTime',
    value: function createTime() {
      return document.createElement(this.tagName.TIME);
    }
  }, {
    key: 'createA',
    value: function createA() {
      return document.createElement(this.tagName.A);
    }
  }, {
    key: 'createImg',
    value: function createImg() {
      return document.createElement(this.tagName.IMG);
    }
  }, {
    key: 'createSpan',
    value: function createSpan() {
      return document.createElement(this.tagName.SPAN);
    }
  }, {
    key: 'createLabel',
    value: function createLabel() {
      return document.createElement(this.tagName.LABEL);
    }
  }, {
    key: 'createInput',
    value: function createInput() {
      return document.createElement(this.tagName.INPUT);
    }
  }, {
    key: 'createUl',
    value: function createUl() {
      return document.createElement(this.tagName.UL);
    }
  }, {
    key: 'createLi',
    value: function createLi() {
      return document.createElement(this.tagName.LI);
    }
  }, {
    key: '_setClass',
    value: function _setClass() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      args.reduce(function (target, classes) {
        return target.className += classes.join(' ');
      });
    }
  }, {
    key: '_setContent',
    value: function _setContent(target, text) {
      target.innerHTML = text;
    }
  }, {
    key: '_addContent',
    value: function _addContent(target, text) {
      target.innerHTML += text;
    }
  }, {
    key: '_setBackgroundImage',
    value: function _setBackgroundImage(target, url) {
      target.style.backgroundImage = 'url(' + url + ')';
    }
  }, {
    key: '_setBackgroundSize',
    value: function _setBackgroundSize(target, size) {
      target.style.backgroundSize = size;
    }
  }, {
    key: '_setFontSize',
    value: function _setFontSize(target, size) {
      target.style.fontSize = size ? size + 'px' : null;
    }
  }, {
    key: '_setHeight',
    value: function _setHeight(target, height) {
      target.style.height = height + 'px';
    }
  }, {
    key: '_setWidth',
    value: function _setWidth(target, width) {
      target.style.width = width + 'px';
    }
  }, {
    key: '_setRight',
    value: function _setRight(target, right) {
      target.style.right = right + 'px';
    }
  }, {
    key: '_setDataset',
    value: function _setDataset(target, name, data) {
      target.setAttribute('data-' + name, data);
    }
  }, {
    key: '_setClickEvent',
    value: function _setClickEvent() {
      var _this = this;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      args.reduce(function (target, action) {
        target.addEventListener(_this.eventName.CLICK, function () {
          action();
        });
      });
    }
  }, {
    key: '_setPasteEvent',
    value: function _setPasteEvent() {
      var _this2 = this;

      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      args.reduce(function (target, action) {
        target.addEventListener(_this2.eventName.PASTE, function (event) {
          action(event);
        });
      });
    }
  }, {
    key: '_setKeyupEvent',
    value: function _setKeyupEvent() {
      var _this3 = this;

      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      args.reduce(function (target, action) {
        target.addEventListener(_this3.eventName.KEYUP, function (event) {
          action(event);
        });
      });
    }
  }, {
    key: '_setKeydownEvent',
    value: function _setKeydownEvent() {
      var _this4 = this;

      for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      args.reduce(function (target, action) {
        target.addEventListener(_this4.eventName.KEYDOWN, function (event) {
          action(event);
        });
      });
    }
  }, {
    key: '_setChangeEvent',
    value: function _setChangeEvent() {
      var _this5 = this;

      for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      args.reduce(function (target, action) {
        target.addEventListener(_this5.eventName.CHANGE, function () {
          action();
        });
      });
    }
  }, {
    key: '_setScrollEvent',
    value: function _setScrollEvent() {
      var _this6 = this;

      for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }

      args.reduce(function (target, action) {
        target.addEventListener(_this6.eventName.SCROLL, function () {
          action();
        });
      });
    }
  }, {
    key: '_isBottom',
    value: function _isBottom(target, list) {
      return target.scrollTop + target.offsetHeight >= list.offsetHeight;
    }
  }, {
    key: 'enabledToggle',
    value: function enabledToggle(target, isEnabled) {
      if (isEnabled || isEnabled === undefined) {
        (0, _utils.removeClass)(target, _consts.className.DISABLED);
        target.style.cursor = _consts.styleValue.CURSOR_INIT;
      } else {
        (0, _utils.addClass)(target, _consts.className.DISABLED);
        target.style.cursor = _consts.styleValue.CURSOR_DEFAULT;
      }
    }
  }]);

  return Element;
}();

exports.default = Element;

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(18)
  , TAG = __webpack_require__(5)('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(18);
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ }),
/* 50 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(15)
  , toLength  = __webpack_require__(8)
  , toIndex   = __webpack_require__(39);
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global            = __webpack_require__(2)
  , $export           = __webpack_require__(0)
  , redefine          = __webpack_require__(13)
  , redefineAll       = __webpack_require__(37)
  , meta              = __webpack_require__(29)
  , forOf             = __webpack_require__(43)
  , anInstance        = __webpack_require__(32)
  , isObject          = __webpack_require__(4)
  , fails             = __webpack_require__(3)
  , $iterDetect       = __webpack_require__(57)
  , setToStringTag    = __webpack_require__(45)
  , inheritIfRequired = __webpack_require__(68);

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  var fixMethod = function(KEY){
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a){
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a){ fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b){ fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if(typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance             = new C
      // early implementations not supports chaining
      , HASNT_CHAINING       = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance
      // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
      , THROWS_ON_PRIMITIVES = fails(function(){ instance.has(1); })
      // most early implementations doesn't supports iterables, most modern - not close it correctly
      , ACCEPT_ITERABLES     = $iterDetect(function(iter){ new C(iter); }) // eslint-disable-line no-new
      // for early implementations -0 and +0 not the same
      , BUGGY_ZERO = !IS_WEAK && fails(function(){
        // V8 ~ Chromium 42- fails only with 5+ elements
        var $instance = new C()
          , index     = 5;
        while(index--)$instance[ADDER](index, index);
        return !$instance.has(-0);
      });
    if(!ACCEPT_ITERABLES){ 
      C = wrapper(function(target, iterable){
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base, target, C);
        if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if(THROWS_ON_PRIMITIVES || BUGGY_ZERO){
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if(BUGGY_ZERO || HASNT_CHAINING)fixMethod(ADDER);
    // weak collections should not contains .clear method
    if(IS_WEAK && proto.clear)delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var hide     = __webpack_require__(12)
  , redefine = __webpack_require__(13)
  , fails    = __webpack_require__(3)
  , defined  = __webpack_require__(19)
  , wks      = __webpack_require__(5);

module.exports = function(KEY, length, exec){
  var SYMBOL   = wks(KEY)
    , fns      = exec(defined, SYMBOL, ''[KEY])
    , strfn    = fns[0]
    , rxfn     = fns[1];
  if(fails(function(){
    var O = {};
    O[SYMBOL] = function(){ return 7; };
    return ''[KEY](O) != 7;
  })){
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function(string, arg){ return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function(string){ return rxfn.call(string, this); }
    );
  }
};

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__(1);
module.exports = function(){
  var that   = anObject(this)
    , result = '';
  if(that.global)     result += 'g';
  if(that.ignoreCase) result += 'i';
  if(that.multiline)  result += 'm';
  if(that.unicode)    result += 'u';
  if(that.sticky)     result += 'y';
  return result;
};

/***/ }),
/* 55 */
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__(4)
  , cof      = __webpack_require__(18)
  , MATCH    = __webpack_require__(5)('match');
module.exports = function(it){
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR     = __webpack_require__(5)('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

// Forced replacement prototype accessors methods
module.exports = __webpack_require__(33)|| !__webpack_require__(3)(function(){
  var K = Math.random();
  // In FF throws only define methods
  __defineSetter__.call(null, K, function(){ /* empty */});
  delete __webpack_require__(2)[K];
});

/***/ }),
/* 59 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2)
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2)
  , hide   = __webpack_require__(12)
  , uid    = __webpack_require__(40)
  , TYPED  = uid('typed_array')
  , VIEW   = uid('view')
  , ABV    = !!(global.ArrayBuffer && global.DataView)
  , CONSTR = ABV
  , i = 0, l = 9, Typed;

var TypedArrayConstructors = (
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
).split(',');

while(i < l){
  if(Typed = global[TypedArrayConstructors[i++]]){
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV:    ABV,
  CONSTR: CONSTR,
  TYPED:  TYPED,
  VIEW:   VIEW
};

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)

var toObject = __webpack_require__(9)
  , toIndex  = __webpack_require__(39)
  , toLength = __webpack_require__(8);
module.exports = function fill(value /*, start = 0, end = @length */){
  var O      = toObject(this)
    , length = toLength(O.length)
    , aLen   = arguments.length
    , index  = toIndex(aLen > 1 ? arguments[1] : undefined, length)
    , end    = aLen > 2 ? arguments[2] : undefined
    , endPos = end === undefined ? length : toIndex(end, length);
  while(endPos > index)O[index++] = value;
  return O;
};

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(7)
  , createDesc      = __webpack_require__(30);

module.exports = function(object, index, value){
  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4)
  , document = __webpack_require__(2).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ }),
/* 65 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var MATCH = __webpack_require__(5)('match');
module.exports = function(KEY){
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch(e){
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch(f){ /* empty */ }
  } return true;
};

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2).document && document.documentElement;

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var isObject       = __webpack_require__(4)
  , setPrototypeOf = __webpack_require__(76).set;
module.exports = function(that, target, C){
  var P, S = target.constructor;
  if(S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf){
    setPrototypeOf(that, P);
  } return that;
};

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators  = __webpack_require__(44)
  , ITERATOR   = __webpack_require__(5)('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(18);
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create         = __webpack_require__(34)
  , descriptor     = __webpack_require__(30)
  , setToStringTag = __webpack_require__(45)
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(12)(IteratorPrototype, __webpack_require__(5)('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY        = __webpack_require__(33)
  , $export        = __webpack_require__(0)
  , redefine       = __webpack_require__(13)
  , hide           = __webpack_require__(12)
  , has            = __webpack_require__(10)
  , Iterators      = __webpack_require__(44)
  , $iterCreate    = __webpack_require__(71)
  , setToStringTag = __webpack_require__(45)
  , getPrototypeOf = __webpack_require__(17)
  , ITERATOR       = __webpack_require__(5)('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

/***/ }),
/* 73 */
/***/ (function(module, exports) {

// 20.2.2.14 Math.expm1(x)
var $expm1 = Math.expm1;
module.exports = (!$expm1
  // Old FF bug
  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
  // Tor Browser bug
  || $expm1(-2e-17) != -2e-17
) ? function expm1(x){
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
} : $expm1;

/***/ }),
/* 74 */
/***/ (function(module, exports) {

// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x){
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(2)
  , macrotask = __webpack_require__(83).set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = __webpack_require__(18)(process) == 'process';

module.exports = function(){
  var head, last, notify;

  var flush = function(){
    var parent, fn;
    if(isNode && (parent = process.domain))parent.exit();
    while(head){
      fn   = head.fn;
      head = head.next;
      try {
        fn();
      } catch(e){
        if(head)notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if(parent)parent.enter();
  };

  // Node.js
  if(isNode){
    notify = function(){
      process.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if(Observer){
    var toggle = true
      , node   = document.createTextNode('');
    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
    notify = function(){
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if(Promise && Promise.resolve){
    var promise = Promise.resolve();
    notify = function(){
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function(){
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function(fn){
    var task = {fn: fn, next: undefined};
    if(last)last.next = task;
    if(!head){
      head = task;
      notify();
    } last = task;
  };
};

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(4)
  , anObject = __webpack_require__(1);
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = __webpack_require__(25)(Function.call, __webpack_require__(16).f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(60)('keys')
  , uid    = __webpack_require__(40);
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = __webpack_require__(1)
  , aFunction = __webpack_require__(11)
  , SPECIES   = __webpack_require__(5)('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(31)
  , defined   = __webpack_require__(19);
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

// helper for String#{startsWith, endsWith, includes}
var isRegExp = __webpack_require__(56)
  , defined  = __webpack_require__(19);

module.exports = function(that, searchString, NAME){
  if(isRegExp(searchString))throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toInteger = __webpack_require__(31)
  , defined   = __webpack_require__(19);

module.exports = function repeat(count){
  var str = String(defined(this))
    , res = ''
    , n   = toInteger(count);
  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
  return res;
};

/***/ }),
/* 82 */
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

var ctx                = __webpack_require__(25)
  , invoke             = __webpack_require__(55)
  , html               = __webpack_require__(67)
  , cel                = __webpack_require__(64)
  , global             = __webpack_require__(2)
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(__webpack_require__(18)(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global         = __webpack_require__(2)
  , DESCRIPTORS    = __webpack_require__(6)
  , LIBRARY        = __webpack_require__(33)
  , $typed         = __webpack_require__(61)
  , hide           = __webpack_require__(12)
  , redefineAll    = __webpack_require__(37)
  , fails          = __webpack_require__(3)
  , anInstance     = __webpack_require__(32)
  , toInteger      = __webpack_require__(31)
  , toLength       = __webpack_require__(8)
  , gOPN           = __webpack_require__(35).f
  , dP             = __webpack_require__(7).f
  , arrayFill      = __webpack_require__(62)
  , setToStringTag = __webpack_require__(45)
  , ARRAY_BUFFER   = 'ArrayBuffer'
  , DATA_VIEW      = 'DataView'
  , PROTOTYPE      = 'prototype'
  , WRONG_LENGTH   = 'Wrong length!'
  , WRONG_INDEX    = 'Wrong index!'
  , $ArrayBuffer   = global[ARRAY_BUFFER]
  , $DataView      = global[DATA_VIEW]
  , Math           = global.Math
  , RangeError     = global.RangeError
  , Infinity       = global.Infinity
  , BaseBuffer     = $ArrayBuffer
  , abs            = Math.abs
  , pow            = Math.pow
  , floor          = Math.floor
  , log            = Math.log
  , LN2            = Math.LN2
  , BUFFER         = 'buffer'
  , BYTE_LENGTH    = 'byteLength'
  , BYTE_OFFSET    = 'byteOffset'
  , $BUFFER        = DESCRIPTORS ? '_b' : BUFFER
  , $LENGTH        = DESCRIPTORS ? '_l' : BYTE_LENGTH
  , $OFFSET        = DESCRIPTORS ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
var packIEEE754 = function(value, mLen, nBytes){
  var buffer = Array(nBytes)
    , eLen   = nBytes * 8 - mLen - 1
    , eMax   = (1 << eLen) - 1
    , eBias  = eMax >> 1
    , rt     = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0
    , i      = 0
    , s      = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0
    , e, m, c;
  value = abs(value)
  if(value != value || value === Infinity){
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if(value * (c = pow(2, -e)) < 1){
      e--;
      c *= 2;
    }
    if(e + eBias >= 1){
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if(value * c >= 2){
      e++;
      c /= 2;
    }
    if(e + eBias >= eMax){
      m = 0;
      e = eMax;
    } else if(e + eBias >= 1){
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for(; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
  e = e << mLen | m;
  eLen += mLen;
  for(; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
  buffer[--i] |= s * 128;
  return buffer;
};
var unpackIEEE754 = function(buffer, mLen, nBytes){
  var eLen  = nBytes * 8 - mLen - 1
    , eMax  = (1 << eLen) - 1
    , eBias = eMax >> 1
    , nBits = eLen - 7
    , i     = nBytes - 1
    , s     = buffer[i--]
    , e     = s & 127
    , m;
  s >>= 7;
  for(; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for(; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
  if(e === 0){
    e = 1 - eBias;
  } else if(e === eMax){
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  } return (s ? -1 : 1) * m * pow(2, e - mLen);
};

var unpackI32 = function(bytes){
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
};
var packI8 = function(it){
  return [it & 0xff];
};
var packI16 = function(it){
  return [it & 0xff, it >> 8 & 0xff];
};
var packI32 = function(it){
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
};
var packF64 = function(it){
  return packIEEE754(it, 52, 8);
};
var packF32 = function(it){
  return packIEEE754(it, 23, 4);
};

var addGetter = function(C, key, internal){
  dP(C[PROTOTYPE], key, {get: function(){ return this[internal]; }});
};

var get = function(view, bytes, index, isLittleEndian){
  var numIndex = +index
    , intIndex = toInteger(numIndex);
  if(numIndex != intIndex || intIndex < 0 || intIndex + bytes > view[$LENGTH])throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b
    , start = intIndex + view[$OFFSET]
    , pack  = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
};
var set = function(view, bytes, index, conversion, value, isLittleEndian){
  var numIndex = +index
    , intIndex = toInteger(numIndex);
  if(numIndex != intIndex || intIndex < 0 || intIndex + bytes > view[$LENGTH])throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b
    , start = intIndex + view[$OFFSET]
    , pack  = conversion(+value);
  for(var i = 0; i < bytes; i++)store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
};

var validateArrayBufferArguments = function(that, length){
  anInstance(that, $ArrayBuffer, ARRAY_BUFFER);
  var numberLength = +length
    , byteLength   = toLength(numberLength);
  if(numberLength != byteLength)throw RangeError(WRONG_LENGTH);
  return byteLength;
};

if(!$typed.ABV){
  $ArrayBuffer = function ArrayBuffer(length){
    var byteLength = validateArrayBufferArguments(this, length);
    this._b       = arrayFill.call(Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength){
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH]
      , offset       = toInteger(byteOffset);
    if(offset < 0 || offset > bufferLength)throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if(offset + byteLength > bufferLength)throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if(DESCRIPTORS){
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset){
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset){
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /*, littleEndian */){
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /*, littleEndian */){
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /*, littleEndian */){
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /*, littleEndian */){
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /*, littleEndian */){
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /*, littleEndian */){
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value){
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value){
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /*, littleEndian */){
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /*, littleEndian */){
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /*, littleEndian */){
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if(!fails(function(){
    new $ArrayBuffer;     // eslint-disable-line no-new
  }) || !fails(function(){
    new $ArrayBuffer(.5); // eslint-disable-line no-new
  })){
    $ArrayBuffer = function ArrayBuffer(length){
      return new BaseBuffer(validateArrayBufferArguments(this, length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for(var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j; ){
      if(!((key = keys[j++]) in $ArrayBuffer))hide($ArrayBuffer, key, BaseBuffer[key]);
    };
    if(!LIBRARY)ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2))
    , $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if(view.getInt8(0) || !view.getInt8(1))redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value){
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value){
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

var global         = __webpack_require__(2)
  , core           = __webpack_require__(24)
  , LIBRARY        = __webpack_require__(33)
  , wksExt         = __webpack_require__(112)
  , defineProperty = __webpack_require__(7).f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(48)
  , ITERATOR  = __webpack_require__(5)('iterator')
  , Iterators = __webpack_require__(44);
module.exports = __webpack_require__(24).getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(42)
  , step             = __webpack_require__(100)
  , Iterators        = __webpack_require__(44)
  , toIObject        = __webpack_require__(15);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(72)(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

/***/ }),
/* 88 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

var cof = __webpack_require__(18);
module.exports = function(it, msg){
  if(typeof it != 'number' && cof(it) != 'Number')throw TypeError(msg);
  return +it;
};

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)

var toObject = __webpack_require__(9)
  , toIndex  = __webpack_require__(39)
  , toLength = __webpack_require__(8);

module.exports = [].copyWithin || function copyWithin(target/*= 0*/, start/*= 0, end = @length*/){
  var O     = toObject(this)
    , len   = toLength(O.length)
    , to    = toIndex(target, len)
    , from  = toIndex(start, len)
    , end   = arguments.length > 2 ? arguments[2] : undefined
    , count = Math.min((end === undefined ? len : toIndex(end, len)) - from, len - to)
    , inc   = 1;
  if(from < to && to < from + count){
    inc  = -1;
    from += count - 1;
    to   += count - 1;
  }
  while(count-- > 0){
    if(from in O)O[to] = O[from];
    else delete O[to];
    to   += inc;
    from += inc;
  } return O;
};

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

var forOf = __webpack_require__(43);

module.exports = function(iter, ITERATOR){
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

var aFunction = __webpack_require__(11)
  , toObject  = __webpack_require__(9)
  , IObject   = __webpack_require__(49)
  , toLength  = __webpack_require__(8);

module.exports = function(that, callbackfn, aLen, memo, isRight){
  aFunction(callbackfn);
  var O      = toObject(that)
    , self   = IObject(O)
    , length = toLength(O.length)
    , index  = isRight ? length - 1 : 0
    , i      = isRight ? -1 : 1;
  if(aLen < 2)for(;;){
    if(index in self){
      memo = self[index];
      index += i;
      break;
    }
    index += i;
    if(isRight ? index < 0 : length <= index){
      throw TypeError('Reduce of empty array with no initial value');
    }
  }
  for(;isRight ? index >= 0 : length > index; index += i)if(index in self){
    memo = callbackfn(memo, self[index], index, O);
  }
  return memo;
};

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var aFunction  = __webpack_require__(11)
  , isObject   = __webpack_require__(4)
  , invoke     = __webpack_require__(55)
  , arraySlice = [].slice
  , factories  = {};

var construct = function(F, len, args){
  if(!(len in factories)){
    for(var n = [], i = 0; i < len; i++)n[i] = 'a[' + i + ']';
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /*, args... */){
  var fn       = aFunction(this)
    , partArgs = arraySlice.call(arguments, 1);
  var bound = function(/* args... */){
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if(isObject(fn.prototype))bound.prototype = fn.prototype;
  return bound;
};

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var dP          = __webpack_require__(7).f
  , create      = __webpack_require__(34)
  , redefineAll = __webpack_require__(37)
  , ctx         = __webpack_require__(25)
  , anInstance  = __webpack_require__(32)
  , defined     = __webpack_require__(19)
  , forOf       = __webpack_require__(43)
  , $iterDefine = __webpack_require__(72)
  , step        = __webpack_require__(100)
  , setSpecies  = __webpack_require__(38)
  , DESCRIPTORS = __webpack_require__(6)
  , fastKey     = __webpack_require__(29).fastKey
  , SIZE        = DESCRIPTORS ? '_s' : 'size';

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      anInstance(that, C, NAME, '_i');
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        anInstance(this, C, 'forEach');
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(DESCRIPTORS)dP(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = __webpack_require__(48)
  , from    = __webpack_require__(91);
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var redefineAll       = __webpack_require__(37)
  , getWeak           = __webpack_require__(29).getWeak
  , anObject          = __webpack_require__(1)
  , isObject          = __webpack_require__(4)
  , anInstance        = __webpack_require__(32)
  , forOf             = __webpack_require__(43)
  , createArrayMethod = __webpack_require__(21)
  , $has              = __webpack_require__(10)
  , arrayFind         = createArrayMethod(5)
  , arrayFindIndex    = createArrayMethod(6)
  , id                = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function(that){
  return that._l || (that._l = new UncaughtFrozenStore);
};
var UncaughtFrozenStore = function(){
  this.a = [];
};
var findUncaughtFrozen = function(store, key){
  return arrayFind(store.a, function(it){
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function(key){
    var entry = findUncaughtFrozen(this, key);
    if(entry)return entry[1];
  },
  has: function(key){
    return !!findUncaughtFrozen(this, key);
  },
  set: function(key, value){
    var entry = findUncaughtFrozen(this, key);
    if(entry)entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function(key){
    var index = arrayFindIndex(this.a, function(it){
      return it[0] === key;
    });
    if(~index)this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      anInstance(that, C, NAME, '_i');
      that._i = id++;      // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function(key){
        if(!isObject(key))return false;
        var data = getWeak(key);
        if(data === true)return uncaughtFrozenStore(this)['delete'](key);
        return data && $has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key){
        if(!isObject(key))return false;
        var data = getWeak(key);
        if(data === true)return uncaughtFrozenStore(this).has(key);
        return data && $has(data, this._i);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var data = getWeak(anObject(key), true);
    if(data === true)uncaughtFrozenStore(that).set(key, value);
    else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(6) && !__webpack_require__(3)(function(){
  return Object.defineProperty(__webpack_require__(64)('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var isObject = __webpack_require__(4)
  , floor    = Math.floor;
module.exports = function isInteger(it){
  return !isObject(it) && isFinite(it) && floor(it) === it;
};

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(1);
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};

/***/ }),
/* 100 */
/***/ (function(module, exports) {

module.exports = function(done, value){
  return {value: value, done: !!done};
};

/***/ }),
/* 101 */
/***/ (function(module, exports) {

// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x){
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys  = __webpack_require__(36)
  , gOPS     = __webpack_require__(59)
  , pIE      = __webpack_require__(50)
  , toObject = __webpack_require__(9)
  , IObject  = __webpack_require__(49)
  , $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(3)(function(){
  var A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , aLen  = arguments.length
    , index = 1
    , getSymbols = gOPS.f
    , isEnum     = pIE.f;
  while(aLen > index){
    var S      = IObject(arguments[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  } return T;
} : $assign;

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

var dP       = __webpack_require__(7)
  , anObject = __webpack_require__(1)
  , getKeys  = __webpack_require__(36);

module.exports = __webpack_require__(6) ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(15)
  , gOPN      = __webpack_require__(35).f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

var has          = __webpack_require__(10)
  , toIObject    = __webpack_require__(15)
  , arrayIndexOf = __webpack_require__(51)(false)
  , IE_PROTO     = __webpack_require__(77)('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

var getKeys   = __webpack_require__(36)
  , toIObject = __webpack_require__(15)
  , isEnum    = __webpack_require__(50).f;
module.exports = function(isEntries){
  return function(it){
    var O      = toIObject(it)
      , keys   = getKeys(O)
      , length = keys.length
      , i      = 0
      , result = []
      , key;
    while(length > i)if(isEnum.call(O, key = keys[i++])){
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

// all object keys, includes non-enumerable and symbols
var gOPN     = __webpack_require__(35)
  , gOPS     = __webpack_require__(59)
  , anObject = __webpack_require__(1)
  , Reflect  = __webpack_require__(2).Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it){
  var keys       = gOPN.f(anObject(it))
    , getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

var $parseFloat = __webpack_require__(2).parseFloat
  , $trim       = __webpack_require__(46).trim;

module.exports = 1 / $parseFloat(__webpack_require__(82) + '-0') !== -Infinity ? function parseFloat(str){
  var string = $trim(String(str), 3)
    , result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

var $parseInt = __webpack_require__(2).parseInt
  , $trim     = __webpack_require__(46).trim
  , ws        = __webpack_require__(82)
  , hex       = /^[\-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix){
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;

/***/ }),
/* 110 */
/***/ (function(module, exports) {

// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-string-pad-start-end
var toLength = __webpack_require__(8)
  , repeat   = __webpack_require__(81)
  , defined  = __webpack_require__(19);

module.exports = function(that, maxLength, fillString, left){
  var S            = String(defined(that))
    , stringLength = S.length
    , fillStr      = fillString === undefined ? ' ' : String(fillString)
    , intMaxLength = toLength(maxLength);
  if(intMaxLength <= stringLength || fillStr == '')return S;
  var fillLen = intMaxLength - stringLength
    , stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if(stringFiller.length > fillLen)stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(5);

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(94);

// 23.1 Map Objects
module.exports = __webpack_require__(52)('Map', function(get){
  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

// 21.2.5.3 get RegExp.prototype.flags()
if(__webpack_require__(6) && /./g.flags != 'g')__webpack_require__(7).f(RegExp.prototype, 'flags', {
  configurable: true,
  get: __webpack_require__(54)
});

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(94);

// 23.2 Set Objects
module.exports = __webpack_require__(52)('Set', function(get){
  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var each         = __webpack_require__(21)(0)
  , redefine     = __webpack_require__(13)
  , meta         = __webpack_require__(29)
  , assign       = __webpack_require__(102)
  , weak         = __webpack_require__(96)
  , isObject     = __webpack_require__(4)
  , getWeak      = meta.getWeak
  , isExtensible = Object.isExtensible
  , uncaughtFrozenStore = weak.ufstore
  , tmp          = {}
  , InternalMap;

var wrapper = function(get){
  return function WeakMap(){
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key){
    if(isObject(key)){
      var data = getWeak(key);
      if(data === true)return uncaughtFrozenStore(this).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value){
    return weak.def(this, key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = __webpack_require__(52)('WeakMap', wrapper, methods, weak, true, true);

// IE11 WeakMap frozen keys fix
if(new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7){
  InternalMap = weak.getConstructor(wrapper);
  assign(InternalMap.prototype, methods);
  meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function(key){
    var proto  = $WeakMap.prototype
      , method = proto[key];
    redefine(proto, key, function(a, b){
      // store frozen objects on internal weakmap shim
      if(isObject(a) && !isExtensible(a)){
        if(!this._f)this._f = new InternalMap;
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _widgetBtn = __webpack_require__(123);

var _widgetBtn2 = _interopRequireDefault(_widgetBtn);

var _listBoard = __webpack_require__(120);

var _listBoard2 = _interopRequireDefault(_listBoard);

var _chatSection = __webpack_require__(119);

var _chatSection2 = _interopRequireDefault(_chatSection);

var _popup = __webpack_require__(121);

var _popup2 = _interopRequireDefault(_popup);

var _spinner2 = __webpack_require__(122);

var _spinner3 = _interopRequireDefault(_spinner2);

var _sendbird = __webpack_require__(124);

var _sendbird2 = _interopRequireDefault(_sendbird);

var _utils = __webpack_require__(41);

var _consts = __webpack_require__(28);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WIDGET_ID = 'sb_widget';
var TIME_STRING_TODAY = 'TODAY';
var TIME_MESSAGE_TYPE = 'time';
var NEW_CHAT_BOARD_ID = 'NEW_CHAT';
var KEY_DOWN_ENTER = 13;
var KEY_DOWN_KR = 229;
var CHAT_BOARD_WIDTH = 300;
var ERROR_MESSAGE = 'Please create "sb_widget" element on first.';
var ERROR_MESSAGE_SDK = 'Please import "SendBird SDK" on first.';
var EVENT_TYPE_CLICK = 'click';

window.WebFontConfig = {
  google: { families: ['Lato:400,700'] }
};

var SBWidget = function () {
  function SBWidget() {
    _classCallCheck(this, SBWidget);
  }

  _createClass(SBWidget, [{
    key: 'start',
    value: function start(appId) {
      var _this = this;

      if (!window.SendBird) {
        console.error(ERROR_MESSAGE_SDK);
        return;
      }
      this._getGoogleFont();
      this.widget = document.getElementById(WIDGET_ID);
      if (this.widget) {
        document.addEventListener(EVENT_TYPE_CLICK, function (event) {
          _this._initClickEvent(event);
        });
        this._init();
        this._start(appId);
      } else {
        console.error(ERROR_MESSAGE);
      }
    }
  }, {
    key: 'startWithConnect',
    value: function startWithConnect(appId, userId, nickname, callback) {
      var _this2 = this;

      if (!window.SendBird) {
        console.error(ERROR_MESSAGE_SDK);
        return;
      }
      this._getGoogleFont();
      this.widget = document.getElementById(WIDGET_ID);
      if (this.widget) {
        document.addEventListener(EVENT_TYPE_CLICK, function (event) {
          _this2._initClickEvent(event);
        });
        this._init();
        this._start(appId);
        this._connect(userId, nickname, callback);
      } else {
        console.error(ERROR_MESSAGE);
      }
    }
  }, {
    key: '_initClickEvent',
    value: function _initClickEvent(event) {
      var _checkPopup = function _checkPopup(_target, obj) {
        if (obj === _target || (0, _utils.hasClass)(_target, _consts.className.IC_MEMBERS) || (0, _utils.hasClass)(_target, _consts.className.IC_INVITE)) {
          return true;
        } else {
          var returnedCheck = false;
          for (var i = 0; i < obj.childNodes.length; i++) {
            returnedCheck = _checkPopup(_target, obj.childNodes[i]);
            if (returnedCheck) break;
          }
          return returnedCheck;
        }
      };

      if (!_checkPopup(event.target, this.popup.memberPopup)) {
        this.closeMemberPopup();
      }
      if (!_checkPopup(event.target, this.popup.invitePopup)) {
        this.closeInvitePopup();
      }
    }
  }, {
    key: '_init',
    value: function _init() {
      this.spinner = new _spinner3.default();

      this.widgetBtn = new _widgetBtn2.default(this.widget);
      this.listBoard = new _listBoard2.default(this.widget);
      this.chatSection = new _chatSection2.default(this.widget);
      this.popup = new _popup2.default();

      this.activeChannelSetList = [];
      this.extraChannelSetList = [];

      this.timeMessage = function () {
        function TimeMessage(date) {
          _classCallCheck(this, TimeMessage);

          this.time = date;
          this.type = TIME_MESSAGE_TYPE;
        }

        _createClass(TimeMessage, [{
          key: 'isTimeMessage',
          value: function isTimeMessage() {
            return this.type == TIME_MESSAGE_TYPE;
          }
        }]);

        return TimeMessage;
      }();
    }
  }, {
    key: '_getGoogleFont',
    value: function _getGoogleFont() {
      var wf = document.createElement('script');
      wf.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js';
      wf.type = 'text/javascript';
      wf.async = 'true';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(wf, s);
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.extraChannelSetList = [];
      for (var i = 0; i < this.activeChannelSetList.length; i++) {
        var channelSet = this.activeChannelSetList[i];
        var targetBoard = this.chatSection.getChatBoard(channelSet.channel.url);
        if (targetBoard) {
          this.chatSection.closeChatBoard(targetBoard);
        }
      }
      this.activeChannelSetList = [];
      this.closePopup();

      this.sb.reset();
      this.listBoard.reset();
      this.widgetBtn.reset();
    }
  }, {
    key: 'responsiveChatSection',
    value: function responsiveChatSection(channelUrl, isShow) {
      var _bodyWidth = document.getElementsByTagName('BODY')[0].offsetWidth - 360;
      var maxSize = parseInt(_bodyWidth / CHAT_BOARD_WIDTH);
      var currentSize = this.activeChannelSetList.length;
      if (currentSize >= maxSize) {
        var extraChannelSet = (0, _utils.getLastItem)(this.activeChannelSetList);
        if (extraChannelSet) {
          if (this.extraChannelSetList.indexOf(extraChannelSet.channel.url) < 0) {
            this.extraChannelSetList.push(extraChannelSet.channel.url);
          }
          var chatBoard = this.chatSection.getChatBoard(extraChannelSet.channel.url);
          if (chatBoard) {
            this.chatSection.closeChatBoard(chatBoard);
          }
          this.removeChannelSet(extraChannelSet.channel);
        }
        if (channelUrl) {
          var idx = this.extraChannelSetList.indexOf(channelUrl);
          if (idx > -1) {
            this.extraChannelSetList.splice(idx, 1);
          }
        }
        this.chatSection.setWidth(maxSize * CHAT_BOARD_WIDTH);
      } else {
        var popChannelUrl = this.extraChannelSetList.pop();
        if (popChannelUrl) {
          this._connectChannel(popChannelUrl, true);
          this.chatSection.setWidth((currentSize + 1) * CHAT_BOARD_WIDTH);
        } else {
          if (isShow) {
            currentSize += 1;
          }
          this.chatSection.setWidth(currentSize * CHAT_BOARD_WIDTH);
        }
      }
    }
  }, {
    key: '_start',
    value: function _start(appId) {
      var _this3 = this;

      this.sb = new _sendbird2.default(appId);

      this.popup.addCloseBtnClickEvent(function () {
        _this3.closePopup();
      });

      this.widgetBtn.addClickEvent(function () {
        _this3.sb.isConnected() ? _this3.listBoard.showChannelList() : _this3.listBoard.showLoginForm();
        _this3.toggleBoard(true);
        _this3.listBoard.addChannelListScrollEvent(function () {
          _this3.getChannelList();
        });
        _this3.chatSection.responsiveSize(false, _this3.responsiveChatSection.bind(_this3));
      });

      this.listBoard.addNewChatClickEvent(function () {
        _this3.listBoard.hideLogoutBtn();

        var chatBoard = _this3.chatSection.createChatBoard(NEW_CHAT_BOARD_ID);
        _this3.responsiveChatSection(null, true);

        _this3.chatSection.createNewChatBoard(chatBoard);
        _this3.chatSection.addClickEvent(chatBoard.startBtn, function () {
          if (!(0, _utils.hasClass)(chatBoard.startBtn, _consts.className.DISABLED)) {
            (0, _utils.addClass)(chatBoard.startBtn, _consts.className.DISABLED);
            _this3.sb.userListQuery = null;
            _this3.spinner.insert(chatBoard.startBtn);
            var selectedUserIds = _this3.chatSection.getSelectedUserIds(chatBoard.userContent);
            _this3.sb.createNewChannel(selectedUserIds, function (channel) {
              chatBoard.parentNode.removeChild(chatBoard);
              _this3._connectChannel(channel.url, true);
              _this3.listBoard.checkEmptyList();
            });
          }
        });
        _this3.spinner.insert(chatBoard.userContent);

        _this3.sb.getUserList(function (userList) {
          _this3.spinner.remove(chatBoard.userContent);
          _this3.setUserList(chatBoard, userList);
        });

        _this3.chatSection.addClickEvent(chatBoard.closeBtn, function () {
          _this3.chatSection.closeChatBoard(chatBoard);
          _this3.closePopup();
          _this3.responsiveChatSection();
        });
        (0, _utils.hide)(chatBoard.leaveBtn);
        (0, _utils.hide)(chatBoard.memberBtn);
        (0, _utils.hide)(chatBoard.inviteBtn);
      });

      this.listBoard.addMinimizeClickEvent(function () {
        _this3.listBoard.hideLogoutBtn();
        _this3.closePopup();
        _this3.toggleBoard(false);
        _this3.chatSection.responsiveSize(true, _this3.responsiveChatSection.bind(_this3));
      });

      this.listBoard.addLogoutClickEvent(function () {
        _this3.sb.disconnect(function () {
          _this3.sb.reset();
          _this3.toggleBoard(false);
          _this3.widgetBtn.toggleIcon(false);
          _this3.listBoard.setOptionEventLock(false);
          _this3.chatSection.reset();
          _this3.reset();
        });
      });

      this.listBoard.addLoginClickEvent(function () {
        if (!(0, _utils.hasClass)(_this3.listBoard.btnLogin, _consts.className.DISABLED)) {
          _this3.spinner.insert(_this3.listBoard.btnLogin);
          _this3.listBoard.enabledToggle(_this3.listBoard.btnLogin, false);
          _this3.listBoard.userId.disabled = true;
          _this3.listBoard.nickname.disabled = true;

          _this3._connect(_this3.listBoard.getUserId(), _this3.listBoard.getNickname());
        }
      });
      this.listBoard.addKeyDownEvent(this.listBoard.nickname, function (event) {
        if (event.keyCode == KEY_DOWN_ENTER) {
          _this3.listBoard.btnLogin.click();
        }
      });
    }
  }, {
    key: '_connect',
    value: function _connect(userId, nickname, callback) {
      var _this4 = this;

      this.sb.connect(userId, nickname, function () {
        _this4.widgetBtn.toggleIcon(true);

        _this4.listBoard.showChannelList();
        _this4.spinner.insert(_this4.listBoard.list);
        _this4.getChannelList();

        _this4.sb.createHandlerGlobal(function (channel, message) {
          _this4.messageReceivedAction(channel, message);
        }, function (channel) {
          _this4.updateUnreadMessageCount(channel);
        }, function (channel) {
          var targetBoard = _this4.chatSection.getChatBoard(channel.url);
          if (targetBoard) {
            var isBottom = _this4.chatSection.isBottom(targetBoard.messageContent, targetBoard.list);
            _this4.chatSection.showTyping(channel, _this4.spinner);
            _this4.chatSection.responsiveHeight(channel.url);
            if (isBottom) {
              _this4.chatSection.scrollToBottom(targetBoard.messageContent);
            }
          }
        }, function (channel) {
          var targetBoard = _this4.chatSection.getChatBoard(channel.url);
          if (targetBoard) {
            var channelSet = _this4.getChannelSet(channel.url);
            if (channelSet) {
              _this4.chatSection.updateReadReceipt(channelSet, targetBoard);
            }
          }
        }, function (channel, user) {
          if (_this4.sb.isCurrentUser(user)) {
            var item = _this4.listBoard.getChannelItem(channel.url);
            _this4.listBoard.list.removeChild(item);
            _this4.listBoard.checkEmptyList();
          } else {
            _this4.listBoard.setChannelTitle(channel.url, _this4.sb.getNicknamesString(channel));
            _this4.updateUnreadMessageCount(channel);
            var targetChatBoard = _this4.chatSection.getChatBoard(channel.url);
            if (targetChatBoard) {
              _this4.updateChannelInfo(targetChatBoard, channel);
            }
          }
        }, function (channel, user) {
          _this4.listBoard.setChannelTitle(channel.url, _this4.sb.getNicknamesString(channel));
          var targetChatBoard = _this4.chatSection.getChatBoard(channel.url);
          if (targetChatBoard) {
            _this4.updateChannelInfo(targetChatBoard, channel);
          }
        });

        if (callback) callback();
      });
    }
  }, {
    key: 'messageReceivedAction',
    value: function messageReceivedAction(channel, message) {
      var target = this.listBoard.getChannelItem(channel.url);
      if (!target) {
        target = this.createChannelItem(channel);
        this.listBoard.checkEmptyList();
      }
      this.listBoard.addListOnFirstIndex(target);

      this.listBoard.setChannelLastMessage(channel.url, message.isFileMessage() ? message.name : message.message);
      this.listBoard.setChannelLastMessageTime(channel.url, this.sb.getMessageTime(message));

      var targetBoard = this.chatSection.getChatBoard(channel.url);
      if (targetBoard) {
        var isBottom = this.chatSection.isBottom(targetBoard.messageContent, targetBoard.list);
        var channelSet = this.getChannelSet(channel.url);
        var lastMessage = (0, _utils.getLastItem)(channelSet.message);
        channelSet.message.push(message);
        this.setMessageItem(channelSet.channel, targetBoard, [message], false, isBottom, lastMessage);
        channel.markAsRead();
        this.updateUnreadMessageCount(channel);
      }
    }
  }, {
    key: 'setUserList',
    value: function setUserList(target, userList) {
      var _this5 = this;

      var userContent = target.userContent;
      this.chatSection.createUserList(userContent);
      for (var i = 0; i < userList.length; i++) {
        var user = userList[i];
        if (!this.sb.isCurrentUser(user)) {
          (function () {
            var item = _this5.chatSection.createUserListItem(user);
            _this5.chatSection.addClickEvent(item, function () {
              (0, _utils.hasClass)(item.select, _consts.className.ACTIVE) ? (0, _utils.removeClass)(item.select, _consts.className.ACTIVE) : (0, _utils.addClass)(item.select, _consts.className.ACTIVE);
              var selectedUserCount = _this5.chatSection.getSelectedUserIds(userContent.list).length;
              _this5.chatSection.updateChatTop(target, selectedUserCount > 9 ? _consts.MAX_COUNT : selectedUserCount.toString(), null);
              selectedUserCount > 0 ? (0, _utils.removeClass)(target.startBtn, _consts.className.DISABLED) : (0, _utils.addClass)(target.startBtn, _consts.className.DISABLED);
            });
            userContent.list.appendChild(item);
          })();
        }
      }
      this.chatSection.addUserListScrollEvent(target, function () {
        _this5.sb.getUserList(function (userList) {
          _this5.setUserList(target, userList);
        });
      });
    }
  }, {
    key: 'getChannelList',
    value: function getChannelList() {
      var _this6 = this;

      var _list = this.listBoard.list;
      var _spinner = this.spinner;
      this.sb.getChannelList(function (channelList) {
        if (_list.lastElementChild == _spinner.self) {
          _spinner.remove(_list);
        }
        channelList.forEach(function (channel) {
          var item = _this6.createChannelItem(channel);
          _list.appendChild(item);
        });
        _this6.updateUnreadMessageCount();
        _this6.listBoard.checkEmptyList();
      });
    }
  }, {
    key: 'createChannelItem',
    value: function createChannelItem(channel) {
      var _this7 = this;

      var item = this.listBoard.createChannelItem(channel.url, channel.coverUrl, this.sb.getNicknamesString(channel), this.sb.getMessageTime(channel.lastMessage), this.sb.getLastMessage(channel), this.sb.getChannelUnreadCount(channel));
      this.listBoard.addChannelClickEvent(item, function () {
        _this7.closePopup();
        var channelUrl = item.getAttribute('data-channel-url');
        var openChatBoard = _this7.chatSection.getChatBoard(channelUrl);
        if (!openChatBoard) {
          var newChat = _this7.chatSection.getChatBoard(NEW_CHAT_BOARD_ID);
          if (newChat) {
            _this7.chatSection.closeChatBoard(newChat);
          }
          _this7._connectChannel(channelUrl);
        }
      });
      return item;
    }
  }, {
    key: 'closePopup',
    value: function closePopup() {
      this.closeMemberPopup();
      this.closeInvitePopup();
    }
  }, {
    key: 'closeMemberPopup',
    value: function closeMemberPopup() {
      this.chatSection.removeMemberPopup();
      this.popup.closeMemberPopup();
    }
  }, {
    key: 'closeInvitePopup',
    value: function closeInvitePopup() {
      this.chatSection.removeInvitePopup();
      this.popup.closeInvitePopup();
      this.sb.userListQuery = null;
    }
  }, {
    key: 'showChannel',
    value: function showChannel(channelUrl) {
      this._connectChannel(channelUrl, false);
    }
  }, {
    key: '_connectChannel',
    value: function _connectChannel(channelUrl, doNotCall) {
      var _this8 = this;

      var chatBoard = this.chatSection.createChatBoard(channelUrl, doNotCall);
      if (!doNotCall) {
        this.responsiveChatSection(channelUrl, true);
      }
      this.chatSection.addClickEvent(chatBoard.closeBtn, function () {
        _this8.chatSection.closeChatBoard(chatBoard);
        _this8.closePopup();
        _this8.removeChannelSet(channelUrl);
        _this8.responsiveChatSection();
      });
      this.chatSection.addClickEvent(chatBoard.leaveBtn, function () {
        _this8.chatSection.addLeavePopup(chatBoard);
        _this8.chatSection.setLeaveBtnClickEvent(chatBoard.leavePopup.leaveBtn, function () {
          _this8.spinner.insert(chatBoard.leavePopup.leaveBtn);
          (0, _utils.addClass)(chatBoard.leavePopup.leaveBtn, _consts.className.DISABLED);
          var channelSet = _this8.getChannelSet(channelUrl);
          if (channelSet) {
            _this8.sb.channelLeave(channelSet.channel, function () {
              chatBoard.removeChild(chatBoard.leavePopup);
              (0, _utils.removeClass)(chatBoard.leavePopup.leaveBtn, _consts.className.DISABLED);
              chatBoard.leavePopup = null;
              chatBoard.closeBtn.click();
            });
          } else {
            _this8.chatSection.closeChatBoard(chatBoard);
          }
        });
      });
      this.chatSection.addClickEvent(chatBoard.memberBtn, function () {
        if ((0, _utils.hasClass)(chatBoard.memberBtn, _consts.className.ACTIVE)) {
          _this8.closeMemberPopup();
        } else {
          _this8.closeMemberPopup();
          _this8.closeInvitePopup();
          (0, _utils.addClass)(chatBoard.memberBtn, _consts.className.ACTIVE);
          var index = _this8.chatSection.indexOfChatBord(channelUrl);
          _this8.popup.showMemberPopup(_this8.chatSection.self, index);
          var channelSet = _this8.getChannelSet(channelUrl);
          _this8.popup.updateCount(_this8.popup.memberPopup.count, channelSet.channel.memberCount);
          for (var i = 0; i < channelSet.channel.members.length; i++) {
            var member = channelSet.channel.members[i];
            var item = _this8.popup.createMemberItem(member, false, _this8.sb.isCurrentUser(member));
            _this8.popup.memberPopup.list.appendChild(item);
          }
        }
      });
      this.chatSection.addClickEvent(chatBoard.inviteBtn, function () {
        var _getUserList = function _getUserList(memberIds, loadmore) {
          _this8.sb.getUserList(function (userList) {
            if (!loadmore) {
              _this8.spinner.remove(_this8.popup.invitePopup.list);
            }
            for (var i = 0; i < userList.length; i++) {
              var user = userList[i];
              if (memberIds.indexOf(user.userId) < 0) {
                (function () {
                  var item = _this8.popup.createMemberItem(user, true);
                  _this8.popup.addClickEvent(item, function () {
                    (0, _utils.hasClass)(item.select, _consts.className.ACTIVE) ? (0, _utils.removeClass)(item.select, _consts.className.ACTIVE) : (0, _utils.addClass)(item.select, _consts.className.ACTIVE);
                    var selectedUserCount = _this8.popup.getSelectedUserIds(_this8.popup.invitePopup.list).length;
                    _this8.popup.updateCount(_this8.popup.invitePopup.count, selectedUserCount);
                    selectedUserCount > 0 ? (0, _utils.removeClass)(_this8.popup.invitePopup.inviteBtn, _consts.className.DISABLED) : (0, _utils.addClass)(_this8.popup.invitePopup.inviteBtn, _consts.className.DISABLED);
                  });
                  _this8.popup.invitePopup.list.appendChild(item);
                })();
              }
            }
          });
        };

        if ((0, _utils.hasClass)(chatBoard.inviteBtn, _consts.className.ACTIVE)) {
          _this8.closeInvitePopup();
        } else {
          _this8.closeInvitePopup();
          _this8.closeMemberPopup();
          (0, _utils.addClass)(chatBoard.inviteBtn, _consts.className.ACTIVE);
          var index = _this8.chatSection.indexOfChatBord(channelUrl);
          _this8.popup.showInvitePopup(_this8.chatSection.self, index);
          _this8.spinner.insert(_this8.popup.invitePopup.list);
          var channelSet = _this8.getChannelSet(channelUrl);
          var memberIds = channelSet.channel.members.map(function (member) {
            return member.userId;
          });
          _getUserList(memberIds);

          _this8.popup.addClickEvent(_this8.popup.invitePopup.inviteBtn, function () {
            if (!(0, _utils.hasClass)(_this8.popup.invitePopup.inviteBtn, _consts.className.DISABLED)) {
              (0, _utils.addClass)(_this8.popup.invitePopup.inviteBtn, _consts.className.DISABLED);
              _this8.spinner.insert(_this8.popup.invitePopup.inviteBtn);
              var selectedUserIds = _this8.popup.getSelectedUserIds(_this8.popup.invitePopup.list);
              var _channelSet = _this8.getChannelSet(channelUrl);
              _this8.sb.inviteMember(_channelSet.channel, selectedUserIds, function () {
                _this8.spinner.remove(_this8.popup.invitePopup.inviteBtn);
                _this8.closeInvitePopup();
                _this8.listBoard.setChannelTitle(_channelSet.channel.url, _this8.sb.getNicknamesString(_channelSet.channel));
                _this8.updateChannelInfo(chatBoard, _channelSet.channel);
              });
            }
          });

          _this8.popup.addScrollEvent(function () {
            _getUserList(memberIds, true);
          });
        }
      });
      this.spinner.insert(chatBoard.content);
      this.sb.getChannelInfo(channelUrl, function (channel) {
        _this8.updateChannelInfo(chatBoard, channel);
        var channelSet = _this8.getChannelSet(channel);
        _this8.getMessageList(channelSet, chatBoard, false, function () {
          _this8.chatScrollEvent(chatBoard, channelSet);
        });
        channel.markAsRead();
        _this8.updateUnreadMessageCount(channel);

        var listItem = _this8.listBoard.getChannelItem(channelUrl);
        if (!listItem) {
          listItem = _this8.createChannelItem(channel);
          _this8.listBoard.list.insertBefore(listItem, _this8.listBoard.list.firstChild);
        }
      });
    }
  }, {
    key: 'updateChannelInfo',
    value: function updateChannelInfo(target, channel) {
      this.chatSection.updateChatTop(target, this.sb.getMemberCount(channel), this.sb.getNicknamesString(channel));
    }
  }, {
    key: 'updateUnreadMessageCount',
    value: function updateUnreadMessageCount(channel) {
      var _this9 = this;

      this.sb.getTotalUnreadCount(function (unreadCount) {
        _this9.widgetBtn.setUnreadCount(unreadCount);
      });

      if (channel) {
        this.listBoard.setChannelUnread(channel.url, channel.unreadMessageCount);
      }
    }
  }, {
    key: 'getMessageList',
    value: function getMessageList(channelSet, target, loadmore, scrollEvent) {
      var _this10 = this;

      this.sb.getMessageList(channelSet, function (messageList) {
        var messageItems = messageList.slice();
        var tempTime = void 0;
        for (var index = 0; index < messageList.length; index++) {
          var message = messageList[index];
          loadmore ? channelSet.message.unshift(message) : channelSet.message.push(message);

          var time = _this10.sb.getMessageTime(message);
          if (time.indexOf(':') > -1) {
            time = TIME_STRING_TODAY;
          }
          if (tempTime != time) {
            tempTime = time;
            (0, _utils.insertMessageInList)(messageItems, messageItems.indexOf(message), new _this10.timeMessage(time));
          }
        }

        var scrollToBottom = false;
        if (!loadmore) {
          if (tempTime != TIME_STRING_TODAY) {
            messageItems.push(new _this10.timeMessage(TIME_STRING_TODAY));
          }
          scrollToBottom = true;
          _this10.spinner.remove(target.content);
          _this10.chatSection.createMessageContent(target);
          _this10.chatSection.addFileSelectEvent(target.file, function () {
            var file = target.file.files[0];
            _this10.sb.sendFileMessage(channelSet.channel, file, function (message) {
              _this10.messageReceivedAction(channelSet.channel, message);
            });
          });
          _this10.chatSection.addKeyDownEvent(target.input, function (event) {
            if (event.keyCode == KEY_DOWN_KR) {
              _this10.chatSection.textKr = target.input.textContent;
            }

            if (event.keyCode == KEY_DOWN_ENTER && !event.shiftKey) {
              var textMessage = target.input.textContent || _this10.chatSection.textKr;
              if (!(0, _utils.isEmptyString)(textMessage.trim())) {
                _this10.sb.sendTextMessage(channelSet.channel, textMessage, function (message) {
                  _this10.messageReceivedAction(channelSet.channel, message);
                });
              }
              _this10.chatSection.clearInputText(target.input, channelSet.channel.url);
              _this10.chatSection.textKr = '';
              channelSet.channel.endTyping();
            } else {
              channelSet.channel.startTyping();
            }
            _this10.chatSection.responsiveHeight(channelSet.channel.url);
          });
          _this10.chatSection.addKeyUpEvent(target.input, function (event) {
            var isBottom = _this10.chatSection.isBottom(target.messageContent, target.list);
            _this10.chatSection.responsiveHeight(channelSet.channel.url);
            if (event.keyCode == KEY_DOWN_ENTER && !event.shiftKey) {
              _this10.chatSection.clearInputText(target.input, channelSet.channel.url);
              if (isBottom) {
                _this10.chatSection.scrollToBottom(target.messageContent);
              }
            }
          });
          _this10.chatSection.addPasteEvent(target.input, function (event) {
            var clipboardData;
            var pastedData;

            event.stopPropagation();
            event.preventDefault();

            clipboardData = event.clipboardData || window.clipboardData;
            pastedData = clipboardData.getData('Text');

            target.input.textContent += pastedData;
          });
        }
        if (scrollEvent) {
          scrollEvent();
        }
        _this10.setMessageItem(channelSet.channel, target, messageItems, loadmore, scrollToBottom);
      });
    }
  }, {
    key: 'setMessageItem',
    value: function setMessageItem(channel, target, messageList, loadmore, scrollToBottom, lastMessage) {
      var firstChild = target.list.firstChild;
      var addScrollHeight = 0;
      var prevMessage = void 0;
      var newMessage = void 0;
      if (lastMessage && messageList[0] && !messageList[0].isTimeMessage) {
        prevMessage = lastMessage;
      }
      for (var i = 0; i < messageList.length; i++) {
        var message = messageList[i];
        if (message.isTimeMessage && message.isTimeMessage()) {
          newMessage = this.chatSection.createMessageItemTime(message.time);
          prevMessage = null;
        } else {
          var isContinue = false;
          if (message.isAdminMessage()) {
            newMessage = this.chatSection.createAdminMessageItem(message);
          } else {
            // isUserMessage() || isFileMessage()
            isContinue = prevMessage && prevMessage.sender ? message.sender.userId == prevMessage.sender.userId : false;
            var isCurrentUser = this.sb.isCurrentUser(message.sender);
            var unreadCount = channel.getReadReceipt(message);
            if (message.isUserMessage()) {
              newMessage = this.chatSection.createMessageItem(message, isCurrentUser, isContinue, unreadCount);
            } else if (message.isFileMessage()) {
              newMessage = this.chatSection.createMessageItem(message, isCurrentUser, isContinue, unreadCount);
            }
          }
          prevMessage = message;
        }

        if (loadmore) {
          target.list.insertBefore(newMessage, firstChild);
          addScrollHeight += (0, _utils.getFullHeight)(newMessage);
        } else {
          target.list.appendChild(newMessage);
        }
      }

      if (loadmore) {
        target.messageContent.scrollTop = addScrollHeight;
      } else if (scrollToBottom) {
        this.chatSection.scrollToBottom(target.messageContent);
      }
    }
  }, {
    key: 'chatScrollEvent',
    value: function chatScrollEvent(target, channelSet) {
      var _this11 = this;

      this.chatSection.addScrollEvent(target.messageContent, function () {
        if (target.messageContent.scrollTop == 0) {
          _this11.getMessageList(channelSet, target, true);
        }
      });
    }
  }, {
    key: 'getChannelSet',
    value: function getChannelSet(channel, isLast) {
      var isObject = true;
      if ((typeof channel === 'undefined' ? 'undefined' : _typeof(channel)) === _consts.TYPE_STRING || channel instanceof String) {
        isObject = false;
      }

      var channelSet = this.activeChannelSetList.filter(function (obj) {
        return isObject ? obj.channel == channel : obj.channel.url == channel;
      })[0];

      if (!channelSet && isObject) {
        channelSet = {
          'channel': channel,
          'query': channel.createPreviousMessageListQuery(),
          'message': []
        };
        isLast ? this.activeChannelSetList.push(channelSet) : this.activeChannelSetList.unshift(channelSet);
      }

      return channelSet;
    }
  }, {
    key: 'removeChannelSet',
    value: function removeChannelSet(channel) {
      var isObject = true;
      if ((typeof channel === 'undefined' ? 'undefined' : _typeof(channel)) === _consts.TYPE_STRING || channel instanceof String) {
        isObject = false;
      }

      this.activeChannelSetList = this.activeChannelSetList.filter(function (obj) {
        return isObject ? obj.channel != channel : obj.channel.url != channel;
      });
    }
  }, {
    key: 'toggleBoard',
    value: function toggleBoard(isShow) {
      if (isShow) {
        (0, _utils.hide)((0, _utils.addClass)((0, _utils.removeClass)(this.widgetBtn.self, _consts.className.FADE_IN), _consts.className.FADE_OUT));
        (0, _utils.show)((0, _utils.addClass)((0, _utils.removeClass)(this.listBoard.self, _consts.className.FADE_OUT), _consts.className.FADE_IN));
      } else {
        (0, _utils.hide)((0, _utils.addClass)((0, _utils.removeClass)(this.listBoard.self, _consts.className.FADE_IN), _consts.className.FADE_OUT));
        (0, _utils.show)((0, _utils.addClass)((0, _utils.removeClass)(this.widgetBtn.self, _consts.className.FADE_OUT), _consts.className.FADE_IN));
      }
    }
  }]);

  return SBWidget;
}();

window.sbWidget = new SBWidget();

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

__webpack_require__(307);

__webpack_require__(312);

__webpack_require__(127);

if (global._babelPolyfill) {
  throw new Error("only one instance of babel-polyfill is allowed");
}
global._babelPolyfill = true;

var DEFINE_PROPERTY = "defineProperty";
function define(O, key, value) {
  O[key] || Object[DEFINE_PROPERTY](O, key, {
    writable: true,
    configurable: true,
    value: value
  });
}

define(String.prototype, "padLeft", "".padStart);
define(String.prototype, "padRight", "".padEnd);

"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
  [][key] && define(Array, key, Function.call.bind([][key]));
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(88)))

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _consts = __webpack_require__(28);

var _elements = __webpack_require__(47);

var _elements2 = _interopRequireDefault(_elements);

var _utils = __webpack_require__(41);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EMPTY_STRING = '';

var CHAT_SECTION_RIGHT_MAX = '280px';
var CHAT_SECTION_RIGHT_MIN = '60px';
var TOOLTIP_MEMBER_LIST = 'Member List';
var TOOLTIP_CHANNEL_LEAVE = 'Channel Leave';
var TOOLTIP_INVITE_MEMBER = 'Invite Member';
var TITLE_CHAT_TITLE_DEFAULT = 'Group Channel';
var TITLE_CHAT_TITLE_NEW_CHAT = 'New Chat';
var TITLE_CHAT_LEAVE_POPUP = 'Do you really want to leave?';
var TITLE_CHAT_LEAVE_BTN = 'Leave';
var TITLE_CHAT_CANCEL_BTN = 'Cancel';
var MEMBER_COUNT_DEFAULT = '0';
var MARGIN_TOP_MESSAGE = '3px';
var MESSAGE_NONE_IMAGE_HEIGHT = '10px';
var DISPLAY_NONE = 'none';
var TITLE_START_CHAT_BTN = 'Start Chat';
var MESSAGE_CONTENT_HEIGHT_DEFAULT = 328;
var MESSAGE_INPUT_HEIGHT_DEFAULT = 29;
var MESSAGE_TYPING_SEVERAL = 'Several people are typing...';
var MESSAGE_TYPING_MEMBER = ' is typing...';
var DISPLAY_TYPE_INLINE_BLOCK = 'inline-block';
var IMAGE_MAX_SIZE = 160;
var TEXT_FILE_DOWNLOAD = 'Download';

var ChatSection = function (_Element) {
  _inherits(ChatSection, _Element);

  function ChatSection(widget) {
    _classCallCheck(this, ChatSection);

    var _this = _possibleConstructorReturn(this, (ChatSection.__proto__ || Object.getPrototypeOf(ChatSection)).call(this));

    _this._create();
    widget.appendChild(_this.self);
    _this.textKr = '';
    return _this;
  }

  _createClass(ChatSection, [{
    key: 'reset',
    value: function reset() {
      this._setContent(this.self, EMPTY_STRING);
    }
  }, {
    key: '_create',
    value: function _create() {
      this.self = this.createDiv();
      this._setClass(this.self, [_consts.className.CHAT_SECTION]);
    }
  }, {
    key: 'responsiveSize',
    value: function responsiveSize(isMax, action) {
      if (isMax !== undefined) {
        this.self.style.right = isMax ? CHAT_SECTION_RIGHT_MIN : CHAT_SECTION_RIGHT_MAX;
      }
      action();
    }
  }, {
    key: '_getListBoardArray',
    value: function _getListBoardArray() {
      return Array.prototype.slice.call(this.self.childNodes, 0);
    }
  }, {
    key: 'moveToFirstIndex',
    value: function moveToFirstIndex(target) {
      var _this2 = this;

      var items = this._getListBoardArray();
      items.filter(function (item) {
        if (item.id == target.id) {
          _this2.self.removeChild(item);
        }
      });
      this.self.insertBefore(target, this.self.firstChild);
    }
  }, {
    key: 'setWidth',
    value: function setWidth(width) {
      this._setWidth(this.self, width);
    }

    /*
    Chat
     */

  }, {
    key: 'createChatBoard',
    value: function createChatBoard(channelUrl, isLast) {
      var chatBoard = this.createDiv();
      this._setClass(chatBoard, [_consts.className.CHAT_BOARD]);
      chatBoard.id = channelUrl ? channelUrl : '';

      var chatTop = this.createDiv();
      this._setClass(chatTop, [_consts.className.TOP]);

      var chatTitle = this.createDiv();
      this._setClass(chatTitle, [_consts.className.TITLE]);
      this._setContent(chatTitle, TITLE_CHAT_TITLE_DEFAULT);
      chatBoard.topTitle = chatTitle;
      chatTop.appendChild(chatTitle);

      var chatMemberCount = this.createDiv();
      this._setClass(chatMemberCount, [_consts.className.COUNT]);
      this._setContent(chatMemberCount, MEMBER_COUNT_DEFAULT);
      chatBoard.count = chatMemberCount;
      chatTop.appendChild(chatMemberCount);

      var topBtnClose = this.createDiv();
      this._setClass(topBtnClose, [_consts.className.BTN, _consts.className.IC_CLOSE]);
      chatBoard.closeBtn = topBtnClose;
      chatTop.appendChild(topBtnClose);

      var topBtnLeave = this.createDiv();
      this._setClass(topBtnLeave, [_consts.className.BTN, _consts.className.IC_LEAVE]);
      chatBoard.leaveBtn = topBtnLeave;

      var tooltipLeave = this.createSpan();
      this._setClass(tooltipLeave, [_consts.className.TOOLTIP]);
      this._setContent(tooltipLeave, TOOLTIP_CHANNEL_LEAVE);

      topBtnLeave.appendChild(tooltipLeave);
      chatTop.appendChild(topBtnLeave);

      var topBtnMembers = this.createDiv();
      this._setClass(topBtnMembers, [_consts.className.BTN, _consts.className.IC_MEMBERS]);
      chatBoard.memberBtn = topBtnMembers;

      var tooltipMember = this.createSpan();
      this._setClass(tooltipMember, [_consts.className.TOOLTIP]);
      this._setContent(tooltipMember, TOOLTIP_MEMBER_LIST);

      topBtnMembers.appendChild(tooltipMember);
      chatTop.appendChild(topBtnMembers);

      var topBtnInvite = this.createDiv();
      this._setClass(topBtnInvite, [_consts.className.BTN, _consts.className.IC_INVITE]);
      chatBoard.inviteBtn = topBtnInvite;

      var tooltipInvite = this.createSpan();
      this._setClass(tooltipInvite, [_consts.className.TOOLTIP]);
      this._setContent(tooltipInvite, TOOLTIP_INVITE_MEMBER);

      topBtnInvite.appendChild(tooltipInvite);
      chatTop.appendChild(topBtnInvite);

      chatBoard.appendChild(chatTop);

      var chatContent = this.createDiv();
      this._setClass(chatContent, [_consts.className.CONTENT]);
      chatBoard.content = chatContent;
      chatBoard.appendChild(chatContent);

      isLast ? this.self.appendChild(chatBoard) : this.moveToFirstIndex(chatBoard);
      return chatBoard;
    }
  }, {
    key: 'addLeavePopup',
    value: function addLeavePopup(target) {
      if (!target.leavePopup) {
        var leavePopup = this.createDiv();
        this._setClass(leavePopup, [_consts.className.LEAVE_POPUP]);

        var leaveTitle = this.createDiv();
        this._setClass(leaveTitle, [_consts.className.POPUP_TOP]);
        this._setContent(leaveTitle, TITLE_CHAT_LEAVE_POPUP);
        leavePopup.appendChild(leaveTitle);

        var div = this.createDiv();
        var leaveBtn = this.createDiv();
        this._setClass(leaveBtn, [_consts.className.LEAVE_BTN]);
        this._setContent(leaveBtn, TITLE_CHAT_LEAVE_BTN);
        div.appendChild(leaveBtn);

        var cancelBtn = this.createDiv();
        this._setClickEvent(cancelBtn, function () {
          target.removeChild(leavePopup);
          target.leavePopup = null;
        });
        this._setClass(cancelBtn, [_consts.className.CANCEL_BTN]);
        this._setContent(cancelBtn, TITLE_CHAT_CANCEL_BTN);
        div.appendChild(cancelBtn);

        leavePopup.appendChild(div);

        target.leavePopup = leavePopup;
        target.leavePopup.leaveBtn = leaveBtn;
        target.insertBefore(leavePopup, target.firstChild);
      }
    }
  }, {
    key: 'setLeaveBtnClickEvent',
    value: function setLeaveBtnClickEvent(target, action) {
      this._setClickEvent(target, action);
    }
  }, {
    key: 'removeMemberPopup',
    value: function removeMemberPopup() {
      var items = this.self.querySelectorAll('.' + _consts.className.CHAT_BOARD);
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        (0, _utils.removeClass)(item.memberBtn, _consts.className.ACTIVE);
      }
    }
  }, {
    key: 'removeInvitePopup',
    value: function removeInvitePopup() {
      var items = this.self.querySelectorAll('.' + _consts.className.CHAT_BOARD);
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        (0, _utils.removeClass)(item.inviteBtn, _consts.className.ACTIVE);
      }
    }
  }, {
    key: 'addClickEvent',
    value: function addClickEvent(target, action) {
      this._setClickEvent(target, action);
    }
  }, {
    key: 'updateChatTop',
    value: function updateChatTop(target, count, title) {
      this._setContent(target.count, count);
      if (title !== null) {
        this._setContent(target.topTitle, title);
      }
    }
  }, {
    key: 'getChatBoard',
    value: function getChatBoard(channelUrl) {
      var items = this.self.querySelectorAll('.' + _consts.className.CHAT_BOARD);
      var targetBoard = void 0;
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.id == channelUrl) {
          targetBoard = item;
          break;
        }
      }
      return targetBoard;
    }
  }, {
    key: 'indexOfChatBord',
    value: function indexOfChatBord(channelUrl) {
      var items = this.self.querySelectorAll('.' + _consts.className.CHAT_BOARD);
      var chatBoard = this.getChatBoard(channelUrl);
      var index = -1;
      for (var i = 0; i < items.length; i++) {
        if (items[i] == chatBoard) {
          index = i;
          break;
        }
      }
      return index;
    }
  }, {
    key: 'closeChatBoard',
    value: function closeChatBoard(target) {
      target.parentNode.removeChild(target);
      this.textKr = '';
    }
  }, {
    key: 'createMessageContent',
    value: function createMessageContent(target) {
      var chatContent = this.createDiv();
      this._setClass(chatContent, [_consts.className.CONTENT]);

      var messageContent = this.createDiv();
      this._setClass(messageContent, [_consts.className.MESSAGE_CONTENT]);

      var messageList = this.createDiv();
      this._setClass(messageList, [_consts.className.MESSAGE_LIST]);
      messageContent.appendChild(messageList);
      chatContent.appendChild(messageContent);

      var typingMessage = this.createDiv();
      this._setClass(typingMessage, [_consts.className.TYPING]);
      chatContent.appendChild(typingMessage);

      var contentInput = this.createDiv();
      this._setClass(contentInput, [_consts.className.INPUT]);

      var chatText = this.createTextInput();
      contentInput.appendChild(chatText);

      var chatFile = this.createLabel();
      this._setClass(chatFile, [_consts.className.FILE]);
      chatFile.setAttribute('for', 'file_' + target.id);

      var chatFileInput = this.createInput();
      chatFileInput.type = 'file';
      chatFileInput.name = 'file';
      chatFileInput.id = 'file_' + target.id;
      (0, _utils.hide)(chatFileInput);
      chatFile.appendChild(chatFileInput);
      contentInput.appendChild(chatFile);
      chatContent.appendChild(contentInput);

      target.content.parentNode.removeChild(target.content);
      target.content = chatContent;
      target.messageContent = messageContent;
      target.list = messageList;
      target.typing = typingMessage;
      target.input = chatText;
      target.file = chatFileInput;
      target.appendChild(chatContent);
    }
  }, {
    key: 'createTextInput',
    value: function createTextInput() {
      var chatText = this.createDiv();
      this._setClass(chatText, [_consts.className.TEXT]);
      chatText.setAttribute('contenteditable', true);
      return chatText;
    }
  }, {
    key: 'clearInputText',
    value: function clearInputText(target, channelUrl) {
      var items = target.querySelectorAll(this.tagName.DIV);
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        item.remove();
      }
      this._setContent(target, EMPTY_STRING);
      this.responsiveHeight(channelUrl);
    }
  }, {
    key: 'addPasteEvent',
    value: function addPasteEvent(target, action) {
      this._setPasteEvent(target, action);
    }
  }, {
    key: 'addKeyUpEvent',
    value: function addKeyUpEvent(target, action) {
      this._setKeyupEvent(target, action);
    }
  }, {
    key: 'addKeyDownEvent',
    value: function addKeyDownEvent(target, action) {
      this._setKeydownEvent(target, action);
    }
  }, {
    key: 'addFileSelectEvent',
    value: function addFileSelectEvent(target, action) {
      this._setChangeEvent(target, action);
    }
  }, {
    key: 'addScrollEvent',
    value: function addScrollEvent(target, action) {
      this._setScrollEvent(target, action);
    }
  }, {
    key: 'responsiveHeight',
    value: function responsiveHeight(channelUrl) {
      var targetBoard = this.getChatBoard(channelUrl);
      var messageContent = targetBoard.messageContent;
      var changeHeight = (0, _utils.getFullHeight)(targetBoard.typing) + (0, _utils.getFullHeight)(targetBoard.input);
      this._setHeight(messageContent, MESSAGE_CONTENT_HEIGHT_DEFAULT - (changeHeight - MESSAGE_INPUT_HEIGHT_DEFAULT));
    }
  }, {
    key: 'showTyping',
    value: function showTyping(channel, spinner) {
      var targetBoard = this.getChatBoard(channel.url);
      var typing = targetBoard.typing;
      if (!channel.isTyping()) {
        this._setContent(typing, EMPTY_STRING);
        (0, _utils.hide)(typing);
      } else {
        var typingUser = channel.getTypingMembers();
        spinner.insert(typing);
        this._addContent(typing, typingUser.length > 1 ? MESSAGE_TYPING_SEVERAL : typingUser[0].nickname + MESSAGE_TYPING_MEMBER);
        (0, _utils.show)(typing);
      }
    }
  }, {
    key: 'setImageSize',
    value: function setImageSize(target, message) {
      var _this3 = this;

      var imageResize = function imageResize(imageTarget, width, height) {
        var scaleWidth = IMAGE_MAX_SIZE / width;
        var scaleHeight = IMAGE_MAX_SIZE / height;

        var scale = scaleWidth <= scaleHeight ? scaleWidth : scaleHeight;
        if (scale > 1) {
          scale = 1;
        }

        var resizeWidth = width * scale;
        var resizeHeight = height * scale;

        _this3._setBackgroundSize(imageTarget, resizeWidth + 'px ' + resizeHeight + 'px');
        _this3._setWidth(imageTarget, resizeWidth);
        _this3._setHeight(imageTarget, resizeHeight);
      };

      this._setBackgroundImage(target, message.thumbnails.length > 0 ? message.thumbnails[0].url : message.url);
      if (message.thumbnails.length > 0) {
        imageResize(target, message.thumbnails[0].real_width, message.thumbnails[0].real_height);
      } else {
        var img = new Image();
        img.addEventListener('load', function (res) {
          res.path ? imageResize(target, res.path[0].width, res.path[0].height) : imageResize(target, res.target.width, res.target.height);
        });
        img.src = message.url;
      }
    }
  }, {
    key: 'createMessageItem',
    value: function createMessageItem(message, isCurrentUser, isContinue, unreadCount) {
      var messageSet = this.createDiv();
      messageSet.id = message.messageId;
      this._setClass(messageSet, isCurrentUser ? [_consts.className.MESSAGE_SET, _consts.className.USER] : [_consts.className.MESSAGE_SET]);
      if (isContinue) {
        messageSet.style.marginTop = MARGIN_TOP_MESSAGE;
      }

      var senderImg = this.createDiv();
      this._setClass(senderImg, [_consts.className.IMAGE]);
      var senderProfile = message.sender.profileUrl;
      if (isContinue) {
        senderProfile = '';
        senderImg.style.height = MESSAGE_NONE_IMAGE_HEIGHT;
      }
      senderImg.style.backgroundImage = 'url(' + senderProfile + ')';
      messageSet.appendChild(senderImg);

      var messageContent = this.createDiv();
      this._setClass(messageContent, [_consts.className.MESSAGE]);

      var senderNickname = this.createDiv();
      this._setClass(senderNickname, [_consts.className.NICKNAME]);
      this._setContent(senderNickname, message.sender.nickname);
      if (isContinue) {
        senderNickname.style.display = DISPLAY_NONE;
      }
      messageContent.appendChild(senderNickname);

      var messageItem = this.createDiv();
      this._setClass(messageItem, [_consts.className.MESSAGE_ITEM]);

      var itemText = this.createDiv();
      if (message.isUserMessage()) {
        this._setClass(itemText, [_consts.className.TEXT]);
        this._setContent(itemText, message.message);
      } else if (message.isFileMessage()) {
        if (message.type.match(/^image\/gif$/)) {
          this._setClass(itemText, [_consts.className.FILE_MESSAGE]);
          var image = this.createImg();
          this._setClass(image, [_consts.className.IMAGE]);
          image.src = message.url;
          this.setImageSize(image, message);
          itemText.appendChild(image);
        } else {
          this._setClass(itemText, [_consts.className.FILE_MESSAGE]);
          var file = this.createA();
          file.href = message.url;
          file.target = 'blank';
          if (message.type.match(/^image\/.+$/)) {
            this._setClass(file, [_consts.className.IMAGE]);
            this.setImageSize(file, message);
          } else {
            this._setClass(file, [_consts.className.FILE]);
            var fileIcon = this.createDiv();
            this._setClass(fileIcon, [_consts.className.FILE_ICON]);

            var fileText = this.createDiv();
            this._setClass(fileText, [_consts.className.FILE_TEXT]);

            var fileName = this.createDiv();
            this._setClass(fileName, [_consts.className.FILE_NAME]);
            this._setContent(fileName, message.name);
            fileText.appendChild(fileName);

            var fileDownload = this.createDiv();
            this._setClass(fileDownload, [_consts.className.FILE_DOWNLOAD]);
            this._setContent(fileDownload, TEXT_FILE_DOWNLOAD);
            fileText.appendChild(fileDownload);

            file.appendChild(fileIcon);
            file.appendChild(fileText);
          }
          itemText.appendChild(file);
        }
      }

      var itemUnread = this.createDiv();
      this._setClass(itemUnread, [_consts.className.UNREAD]);
      this.setUnreadCount(itemUnread, unreadCount);
      messageSet.unread = itemUnread;

      if (isCurrentUser) {
        messageItem.appendChild(itemUnread);
        messageItem.appendChild(itemText);
      } else {
        messageItem.appendChild(itemText);
        messageItem.appendChild(itemUnread);
      }

      messageContent.appendChild(messageItem);
      messageSet.appendChild(messageContent);
      return messageSet;
    }
  }, {
    key: 'createAdminMessageItem',
    value: function createAdminMessageItem(message) {
      var admin = this.createDiv();
      this._setClass(admin, [_consts.className.MESSAGE_SET, _consts.className.ADMIN_MESSAGE]);
      this._setContent(admin, message.message);
      return admin;
    }
  }, {
    key: 'setUnreadCount',
    value: function setUnreadCount(target, count) {
      count = parseInt(count);
      this._setContent(target, count > 9 ? _consts.MAX_COUNT : count == 0 ? '' : count.toString());
      count > 0 ? (0, _utils.show)(target, DISPLAY_TYPE_INLINE_BLOCK) : (0, _utils.hide)(target);
    }
  }, {
    key: 'updateReadReceipt',
    value: function updateReadReceipt(channelSet, target) {
      var items = target.querySelectorAll('.' + _consts.className.MESSAGE_SET);
      for (var j = 0; j < channelSet.message.length; j++) {
        var message = channelSet.message[j];
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          if (item.id == message.messageId) {
            this.setUnreadCount(item.unread, channelSet.channel.getReadReceipt(message));
            break;
          }
        }
      }
    }
  }, {
    key: 'createMessageItemTime',
    value: function createMessageItemTime(date) {
      var time = this.createDiv();
      this._setClass(time, [_consts.className.MESSAGE_SET, _consts.className.TIME]);
      this._setContent(time, date);
      return time;
    }
  }, {
    key: 'createNewChatBoard',
    value: function createNewChatBoard(target) {
      var chatContent = this.createDiv();
      this._setClass(chatContent, [_consts.className.CONTENT]);

      var userContent = this.createDiv();
      this._setClass(userContent, [_consts.className.USER_CONTENT]);
      chatContent.appendChild(userContent);

      var contentBottom = this.createDiv();
      this._setClass(contentBottom, [_consts.className.CONTENT_BOTTOM]);

      var contentBottomBtn = this.createDiv();
      this._setClass(contentBottomBtn, [_consts.className.NEW_CHAT_BTN, _consts.className.DISABLED]);
      this._setContent(contentBottomBtn, TITLE_START_CHAT_BTN);
      contentBottom.appendChild(contentBottomBtn);
      chatContent.appendChild(contentBottom);

      target.content.parentNode.removeChild(target.content);
      target.content = chatContent;
      target.startBtn = contentBottomBtn;
      target.userContent = userContent;
      target.appendChild(chatContent);
      this._setContent(target.topTitle, TITLE_CHAT_TITLE_NEW_CHAT);
    }
  }, {
    key: 'createUserList',
    value: function createUserList(target) {
      if (target.querySelectorAll(this.tagName.UL).length == 0) {
        var userList = this.createUl();
        target.list = userList;
        target.appendChild(userList);
      }
    }
  }, {
    key: 'createUserListItem',
    value: function createUserListItem(user) {
      var li = this.createLi();

      var userItem = this.createDiv();
      this._setClass(userItem, [_consts.className.USER_ITEM]);

      var userSelect = this.createDiv();
      this._setClass(userSelect, [_consts.className.USER_SELECT]);
      this._setDataset(userSelect, 'user-id', user.userId);
      li.select = userSelect;
      userItem.appendChild(userSelect);

      var userProfile = this.createDiv();
      this._setClass(userProfile, [_consts.className.IMAGE]);
      this._setBackgroundImage(userProfile, user.profileUrl);
      userItem.appendChild(userProfile);

      var userNickname = this.createDiv();
      this._setClass(userNickname, [_consts.className.NICKNAME]);
      this._setContent(userNickname, user.nickname);
      userItem.appendChild(userNickname);

      li.appendChild(userItem);
      return li;
    }
  }, {
    key: 'getSelectedUserIds',
    value: function getSelectedUserIds(target) {
      var items = target.querySelectorAll('.' + _consts.className.ACTIVE);
      var userIds = [];
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        userIds.push(item.getAttribute('data-user-id'));
      }
      return userIds;
    }
  }, {
    key: 'isBottom',
    value: function isBottom(targetContent, targetList) {
      return this._isBottom(targetContent, targetList);
    }
  }, {
    key: 'addUserListScrollEvent',
    value: function addUserListScrollEvent(target, action) {
      var _this4 = this;

      this._setScrollEvent(target.userContent, function () {
        if (_this4.isBottom(target.userContent, target.userContent.list)) {
          action();
        }
      });
    }
  }, {
    key: 'scrollToBottom',
    value: function scrollToBottom(target) {
      target.scrollTop = target.scrollHeight - target.clientHeight;
    }
  }]);

  return ChatSection;
}(_elements2.default);

exports.default = ChatSection;

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _consts = __webpack_require__(28);

var _utils = __webpack_require__(41);

var _elements = __webpack_require__(47);

var _elements2 = _interopRequireDefault(_elements);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EMPTY_STRING = '';

var OPTION_TOOLTIP_TEXT = 'Log out';
var NEW_CHAT_TOOLTIP_TEXT = 'New Message';

var TITLE_TOP_LOGIN = 'SendBird Widget';
var TITLE_TOP_CHANNEL = 'Channel List';
var TITLE_LOGIN_USER_ID = 'USER ID';
var TITLE_LOGIN_NICKNAME = 'NICKNAME';
var TITLE_LOGIN_BTN = 'Start Chat';
var TITLE_EMPTY_ITEM = 'Click below to start';
var TITLE_EMPTY_BTN = 'Create';

var INPUT_TYPE = 'text';
var INPUT_MAX_LENGTH = 20;

var isLogoutClick = false;

var ListBoard = function (_Element) {
  _inherits(ListBoard, _Element);

  function ListBoard(widget) {
    _classCallCheck(this, ListBoard);

    var _this = _possibleConstructorReturn(this, (ListBoard.__proto__ || Object.getPrototypeOf(ListBoard)).call(this));

    _this._createBoard();
    widget.appendChild(_this.self);

    _this.createLoginForm();
    _this.createChannelListBoard();
    return _this;
  }

  _createClass(ListBoard, [{
    key: 'reset',
    value: function reset() {
      this._setContent(this.list, EMPTY_STRING);
      this._cleanLoginForm();
    }
  }, {
    key: '_createBoard',
    value: function _createBoard() {
      this.self = this.createDiv();
      this._setClass(this.self, [_consts.className.CHANNEL_BOARD]);

      var boardTop = this.createDiv();
      this._setClass(boardTop, [_consts.className.BOARD_TOP]);

      this.topTitle = this.createDiv();
      this._setClass(this.topTitle, [_consts.className.TITLE]);
      this._setContent(this.topTitle, TITLE_TOP_LOGIN);
      boardTop.appendChild(this.topTitle);

      this.btnMini = this.createDiv();
      this._setClass(this.btnMini, [_consts.className.BTN, _consts.className.IC_MINIMIZE]);
      boardTop.appendChild(this.btnMini);

      this.btnOption = this.createDiv();
      this._setClass(this.btnOption, [_consts.className.BTN, _consts.className.IC_OPTION]);

      this.btnLogout = this.createDiv();
      this._setClass(this.btnLogout, [_consts.className.OPTION_MENU]);
      var logoutText = this.createDiv();
      this._setClass(logoutText, [_consts.className.OPTION_CONTENT]);
      this._setContent(logoutText, OPTION_TOOLTIP_TEXT);
      this.btnLogout.appendChild(logoutText);

      this.btnOption.appendChild(this.btnLogout);
      boardTop.appendChild(this.btnOption);

      this.addOptionClickEvent();

      this.btnNewChat = this.createDiv();
      this._setClass(this.btnNewChat, [_consts.className.BTN, _consts.className.IC_NEW_CHAT]);

      var newChatTooltip = this.createSpan();
      this._setClass(newChatTooltip, [_consts.className.TOOLTIP]);
      this._setContent(newChatTooltip, NEW_CHAT_TOOLTIP_TEXT);
      this.btnNewChat.appendChild(newChatTooltip);
      boardTop.appendChild(this.btnNewChat);

      this.self.appendChild(boardTop);
    }
  }, {
    key: 'addMinimizeClickEvent',
    value: function addMinimizeClickEvent(action) {
      this._setClickEvent(this.btnMini, action);
    }
  }, {
    key: 'addOptionClickEvent',
    value: function addOptionClickEvent() {
      var _this2 = this;

      if (!this._getOptionEventLock()) {
        this._setClickEvent(this.btnOption, function () {
          if ((0, _utils.hasClass)(_this2.btnOption, _consts.className.ACTIVE)) {
            _this2.hideLogoutBtn();
          } else {
            (0, _utils.addClass)(_this2.btnOption, _consts.className.ACTIVE);
            (0, _utils.show)(_this2.btnLogout);
          }
        });
      }
    }
  }, {
    key: 'addLogoutClickEvent',
    value: function addLogoutClickEvent(action) {
      this.setOptionEventLock(true);
      this._setClickEvent(this.btnLogout, action);
    }
  }, {
    key: 'setOptionEventLock',
    value: function setOptionEventLock(value) {
      isLogoutClick = value;
    }
  }, {
    key: '_getOptionEventLock',
    value: function _getOptionEventLock() {
      return isLogoutClick;
    }
  }, {
    key: 'hideLogoutBtn',
    value: function hideLogoutBtn() {
      (0, _utils.removeClass)(this.btnOption, _consts.className.ACTIVE);
      (0, _utils.hide)(this.btnLogout);
    }
  }, {
    key: 'addNewChatClickEvent',
    value: function addNewChatClickEvent(action) {
      this._setClickEvent(this.btnNewChat, action);
    }
  }, {
    key: 'createLoginForm',
    value: function createLoginForm() {
      this.loginForm = this.createDiv();
      this._setClass(this.loginForm, [_consts.className.CONTENT, _consts.className.LOGIN_FORM]);

      var userIdEl = this.createDiv();
      this._setClass(userIdEl, [_consts.className.USER_ID]);

      var idTitle = this.createDiv();
      this._setClass(idTitle, [_consts.className.TITLE]);
      this._setContent(idTitle, TITLE_LOGIN_USER_ID);
      userIdEl.appendChild(idTitle);

      this.userId = this.createInput();
      this._setClass(this.userId, [_consts.className.INPUT]);
      this.userId.type = INPUT_TYPE;
      this.userId.maxlength = INPUT_MAX_LENGTH;
      this.userId.title = TITLE_LOGIN_USER_ID;
      this._setKeyupEvent(this.userId, this._toggleLoginBtn.bind(this));
      this._setChangeEvent(this.userId, this._toggleLoginBtn.bind(this));
      userIdEl.appendChild(this.userId);
      this.loginForm.appendChild(userIdEl);

      var userNicknameEl = this.createDiv();
      this._setClass(userNicknameEl, [_consts.className.NICKNAME]);

      var nicknameTitle = this.createDiv();
      this._setClass(nicknameTitle, [_consts.className.TITLE]);
      this._setContent(nicknameTitle, TITLE_LOGIN_NICKNAME);
      userNicknameEl.appendChild(nicknameTitle);

      this.nickname = this.createInput();
      this._setClass(this.nickname, [_consts.className.INPUT]);
      this.nickname.type = INPUT_TYPE;
      this.nickname.maxlength = INPUT_MAX_LENGTH;
      this.nickname.title = TITLE_LOGIN_NICKNAME;
      this._setKeyupEvent(this.nickname, this._toggleLoginBtn.bind(this));
      this._setChangeEvent(this.nickname, this._toggleLoginBtn.bind(this));
      userNicknameEl.appendChild(this.nickname);
      this.loginForm.appendChild(userNicknameEl);

      this.btnLogin = this.createDiv();
      this._setClass(this.btnLogin, [_consts.className.LOGIN_BTN]);
      this._setContent(this.btnLogin, TITLE_LOGIN_BTN);
      this.loginForm.appendChild(this.btnLogin);
    }
  }, {
    key: 'showLoginForm',
    value: function showLoginForm() {
      if (this.self.lastElementChild == this.listContent) {
        this.self.removeChild(this.listContent);
      }
      this._setContent(this.topTitle, TITLE_TOP_LOGIN);
      (0, _utils.hide)(this.btnOption);
      (0, _utils.hide)(this.btnNewChat);
      this.self.appendChild(this.loginForm);
      this._toggleLoginBtn();
    }
  }, {
    key: '_cleanLoginForm',
    value: function _cleanLoginForm() {
      this.userId.disabled = false;
      this.nickname.disabled = false;
      this._setUserId(EMPTY_STRING);
      this._setNickname(EMPTY_STRING);
      this._setContent(this.btnLogin, TITLE_LOGIN_BTN);
      this.enabledToggle(this.btnLogin, true);
    }
  }, {
    key: '_toggleLoginBtn',
    value: function _toggleLoginBtn() {
      if (!(0, _utils.isEmptyString)((0, _utils.removeWhiteSpace)(this.userId.value)) && !(0, _utils.isEmptyString)((0, _utils.removeWhiteSpace)(this.nickname.value))) {
        if (this.btnLogin.innerHTML == TITLE_LOGIN_BTN) {
          this.enabledToggle(this.btnLogin, true);
        }
      } else {
        this.enabledToggle(this.btnLogin, false);
      }
    }
  }, {
    key: '_setUserId',
    value: function _setUserId(value) {
      this.userId.value = value;
    }
  }, {
    key: 'getUserId',
    value: function getUserId() {
      return this.userId.value;
    }
  }, {
    key: '_setNickname',
    value: function _setNickname(value) {
      this.nickname.value = value;
    }
  }, {
    key: 'getNickname',
    value: function getNickname() {
      return this.nickname.value;
    }
  }, {
    key: 'addLoginClickEvent',
    value: function addLoginClickEvent(action) {
      this._setClickEvent(this.btnLogin, action);
    }
  }, {
    key: 'addKeyDownEvent',
    value: function addKeyDownEvent(target, action) {
      this._setKeydownEvent(target, action);
    }
  }, {
    key: 'createChannelListBoard',
    value: function createChannelListBoard() {
      this.listContent = this.createDiv();
      this._setClass(this.listContent, [_consts.className.CONTENT, _consts.className.CHANNEL_LIST]);

      this.list = this.createUl();
      this.listContent.appendChild(this.list);
    }
  }, {
    key: 'showChannelList',
    value: function showChannelList() {
      if (this.self.lastElementChild == this.loginForm) {
        this.self.removeChild(this.loginForm);
        this._cleanLoginForm();
      }
      this._setContent(this.topTitle, TITLE_TOP_CHANNEL);
      (0, _utils.show)(this.btnOption);
      (0, _utils.show)(this.btnNewChat);
      this.self.appendChild(this.listContent);
    }
  }, {
    key: 'addChannelListScrollEvent',
    value: function addChannelListScrollEvent(action) {
      var _this3 = this;

      this._setScrollEvent(this.listContent, function () {
        if (_this3._isBottom(_this3.listContent, _this3.list)) {
          action();
        }
      });
    }
  }, {
    key: 'createChannelItem',
    value: function createChannelItem() {
      var channelUrl = arguments.length <= 0 ? undefined : arguments[0];
      var coverUrl = arguments.length <= 1 ? undefined : arguments[1];
      var title = arguments.length <= 2 ? undefined : arguments[2];
      var time = arguments.length <= 3 ? undefined : arguments[3];
      var message = arguments.length <= 4 ? undefined : arguments[4];
      var unread = arguments.length <= 5 ? undefined : arguments[5];

      var item = this.createDiv();
      this._setClass(item, [_consts.className.ITEM]);
      var itemImg = this.createDiv();
      this._setClass(itemImg, [_consts.className.IMAGE]);
      this._setBackgroundImage(itemImg, coverUrl);
      item.appendChild(itemImg);

      var itemContent = this.createDiv();
      this._setClass(itemContent, [_consts.className.CONTENT]);

      var contentTop = this.createDiv();
      this._setClass(contentTop, [_consts.className.CONTENT_TOP]);
      var contentTitle = this.createDiv();
      this._setClass(contentTitle, [_consts.className.TITLE]);
      this._setContent(contentTitle, title);
      contentTop.appendChild(contentTitle);

      var contentTime = this.createTime();
      this._setContent(contentTime, time);
      contentTop.appendChild(contentTime);

      itemContent.appendChild(contentTop);

      var contentBottom = this.createDiv();
      this._setClass(contentBottom, [_consts.className.CONTENT_BOTTOM]);
      var contentLastMessage = this.createDiv();
      this._setClass(contentLastMessage, [_consts.className.LAST_MESSAGE]);
      this._setContent(contentLastMessage, message);
      contentBottom.appendChild(contentLastMessage);

      var contentUnread = this.createSpan();
      this.setUnreadCount(contentUnread, unread);
      contentBottom.appendChild(contentUnread);

      itemContent.appendChild(contentBottom);

      item.appendChild(itemContent);

      var li = this.createLi();
      this._setDataset(li, 'channel-url', channelUrl);
      li.topTitle = contentTitle;
      li.time = contentTime;
      li.message = contentLastMessage;
      li.unread = contentUnread;
      li.appendChild(item);

      return li;
    }
  }, {
    key: 'checkEmptyList',
    value: function checkEmptyList() {
      if (this.list.childNodes.length < 1) {
        this._createEmptyItem();
      } else {
        if (this.emptyItem) {
          this.list.removeChild(this.emptyItem);
          this.emptyItem = null;
        }
      }
    }
  }, {
    key: '_createEmptyItem',
    value: function _createEmptyItem() {
      var _this4 = this;

      var emptyList = this.createDiv();
      this._setClass(emptyList, [_consts.className.EMPTY_ITEM]);

      var emptyTitle = this.createDiv();
      this._setClass(emptyTitle, [_consts.className.TITLE]);
      this._setContent(emptyTitle, TITLE_EMPTY_ITEM);

      var emptyBtn = this.createDiv();
      this._setClickEvent(emptyBtn, function () {
        _this4.btnNewChat.click();
      });
      this._setClass(emptyBtn, [_consts.className.NEW_CHAT_BTN]);
      this._setContent(emptyBtn, TITLE_EMPTY_BTN);

      emptyList.appendChild(emptyTitle);
      emptyList.appendChild(emptyBtn);
      this.emptyItem = emptyList;
      this.list.appendChild(emptyList);
    }
  }, {
    key: 'setUnreadCount',
    value: function setUnreadCount(target, count) {
      count = parseInt(count);
      this._setContent(target, count > 9 ? _consts.MAX_COUNT : count.toString());
      this._setFontSize(target, count > 9 ? _consts.MAX_FONT_ZISE : null);
      count > 0 ? (0, _utils.show)(target) : (0, _utils.hide)(target);
    }
  }, {
    key: 'addChannelClickEvent',
    value: function addChannelClickEvent(target, action) {
      this._setClickEvent(target, action);
    }
  }, {
    key: '_getListItemsArray',
    value: function _getListItemsArray() {
      return Array.prototype.slice.call(this.list.childNodes, 0);
    }
  }, {
    key: 'addListOnFirstIndex',
    value: function addListOnFirstIndex(target) {
      var _this5 = this;

      var items = this._getListItemsArray();
      items.filter(function (item) {
        if (item.getAttribute('data-channel-url') == target.getAttribute('data-channel-url')) {
          _this5.list.removeChild(item);
        }
      });
      this.list.insertBefore(target, this.list.firstChild);
    }
  }, {
    key: 'getChannelItem',
    value: function getChannelItem(channelUrl) {
      var items = this._getListItemsArray();
      var targetChannel = void 0;
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.getAttribute('data-channel-url') == channelUrl) {
          targetChannel = item;
          break;
        }
      }
      return targetChannel;
    }
  }, {
    key: 'setChannelUnread',
    value: function setChannelUnread(channelUrl, count) {
      var target = this.getChannelItem(channelUrl);
      if (target) {
        this.setUnreadCount(target.unread, count);
      }
    }
  }, {
    key: 'setChannelLastMessage',
    value: function setChannelLastMessage(channelUrl, message) {
      var target = this.getChannelItem(channelUrl);
      if (target) {
        this._setContent(target.message, message);
      }
    }
  }, {
    key: 'setChannelLastMessageTime',
    value: function setChannelLastMessageTime(channelUrl, time) {
      var target = this.getChannelItem(channelUrl);
      if (target) {
        this._setContent(target.time, time);
      }
    }
  }, {
    key: 'setChannelTitle',
    value: function setChannelTitle(channelUrl, name) {
      var target = this.getChannelItem(channelUrl);
      if (target) {
        this._setContent(target.topTitle, name);
      }
    }
  }]);

  return ListBoard;
}(_elements2.default);

exports.default = ListBoard;

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _consts = __webpack_require__(28);

var _elements = __webpack_require__(47);

var _elements2 = _interopRequireDefault(_elements);

var _utils = __webpack_require__(41);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EMPTY_STRING = '';
var TITLE_POPUP_MEMBER_LIST = 'Member List';
var TITLE_POPUP_INVITE_LIST = 'Invite Members';
var TITLE_POPUP_INVITE_BTN = 'Invite';
var MEMBER_POPUP_DEFAULT = -30;
var INVITE_POPUP_DEFAULT = -3;
var POPUP_DISTANCE = 300;

var Popup = function (_Element) {
  _inherits(Popup, _Element);

  function Popup() {
    _classCallCheck(this, Popup);

    var _this = _possibleConstructorReturn(this, (Popup.__proto__ || Object.getPrototypeOf(Popup)).call(this));

    _this._createMemberPopup();
    _this._createInvitePopup();
    return _this;
  }

  _createClass(Popup, [{
    key: 'reset',
    value: function reset() {
      this.closeMemberPopup();
      this.closeInvitePopup();
    }
  }, {
    key: 'closeMemberPopup',
    value: function closeMemberPopup() {
      (0, _utils.hide)(this.memberPopup);
      this._setContent(this.memberPopup.list, EMPTY_STRING);
    }
  }, {
    key: 'closeInvitePopup',
    value: function closeInvitePopup() {
      (0, _utils.hide)(this.invitePopup);
      this._setContent(this.invitePopup.list, EMPTY_STRING);
      this._setContent(this.invitePopup.count, '0');
      this._setContent(this.invitePopup.inviteBtn, TITLE_POPUP_INVITE_BTN);
      (0, _utils.addClass)(this.invitePopup.inviteBtn, _consts.className.DISABLED);
    }
  }, {
    key: 'showMemberPopup',
    value: function showMemberPopup(chatSection, index) {
      chatSection.appendChild(this.memberPopup);
      this._setRight(this.memberPopup, MEMBER_POPUP_DEFAULT + index * POPUP_DISTANCE);
      (0, _utils.show)(this.memberPopup);
    }
  }, {
    key: 'showInvitePopup',
    value: function showInvitePopup(chatSection, index) {
      chatSection.appendChild(this.invitePopup);
      this._setRight(this.invitePopup, INVITE_POPUP_DEFAULT + index * POPUP_DISTANCE);
      (0, _utils.show)(this.invitePopup);
    }
  }, {
    key: '_createMemberPopup',
    value: function _createMemberPopup() {
      this.memberPopup = this.createDiv();
      this._setClass(this.memberPopup, [_consts.className.POPUP, _consts.className.MEMBERS]);

      var popupBody = this.createDiv();
      this._setClass(popupBody, [_consts.className.POPUP_BODY]);

      var popupTop = this.createDiv();
      this._setClass(popupTop, [_consts.className.POPUP_TOP]);

      var topTitle = this.createDiv();
      this._setClass(topTitle, [_consts.className.TITLE]);
      this._setContent(topTitle, TITLE_POPUP_MEMBER_LIST);
      popupTop.appendChild(topTitle);

      var topCount = this.createDiv();
      this._setClass(topCount, [_consts.className.COUNT]);
      this._setContent(topCount, '0');
      popupTop.appendChild(topCount);

      this.memberCloseBtn = this.createDiv();
      this._setClass(this.memberCloseBtn, [_consts.className.BTN, _consts.className.IC_CLOSE]);
      popupTop.appendChild(this.memberCloseBtn);

      popupBody.appendChild(popupTop);

      var popupContent = this.createDiv();
      this._setClass(popupContent, [_consts.className.CONTENT]);

      var ul = this.createUl();
      popupContent.appendChild(ul);

      popupBody.appendChild(popupContent);

      this.memberPopup.list = ul;
      this.memberPopup.count = topCount;
      this.memberPopup.appendChild(popupBody);
    }
  }, {
    key: 'updateCount',
    value: function updateCount(target, count) {
      count = parseInt(count);
      this._setContent(target, count > 9 ? _consts.MAX_COUNT : count.toString());
    }
  }, {
    key: 'createMemberItem',
    value: function createMemberItem(member, isInvite, isCurrentUser) {
      var li = this.createLi();
      var div = this.createDiv();

      if (isInvite) {
        var userSelect = this.createDiv();
        this._setClass(userSelect, [_consts.className.USER_SELECT]);
        this._setDataset(userSelect, 'user-id', member.userId);
        li.select = userSelect;
        div.appendChild(userSelect);
      }

      if (isCurrentUser) {
        var userProfileMe = this.createDiv();
        this._setClass(userProfileMe, [_consts.className.IMAGE_ME]);
        div.appendChild(userProfileMe);
      }

      var userProfile = this.createDiv();
      this._setClass(userProfile, [_consts.className.IMAGE]);
      this._setBackgroundImage(userProfile, member.profileUrl);
      div.appendChild(userProfile);

      var userNickname = this.createDiv();
      this._setClass(userNickname, [_consts.className.NICKNAME]);
      this._setContent(userNickname, member.nickname);
      div.appendChild(userNickname);

      li.appendChild(div);
      return li;
    }
  }, {
    key: '_createInvitePopup',
    value: function _createInvitePopup() {
      this.invitePopup = this.createDiv();
      this._setClass(this.invitePopup, [_consts.className.POPUP, _consts.className.INVITE]);

      var popupBody = this.createDiv();
      this._setClass(popupBody, [_consts.className.POPUP_BODY]);

      var popupContent = this.createDiv();
      this._setClass(popupContent, [_consts.className.CONTENT]);

      var ul = this.createUl();
      popupContent.appendChild(ul);
      popupBody.appendChild(popupContent);

      var popupBottom = this.createDiv();
      this._setClass(popupBottom, [_consts.className.POPUP_BOTTOM]);

      var bottomTitle = this.createDiv();
      this._setClass(bottomTitle, [_consts.className.TITLE]);
      this._setContent(bottomTitle, TITLE_POPUP_INVITE_LIST);
      popupBottom.appendChild(bottomTitle);

      var bottomCount = this.createDiv();
      this._setClass(bottomCount, [_consts.className.COUNT]);
      this._setContent(bottomCount, '0');
      popupBottom.appendChild(bottomCount);

      var bottomInvite = this.createDiv();
      this._setClass(bottomInvite, [_consts.className.INVITE_BTN, _consts.className.DISABLED]);
      this._setContent(bottomInvite, TITLE_POPUP_INVITE_BTN);
      popupBottom.appendChild(bottomInvite);

      popupBody.appendChild(popupBottom);
      this.invitePopup.content = popupContent;
      this.invitePopup.list = ul;
      this.invitePopup.count = bottomCount;
      this.invitePopup.inviteBtn = bottomInvite;
      this.invitePopup.appendChild(popupBody);
    }
  }, {
    key: 'getSelectedUserIds',
    value: function getSelectedUserIds(target) {
      var items = target.querySelectorAll('.' + _consts.className.ACTIVE);
      var userIds = [];
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        userIds.push(item.getAttribute('data-user-id'));
      }
      return userIds;
    }
  }, {
    key: 'addCloseBtnClickEvent',
    value: function addCloseBtnClickEvent(action) {
      this._setClickEvent(this.memberCloseBtn, function () {
        action();
      });
    }
  }, {
    key: 'addScrollEvent',
    value: function addScrollEvent(action) {
      var _this2 = this;

      this._setScrollEvent(this.invitePopup.content, function () {
        if (_this2._isBottom(_this2.invitePopup.content, _this2.invitePopup.list)) {
          action();
        }
      });
    }
  }, {
    key: 'addClickEvent',
    value: function addClickEvent(target, action) {
      this._setClickEvent(target, action);
    }
  }]);

  return Popup;
}(_elements2.default);

exports.default = Popup;

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _consts = __webpack_require__(28);

var _elements = __webpack_require__(47);

var _elements2 = _interopRequireDefault(_elements);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EMPTY_STRING = '';

var Spinner = function (_Element) {
  _inherits(Spinner, _Element);

  function Spinner() {
    _classCallCheck(this, Spinner);

    var _this = _possibleConstructorReturn(this, (Spinner.__proto__ || Object.getPrototypeOf(Spinner)).call(this));

    _this._create();
    return _this;
  }

  _createClass(Spinner, [{
    key: '_create',
    value: function _create() {
      this.self = this.createDiv();
      this._setClass(this.self, [_consts.className.SPINNER]);
      var i;
      for (i = 0; i < 3; i++) {
        this.self.appendChild(this.createDiv());
      }
    }
  }, {
    key: 'insert',
    value: function insert(target) {
      this._setContent(target, EMPTY_STRING);
      target.appendChild(this.self);
    }
  }, {
    key: 'remove',
    value: function remove(target) {
      if (target.firstElementChild) {
        target.removeChild(this.self);
      }
    }
  }]);

  return Spinner;
}(_elements2.default);

exports.default = Spinner;

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _consts = __webpack_require__(28);

var _elements = __webpack_require__(47);

var _elements2 = _interopRequireDefault(_elements);

var _utils = __webpack_require__(41);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WidgetBtn = function (_Element) {
  _inherits(WidgetBtn, _Element);

  function WidgetBtn(widget) {
    _classCallCheck(this, WidgetBtn);

    var _this = _possibleConstructorReturn(this, (WidgetBtn.__proto__ || Object.getPrototypeOf(WidgetBtn)).call(this));

    _this._create();
    widget.appendChild(_this.self);
    return _this;
  }

  _createClass(WidgetBtn, [{
    key: 'reset',
    value: function reset() {
      this.toggleIcon(false);
      this.setUnreadCount(0);
    }
  }, {
    key: '_create',
    value: function _create() {
      this.self = this.createDiv();
      this._setClass(this.self, [_consts.className.WIDGET_BTN, _consts.className.IC_LOGIN]);

      this.unread = this.createDiv();
      this._setClass(this.unread, [_consts.className.NOTIFICATION]);

      this.self.appendChild(this.unread);
    }
  }, {
    key: 'addClickEvent',
    value: function addClickEvent(action) {
      this._setClickEvent(this.self, action);
    }
  }, {
    key: 'setUnreadCount',
    value: function setUnreadCount(count) {
      count = parseInt(count);
      this._setContent(this.unread, count > 9 ? _consts.MAX_COUNT : count.toString());
      count > 0 ? (0, _utils.show)(this.unread) : (0, _utils.hide)(this.unread);
    }
  }, {
    key: 'toggleIcon',
    value: function toggleIcon(isConnected) {
      isConnected ? (0, _utils.addClass)((0, _utils.removeClass)(this.self, _consts.className.IC_LOGIN), _consts.className.IC_CONNECTED) : (0, _utils.addClass)((0, _utils.removeClass)(this.self, _consts.className.IC_CONNECTED), _consts.className.IC_LOGIN);
    }
  }]);

  return WidgetBtn;
}(_elements2.default);

exports.default = WidgetBtn;

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _consts = __webpack_require__(28);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GLOBAL_HANDLER = 'GLOBAL_HANDLER';
var GET_MESSAGE_LIMIT = 20;

var Sendbird = function () {
  function Sendbird(appId) {
    _classCallCheck(this, Sendbird);

    this.sb = new window.SendBird({ appId: appId });
    this.channelListQuery = null;
    this.userListQuery = null;
  }

  _createClass(Sendbird, [{
    key: 'reset',
    value: function reset() {
      this.channelListQuery = null;
      this.userListQuery = null;
      this.sb.removeChannelHandler(GLOBAL_HANDLER);
    }
  }, {
    key: 'isConnected',
    value: function isConnected() {
      return !!this.sb.currentUser;
    }
  }, {
    key: 'connect',
    value: function connect(userId, nickname, action) {
      var _this = this;

      this.sb.connect(userId.trim(), function (user, error) {
        if (error) {
          console.error(error);
          return;
        }
        _this.sb.updateCurrentUserInfo(nickname.trim(), '', function (response, error) {
          if (error) {
            console.error(error);
            return;
          }
          action();
        });
      });
    }
  }, {
    key: 'disconnect',
    value: function disconnect(action) {
      if (this.isConnected()) {
        this.sb.disconnect(function () {
          action();
        });
      }
    }
  }, {
    key: 'isCurrentUser',
    value: function isCurrentUser(user) {
      return this.sb.currentUser.userId == user.userId;
    }

    /*
    Channel
     */

  }, {
    key: 'getChannelList',
    value: function getChannelList(action) {
      if (!this.channelListQuery) {
        this.channelListQuery = this.sb.GroupChannel.createMyGroupChannelListQuery();
        this.channelListQuery.includeEmpty = true;
        this.channelListQuery.limit = 20;
      }
      if (this.channelListQuery.hasNext && !this.channelListQuery.isLoading) {
        this.channelListQuery.next(function (channelList, error) {
          if (error) {
            console.error(error);
            return;
          }
          action(channelList);
        });
      }
    }
  }, {
    key: 'getChannelInfo',
    value: function getChannelInfo(channelUrl, action) {
      this.sb.GroupChannel.getChannel(channelUrl, function (channel, error) {
        if (error) {
          console.error(error);
          return;
        }
        action(channel);
      });
    }
  }, {
    key: 'createNewChannel',
    value: function createNewChannel(userIds, action) {
      this.sb.GroupChannel.createChannelWithUserIds(userIds, true, '', '', '', function (channel, error) {
        if (error) {
          console.error(error);
          return;
        }
        action(channel);
      });
    }
  }, {
    key: 'inviteMember',
    value: function inviteMember(channel, userIds, action) {
      channel.inviteWithUserIds(userIds, function (response, error) {
        if (error) {
          console.error(error);
          return;
        }
        action();
      });
    }
  }, {
    key: 'channelLeave',
    value: function channelLeave(channel, action) {
      channel.leave(function (response, error) {
        if (error) {
          console.error(error);
          return;
        }
        action();
      });
    }

    /*
    Message
     */

  }, {
    key: 'getTotalUnreadCount',
    value: function getTotalUnreadCount(action) {
      this.sb.GroupChannel.getTotalUnreadMessageCount(function (unreadCount) {
        action(unreadCount);
      });
    }
  }, {
    key: 'getMessageList',
    value: function getMessageList(channelSet, action) {
      if (!channelSet.query) {
        channelSet.query = channelSet.channel.createPreviousMessageListQuery();
      }
      if (channelSet.query.hasMore && !channelSet.query.isLoading) {
        channelSet.query.load(GET_MESSAGE_LIMIT, false, function (messageList, error) {
          if (error) {
            console.error(error);
            return;
          }
          action(messageList);
        });
      }
    }
  }, {
    key: 'sendTextMessage',
    value: function sendTextMessage(channel, textMessage, action) {
      channel.sendUserMessage(textMessage, function (message, error) {
        if (error) {
          console.error(error);
          return;
        }
        action(message);
      });
    }
  }, {
    key: 'sendFileMessage',
    value: function sendFileMessage(channel, file, action) {
      var thumbSize = [];
      if (file.type.match(/^image\/.+$/)) {
        thumbSize = [{ 'maxWidth': 160, 'maxHeight': 160 }];
      }
      channel.sendFileMessage(file, '', '', thumbSize, function (message, error) {
        if (error) {
          console.error(error);
          return;
        }
        action(message);
      });
    }

    /*
    User
     */

  }, {
    key: 'getUserList',
    value: function getUserList(action) {
      if (!this.userListQuery) {
        this.userListQuery = this.sb.createUserListQuery();
      }
      if (this.userListQuery.hasNext && !this.userListQuery.isLoading) {
        this.userListQuery.next(function (userList, error) {
          if (error) {
            console.error(error);
            return;
          }
          action(userList);
        });
      }
    }

    /*
    Handler
     */

  }, {
    key: 'createHandlerGlobal',
    value: function createHandlerGlobal() {
      var messageReceivedFunc = arguments.length <= 0 ? undefined : arguments[0];
      var ChannelChangedFunc = arguments.length <= 1 ? undefined : arguments[1];
      var typingStatusFunc = arguments.length <= 2 ? undefined : arguments[2];
      var readReceiptFunc = arguments.length <= 3 ? undefined : arguments[3];
      var userLeftFunc = arguments.length <= 4 ? undefined : arguments[4];
      var userJoinFunc = arguments.length <= 5 ? undefined : arguments[5];

      var channelHandler = new this.sb.ChannelHandler();
      channelHandler.onMessageReceived = function (channel, message) {
        messageReceivedFunc(channel, message);
      };
      channelHandler.onChannelChanged = function (channel) {
        ChannelChangedFunc(channel);
      };
      channelHandler.onTypingStatusUpdated = function (channel) {
        typingStatusFunc(channel);
      };
      channelHandler.onReadReceiptUpdated = function (channel) {
        readReceiptFunc(channel);
      };
      channelHandler.onUserLeft = function (channel, user) {
        userLeftFunc(channel, user);
      };
      channelHandler.onUserJoined = function (channel, user) {
        userJoinFunc(channel, user);
      };
      this.sb.addChannelHandler(GLOBAL_HANDLER, channelHandler);
    }

    /*
    Info
     */

  }, {
    key: 'getNicknamesString',
    value: function getNicknamesString(channel) {
      var nicknameList = [];
      var currentUserId = this.sb.currentUser.userId;
      channel.members.forEach(function (member) {
        if (member.userId != currentUserId) {
          nicknameList.push(member.nickname);
        }
      });
      return nicknameList.toString();
    }
  }, {
    key: 'getMemberCount',
    value: function getMemberCount(channel) {
      return channel.memberCount > 9 ? _consts.MAX_COUNT : channel.memberCount.toString();
    }
  }, {
    key: 'getLastMessage',
    value: function getLastMessage(channel) {
      if (channel.lastMessage) {
        return channel.lastMessage.isUserMessage() ? channel.lastMessage.message : channel.lastMessage.name;
      }
      return '';
    }
  }, {
    key: 'getMessageTime',
    value: function getMessageTime(message) {
      var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

      var _getDay = function _getDay(val) {
        var day = parseInt(val);
        if (day == 1) {
          return day + 'st';
        } else if (day == 2) {
          return day + 'en';
        } else if (day == 3) {
          return day + 'rd';
        } else {
          return day + 'th';
        }
      };

      var _checkTime = function _checkTime(val) {
        return +val < 10 ? '0' + val : val;
      };

      if (message) {
        var LAST_MESSAGE_YESTERDAY = 'YESTERDAY';
        var _nowDate = new Date();
        var _date = new Date(message.createdAt);
        if (_nowDate.getDate() - _date.getDate() == 1) {
          return LAST_MESSAGE_YESTERDAY;
        } else if (_nowDate.getFullYear() == _date.getFullYear() && _nowDate.getMonth() == _date.getMonth() && _nowDate.getDate() == _date.getDate()) {
          return _checkTime(_date.getHours()) + ':' + _checkTime(_date.getMinutes());
        } else {
          return months[_date.getMonth()] + ' ' + _getDay(_date.getDate());
        }
      }
      return '';
    }
  }, {
    key: 'getMessageReadReceiptCount',
    value: function getMessageReadReceiptCount(channel, message) {
      return channel.getReadReceipt(message);
    }
  }, {
    key: 'getChannelUnreadCount',
    value: function getChannelUnreadCount(channel) {
      return channel.unreadMessageCount;
    }
  }]);

  return Sendbird;
}();

exports.default = Sendbird;

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(125)
var ieee754 = __webpack_require__(310)
var isArray = __webpack_require__(311)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(88)))

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(136);
module.exports = __webpack_require__(24).RegExp.escape;

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4)
  , isArray  = __webpack_require__(70)
  , SPECIES  = __webpack_require__(5)('species');

module.exports = function(original){
  var C;
  if(isArray(original)){
    C = original.constructor;
    // cross-realm fallback
    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
    if(isObject(C)){
      C = C[SPECIES];
      if(C === null)C = undefined;
    }
  } return C === undefined ? Array : C;
};

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(128);

module.exports = function(original, length){
  return new (speciesConstructor(original))(length);
};

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var anObject    = __webpack_require__(1)
  , toPrimitive = __webpack_require__(23)
  , NUMBER      = 'number';

module.exports = function(hint){
  if(hint !== 'string' && hint !== NUMBER && hint !== 'default')throw TypeError('Incorrect hint');
  return toPrimitive(anObject(this), hint != NUMBER);
};

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(36)
  , gOPS    = __webpack_require__(59)
  , pIE     = __webpack_require__(50);
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

var getKeys   = __webpack_require__(36)
  , toIObject = __webpack_require__(15);
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var path      = __webpack_require__(134)
  , invoke    = __webpack_require__(55)
  , aFunction = __webpack_require__(11);
module.exports = function(/* ...pargs */){
  var fn     = aFunction(this)
    , length = arguments.length
    , pargs  = Array(length)
    , i      = 0
    , _      = path._
    , holder = false;
  while(length > i)if((pargs[i] = arguments[i++]) === _)holder = true;
  return function(/* ...args */){
    var that = this
      , aLen = arguments.length
      , j = 0, k = 0, args;
    if(!holder && !aLen)return invoke(fn, pargs, that);
    args = pargs.slice();
    if(holder)for(;length > j; j++)if(args[j] === _)args[j] = arguments[k++];
    while(aLen > k)args.push(arguments[k++]);
    return invoke(fn, args, that);
  };
};

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);

/***/ }),
/* 135 */
/***/ (function(module, exports) {

module.exports = function(regExp, replace){
  var replacer = replace === Object(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(it).replace(regExp, replacer);
  };
};

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/benjamingr/RexExp.escape
var $export = __webpack_require__(0)
  , $re     = __webpack_require__(135)(/[\\^$*+?.()|[\]{}]/g, '\\$&');

$export($export.S, 'RegExp', {escape: function escape(it){ return $re(it); }});


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = __webpack_require__(0);

$export($export.P, 'Array', {copyWithin: __webpack_require__(90)});

__webpack_require__(42)('copyWithin');

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0)
  , $every  = __webpack_require__(21)(4);

$export($export.P + $export.F * !__webpack_require__(20)([].every, true), 'Array', {
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn /* , thisArg */){
    return $every(this, callbackfn, arguments[1]);
  }
});

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = __webpack_require__(0);

$export($export.P, 'Array', {fill: __webpack_require__(62)});

__webpack_require__(42)('fill');

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0)
  , $filter = __webpack_require__(21)(2);

$export($export.P + $export.F * !__webpack_require__(20)([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */){
    return $filter(this, callbackfn, arguments[1]);
  }
});

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = __webpack_require__(0)
  , $find   = __webpack_require__(21)(6)
  , KEY     = 'findIndex'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(42)(KEY);

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = __webpack_require__(0)
  , $find   = __webpack_require__(21)(5)
  , KEY     = 'find'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(42)(KEY);

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export  = __webpack_require__(0)
  , $forEach = __webpack_require__(21)(0)
  , STRICT   = __webpack_require__(20)([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */){
    return $forEach(this, callbackfn, arguments[1]);
  }
});

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx            = __webpack_require__(25)
  , $export        = __webpack_require__(0)
  , toObject       = __webpack_require__(9)
  , call           = __webpack_require__(99)
  , isArrayIter    = __webpack_require__(69)
  , toLength       = __webpack_require__(8)
  , createProperty = __webpack_require__(63)
  , getIterFn      = __webpack_require__(86);

$export($export.S + $export.F * !__webpack_require__(57)(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export       = __webpack_require__(0)
  , $indexOf      = __webpack_require__(51)(false)
  , $native       = [].indexOf
  , NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__(20)($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /*, fromIndex = 0 */){
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = __webpack_require__(0);

$export($export.S, 'Array', {isArray: __webpack_require__(70)});

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.13 Array.prototype.join(separator)
var $export   = __webpack_require__(0)
  , toIObject = __webpack_require__(15)
  , arrayJoin = [].join;

// fallback for not array-like strings
$export($export.P + $export.F * (__webpack_require__(49) != Object || !__webpack_require__(20)(arrayJoin)), 'Array', {
  join: function join(separator){
    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
  }
});

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export       = __webpack_require__(0)
  , toIObject     = __webpack_require__(15)
  , toInteger     = __webpack_require__(31)
  , toLength      = __webpack_require__(8)
  , $native       = [].lastIndexOf
  , NEGATIVE_ZERO = !!$native && 1 / [1].lastIndexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__(20)($native)), 'Array', {
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function lastIndexOf(searchElement /*, fromIndex = @[*-1] */){
    // convert -0 to +0
    if(NEGATIVE_ZERO)return $native.apply(this, arguments) || 0;
    var O      = toIObject(this)
      , length = toLength(O.length)
      , index  = length - 1;
    if(arguments.length > 1)index = Math.min(index, toInteger(arguments[1]));
    if(index < 0)index = length + index;
    for(;index >= 0; index--)if(index in O)if(O[index] === searchElement)return index || 0;
    return -1;
  }
});

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0)
  , $map    = __webpack_require__(21)(1);

$export($export.P + $export.F * !__webpack_require__(20)([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */){
    return $map(this, callbackfn, arguments[1]);
  }
});

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export        = __webpack_require__(0)
  , createProperty = __webpack_require__(63);

// WebKit Array.of isn't generic
$export($export.S + $export.F * __webpack_require__(3)(function(){
  function F(){}
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */){
    var index  = 0
      , aLen   = arguments.length
      , result = new (typeof this == 'function' ? this : Array)(aLen);
    while(aLen > index)createProperty(result, index, arguments[index++]);
    result.length = aLen;
    return result;
  }
});

/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0)
  , $reduce = __webpack_require__(92);

$export($export.P + $export.F * !__webpack_require__(20)([].reduceRight, true), 'Array', {
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: function reduceRight(callbackfn /* , initialValue */){
    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
  }
});

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0)
  , $reduce = __webpack_require__(92);

$export($export.P + $export.F * !__webpack_require__(20)([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn /* , initialValue */){
    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});

/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export    = __webpack_require__(0)
  , html       = __webpack_require__(67)
  , cof        = __webpack_require__(18)
  , toIndex    = __webpack_require__(39)
  , toLength   = __webpack_require__(8)
  , arraySlice = [].slice;

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * __webpack_require__(3)(function(){
  if(html)arraySlice.call(html);
}), 'Array', {
  slice: function slice(begin, end){
    var len   = toLength(this.length)
      , klass = cof(this);
    end = end === undefined ? len : end;
    if(klass == 'Array')return arraySlice.call(this, begin, end);
    var start  = toIndex(begin, len)
      , upTo   = toIndex(end, len)
      , size   = toLength(upTo - start)
      , cloned = Array(size)
      , i      = 0;
    for(; i < size; i++)cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0)
  , $some   = __webpack_require__(21)(3);

$export($export.P + $export.F * !__webpack_require__(20)([].some, true), 'Array', {
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn /* , thisArg */){
    return $some(this, callbackfn, arguments[1]);
  }
});

/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export   = __webpack_require__(0)
  , aFunction = __webpack_require__(11)
  , toObject  = __webpack_require__(9)
  , fails     = __webpack_require__(3)
  , $sort     = [].sort
  , test      = [1, 2, 3];

$export($export.P + $export.F * (fails(function(){
  // IE8-
  test.sort(undefined);
}) || !fails(function(){
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !__webpack_require__(20)($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn){
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});

/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(38)('Array');

/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

// 20.3.3.1 / 15.9.4.4 Date.now()
var $export = __webpack_require__(0);

$export($export.S, 'Date', {now: function(){ return new Date().getTime(); }});

/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var $export = __webpack_require__(0)
  , fails   = __webpack_require__(3)
  , getTime = Date.prototype.getTime;

var lz = function(num){
  return num > 9 ? num : '0' + num;
};

// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (fails(function(){
  return new Date(-5e13 - 1).toISOString() != '0385-07-25T07:06:39.999Z';
}) || !fails(function(){
  new Date(NaN).toISOString();
})), 'Date', {
  toISOString: function toISOString(){
    if(!isFinite(getTime.call(this)))throw RangeError('Invalid time value');
    var d = this
      , y = d.getUTCFullYear()
      , m = d.getUTCMilliseconds()
      , s = y < 0 ? '-' : y > 9999 ? '+' : '';
    return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
      '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
      'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
      ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
  }
});

/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export     = __webpack_require__(0)
  , toObject    = __webpack_require__(9)
  , toPrimitive = __webpack_require__(23);

$export($export.P + $export.F * __webpack_require__(3)(function(){
  return new Date(NaN).toJSON() !== null || Date.prototype.toJSON.call({toISOString: function(){ return 1; }}) !== 1;
}), 'Date', {
  toJSON: function toJSON(key){
    var O  = toObject(this)
      , pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});

/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

var TO_PRIMITIVE = __webpack_require__(5)('toPrimitive')
  , proto        = Date.prototype;

if(!(TO_PRIMITIVE in proto))__webpack_require__(12)(proto, TO_PRIMITIVE, __webpack_require__(130));

/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

var DateProto    = Date.prototype
  , INVALID_DATE = 'Invalid Date'
  , TO_STRING    = 'toString'
  , $toString    = DateProto[TO_STRING]
  , getTime      = DateProto.getTime;
if(new Date(NaN) + '' != INVALID_DATE){
  __webpack_require__(13)(DateProto, TO_STRING, function toString(){
    var value = getTime.call(this);
    return value === value ? $toString.call(this) : INVALID_DATE;
  });
}

/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = __webpack_require__(0);

$export($export.P, 'Function', {bind: __webpack_require__(93)});

/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isObject       = __webpack_require__(4)
  , getPrototypeOf = __webpack_require__(17)
  , HAS_INSTANCE   = __webpack_require__(5)('hasInstance')
  , FunctionProto  = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if(!(HAS_INSTANCE in FunctionProto))__webpack_require__(7).f(FunctionProto, HAS_INSTANCE, {value: function(O){
  if(typeof this != 'function' || !isObject(O))return false;
  if(!isObject(this.prototype))return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while(O = getPrototypeOf(O))if(this.prototype === O)return true;
  return false;
}});

/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(7).f
  , createDesc = __webpack_require__(30)
  , has        = __webpack_require__(10)
  , FProto     = Function.prototype
  , nameRE     = /^\s*function ([^ (]*)/
  , NAME       = 'name';

var isExtensible = Object.isExtensible || function(){
  return true;
};

// 19.2.4.2 name
NAME in FProto || __webpack_require__(6) && dP(FProto, NAME, {
  configurable: true,
  get: function(){
    try {
      var that = this
        , name = ('' + that).match(nameRE)[1];
      has(that, NAME) || !isExtensible(that) || dP(that, NAME, createDesc(5, name));
      return name;
    } catch(e){
      return '';
    }
  }
});

/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.3 Math.acosh(x)
var $export = __webpack_require__(0)
  , log1p   = __webpack_require__(101)
  , sqrt    = Math.sqrt
  , $acosh  = Math.acosh;

$export($export.S + $export.F * !($acosh
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  && Math.floor($acosh(Number.MAX_VALUE)) == 710
  // Tor Browser bug: Math.acosh(Infinity) -> NaN 
  && $acosh(Infinity) == Infinity
), 'Math', {
  acosh: function acosh(x){
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});

/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.5 Math.asinh(x)
var $export = __webpack_require__(0)
  , $asinh  = Math.asinh;

function asinh(x){
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

// Tor Browser bug: Math.asinh(0) -> -0 
$export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', {asinh: asinh});

/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.7 Math.atanh(x)
var $export = __webpack_require__(0)
  , $atanh  = Math.atanh;

// Tor Browser bug: Math.atanh(-0) -> 0 
$export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
  atanh: function atanh(x){
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});

/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.9 Math.cbrt(x)
var $export = __webpack_require__(0)
  , sign    = __webpack_require__(74);

$export($export.S, 'Math', {
  cbrt: function cbrt(x){
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});

/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.11 Math.clz32(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  clz32: function clz32(x){
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});

/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.12 Math.cosh(x)
var $export = __webpack_require__(0)
  , exp     = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x){
    return (exp(x = +x) + exp(-x)) / 2;
  }
});

/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.14 Math.expm1(x)
var $export = __webpack_require__(0)
  , $expm1  = __webpack_require__(73);

$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', {expm1: $expm1});

/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.16 Math.fround(x)
var $export   = __webpack_require__(0)
  , sign      = __webpack_require__(74)
  , pow       = Math.pow
  , EPSILON   = pow(2, -52)
  , EPSILON32 = pow(2, -23)
  , MAX32     = pow(2, 127) * (2 - EPSILON32)
  , MIN32     = pow(2, -126);

var roundTiesToEven = function(n){
  return n + 1 / EPSILON - 1 / EPSILON;
};


$export($export.S, 'Math', {
  fround: function fround(x){
    var $abs  = Math.abs(x)
      , $sign = sign(x)
      , a, result;
    if($abs < MIN32)return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
    a = (1 + EPSILON32 / EPSILON) * $abs;
    result = a - (a - $abs);
    if(result > MAX32 || result != result)return $sign * Infinity;
    return $sign * result;
  }
});

/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = __webpack_require__(0)
  , abs     = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2){ // eslint-disable-line no-unused-vars
    var sum  = 0
      , i    = 0
      , aLen = arguments.length
      , larg = 0
      , arg, div;
    while(i < aLen){
      arg = abs(arguments[i++]);
      if(larg < arg){
        div  = larg / arg;
        sum  = sum * div * div + 1;
        larg = arg;
      } else if(arg > 0){
        div  = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});

/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.18 Math.imul(x, y)
var $export = __webpack_require__(0)
  , $imul   = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * __webpack_require__(3)(function(){
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y){
    var UINT16 = 0xffff
      , xn = +x
      , yn = +y
      , xl = UINT16 & xn
      , yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});

/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.21 Math.log10(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  log10: function log10(x){
    return Math.log(x) / Math.LN10;
  }
});

/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.20 Math.log1p(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {log1p: __webpack_require__(101)});

/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.22 Math.log2(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  log2: function log2(x){
    return Math.log(x) / Math.LN2;
  }
});

/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.28 Math.sign(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {sign: __webpack_require__(74)});

/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.30 Math.sinh(x)
var $export = __webpack_require__(0)
  , expm1   = __webpack_require__(73)
  , exp     = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * __webpack_require__(3)(function(){
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x){
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});

/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.33 Math.tanh(x)
var $export = __webpack_require__(0)
  , expm1   = __webpack_require__(73)
  , exp     = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x){
    var a = expm1(x = +x)
      , b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});

/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.34 Math.trunc(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  trunc: function trunc(it){
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});

/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global            = __webpack_require__(2)
  , has               = __webpack_require__(10)
  , cof               = __webpack_require__(18)
  , inheritIfRequired = __webpack_require__(68)
  , toPrimitive       = __webpack_require__(23)
  , fails             = __webpack_require__(3)
  , gOPN              = __webpack_require__(35).f
  , gOPD              = __webpack_require__(16).f
  , dP                = __webpack_require__(7).f
  , $trim             = __webpack_require__(46).trim
  , NUMBER            = 'Number'
  , $Number           = global[NUMBER]
  , Base              = $Number
  , proto             = $Number.prototype
  // Opera ~12 has broken Object#toString
  , BROKEN_COF        = cof(__webpack_require__(34)(proto)) == NUMBER
  , TRIM              = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function(argument){
  var it = toPrimitive(argument, false);
  if(typeof it == 'string' && it.length > 2){
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0)
      , third, radix, maxCode;
    if(first === 43 || first === 45){
      third = it.charCodeAt(2);
      if(third === 88 || third === 120)return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if(first === 48){
      switch(it.charCodeAt(1)){
        case 66 : case 98  : radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79 : case 111 : radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default : return +it;
      }
      for(var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++){
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if(code < 48 || code > maxCode)return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if(!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')){
  $Number = function Number(value){
    var it = arguments.length < 1 ? 0 : value
      , that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function(){ proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for(var keys = __webpack_require__(6) ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++){
    if(has(Base, key = keys[j]) && !has($Number, key)){
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  __webpack_require__(13)(global, NUMBER, $Number);
}

/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.1 Number.EPSILON
var $export = __webpack_require__(0);

$export($export.S, 'Number', {EPSILON: Math.pow(2, -52)});

/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.2 Number.isFinite(number)
var $export   = __webpack_require__(0)
  , _isFinite = __webpack_require__(2).isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it){
    return typeof it == 'number' && _isFinite(it);
  }
});

/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var $export = __webpack_require__(0);

$export($export.S, 'Number', {isInteger: __webpack_require__(98)});

/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.4 Number.isNaN(number)
var $export = __webpack_require__(0);

$export($export.S, 'Number', {
  isNaN: function isNaN(number){
    return number != number;
  }
});

/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.5 Number.isSafeInteger(number)
var $export   = __webpack_require__(0)
  , isInteger = __webpack_require__(98)
  , abs       = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number){
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});

/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = __webpack_require__(0);

$export($export.S, 'Number', {MAX_SAFE_INTEGER: 0x1fffffffffffff});

/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = __webpack_require__(0);

$export($export.S, 'Number', {MIN_SAFE_INTEGER: -0x1fffffffffffff});

/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

var $export     = __webpack_require__(0)
  , $parseFloat = __webpack_require__(108);
// 20.1.2.12 Number.parseFloat(string)
$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', {parseFloat: $parseFloat});

/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

var $export   = __webpack_require__(0)
  , $parseInt = __webpack_require__(109);
// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', {parseInt: $parseInt});

/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export      = __webpack_require__(0)
  , toInteger    = __webpack_require__(31)
  , aNumberValue = __webpack_require__(89)
  , repeat       = __webpack_require__(81)
  , $toFixed     = 1..toFixed
  , floor        = Math.floor
  , data         = [0, 0, 0, 0, 0, 0]
  , ERROR        = 'Number.toFixed: incorrect invocation!'
  , ZERO         = '0';

var multiply = function(n, c){
  var i  = -1
    , c2 = c;
  while(++i < 6){
    c2 += n * data[i];
    data[i] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};
var divide = function(n){
  var i = 6
    , c = 0;
  while(--i >= 0){
    c += data[i];
    data[i] = floor(c / n);
    c = (c % n) * 1e7;
  }
};
var numToString = function(){
  var i = 6
    , s = '';
  while(--i >= 0){
    if(s !== '' || i === 0 || data[i] !== 0){
      var t = String(data[i]);
      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
    }
  } return s;
};
var pow = function(x, n, acc){
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};
var log = function(x){
  var n  = 0
    , x2 = x;
  while(x2 >= 4096){
    n += 12;
    x2 /= 4096;
  }
  while(x2 >= 2){
    n  += 1;
    x2 /= 2;
  } return n;
};

$export($export.P + $export.F * (!!$toFixed && (
  0.00008.toFixed(3) !== '0.000' ||
  0.9.toFixed(0) !== '1' ||
  1.255.toFixed(2) !== '1.25' ||
  1000000000000000128..toFixed(0) !== '1000000000000000128'
) || !__webpack_require__(3)(function(){
  // V8 ~ Android 4.3-
  $toFixed.call({});
})), 'Number', {
  toFixed: function toFixed(fractionDigits){
    var x = aNumberValue(this, ERROR)
      , f = toInteger(fractionDigits)
      , s = ''
      , m = ZERO
      , e, z, j, k;
    if(f < 0 || f > 20)throw RangeError(ERROR);
    if(x != x)return 'NaN';
    if(x <= -1e21 || x >= 1e21)return String(x);
    if(x < 0){
      s = '-';
      x = -x;
    }
    if(x > 1e-21){
      e = log(x * pow(2, 69, 1)) - 69;
      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if(e > 0){
        multiply(0, z);
        j = f;
        while(j >= 7){
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow(10, j, 1), 0);
        j = e - 1;
        while(j >= 23){
          divide(1 << 23);
          j -= 23;
        }
        divide(1 << j);
        multiply(1, 1);
        divide(2);
        m = numToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        m = numToString() + repeat.call(ZERO, f);
      }
    }
    if(f > 0){
      k = m.length;
      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
    } else {
      m = s + m;
    } return m;
  }
});

/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export      = __webpack_require__(0)
  , $fails       = __webpack_require__(3)
  , aNumberValue = __webpack_require__(89)
  , $toPrecision = 1..toPrecision;

$export($export.P + $export.F * ($fails(function(){
  // IE7-
  return $toPrecision.call(1, undefined) !== '1';
}) || !$fails(function(){
  // V8 ~ Android 4.3-
  $toPrecision.call({});
})), 'Number', {
  toPrecision: function toPrecision(precision){
    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision); 
  }
});

/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(0);

$export($export.S + $export.F, 'Object', {assign: __webpack_require__(102)});

/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0)
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: __webpack_require__(34)});

/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !__webpack_require__(6), 'Object', {defineProperties: __webpack_require__(103)});

/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(6), 'Object', {defineProperty: __webpack_require__(7).f});

/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.5 Object.freeze(O)
var isObject = __webpack_require__(4)
  , meta     = __webpack_require__(29).onFreeze;

__webpack_require__(22)('freeze', function($freeze){
  return function freeze(it){
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});

/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject                 = __webpack_require__(15)
  , $getOwnPropertyDescriptor = __webpack_require__(16).f;

__webpack_require__(22)('getOwnPropertyDescriptor', function(){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});

/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 Object.getOwnPropertyNames(O)
__webpack_require__(22)('getOwnPropertyNames', function(){
  return __webpack_require__(104).f;
});

/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject        = __webpack_require__(9)
  , $getPrototypeOf = __webpack_require__(17);

__webpack_require__(22)('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});

/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.11 Object.isExtensible(O)
var isObject = __webpack_require__(4);

__webpack_require__(22)('isExtensible', function($isExtensible){
  return function isExtensible(it){
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});

/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.12 Object.isFrozen(O)
var isObject = __webpack_require__(4);

__webpack_require__(22)('isFrozen', function($isFrozen){
  return function isFrozen(it){
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});

/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.13 Object.isSealed(O)
var isObject = __webpack_require__(4);

__webpack_require__(22)('isSealed', function($isSealed){
  return function isSealed(it){
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});

/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.10 Object.is(value1, value2)
var $export = __webpack_require__(0);
$export($export.S, 'Object', {is: __webpack_require__(110)});

/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(9)
  , $keys    = __webpack_require__(36);

__webpack_require__(22)('keys', function(){
  return function keys(it){
    return $keys(toObject(it));
  };
});

/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.15 Object.preventExtensions(O)
var isObject = __webpack_require__(4)
  , meta     = __webpack_require__(29).onFreeze;

__webpack_require__(22)('preventExtensions', function($preventExtensions){
  return function preventExtensions(it){
    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});

/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.17 Object.seal(O)
var isObject = __webpack_require__(4)
  , meta     = __webpack_require__(29).onFreeze;

__webpack_require__(22)('seal', function($seal){
  return function seal(it){
    return $seal && isObject(it) ? $seal(meta(it)) : it;
  };
});

/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(0);
$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(76).set});

/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.3.6 Object.prototype.toString()
var classof = __webpack_require__(48)
  , test    = {};
test[__webpack_require__(5)('toStringTag')] = 'z';
if(test + '' != '[object z]'){
  __webpack_require__(13)(Object.prototype, 'toString', function toString(){
    return '[object ' + classof(this) + ']';
  }, true);
}

/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

var $export     = __webpack_require__(0)
  , $parseFloat = __webpack_require__(108);
// 18.2.4 parseFloat(string)
$export($export.G + $export.F * (parseFloat != $parseFloat), {parseFloat: $parseFloat});

/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

var $export   = __webpack_require__(0)
  , $parseInt = __webpack_require__(109);
// 18.2.5 parseInt(string, radix)
$export($export.G + $export.F * (parseInt != $parseInt), {parseInt: $parseInt});

/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY            = __webpack_require__(33)
  , global             = __webpack_require__(2)
  , ctx                = __webpack_require__(25)
  , classof            = __webpack_require__(48)
  , $export            = __webpack_require__(0)
  , isObject           = __webpack_require__(4)
  , aFunction          = __webpack_require__(11)
  , anInstance         = __webpack_require__(32)
  , forOf              = __webpack_require__(43)
  , speciesConstructor = __webpack_require__(78)
  , task               = __webpack_require__(83).set
  , microtask          = __webpack_require__(75)()
  , PROMISE            = 'Promise'
  , TypeError          = global.TypeError
  , process            = global.process
  , $Promise           = global[PROMISE]
  , process            = global.process
  , isNode             = classof(process) == 'process'
  , empty              = function(){ /* empty */ }
  , Internal, GenericPromiseCapability, Wrapper;

var USE_NATIVE = !!function(){
  try {
    // correct subclassing with @@species support
    var promise     = $Promise.resolve(1)
      , FakePromise = (promise.constructor = {})[__webpack_require__(5)('species')] = function(exec){ exec(empty, empty); };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch(e){ /* empty */ }
}();

// helpers
var sameConstructor = function(a, b){
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function(C){
  return sameConstructor($Promise, C)
    ? new PromiseCapability(C)
    : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject  = aFunction(reject);
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(promise, isReject){
  if(promise._n)return;
  promise._n = true;
  var chain = promise._c;
  microtask(function(){
    var value = promise._v
      , ok    = promise._s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , domain  = reaction.domain
        , result, then;
      try {
        if(handler){
          if(!ok){
            if(promise._h == 2)onHandleUnhandled(promise);
            promise._h = 1;
          }
          if(handler === true)result = value;
          else {
            if(domain)domain.enter();
            result = handler(value);
            if(domain)domain.exit();
          }
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if(isReject && !promise._h)onUnhandled(promise);
  });
};
var onUnhandled = function(promise){
  task.call(global, function(){
    var value = promise._v
      , abrupt, handler, console;
    if(isUnhandled(promise)){
      abrupt = perform(function(){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if(abrupt)throw abrupt.error;
  });
};
var isUnhandled = function(promise){
  if(promise._h == 1)return false;
  var chain = promise._a || promise._c
    , i     = 0
    , reaction;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var onHandleUnhandled = function(promise){
  task.call(global, function(){
    var handler;
    if(isNode){
      process.emit('rejectionHandled', promise);
    } else if(handler = global.onrejectionhandled){
      handler({promise: promise, reason: promise._v});
    }
  });
};
var $reject = function(value){
  var promise = this;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if(!promise._a)promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function(value){
  var promise = this
    , then;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if(promise === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      microtask(function(){
        var wrapper = {_w: promise, _d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch(e){
    $reject.call({_w: promise, _d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor){
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch(err){
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor){
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(37)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail   = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if(this._a)this._a.push(reaction);
      if(this._s)notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function(){
    var promise  = new Internal;
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject  = ctx($reject, promise, 1);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
__webpack_require__(45)($Promise, PROMISE);
__webpack_require__(38)(PROMISE);
Wrapper = __webpack_require__(24)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = newPromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
    var capability = newPromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(57)(function(iter){
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject;
    var abrupt = perform(function(){
      var values    = []
        , index     = 0
        , remaining = 1;
      forOf(iterable, false, function(promise){
        var $index        = index++
          , alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled  = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});

/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export   = __webpack_require__(0)
  , aFunction = __webpack_require__(11)
  , anObject  = __webpack_require__(1)
  , rApply    = (__webpack_require__(2).Reflect || {}).apply
  , fApply    = Function.apply;
// MS Edge argumentsList argument is optional
$export($export.S + $export.F * !__webpack_require__(3)(function(){
  rApply(function(){});
}), 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList){
    var T = aFunction(target)
      , L = anObject(argumentsList);
    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
  }
});

/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $export    = __webpack_require__(0)
  , create     = __webpack_require__(34)
  , aFunction  = __webpack_require__(11)
  , anObject   = __webpack_require__(1)
  , isObject   = __webpack_require__(4)
  , fails      = __webpack_require__(3)
  , bind       = __webpack_require__(93)
  , rConstruct = (__webpack_require__(2).Reflect || {}).construct;

// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function(){
  function F(){}
  return !(rConstruct(function(){}, [], F) instanceof F);
});
var ARGS_BUG = !fails(function(){
  rConstruct(function(){});
});

$export($export.S + $export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
  construct: function construct(Target, args /*, newTarget*/){
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if(ARGS_BUG && !NEW_TARGET_BUG)return rConstruct(Target, args, newTarget);
    if(Target == newTarget){
      // w/o altered newTarget, optimization for 0-4 arguments
      switch(args.length){
        case 0: return new Target;
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args));
    }
    // with altered newTarget, not support built-in constructors
    var proto    = newTarget.prototype
      , instance = create(isObject(proto) ? proto : Object.prototype)
      , result   = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});

/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP          = __webpack_require__(7)
  , $export     = __webpack_require__(0)
  , anObject    = __webpack_require__(1)
  , toPrimitive = __webpack_require__(23);

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * __webpack_require__(3)(function(){
  Reflect.defineProperty(dP.f({}, 1, {value: 1}), 1, {value: 2});
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes){
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch(e){
      return false;
    }
  }
});

/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export  = __webpack_require__(0)
  , gOPD     = __webpack_require__(16).f
  , anObject = __webpack_require__(1);

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey){
    var desc = gOPD(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});

/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 26.1.5 Reflect.enumerate(target)
var $export  = __webpack_require__(0)
  , anObject = __webpack_require__(1);
var Enumerate = function(iterated){
  this._t = anObject(iterated); // target
  this._i = 0;                  // next index
  var keys = this._k = []       // keys
    , key;
  for(key in iterated)keys.push(key);
};
__webpack_require__(71)(Enumerate, 'Object', function(){
  var that = this
    , keys = that._k
    , key;
  do {
    if(that._i >= keys.length)return {value: undefined, done: true};
  } while(!((key = keys[that._i++]) in that._t));
  return {value: key, done: false};
});

$export($export.S, 'Reflect', {
  enumerate: function enumerate(target){
    return new Enumerate(target);
  }
});

/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var gOPD     = __webpack_require__(16)
  , $export  = __webpack_require__(0)
  , anObject = __webpack_require__(1);

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey){
    return gOPD.f(anObject(target), propertyKey);
  }
});

/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.8 Reflect.getPrototypeOf(target)
var $export  = __webpack_require__(0)
  , getProto = __webpack_require__(17)
  , anObject = __webpack_require__(1);

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target){
    return getProto(anObject(target));
  }
});

/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var gOPD           = __webpack_require__(16)
  , getPrototypeOf = __webpack_require__(17)
  , has            = __webpack_require__(10)
  , $export        = __webpack_require__(0)
  , isObject       = __webpack_require__(4)
  , anObject       = __webpack_require__(1);

function get(target, propertyKey/*, receiver*/){
  var receiver = arguments.length < 3 ? target : arguments[2]
    , desc, proto;
  if(anObject(target) === receiver)return target[propertyKey];
  if(desc = gOPD.f(target, propertyKey))return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if(isObject(proto = getPrototypeOf(target)))return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', {get: get});

/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.9 Reflect.has(target, propertyKey)
var $export = __webpack_require__(0);

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey){
    return propertyKey in target;
  }
});

/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.10 Reflect.isExtensible(target)
var $export       = __webpack_require__(0)
  , anObject      = __webpack_require__(1)
  , $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target){
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});

/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.11 Reflect.ownKeys(target)
var $export = __webpack_require__(0);

$export($export.S, 'Reflect', {ownKeys: __webpack_require__(107)});

/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.12 Reflect.preventExtensions(target)
var $export            = __webpack_require__(0)
  , anObject           = __webpack_require__(1)
  , $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target){
    anObject(target);
    try {
      if($preventExtensions)$preventExtensions(target);
      return true;
    } catch(e){
      return false;
    }
  }
});

/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export  = __webpack_require__(0)
  , setProto = __webpack_require__(76);

if(setProto)$export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto){
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch(e){
      return false;
    }
  }
});

/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var dP             = __webpack_require__(7)
  , gOPD           = __webpack_require__(16)
  , getPrototypeOf = __webpack_require__(17)
  , has            = __webpack_require__(10)
  , $export        = __webpack_require__(0)
  , createDesc     = __webpack_require__(30)
  , anObject       = __webpack_require__(1)
  , isObject       = __webpack_require__(4);

function set(target, propertyKey, V/*, receiver*/){
  var receiver = arguments.length < 4 ? target : arguments[3]
    , ownDesc  = gOPD.f(anObject(target), propertyKey)
    , existingDescriptor, proto;
  if(!ownDesc){
    if(isObject(proto = getPrototypeOf(target))){
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if(has(ownDesc, 'value')){
    if(ownDesc.writable === false || !isObject(receiver))return false;
    existingDescriptor = gOPD.f(receiver, propertyKey) || createDesc(0);
    existingDescriptor.value = V;
    dP.f(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', {set: set});

/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

var global            = __webpack_require__(2)
  , inheritIfRequired = __webpack_require__(68)
  , dP                = __webpack_require__(7).f
  , gOPN              = __webpack_require__(35).f
  , isRegExp          = __webpack_require__(56)
  , $flags            = __webpack_require__(54)
  , $RegExp           = global.RegExp
  , Base              = $RegExp
  , proto             = $RegExp.prototype
  , re1               = /a/g
  , re2               = /a/g
  // "new" creates a new object, old webkit buggy here
  , CORRECT_NEW       = new $RegExp(re1) !== re1;

if(__webpack_require__(6) && (!CORRECT_NEW || __webpack_require__(3)(function(){
  re2[__webpack_require__(5)('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))){
  $RegExp = function RegExp(p, f){
    var tiRE = this instanceof $RegExp
      , piRE = isRegExp(p)
      , fiU  = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function(key){
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function(){ return Base[key]; },
      set: function(it){ Base[key] = it; }
    });
  };
  for(var keys = gOPN(Base), i = 0; keys.length > i; )proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  __webpack_require__(13)(global, 'RegExp', $RegExp);
}

__webpack_require__(38)('RegExp');

/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

// @@match logic
__webpack_require__(53)('match', 1, function(defined, MATCH, $match){
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});

/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

// @@replace logic
__webpack_require__(53)('replace', 2, function(defined, REPLACE, $replace){
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue){
    'use strict';
    var O  = defined(this)
      , fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});

/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

// @@search logic
__webpack_require__(53)('search', 1, function(defined, SEARCH, $search){
  // 21.1.3.15 String.prototype.search(regexp)
  return [function search(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  }, $search];
});

/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

// @@split logic
__webpack_require__(53)('split', 2, function(defined, SPLIT, $split){
  'use strict';
  var isRegExp   = __webpack_require__(56)
    , _split     = $split
    , $push      = [].push
    , $SPLIT     = 'split'
    , LENGTH     = 'length'
    , LAST_INDEX = 'lastIndex';
  if(
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ){
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it
    $split = function(separator, limit){
      var string = String(this);
      if(separator === undefined && limit === 0)return [];
      // If `separator` is not a regex, use native split
      if(!isRegExp(separator))return _split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var separator2, match, lastIndex, lastLength, i;
      // Doesn't need flags gy, but they don't hurt
      if(!NPCG)separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
      while(match = separatorCopy.exec(string)){
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];
        if(lastIndex > lastLastIndex){
          output.push(string.slice(lastLastIndex, match.index));
          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          if(!NPCG && match[LENGTH] > 1)match[0].replace(separator2, function(){
            for(i = 1; i < arguments[LENGTH] - 2; i++)if(arguments[i] === undefined)match[i] = undefined;
          });
          if(match[LENGTH] > 1 && match.index < string[LENGTH])$push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if(output[LENGTH] >= splitLimit)break;
        }
        if(separatorCopy[LAST_INDEX] === match.index)separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if(lastLastIndex === string[LENGTH]){
        if(lastLength || !separatorCopy.test(''))output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if('0'[$SPLIT](undefined, 0)[LENGTH]){
    $split = function(separator, limit){
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  }
  // 21.1.3.17 String.prototype.split(separator, limit)
  return [function split(separator, limit){
    var O  = defined(this)
      , fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});

/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(114);
var anObject    = __webpack_require__(1)
  , $flags      = __webpack_require__(54)
  , DESCRIPTORS = __webpack_require__(6)
  , TO_STRING   = 'toString'
  , $toString   = /./[TO_STRING];

var define = function(fn){
  __webpack_require__(13)(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if(__webpack_require__(3)(function(){ return $toString.call({source: 'a', flags: 'b'}) != '/a/b'; })){
  define(function toString(){
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if($toString.name != TO_STRING){
  define(function toString(){
    return $toString.call(this);
  });
}

/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.2 String.prototype.anchor(name)
__webpack_require__(14)('anchor', function(createHTML){
  return function anchor(name){
    return createHTML(this, 'a', 'name', name);
  }
});

/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.3 String.prototype.big()
__webpack_require__(14)('big', function(createHTML){
  return function big(){
    return createHTML(this, 'big', '', '');
  }
});

/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.4 String.prototype.blink()
__webpack_require__(14)('blink', function(createHTML){
  return function blink(){
    return createHTML(this, 'blink', '', '');
  }
});

/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.5 String.prototype.bold()
__webpack_require__(14)('bold', function(createHTML){
  return function bold(){
    return createHTML(this, 'b', '', '');
  }
});

/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0)
  , $at     = __webpack_require__(79)(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos){
    return $at(this, pos);
  }
});

/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])

var $export   = __webpack_require__(0)
  , toLength  = __webpack_require__(8)
  , context   = __webpack_require__(80)
  , ENDS_WITH = 'endsWith'
  , $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * __webpack_require__(66)(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /*, endPosition = @length */){
    var that = context(this, searchString, ENDS_WITH)
      , endPosition = arguments.length > 1 ? arguments[1] : undefined
      , len    = toLength(that.length)
      , end    = endPosition === undefined ? len : Math.min(toLength(endPosition), len)
      , search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});

/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.6 String.prototype.fixed()
__webpack_require__(14)('fixed', function(createHTML){
  return function fixed(){
    return createHTML(this, 'tt', '', '');
  }
});

/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.7 String.prototype.fontcolor(color)
__webpack_require__(14)('fontcolor', function(createHTML){
  return function fontcolor(color){
    return createHTML(this, 'font', 'color', color);
  }
});

/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.8 String.prototype.fontsize(size)
__webpack_require__(14)('fontsize', function(createHTML){
  return function fontsize(size){
    return createHTML(this, 'font', 'size', size);
  }
});

/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

var $export        = __webpack_require__(0)
  , toIndex        = __webpack_require__(39)
  , fromCharCode   = String.fromCharCode
  , $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x){ // eslint-disable-line no-unused-vars
    var res  = []
      , aLen = arguments.length
      , i    = 0
      , code;
    while(aLen > i){
      code = +arguments[i++];
      if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});

/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.7 String.prototype.includes(searchString, position = 0)

var $export  = __webpack_require__(0)
  , context  = __webpack_require__(80)
  , INCLUDES = 'includes';

$export($export.P + $export.F * __webpack_require__(66)(INCLUDES), 'String', {
  includes: function includes(searchString /*, position = 0 */){
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});

/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.9 String.prototype.italics()
__webpack_require__(14)('italics', function(createHTML){
  return function italics(){
    return createHTML(this, 'i', '', '');
  }
});

/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at  = __webpack_require__(79)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(72)(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.10 String.prototype.link(url)
__webpack_require__(14)('link', function(createHTML){
  return function link(url){
    return createHTML(this, 'a', 'href', url);
  }
});

/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

var $export   = __webpack_require__(0)
  , toIObject = __webpack_require__(15)
  , toLength  = __webpack_require__(8);

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite){
    var tpl  = toIObject(callSite.raw)
      , len  = toLength(tpl.length)
      , aLen = arguments.length
      , res  = []
      , i    = 0;
    while(len > i){
      res.push(String(tpl[i++]));
      if(i < aLen)res.push(String(arguments[i]));
    } return res.join('');
  }
});

/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: __webpack_require__(81)
});

/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.11 String.prototype.small()
__webpack_require__(14)('small', function(createHTML){
  return function small(){
    return createHTML(this, 'small', '', '');
  }
});

/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])

var $export     = __webpack_require__(0)
  , toLength    = __webpack_require__(8)
  , context     = __webpack_require__(80)
  , STARTS_WITH = 'startsWith'
  , $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * __webpack_require__(66)(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /*, position = 0 */){
    var that   = context(this, searchString, STARTS_WITH)
      , index  = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length))
      , search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});

/***/ }),
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.12 String.prototype.strike()
__webpack_require__(14)('strike', function(createHTML){
  return function strike(){
    return createHTML(this, 'strike', '', '');
  }
});

/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.13 String.prototype.sub()
__webpack_require__(14)('sub', function(createHTML){
  return function sub(){
    return createHTML(this, 'sub', '', '');
  }
});

/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.14 String.prototype.sup()
__webpack_require__(14)('sup', function(createHTML){
  return function sup(){
    return createHTML(this, 'sup', '', '');
  }
});

/***/ }),
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.1.3.25 String.prototype.trim()
__webpack_require__(46)('trim', function($trim){
  return function trim(){
    return $trim(this, 3);
  };
});

/***/ }),
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global         = __webpack_require__(2)
  , has            = __webpack_require__(10)
  , DESCRIPTORS    = __webpack_require__(6)
  , $export        = __webpack_require__(0)
  , redefine       = __webpack_require__(13)
  , META           = __webpack_require__(29).KEY
  , $fails         = __webpack_require__(3)
  , shared         = __webpack_require__(60)
  , setToStringTag = __webpack_require__(45)
  , uid            = __webpack_require__(40)
  , wks            = __webpack_require__(5)
  , wksExt         = __webpack_require__(112)
  , wksDefine      = __webpack_require__(85)
  , keyOf          = __webpack_require__(132)
  , enumKeys       = __webpack_require__(131)
  , isArray        = __webpack_require__(70)
  , anObject       = __webpack_require__(1)
  , toIObject      = __webpack_require__(15)
  , toPrimitive    = __webpack_require__(23)
  , createDesc     = __webpack_require__(30)
  , _create        = __webpack_require__(34)
  , gOPNExt        = __webpack_require__(104)
  , $GOPD          = __webpack_require__(16)
  , $DP            = __webpack_require__(7)
  , $keys          = __webpack_require__(36)
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  __webpack_require__(35).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(50).f  = $propertyIsEnumerable;
  __webpack_require__(59).f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !__webpack_require__(33)){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(12)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export      = __webpack_require__(0)
  , $typed       = __webpack_require__(61)
  , buffer       = __webpack_require__(84)
  , anObject     = __webpack_require__(1)
  , toIndex      = __webpack_require__(39)
  , toLength     = __webpack_require__(8)
  , isObject     = __webpack_require__(4)
  , ArrayBuffer  = __webpack_require__(2).ArrayBuffer
  , speciesConstructor = __webpack_require__(78)
  , $ArrayBuffer = buffer.ArrayBuffer
  , $DataView    = buffer.DataView
  , $isView      = $typed.ABV && ArrayBuffer.isView
  , $slice       = $ArrayBuffer.prototype.slice
  , VIEW         = $typed.VIEW
  , ARRAY_BUFFER = 'ArrayBuffer';

$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), {ArrayBuffer: $ArrayBuffer});

$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it){
    return $isView && $isView(it) || isObject(it) && VIEW in it;
  }
});

$export($export.P + $export.U + $export.F * __webpack_require__(3)(function(){
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end){
    if($slice !== undefined && end === undefined)return $slice.call(anObject(this), start); // FF fix
    var len    = anObject(this).byteLength
      , first  = toIndex(start, len)
      , final  = toIndex(end === undefined ? len : end, len)
      , result = new (speciesConstructor(this, $ArrayBuffer))(toLength(final - first))
      , viewS  = new $DataView(this)
      , viewT  = new $DataView(result)
      , index  = 0;
    while(first < final){
      viewT.setUint8(index++, viewS.getUint8(first++));
    } return result;
  }
});

__webpack_require__(38)(ARRAY_BUFFER);

/***/ }),
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
$export($export.G + $export.W + $export.F * !__webpack_require__(61).ABV, {
  DataView: __webpack_require__(84).DataView
});

/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(27)('Float32', 4, function(init){
  return function Float32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(27)('Float64', 8, function(init){
  return function Float64Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 261 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(27)('Int16', 2, function(init){
  return function Int16Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(27)('Int32', 4, function(init){
  return function Int32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(27)('Int8', 1, function(init){
  return function Int8Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 264 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(27)('Uint16', 2, function(init){
  return function Uint16Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 265 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(27)('Uint32', 4, function(init){
  return function Uint32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 266 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(27)('Uint8', 1, function(init){
  return function Uint8Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 267 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(27)('Uint8', 1, function(init){
  return function Uint8ClampedArray(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
}, true);

/***/ }),
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var weak = __webpack_require__(96);

// 23.4 WeakSet Objects
__webpack_require__(52)('WeakSet', function(get){
  return function WeakSet(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value){
    return weak.def(this, value, true);
  }
}, weak, false, true);

/***/ }),
/* 269 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/Array.prototype.includes
var $export   = __webpack_require__(0)
  , $includes = __webpack_require__(51)(true);

$export($export.P, 'Array', {
  includes: function includes(el /*, fromIndex = 0 */){
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

__webpack_require__(42)('includes');

/***/ }),
/* 270 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-09/sept-25.md#510-globalasap-for-enqueuing-a-microtask
var $export   = __webpack_require__(0)
  , microtask = __webpack_require__(75)()
  , process   = __webpack_require__(2).process
  , isNode    = __webpack_require__(18)(process) == 'process';

$export($export.G, {
  asap: function asap(fn){
    var domain = isNode && process.domain;
    microtask(domain ? domain.bind(fn) : fn);
  }
});

/***/ }),
/* 271 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/ljharb/proposal-is-error
var $export = __webpack_require__(0)
  , cof     = __webpack_require__(18);

$export($export.S, 'Error', {
  isError: function isError(it){
    return cof(it) === 'Error';
  }
});

/***/ }),
/* 272 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = __webpack_require__(0);

$export($export.P + $export.R, 'Map', {toJSON: __webpack_require__(95)('Map')});

/***/ }),
/* 273 */
/***/ (function(module, exports, __webpack_require__) {

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  iaddh: function iaddh(x0, x1, y0, y1){
    var $x0 = x0 >>> 0
      , $x1 = x1 >>> 0
      , $y0 = y0 >>> 0;
    return $x1 + (y1 >>> 0) + (($x0 & $y0 | ($x0 | $y0) & ~($x0 + $y0 >>> 0)) >>> 31) | 0;
  }
});

/***/ }),
/* 274 */
/***/ (function(module, exports, __webpack_require__) {

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  imulh: function imulh(u, v){
    var UINT16 = 0xffff
      , $u = +u
      , $v = +v
      , u0 = $u & UINT16
      , v0 = $v & UINT16
      , u1 = $u >> 16
      , v1 = $v >> 16
      , t  = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >> 16);
  }
});

/***/ }),
/* 275 */
/***/ (function(module, exports, __webpack_require__) {

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  isubh: function isubh(x0, x1, y0, y1){
    var $x0 = x0 >>> 0
      , $x1 = x1 >>> 0
      , $y0 = y0 >>> 0;
    return $x1 - (y1 >>> 0) - ((~$x0 & $y0 | ~($x0 ^ $y0) & $x0 - $y0 >>> 0) >>> 31) | 0;
  }
});

/***/ }),
/* 276 */
/***/ (function(module, exports, __webpack_require__) {

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  umulh: function umulh(u, v){
    var UINT16 = 0xffff
      , $u = +u
      , $v = +v
      , u0 = $u & UINT16
      , v0 = $v & UINT16
      , u1 = $u >>> 16
      , v1 = $v >>> 16
      , t  = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >>> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >>> 16);
  }
});

/***/ }),
/* 277 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export         = __webpack_require__(0)
  , toObject        = __webpack_require__(9)
  , aFunction       = __webpack_require__(11)
  , $defineProperty = __webpack_require__(7);

// B.2.2.2 Object.prototype.__defineGetter__(P, getter)
__webpack_require__(6) && $export($export.P + __webpack_require__(58), 'Object', {
  __defineGetter__: function __defineGetter__(P, getter){
    $defineProperty.f(toObject(this), P, {get: aFunction(getter), enumerable: true, configurable: true});
  }
});

/***/ }),
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export         = __webpack_require__(0)
  , toObject        = __webpack_require__(9)
  , aFunction       = __webpack_require__(11)
  , $defineProperty = __webpack_require__(7);

// B.2.2.3 Object.prototype.__defineSetter__(P, setter)
__webpack_require__(6) && $export($export.P + __webpack_require__(58), 'Object', {
  __defineSetter__: function __defineSetter__(P, setter){
    $defineProperty.f(toObject(this), P, {set: aFunction(setter), enumerable: true, configurable: true});
  }
});

/***/ }),
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export  = __webpack_require__(0)
  , $entries = __webpack_require__(106)(true);

$export($export.S, 'Object', {
  entries: function entries(it){
    return $entries(it);
  }
});

/***/ }),
/* 280 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export        = __webpack_require__(0)
  , ownKeys        = __webpack_require__(107)
  , toIObject      = __webpack_require__(15)
  , gOPD           = __webpack_require__(16)
  , createProperty = __webpack_require__(63);

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object){
    var O       = toIObject(object)
      , getDesc = gOPD.f
      , keys    = ownKeys(O)
      , result  = {}
      , i       = 0
      , key;
    while(keys.length > i)createProperty(result, key = keys[i++], getDesc(O, key));
    return result;
  }
});

/***/ }),
/* 281 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export                  = __webpack_require__(0)
  , toObject                 = __webpack_require__(9)
  , toPrimitive              = __webpack_require__(23)
  , getPrototypeOf           = __webpack_require__(17)
  , getOwnPropertyDescriptor = __webpack_require__(16).f;

// B.2.2.4 Object.prototype.__lookupGetter__(P)
__webpack_require__(6) && $export($export.P + __webpack_require__(58), 'Object', {
  __lookupGetter__: function __lookupGetter__(P){
    var O = toObject(this)
      , K = toPrimitive(P, true)
      , D;
    do {
      if(D = getOwnPropertyDescriptor(O, K))return D.get;
    } while(O = getPrototypeOf(O));
  }
});

/***/ }),
/* 282 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export                  = __webpack_require__(0)
  , toObject                 = __webpack_require__(9)
  , toPrimitive              = __webpack_require__(23)
  , getPrototypeOf           = __webpack_require__(17)
  , getOwnPropertyDescriptor = __webpack_require__(16).f;

// B.2.2.5 Object.prototype.__lookupSetter__(P)
__webpack_require__(6) && $export($export.P + __webpack_require__(58), 'Object', {
  __lookupSetter__: function __lookupSetter__(P){
    var O = toObject(this)
      , K = toPrimitive(P, true)
      , D;
    do {
      if(D = getOwnPropertyDescriptor(O, K))return D.set;
    } while(O = getPrototypeOf(O));
  }
});

/***/ }),
/* 283 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__(0)
  , $values = __webpack_require__(106)(false);

$export($export.S, 'Object', {
  values: function values(it){
    return $values(it);
  }
});

/***/ }),
/* 284 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/zenparsing/es-observable
var $export     = __webpack_require__(0)
  , global      = __webpack_require__(2)
  , core        = __webpack_require__(24)
  , microtask   = __webpack_require__(75)()
  , OBSERVABLE  = __webpack_require__(5)('observable')
  , aFunction   = __webpack_require__(11)
  , anObject    = __webpack_require__(1)
  , anInstance  = __webpack_require__(32)
  , redefineAll = __webpack_require__(37)
  , hide        = __webpack_require__(12)
  , forOf       = __webpack_require__(43)
  , RETURN      = forOf.RETURN;

var getMethod = function(fn){
  return fn == null ? undefined : aFunction(fn);
};

var cleanupSubscription = function(subscription){
  var cleanup = subscription._c;
  if(cleanup){
    subscription._c = undefined;
    cleanup();
  }
};

var subscriptionClosed = function(subscription){
  return subscription._o === undefined;
};

var closeSubscription = function(subscription){
  if(!subscriptionClosed(subscription)){
    subscription._o = undefined;
    cleanupSubscription(subscription);
  }
};

var Subscription = function(observer, subscriber){
  anObject(observer);
  this._c = undefined;
  this._o = observer;
  observer = new SubscriptionObserver(this);
  try {
    var cleanup      = subscriber(observer)
      , subscription = cleanup;
    if(cleanup != null){
      if(typeof cleanup.unsubscribe === 'function')cleanup = function(){ subscription.unsubscribe(); };
      else aFunction(cleanup);
      this._c = cleanup;
    }
  } catch(e){
    observer.error(e);
    return;
  } if(subscriptionClosed(this))cleanupSubscription(this);
};

Subscription.prototype = redefineAll({}, {
  unsubscribe: function unsubscribe(){ closeSubscription(this); }
});

var SubscriptionObserver = function(subscription){
  this._s = subscription;
};

SubscriptionObserver.prototype = redefineAll({}, {
  next: function next(value){
    var subscription = this._s;
    if(!subscriptionClosed(subscription)){
      var observer = subscription._o;
      try {
        var m = getMethod(observer.next);
        if(m)return m.call(observer, value);
      } catch(e){
        try {
          closeSubscription(subscription);
        } finally {
          throw e;
        }
      }
    }
  },
  error: function error(value){
    var subscription = this._s;
    if(subscriptionClosed(subscription))throw value;
    var observer = subscription._o;
    subscription._o = undefined;
    try {
      var m = getMethod(observer.error);
      if(!m)throw value;
      value = m.call(observer, value);
    } catch(e){
      try {
        cleanupSubscription(subscription);
      } finally {
        throw e;
      }
    } cleanupSubscription(subscription);
    return value;
  },
  complete: function complete(value){
    var subscription = this._s;
    if(!subscriptionClosed(subscription)){
      var observer = subscription._o;
      subscription._o = undefined;
      try {
        var m = getMethod(observer.complete);
        value = m ? m.call(observer, value) : undefined;
      } catch(e){
        try {
          cleanupSubscription(subscription);
        } finally {
          throw e;
        }
      } cleanupSubscription(subscription);
      return value;
    }
  }
});

var $Observable = function Observable(subscriber){
  anInstance(this, $Observable, 'Observable', '_f')._f = aFunction(subscriber);
};

redefineAll($Observable.prototype, {
  subscribe: function subscribe(observer){
    return new Subscription(observer, this._f);
  },
  forEach: function forEach(fn){
    var that = this;
    return new (core.Promise || global.Promise)(function(resolve, reject){
      aFunction(fn);
      var subscription = that.subscribe({
        next : function(value){
          try {
            return fn(value);
          } catch(e){
            reject(e);
            subscription.unsubscribe();
          }
        },
        error: reject,
        complete: resolve
      });
    });
  }
});

redefineAll($Observable, {
  from: function from(x){
    var C = typeof this === 'function' ? this : $Observable;
    var method = getMethod(anObject(x)[OBSERVABLE]);
    if(method){
      var observable = anObject(method.call(x));
      return observable.constructor === C ? observable : new C(function(observer){
        return observable.subscribe(observer);
      });
    }
    return new C(function(observer){
      var done = false;
      microtask(function(){
        if(!done){
          try {
            if(forOf(x, false, function(it){
              observer.next(it);
              if(done)return RETURN;
            }) === RETURN)return;
          } catch(e){
            if(done)throw e;
            observer.error(e);
            return;
          } observer.complete();
        }
      });
      return function(){ done = true; };
    });
  },
  of: function of(){
    for(var i = 0, l = arguments.length, items = Array(l); i < l;)items[i] = arguments[i++];
    return new (typeof this === 'function' ? this : $Observable)(function(observer){
      var done = false;
      microtask(function(){
        if(!done){
          for(var i = 0; i < items.length; ++i){
            observer.next(items[i]);
            if(done)return;
          } observer.complete();
        }
      });
      return function(){ done = true; };
    });
  }
});

hide($Observable.prototype, OBSERVABLE, function(){ return this; });

$export($export.G, {Observable: $Observable});

__webpack_require__(38)('Observable');

/***/ }),
/* 285 */
/***/ (function(module, exports, __webpack_require__) {

var metadata                  = __webpack_require__(26)
  , anObject                  = __webpack_require__(1)
  , toMetaKey                 = metadata.key
  , ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({defineMetadata: function defineMetadata(metadataKey, metadataValue, target, targetKey){
  ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject(target), toMetaKey(targetKey));
}});

/***/ }),
/* 286 */
/***/ (function(module, exports, __webpack_require__) {

var metadata               = __webpack_require__(26)
  , anObject               = __webpack_require__(1)
  , toMetaKey              = metadata.key
  , getOrCreateMetadataMap = metadata.map
  , store                  = metadata.store;

metadata.exp({deleteMetadata: function deleteMetadata(metadataKey, target /*, targetKey */){
  var targetKey   = arguments.length < 3 ? undefined : toMetaKey(arguments[2])
    , metadataMap = getOrCreateMetadataMap(anObject(target), targetKey, false);
  if(metadataMap === undefined || !metadataMap['delete'](metadataKey))return false;
  if(metadataMap.size)return true;
  var targetMetadata = store.get(target);
  targetMetadata['delete'](targetKey);
  return !!targetMetadata.size || store['delete'](target);
}});

/***/ }),
/* 287 */
/***/ (function(module, exports, __webpack_require__) {

var Set                     = __webpack_require__(115)
  , from                    = __webpack_require__(91)
  , metadata                = __webpack_require__(26)
  , anObject                = __webpack_require__(1)
  , getPrototypeOf          = __webpack_require__(17)
  , ordinaryOwnMetadataKeys = metadata.keys
  , toMetaKey               = metadata.key;

var ordinaryMetadataKeys = function(O, P){
  var oKeys  = ordinaryOwnMetadataKeys(O, P)
    , parent = getPrototypeOf(O);
  if(parent === null)return oKeys;
  var pKeys  = ordinaryMetadataKeys(parent, P);
  return pKeys.length ? oKeys.length ? from(new Set(oKeys.concat(pKeys))) : pKeys : oKeys;
};

metadata.exp({getMetadataKeys: function getMetadataKeys(target /*, targetKey */){
  return ordinaryMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
}});

/***/ }),
/* 288 */
/***/ (function(module, exports, __webpack_require__) {

var metadata               = __webpack_require__(26)
  , anObject               = __webpack_require__(1)
  , getPrototypeOf         = __webpack_require__(17)
  , ordinaryHasOwnMetadata = metadata.has
  , ordinaryGetOwnMetadata = metadata.get
  , toMetaKey              = metadata.key;

var ordinaryGetMetadata = function(MetadataKey, O, P){
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if(hasOwn)return ordinaryGetOwnMetadata(MetadataKey, O, P);
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryGetMetadata(MetadataKey, parent, P) : undefined;
};

metadata.exp({getMetadata: function getMetadata(metadataKey, target /*, targetKey */){
  return ordinaryGetMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});

/***/ }),
/* 289 */
/***/ (function(module, exports, __webpack_require__) {

var metadata                = __webpack_require__(26)
  , anObject                = __webpack_require__(1)
  , ordinaryOwnMetadataKeys = metadata.keys
  , toMetaKey               = metadata.key;

metadata.exp({getOwnMetadataKeys: function getOwnMetadataKeys(target /*, targetKey */){
  return ordinaryOwnMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
}});

/***/ }),
/* 290 */
/***/ (function(module, exports, __webpack_require__) {

var metadata               = __webpack_require__(26)
  , anObject               = __webpack_require__(1)
  , ordinaryGetOwnMetadata = metadata.get
  , toMetaKey              = metadata.key;

metadata.exp({getOwnMetadata: function getOwnMetadata(metadataKey, target /*, targetKey */){
  return ordinaryGetOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});

/***/ }),
/* 291 */
/***/ (function(module, exports, __webpack_require__) {

var metadata               = __webpack_require__(26)
  , anObject               = __webpack_require__(1)
  , getPrototypeOf         = __webpack_require__(17)
  , ordinaryHasOwnMetadata = metadata.has
  , toMetaKey              = metadata.key;

var ordinaryHasMetadata = function(MetadataKey, O, P){
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if(hasOwn)return true;
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryHasMetadata(MetadataKey, parent, P) : false;
};

metadata.exp({hasMetadata: function hasMetadata(metadataKey, target /*, targetKey */){
  return ordinaryHasMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});

/***/ }),
/* 292 */
/***/ (function(module, exports, __webpack_require__) {

var metadata               = __webpack_require__(26)
  , anObject               = __webpack_require__(1)
  , ordinaryHasOwnMetadata = metadata.has
  , toMetaKey              = metadata.key;

metadata.exp({hasOwnMetadata: function hasOwnMetadata(metadataKey, target /*, targetKey */){
  return ordinaryHasOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});

/***/ }),
/* 293 */
/***/ (function(module, exports, __webpack_require__) {

var metadata                  = __webpack_require__(26)
  , anObject                  = __webpack_require__(1)
  , aFunction                 = __webpack_require__(11)
  , toMetaKey                 = metadata.key
  , ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({metadata: function metadata(metadataKey, metadataValue){
  return function decorator(target, targetKey){
    ordinaryDefineOwnMetadata(
      metadataKey, metadataValue,
      (targetKey !== undefined ? anObject : aFunction)(target),
      toMetaKey(targetKey)
    );
  };
}});

/***/ }),
/* 294 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = __webpack_require__(0);

$export($export.P + $export.R, 'Set', {toJSON: __webpack_require__(95)('Set')});

/***/ }),
/* 295 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/mathiasbynens/String.prototype.at
var $export = __webpack_require__(0)
  , $at     = __webpack_require__(79)(true);

$export($export.P, 'String', {
  at: function at(pos){
    return $at(this, pos);
  }
});

/***/ }),
/* 296 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/String.prototype.matchAll/
var $export     = __webpack_require__(0)
  , defined     = __webpack_require__(19)
  , toLength    = __webpack_require__(8)
  , isRegExp    = __webpack_require__(56)
  , getFlags    = __webpack_require__(54)
  , RegExpProto = RegExp.prototype;

var $RegExpStringIterator = function(regexp, string){
  this._r = regexp;
  this._s = string;
};

__webpack_require__(71)($RegExpStringIterator, 'RegExp String', function next(){
  var match = this._r.exec(this._s);
  return {value: match, done: match === null};
});

$export($export.P, 'String', {
  matchAll: function matchAll(regexp){
    defined(this);
    if(!isRegExp(regexp))throw TypeError(regexp + ' is not a regexp!');
    var S     = String(this)
      , flags = 'flags' in RegExpProto ? String(regexp.flags) : getFlags.call(regexp)
      , rx    = new RegExp(regexp.source, ~flags.indexOf('g') ? flags : 'g' + flags);
    rx.lastIndex = toLength(regexp.lastIndex);
    return new $RegExpStringIterator(rx, S);
  }
});

/***/ }),
/* 297 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-string-pad-start-end
var $export = __webpack_require__(0)
  , $pad    = __webpack_require__(111);

$export($export.P, 'String', {
  padEnd: function padEnd(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});

/***/ }),
/* 298 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-string-pad-start-end
var $export = __webpack_require__(0)
  , $pad    = __webpack_require__(111);

$export($export.P, 'String', {
  padStart: function padStart(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});

/***/ }),
/* 299 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
__webpack_require__(46)('trimLeft', function($trim){
  return function trimLeft(){
    return $trim(this, 1);
  };
}, 'trimStart');

/***/ }),
/* 300 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
__webpack_require__(46)('trimRight', function($trim){
  return function trimRight(){
    return $trim(this, 2);
  };
}, 'trimEnd');

/***/ }),
/* 301 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(85)('asyncIterator');

/***/ }),
/* 302 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(85)('observable');

/***/ }),
/* 303 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/ljharb/proposal-global
var $export = __webpack_require__(0);

$export($export.S, 'System', {global: __webpack_require__(2)});

/***/ }),
/* 304 */
/***/ (function(module, exports, __webpack_require__) {

var $iterators    = __webpack_require__(87)
  , redefine      = __webpack_require__(13)
  , global        = __webpack_require__(2)
  , hide          = __webpack_require__(12)
  , Iterators     = __webpack_require__(44)
  , wks           = __webpack_require__(5)
  , ITERATOR      = wks('iterator')
  , TO_STRING_TAG = wks('toStringTag')
  , ArrayValues   = Iterators.Array;

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype
    , key;
  if(proto){
    if(!proto[ITERATOR])hide(proto, ITERATOR, ArrayValues);
    if(!proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    for(key in $iterators)if(!proto[key])redefine(proto, key, $iterators[key], true);
  }
}

/***/ }),
/* 305 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0)
  , $task   = __webpack_require__(83);
$export($export.G + $export.B, {
  setImmediate:   $task.set,
  clearImmediate: $task.clear
});

/***/ }),
/* 306 */
/***/ (function(module, exports, __webpack_require__) {

// ie9- setTimeout & setInterval additional parameters fix
var global     = __webpack_require__(2)
  , $export    = __webpack_require__(0)
  , invoke     = __webpack_require__(55)
  , partial    = __webpack_require__(133)
  , navigator  = global.navigator
  , MSIE       = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
var wrap = function(set){
  return MSIE ? function(fn, time /*, ...args */){
    return set(invoke(
      partial,
      [].slice.call(arguments, 2),
      typeof fn == 'function' ? fn : Function(fn)
    ), time);
  } : set;
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout:  wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});

/***/ }),
/* 307 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(256);
__webpack_require__(195);
__webpack_require__(197);
__webpack_require__(196);
__webpack_require__(199);
__webpack_require__(201);
__webpack_require__(206);
__webpack_require__(200);
__webpack_require__(198);
__webpack_require__(208);
__webpack_require__(207);
__webpack_require__(203);
__webpack_require__(204);
__webpack_require__(202);
__webpack_require__(194);
__webpack_require__(205);
__webpack_require__(209);
__webpack_require__(210);
__webpack_require__(162);
__webpack_require__(164);
__webpack_require__(163);
__webpack_require__(212);
__webpack_require__(211);
__webpack_require__(182);
__webpack_require__(192);
__webpack_require__(193);
__webpack_require__(183);
__webpack_require__(184);
__webpack_require__(185);
__webpack_require__(186);
__webpack_require__(187);
__webpack_require__(188);
__webpack_require__(189);
__webpack_require__(190);
__webpack_require__(191);
__webpack_require__(165);
__webpack_require__(166);
__webpack_require__(167);
__webpack_require__(168);
__webpack_require__(169);
__webpack_require__(170);
__webpack_require__(171);
__webpack_require__(172);
__webpack_require__(173);
__webpack_require__(174);
__webpack_require__(175);
__webpack_require__(176);
__webpack_require__(177);
__webpack_require__(178);
__webpack_require__(179);
__webpack_require__(180);
__webpack_require__(181);
__webpack_require__(243);
__webpack_require__(248);
__webpack_require__(255);
__webpack_require__(246);
__webpack_require__(238);
__webpack_require__(239);
__webpack_require__(244);
__webpack_require__(249);
__webpack_require__(251);
__webpack_require__(234);
__webpack_require__(235);
__webpack_require__(236);
__webpack_require__(237);
__webpack_require__(240);
__webpack_require__(241);
__webpack_require__(242);
__webpack_require__(245);
__webpack_require__(247);
__webpack_require__(250);
__webpack_require__(252);
__webpack_require__(253);
__webpack_require__(254);
__webpack_require__(157);
__webpack_require__(159);
__webpack_require__(158);
__webpack_require__(161);
__webpack_require__(160);
__webpack_require__(146);
__webpack_require__(144);
__webpack_require__(150);
__webpack_require__(147);
__webpack_require__(153);
__webpack_require__(155);
__webpack_require__(143);
__webpack_require__(149);
__webpack_require__(140);
__webpack_require__(154);
__webpack_require__(138);
__webpack_require__(152);
__webpack_require__(151);
__webpack_require__(145);
__webpack_require__(148);
__webpack_require__(137);
__webpack_require__(139);
__webpack_require__(142);
__webpack_require__(141);
__webpack_require__(156);
__webpack_require__(87);
__webpack_require__(228);
__webpack_require__(233);
__webpack_require__(114);
__webpack_require__(229);
__webpack_require__(230);
__webpack_require__(231);
__webpack_require__(232);
__webpack_require__(213);
__webpack_require__(113);
__webpack_require__(115);
__webpack_require__(116);
__webpack_require__(268);
__webpack_require__(257);
__webpack_require__(258);
__webpack_require__(263);
__webpack_require__(266);
__webpack_require__(267);
__webpack_require__(261);
__webpack_require__(264);
__webpack_require__(262);
__webpack_require__(265);
__webpack_require__(259);
__webpack_require__(260);
__webpack_require__(214);
__webpack_require__(215);
__webpack_require__(216);
__webpack_require__(217);
__webpack_require__(218);
__webpack_require__(221);
__webpack_require__(219);
__webpack_require__(220);
__webpack_require__(222);
__webpack_require__(223);
__webpack_require__(224);
__webpack_require__(225);
__webpack_require__(227);
__webpack_require__(226);
__webpack_require__(269);
__webpack_require__(295);
__webpack_require__(298);
__webpack_require__(297);
__webpack_require__(299);
__webpack_require__(300);
__webpack_require__(296);
__webpack_require__(301);
__webpack_require__(302);
__webpack_require__(280);
__webpack_require__(283);
__webpack_require__(279);
__webpack_require__(277);
__webpack_require__(278);
__webpack_require__(281);
__webpack_require__(282);
__webpack_require__(272);
__webpack_require__(294);
__webpack_require__(303);
__webpack_require__(271);
__webpack_require__(273);
__webpack_require__(275);
__webpack_require__(274);
__webpack_require__(276);
__webpack_require__(285);
__webpack_require__(286);
__webpack_require__(288);
__webpack_require__(287);
__webpack_require__(290);
__webpack_require__(289);
__webpack_require__(291);
__webpack_require__(292);
__webpack_require__(293);
__webpack_require__(270);
__webpack_require__(284);
__webpack_require__(306);
__webpack_require__(305);
__webpack_require__(304);
module.exports = __webpack_require__(24);

/***/ }),
/* 308 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(309)(undefined);
// imports


// module
exports.push([module.i, "@-webkit-keyframes sb-fade-in {\n  0% {\n    opacity: 0; }\n  100% {\n    opacity: 1; } }\n\n@-moz-keyframes sb-fade-in {\n  0% {\n    opacity: 0; }\n  100% {\n    opacity: 1; } }\n\n@-o-keyframes sb-fade-in {\n  0% {\n    opacity: 0; }\n  100% {\n    opacity: 1; } }\n\n@-ms-keyframes sb-fade-in {\n  0% {\n    opacity: 0; }\n  100% {\n    opacity: 1; } }\n\n@keyframes sb-fade-in {\n  0% {\n    opacity: 0; }\n  100% {\n    opacity: 1; } }\n\n@-webkit-keyframes sb-fade-out {\n  0% {\n    opacity: 1; }\n  100% {\n    opacity: 0; } }\n\n@-moz-keyframes sb-fade-out {\n  0% {\n    opacity: 1; }\n  100% {\n    opacity: 0; } }\n\n@-o-keyframes sb-fade-out {\n  0% {\n    opacity: 1; }\n  100% {\n    opacity: 0; } }\n\n@-ms-keyframes sb-fade-out {\n  0% {\n    opacity: 1; }\n  100% {\n    opacity: 0; } }\n\n@keyframes sb-fade-out {\n  0% {\n    opacity: 1; }\n  100% {\n    opacity: 0; } }\n\n@-webkit-keyframes sb-loader {\n  0%, 80%, 100% {\n    -webkit-transform: scale(0);\n    -moz-transform: scale(0);\n    -ms-transform: scale(0);\n    -o-transform: scale(0);\n    transform: scale(0); }\n  40% {\n    -webkit-transform: scale(1);\n    -moz-transform: scale(1);\n    -ms-transform: scale(1);\n    -o-transform: scale(1);\n    transform: scale(1); } }\n\n@-moz-keyframes sb-loader {\n  0%, 80%, 100% {\n    -webkit-transform: scale(0);\n    -moz-transform: scale(0);\n    -ms-transform: scale(0);\n    -o-transform: scale(0);\n    transform: scale(0); }\n  40% {\n    -webkit-transform: scale(1);\n    -moz-transform: scale(1);\n    -ms-transform: scale(1);\n    -o-transform: scale(1);\n    transform: scale(1); } }\n\n@-o-keyframes sb-loader {\n  0%, 80%, 100% {\n    -webkit-transform: scale(0);\n    -moz-transform: scale(0);\n    -ms-transform: scale(0);\n    -o-transform: scale(0);\n    transform: scale(0); }\n  40% {\n    -webkit-transform: scale(1);\n    -moz-transform: scale(1);\n    -ms-transform: scale(1);\n    -o-transform: scale(1);\n    transform: scale(1); } }\n\n@-ms-keyframes sb-loader {\n  0%, 80%, 100% {\n    -webkit-transform: scale(0);\n    -moz-transform: scale(0);\n    -ms-transform: scale(0);\n    -o-transform: scale(0);\n    transform: scale(0); }\n  40% {\n    -webkit-transform: scale(1);\n    -moz-transform: scale(1);\n    -ms-transform: scale(1);\n    -o-transform: scale(1);\n    transform: scale(1); } }\n\n@keyframes sb-loader {\n  0%, 80%, 100% {\n    -webkit-transform: scale(0);\n    -moz-transform: scale(0);\n    -ms-transform: scale(0);\n    -o-transform: scale(0);\n    transform: scale(0); }\n  40% {\n    -webkit-transform: scale(1);\n    -moz-transform: scale(1);\n    -ms-transform: scale(1);\n    -o-transform: scale(1);\n    transform: scale(1); } }\n\n#sb_widget {\n  margin: 0;\n  padding: 0;\n  font-size: 100%;\n  line-height: 1;\n  width: auto;\n  height: auto;\n  box-sizing: initial;\n  z-index: 99990;\n  width: 60px;\n  height: 60px;\n  position: fixed;\n  bottom: 0;\n  right: 20px;\n  font-family: \"Lato\";\n  font-weight: 400;\n  -webkit-font-smoothing: antialiased; }\n  #sb_widget .sb-fade-in {\n    margin: 0;\n    padding: 0;\n    font-size: 100%;\n    line-height: 1;\n    width: auto;\n    height: auto;\n    box-sizing: initial;\n    -webkit-animation: sb-fade-in 0.5s;\n    -moz-animation: sb-fade-in 0.5s;\n    -o-animation: sb-fade-in 0.5s;\n    -ms-animation: sb-fade-in 0.5s;\n    animation: sb-fade-in 0.5s; }\n  #sb_widget .sb-fade-out {\n    margin: 0;\n    padding: 0;\n    font-size: 100%;\n    line-height: 1;\n    width: auto;\n    height: auto;\n    box-sizing: initial;\n    -webkit-animation: sb-fade-out 0.5s;\n    -moz-animation: sb-fade-out 0.5s;\n    -o-animation: sb-fade-out 0.5s;\n    -ms-animation: sb-fade-out 0.5s;\n    animation: sb-fade-out 0.5s; }\n  #sb_widget .sb-spinner, #sb_widget .chat-section .content .sb-spinner {\n    margin: 0;\n    padding: 0;\n    font-size: 100%;\n    line-height: 1;\n    width: auto;\n    height: auto;\n    box-sizing: initial;\n    width: 100%;\n    text-align: center; }\n    #sb_widget .sb-spinner div, #sb_widget .chat-section .content .sb-spinner div {\n      margin: 0;\n      padding: 0;\n      font-size: 100%;\n      line-height: 1;\n      width: auto;\n      height: auto;\n      box-sizing: initial;\n      display: inline-block;\n      width: 12px;\n      height: 12px;\n      background-color: #A5B3CD;\n      border-radius: 50%;\n      -webkit-border-radius: 50%;\n      -moz-border-radius: 50%;\n      -ms-border-radius: 50%;\n      -o-border-radius: 50%;\n      -webkit-animation: sb-loader 1.4s infinite ease-in-out both;\n      -moz-animation: sb-loader 1.4s infinite ease-in-out both;\n      -o-animation: sb-loader 1.4s infinite ease-in-out both;\n      -ms-animation: sb-loader 1.4s infinite ease-in-out both;\n      animation: sb-loader 1.4s infinite ease-in-out both; }\n    #sb_widget .sb-spinner :nth-child(1), #sb_widget .chat-section .content .sb-spinner :nth-child(1) {\n      margin: 0;\n      padding: 0;\n      font-size: 100%;\n      line-height: 1;\n      width: auto;\n      height: auto;\n      box-sizing: initial;\n      -webkit-animation-delay: -0.32s;\n      -moz-animation-delay: -0.32s;\n      -o-animation-delay: -0.32s;\n      -ms-animation-delay: -0.32s;\n      animation-delay: -0.32s; }\n    #sb_widget .sb-spinner :nth-child(2), #sb_widget .chat-section .content .sb-spinner :nth-child(2) {\n      margin: 0;\n      padding: 0;\n      font-size: 100%;\n      line-height: 1;\n      width: auto;\n      height: auto;\n      box-sizing: initial;\n      margin: 0 6px;\n      -webkit-animation-delay: -0.16s;\n      -moz-animation-delay: -0.16s;\n      -o-animation-delay: -0.16s;\n      -ms-animation-delay: -0.16s;\n      animation-delay: -0.16s; }\n  #sb_widget .ic-login {\n    margin: 0;\n    padding: 0;\n    font-size: 100%;\n    line-height: 1;\n    width: auto;\n    height: auto;\n    box-sizing: initial;\n    background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/icon-open-nonmember.svg\");\n    background-position: center;\n    background-size: cover;\n    background-repeat: no-repeat; }\n  #sb_widget .ic-connected {\n    margin: 0;\n    padding: 0;\n    font-size: 100%;\n    line-height: 1;\n    width: auto;\n    height: auto;\n    box-sizing: initial;\n    background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/icon-open-member.svg\");\n    background-position: center;\n    background-size: cover;\n    background-repeat: no-repeat; }\n  #sb_widget .ic-minimize {\n    margin: 0;\n    padding: 0;\n    font-size: 100%;\n    line-height: 1;\n    width: auto;\n    height: auto;\n    box-sizing: initial;\n    background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/btn-minimize-default.svg\");\n    background-position: center;\n    background-size: cover;\n    background-repeat: no-repeat; }\n    #sb_widget .ic-minimize:hover {\n      background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/btn-minimize-over.svg\");\n      background-position: center;\n      background-size: cover;\n      background-repeat: no-repeat; }\n  #sb_widget .ic-option {\n    margin: 0;\n    padding: 0;\n    font-size: 100%;\n    line-height: 1;\n    width: auto;\n    height: auto;\n    box-sizing: initial;\n    background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/btn-option-default.svg\");\n    background-position: center;\n    background-size: cover;\n    background-repeat: no-repeat; }\n    #sb_widget .ic-option:hover {\n      background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/btn-option-over.svg\");\n      background-position: center;\n      background-size: cover;\n      background-repeat: no-repeat; }\n  #sb_widget .ic-option.active {\n    background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/btn-option-over.svg\");\n    background-position: center;\n    background-size: cover;\n    background-repeat: no-repeat; }\n  #sb_widget .ic-new-chat {\n    margin: 0;\n    padding: 0;\n    font-size: 100%;\n    line-height: 1;\n    width: auto;\n    height: auto;\n    box-sizing: initial;\n    background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/btn-new-chat-default.svg\");\n    background-position: center;\n    background-size: cover;\n    background-repeat: no-repeat; }\n    #sb_widget .ic-new-chat:hover {\n      background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/btn-new-chat-over.svg\");\n      background-position: center;\n      background-size: cover;\n      background-repeat: no-repeat; }\n  #sb_widget .ic-close {\n    margin: 0;\n    padding: 0;\n    font-size: 100%;\n    line-height: 1;\n    width: auto;\n    height: auto;\n    box-sizing: initial;\n    background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/btn-close-default.svg\");\n    background-position: center;\n    background-size: cover;\n    background-repeat: no-repeat; }\n    #sb_widget .ic-close:hover {\n      background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/btn-close-over.svg\");\n      background-position: center;\n      background-size: cover;\n      background-repeat: no-repeat; }\n  #sb_widget .ic-close.active {\n    background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/btn-close-select.svg\");\n    background-position: center;\n    background-size: cover;\n    background-repeat: no-repeat; }\n  #sb_widget .ic-members {\n    margin: 0;\n    padding: 0;\n    font-size: 100%;\n    line-height: 1;\n    width: auto;\n    height: auto;\n    box-sizing: initial;\n    background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/btn-friend-list-default.svg\");\n    background-position: center;\n    background-size: cover;\n    background-repeat: no-repeat; }\n    #sb_widget .ic-members:hover {\n      background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/btn-friend-list-over.svg\");\n      background-position: center;\n      background-size: cover;\n      background-repeat: no-repeat; }\n  #sb_widget .ic-members.active {\n    background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/btn-friend-list-select.svg\");\n    background-position: center;\n    background-size: cover;\n    background-repeat: no-repeat; }\n  #sb_widget .ic-invite {\n    margin: 0;\n    padding: 0;\n    font-size: 100%;\n    line-height: 1;\n    width: auto;\n    height: auto;\n    box-sizing: initial;\n    background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/btn-friend-add-default.svg\");\n    background-position: center;\n    background-size: cover;\n    background-repeat: no-repeat; }\n    #sb_widget .ic-invite:hover {\n      background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/btn-friend-add-over.svg\");\n      background-position: center;\n      background-size: cover;\n      background-repeat: no-repeat; }\n  #sb_widget .ic-invite.active {\n    background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/btn-friend-add-select.svg\");\n    background-position: center;\n    background-size: cover;\n    background-repeat: no-repeat; }\n  #sb_widget .ic-leave {\n    margin: 0;\n    padding: 0;\n    font-size: 100%;\n    line-height: 1;\n    width: auto;\n    height: auto;\n    box-sizing: initial;\n    background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/btn-leave-chat-normal.svg\");\n    background-position: center;\n    background-size: cover;\n    background-repeat: no-repeat; }\n    #sb_widget .ic-leave:hover {\n      background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/btn-leave-chat-over.svg\");\n      background-position: center;\n      background-size: cover;\n      background-repeat: no-repeat; }\n  #sb_widget .tooltip, #sb_widget .channel-board .board-top .btn:hover > .tooltip, #sb_widget .channel-board .board-top .btn .tooltip, #sb_widget .chat-section .top .btn:hover > .tooltip, #sb_widget .chat-section .top .btn.ic-leave .tooltip, #sb_widget .chat-section .top .btn.ic-members .tooltip, #sb_widget .chat-section .top .btn.ic-invite .tooltip {\n    margin: 0;\n    padding: 0;\n    font-size: 100%;\n    line-height: 1;\n    width: auto;\n    height: auto;\n    box-sizing: initial;\n    display: none;\n    background-color: #000000;\n    text-align: center;\n    z-index: 1;\n    font-size: 12px;\n    color: #FFFFFF;\n    padding: 0 12px;\n    height: 32px;\n    line-height: 32px; }\n    #sb_widget .tooltip::after, #sb_widget .channel-board .board-top .btn:hover > .tooltip::after, #sb_widget .channel-board .board-top .btn .tooltip::after, #sb_widget .chat-section .top .btn:hover > .tooltip::after, #sb_widget .chat-section .top .btn.ic-leave .tooltip::after, #sb_widget .chat-section .top .btn.ic-members .tooltip::after, #sb_widget .chat-section .top .btn.ic-invite .tooltip::after {\n      content: ' ';\n      position: absolute;\n      top: 100%;\n      left: 50%;\n      margin-left: -5px;\n      border-width: 5px;\n      border-style: solid;\n      border-color: #000000 transparent transparent transparent; }\n  #sb_widget .widget {\n    margin: 0;\n    padding: 0;\n    font-size: 100%;\n    line-height: 1;\n    width: auto;\n    height: auto;\n    box-sizing: initial;\n    z-index: 99991;\n    position: absolute;\n    right: 0;\n    bottom: 20px;\n    width: 60px;\n    height: 60px;\n    cursor: pointer;\n    border-radius: 50%;\n    -webkit-border-radius: 50%;\n    -moz-border-radius: 50%;\n    -ms-border-radius: 50%;\n    -o-border-radius: 50%;\n    -webkit-box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06), 0 2px 32px rgba(0, 0, 0, 0.16);\n    -moz-box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06), 0 2px 32px rgba(0, 0, 0, 0.16);\n    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06), 0 2px 32px rgba(0, 0, 0, 0.16);\n    background-color: #896BF5; }\n    #sb_widget .widget:hover {\n      background-color: #775AE0;\n      -webkit-box-shadow: 0 1px 9px rgba(0, 0, 0, 0.28), 0 2px 32px rgba(0, 0, 0, 0.16);\n      -moz-box-shadow: 0 1px 9px rgba(0, 0, 0, 0.28), 0 2px 32px rgba(0, 0, 0, 0.16);\n      box-shadow: 0 1px 9px rgba(0, 0, 0, 0.28), 0 2px 32px rgba(0, 0, 0, 0.16); }\n    #sb_widget .widget .notification {\n      margin: 0;\n      padding: 0;\n      font-size: 100%;\n      line-height: 1;\n      width: auto;\n      height: auto;\n      box-sizing: initial;\n      display: none;\n      position: absolute;\n      top: 0;\n      right: 0;\n      width: 18px;\n      height: 18px;\n      background-color: #FB6094;\n      color: #FFFFFF;\n      font-weight: 700;\n      font-size: 12px;\n      line-height: 18px;\n      text-align: center;\n      border-radius: 50%;\n      -webkit-border-radius: 50%;\n      -moz-border-radius: 50%;\n      -ms-border-radius: 50%;\n      -o-border-radius: 50%;\n      -webkit-box-shadow: 0 1px 5px rgba(0, 0, 0, 0.28);\n      -moz-box-shadow: 0 1px 5px rgba(0, 0, 0, 0.28);\n      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.28); }\n  #sb_widget .sb-common-btn, #sb_widget .channel-board .content .login-btn, #sb_widget .channel-board .content.channel-list ul .empty-item > .new-chat-btn, #sb_widget .chat-section .chat-board .leave-popup > div .leave-btn, #sb_widget .chat-section .chat-board .leave-popup > div .cancel-btn, #sb_widget .chat-section .content .content-bottom .new-chat-btn, #sb_widget .popup .popup-bottom .invite-btn {\n    margin: 0;\n    padding: 0;\n    font-size: 100%;\n    line-height: 1;\n    width: auto;\n    height: auto;\n    box-sizing: initial;\n    padding: 0 16px;\n    border: 1px solid #38B349;\n    background-color: #3FCC52;\n    color: #FFFFFF;\n    cursor: pointer;\n    border-radius: 3px;\n    -webkit-border-radius: 3px;\n    -moz-border-radius: 3px;\n    -ms-border-radius: 3px;\n    -o-border-radius: 3px;\n    -webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), 0 1px rgba(255, 255, 255, 0.75);\n    -moz-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), 0 1px rgba(255, 255, 255, 0.75);\n    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), 0 1px rgba(255, 255, 255, 0.75); }\n    #sb_widget .sb-common-btn:hover, #sb_widget .channel-board .content .login-btn:hover, #sb_widget .channel-board .content.channel-list ul .empty-item > .new-chat-btn:hover, #sb_widget .chat-section .chat-board .leave-popup > div .leave-btn:hover, #sb_widget .chat-section .chat-board .leave-popup > div .cancel-btn:hover, #sb_widget .chat-section .content .content-bottom .new-chat-btn:hover, #sb_widget .popup .popup-bottom .invite-btn:hover {\n      -webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25), 0 1px rgba(255, 255, 255, 0.75);\n      -moz-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25), 0 1px rgba(255, 255, 255, 0.75);\n      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25), 0 1px rgba(255, 255, 255, 0.75); }\n  #sb_widget .sb-common-btn.disabled, #sb_widget .channel-board .content .disabled.login-btn, #sb_widget .channel-board .content.channel-list ul .empty-item > .disabled.new-chat-btn, #sb_widget .chat-section .chat-board .leave-popup > div .disabled.leave-btn, #sb_widget .chat-section .chat-board .leave-popup > div .disabled.cancel-btn, #sb_widget .chat-section .content .content-bottom .disabled.new-chat-btn, #sb_widget .popup .popup-bottom .disabled.invite-btn {\n    background-color: #98DC99;\n    border: 1px solid #95D296; }\n    #sb_widget .sb-common-btn.disabled:hover, #sb_widget .channel-board .content .disabled.login-btn:hover, #sb_widget .channel-board .content.channel-list ul .empty-item > .disabled.new-chat-btn:hover, #sb_widget .chat-section .chat-board .leave-popup > div .disabled.leave-btn:hover, #sb_widget .chat-section .chat-board .leave-popup > div .disabled.cancel-btn:hover, #sb_widget .chat-section .content .content-bottom .disabled.new-chat-btn:hover, #sb_widget .popup .popup-bottom .disabled.invite-btn:hover {\n      -webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), 0 1px rgba(255, 255, 255, 0.75);\n      -moz-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), 0 1px rgba(255, 255, 255, 0.75);\n      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), 0 1px rgba(255, 255, 255, 0.75); }\n  #sb_widget .channel-board {\n    margin: 0;\n    padding: 0;\n    font-size: 100%;\n    line-height: 1;\n    width: auto;\n    height: auto;\n    box-sizing: initial;\n    display: none;\n    z-index: 99992;\n    position: absolute;\n    bottom: 0;\n    right: 0;\n    width: 280px;\n    height: 462px;\n    -webkit-box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);\n    -moz-box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);\n    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3); }\n    #sb_widget .channel-board .board-top {\n      margin: 0;\n      padding: 0;\n      font-size: 100%;\n      line-height: 1;\n      width: auto;\n      height: auto;\n      box-sizing: initial;\n      width: calc(100% - 24px);\n      height: 36px;\n      background-color: #896BF5;\n      padding: 0 12px;\n      border-bottom: 1px solid #795FDC; }\n      #sb_widget .channel-board .board-top .title {\n        margin: 0;\n        padding: 0;\n        font-size: 100%;\n        line-height: 1;\n        width: auto;\n        height: auto;\n        box-sizing: initial;\n        display: inline-block;\n        float: left;\n        font-size: 16px;\n        color: #EBE6FF;\n        letter-spacing: 0.85px;\n        line-height: 36px; }\n      #sb_widget .channel-board .board-top .btn {\n        margin: 0;\n        padding: 0;\n        font-size: 100%;\n        line-height: 1;\n        width: auto;\n        height: auto;\n        box-sizing: initial;\n        display: inline-block;\n        float: right;\n        position: relative;\n        top: 50%;\n        width: 24px;\n        height: 26px;\n        cursor: pointer;\n        -webkit-transform: translate(0, -50%);\n        -moz-transform: translate(0, -50%);\n        -ms-transform: translate(0, -50%);\n        -o-transform: translate(0, -50%);\n        transform: translate(0, -50%); }\n        #sb_widget .channel-board .board-top .btn:hover > .tooltip, #sb_widget .channel-board .board-top .chat-section .top .btn:hover > .tooltip, #sb_widget .channel-board .board-top .chat-section .top .btn.ic-leave .btn:hover > .tooltip, #sb_widget .channel-board .board-top .chat-section .top .btn.ic-members .btn:hover > .tooltip, #sb_widget .channel-board .board-top .chat-section .top .btn.ic-invite .btn:hover > .tooltip {\n          font-size: 12px;\n          display: block; }\n        #sb_widget .channel-board .board-top .btn:hover > .tooltip, #sb_widget .channel-board .board-top .btn .tooltip, #sb_widget .channel-board .board-top .chat-section .top .btn:hover > .tooltip, #sb_widget .channel-board .board-top .chat-section .top .btn.ic-leave .tooltip, #sb_widget .chat-section .top .channel-board .board-top .btn.ic-leave .tooltip, #sb_widget .channel-board .board-top .chat-section .top .btn.ic-members .tooltip, #sb_widget .chat-section .top .channel-board .board-top .btn.ic-members .tooltip, #sb_widget .channel-board .board-top .chat-section .top .btn.ic-invite .tooltip, #sb_widget .chat-section .top .channel-board .board-top .btn.ic-invite .tooltip {\n          width: 74px;\n          position: absolute;\n          top: -37px;\n          left: -37px; }\n        #sb_widget .channel-board .board-top .btn .option-menu {\n          margin: 0;\n          padding: 0;\n          font-size: 100%;\n          line-height: 1;\n          width: auto;\n          height: auto;\n          box-sizing: initial;\n          display: none;\n          position: absolute;\n          top: 25px;\n          right: -35px;\n          width: 140px;\n          height: 42px;\n          background-color: transparent;\n          cursor: pointer; }\n          #sb_widget .channel-board .board-top .btn .option-menu .option-content {\n            margin: 0;\n            padding: 0;\n            font-size: 100%;\n            line-height: 1;\n            width: auto;\n            height: auto;\n            box-sizing: initial;\n            position: absolute;\n            bottom: 0;\n            width: calc(100% - 32px);\n            height: 32px;\n            background-color: #FFFFFF;\n            font-size: 13px;\n            color: #485874;\n            line-height: 32px;\n            padding: 0 16px;\n            border-radius: 3px;\n            -webkit-border-radius: 3px;\n            -moz-border-radius: 3px;\n            -ms-border-radius: 3px;\n            -o-border-radius: 3px;\n            -webkit-box-shadow: 1px 1px 14px 3px rgba(0, 0, 0, 0.3);\n            -moz-box-shadow: 1px 1px 14px 3px rgba(0, 0, 0, 0.3);\n            box-shadow: 1px 1px 14px 3px rgba(0, 0, 0, 0.3); }\n            #sb_widget .channel-board .board-top .btn .option-menu .option-content::before {\n              content: ' ';\n              position: absolute;\n              bottom: 100%;\n              left: calc(50% + 21px);\n              margin-left: -5px;\n              border-width: 7px;\n              border-style: solid;\n              border-color: transparent transparent #FFFFFF transparent; }\n    #sb_widget .channel-board .content {\n      margin: 0;\n      padding: 0;\n      font-size: 100%;\n      line-height: 1;\n      width: auto;\n      height: auto;\n      box-sizing: initial;\n      height: 426px;\n      background-color: #FFFFFF; }\n      #sb_widget .channel-board .content .user-id {\n        margin: 0;\n        padding: 0;\n        font-size: 100%;\n        line-height: 1;\n        width: auto;\n        height: auto;\n        box-sizing: initial;\n        width: 100%;\n        padding-top: 30px; }\n      #sb_widget .channel-board .content .nickname {\n        margin: 0;\n        padding: 0;\n        font-size: 100%;\n        line-height: 1;\n        width: auto;\n        height: auto;\n        box-sizing: initial;\n        width: 100%;\n        padding-top: 12px; }\n      #sb_widget .channel-board .content .title {\n        margin: 0;\n        padding: 0;\n        font-size: 100%;\n        line-height: 1;\n        width: auto;\n        height: auto;\n        box-sizing: initial;\n        font-size: 11px;\n        color: #67769A;\n        padding-bottom: 6px; }\n      #sb_widget .channel-board .content .input {\n        margin: 0;\n        padding: 0;\n        font-size: 100%;\n        line-height: 1;\n        width: auto;\n        height: auto;\n        box-sizing: initial;\n        width: calc(98% - 16px);\n        height: 32px;\n        border: 1px solid #E2E7EB;\n        background-color: #F8F9FA;\n        font-size: 13px;\n        color: #3A414D;\n        padding: 0 8px;\n        border-radius: 3px;\n        -webkit-border-radius: 3px;\n        -moz-border-radius: 3px;\n        -ms-border-radius: 3px;\n        -o-border-radius: 3px; }\n        #sb_widget .channel-board .content .input:focus {\n          outline: none;\n          border: 1px solid #7b5fd9;\n          -webkit-box-shadow: 0 0 4px #BDB0FF;\n          -moz-box-shadow: 0 0 4px #BDB0FF;\n          box-shadow: 0 0 4px #BDB0FF; }\n      #sb_widget .channel-board .content .login-btn {\n        display: inline-block;\n        position: absolute;\n        left: 50%;\n        margin-top: 20px;\n        height: 32px;\n        width: calc(98px - 32px);\n        text-align: center;\n        line-height: 32px;\n        font-size: 14px;\n        -webkit-transform: translate(-50%, 0);\n        -moz-transform: translate(-50%, 0);\n        -ms-transform: translate(-50%, 0);\n        -o-transform: translate(-50%, 0);\n        transform: translate(-50%, 0); }\n        #sb_widget .channel-board .content .login-btn .sb-spinner {\n          margin-top: 7px; }\n          #sb_widget .channel-board .content .login-btn .sb-spinner div {\n            width: 8px;\n            height: 8px;\n            margin-top: 4px;\n            background-color: #35A300; }\n          #sb_widget .channel-board .content .login-btn .sb-spinner :nth-child(2) {\n            margin: 0 4px; }\n    #sb_widget .channel-board .content.login-form {\n      margin: 0;\n      padding: 0;\n      font-size: 100%;\n      line-height: 1;\n      width: auto;\n      height: auto;\n      box-sizing: initial;\n      width: calc(100% - 24px);\n      height: calc(100% - 37px);\n      padding: 0 12px; }\n    #sb_widget .channel-board .content.channel-list {\n      margin: 0;\n      padding: 0;\n      font-size: 100%;\n      line-height: 1;\n      width: auto;\n      height: auto;\n      box-sizing: initial;\n      overflow-y: scroll;\n      overflow-x: hidden;\n      width: 100%;\n      height: calc(100% - 37px); }\n      #sb_widget .channel-board .content.channel-list ul {\n        margin: 0;\n        padding: 0;\n        font-size: 100%;\n        line-height: 1;\n        width: auto;\n        height: auto;\n        box-sizing: initial;\n        width: 100%;\n        margin: 0;\n        padding: 0;\n        list-style-type: none; }\n        #sb_widget .channel-board .content.channel-list ul li {\n          margin: 0;\n          padding: 0;\n          font-size: 100%;\n          line-height: 1;\n          width: auto;\n          height: auto;\n          box-sizing: initial;\n          width: calc(100% - 24px);\n          height: 48px;\n          padding: 0 12px;\n          background-color: #FFFFFF;\n          cursor: pointer; }\n          #sb_widget .channel-board .content.channel-list ul li:hover {\n            background-color: #F5F8FA; }\n            #sb_widget .channel-board .content.channel-list ul li:hover .content {\n              background-color: #F5F8FA; }\n          #sb_widget .channel-board .content.channel-list ul li .item {\n            margin: 0;\n            padding: 0;\n            font-size: 100%;\n            line-height: 1;\n            width: auto;\n            height: auto;\n            box-sizing: initial;\n            width: 100%;\n            height: calc(100% - 12px - 1px);\n            padding: 6px 0;\n            border-bottom: 1px solid #E5E5E5; }\n        #sb_widget .channel-board .content.channel-list ul .image {\n          margin: 0;\n          padding: 0;\n          font-size: 100%;\n          line-height: 1;\n          width: auto;\n          height: auto;\n          box-sizing: initial;\n          float: left;\n          width: 36px;\n          height: 100%;\n          background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/thumnail-channel-01.svg\");\n          background-position: center;\n          background-size: cover;\n          background-repeat: no-repeat; }\n        #sb_widget .channel-board .content.channel-list ul .content {\n          margin: 0;\n          padding: 0;\n          font-size: 100%;\n          line-height: 1;\n          width: auto;\n          height: auto;\n          box-sizing: initial;\n          float: right;\n          width: calc(100% - 36px - 8px);\n          height: 100%;\n          margin-left: 8px; }\n        #sb_widget .channel-board .content.channel-list ul .content-top {\n          margin: 0;\n          padding: 0;\n          font-size: 100%;\n          line-height: 1;\n          width: auto;\n          height: auto;\n          box-sizing: initial;\n          width: 100%;\n          height: 50%; }\n          #sb_widget .channel-board .content.channel-list ul .content-top .title {\n            margin: 0;\n            padding: 0;\n            font-size: 100%;\n            line-height: 1;\n            width: auto;\n            height: auto;\n            box-sizing: initial;\n            padding: 0;\n            float: left;\n            width: 125px;\n            height: 18px;\n            font-size: 14px;\n            color: #444444;\n            line-height: 18px;\n            overflow: hidden;\n            -ms-text-overflow: ellipsis;\n            text-overflow: ellipsis;\n            white-space: nowrap; }\n          #sb_widget .channel-board .content.channel-list ul .content-top time {\n            margin: 0;\n            padding: 0;\n            font-size: 100%;\n            line-height: 1;\n            width: auto;\n            height: auto;\n            box-sizing: initial;\n            float: right;\n            font-size: 12px;\n            line-height: 18px;\n            color: #A5B3CD; }\n        #sb_widget .channel-board .content.channel-list ul .content-bottom {\n          margin: 0;\n          padding: 0;\n          font-size: 100%;\n          line-height: 1;\n          width: auto;\n          height: auto;\n          box-sizing: initial;\n          width: 100%;\n          height: 50%; }\n          #sb_widget .channel-board .content.channel-list ul .content-bottom .last-message {\n            margin: 0;\n            padding: 0;\n            font-size: 100%;\n            line-height: 1;\n            width: auto;\n            height: auto;\n            box-sizing: initial;\n            float: left;\n            width: 170px;\n            height: 18px;\n            font-size: 13px;\n            color: #A5B3CD;\n            line-height: 18px;\n            overflow: hidden;\n            -ms-text-overflow: ellipsis;\n            text-overflow: ellipsis;\n            white-space: nowrap; }\n          #sb_widget .channel-board .content.channel-list ul .content-bottom span {\n            margin: 0;\n            padding: 0;\n            font-size: 100%;\n            line-height: 1;\n            width: auto;\n            height: auto;\n            box-sizing: initial;\n            display: none;\n            float: right;\n            width: 18px;\n            height: 18px;\n            background-color: #FB6094;\n            font-weight: 700;\n            font-size: 12px;\n            color: #FFFFFF;\n            line-height: 18px;\n            text-align: center;\n            border-radius: 50%;\n            -webkit-border-radius: 50%;\n            -moz-border-radius: 50%;\n            -ms-border-radius: 50%;\n            -o-border-radius: 50%; }\n        #sb_widget .channel-board .content.channel-list ul .empty-item {\n          margin: 0;\n          padding: 0;\n          font-size: 100%;\n          line-height: 1;\n          width: auto;\n          height: auto;\n          box-sizing: initial;\n          text-align: center; }\n          #sb_widget .channel-board .content.channel-list ul .empty-item > .title {\n            margin: 0;\n            padding: 0;\n            font-size: 100%;\n            line-height: 1;\n            width: auto;\n            height: auto;\n            box-sizing: initial;\n            margin: 130px 0 16px 0;\n            font-size: 14px;\n            color: #67769A; }\n          #sb_widget .channel-board .content.channel-list ul .empty-item > .new-chat-btn {\n            margin: 0;\n            padding: 0;\n            font-size: 100%;\n            line-height: 1;\n            width: auto;\n            height: auto;\n            box-sizing: initial;\n            display: block;\n            margin: 0 auto;\n            width: 48px;\n            height: 30px;\n            line-height: 30px;\n            padding: 0 16px; }\n      #sb_widget .channel-board .content.channel-list .sb-spinner {\n        position: relative;\n        top: calc(426px / 2);\n        -webkit-transform: translate(0, -50%);\n        -moz-transform: translate(0, -50%);\n        -ms-transform: translate(0, -50%);\n        -o-transform: translate(0, -50%);\n        transform: translate(0, -50%); }\n        #sb_widget .channel-board .content.channel-list .sb-spinner div {\n          width: 12px;\n          height: 12px;\n          margin-top: 6px; }\n        #sb_widget .channel-board .content.channel-list .sb-spinner :nth-child(2) {\n          margin: 0 6px; }\n  #sb_widget .chat-section {\n    margin: 0;\n    padding: 0;\n    font-size: 100%;\n    line-height: 1;\n    width: auto;\n    height: auto;\n    box-sizing: initial;\n    z-index: 99992;\n    position: absolute;\n    right: 60px;\n    bottom: 0;\n    width: auto;\n    max-height: 520px; }\n    #sb_widget .chat-section .chat-board {\n      margin: 0;\n      padding: 0;\n      font-size: 100%;\n      line-height: 1;\n      width: auto;\n      height: auto;\n      box-sizing: initial;\n      margin-top: 40px;\n      float: right;\n      width: 280px;\n      height: 426px;\n      margin-right: 20px;\n      -webkit-box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);\n      -moz-box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);\n      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3); }\n      #sb_widget .chat-section .chat-board .leave-popup {\n        margin: 0;\n        padding: 0;\n        font-size: 100%;\n        line-height: 1;\n        width: auto;\n        height: auto;\n        box-sizing: initial;\n        width: 280px;\n        height: 100%;\n        position: absolute;\n        background-color: rgba(255, 255, 255, 0.9);\n        z-index: 1; }\n        #sb_widget .chat-section .chat-board .leave-popup > .popup-top {\n          margin: 0;\n          padding: 0;\n          font-size: 100%;\n          line-height: 1;\n          width: auto;\n          height: auto;\n          box-sizing: initial;\n          margin-top: 130px;\n          text-align: center;\n          color: #67769A; }\n        #sb_widget .chat-section .chat-board .leave-popup > div {\n          margin: 0;\n          padding: 0;\n          font-size: 100%;\n          line-height: 1;\n          width: auto;\n          height: auto;\n          box-sizing: initial;\n          margin-top: 16px;\n          text-align: center; }\n          #sb_widget .chat-section .chat-board .leave-popup > div .leave-btn {\n            display: inline-block;\n            padding: 0 8px;\n            width: 52px;\n            height: 32px;\n            line-height: 32px; }\n            #sb_widget .chat-section .chat-board .leave-popup > div .leave-btn .sb-spinner {\n              line-height: 32px; }\n              #sb_widget .chat-section .chat-board .leave-popup > div .leave-btn .sb-spinner div {\n                width: 8px;\n                height: 8px;\n                margin-top: 4px;\n                background-color: #35A300; }\n              #sb_widget .chat-section .chat-board .leave-popup > div .leave-btn .sb-spinner :nth-child(2) {\n                margin: 0 4px; }\n          #sb_widget .chat-section .chat-board .leave-popup > div .leave-btn.disabled {\n            cursor: default; }\n          #sb_widget .chat-section .chat-board .leave-popup > div .cancel-btn {\n            background-color: #F0F0F5;\n            border-color: #E2E7EB;\n            color: #67769A;\n            margin-left: 8px;\n            display: inline-block;\n            padding: 0 8px;\n            width: 52px;\n            height: 32px;\n            line-height: 32px; }\n    #sb_widget .chat-section .top {\n      margin: 0;\n      padding: 0;\n      font-size: 100%;\n      line-height: 1;\n      width: auto;\n      height: auto;\n      box-sizing: initial;\n      width: calc(100% - 24px);\n      height: 35px;\n      padding: 0 12px;\n      background-color: #F3F5F7;\n      border-bottom: 1px solid #E5E5E5;\n      -webkit-box-shadow: 0 1px 1px -2px rgba(0, 0, 0, 0.2);\n      -moz-box-shadow: 0 1px 1px -2px rgba(0, 0, 0, 0.2);\n      box-shadow: 0 1px 1px -2px rgba(0, 0, 0, 0.2); }\n      #sb_widget .chat-section .top .title {\n        margin: 0;\n        padding: 0;\n        font-size: 100%;\n        line-height: 1;\n        width: auto;\n        height: auto;\n        box-sizing: initial;\n        float: left;\n        max-width: 123px;\n        font-size: 13px;\n        color: #444444;\n        line-height: 35px;\n        overflow: hidden;\n        -ms-text-overflow: ellipsis;\n        text-overflow: ellipsis;\n        white-space: nowrap; }\n      #sb_widget .chat-section .top .count {\n        margin: 0;\n        padding: 0;\n        font-size: 100%;\n        line-height: 1;\n        width: auto;\n        height: auto;\n        box-sizing: initial;\n        float: left;\n        width: 16px;\n        height: 16px;\n        margin-left: 8px;\n        background-color: #D5D7D9;\n        font-weight: 700;\n        font-size: 10px;\n        color: #67769A;\n        text-align: center;\n        line-height: 16px;\n        position: relative;\n        top: 50%;\n        -webkit-transform: translate(0, -50%);\n        -moz-transform: translate(0, -50%);\n        -ms-transform: translate(0, -50%);\n        -o-transform: translate(0, -50%);\n        transform: translate(0, -50%); }\n      #sb_widget .chat-section .top .btn {\n        margin: 0;\n        padding: 0;\n        font-size: 100%;\n        line-height: 1;\n        width: auto;\n        height: auto;\n        box-sizing: initial;\n        float: right;\n        width: 24px;\n        height: 26px;\n        position: relative;\n        top: 50%;\n        cursor: pointer;\n        -webkit-transform: translate(0, -50%);\n        -moz-transform: translate(0, -50%);\n        -ms-transform: translate(0, -50%);\n        -o-transform: translate(0, -50%);\n        transform: translate(0, -50%); }\n        #sb_widget .chat-section .top .channel-board .board-top .btn:hover > .tooltip, #sb_widget .chat-section .top .btn:hover > .tooltip, #sb_widget .chat-section .top .btn.ic-leave .btn:hover > .tooltip, #sb_widget .chat-section .top .btn.ic-members .btn:hover > .tooltip, #sb_widget .chat-section .top .btn.ic-invite .btn:hover > .tooltip {\n          display: block; }\n      #sb_widget .chat-section .top .btn.ic-leave {\n        margin-right: 3px; }\n        #sb_widget .chat-section .top .btn.ic-leave .tooltip {\n          width: 78px;\n          position: absolute;\n          top: -37px;\n          left: -39px; }\n      #sb_widget .chat-section .top .btn.ic-members {\n        margin: 0 3px; }\n      #sb_widget .chat-section .top .btn.ic-members .tooltip {\n        width: 74px;\n        position: absolute;\n        top: -37px;\n        left: -37px; }\n      #sb_widget .chat-section .top .btn.ic-invite .tooltip {\n        width: 78px;\n        position: absolute;\n        top: -37px;\n        left: -39px; }\n    #sb_widget .chat-section .content {\n      margin: 0;\n      padding: 0;\n      font-size: 100%;\n      line-height: 1;\n      width: auto;\n      height: auto;\n      box-sizing: initial;\n      width: 100%;\n      height: calc(100% - 36px - 1px);\n      background-color: #FFFFFF; }\n      #sb_widget .chat-section .content .sb-spinner {\n        position: relative;\n        top: 50%;\n        -webkit-transform: translate(0, -50%);\n        -moz-transform: translate(0, -50%);\n        -ms-transform: translate(0, -50%);\n        -o-transform: translate(0, -50%);\n        transform: translate(0, -50%); }\n      #sb_widget .chat-section .content .user-content {\n        margin: 0;\n        padding: 0;\n        font-size: 100%;\n        line-height: 1;\n        width: auto;\n        height: auto;\n        box-sizing: initial;\n        width: 100%;\n        height: calc(100% - 64px);\n        background-color: #FFFFFF;\n        overflow-y: scroll;\n        overflow-x: hidden; }\n        #sb_widget .chat-section .content .user-content ul {\n          margin: 0;\n          padding: 0;\n          font-size: 100%;\n          line-height: 1;\n          width: auto;\n          height: auto;\n          box-sizing: initial;\n          width: 100%;\n          margin: 0;\n          padding: 0;\n          list-style-type: none; }\n          #sb_widget .chat-section .content .user-content ul li {\n            margin: 0;\n            padding: 0;\n            font-size: 100%;\n            line-height: 1;\n            width: auto;\n            height: auto;\n            box-sizing: initial;\n            width: calc(100% - 24px);\n            height: 44px;\n            padding: 0 12px;\n            cursor: pointer; }\n            #sb_widget .chat-section .content .user-content ul li:hover {\n              background-color: #F5F8FA; }\n        #sb_widget .chat-section .content .user-content .user-item {\n          margin: 0;\n          padding: 0;\n          font-size: 100%;\n          line-height: 1;\n          width: auto;\n          height: auto;\n          box-sizing: initial;\n          width: 100%;\n          height: calc(100% - 12px - 1px);\n          padding: 6px 0;\n          border-bottom: 1px solid #E5E5E5; }\n          #sb_widget .chat-section .content .user-content .user-item .user-select {\n            margin: 0;\n            padding: 0;\n            font-size: 100%;\n            line-height: 1;\n            width: auto;\n            height: auto;\n            box-sizing: initial;\n            position: relative;\n            top: 50%;\n            float: left;\n            width: 16px;\n            height: 16px;\n            -webkit-transform: translate(0, -50%);\n            -moz-transform: translate(0, -50%);\n            -ms-transform: translate(0, -50%);\n            -o-transform: translate(0, -50%);\n            transform: translate(0, -50%);\n            background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/btn-check-off.svg\");\n            background-position: center;\n            background-size: cover;\n            background-repeat: no-repeat; }\n          #sb_widget .chat-section .content .user-content .user-item .user-select.active {\n            background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/btn-check-on.svg\");\n            background-position: center;\n            background-size: cover;\n            background-repeat: no-repeat; }\n          #sb_widget .chat-section .content .user-content .user-item .image {\n            margin: 0;\n            padding: 0;\n            font-size: 100%;\n            line-height: 1;\n            width: auto;\n            height: auto;\n            box-sizing: initial;\n            float: left;\n            width: 31px;\n            height: 31px;\n            margin: 0 8px;\n            background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/thumnail-member-01.svg\");\n            background-position: center;\n            background-size: cover;\n            background-repeat: no-repeat; }\n          #sb_widget .chat-section .content .user-content .user-item .nickname {\n            margin: 0;\n            padding: 0;\n            font-size: 100%;\n            line-height: 1;\n            width: auto;\n            height: auto;\n            box-sizing: initial;\n            float: left;\n            font-size: 13px;\n            color: #67769A;\n            line-height: 31px;\n            max-width: 70%;\n            overflow: hidden;\n            -ms-text-overflow: ellipsis;\n            text-overflow: ellipsis;\n            white-space: nowrap; }\n      #sb_widget .chat-section .content .content-bottom {\n        margin: 0;\n        padding: 0;\n        font-size: 100%;\n        line-height: 1;\n        width: auto;\n        height: auto;\n        box-sizing: initial;\n        width: calc(100% - 24px);\n        height: calc(52px - 24px);\n        padding: 12px;\n        background-color: #F3F5F7;\n        text-align: center;\n        -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);\n        -moz-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);\n        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2); }\n        #sb_widget .chat-section .content .content-bottom .new-chat-btn {\n          display: inline-block;\n          width: 70px;\n          height: 26px;\n          padding: 0 12px;\n          text-align: center;\n          line-height: 26px;\n          font-size: 13px;\n          letter-spacing: 0.85px; }\n          #sb_widget .chat-section .content .content-bottom .new-chat-btn .sb-spinner div {\n            width: 8px;\n            height: 8px;\n            margin-top: 4px;\n            background-color: #35A300; }\n          #sb_widget .chat-section .content .content-bottom .new-chat-btn .sb-spinner :nth-child(2) {\n            margin: 0 4px; }\n        #sb_widget .chat-section .content .content-bottom .new-chat-btn.disabled {\n          cursor: default; }\n      #sb_widget .chat-section .content .message-content {\n        margin: 0;\n        padding: 0;\n        font-size: 100%;\n        line-height: 1;\n        width: auto;\n        height: auto;\n        box-sizing: initial;\n        width: calc(100% - 16px);\n        height: 328px;\n        min-height: 240px;\n        max-height: 328px;\n        overflow-x: hidden;\n        overflow-y: scroll;\n        padding: 0 8px 8px 8px; }\n      #sb_widget .chat-section .content .typing {\n        margin: 0;\n        padding: 0;\n        font-size: 100%;\n        line-height: 1;\n        width: auto;\n        height: auto;\n        box-sizing: initial;\n        display: none;\n        width: calc(100% - 16px);\n        height: 22px;\n        padding: 0 8px;\n        font-size: 12px;\n        color: #C3CBD9;\n        line-height: 22px; }\n        #sb_widget .chat-section .content .typing .sb-spinner {\n          top: initial;\n          position: static;\n          -webkit-transform: translate(0, 0);\n          -moz-transform: translate(0, 0);\n          -ms-transform: translate(0, 0);\n          -o-transform: translate(0, 0);\n          transform: translate(0, 0);\n          display: inline-block;\n          width: auto;\n          text-align: left;\n          margin-right: 8px; }\n          #sb_widget .chat-section .content .typing .sb-spinner div {\n            background-color: #A5B4CD;\n            width: 6px;\n            height: 6px; }\n          #sb_widget .chat-section .content .typing .sb-spinner :nth-child(2) {\n            margin: 0 3px; }\n      #sb_widget .chat-section .content .input {\n        margin: 0;\n        padding: 0;\n        font-size: 100%;\n        line-height: 1;\n        width: auto;\n        height: auto;\n        box-sizing: initial;\n        width: calc(100% - 16px);\n        min-height: 51px;\n        max-height: 118px;\n        padding: 0 8px;\n        border-top: 1px solid #E5E5E5; }\n        #sb_widget .chat-section .content .input .text {\n          margin: 0;\n          padding: 0;\n          font-size: 100%;\n          line-height: 1;\n          width: auto;\n          height: auto;\n          box-sizing: initial;\n          width: calc(100% - 8px);\n          min-height: 24px;\n          max-height: 90px;\n          padding: 5px 8px 0 0;\n          outline: none !important;\n          overflow-x: hidden;\n          overflow-y: auto;\n          word-wrap: break-word;\n          resize: none;\n          border: 0;\n          font-size: 13px;\n          color: #485874;\n          background-color: #FFFFFF; }\n          #sb_widget .chat-section .content .input .text:focus {\n            outline: 0; }\n          #sb_widget .chat-section .content .input .text > div {\n            margin: 0;\n            padding: 0;\n            font-size: 100%;\n            line-height: 1;\n            width: auto;\n            height: auto;\n            box-sizing: initial;\n            height: 0px !important; }\n        #sb_widget .chat-section .content .input .text:empty::before {\n          font-size: 13px;\n          content: \"Type a Message\";\n          color: #C3CBD9; }\n        #sb_widget .chat-section .content .input .text:focus:empty::before {\n          content: \"\"; }\n        #sb_widget .chat-section .content .input .file {\n          margin: 0;\n          padding: 0;\n          font-size: 100%;\n          line-height: 1;\n          width: auto;\n          height: auto;\n          box-sizing: initial;\n          float: left;\n          width: 22px;\n          height: 22px;\n          cursor: pointer;\n          background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/btn-file-add-default.svg\");\n          background-position: center;\n          background-size: cover;\n          background-repeat: no-repeat;\n          background-position: inherit;\n          background-size: 14px 14px; }\n          #sb_widget .chat-section .content .input .file:hover {\n            background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/btn-file-add-over.svg\");\n            background-position: center;\n            background-size: cover;\n            background-repeat: no-repeat;\n            background-position: inherit;\n            background-size: 14px 14px; }\n    #sb_widget .chat-section .message-set {\n      margin: 0;\n      padding: 0;\n      font-size: 100%;\n      line-height: 1;\n      width: auto;\n      height: auto;\n      box-sizing: initial;\n      width: 100%;\n      margin-top: 8px;\n      float: left;\n      direction: ltr;\n      text-align: left; }\n      #sb_widget .chat-section .message-set .image {\n        margin: 0;\n        padding: 0;\n        font-size: 100%;\n        line-height: 1;\n        width: auto;\n        height: auto;\n        box-sizing: initial;\n        float: inherit;\n        width: 32px;\n        height: 32px;\n        margin-right: 8px;\n        background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/thumnail-member-01.svg\");\n        background-position: center;\n        background-size: cover;\n        background-repeat: no-repeat;\n        background-position: inherit; }\n      #sb_widget .chat-section .message-set .message {\n        margin: 0;\n        padding: 0;\n        font-size: 100%;\n        line-height: 1;\n        width: auto;\n        height: auto;\n        box-sizing: initial;\n        float: inherit; }\n      #sb_widget .chat-section .message-set .nickname {\n        margin: 0;\n        padding: 0;\n        font-size: 100%;\n        line-height: 1;\n        width: auto;\n        height: auto;\n        box-sizing: initial;\n        font-size: 12px;\n        color: #8090B4; }\n      #sb_widget .chat-section .message-set .message-item {\n        margin: 0;\n        padding: 0;\n        font-size: 100%;\n        line-height: 1;\n        width: auto;\n        height: auto;\n        box-sizing: initial;\n        float: inherit; }\n        #sb_widget .chat-section .message-set .message-item .text {\n          margin: 0;\n          padding: 0;\n          font-size: 100%;\n          line-height: 1;\n          width: auto;\n          height: auto;\n          box-sizing: initial;\n          display: inline-block;\n          text-align: inherit;\n          max-width: 180px;\n          background-color: #F0F0F5;\n          color: #444444;\n          font-size: 13px;\n          padding: 6px;\n          word-wrap: break-word;\n          border-radius: 5px;\n          -webkit-border-radius: 5px;\n          -moz-border-radius: 5px;\n          -ms-border-radius: 5px;\n          -o-border-radius: 5px; }\n        #sb_widget .chat-section .message-set .message-item .file-message {\n          margin: 0;\n          padding: 0;\n          font-size: 100%;\n          line-height: 1;\n          width: auto;\n          height: auto;\n          box-sizing: initial;\n          display: inline-block; }\n          #sb_widget .chat-section .message-set .message-item .file-message .image {\n            margin: 0;\n            padding: 0;\n            font-size: 100%;\n            line-height: 1;\n            width: auto;\n            height: auto;\n            box-sizing: initial;\n            display: inline-block;\n            text-align: inherit;\n            width: 160px;\n            height: 160px;\n            cursor: pointer;\n            vertical-align: middle;\n            background-position: center;\n            background-size: 160px 160px;\n            background-repeat: no-repeat;\n            border-radius: 5px;\n            -webkit-border-radius: 5px;\n            -moz-border-radius: 5px;\n            -ms-border-radius: 5px;\n            -o-border-radius: 5px; }\n        #sb_widget .chat-section .message-set .message-item .file {\n          margin: 0;\n          padding: 0;\n          font-size: 100%;\n          line-height: 1;\n          width: auto;\n          height: auto;\n          box-sizing: initial;\n          display: inline-flex;\n          text-align: inherit;\n          max-width: 180px;\n          background-color: transparent;\n          color: #444444;\n          font-size: 13px;\n          word-wrap: break-word;\n          cursor: pointer;\n          text-decoration: none;\n          vertical-align: bottom; }\n          #sb_widget .chat-section .message-set .message-item .file > .file-icon {\n            margin: 0;\n            padding: 0;\n            font-size: 100%;\n            line-height: 1;\n            width: auto;\n            height: auto;\n            box-sizing: initial;\n            display: inline-block;\n            width: 24px;\n            height: 26px;\n            background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/icon-file.svg\");\n            background-position: center;\n            background-size: cover;\n            background-repeat: no-repeat; }\n          #sb_widget .chat-section .message-set .message-item .file > .file-text {\n            margin: 0;\n            padding: 0;\n            font-size: 100%;\n            line-height: 1;\n            width: auto;\n            height: auto;\n            box-sizing: initial;\n            margin: 0 0 0 8px;\n            max-width: calc(100% - 24px - 8px); }\n            #sb_widget .chat-section .message-set .message-item .file > .file-text > .file-name {\n              margin: 0;\n              padding: 0;\n              font-size: 100%;\n              line-height: 1;\n              width: auto;\n              height: auto;\n              box-sizing: initial;\n              display: inline-block;\n              max-width: 100%;\n              -ms-text-overflow: ellipsis;\n              text-overflow: ellipsis;\n              white-space: nowrap;\n              overflow: hidden; }\n            #sb_widget .chat-section .message-set .message-item .file > .file-text > .file-download {\n              margin: 0;\n              padding: 0;\n              font-size: 100%;\n              line-height: 1;\n              width: auto;\n              height: auto;\n              box-sizing: initial;\n              font-size: 11px;\n              line-height: 6px;\n              color: #0081D6; }\n        #sb_widget .chat-section .message-set .message-item .unread {\n          margin: 0;\n          padding: 0;\n          font-size: 100%;\n          line-height: 1;\n          width: auto;\n          height: auto;\n          box-sizing: initial;\n          display: none !important;\n          background-color: transparent;\n          color: #A08CFF;\n          font-size: 11px;\n          font-weight: 700;\n          text-align: center;\n          margin: 0 4px;\n          vertical-align: bottom; }\n    #sb_widget .chat-section .message-set.user {\n      float: right; }\n      #sb_widget .chat-section .message-set.user .image,\n      #sb_widget .chat-section .message-set.user .nickname {\n        display: none; }\n      #sb_widget .chat-section .message-set.user .message-item {\n        float: inherit; }\n        #sb_widget .chat-section .message-set.user .message-item .text {\n          background: #896BF5;\n          color: #FFFFFF; }\n        #sb_widget .chat-section .message-set.user .message-item .image {\n          display: inline-block;\n          text-align: inherit;\n          width: 160px;\n          height: 160px;\n          cursor: pointer;\n          margin: 0;\n          background-position: center;\n          background-size: 160px 160px;\n          background-repeat: no-repeat;\n          border-radius: 5px;\n          -webkit-border-radius: 5px;\n          -moz-border-radius: 5px;\n          -ms-border-radius: 5px;\n          -o-border-radius: 5px; }\n        #sb_widget .chat-section .message-set.user .message-item .unread {\n          display: inline-block !important; }\n    #sb_widget .chat-section .message-set.time {\n      text-align: center;\n      font-size: 11px;\n      color: #8090B4; }\n    #sb_widget .chat-section .message-set.admin-message {\n      text-align: center;\n      font-size: 12px;\n      color: #67769A; }\n  #sb_widget .popup {\n    margin: 0;\n    padding: 0;\n    font-size: 100%;\n    line-height: 1;\n    width: auto;\n    height: auto;\n    box-sizing: initial;\n    display: none;\n    background-color: transparent;\n    position: absolute;\n    bottom: 26px; }\n    #sb_widget .popup .popup-body {\n      margin: 0;\n      padding: 0;\n      font-size: 100%;\n      line-height: 1;\n      width: auto;\n      height: auto;\n      box-sizing: initial;\n      width: 260px;\n      height: 360px;\n      background-color: #FFFFFF;\n      -webkit-box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 5px 60px rgba(0, 0, 0, 0.35);\n      -moz-box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 5px 60px rgba(0, 0, 0, 0.35);\n      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 5px 60px rgba(0, 0, 0, 0.35); }\n      #sb_widget .popup .popup-body::before {\n        content: ' ';\n        position: absolute;\n        bottom: 100%;\n        left: 50%;\n        margin-left: -5px;\n        border-width: 7px;\n        border-style: solid;\n        border-color: transparent transparent #FFFFFF transparent; }\n      #sb_widget .popup .popup-body > .content {\n        margin: 0;\n        padding: 0;\n        font-size: 100%;\n        line-height: 1;\n        width: auto;\n        height: auto;\n        box-sizing: initial;\n        overflow-y: scroll;\n        overflow-x: hidden;\n        height: calc(100% - 51px - 2px);\n        margin: 0; }\n        #sb_widget .popup .popup-body > .content > ul {\n          margin: 0;\n          padding: 0;\n          font-size: 100%;\n          line-height: 1;\n          width: auto;\n          height: auto;\n          box-sizing: initial;\n          width: 100%;\n          min-height: 306px;\n          margin: 0 0 2px 0;\n          padding: 0;\n          list-style-type: none; }\n          #sb_widget .popup .popup-body > .content > ul > .sb-spinner, #sb_widget .popup .chat-section .popup-body > .content > ul > .sb-spinner {\n            position: absolute; }\n            #sb_widget .popup .popup-body > .content > ul > .sb-spinner div, #sb_widget .popup .chat-section .popup-body > .content > ul > .sb-spinner div {\n              width: 12px;\n              height: 12px; }\n            #sb_widget .popup .popup-body > .content > ul > .sb-spinner :nth-child(2), #sb_widget .popup .chat-section .popup-body > .content > ul > .sb-spinner :nth-child(2) {\n              margin: 0 6px; }\n          #sb_widget .popup .popup-body > .content > ul > li {\n            margin: 0;\n            padding: 0;\n            font-size: 100%;\n            line-height: 1;\n            width: auto;\n            height: auto;\n            box-sizing: initial;\n            display: inline-table;\n            width: calc(100% - 24px);\n            height: calc(44px - 11px);\n            background: #FFFFFF;\n            padding: 0 12px;\n            cursor: pointer; }\n            #sb_widget .popup .popup-body > .content > ul > li:hover {\n              background-color: #F5F8FA; }\n            #sb_widget .popup .popup-body > .content > ul > li > div {\n              margin: 0;\n              padding: 0;\n              font-size: 100%;\n              line-height: 1;\n              width: auto;\n              height: auto;\n              box-sizing: initial;\n              display: inline-block;\n              width: 100%;\n              padding: 5px 0;\n              border-bottom: 1px solid #E5E5E5; }\n            #sb_widget .popup .popup-body > .content > ul > li .user-select {\n              margin: 0;\n              padding: 0;\n              font-size: 100%;\n              line-height: 1;\n              width: auto;\n              height: auto;\n              box-sizing: initial;\n              display: inline-block;\n              margin-right: 8px;\n              position: relative;\n              top: 50%;\n              width: 16px;\n              height: 16px;\n              -webkit-transform: translate(0, -50%);\n              -moz-transform: translate(0, -50%);\n              -ms-transform: translate(0, -50%);\n              -o-transform: translate(0, -50%);\n              transform: translate(0, -50%);\n              background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/btn-check-off.svg\");\n              background-position: center;\n              background-size: cover;\n              background-repeat: no-repeat; }\n            #sb_widget .popup .popup-body > .content > ul > li .user-select.active {\n              background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/btn-check-on.svg\");\n              background-position: center;\n              background-size: cover;\n              background-repeat: no-repeat; }\n            #sb_widget .popup .popup-body > .content > ul > li .image-me {\n              margin: 0;\n              padding: 0;\n              font-size: 100%;\n              line-height: 1;\n              width: auto;\n              height: auto;\n              box-sizing: initial;\n              width: 31px;\n              height: 31px;\n              position: absolute;\n              background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/icon-member-me.svg\");\n              background-position: center;\n              background-size: cover;\n              background-repeat: no-repeat; }\n            #sb_widget .popup .popup-body > .content > ul > li .image {\n              margin: 0;\n              padding: 0;\n              font-size: 100%;\n              line-height: 1;\n              width: auto;\n              height: auto;\n              box-sizing: initial;\n              display: inline-block;\n              margin-right: 8px;\n              width: 31px;\n              height: 31px;\n              background-image: url(\"https://dxstmhyqfqr1o.cloudfront.net/widget/thumnail-member-01.svg\");\n              background-position: center;\n              background-size: cover;\n              background-repeat: no-repeat; }\n            #sb_widget .popup .popup-body > .content > ul > li .nickname {\n              margin: 0;\n              padding: 0;\n              font-size: 100%;\n              line-height: 1;\n              width: auto;\n              height: auto;\n              box-sizing: initial;\n              display: inline-block;\n              font-size: 13px;\n              color: #67769A;\n              line-height: 31px;\n              max-width: 70%;\n              overflow: hidden;\n              -ms-text-overflow: ellipsis;\n              text-overflow: ellipsis;\n              white-space: nowrap; }\n    #sb_widget .popup .popup-top {\n      margin: 0;\n      padding: 0;\n      font-size: 100%;\n      line-height: 1;\n      width: auto;\n      height: auto;\n      box-sizing: initial;\n      height: 36px;\n      background-color: #F3F5F7;\n      padding: 0 12px;\n      -webkit-box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2);\n      -moz-box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2);\n      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2); }\n      #sb_widget .popup .popup-top .title {\n        margin: 0;\n        padding: 0;\n        font-size: 100%;\n        line-height: 1;\n        width: auto;\n        height: auto;\n        box-sizing: initial;\n        float: left;\n        font-size: 13px;\n        color: #67769A;\n        line-height: 36px; }\n      #sb_widget .popup .popup-top .count {\n        margin: 0;\n        padding: 0;\n        font-size: 100%;\n        line-height: 1;\n        width: auto;\n        height: auto;\n        box-sizing: initial;\n        float: left;\n        width: 16px;\n        height: 16px;\n        margin-left: 8px;\n        background-color: #D5D7D9;\n        font-weight: 700;\n        font-size: 10px;\n        color: #67769A;\n        text-align: center;\n        line-height: 16px;\n        position: relative;\n        top: 50%;\n        -webkit-transform: translate(0, -50%);\n        -moz-transform: translate(0, -50%);\n        -ms-transform: translate(0, -50%);\n        -o-transform: translate(0, -50%);\n        transform: translate(0, -50%); }\n      #sb_widget .popup .popup-top .btn {\n        margin: 0;\n        padding: 0;\n        font-size: 100%;\n        line-height: 1;\n        width: auto;\n        height: auto;\n        box-sizing: initial;\n        float: right;\n        width: 24px;\n        height: 26px;\n        position: relative;\n        top: 50%;\n        cursor: pointer;\n        -webkit-transform: translate(0, -50%);\n        -moz-transform: translate(0, -50%);\n        -ms-transform: translate(0, -50%);\n        -o-transform: translate(0, -50%);\n        transform: translate(0, -50%); }\n    #sb_widget .popup .popup-bottom {\n      margin: 0;\n      padding: 0;\n      font-size: 100%;\n      line-height: 1;\n      width: auto;\n      height: auto;\n      box-sizing: initial;\n      height: 52px;\n      background-color: #FFFFFF;\n      border-top: 1px solid rgba(0, 0, 0, 0.2);\n      padding: 0 12px; }\n      #sb_widget .popup .popup-bottom .title {\n        margin: 0;\n        padding: 0;\n        font-size: 100%;\n        line-height: 1;\n        width: auto;\n        height: auto;\n        box-sizing: initial;\n        float: left;\n        font-size: 13px;\n        line-height: 52px;\n        color: #67769A; }\n      #sb_widget .popup .popup-bottom .count {\n        margin: 0;\n        padding: 0;\n        font-size: 100%;\n        line-height: 1;\n        width: auto;\n        height: auto;\n        box-sizing: initial;\n        float: left;\n        width: 16px;\n        height: 16px;\n        margin-left: 8px;\n        background-color: #F0F0F2;\n        font-weight: 700;\n        font-size: 10px;\n        color: #67769A;\n        text-align: center;\n        line-height: 16px;\n        position: relative;\n        top: 50%;\n        -webkit-transform: translate(0, -50%);\n        -moz-transform: translate(0, -50%);\n        -ms-transform: translate(0, -50%);\n        -o-transform: translate(0, -50%);\n        transform: translate(0, -50%); }\n      #sb_widget .popup .popup-bottom .invite-btn {\n        float: right;\n        position: relative;\n        top: 50%;\n        width: 41px;\n        height: 24px;\n        font-size: 14px;\n        line-height: 24px;\n        letter-spacing: 0.85px;\n        -webkit-transform: translate(0, -50%);\n        -moz-transform: translate(0, -50%);\n        -ms-transform: translate(0, -50%);\n        -o-transform: translate(0, -50%);\n        transform: translate(0, -50%); }\n        #sb_widget .popup .popup-bottom .invite-btn .sb-spinner {\n          margin-top: 4px; }\n          #sb_widget .popup .popup-bottom .invite-btn .sb-spinner div {\n            width: 8px;\n            height: 8px;\n            margin-top: 4px;\n            background-color: #35A300; }\n          #sb_widget .popup .popup-bottom .invite-btn .sb-spinner :nth-child(2) {\n            margin: 0 4px; }\n      #sb_widget .popup .popup-bottom .invite-btn.disabled {\n        cursor: default; }\n  #sb_widget .popup.members .popup-body::before {\n    border-color: transparent transparent #F3F5F7 transparent; }\n  #sb_widget .popup.members .popup-body > .content {\n    height: calc(100% - 36px - 2px); }\n    #sb_widget .popup.members .popup-body > .content > ul {\n      height: 322px;\n      margin: 2px 0 0 0; }\n      #sb_widget .popup.members .popup-body > .content > ul > li {\n        cursor: default; }\n", ""]);

// exports


/***/ }),
/* 309 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {/*
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

	if (useSourceMap) {
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
  var base64 = new Buffer(JSON.stringify(sourceMap)).toString('base64');
  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

  return '/*# ' + data + ' */';
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(126).Buffer))

/***/ }),
/* 310 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 311 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 312 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
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
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof global.process === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
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
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
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
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
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
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
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

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

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
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
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
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
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
          context.arg = undefined;
        }

        return !! caught;
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

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
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

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
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

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
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
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(88)))

/***/ }),
/* 313 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [],
	fixUrls = __webpack_require__(314);

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	options.attrs.type = "text/css";

	attachTagAttrs(styleElement, options.attrs);
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	attachTagAttrs(linkElement, options.attrs);
	insertStyleElement(options, linkElement);
	return linkElement;
}

function attachTagAttrs(element, attrs) {
	Object.keys(attrs).forEach(function (key) {
		element.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement, options);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
	and there is no publicPath defined then lets turn convertToAbsoluteUrls
	on by default.  Otherwise default to the convertToAbsoluteUrls option
	directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls){
		css = fixUrls(css);
	}

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 314 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	var fixedCss = css.replace(/url *\( *(.+?) *\)/g, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 315 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(308);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(313)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./widget.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./widget.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 316 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(118);
module.exports = __webpack_require__(117);


/***/ })
/******/ ]);