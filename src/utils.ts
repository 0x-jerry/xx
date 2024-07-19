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

export function flagOptionToStringArray(
  opt: Record<string, string | null | number | boolean | undefined>,
): string[] {
  return Object.entries(opt)
    .map(([_key, value]) => {
      const key = (_key.length === 1 ? '-' : '--') + _key
      if (typeof value === 'string' || typeof value === 'number') {
        return [key, String(value)]
      } else {
        return [key]
      }
    })
    .flat()
}
