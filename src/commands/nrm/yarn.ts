import { RegistryManager } from './RegistryManager.ts'
import { which, runPiped } from '../../utils.ts'

class Yarn extends RegistryManager {
  protected async checkIsExist(): Promise<boolean> {
    return !!(await which('yarn'))
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
      await runPiped('yarn', 'config', 'set', key, value)
      return true
    } catch {
      return false
    }
  }

  async getConfig(key: string): Promise<string> {
    if (!(await this.isExist())) {
      return ''
    }

    const conf = await runPiped('yarn', 'config', 'get', key)
    return conf
  }
}

export const yarn = new Yarn()
