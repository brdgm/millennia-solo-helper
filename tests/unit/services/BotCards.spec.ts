import { expect } from 'chai'
import BotCards from '@/services/BotCards'
import DifficultyLevel from '@/services/enum/DifficultyLevel'

describe('services/BotCards', () => {
  it('new-normal', () => {
    const botCards = BotCards.new(DifficultyLevel.NORMAL)

    expect(botCards.draftingRow.pile.length).to.eq(14)
    expect(botCards.draftingPriority.pile.length).to.eq(8)
    expect(botCards.construction.pile.length).to.eq(6)
    expect(botCards.war.pile.length).to.eq(10)
    expect(botCards.war.pile.filter(cards => cards.warAdvance==5).length).to.eq(0)

    const persistence = botCards.toPersistence()
    expect(persistence.draftingRow.pile.length).to.eq(14)
    expect(persistence.draftingPriority.pile.length).to.eq(8)
    expect(persistence.construction.pile.length).to.eq(6)
    expect(persistence.war.pile.length).to.eq(10)
  })

  it('new-hard', () => {
    const botCards = BotCards.new(DifficultyLevel.HARD)

    expect(botCards.draftingRow.pile.length).to.eq(14)
    expect(botCards.draftingPriority.pile.length).to.eq(8)
    expect(botCards.construction.pile.length).to.eq(6)
    expect(botCards.war.pile.length).to.eq(12)
    expect(botCards.war.pile.filter(cards => cards.warAdvance==5).length).to.eq(2)
  })

  it('fromPersistence', () => {
    const botCards = BotCards.fromPersistence({
      draftingRow: {pile: [1,2], discard: []},
      draftingPriority: {pile: [2,3,4], discard: []},
      construction: {pile: [3,4,5,6], discard: []},
      war: {pile: [4,5,6,7,8], discard: []}
    })

    expect(botCards.draftingRow.pile.length).to.eq(2)
    expect(botCards.draftingPriority.pile.length).to.eq(3)
    expect(botCards.construction.pile.length).to.eq(4)
    expect(botCards.war.pile.length).to.eq(5)
  })
})
