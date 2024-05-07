import { execa } from 'execa'
import { type PathLike } from 'fs'
import { stat } from 'fs/promises'
import pc from 'picocolors'

export async function run(
  cmd: string,
  env?: Record<string, string | undefined>,
) {
  console.log(pc.dim('$'), pc.dim(cmd))

  const commands = cmd
    .split('&&')
    .map((n) => n.trim())
    .filter(Boolean)

  for (const cmd of commands) {
    const [_cmd, ...args] = _parseArgs(cmd)
    await execa(_cmd, args, { stdio: 'inherit', env })
  }
}

export function _parseArgs(cmd: string) {
  const args: string[] = []

  const _cmd = cmd.replaceAll(/(['"]).+?\1/g, (n) => {
    const idx = args.length
    args.push(n.slice(1, -1))
    return '__$' + idx
  })

  const normalized = _cmd.split(/\s+/).map((part) => {
    part = part.trim()

    if (part.startsWith('__$')) {
      return args[+part.slice(3)]
    } else {
      return part
    }
  })

  return normalized
}

export async function exec(
  script: string,
  params: string[],
  env?: Record<string, string | undefined>,
) {
  const cmd = [script, ...params].join(' ')

  await run(cmd, env)
}

export async function exists(path: PathLike) {
  try {
    await stat(path)
    return true
  } catch (error) {
    return false
  }
}
