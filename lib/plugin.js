import Bowser from 'bowser';

export class NuxtDevice {
  constructor(ctx, options) {
    this.ctx = ctx;
    this.options = options;
    this.$storage = ctx.app.$storage;
    this.dbname = 'appDevice';
    this.bowser = null;
    this.ua = process.server
      ? ctx.req.headers['user-agent']
      : navigator.userAgent;
    this.default = {
      browser: {
        name: '',
        version: '',
        touch: false,
        mouse: false,
        ip: null,
        host: ''
      },
      os: {
        name: '',
        version: '',
        versionName: ''
      },
      platform: {
        type: '',
        vendor: '',
        model: '',
        pwa: false
      },
      engine: {
        name: '',
        version: ''
      }
    };

    this.$storage.syncUniversal(this.dbname, this.default);
    this.render();
  }

  update(data = {}) {
    const old = JSON.parse(
      JSON.stringify(this.$storage.getUniversal(this.dbname))
    );

    this.$storage.setUniversal(this.dbname, {
      browser: {
        ...(old.browser || {}),
        ...(data.browser || {})
      },
      os: {
        ...(old.os || {}),
        ...(data.os || {})
      },
      platform: {
        ...(old.platform || {}),
        ...(data.platform || {})
      },
      engine: {
        ...(old.engine || {}),
        ...(data.engine || {})
      }
    });
  }

  render() {
    this.bowser = Bowser.getParser(this.ua);
    this.update(this.bowser.parsedResult);
    this.checkTV();

    if (process.server) {
      this.checkIPHost();
    } else {
      this.checkInputs();
      this.checkPWA();
    }
  }

  filter(data = {}) {
    return this.bowser.satisfies(data);
  }

  checkTV() {
    const ua = this.ua.toLowerCase();
    let isTv =
      ua.indexOf('smarttv') !== -1 ||
      ua.indexOf('smart-tv') !== -1 ||
      ua.indexOf('tv ') !== -1 ||
      ua.indexOf(' tv') !== -1;
    if (isTv) {
      this.update({
        platform: {
          type: 'tv'
        }
      });
    }
  }

  updateInputs(touch, mouse) {
    this.update({
      browser: {
        touch: !!touch,
        mouse: !!mouse
      }
    });
  }

  checkInputs() {
    setInterval(() => {
      let touch =
        'ontouchstart' in window ||
        window.navigator.maxTouchPoints ||
        (window.DocumentTouch &&
          window.document instanceof window.DocumentTouch);
      let mouse =
        typeof window.matchMedia !== 'undefined'
          ? window.matchMedia('(pointer:fine)').matches
          : true;
      touch = !!touch;
      mouse = !!mouse;
      if (this.db.browser.touch !== touch || this.db.browser.mouse !== mouse) {
        this.updateInputs(touch, mouse);
      }
    }, 5000);
  }

  checkPWA() {
    let pwa =
      (typeof window.matchMedia !== 'undefined' &&
        window.matchMedia('(display-mode: standalone)').matches) ||
      window.navigator.standalone ||
      document.referrer.includes('android-app://');
    window.addEventListener('appinstalled', () => {
      pwa = true;
    });
    this.update({
      platform: {
        pwa: !!pwa
      }
    });
  }

  checkIPHost() {
    const {req} = this.ctx;
    const headers = req && req.headers ? Object.assign({}, req.headers) : {};
    this.update({
      browser: {
        ip:
          headers['x-real-ip'] ||
          headers['x-forwarded-for'] ||
          req.connection.remoteAddress ||
          null,
        host: req.headers.host || null
      }
    });
  }

  get db() {
    return this.$storage.getState(this.dbname);
  }

  get isTouch() {
    return this.db.browser.touch;
  }

  get isTv() {
    return this.db.platform.type === 'tv';
  }
}

export default function (ctx, inject) {
  const options = <%= JSON.stringify(options, null, 2) %>
  inject('device', new NuxtDevice(ctx, options));
}
