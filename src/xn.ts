#!/usr/bin/env tsx

import { sliver, type ActionParsedArgs } from '@0x-jerry/silver'

sliver`
@help @autocompletion

xn [module], install npm package quickly. ${installAction}

i [module], install npm package quickly. ${installAction}

up #stopEarly, upgrade npm packages. ${upgradeAction}
`

function installAction([pkgName]: string[], opt: ActionParsedArgs) {
  if (pkgName) {
    //
  }
}

function upgradeAction(_: string[], opt: ActionParsedArgs) {
  //
}
