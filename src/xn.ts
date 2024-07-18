#!/usr/bin/env node
import { sliver, type ActionParsedArgs } from '@0x-jerry/silver'
import { DepManager } from './commands/depManager'

sliver`
@help @autocompletion

xn, install dependency quickly, support node/deno/cargo. ${defaultAction}

i/install [...modules] #stopEarly, install dependencies. ${installAction}

-t --types @bool, install package's types too, only effect node project.

up/upgrade [...modules] #stopEarly, upgrade dependencies. ${upgradeAction}

rm/remove <...modules> #stopEarly, remove dependencies. ${removeAction}
`

async function defaultAction() {
  await new DepManager().install()
}

async function installAction(_: string[], opt: ActionParsedArgs) {
  const params = opt._

  const installOnly = !params.length

  if (installOnly) {
    await new DepManager().install()
    return
  }

  // todo, parameters may has option like -D
  await new DepManager().add(params)

  // // install typedef for packages
  // if (opt.types) {
  //   const typesPackages = parameters
  //     // ignore extra parameters
  //     .filter((n) => !n.startsWith('-'))
  //     .map((pkg) => getTypePackageName(pkg))
  //   await runDepInstaller('add', ...typesPackages, '-D')
  // }
}

async function upgradeAction(_: string[], opt: ActionParsedArgs) {
  const params = opt._

  await new DepManager().upgrade(params)
}

async function removeAction(_: string[], opt: ActionParsedArgs) {
  const params = opt._

  await new DepManager().remove(params)
}
