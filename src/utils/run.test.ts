import { assertEquals, assertThrowsAsync } from 'testing/asserts.ts'
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
