import DraftingPriorityCards from '@/services/DraftingPriorityCards'
import { expect } from 'chai'

describe('services/DraftingPriorityCards', () => {
  it('get', () => {
    const card = DraftingPriorityCards.get(1)

    expect(card).to.not.undefined
    expect(card?.id).to.eq(1)
  })

  it('getAll', () => {
    expect(DraftingPriorityCards.getAll().length).to.eq(8)
  })
})
