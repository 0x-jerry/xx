import { Command, EnumType, HelpCommand } from 'cliffy/command/mod.ts'
import {
  useRegistry,
  setRegistry,
  printRegistry,
  removeRegistry,
  nrmConf,
} from './nrm/index.ts'

const managerType = new EnumType(['npm', 'yarn'])
const registryNames = Object.keys(nrmConf.registries)

export const nrmCommand = new Command()
  .description('Node registry manager')
  .default('help')
  .command('help', new HelpCommand())

nrmCommand
  .command(
    'use <name:string:registry>',
    'Use specific registry server by name.',
  )
  .complete('registry', () => registryNames)
  .type('manager', managerType)
  .option('-m, --manager [manager:manager]', 'Registry manager type')
  .action((opt, name) => useRegistry(name, opt.manager))

nrmCommand
  .command(
    'set <name:string:registry> <registry:string> [home:string]',
    'Set or update registry config.',
  )
  .complete('registry', () => registryNames)
  .option('-f, --force', 'Force update registry.', { default: false })
  .action((opt, name, registry, home = '') => {
    setRegistry(name, { registry, home }, opt.force)
  })

nrmCommand.command('ls', 'List all registry.').action(() => {
  printRegistry()
})

nrmCommand
  .command('rm <name:string:registry>', 'Remove specific registry by name.')
  .complete('registry', () => registryNames)
  .action((_, name) => {
    removeRegistry(name)
  })

if (import.meta.main) {
  nrmCommand.parse()
}
