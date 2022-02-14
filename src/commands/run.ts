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

  env.PATH = [Deno.env.get('PATH') || '', PATH].filter(Boolean).join(':')

  return env
}

async function getPackageScripts(): Promise<Map<string, string>> {
  const scripts = new Map<string, string>()
  const cwd = Deno.cwd()
  const pkgPath = join(cwd, 'package.json')

  try {
    const text = await Deno.readTextFile(pkgPath)
    const json = JSON.parse(text)
    Object.entries(json.scripts).forEach(([name, content]) => {
      scripts.set(name, content as string)
    })
  } catch (_error) {
    //
  }

  return scripts
}

async function getBinScripts(): Promise<Map<string, string>> {
  const binCommands = new Map<string, string>()
  const cwd = Deno.cwd()
  const binPath = join(cwd, 'node_modules', '.bin')

  try {
    for await (const file of Deno.readDir(binPath)) {
      binCommands.set(file.name, join(binPath, file.name))
    }
  } catch (_error) {
    //
  }
  return binCommands
}

async function getScriptContent(cmd = ''): Promise<[string | false, string[]]> {
  const scripts = await getPackageScripts()
  const binCommands = await getBinScripts()

  const executeContent =
    scripts.get(cmd) || (binCommands.has(cmd) ? cmd : false)

  return [executeContent, [...scripts.keys(), ...binCommands.keys()]]
}

if (import.meta.main) {
  runCommand.parse()
}
