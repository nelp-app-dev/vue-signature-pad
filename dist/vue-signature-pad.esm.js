import { defineComponent, h } from 'vue';
import SignaturePad from 'signature_pad';
import mergeImages from 'merge-images';

const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml'];
const checkSaveType = type => IMAGE_TYPES.includes(type);
const DEFAULT_OPTIONS = {
  dotSize: (0.5 + 2.5) / 2,
  minWidth: 0.5,
  maxWidth: 2.5,
  throttle: 16,
  minDistance: 5,
  backgroundColor: 'rgba(0,0,0,0)',
  penColor: 'black',
  velocityFilterWeight: 0.7,
  onBegin: () => {},
  onEnd: () => {}
};
const convert2NonReactive = observerValue => JSON.parse(JSON.stringify(observerValue));
const TRANSPARENT_PNG = {
  src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  x: 0,
  y: 0
};

var script = defineComponent({
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
      default: () => ({})
    },
    options: {
      type: Object,
      default: () => ({})
    },
    images: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    signaturePad: {},
    cacheImages: [],
    signatureData: TRANSPARENT_PNG,
    onResizeHandler: null
  }),
  computed: {
    propsImagesAndCustomImages() {
      const nonReactiveProrpImages = convert2NonReactive(this.images);
      const nonReactiveCachImages = convert2NonReactive(this.cacheImages);
      return [...nonReactiveProrpImages, ...nonReactiveCachImages];
    }

  },
  watch: {
    options: function (nextOptions) {
      Object.keys(nextOptions).forEach(option => {
        if (this.signaturePad[option]) {
          this.signaturePad[option] = nextOptions[option];
        }
      });
    }
  },

  mounted() {
    const {
      options
    } = this;
    const canvas = this.$refs.signaturePadCanvas;
    const nelpOptions = Object.assign({}, DEFAULT_OPTIONS, options);
    const signaturePad = new SignaturePad(canvas, nelpOptions);
    this.signaturePad = signaturePad;

    if (options.resizeHandler) {
      this.resizeCanvas = options.resizeHandler.bind(this);
    }

    this.onResizeHandler = this.resizeCanvas.bind(this);
    window.addEventListener('resize', this.onResizeHandler, false);
    this.resizeCanvas();
  },

  beforeUnmount() {
    if (this.onResizeHandler) {
      window.removeEventListener('resize', this.onResizeHandler, false);
    }
  },

  methods: {
    resizeCanvas() {
      const canvas = this.$refs.signaturePadCanvas;
      const data = this.signaturePad.toData();
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext('2d').scale(ratio, ratio);
      this.signaturePad.clear();
      this.signatureData = TRANSPARENT_PNG;
      this.signaturePad.fromData(data);
    },

    saveSignature(type = IMAGE_TYPES[0], encoderOptions) {
      const {
        signaturePad
      } = this;
      const status = {
        isEmpty: false,
        data: undefined
      };

      if (!checkSaveType(type)) {
        const imageTypesString = IMAGE_TYPES.join(', ');
        throw new Error(`The Image type is incorrect! We are support ${imageTypesString} types.`);
      }

      if (signaturePad.isEmpty()) {
        return { ...status,
          isEmpty: true
        };
      } else {
        this.signatureData = signaturePad.toDataURL(type, encoderOptions);
        return { ...status,
          data: this.signatureData
        };
      }
    },

    undoSignature() {
      const {
        signaturePad
      } = this;
      const record = signaturePad.toData();

      if (record) {
        return signaturePad.fromData(record.slice(0, -1));
      }
    },

    mergeImageAndSignature(customSignature) {
      this.signatureData = customSignature;
      return mergeImages([...this.images, ...this.cacheImages, this.signatureData]);
    },

    addImages(images = []) {
      this.cacheImages = [...this.cacheImages, ...images];
      return mergeImages([...this.images, ...this.cacheImages, this.signatureData]);
    },

    fromDataURL(data, options = {}, callback) {
      return this.signaturePad.fromDataURL(data, options, callback);
    },

    fromData(data) {
      return this.signaturePad.fromData(data);
    },

    toData() {
      return this.signaturePad.toData();
    },

    lockSignaturePad() {
      return this.signaturePad.off();
    },

    openSignaturePad() {
      return this.signaturePad.on();
    },

    isEmpty() {
      return this.signaturePad.isEmpty();
    },

    getPropImagesAndCacheImages() {
      return this.propsImagesAndCustomImages;
    },

    clearCacheImages() {
      this.cacheImages = [];
      return this.cacheImages;
    },

    clearSignature() {
      return this.signaturePad.clear();
    }

  },

  render() {
    const {
      width,
      height,
      customStyle
    } = this;
    return h('div', {
      style: {
        width,
        height,
        ...customStyle
      }
    }, [h('canvas', {
      style: {
        width: width,
        height: height
      },
      ref: 'signaturePadCanvas'
    })]);
  }

});

script.__file = "src/components/VueSignaturePad.vue";

var components = /*#__PURE__*/Object.freeze({
  __proto__: null,
  VueSignaturePad: script
});

const install = function installVSignature(app) {
  Object.entries(components).forEach(([componentName, component]) => {
    app.component(componentName, component);
  });
};

export { script as VueSignaturePad, install as default };
