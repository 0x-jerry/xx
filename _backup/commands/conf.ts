import { green, yellow, cyan } from 'std/fmt/colors.ts'
import { Command, HelpCommand } from 'cliffy/command/mod.ts'
import { exists } from 'std/fs/mod.ts'
import { getConfPath } from '../libs/conf.ts'
import { join } from 'std/path/mod.ts'

export const confCommand = new Command()
  .description('Config manager.')
  .default('help')
  .command('help', new HelpCommand())
  //
  .command('rm <name:string:confName>', 'Remove specific config.')
  .complete('confName', async () => {
    const p = getConfPath('.')

    const files = Deno.readDir(p)
    const all = []

    for await (const file of files) {
      all.push(file.name)
    }

    return all
  })
  .action(async (_, name) => {
    const p = getConfPath(name)

    if (await exists(p)) {
      await Deno.remove(p)
      console.log(green(`Remove [${p}] successful!`))
    } else {
      console.log(yellow(`Not found config file: ${p}.`))
    }
  })
  .command('ls', 'List all config files.')
  .action(async () => {
    const p = getConfPath('.')

    const files = Deno.readDir(p)

    for await (const file of files) {
      console.log('-', cyan(join(p, file.name)))
    }
  })

if (import.meta.main) {
  confCommand.parse()
}
