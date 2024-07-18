import type { DependencyManager } from './dep/types'

export class DepManager implements DependencyManager {
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
