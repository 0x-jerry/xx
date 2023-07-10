export * from 'x-utils'

import { rgb24 } from 'std/fmt/colors.ts'
import { run } from 'x-utils'

export async function exec(
  script: string,
  params: string[],
  env?: Record<string, string>,
): Promise<void> {
  const format = [
    '$',
    script,
    ...params.map((param) =>
      /\s/.test(param) ? JSON.stringify(param) : param,
    ),
  ].join(' ')

  console.log(rgb24(format, 0x999999))

  await run(
    {
      log: false,
      env,
    },
    'sh',
    '-c',
    [script, ...params].join(' '),
  )
}
