import { run } from '../src/utils.ts'
import { Select } from 'https://deno.land/x/cliffy@v0.19.2/prompt/mod.ts'
import * as semver from 'https://deno.land/x/semver@v1.4.0/mod.ts'
import { config } from './utils.ts'

const inc = (type: semver.ReleaseType) => semver.inc(config.version, type)

const types: semver.ReleaseType[] = ['patch', 'minor', 'major']

const options = types.map((type) => ({
  name: `${type}(${inc(type)})`,
  value: type,
}))

const releaseType = await Select.prompt({
  message: 'Please select release type',
  options: options,
})

const releaseVersion = inc(releaseType as semver.ReleaseType)

await run(
  'yarn',
  'version',
  `--${releaseType}`,
  '--message',
  `chore: release ${releaseVersion}`,
)

await run('git', 'push')
await run('git', 'push', '--tags')
