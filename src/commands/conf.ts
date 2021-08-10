import * as colors from 'https://deno.land/std@0.101.0/fmt/colors.ts'
import { Command } from 'https://deno.land/x/cliffy@v0.19.2/command/mod.ts'
import { exists } from 'https://deno.land/std@0.101.0/fs/mod.ts'
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
