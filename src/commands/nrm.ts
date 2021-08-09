import {
  Command,
  EnumType,
} from 'https://deno.land/x/cliffy@v0.19.2/command/mod.ts'
import { use } from './nrm/index.ts'

const managerType = new EnumType(['npm', 'yarn'])

export const nrmCommand = new Command()
  .description('Node registry manager')
  .command('use <registry:string>', 'use specific registry server')
  .type('manager', managerType)
  .option('-m, --manager [manager:manager]', 'registry manager type')
  .action((opt, ...[registry]) => {
    use(registry, opt.manager)
  })

if (import.meta.main) {
  nrmCommand.parse()
}
