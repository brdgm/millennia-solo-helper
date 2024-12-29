import { expect } from 'chai'
import BotCards from '@/services/BotCards'
import DifficultyLevel from '@/services/enum/DifficultyLevel'

describe('services/BotCards', () => {
  it('new-normal', () => {
    const botCards = BotCards.new(DifficultyLevel.NORMAL)

    expect(botCards.draftingRow.pile.length).to.eq(14)
    expect(botCards.draftingPriority.pile.length).to.eq(8)
    expect(botCards.construction.pile.length).to.eq(6)
    expect(botCards.war.pile.length).to.eq(9)
    expect(botCards.war.discard.length).to.eq(1)
    expect(botCards.war.pile.concat(botCards.war.discard).filter(cards => cards.warAdvance==5).length).to.eq(0)

    const persistence = botCards.toPersistence()
    expect(persistence.draftingRow.pile.length).to.eq(14)
    expect(persistence.draftingPriority.pile.length).to.eq(8)
    expect(persistence.construction.pile.length).to.eq(6)
    expect(persistence.war.pile.length).to.eq(9)
    expect(persistence.war.discard.length).to.eq(1)
  })

  it('new-hard', () => {
    const botCards = BotCards.new(DifficultyLevel.HARD)

    expect(botCards.draftingRow.pile.length).to.eq(14)
    expect(botCards.draftingPriority.pile.length).to.eq(8)
    expect(botCards.construction.pile.length).to.eq(6)
    expect(botCards.war.pile.length).to.eq(11)
    expect(botCards.war.discard.length).to.eq(1)
    expect(botCards.war.pile.concat(botCards.war.discard).filter(cards => cards.warAdvance==5).length).to.eq(2)
  })

  it('prepareForNextRound', () => {
    const botCards = BotCards.fromPersistence({
      draftingRow: {pile: [1,2], discard: [3]},
      draftingPriority: {pile: [2,3,4], discard: [5]},
      construction: {pile: [3,4,5,6], discard: [1]},
      war: {pile: [4,5,6,7,8], discard: [9]}
    })

    expect(botCards.draftingRow.pile.length).to.eq(2)
    expect(botCards.draftingPriority.pile.length).to.eq(3)
    expect(botCards.construction.pile.length).to.eq(4)
    expect(botCards.war.pile.length).to.eq(5)
    expect(botCards.war.discard.length).to.eq(1)

    botCards.prepareForNextRound()

    expect(botCards.draftingRow.pile.length).to.eq(3)
    expect(botCards.draftingPriority.pile.length).to.eq(4)
    expect(botCards.construction.pile.length).to.eq(5)
    expect(botCards.war.pile.length).to.eq(4)
    expect(botCards.war.discard.length).to.eq(2)
  })
})
