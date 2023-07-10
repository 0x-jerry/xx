import { join, resolve } from 'path'
import { exec } from '../utils.ts'
import pc from 'picocolors'
import jsonc from 'jsonc-parser'
import { readFile, readdir } from 'fs/promises'
import { statSync } from 'fs'
const { red, cyan } = pc

export async function runScript(command: string, params: string[] = []) {
  const [scriptExecuteContent, allScripts] = await getScriptContent(command)

  if (scriptExecuteContent) {
    await exec(scriptExecuteContent, params, makeEnv())
    return
  }

  console.log(
    red('['),
    cyan(`${command}`),
    red('] not exists in the list: '),
    allScripts.map((name) => cyan(name)).join(', '),
  )
}

function makeEnv() {
  const cwd = process.cwd()
  const env = process.env

  const envPaths: string[] = []

  let dir = cwd
  do {
    const PATH = join(dir, 'node_modules', '.bin')

    try {
      statSync(PATH)
      envPaths.push(PATH)
    } catch (_error) {
      // ignore
    }

    dir = resolve(dir, '..')
  } while (dir !== resolve(dir, '..'))

  const PATH = envPaths.join(':')

  env.PATH = [process.env.PATH || '', PATH].filter(Boolean).join(':')

  return env
}

async function getPackageScripts(): Promise<Map<string, string>> {
  const scripts = new Map<string, string>()
  const cwd = process.cwd()
  const pkgPath = join(cwd, 'package.json')

  try {
    const text = await readFile(pkgPath, { encoding: 'utf-8' })
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
  let dir = process.cwd()

  do {
    const binPath = join(dir, 'node_modules', '.bin')
    try {
      for (const file of await readdir(binPath)) {
        binCommands.set(file, file)
      }
    } catch (_error) {
      //
    }

    dir = resolve(dir, '..')
  } while (dir !== resolve(dir, '..'))

  return binCommands
}

async function getDenoTasks(): Promise<Map<string, string>> {
  const tasks = new Map<string, string>()
  const cwd = process.cwd()

  try {
    let txt = ''

    try {
      const denoConf = join(cwd, 'deno.json')
      txt = await readFile(denoConf, { encoding: 'utf-8' })
    } catch (_error) {
      const denoConf = join(cwd, 'deno.jsonc')
      txt = await readFile(denoConf, { encoding: 'utf-8' })
    }

    if (!txt) {
      return tasks
    }

    const json = jsonc.parse(txt) as { tasks: Record<string, string> }

    Object.entries(json.tasks).forEach(([name, content]) => {
      tasks.set(name, content as string)
    })
  } catch (_error) {
    //
  }

  return tasks
}

export async function getScriptContent(
  cmd = '',
): Promise<[string | false, string[]]> {
  const tasks = await getDenoTasks()
  const scripts = await getPackageScripts()
  const binCommands = await getBinScripts()

  const executeContent =
    tasks.get(cmd) || scripts.get(cmd) || binCommands.get(cmd) || false

  const uniq = [
    ...new Set([...tasks.keys(), ...scripts.keys(), ...binCommands.keys()]),
  ]

  return [executeContent, uniq]
}
