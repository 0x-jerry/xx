import { Command } from 'cliffy/command/mod.ts'
import { join } from 'path/mod.ts'
import { run, homedir } from '../utils.ts'
import { Confirm } from 'cliffy/prompt/confirm.ts'
import { Select } from 'cliffy/prompt/select.ts'

const codeStoragePath = join(
  homedir,
  'Library',
  'Application Support',
  'Code',
  'storage.json',
)

export const codeCommand = new Command()
  .description('Open recent folder use vscode.')
  .arguments('[folder:string:recent]')
  .complete('recent', async () =>
    (await getVscodeRecentOpened()).map((n) => n.label),
  )
  .action(async (_, folder?: string) => {
    const recentlyOpenedItems = await getVscodeRecentOpened()

    let hit =
      folder && recentlyOpenedItems.find((f) => f.label.includes(folder))

    if (hit) {
      if (folder !== hit.label) {
        const yes = await Confirm.prompt({
          message: `Did you mean to open: ${hit.label} ?`,
          default: true,
        })

        if (!yes) return
      }
    } else {
      console.log(`Can't find file contain ${folder}, please select one.`)

      const res = await Select.prompt({
        message: 'Select recently opened file or folder:',
        options: recentlyOpenedItems.map((n) => n.label),
      })

      hit = recentlyOpenedItems.find((f) => f.label === res)
    }

    if (!hit) return

    await run('code', hit.path)
  })

async function getVscodeRecentOpened() {
  try {
    const txt = await Deno.readTextFile(codeStoragePath)
    const codeConf = JSON.parse(txt)

    // ---- get recent opened history
    const menu = codeConf.lastKnownMenubarData.menus.File.items.find(
      (n: any) => n.submenu,
    )

    const recentOpened: RecentlyOpened[] = menu.submenu.items
      .filter((n: any) => n.uri)
      .map((n: any) => {
        return {
          label: n.label,
          path: n.uri.path,
          schema: n.uri.scheme,
        }
      })
    // ----

    return recentOpened
  } catch (_error) {
    return []
  }
}

interface RecentlyOpened {
  label: string
  path: string
  schema: string
}
