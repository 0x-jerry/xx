import {
  Command,
  HelpCommand,
  CompletionsCommand,
} from 'https://deno.land/x/cliffy@v0.19.2/command/mod.ts'
import { UpgradeCommand } from 'https://deno.land/x/cliffy@v0.19.2/command/upgrade/mod.ts'
import { GithubProvider } from 'https://deno.land/x/cliffy@v0.19.2/command/upgrade/provider/github.ts'

import { workflowCommand } from './commands/workflow.ts'

const x = new Command()
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
  // completion
  .command('completions', new CompletionsCommand())
  // flow
  .command('flow', workflowCommand)

// parse
try {
  await x.parse()
} catch {
  // ignore
}
