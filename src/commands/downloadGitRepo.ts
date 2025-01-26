import { createWriteStream } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import decompress from 'decompress'
import fs from 'fs-extra'
import got from 'got'
import ora from 'ora'
import pc from 'picocolors'
import prompts from 'prompts'

export interface DownloadGitRepoOption {
  destDir: string
  url: string
  branch: string
}

export async function downloadGitRepo(opt: DownloadGitRepoOption) {
  let { url, branch = 'main', destDir } = opt

  if (!url) {
    console.log(pc.red('Please specify git url by using -u,--url'))

    return
  }

  destDir = (await checkDest(destDir)) || ''

  if (!destDir) return

  const gitConf = normalizeGitUrl(url)

  const zipFilePath = await downloadGitBranch(gitConf, branch)

  await fs.ensureDir(destDir)
  await decompress(zipFilePath, destDir, {
    strip: 1,
  })

  await fs.unlink(zipFilePath)
}

interface Progress {
  percent: number
  transferred: number
  total?: number
}

interface GitUrlConfig {
  url: string
  owner: string
  repo: string
}

function normalizeGitUrl(url: string) {
  if (!url.startsWith('http')) {
    url = `https://github.com/${url}`
  }

  const seq = url.split('/')
  const owner = seq.at(-2)!
  const repo = seq.at(-1)!

  const conf: GitUrlConfig = {
    url,
    owner,
    repo,
  }

  return conf
}

async function checkDest(dest?: string) {
  const cwd = process.cwd()

  if (!dest) {
    const res = await prompts({
      type: 'text',
      name: 'dest',
      message: 'Please specify dest folder',
      initial: '.',
    })

    dest = res.dest
  }

  if (!dest) return

  dest = path.isAbsolute(dest) ? dest : path.join(cwd, dest)

  const files = fs.pathExistsSync(dest) ? await fs.readdir(dest) : null

  if (files?.length) {
    const res = await prompts({
      type: 'confirm',
      name: 'override',
      message: `Detect files in ${pc.cyan(dest)}, override it?`,
      initial: false,
    })

    if (!res.override) return
  }

  return dest
}

async function downloadGitBranch(conf: GitUrlConfig, branch: string) {
  // https://github.com/0x-jerry/silver/archive/refs/heads/main.zip
  const downloadUrl = `${conf.url}/archive/refs/heads/${branch}.zip`

  const tempZipFilePath = path.join(
    os.tmpdir(),
    `${conf.owner}-${conf.repo}-${branch}.zip`,
  )

  if (fs.pathExistsSync(tempZipFilePath)) {
    console.log(`Template already downloaded: ${tempZipFilePath}`)
    return tempZipFilePath
  }

  const downloadStream = got.stream(downloadUrl)

  console.log(`Start download ${downloadUrl} to ${tempZipFilePath}`)

  const spinner = ora({
    prefixText: `Downloading ${downloadUrl}`,
  }).start()

  downloadStream.on('downloadProgress', (progress: Progress) => {
    spinner.text = ` (${progress.percent * 100}%)`
  })

  downloadStream.once('error', (e) => {
    spinner.fail(e.message)
  })

  const zipFile = createWriteStream(tempZipFilePath)
  await pipeline(downloadStream, zipFile)
  spinner.succeed('Done')

  return tempZipFilePath
}
