import { Command, StringType } from 'cliffy/command/mod.ts'
import { join, resolve } from 'path/mod.ts'
import { run } from '../utils.ts'
import { red, cyan, rgb24 } from 'fmt/colors.ts'

class ScriptType extends StringType {
  async complete() {
    const [_, allScripts] = await getScriptContent()
    return allScripts
  }
}

export const runCommand = new Command()
  .name('xr')
  .description('Run custom script in package.json, like yarn run.')
  .stopEarly()
  .type('script', new ScriptType())
  .arguments('<script:script> [...params:file]')
  .action(async (_, scriptName, params = []) => {
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

  const envPaths: string[] = []

  let dir = cwd
  do {
    const PATH = join(dir, 'node_modules', '.bin')

    try {
      Deno.statSync(PATH)
      envPaths.push(PATH)
    } catch (_error) {
      // ignore
    }

    dir = resolve(dir, '..')
  } while (dir !== resolve(dir, '..'))

  const PATH = envPaths.join(':')

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
  const dir = Deno.cwd()

  do {
    const binPath = join(dir, 'node_modules', '.bin')
    try {
      for await (const file of Deno.readDir(binPath)) {
        binCommands.set(file.name, join(binPath, file.name))
      }
    } catch (_error) {
      //
    }
  } while (dir !== resolve(dir, '..'))

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
