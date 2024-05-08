import { existsSync, type PathLike } from 'fs'
import { run } from '@0x-jerry/utils/node'

export async function exec(
  script: string,
  params: string[],
  env?: Record<string, string | undefined>,
) {
  const cmd = [script, ...params].join(' ')

  await run(cmd, env)
}

export function exists(path: PathLike) {
  return existsSync(path)
}
