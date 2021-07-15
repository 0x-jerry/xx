import { Command } from 'https://deno.land/x/cliffy@v0.19.2/command/mod.ts'
import { run } from '../utils.ts'

export const workflowCommand = new Command()
  .description('some workflow')
  .command('build', 'build current branch and push to remote')
  .action(async () => {
    await run('yarn', 'build')
    await run('git', 'add', '.')
    await run('git', 'commit', '-m', 'chore: build')
    await run('git', 'push')
  })
