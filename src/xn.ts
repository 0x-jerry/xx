#!/usr/bin/env node
import { sliver, type ActionParsedArgs } from '@0x-jerry/silver'
import { runNpm } from './commands/npm'

sliver`
@help @autocompletion

xn, install npm package quickly. ${defaultAction}

i/install [module] #stopEarly, install npm package quickly. ${installAction}

up/upgrade #stopEarly, upgrade npm packages. ${upgradeAction}
`

async function defaultAction() {
  await runNpm('install')
}

async function installAction(_: string[], opt: ActionParsedArgs) {
  const installOnly = !opt._.length

  if (installOnly) {
    await runNpm('install')
    return
  }

  await runNpm('add', ...opt._)
}

async function upgradeAction(_: string[], opt: ActionParsedArgs) {
  const params = opt._

  if (opt.L) {
    params.push('-L')
  }

  await runNpm('upgrade', ...params)
}
