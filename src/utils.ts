export * from 'x-utils'

import { run } from 'x-utils'

export async function exec(
  script: string,
  params: string[],
  env?: Record<string, string>,
): Promise<void> {
  await run(
    {
      env,
    },
    'sh',
    '-c',
    [script, ...params].join(' '),
  )
}
