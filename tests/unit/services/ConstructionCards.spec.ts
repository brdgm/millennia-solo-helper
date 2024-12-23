import ConstructionCards from '@/services/ConstructionCards'
import { expect } from 'chai'

describe('services/ConstructionCards', () => {
  it('get', () => {
    const card = ConstructionCards.get(1)

    expect(card).to.not.undefined
    expect(card?.id).to.eq(1)
  })

  it('getAll', () => {
    expect(ConstructionCards.getAll().length).to.eq(6)
  })
})
