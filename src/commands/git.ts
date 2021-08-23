import { Command, HelpCommand } from 'cliffy/command/mod.ts'
import { runPiped } from '../utils.ts'
import { green } from 'fmt/colors.ts'

export const gitCommand = new Command()
  .description('Some useful command for git repository.')
  .default('help')
  .command('help', new HelpCommand())
  .command(
    'url [remote:string:remote]',
    'Show the remote url for current git repository.',
  )
  .complete('remote', async () => {
    const txt = await runPiped('git', 'remote', 'show')

    return txt
      .split(/\s+/g)
      .map((n) => n.trim())
      .filter((n) => !!n)
  })
  .option('--http', 'Use http instead of https')
  .action(async (opt, remote) => {
    remote = remote ?? 'origin'

    const origin = await runPiped('git', 'remote', 'get-url', remote)

    if (/https?:\/\//.test(origin)) {
      console.log(green(origin))
      return
    }

    const [site, repo] = origin.split(':')

    const [_protocol, host] = site.split('@')

    const protocol = opt.http ? 'http' : 'https'
    const gitUrl = `${protocol}://${host}/${repo.replace(/.git$/, '')}`

    console.log(green(gitUrl))
  })
