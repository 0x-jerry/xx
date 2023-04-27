import { Command } from 'cliffy/command/mod.ts'
import { runNpm } from './utils.ts'

export const npmInstallCommand = new Command()
  .alias('i')
  .description('install node modules')
  .stopEarly()
  .arguments('[...params]')
  .action(async (_, ...params) => {
    await runNpm('add', ...params)
  })
