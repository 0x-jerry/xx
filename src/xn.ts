#!/usr/bin/env node
import { sliver, type ActionParsedArgs } from '@0x-jerry/silver'
import { runDepInstaller } from './commands/depManager'

sliver`
@help @autocompletion

xn, install dependency quickly, support node/deno/cargo. ${defaultAction}

i/install [...modules] #stopEarly, install dependencies. ${installAction}

-t --types @bool, install package's types too, only effect node project.

up/upgrade [...modules] #stopEarly, upgrade dependencies. ${upgradeAction}

rm/remove <...modules> #stopEarly, remove dependencies. ${removeAction}
`

async function defaultAction() {
  await runDepInstaller('install')
}

async function installAction(_: string[], opt: ActionParsedArgs) {
  const parameters = opt._

  const installOnly = !parameters.length

  if (installOnly) {
    await runDepInstaller('install')
    return
  }

  await runDepInstaller('add', ...parameters)

  // install typedef for packages
  if (opt.types) {
    const typesPackages = parameters
      // ignore extra parameters
      .filter((n) => !n.startsWith('-'))
      .map((pkg) => getTypePackageName(pkg))
    await runDepInstaller('add', ...typesPackages, '-D')
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

async function upgradeAction(_: string[], opt: ActionParsedArgs) {
  const params = opt._

  await runDepInstaller('upgrade', ...params)
}

async function removeAction(_: string[], opt: ActionParsedArgs) {
  const params = opt._

  await runDepInstaller('remove', ...params)
}
