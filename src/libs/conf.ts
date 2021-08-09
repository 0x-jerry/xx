import {
  reactive,
  effect,
  UnwrapNestedRefs,
} from 'https://cdn.skypack.dev/@vue/reactivity?dts'
import { ensureDir } from 'https://deno.land/std@0.101.0/fs/mod.ts'
import { join } from 'https://deno.land/std@0.101.0/path/mod.ts'
import { isObject, homedir } from '../utils.ts'

type SaveFn = (name: string, data: string) => void | Promise<void>

const defaultSaveFn: SaveFn = async (name: string, data: string) => {
  const home = homedir()

  const confDir = join(home, '.x.conf')
  await ensureDir(confDir)

  const confPath = join(confDir, name)
  await Deno.writeTextFile(confPath, data)
}

/**
 * @example
 *
 * ```ts
 * const [data, saving] = createConf({ a: 1, b: 1 }, { path: './config.json' })
 *
 * data.a++
 * data.b++
 *
 * await saving() // Ensure all changes saved, will only save once.
 *
 * ```
 *
 * @param defaultValue
 * @param option
 * @returns
 */
export function createConf<T extends Record<string, any>>(
  name: string,
  defaultValue: T,
  save?: SaveFn,
): [UnwrapNestedRefs<T>, () => Promise<void>] {
  const data = reactive(defaultValue)

  let saving = Promise.resolve()

  let handler: number | undefined

  const saveData = () => {
    return new Promise<void>((resolve) => {
      clearTimeout(handler)

      handler = setTimeout(() => {
        const saveFn: SaveFn = save || defaultSaveFn

        saveFn(name, JSON.stringify(data, null, 2))

        resolve()
      })
    })
  }

  effect(() => {
    traverse(data)
    saving = saveData()
  })

  return [data, () => saving]
}

/**
 * Touch every property recursively
 * @param o object
 */
function traverse(o: unknown) {
  if (isObject(o)) {
    for (const key in o) {
      if (Object.prototype.hasOwnProperty.call(o, key)) {
        const value = o[key]
        traverse(value)
      }
    }
  } else if (Array.isArray(o)) {
    for (const item of o) {
      traverse(item)
    }
  }
}
