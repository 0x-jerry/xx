import { Command } from 'cliffy/command/mod.ts'
import { runNpm } from './utils.ts'

export const npmUpgradeCommand = new Command()
  .alias('up')
  .description('upgrade node modules')
  .stopEarly()
  .arguments('[...params]')
  .action(async (_, ...params) => {
    await runNpm('upgrade', ...params)
  })
