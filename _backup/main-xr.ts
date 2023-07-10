import { CompletionsCommand } from 'cliffy/command/mod.ts'
import { UpgradeCommand } from 'cliffy/command/upgrade/mod.ts'
import { GithubProvider } from 'cliffy/command/upgrade/provider/github.ts'

import { runCommand } from './commands/run.ts'
import { debug } from './debug.ts'
import { version } from '../version.ts'

const xr = runCommand.version(version)

// upgrade
xr.command(
  'upgrade',
  new UpgradeCommand({
    main: 'xr.ts',
    importMap: 'import_map.json',
    args: ['-A'],
    provider: new GithubProvider({
      repository: '0x-jerry/x',
    }),
  }),
)

// completion
xr.command('completions', new CompletionsCommand())

// parse
try {
  await xr.parse()
} catch (e) {
  debug.error(e)
}
