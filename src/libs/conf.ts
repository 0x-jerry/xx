import {
  reactive,
  effect,
  UnwrapNestedRefs,
} from 'https://cdn.skypack.dev/@vue/reactivity?dts'
import { isObject } from '../utils.ts'

type SupportType =
  | boolean
  | number
  | string
  | undefined
  | null
  | { [key: string]: SupportType }
  | SupportType[]

type SaveFn = (path: string, data: string) => void

export interface ConfOption {
  path: string
  save?: SaveFn
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
export function createConf<T extends Record<string, SupportType>>(
  defaultValue: T,
  option: ConfOption,
): [UnwrapNestedRefs<T>, () => Promise<void>] {
  const data = reactive(defaultValue)

  let saving = Promise.resolve()

  let handler: number | undefined

  const saveData = () => {
    return new Promise<void>((resolve) => {
      clearTimeout(handler)

      handler = setTimeout(() => {
        const saveFn: SaveFn = option.save || Deno.writeTextFile

        saveFn(option.path, JSON.stringify(data, null, 2))

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
