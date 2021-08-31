import { Command } from 'cliffy/command/mod.ts'
import { join } from 'path/mod.ts'
import { run, homedir } from '../utils.ts'
import { exists } from 'fs/mod.ts'

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
  .complete('recent', async () => {
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
  })
  .action(async (_, folder: string) => {
    await run('code', folder)
  })
