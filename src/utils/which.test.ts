import { assertEquals } from 'testing/asserts.ts'
import { which } from './which.ts'

Deno.test('which, do not exist', async () => {
  assertEquals(await which('not-exist'), null)
})

Deno.test('which, exist', async () => {
  assertEquals(await which('echo'), '/bin/echo')
})
