import { join } from 'path'
import pc from 'picocolors'
import { exec, exists } from '../utils'
import { readFile } from 'fs/promises'
const { yellow } = pc

export type NpmCommand = 'npm' | 'yarn' | 'pnpm' | 'bun'

export type NpmActionCommand = 'install' | 'add' | 'upgrade'

const npmCommandMapper: Record<NpmActionCommand, Record<NpmCommand, string>> = {
  install: {
    npm: 'i',
    yarn: 'install',
    pnpm: 'i',
    bun: 'i'
  },
  add: {
    npm: 'i',
    yarn: 'add',
    pnpm: 'i',
    bun: 'add'
  },
  upgrade: {
    npm: 'up',
    yarn: 'upgrade',
    pnpm: 'up',
    bun: 'update'
  }
}

/**
 * ```ts
 * add('lodash@1', '-d')
 * ```
 * @param params
 */
export async function runNpm(action: NpmActionCommand, ...params: string[]) {
  if (!(await getPkgJson())) {
    console.log(
      yellow(
        `Can't find package.json! Please ensure that current path is a node project.`,
      ),
    )
    return
  }

  const npmCommand = await detectNpmCommand()

  const actionName = npmCommandMapper[action][npmCommand]

  await exec(npmCommand, [actionName, ...params])
}

export async function detectNpmCommand(
  cwd = process.cwd(),
): Promise<NpmCommand> {
  const bunLockFile = join(cwd, 'bun.lockb')
  if (await exists(bunLockFile)) {
    return 'bun'
  }

  const pnpmLockFile = join(cwd, 'pnpm-lock.yaml')
  if (await exists(pnpmLockFile)) {
    return 'pnpm'
  }

  const yarnLockFile = join(cwd, 'yarn.lock')
  if (await exists(yarnLockFile)) {
    return 'yarn'
  }

  const jsonLockFile = join(cwd, 'package-lock.json')
  if (await exists(jsonLockFile)) {
    return 'npm'
  }

  return 'pnpm'
}

export async function getPkgJson(
  cwd = process.cwd(),
): Promise<PackageJson | false> {
  const jsonFile = join(cwd, 'package.json')
  try {
    const txt = await readFile(jsonFile, { encoding: 'utf-8' })

    return JSON.parse(txt)
  } catch (_error) {
    return false
  }
}

interface PackageJson {
  name?: string
  version?: string
  script?: Record<string, string>
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  [key: string]: any
}
