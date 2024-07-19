import { getTypePackageName } from './node'

describe('get package type name', () => {
  it('should get package type name', () => {
    expect(getTypePackageName('lodash')).toBe('@types/lodash')
    expect(getTypePackageName('lodash@version')).toBe('@types/lodash')

    expect(getTypePackageName('@babel/core')).toBe('@types/babel__core')
    expect(getTypePackageName('@babel/core@latest')).toBe('@types/babel__core')
  })
})
