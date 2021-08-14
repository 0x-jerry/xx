import { Command } from 'cliffy/command/mod.ts'
import { join, isAbsolute } from 'path/mod.ts'
import { run } from '../utils/run.ts'
import { exists } from 'fs/mod.ts'

export const runCommand = new Command()
  .description('Run custom command')
  .option('-c, --config', 'Config file')
  .arguments('<script:string> [...params:string]')
  .action(
    async (opt: { config: string }, scriptName: string, params: string[]) => {
      const cwd = Deno.cwd()

      const path = opt.config
        ? isAbsolute(opt.config)
          ? opt.config
          : join(cwd, opt.config)
        : join(cwd, 'x.conf.json')

      const str = await getCmd(path, scriptName)

      if (!str) {
        return
      }

      await run(...parseCmdStr(str), ...params)
    },
  )

async function getCmd(path: string, cmd: string): Promise<string | false> {
  if (!(await exists(path))) {
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
