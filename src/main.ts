import { Command, HelpCommand, CompletionsCommand } from 'cliffy/command/mod.ts'
import { UpgradeCommand } from 'cliffy/command/upgrade/mod.ts'
import { GithubProvider } from 'cliffy/command/upgrade/provider/github.ts'
import { version } from '../version.ts'
import { config } from './config.ts'

import { workflowCommand } from './commands/workflow.ts'
import { confCommand } from './commands/conf.ts'
import { nrmCommand } from './commands/nrm.ts'
import { runCommand } from './commands/run.ts'

const x = new Command()
  .name('x')
  .version(version)
  .option('-d, --debug', 'Enable debug mode.', {
    global: true,
    value(val) {
      val = !!val

      config.debug = val

      return val
    },
  })
  .description('Some useful command for myself.')
  .default('help')
  // help
  .command('help', new HelpCommand())
  // upgrade
  .command(
    'upgrade',
    new UpgradeCommand({
      main: 'x.ts',
      importMap: 'import_maps.json',
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
  // conf
  .command('conf', confCommand)
  // nrm
  .command('nrm', nrmCommand)
  // nrm
  .command('run', runCommand)

// parse
try {
  await x.parse()
} catch {
  // ignore
}
