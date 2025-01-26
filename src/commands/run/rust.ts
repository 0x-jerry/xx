import path from 'node:path'
import { pathExists } from 'fs-extra'
import type { TaskDetector } from './types'

export class RustTaskDetecter implements TaskDetector {
  check(cwd: string): Promise<boolean> {
    return pathExists(path.join(cwd, 'Cargo.toml'))
  }

  async task(_cwd: string, _taskName: string): Promise<string | undefined> {
    return 'cargo run'
  }
}
