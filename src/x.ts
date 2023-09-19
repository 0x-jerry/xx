import { sliver, type ActionParsedArgs } from '@0x-jerry/silver'
import { downloadGitRepo } from './commands/downloadGitRepo'
import { bootstrap } from 'global-agent'
bootstrap({
  environmentVariableNamespace: '',
})

const ins = sliver`
@help @autocompletion

x, Some useful subcommand.

t/template [dest path], download git repo as a template. ${defaultAction}

-u --url, Git url to download with. eg. -u 0x-jerry/x, -u https://github.com/0x-jerry/x
-b --branch, Git branch.
`

async function defaultAction(_: string[], args: ActionParsedArgs) {
  let [destDir] = _
  let { url, branch = 'main' } = args

  await downloadGitRepo({
    url,
    branch,
    destDir,
  })
}
