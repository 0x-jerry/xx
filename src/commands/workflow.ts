import { Command, HelpCommand } from 'cliffy/command/mod.ts'
import { run } from '../utils.ts'

export const workflowCommand = new Command()
  .description('Workflow for development.')
  .default('help')
  .command('help', new HelpCommand())
  //
  .command('build', 'Build current branch and push to remote.')
  .action(async () => {
    await run('yarn', 'build')
    await run('git', 'add', '.')
    await run('git', 'commit', '-m', 'chore: build')
    await run('git', 'push')
  })
