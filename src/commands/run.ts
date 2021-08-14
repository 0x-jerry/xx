import { Command } from 'cliffy/command/mod.ts'

export const runCommand = new Command()
  .description('Run custom command')
  .option('-c, --config', 'Config file')
  .arguments('<script:string> [...params:string]')
  .action((opt: { config: string }, script: string, params: string[]) => {
    // Deno.run()
    console.log(opt, script, params)
  })

if (import.meta.main) {
  runCommand.parse()
}
