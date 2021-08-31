import { Command, HelpCommand, CompletionsCommand } from 'cliffy/command/mod.ts'
import { UpgradeCommand } from 'cliffy/command/upgrade/mod.ts'
import { GithubProvider } from 'cliffy/command/upgrade/provider/github.ts'
import { version } from '../version.ts'
import { config } from './config.ts'

import { workflowCommand } from './commands/workflow.ts'
import { confCommand } from './commands/conf.ts'
import { nrmCommand } from './commands/nrm.ts'
import { runCommand } from './commands/run.ts'
import { gitCommand } from './commands/git.ts'
import { codeCommand } from './commands/code.ts'
import { debug } from './debug.ts'

const x = new Command()
  .name('x')
  .version(version)
  .globalOption('-d, --debug', 'Enable debug mode.', (val) => {
    val = !!val

    config.debug = val

    return val
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
      importMap: 'import_map.json',
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
  // run
  .command('run', runCommand)
  // git
  .command('git', gitCommand)
  // code
  .command('code', codeCommand)

// parse
try {
  const params = isRunScript() ? ['run', ...Deno.args] : Deno.args

  await x.parse(params)
} catch (e) {
  debug.error(e)
}

function isRunScript() {
  if (Deno.args.length === 0) return false

  const allCommands = x.getCommands().map((c) => c.getName())

  const isCmd = (s: string) => allCommands.includes(s)

  const [$1, $2] = Deno.args

  if ($1 === '-d' && !isCmd($2)) return true

  return !isCmd($1) && !/^\-/.test($1)
}
