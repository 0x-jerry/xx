import { assertEquals } from 'https://deno.land/std@0.101.0/testing/asserts.ts'
import { createConf } from './conf.ts'

Deno.test('createConfig', async () => {
  let savedTimes = 0
  let savedData = ''

  const fn = (_: string, d: string) => {
    savedData = d
    savedTimes++
  }

  const [conf, ensureSaved] = createConf({ test: 0 }, { path: '_', save: fn })
  conf.test++
  conf.test++
  await ensureSaved()

  assertEquals(savedTimes, 1)
  assertEquals(savedData, JSON.stringify({ test: 2 }, null, 2))

  conf.test++
  await ensureSaved()

  assertEquals(savedTimes, 2)
  assertEquals(savedData, JSON.stringify({ test: 3 }, null, 2))
})
