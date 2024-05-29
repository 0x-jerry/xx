#!/usr/bin/env node
import { sliver, type ActionParsedArgs } from '@0x-jerry/silver'
import { runNpm } from './commands/npm'

sliver`
@help @autocompletion

xn, install npm package quickly. ${defaultAction}

i/install [module] #stopEarly, install npm package quickly. ${installAction}

-t --types @bool, install package's types too.

up/upgrade #stopEarly, upgrade npm packages. ${upgradeAction}
`

async function defaultAction() {
  await runNpm('install')
}

async function installAction(_: string[], opt: ActionParsedArgs) {
  const parameters = opt._

  const installOnly = !parameters.length

  if (installOnly) {
    await runNpm('install')
    return
  }

  await runNpm('add', ...parameters)

  // install typedef for packages
  if (opt.types) {
    const typesPackages = parameters
      // ignore extra paramaters
      .filter(n => n.startsWith('-'))
      .map((pkg) => getTypePackageName(pkg))
    await runNpm('add', ...typesPackages, '-D')
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

  if (opt.L) {
    params.push('-L')
  }

  await runNpm('upgrade', ...params)
}
