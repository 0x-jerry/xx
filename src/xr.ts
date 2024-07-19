#!/usr/bin/env node
import { sliver, type ActionParsedArgs } from '@0x-jerry/silver'
import { getAvailableCommands, runScript } from './commands/run'
import { version } from '../package.json'

const ins = sliver`
v${version} @help @autocompletion

xr [@command:command] #stopEarly, run command quickly. ${defaultAction}
`

ins.type('command', async () => {
  const allScripts = await getAvailableCommands()

  return allScripts
})

async function defaultAction(_: string[], arg: ActionParsedArgs) {
  const [command, ...params] = arg._

  try {
    await runScript(command, params)
  } catch (error) {
    // ignore error
    process.exit(1)
  }
}
