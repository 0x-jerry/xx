import { Command, EnumType } from 'cliffy/command/mod.ts'
import {
  useRegistry,
  setRegistry,
  printRegistry,
  removeRegistry,
} from './nrm/index.ts'

const managerType = new EnumType(['npm', 'yarn'])

export const nrmCommand = new Command()
  .description('Node registry manager')
  .command('use <name:string>', 'Use specific registry server by name.')
  .type('manager', managerType)
  .option('-m, --manager [manager:manager]', 'Registry manager type')
  .action((opt, name) => useRegistry(name, opt.manager))

nrmCommand
  .command(
    'set <name:string> <registry:string> [home:string]',
    'Set or update registry config.',
  )
  .option('-f, --force', 'Force update registry.', { default: false })
  .action((opt, name, registry, home = '') => {
    setRegistry(name, { registry, home }, opt.force)
  })

nrmCommand.command('ls', 'List all registry.').action(() => {
  printRegistry()
})

nrmCommand
  .command('rm <name:string>', 'Remove specific registry by name.')
  .action((_, name) => {
    removeRegistry(name)
  })

if (import.meta.main) {
  nrmCommand.parse()
}
