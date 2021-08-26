import { Command } from 'cliffy/command/mod.ts'
import { join } from 'path/mod.ts'
import { run, getDirFiles } from '../utils.ts'
import { exists } from 'fs/mod.ts'
import { red, cyan, rgb24 } from 'fmt/colors.ts'

export const runCommand = new Command()
  .name('xr')
  .description('Run custom script in package.json, like npm run.')
  .complete('script', async () => {
    const [_, allScripts] = await getScriptContent()
    return allScripts
  })
  .stopEarly()
  .arguments('<script:string:script> [...params]')
  .action(async (_, scriptName: string, params: string[] = []) => {
    const [cmdString, allScripts] = await getScriptContent(scriptName)

    if (cmdString) {
      await executeScript(cmdString, params)
      return
    }

    console.log(
      red('['),
      cyan(`${scriptName}`),
      red('] not exists in the list: '),
      allScripts.map((name) => cyan(name)).join(', '),
    )
  })

interface IScriptObject {
  [key: string]: string
}

async function executeScript(cmdString: string, params: string[]) {
  const commands = parseCmdStr(cmdString)

  console.log(rgb24(['$', cmdString].join(' '), 0x999999))
  for (let idx = 0; idx < commands.length; idx++) {
    const cmd = commands[idx]

    const args = await covertCmd(cmd)
    const lastParams = idx === commands.length - 1 ? params : []

    await run({ log: false }, ...args, ...lastParams)
  }
}

async function covertCmd(cmd: string[]): Promise<string[]> {
  const nodeModuleBinPath = join(Deno.cwd(), 'node_modules', '.bin')

  if (!(await exists(nodeModuleBinPath))) {
    return cmd
  }

  const exes = await getDirFiles(nodeModuleBinPath)
  const files = exes.map((e) => e.name)
  return cmd.map((bin) =>
    files.includes(bin) ? join(nodeModuleBinPath, bin) : bin,
  )
}

async function getPackageScripts(): Promise<IScriptObject> {
  const cwd = Deno.cwd()
  const pkgPath = join(cwd, 'package.json')

  if (!(await exists(pkgPath))) {
    return {}
  }

  const text = await Deno.readTextFile(pkgPath)

  const json = JSON.parse(text)

  return json.scripts || {}
}

export async function getScriptContent(
  cmd = '',
): Promise<[string | false, string[]]> {
  const allScripts: IScriptObject[] = await Promise.all([getPackageScripts()])

  const scripts = allScripts.reduce((pre, cur) => Object.assign(pre, cur), {})

  return [scripts[cmd], Object.keys(scripts)]
}

export function parseCmdStr(cmdStr: string): string[][] {
  const char = '\\w-+/\\.'

  const name = `[-${char}\\.:]+`
  const quote = `'[${char}\\s]+'|"[${char}\\s]+"`
  const eq = `${name}=${quote}`

  const regexp = new RegExp(`(${eq}|${quote}|${name}|\\s+)`, 'g')

  const commands = cmdStr.split(/\s&&\s/g).map((cmd) =>
    cmd
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
      .filter((n) => n.trim()),
  )

  return commands
}

if (import.meta.main) {
  runCommand.parse()
}
