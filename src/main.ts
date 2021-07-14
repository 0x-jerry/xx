import {
  Command,
  HelpCommand,
} from 'https://deno.land/x/cliffy@v0.19.2/command/mod.ts'
import { UpgradeCommand } from 'https://deno.land/x/cliffy@v0.19.2/command/upgrade/mod.ts'
import { GithubProvider } from 'https://deno.land/x/cliffy@v0.19.2/command/upgrade/provider/github.ts'

await new Command()
  .name('x')
  .description('Some useful command for myself.')
  .default('help')
  // help
  .command('help', new HelpCommand())
  // upgrade
  .command(
    'upgrade',
    new UpgradeCommand({
      main: 'x.ts',
      args: ['-A', '--no-check', '--unstable'],
      provider: new GithubProvider({
        repository: '0x-jerry/x',
      }),
    }),
  )
  // parse
  .parse()
