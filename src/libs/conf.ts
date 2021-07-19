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

export interface ConfOption {
  path: string
  save?: (path: string, data: string) => void | Promise<void>
}

export function createConf<T extends Record<string, SupportType>>(
  option: ConfOption,
  defaultValue: T,
): UnwrapNestedRefs<T> {
  const data = reactive(defaultValue)

  let handler: number | undefined

  const saveData = () => {
    clearTimeout(handler)
    handler = setTimeout(() => {
      option.save
        ? option.save(option.path, JSON.stringify(data, null, 2))
        : Deno.writeTextFile(option.path, JSON.stringify(data, null, 2))
    })
  }

  effect(() => {
    traverse(data)
    saveData()
  })

  return data
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

if (import.meta.main) {
  const a = createConf({ path: '' }, { a: 3 })
  a.a++
  a.a++
  a.a++
  a.a++
  a.a++
  a.a++
}
