import { Command } from 'cliffy/command/mod.ts'
import { join } from 'path/mod.ts'
import { run, homedir } from '../utils.ts'
import { exists } from 'fs/mod.ts'
import { Confirm } from 'cliffy/prompt/confirm.ts'

const codeStoragePath = join(
  homedir,
  'Library',
  'Application Support',
  'Code',
  'storage.json',
)

export const codeCommand = new Command()
  .description('Open recent folder use vscode.')
  .arguments('<folder:string:recent>')
  .complete('recent', () => getVscodeRecentOpened())
  .action(async (_, folder: string) => {
    const matches = await getVscodeRecentOpened()
    const hit = matches.find((f) => f.includes(folder))
    if (hit) {
      const yes = await Confirm.prompt({
        message: `Did you mean to open: ${hit} ?`,
        default: true,
      })

      if (!yes) {
        return
      }
    }

    await run('code', hit || folder)
  })

async function getVscodeRecentOpened() {
  if (!(await exists(codeStoragePath))) {
    return []
  }

  const txt = await Deno.readTextFile(codeStoragePath)
  const codeConf = JSON.parse(txt)
  const entries = codeConf.openedPathsList.entries

  const folders: string[] = []
  const files: string[] = []

  entries.forEach((e: any) => {
    const u = new URL(e.folderUri || e.fileUri)
    const p = decodeURIComponent(u.pathname)

    if (e.folderUri) {
      folders.push(p)
    } else {
      files.push(p)
    }
  })

  return [...folders, ...files]
}
