import {
  reactive,
  effect,
  UnwrapNestedRefs,
} from 'https://cdn.skypack.dev/@vue/reactivity?dts'
import { ensureDir, exists } from 'https://deno.land/std@0.101.0/fs/mod.ts'
import { join, dirname } from 'https://deno.land/std@0.101.0/path/mod.ts'
import { isObject, homedir } from '../utils.ts'

type SaveFn = (name: string, data: string) => Promise<void>
type ReadFn = (name: string) => Promise<string | null>

const getConfPath = (name: string) => {
  const home = homedir()

  return join(home, '.x.conf', name)
}

const defaultSaveFn: SaveFn = async (name: string, data: string) => {
  const confPath = getConfPath(name)
  await ensureDir(dirname(confPath))

  await Deno.writeTextFile(confPath, data)
}

const defaultReadFn: ReadFn = async (name: string) => {
  const confPath = getConfPath(name)

  if (!(await exists(confPath))) {
    return null
  }

  const data = await Deno.readTextFile(confPath)

  return data
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
export async function createConf<T extends Record<string, any>>(
  name: string,
  defaultValue: T,
  save?: SaveFn,
  read?: ReadFn,
): Promise<[UnwrapNestedRefs<T>, () => Promise<void>]> {
  const readConf = read || defaultReadFn
  const savedData = await readConf(name)
  const defaultConf = savedData ? JSON.parse(savedData) : defaultValue

  const data = reactive(defaultConf)

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
