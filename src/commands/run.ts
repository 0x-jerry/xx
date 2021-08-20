import { Command } from 'cliffy/command/mod.ts'
import { join } from 'path/mod.ts'
import { run } from '../utils.ts'
import { exists } from 'fs/mod.ts'
import { red, cyan } from 'fmt/colors.ts'

export const runCommand = new Command()
  .description('Run custom command, support package.json.')
  .stopEarly()
  .arguments('<script:string> [...params]')
  .action(async (_, scriptName: string, params: string[] = []) => {
    const cmdString = await getCmd(scriptName)

    if (!cmdString) {
      console.log(red('Script ['), cyan(`${scriptName}`), red('] Not found.'))
      return
    }

    const [cmd, ...args] = parseCmdStr(cmdString)

    await run(await getCmdPath(cmd), ...args, ...params)
  })

async function getCmdPath(bin: string): Promise<string> {
  const nodeModuleBin = join(Deno.cwd(), 'node_modules', '.bin', bin)

  if (await exists(nodeModuleBin)) {
    return nodeModuleBin
  }

  return bin
}

async function getConfigPath() {
  const cwd = Deno.cwd()

  const path = join(cwd, 'x.conf.json')

  if (await exists(path)) {
    return path
  }

  const pkgPath = join(cwd, 'package.json')

  if (await exists(pkgPath)) {
    return pkgPath
  }

  return false
}

async function getCmd(cmd: string): Promise<string | false> {
  const path = await getConfigPath()

  if (!path) {
    return false
  }

  const text = await Deno.readTextFile(path)

  const json = JSON.parse(text)

  return json.scripts?.[cmd]
}

export function parseCmdStr(cmdStr: string): string[] {
  const char = '\\w-+/\\.'

  const name = `[-${char}\\.]+`
  const quote = `'[${char}\\s]+'|"[${char}\\s]+"`
  const eq = `${name}=${quote}`

  const regexp = new RegExp(`(${eq}|${quote}|${name}|\s+)`, 'g')

  const args = cmdStr
    .split(regexp)
    .reduce((params, cur) => {
      if (cur.includes('=')) {
        params.push(...cur.split('='))
      } else {
        const param = /^['"]/.test(cur) ? cur.slice(1, -1) : cur
        params.push(param)
      }

      return params
    }, [] as string[])
    .filter((n) => n.trim())

  return args
}

if (import.meta.main) {
  runCommand.parse()
}
