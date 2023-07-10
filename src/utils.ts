import { execa } from 'execa'
import { type PathLike } from 'fs'
import { stat } from 'fs/promises'
import pc from 'picocolors'

export async function run(
  cmd: string,
  env?: Record<string, string | undefined>,
) {
  console.log(pc.dim('$'), pc.dim(cmd))

  try {
    await execa('sh', ['-c', cmd], { stdio: 'inherit', env })
  } catch (error) {
    // ignore error and exist
    process.exit(1)
  }
}

export async function exec(
  script: string,
  params: string[],
  env?: Record<string, string | undefined>,
) {
  const cmd = [script, ...params].join(' ')

  await run(cmd, env)
}

export async function exists(path: PathLike) {
  try {
    await stat(path)
    return true
  } catch (error) {
    return false
  }
}
