import { CompletionsCommand } from 'cliffy/command/mod.ts'
import { UpgradeCommand } from 'cliffy/command/upgrade/mod.ts'
import { GithubProvider } from 'cliffy/command/upgrade/provider/github.ts'

import { debug } from './debug.ts'
import { version } from '../version.ts'
import { npmCommand } from './commands/npm.ts'

const xn = npmCommand.version(version)

// upgrade self
xn.command(
  'upgrade-xn',
  new UpgradeCommand({
    main: 'xn.ts',
    importMap: 'import_map.json',
    args: ['-A'],
    provider: new GithubProvider({
      repository: '0x-jerry/x',
    }),
  }),
)

// completion
xn.command('completions', new CompletionsCommand())

// parse
try {
  await xn.parse()
} catch (e) {
  debug.error(e)
}
