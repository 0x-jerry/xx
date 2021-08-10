import * as colors from 'fmt/colors.ts'
import { Command } from 'cliffy/command/mod.ts'
import { exists } from 'fs/mod.ts'
import { getConfPath } from '../libs/conf.ts'

export const confCommand = new Command()
  .description('Config manager.')
  .command('rm <name:string>', 'Remove specific config.')
  .action(async (_, name) => {
    const p = getConfPath(name)

    if (await exists(p)) {
      await Deno.remove(p)
      console.log(colors.green(`Remove [${p}] successful!`))
    } else {
      console.log(colors.yellow(`Not found config file: ${p}.`))
    }
  })

if (import.meta.main) {
  confCommand.parse()
}
