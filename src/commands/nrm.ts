import {
  Command,
  EnumType,
} from 'https://deno.land/x/cliffy@v0.19.2/command/mod.ts'
import { useRegistry, setRegistry } from './nrm/index.ts'

const managerType = new EnumType(['npm', 'yarn'])

export const nrmCommand = new Command()
  .description('Node registry manager')
  .command('use <registry:string>', 'use specific registry server')
  .type('manager', managerType)
  .option('-m, --manager [manager:manager]', 'registry manager type')
  .action((opt, registry) => useRegistry(registry, opt.manager))

nrmCommand
  .command(
    'set <name:string> <registry:string> [home:string]',
    'set or update registry config',
  )
  .option('-f, --force', 'force update registry', { default: false })
  .action((opt, name, registry, home = '') => {
    setRegistry(name, { registry, home }, opt.force)
  })

if (import.meta.main) {
  nrmCommand.parse()
}
