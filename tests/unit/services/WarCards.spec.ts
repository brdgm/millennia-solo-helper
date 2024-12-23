import WarCards from '@/services/WarCards'
import { expect } from 'chai'

describe('services/WarCards', () => {
  it('get', () => {
    const card = WarCards.get(1)

    expect(card).to.not.undefined
    expect(card?.id).to.eq(1)
  })

  it('getAll', () => {
    expect(WarCards.getAll().length).to.eq(12)
  })
})
