import { yellow, green } from 'std/fmt/colors.ts'
import { Confirm } from 'cliffy/prompt/confirm.ts'
import { npm } from './npm.ts'
import { yarn } from './yarn.ts'
import { RegistryManager } from './RegistryManager.ts'
import { printTable } from './print.ts'
import { conf, NRMConfig, RegistryConfig } from './conf.ts'

export type NodeRegistryType = 'npm' | 'yarn'

export const nrmConf = conf

const managers: Record<string, RegistryManager> = {
  npm,
  yarn,
}

async function _printRegistry(registries: NRMConfig['registries']) {
  const table: string[][] = []

  const used: { type: string; registry: string }[] = []

  const p = Object.keys(managers).map(async (key) => {
    const manager = managers[key]
    used.push({
      type: key,
      registry: await manager.getConfig('registry'),
    })
  })

  await Promise.all(p)

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
    console.log(`Not found registry named [${yellow(registryName)}]!\n`)
    _printRegistry(conf.registries)
    return
  }

  if (manager) {
    await managers[manager].setConfig('registry', registryConf.registry)
    console.log(
      `Set registry(${yellow(registryName)}) for [${green(
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
    `Set registry(${yellow(
      `${registryName} - ${registryConf.registry}`,
    )}) for` + ` [${green(Object.keys(managers).join(', '))}] successful!`,
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
        message: `Found exist registry [${yellow(name)}], override it ?`,
        default: true,
      })

      if (!isOverride) {
        return
      }
    }

    conf.registries[name] = registry

    console.log(
      `Update registry [${yellow(name)}](${green(
        registry.registry,
      )}) successful.`,
    )
    return
  }

  conf.registries[name] = registry

  console.log(
    `Add registry [${yellow(name)}](${green(registry.registry)}) successful.`,
  )
}

export function removeRegistry(name: string) {
  const exist = conf.registries[name]

  if (!exist) {
    console.log(`Not found registry for [${yellow(name)}].\n`)
    printRegistry()
    return
  }

  delete conf.registries[name]
  console.log(
    `Delete registry [${yellow(name)}](${green(exist.registry)}) successful.`,
  )
}

export function printRegistry() {
  _printRegistry(conf.registries)
}

if (import.meta.main) {
  // use('taobao')
}
