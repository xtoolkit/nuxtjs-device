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
        ip: null
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

    if (process.server) {
      this.checkIP();
    } else {
      this.checkInputs();
      this.checkPWA();
    }
  }

  filter(data = {}) {
    return this.bowser.satisfies(data);
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
      const touch =
        'ontouchstart' in window ||
        window.navigator.maxTouchPoints ||
        (window.DocumentTouch &&
          window.document instanceof window.DocumentTouch);
      const mouse =
        typeof window.matchMedia !== 'undefined'
          ? window.matchMedia('(pointer:fine)').matches
          : true;
      if (this.db.browser.touch !== touch || this.db.browser.mouse !== mouse) {
        this.updateInputs(touch, mouse);
      }
    }, 1000);
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

  checkIP() {
    const {req} = this.ctx;
    const headers = req && req.headers ? Object.assign({}, req.headers) : {};
    this.update({
      browser: {
        ip:
          headers['x-real-ip'] ||
          headers['x-forwarded-for'] ||
          req.connection.remoteAddress ||
          null
      }
    });
  }

  get db() {
    return this.$storage.getState(this.dbname);
  }

  get isTouch() {
    return this.db.browser.touch;
  }
}

export default function (ctx, inject) {
  const options = <%= JSON.stringify(options, null, 2) %>
  inject('device', new NuxtDevice(ctx, options));
}
