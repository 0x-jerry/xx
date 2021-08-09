import {
  assertEquals,
  assertThrowsAsync,
} from 'https://deno.land/std@0.101.0/testing/asserts.ts'
import { runPiped } from './run.ts'

Deno.test('run result', async () => {
  const output = await runPiped('echo', 'hello')

  assertEquals(output.trim(), 'hello')
})

Deno.test('run throw error', async () => {
  await assertThrowsAsync(async () => {
    await runPiped('xxx', 'hello')
  })
})
