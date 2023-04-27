import { Command, HelpCommand, CompletionsCommand } from 'cliffy/command/mod.ts'
import { UpgradeCommand } from 'cliffy/command/upgrade/mod.ts'
import { GithubProvider } from 'cliffy/command/upgrade/provider/github.ts'
import { version } from '../version.ts'

import { releaseCommand } from './commands/release.ts'
import { confCommand } from './commands/conf.ts'
import { nrmCommand } from './commands/nrm.ts'
import { runCommand } from './commands/run.ts'
import { gitCommand } from './commands/git.ts'
import { codeCommand } from './commands/code.ts'
import { debug } from './debug.ts'
import { xmCommander } from './commands/deps/mod.ts'
import { npmCommand } from './commands/npm.ts'

const x = new Command()
  .name('x')
  .version(version)
  .description('Some useful command for myself.')
  .default('help')

// help
x.command('help', new HelpCommand())

// upgrade
x.command(
  'upgrade',
  new UpgradeCommand({
    main: 'x.ts',
    importMap: 'import_map.json',
    args: ['-A'],
    provider: new GithubProvider({
      repository: '0x-jerry/x',
    }),
  }),
)

// completion
x.command('completions', new CompletionsCommand())

// release
x.command('release', releaseCommand)

// conf
x.command('conf', confCommand)

// nrm
x.command('nrm', nrmCommand)

// xr
x.command('run', runCommand)

// git
x.command('git', gitCommand)

// code
x.command('code', codeCommand)

// xm
x.command('deps', xmCommander)

// n
x.command('npm', npmCommand)

// parse
try {
  await x.parse()
} catch (e) {
  debug.error(e)
}
