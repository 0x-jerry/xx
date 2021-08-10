import { join } from 'path/mod.ts'
import { exists } from 'fs/mod.ts'

export async function which(cmd: string): Promise<string | null> {
  const PATH = Deno.env.get('PATH')
  const envPaths: string[] = PATH?.split(':') || []

  const existsPath: string[] = []

  for (const p of envPaths) {
    const cmdPath = join(p, cmd)
    if (await exists(cmdPath)) {
      existsPath.push(cmdPath)
    }
  }

  return existsPath[0] || null
}
