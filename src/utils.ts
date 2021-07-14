import { join, isAbsolute } from 'https://deno.land/std@0.101.0/path/mod.ts'

export function run(cmd: string, opt: Omit<Deno.RunOptions, 'cmd'>) {
  return Deno.run({
    cmd: cmd.trim().split(/\s+/g),
    stdout: 'piped',
    stderr: 'piped',
    stdin: 'piped',
    ...opt,
  })
}

export async function getConfig<T>(filePath: string): Promise<T> {
  const file = isAbsolute(filePath) ? filePath : join(Deno.cwd(), filePath)

  const fileContent = await Deno.readFile(file)

  const str = new TextDecoder('utf-8').decode(fileContent)

  return JSON.parse(str)
}
