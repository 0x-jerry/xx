import {
  Command,
  HelpCommand,
  CompletionsCommand,
} from 'https://deno.land/x/cliffy@v0.19.2/command/mod.ts'
import { config } from './conf.ts'

await new Command()
  .name('x')
  .version(config.version)
  .description('Some useful command for myself.')
  .default('help')
  // help
  .command('help', new HelpCommand())
  // completions
  .command('completions', new CompletionsCommand())
  // parse
  .parse()
