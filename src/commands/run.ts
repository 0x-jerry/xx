import { Command } from 'cliffy/command/mod.ts'
import { join } from 'path/mod.ts'
import { run } from '../utils.ts'
import { red, cyan, rgb24 } from 'fmt/colors.ts'

export const runCommand = new Command()
  .name('xr')
  .description('Run custom script in package.json, like yarn run.')
  .complete('script', async () => {
    const [_, allScripts] = await getScriptContent()
    return allScripts
  })
  .stopEarly()
  .arguments('<script:string:script> [...params]')
  .action(async (_, scriptName: string, params: string[] = []) => {
    const [scriptExecuteContent, allScripts] = await getScriptContent(
      scriptName,
    )

    if (scriptExecuteContent) {
      await executeScript(scriptExecuteContent, params)
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

async function executeScript(scriptContent: string, params: string[]) {
  const stringified = params
    .map((n) => (/\s/.test(n) ? JSON.stringify(n) : n))
    .join(' ')

  console.log(rgb24(['$', scriptContent, stringified].join(' '), 0x999999))

  await run(
    {
      log: false,
      env: makeEnv(),
    },
    'sh',
    '-c',
    [scriptContent, ...params].join(' '),
  )

  return
}

function makeEnv() {
  const cwd = Deno.cwd()
  const env = Deno.env.toObject()
  const PATH = join(cwd, 'node_modules', '.bin')

  env.PATH = [Deno.env.get('PATH') || '', PATH].filter(Boolean).join(';')

  return env
}

async function getPackageScripts(): Promise<IScriptObject> {
  try {
    const cwd = Deno.cwd()
    const pkgPath = join(cwd, 'package.json')

    const text = await Deno.readTextFile(pkgPath)
    const json = JSON.parse(text)

    return json.scripts || {}
  } catch (_error) {
    return {}
  }
}

export async function getScriptContent(
  cmd = '',
): Promise<[string | false, string[]]> {
  const allScripts: IScriptObject[] = await Promise.all([getPackageScripts()])

  const scripts = allScripts.reduce((pre, cur) => Object.assign(pre, cur), {})

  return [scripts[cmd], Object.keys(scripts)]
}

if (import.meta.main) {
  runCommand.parse()
}
