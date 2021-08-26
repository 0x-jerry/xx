import { assertEquals } from 'testing/asserts.ts'
import { parseCmdStr } from './run.ts'

Deno.test('space', () => {
  assertEquals(parseCmdStr('deno run file.ts'), [['deno', 'run', 'file.ts']])
})

Deno.test('quote', () => {
  assertEquals(parseCmdStr('deno run "test test"'), [
    ['deno', 'run', 'test test'],
  ])

  assertEquals(parseCmdStr(`deno run 'test test'`), [
    ['deno', 'run', 'test test'],
  ])
})

Deno.test('=', () => {
  assertEquals(parseCmdStr('deno run -c=test'), [['deno', 'run', '-c', 'test']])

  assertEquals(parseCmdStr('deno run -c="test xx"'), [
    ['deno', 'run', '-c', 'test xx'],
  ])
})

Deno.test('dot', () => {
  assertEquals(parseCmdStr('deno run -c=./test.js'), [
    ['deno', 'run', '-c', './test.js'],
  ])

  assertEquals(parseCmdStr('deno run -c "test ./xx.js"'), [
    ['deno', 'run', '-c', 'test ./xx.js'],
  ])
})

Deno.test('&&', () => {
  assertEquals(parseCmdStr('echo hello && echo world'), [
    ['echo', 'hello'],
    ['echo', 'world'],
  ])
})

Deno.test('yarn build:resolver && yarn build:dts', () => {
  assertEquals(parseCmdStr('yarn build:resolver && yarn build:dts'), [
    ['yarn', 'build:resolver'],
    ['yarn', 'build:dts'],
  ])
})
