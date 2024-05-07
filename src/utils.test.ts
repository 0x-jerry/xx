import { _parseArgs, run } from './utils'

describe('run command', () => {
  it('should parse quotes', () => {
    let result = _parseArgs('echo hello')
    expect(result).eqls(['echo', 'hello'])

    result = _parseArgs('echo "hello \'"')
    expect(result).eqls(['echo', "hello '"])

    result = _parseArgs("echo 'hello \"'")
    expect(result).eqls(['echo', 'hello "'])
  })

  it('should run with && operator', async () => {
    await run('echo hello && echo world')
  })
})
