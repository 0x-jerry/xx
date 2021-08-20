import { config } from './config.ts'

export const debug = (...args: unknown[]) =>
  config.debug && console.log(...args)
