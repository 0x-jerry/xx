import { join, isAbsolute } from 'path/mod.ts'

export async function getConfig<T>(filePath: string): Promise<T> {
  const file = isAbsolute(filePath) ? filePath : join(Deno.cwd(), filePath)

  const fileContent = await Deno.readFile(file)

  const str = new TextDecoder('utf-8').decode(fileContent)

  return JSON.parse(str)
}

interface IConfig {
  version: string
}

export const config = await getConfig<IConfig>('package.json')
