import { flagOptionToStringArray } from './utils'

describe('utils', () => {
  it('#flagOptionToStringArray', () => {
    expect(flagOptionToStringArray({ a: 1 })).toEqual(['-a', '1'])

    expect(flagOptionToStringArray({ b: true })).toEqual(['-b'])

    expect(flagOptionToStringArray({ c: 'ss' })).toEqual(['-c', 'ss'])

    expect(flagOptionToStringArray({ aa: 1, bb: true, cc: 'ss' })).toEqual([
      '--aa',
      '1',
      '--bb',
      '--cc',
      'ss',
    ])
  })
})
