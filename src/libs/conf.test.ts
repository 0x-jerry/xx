import { assertEquals } from 'https://deno.land/std@0.101.0/testing/asserts.ts'
import { createConf } from './conf.ts'
import { sleep } from '../utils.ts'

Deno.test('createConfig', () => {
  let t = 0
  let data: unknown

  const fn = (_: string, d: string) => {
    data = d
    t++
  }

  const conf = createConf({ path: '_', save: fn }, { test: 0 })
  conf.test++
  conf.test++

  setTimeout(() => {
    assertEquals(t, 1)
    assertEquals(data, JSON.stringify({ test: 2 }, null, 2))
  }, 10)

  return sleep(20)
})
