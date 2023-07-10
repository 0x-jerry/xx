import { RegistryManager } from './RegistryManager.ts'
import { which, runPiped } from '../../utils.ts'

class Npm extends RegistryManager {
  protected async checkIsExist(): Promise<boolean> {
    return !!(await which('npm'))
  }

  async getVersion(): Promise<string> {
    let version = ''

    if (await this.isExist()) {
      version = await runPiped('npm', '-v')
    }

    return version
  }

  async setConfig(key: string, value: string): Promise<boolean> {
    if (!this.isExist()) {
      return false
    }

    try {
      await runPiped('npm', 'config', 'set', key, value)
      return true
    } catch {
      return false
    }
  }

  async getConfig(key: string): Promise<string> {
    if (!(await this.isExist())) {
      return ''
    }

    const conf = await runPiped('npm', 'config', 'get', key)
    return conf
  }
}

export const npm = new Npm()
