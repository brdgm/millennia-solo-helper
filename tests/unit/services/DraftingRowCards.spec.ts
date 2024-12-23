import DraftingRowCards from '@/services/DraftingRowCards'
import { expect } from 'chai'

describe('services/DraftingRowCards', () => {
  it('get', () => {
    const card = DraftingRowCards.get(1)

    expect(card).to.not.undefined
    expect(card?.id).to.eq(1)
  })

  it('getAll', () => {
    expect(DraftingRowCards.getAll().length).to.eq(14)
  })
})
