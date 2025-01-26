import path from 'node:path'
import { pathExists } from 'fs-extra'
import { exec } from '../../utils'
import type { DependencyManager } from './types'

export class RustDependencyManager implements DependencyManager {
  check(): Promise<boolean> {
    return pathExists(path.join(process.cwd(), 'Cargo.toml'))
  }

  async install(option?: Record<string, string>): Promise<void> {
    await exec('cargo', ['check'])
  }

  async add(modules: string[], option?: Record<string, string>): Promise<void> {
    await exec('cargo', ['add', ...modules])
  }

  async remove(
    modules: string[],
    option?: Record<string, string>,
  ): Promise<void> {
    await exec('cargo', ['remove', ...modules])
  }

  async upgrade(
    modules: string[],
    option?: Record<string, string>,
  ): Promise<void> {
    await exec('cargo', ['update', ...modules])
  }
}
