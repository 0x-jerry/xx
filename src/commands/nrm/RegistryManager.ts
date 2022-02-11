export abstract class RegistryManager {
  protected abstract checkIsExist(): Promise<boolean>

  abstract setConfig(key: string, value: string): Promise<boolean>
  abstract getConfig(key: string): Promise<string>
  abstract getVersion(): Promise<string>

  private _isExist?: boolean

  async isExist(): Promise<boolean> {
    this._isExist = this._isExist ?? (await this.checkIsExist())

    return this._isExist
  }
}
