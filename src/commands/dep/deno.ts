import path from 'node:path'
import { pathExists } from 'fs-extra'
import { exec } from '../../utils'
import type { DependencyManager } from './types'

export class DenoDependencyManager implements DependencyManager {
  check(): Promise<boolean> {
    const cwd = process.cwd()
    return (
      pathExists(path.join(cwd, 'deno.json')) ||
      pathExists(path.join(cwd, 'deno.jsonc'))
    )
  }

  async install(option?: Record<string, string>): Promise<void> {
    throw new Error('Deno project do not need to install dependencies')
  }

  async add(modules: string[], option?: Record<string, string>): Promise<void> {
    await exec('deno', ['add', ...modules])
  }

  async remove(
    modules: string[],
    option?: Record<string, string>,
  ): Promise<void> {
    throw new Error('Deno not support remove modules')
  }

  async upgrade(
    modules: string[],
    option?: Record<string, string>,
  ): Promise<void> {
    throw new Error('Deno not support upgrade modules')
  }
}
