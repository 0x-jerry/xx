import { RegistryManager } from './base.ts'
import { which, run, runPiped } from '../../utils.ts'

class Npm extends RegistryManager {
  protected checkIsExist(): boolean {
    return !!which('npm')
  }

  async getVersion(): Promise<string> {
    let version = ''

    if (this.isExist()) {
      version = await runPiped('npm', '-v')
    }

    return version
  }

  async setConfig(key: string, value: string): Promise<boolean> {
    if (!this.isExist()) {
      return false
    }

    try {
      await run('npm', 'config', 'set', key, value)
      return true
    } catch {
      return false
    }
  }

  async getConfig(key: string): Promise<string> {
    if (!this.isExist()) {
      return ''
    }

    const conf = await runPiped('npm', 'config', 'get', key)
    return conf
  }
}

export const npm = new Npm()
