import { DenoDependencyManager } from './dep/deno'
import { NodeDependencyManager } from './dep/node'
import { RustDependencyManager } from './dep/rust'
import type { DependencyManager } from './dep/types'

export class DepManager implements DependencyManager {
  managers = [
    new NodeDependencyManager(),
    new DenoDependencyManager(),
    new RustDependencyManager(),
  ]

  async check(): Promise<boolean> {
    return false
  }

  async _getManager() {
    for (const m of this.managers) {
      if (await m.check()) {
        return m
      }
    }
  }

  async install(option?: Record<string, string>): Promise<void> {
    ;(await this._getManager())?.install(option)
  }

  async add(params: string[], option?: Record<string, string>): Promise<void> {
    ;(await this._getManager())?.add(params, option)
  }

  async remove(
    params: string[],
    option?: Record<string, string>,
  ): Promise<void> {
    ;(await this._getManager())?.remove(params, option)
  }

  async upgrade(
    params: string[],
    option?: Record<string, string>,
  ): Promise<void> {
    ;(await this._getManager())?.upgrade(params, option)
  }
}
