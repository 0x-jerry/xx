import { Command } from 'cliffy/command/mod.ts'
import { runNpm } from './utils.ts'

export const npmUpgradeCommand = new Command()
  .alias('up')
  .description('upgrade node modules')
  .option('-L, --latest', 'Upgrade to the latest.', {
    hidden: true,
  })
  .stopEarly()
  .arguments('[...params]')
  .action(async (opt, ...params) => {
    if (opt.latest) [params.push('-L')]

    await runNpm('upgrade', ...params)
  })
