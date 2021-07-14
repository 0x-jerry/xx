import { getConfig } from './utils.ts'

interface IConfig {
  version: string
}

export const config = await getConfig<IConfig>('package.json')
