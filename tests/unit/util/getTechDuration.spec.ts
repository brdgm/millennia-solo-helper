import { expect } from 'chai'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'
import Tech from '@/services/enum/Tech'
import getTechDuration from '@/util/getTechDuration'

describe('util/getTechDuration', () => {
  it('getTechDuration', () => {
    for (const tech of getAllEnumValues(Tech)) {
      for (let age = 1; age<=8; age++) {
        const duration = getTechDuration(tech, age)
        expect(duration).to.greaterThanOrEqual(1)
        expect(duration).to.lessThanOrEqual(3)
        expect(age + duration - 1).to.lessThanOrEqual(8)
      }
    }
  })
})
