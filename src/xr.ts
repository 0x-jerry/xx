import { sliver, type ActionParsedArgs } from '@0x-jerry/silver'
import { getScriptContent, runScript } from './commands/run'

const ins = sliver`
@help @autocompletion

xr [@command:command] #stopEarly, run command quickly. ${defaultAction}
`

ins.type('command', async () => {
  const [_, allScripts] = await getScriptContent()

  return allScripts
})

async function defaultAction(_: string[], arg: ActionParsedArgs) {
  const [command, ...params] = arg._

  await runScript(command, params)
}
