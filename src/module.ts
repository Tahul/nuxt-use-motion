import type { Module } from '@nuxt/types'
import type { MotionVariants } from '@vueuse/motion'
import defu from 'defu'
import { resolve } from 'path'

export interface ModuleOptions {
  directives?: {
    [key: string]: MotionVariants
  }
  excludePresets?: boolean
}

const DEFAULTS: ModuleOptions = {}

const CONFIG_KEY = 'motion'
const CONFIG_KEY2 = 'motions'

const nuxtModule: Module<ModuleOptions> = async function (moduleOptions) {
  const options: ModuleOptions = defu(
    this.options[CONFIG_KEY]!,
    this.options[CONFIG_KEY2]!,
    moduleOptions,
    DEFAULTS
  )

  this.addTemplate({
    fileName: 'motion.config.js',
    src: resolve(__dirname, '../templates', 'motion.config.js'),
  })

  this.addPlugin({
    src: resolve(__dirname, '../templates', 'motion.js'),
    fileName: 'motion.js',
    options,
  })

  this.nuxt.options.build.transpile.push('defu')

  await this.addModule('@nuxtjs/composition-api/module')
}

;(nuxtModule as any).meta = require('../package.json')

declare module '@nuxt/types' {
  interface NuxtConfig {
    [CONFIG_KEY]?: ModuleOptions
    /**@deprecated use motion option instead */
    [CONFIG_KEY2]?: ModuleOptions
  } // Nuxt 2.14+
  interface Configuration {
    [CONFIG_KEY]?: ModuleOptions
    /**@deprecated use motion option instead */
    [CONFIG_KEY2]?: ModuleOptions
  } // Nuxt 2.9 - 2.13
}

export default nuxtModule
