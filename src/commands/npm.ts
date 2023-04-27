import { Command } from 'cliffy/command/mod.ts'
import { npmInstallCommand } from './npm/install.ts'
import { npmUpgradeCommand } from './npm/upgrade.ts'
import { runNpm } from './npm/utils.ts'

export const npmCommand = new Command()
  .description('Some npm script for manage node deps.')
  .action(() => runNpm('install'))
  .command('install', npmInstallCommand)
  .command('upgrade', npmUpgradeCommand)
