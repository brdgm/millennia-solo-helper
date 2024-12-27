import { expect } from 'chai'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'
import Tech from '@/services/enum/Tech'
import getTechDuration from '@/util/getTechDuration'

describe('util/getTechDuration', () => {
  it('getTechDuration', () => {
    for (const tech of getAllEnumValues(Tech)) {
      for (let round = 1; round<=8; round++) {
        const duration = getTechDuration(tech, round)
        expect(duration).to.greaterThanOrEqual(1)
        expect(duration).to.lessThanOrEqual(3)
        expect(round + duration - 1).to.lessThanOrEqual(8)
      }
    }
  })
})
