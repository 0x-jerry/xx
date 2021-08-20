import * as colors from 'fmt/colors.ts'
import { Command, HelpCommand } from 'cliffy/command/mod.ts'
import { exists } from 'fs/mod.ts'
import { getConfPath } from '../libs/conf.ts'
import { join } from 'path/mod.ts'

export const confCommand = new Command()
  .description('Config manager.')
  .default('help')
  .command('help', new HelpCommand())
  //
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
  .command('ls', 'List all config files.')
  .action(async () => {
    const p = getConfPath('.')

    const files = Deno.readDir(p)

    for await (const file of files) {
      console.log('-', colors.cyan(join(p, file.name)))
    }
  })

if (import.meta.main) {
  confCommand.parse()
}
