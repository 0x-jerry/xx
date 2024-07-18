import type { DependencyManager } from './types'

export class RustDependencyManager implements DependencyManager {
  install(option?: Record<string, string>): Promise<void> {
    throw new Error('Method not implemented.')
  }

  add(modules: string[], option?: Record<string, string>): Promise<void> {
    throw new Error('Method not implemented.')
  }

  remove(modules: string[], option?: Record<string, string>): Promise<void> {
    throw new Error('Method not implemented.')
  }

  upgrade(modules: string[], option?: Record<string, string>): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
