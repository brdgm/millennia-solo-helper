import { expect } from 'chai'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'
import Tech from '@/services/enum/Tech'
import getTechColor from '@/util/getTechColor'

describe('util/getTechColor', () => {
  it('getTechColor', () => {
    for (const tech of getAllEnumValues(Tech)) {
      expect(getTechColor(tech)).to.not.undefined
    }
  })
})
