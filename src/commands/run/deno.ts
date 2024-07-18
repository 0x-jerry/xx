import { parse } from 'jsonc-parser'
import { pathExists } from 'fs-extra'
import type { TaskDetector } from './types'
import path from 'path'
import { readFile } from 'fs/promises'

export class DenoTaskDetecter implements TaskDetector {
  check(cwd: string): Promise<boolean> {
    return (
      pathExists(path.join(cwd, 'deno.json')) ||
      pathExists(path.join(cwd, 'deno.jsonc'))
    )
  }

  async task(cwd: string, taskName: string): Promise<string | undefined> {
    return (await this.tasks(cwd))[taskName]
  }

  async tasks(cwd: string) {
    let tasks: Record<string, string> = {}

    let denoConfigPath = path.join(cwd, 'deno.json')

    if (!(await pathExists(denoConfigPath))) {
      denoConfigPath = path.join(cwd, 'deno.jsonc')
    }

    if (await pathExists(denoConfigPath)) {
      const text = await readFile(denoConfigPath, 'utf8')
      const json = parse(text)

      tasks = json.tasks || {}
    }

    return tasks
  }
}
