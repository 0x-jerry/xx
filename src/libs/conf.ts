import { ensureDirSync, existsSync } from 'fs/mod.ts'
import { join, dirname } from 'path/mod.ts'
import { homedir } from '../utils.ts'
import { createConfig } from 'x-lib/mod.ts'

type SaveFn = (name: string, data: string) => void
type ReadFn = (name: string) => string | null

export const getConfPath = (name: string) => {
  const home = homedir()

  return join(home, '.x.conf', name)
}

const defaultSaveFn: SaveFn = (name: string, data: string) => {
  const confPath = getConfPath(name)
  ensureDirSync(dirname(confPath))

  Deno.writeTextFileSync(confPath, data)
}

const defaultReadFn: ReadFn = (name: string) => {
  const confPath = getConfPath(name)

  if (!existsSync(confPath)) {
    return null
  }

  const data = Deno.readTextFileSync(confPath)

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
export function createConf<T extends Record<string, any>>(
  name: string,
  defaultValue: T,
  save?: SaveFn,
  read?: ReadFn,
) {
  const readConf = read || defaultReadFn
  const savedData = readConf(name)
  const defaultConf: T = savedData ? JSON.parse(savedData) : defaultValue

  const saveFn: SaveFn = save || defaultSaveFn

  return createConfig(
    () => defaultConf,
    (data) => saveFn(name, JSON.stringify(data, null, 2)),
  )
}
