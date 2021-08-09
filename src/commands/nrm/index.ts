import * as colors from 'https://deno.land/std@0.101.0/fmt/colors.ts'
import { npm } from './npm.ts'
import { yarn } from './yarn.ts'
import { RegistryManager } from './base.ts'
import { printTable } from './print.ts'
import { conf, NRMConfig } from './conf.ts'

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

export function use(registryName: string, manager?: NodeRegistryType) {
  const registryConf = conf.registries[registryName]

  if (!registryConf) {
    console.log(`Not found registry named [${colors.yellow(registryName)}]!\n`)
    _printRegistry(conf.registries)
    return
  }

  if (manager) {
    managers[manager].setConfig('registry', registryConf.registry)
    console.log(
      `Set registry(${colors.yellow(registryName)}) for [${colors.green(
        manager,
      )}] successful!`,
    )
    return
  }

  for (const key in managers) {
    const manager = managers[key]
    manager.setConfig('registry', registryConf.registry)
  }

  console.log(
    `Set registry(${colors.yellow(
      `${registryName} - ${registryConf.registry}`,
    )}) for` +
      ` [${colors.green(Object.keys(managers).join(', '))}] successful!`,
  )
}

if (import.meta.main) {
  // use('taobao')
}
