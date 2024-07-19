import path, { join } from 'path'
import pc from 'picocolors'
import { exec, exists, flagOptionToStringArray } from '../../utils'
import { readFile } from 'fs/promises'
import type { DependencyManager } from './types'
import { pathExists } from 'fs-extra'

export class NodeDependencyManager implements DependencyManager {
  async check() {
    return pathExists(path.join(process.cwd(), 'package.json'))
  }

  async install(option?: Record<string, string>): Promise<void> {
    await runDepManagerCommand('install')
  }

  async add(
    modules: string[],
    option: Record<string, string> = {},
  ): Promise<void> {
    await runDepManagerCommand('add', ...modules)

    if (option.type) {
      const typeModules = modules.map((pkg) => getTypePackageName(pkg))
      await runDepManagerCommand('add', ...typeModules, '-D')
    }
  }

  async remove(
    modules: string[],
    option: Record<string, string> = {},
  ): Promise<void> {
    await runDepManagerCommand(
      'remove',
      ...modules,
      ...flagOptionToStringArray(option),
    )
  }

  async upgrade(
    modules: string[],
    option: Record<string, string> = {},
  ): Promise<void> {
    await runDepManagerCommand(
      'upgrade',
      ...modules,
      ...flagOptionToStringArray(option),
    )
  }
}

const { yellow } = pc

type DepManagerCommand = 'npm' | 'yarn' | 'pnpm' | 'bun'

type DepManagerActionCommand = 'install' | 'add' | 'upgrade' | 'remove'

const depInstallerCommandMapper: Record<
  DepManagerActionCommand,
  Record<DepManagerCommand, string>
> = {
  install: {
    npm: 'i',
    yarn: 'install',
    pnpm: 'i',
    bun: 'i',
  },
  add: {
    npm: 'i',
    yarn: 'add',
    pnpm: 'i',
    bun: 'add',
  },
  remove: {
    npm: 'uninstall',
    yarn: 'remove',
    pnpm: 'uninstall',
    bun: 'remove',
  },
  upgrade: {
    npm: 'up',
    yarn: 'upgrade',
    pnpm: 'up',
    bun: 'update',
  },
}

/**
 * ```ts
 * runDepManagerCommand('add', 'lodash@1', '-d')
 * runDepManagerCommand('install')
 * ```
 * @param params
 */
async function runDepManagerCommand(
  action: DepManagerActionCommand,
  ...params: string[]
) {
  if (!(await getPkgJson())) {
    console.log(
      yellow(
        `Can't find package.json! Please ensure that current path is a node project.`,
      ),
    )
    return
  }

  const depInstallerCommand = await detectPkgManagerCommand()

  const actionName = depInstallerCommandMapper[action][depInstallerCommand]

  await exec(depInstallerCommand, [actionName, ...params])
}

export async function detectPkgManagerCommand(
  cwd = process.cwd(),
): Promise<DepManagerCommand> {
  const pnpmLockFile = join(cwd, 'pnpm-lock.yaml')
  if (exists(pnpmLockFile)) {
    return 'pnpm'
  }

  const bunLockFile = join(cwd, 'bun.lockb')
  if (exists(bunLockFile)) {
    return 'bun'
  }

  const yarnLockFile = join(cwd, 'yarn.lock')
  if (exists(yarnLockFile)) {
    return 'yarn'
  }

  const jsonLockFile = join(cwd, 'package-lock.json')
  if (exists(jsonLockFile)) {
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

/**
 *
 * @param pkg
 *
 * getPackageName('lodash@latest') => @types/lodash
 * getPackageName('@babel/core') => @types/babel__core
 *
 */
export function getTypePackageName(pkg: string) {
  const idx = pkg.lastIndexOf('@')
  const name = idx > 0 ? pkg.slice(0, idx) : pkg

  if (name.includes('@')) {
    const [scope, pkgName] = name.split('/')
    return `@types/${scope.slice(1)}__${pkgName}`
  } else {
    return `@types/${name}`
  }
}
