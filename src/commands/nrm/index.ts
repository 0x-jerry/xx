import * as colors from 'https://deno.land/std@0.101.0/fmt/colors.ts'
import { Confirm } from 'https://deno.land/x/cliffy@v0.19.2/prompt/confirm.ts'
import { npm } from './npm.ts'
import { yarn } from './yarn.ts'
import { RegistryManager } from './base.ts'
import { printTable } from './print.ts'
import { conf, NRMConfig, RegistryConfig } from './conf.ts'

export type NodeRegistryType = 'npm' | 'yarn'

const managers: Record<string, RegistryManager> = {
  npm,
  yarn,
}

async function _printRegistry(registries: NRMConfig['registries']) {
  const table: string[][] = []

  const used: { type: string; registry: string }[] = []

  for (const key in managers) {
    const manager = managers[key]
    used.push({
      type: key,
      registry: await manager.getConfig('registry'),
    })
  }

  table.push(['*', 'Name', 'Registry', 'Home url', 'Used by'])

  for (const key in registries) {
    const registryConf = registries[key]

    const usedBy = used
      .filter(
        (u) =>
          u.registry.replace(/\/$/, '') ===
          registryConf.registry.replace(/\/$/, ''),
      )
      .map((u) => u.type)
      .join(', ')

    table.push([
      usedBy ? '*' : '',
      key,
      registryConf.registry,
      registryConf.home || '',
      usedBy,
    ])
  }

  printTable(table)
}

export async function useRegistry(
  registryName: string,
  manager?: NodeRegistryType,
) {
  const registryConf = conf.registries[registryName]

  if (!registryConf) {
    console.log(`Not found registry named [${colors.yellow(registryName)}]!\n`)
    _printRegistry(conf.registries)
    return
  }

  if (manager) {
    await managers[manager].setConfig('registry', registryConf.registry)
    console.log(
      `Set registry(${colors.yellow(registryName)}) for [${colors.green(
        manager,
      )}] successful!`,
    )
    return
  }

  for (const key in managers) {
    const manager = managers[key]
    await manager.setConfig('registry', registryConf.registry)
  }

  console.log(
    `Set registry(${colors.yellow(
      `${registryName} - ${registryConf.registry}`,
    )}) for` +
      ` [${colors.green(Object.keys(managers).join(', '))}] successful!`,
  )
}

export async function setRegistry(
  name: string,
  registry: RegistryConfig,
  force = false,
) {
  const existConf = conf.registries[name]

  if (existConf) {
    if (!force) {
      const isOverride = await Confirm.prompt({
        message: `Found exist registry [${colors.yellow(name)}], override it ?`,
        default: true,
      })

      if (!isOverride) {
        return
      }
    }

    conf.registries[name] = registry

    console.log(
      `Update registry [${colors.yellow(name)}](${colors.green(
        registry.registry,
      )}) successful.`,
    )
    return
  }

  conf.registries[name] = registry

  console.log(
    `Add registry [${colors.yellow(name)}](${colors.green(
      registry.registry,
    )}) successful.`,
  )
}

export function removeRegistry(name: string) {
  const exist = conf.registries[name]

  if (!exist) {
    console.log(`Not found registry for [${colors.yellow(name)}].\n`)
    printRegistry()
    return
  }

  delete conf.registries[name]
  console.log(
    `Delete registry [${colors.yellow(name)}](${colors.green(
      exist.registry,
    )}) successful.`,
  )
}

export function printRegistry() {
  _printRegistry(conf.registries)
}

if (import.meta.main) {
  // use('taobao')
}
