import { Command } from 'https://deno.land/x/cliffy@v0.19.2/command/mod.ts'
import { run } from '../utils.ts'

export const workflowCommand = new Command()
  .description('some workflow')
  .command('build', 'Build current branch and push to remote')
  .action(async () => {
    await run('yarn', 'build')
    await run('git', 'add', '.')
    await run('git', 'commit', '-m', 'chore: build')
    await run('git', 'push')
  })

workflowCommand
  .command('tb', 'Create a new git branch according by teambition task list')
  .option('-i, --init', 'Initialize config information', { default: false })
  .action((opt: { init: boolean }) => {
    if (opt.init) {
      return
    }

    // fetch('', {body})
  })
