import { createConf } from '../../libs/conf.ts'

export interface RegistryConfig {
  registry: string
  home?: string
}

export interface NRMConfig {
  version: number
  registries: Record<string, RegistryConfig>
}

export function defaultConfig(): NRMConfig {
  return {
    version: 1,
    registries: {
      npm: {
        home: 'https://www.npmjs.org',
        registry: 'https://registry.npmjs.org/',
      },
      yarn: {
        home: 'https://yarnpkg.com',
        registry: 'https://registry.yarnpkg.com/',
      },
      tb: {
        home: 'https://npmmirror.com/',
        registry: 'https://registry.npmmirror.com/',
      },
    },
  }
}

const [conf] = createConf('nrm.json', defaultConfig())

export { conf }
