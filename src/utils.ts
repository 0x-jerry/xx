export * from 'x-utils'

import { run } from 'x-utils'
import { rgb24 } from 'std/fmt/colors.ts'

export async function exec(
  script: string,
  params: string[],
  env?: Record<string, string>,
): Promise<void> {
  const stringified = params
    .map((n) => (/\s/.test(n) ? JSON.stringify(n) : n))
    .join(' ')

  console.log(rgb24(['$', script, stringified].join(' '), 0x999999))

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
