'use strict';var vue=require('vue'),SignaturePad=require('signature_pad'),mergeImages=require('merge-images');function _interopDefaultLegacy(e){return e&&typeof e==='object'&&'default'in e?e:{'default':e}}var SignaturePad__default=/*#__PURE__*/_interopDefaultLegacy(SignaturePad);var mergeImages__default=/*#__PURE__*/_interopDefaultLegacy(mergeImages);function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

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

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}var IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml'];
var checkSaveType = function checkSaveType(type) {
  return IMAGE_TYPES.includes(type);
};
var DEFAULT_OPTIONS = {
  dotSize: (0.5 + 2.5) / 2,
  minWidth: 0.5,
  maxWidth: 2.5,
  throttle: 16,
  minDistance: 5,
  backgroundColor: 'rgba(0,0,0,0)',
  penColor: 'black',
  velocityFilterWeight: 0.7,
  onBegin: function onBegin() {},
  onEnd: function onEnd() {}
};
var convert2NonReactive = function convert2NonReactive(observerValue) {
  return JSON.parse(JSON.stringify(observerValue));
};
var TRANSPARENT_PNG = {
  src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  x: 0,
  y: 0
};var script = vue.defineComponent({
  name: 'VueSignaturePad',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    customStyle: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    options: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    images: {
      type: Array,
      default: function _default() {
        return [];
      }
    }
  },
  data: function data() {
    return {
      signaturePad: {},
      cacheImages: [],
      signatureData: TRANSPARENT_PNG,
      onResizeHandler: null
    };
  },
  computed: {
    propsImagesAndCustomImages: function propsImagesAndCustomImages() {
      var nonReactiveProrpImages = convert2NonReactive(this.images);
      var nonReactiveCachImages = convert2NonReactive(this.cacheImages);
      return [].concat(_toConsumableArray(nonReactiveProrpImages), _toConsumableArray(nonReactiveCachImages));
    }
  },
  watch: {
    options: function options(nextOptions) {
      var _this = this;

      Object.keys(nextOptions).forEach(function (option) {
        if (_this.signaturePad[option]) {
          _this.signaturePad[option] = nextOptions[option];
        }
      });
    }
  },
  mounted: function mounted() {
    var options = this.options;
    var canvas = this.$refs.signaturePadCanvas;
    var nelpOptions = Object.assign({}, DEFAULT_OPTIONS, options);
    var signaturePad = new SignaturePad__default['default'](canvas, nelpOptions);
    this.signaturePad = signaturePad;

    if (options.resizeHandler) {
      this.resizeCanvas = options.resizeHandler.bind(this);
    }

    this.onResizeHandler = this.resizeCanvas.bind(this);
    window.addEventListener('resize', this.onResizeHandler, false);
    this.resizeCanvas();
  },
  beforeUnmount: function beforeUnmount() {
    if (this.onResizeHandler) {
      window.removeEventListener('resize', this.onResizeHandler, false);
    }
  },
  methods: {
    resizeCanvas: function resizeCanvas() {
      var canvas = this.$refs.signaturePadCanvas;
      var data = this.signaturePad.toData();
      var ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext('2d').scale(ratio, ratio);
      this.signaturePad.clear();
      this.signatureData = TRANSPARENT_PNG;
      this.signaturePad.fromData(data);
    },
    saveSignature: function saveSignature() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : IMAGE_TYPES[0];
      var encoderOptions = arguments.length > 1 ? arguments[1] : undefined;
      var signaturePad = this.signaturePad;
      var status = {
        isEmpty: false,
        data: undefined
      };

      if (!checkSaveType(type)) {
        var imageTypesString = IMAGE_TYPES.join(', ');
        throw new Error("The Image type is incorrect! We are support ".concat(imageTypesString, " types."));
      }

      if (signaturePad.isEmpty()) {
        return _objectSpread2(_objectSpread2({}, status), {}, {
          isEmpty: true
        });
      } else {
        this.signatureData = signaturePad.toDataURL(type, encoderOptions);
        return _objectSpread2(_objectSpread2({}, status), {}, {
          data: this.signatureData
        });
      }
    },
    undoSignature: function undoSignature() {
      var signaturePad = this.signaturePad;
      var record = signaturePad.toData();

      if (record) {
        return signaturePad.fromData(record.slice(0, -1));
      }
    },
    mergeImageAndSignature: function mergeImageAndSignature(customSignature) {
      this.signatureData = customSignature;
      return mergeImages__default['default']([].concat(_toConsumableArray(this.images), _toConsumableArray(this.cacheImages), [this.signatureData]));
    },
    addImages: function addImages() {
      var images = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      this.cacheImages = [].concat(_toConsumableArray(this.cacheImages), _toConsumableArray(images));
      return mergeImages__default['default']([].concat(_toConsumableArray(this.images), _toConsumableArray(this.cacheImages), [this.signatureData]));
    },
    fromDataURL: function fromDataURL(data) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var callback = arguments.length > 2 ? arguments[2] : undefined;
      return this.signaturePad.fromDataURL(data, options, callback);
    },
    fromData: function fromData(data) {
      return this.signaturePad.fromData(data);
    },
    toData: function toData() {
      return this.signaturePad.toData();
    },
    lockSignaturePad: function lockSignaturePad() {
      return this.signaturePad.off();
    },
    openSignaturePad: function openSignaturePad() {
      return this.signaturePad.on();
    },
    isEmpty: function isEmpty() {
      return this.signaturePad.isEmpty();
    },
    getPropImagesAndCacheImages: function getPropImagesAndCacheImages() {
      return this.propsImagesAndCustomImages;
    },
    clearCacheImages: function clearCacheImages() {
      this.cacheImages = [];
      return this.cacheImages;
    },
    clearSignature: function clearSignature() {
      return this.signaturePad.clear();
    }
  },
  render: function render() {
    var width = this.width,
        height = this.height,
        customStyle = this.customStyle;
    return vue.h('div', {
      style: _objectSpread2({
        width: width,
        height: height
      }, customStyle)
    }, [vue.h('canvas', {
      style: {
        width: width,
        height: height
      },
      ref: 'signaturePadCanvas'
    })]);
  }
});script.__file = "src/components/VueSignaturePad.vue";var components$1=/*#__PURE__*/Object.freeze({__proto__:null,VueSignaturePad: script});var install = function installVSignature(app) {
  Object.entries(components$1).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        componentName = _ref2[0],
        component = _ref2[1];

    app.component(componentName, component);
  });
};var components=/*#__PURE__*/Object.freeze({__proto__:null,'default': install,VueSignaturePad: script});Object.entries(components).forEach(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      componentName = _ref2[0],
      component = _ref2[1];

  if (componentName !== 'default') {
    var key = componentName;
    var val = component;
    install[key] = val;
  }
});module.exports=install;