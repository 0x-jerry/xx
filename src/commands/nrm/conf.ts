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
      taobao: {
        home: 'https://npm.taobao.org',
        registry: 'https://registry.npm.taobao.org/',
      },
      github: {
        home: 'https://github.com/features/packages',
        registry: 'https://npm.pkg.github.com',
      },
    },
  }
}

const [conf] = createConf('nrm.json', defaultConfig())

export { conf }
