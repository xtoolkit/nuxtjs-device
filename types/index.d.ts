import Vue from 'vue'

interface NuxtDeviceBrowser {
  browser: {
    name: string
    version: string
    touch: boolean
    ip: String
  }
  os: {
    name: string
    version: string
    versionName: string
  }
  platform: {
    type: string
    vendor: string
    model: string
    pwa: boolean
  }
  engine: {
    name: string
    version: string
  }
}

export interface NuxtDevice {
  ua: String
  default: NuxtDeviceBrowser
  db: NuxtDeviceBrowser
  isTouch: Boolean
  update(data?: {}): void
  filter(data?: {}): Boolean
}

declare module 'vue/types/vue' {
  interface Vue {
    $device: NuxtDevice
  }
}

declare module '@nuxt/vue-app' {
  interface Context {
    $device: NuxtDevice
  }
  interface NuxtAppOptions {
    $device: NuxtDevice
  }
}

// Nuxt 2.9+
declare module '@nuxt/types' {
  interface Context {
    $device: NuxtDevice
  }
  interface NuxtAppOptions {
    $device: NuxtDevice
  }
}
