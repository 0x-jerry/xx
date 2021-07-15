import * as colors from 'https://deno.land/std@0.101.0/fmt/colors.ts'

function getFormatCmd(cmd: string[]) {
  return [
    '$',
    // ['echo', 'hello world'] => $ echo 'hello world'
    ...cmd.map((param) => (/\s/.test(param) ? `'${param}'` : param)),
  ].join(' ')
}

export async function run(...cmd: string[]) {
  console.log(colors.rgb24(getFormatCmd(cmd), 0x999999))

  const program = Deno.run({
    cmd: cmd,
    stdout: 'inherit',
    stderr: 'inherit',
    stdin: 'inherit',
  })

  const status = await program.status()
  program.close()

  if (!status.success) {
    throw status
  }
}
