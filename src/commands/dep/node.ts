import { join } from 'path'
import pc from 'picocolors'
import { exec, exists } from '../../utils'
import { readFile } from 'fs/promises'
import type { DependencyManager } from './types'

export class NodeDependencyManager implements DependencyManager {
  install(option?: Record<string, string>): Promise<void> {
    throw new Error('Method not implemented.')
  }

  add(modules: string[], option?: Record<string, string>): Promise<void> {
    throw new Error('Method not implemented.')
  }

  remove(modules: string[], option?: Record<string, string>): Promise<void> {
    throw new Error('Method not implemented.')
  }

  upgrade(modules: string[], option?: Record<string, string>): Promise<void> {
    throw new Error('Method not implemented.')
  }
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

const { yellow } = pc

export type DepManagerCommand = 'npm' | 'yarn' | 'pnpm' | 'bun'

export type DepManagerActionCommand = 'install' | 'add' | 'upgrade' | 'remove'

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
 * add('lodash@1', '-d')
 * ```
 * @param params
 */
export async function runDepInstaller(
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

  const depInstallerCommand = await detectDepInstallerCommand()

  const actionName = depInstallerCommandMapper[action][depInstallerCommand]

  await exec(depInstallerCommand, [actionName, ...params])
}

export async function detectDepInstallerCommand(
  cwd = process.cwd(),
): Promise<DepManagerCommand> {
  const bunLockFile = join(cwd, 'bun.lockb')
  if (exists(bunLockFile)) {
    return 'bun'
  }

  const pnpmLockFile = join(cwd, 'pnpm-lock.yaml')
  if (exists(pnpmLockFile)) {
    return 'pnpm'
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
