import { version } from '../version.ts'

import { runCommand } from './commands/run.ts'
import { debug } from './debug.ts'

// parse
try {
  await runCommand.version(version).parse()
} catch (e) {
  debug.error(e)
}
