import { expect } from 'chai'
import ProsperityCards from '@/services/ProsperityCards'
import Tech from '@/services/enum/Tech'

describe('services/ProsperityCards', () => {
  it('new', () => {
    const prosperityCards = ProsperityCards.new()

    expect(prosperityCards.pile.length).to.eq(10)
    expect(prosperityCards.current.length).to.eq(2)
    expect(prosperityCards.discard.length).to.eq(0)

    const persistence = prosperityCards.toPersistence()
    expect(persistence.pile.length).to.eq(10)
    expect(persistence.current.length).to.eq(2)
    expect(persistence.discard.length).to.eq(0)
  })

  it('fromPersistence', () => {
    const botCards = ProsperityCards.fromPersistence({
      pile: [
        Tech.COMMUNICATION, Tech.ECONOMICS,
        Tech.ENERGY, Tech.ENGINEERING,
        Tech.GOVERNMENT, Tech.MEDICINE,
        Tech.SCIENCE, Tech.SOCIAL_SCIENCE,
        Tech.TRANSPORTATION, Tech.ARTS
      ],
      current: [
        [Tech.ARMY, Tech.MILITARY],
        [Tech.WEAPONRY, Tech.AGRICULTURE]
      ],
      discard: []
    })
    expect(botCards.current).to.eql([[Tech.ARMY, Tech.MILITARY], [Tech.WEAPONRY, Tech.AGRICULTURE]])

    botCards.prepareForNextRound()
    expect(botCards.current).to.eql([[Tech.COMMUNICATION, Tech.ECONOMICS], [Tech.ENERGY, Tech.ENGINEERING]])

    botCards.prepareForNextRound()
    expect(botCards.current).to.eql([[Tech.GOVERNMENT, Tech.MEDICINE], [Tech.SCIENCE, Tech.SOCIAL_SCIENCE]])

    botCards.prepareForNextRound()
    const currentAll = botCards.current.flat()
    expect(currentAll.length).to.eq(4)
    expect(currentAll).to.include(Tech.TRANSPORTATION)
    expect(currentAll).to.include(Tech.ARTS)
  })
})
