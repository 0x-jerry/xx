export interface DependencyManager {
  /**
   * Check if dependency should be managed by this manager
   */
  check(): Promise<boolean>

  /**
   * Install dependency only.
   */
  install(option?: Record<string, string>): Promise<void>

  /**
   * Add dependency.
   */
  add(modules: string[], option?: Record<string, string>): Promise<void>

  /**
   * Remove dependency.
   */
  remove(modules: string[], option?: Record<string, string>): Promise<void>

  /**
   * Upgrade dependency.
   */
  upgrade(modules: string[], option?: Record<string, string>): Promise<void>
}
