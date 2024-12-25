import { expect } from 'chai'
import Tech from '@/services/enum/Tech'
import TechCardSelection from '@/services/TechCardSelection'
import TechPlaceholder from '@/services/enum/TechPlaceholder'
import DraftingRowCards from '@/services/DraftingRowCards'
import DraftingPriorityCards from '@/services/DraftingPriorityCards'

describe('services/TechCardSelection', () => {
  it('new', () => {
    const techCardSelection = TechCardSelection.new([1,4], 1)

    expect(techCardSelection.techs.length).to.eq(4)
    expect(techCardSelection.techs.flat().length).to.eq(16)

    const persistence = techCardSelection.toPersistence()
    expect(persistence.techs.length).to.eq(4)
    expect(persistence.techs.flat().length).to.eq(16)
  })

  it('remove', () => {
    const techCardSelection = TechCardSelection.fromPersistence({
      techs: [
        [Tech.COMMUNICATION, Tech.ECONOMICS, Tech.ENERGY, Tech.ENGINEERING],
        [Tech.GOVERNMENT, Tech.MEDICINE, Tech.SCIENCE, TechPlaceholder.PLACEHOLDER],
        [Tech.SOCIAL_SCIENCE, Tech.TRANSPORTATION, Tech.ARTS, TechPlaceholder.PLACEHOLDER],
        [Tech.ARMY, Tech.MILITARY, Tech.WEAPONRY, Tech.AGRICULTURE]
      ]
    }, 1)
    expect(techCardSelection.techs.flat().length).to.eq(16)

    techCardSelection.remove(Tech.TRANSPORTATION)
    expect(techCardSelection.techs.flat().length).to.eq(16)
    expect(techCardSelection.techs[2]).to.eql([Tech.SOCIAL_SCIENCE, TechPlaceholder.EMPTY, Tech.ARTS, TechPlaceholder.PLACEHOLDER])
  })

  it('determineTech', () => {
    const techCardSelection = TechCardSelection.fromPersistence({
      techs: [
        [Tech.WEAPONRY, TechPlaceholder.EMPTY, TechPlaceholder.EMPTY, Tech.ENGINEERING],
        [Tech.GOVERNMENT, Tech.MEDICINE, Tech.SCIENCE, TechPlaceholder.PLACEHOLDER],
        [Tech.SOCIAL_SCIENCE, Tech.TRANSPORTATION, Tech.ARTS, TechPlaceholder.PLACEHOLDER],
        [Tech.ARMY, Tech.MILITARY, Tech.AGRICULTURE, Tech.COMMUNICATION]
      ]
    }, 2)
    const prosperityTechs = [Tech.ECONOMICS, Tech.MEDICINE, Tech.SCIENCE, Tech.TRANSPORTATION]

    // rows [4,3,2,1] priority [MAX_AGE, PROSPERITY,ENGINEERING,ARMY] columns [1,2,3,4]
    expect(techCardSelection.determineTech(DraftingRowCards.get(1), DraftingPriorityCards.get(1), prosperityTechs)).to.eq(Tech.AGRICULTURE)

    // rows [1,4,3,2], priority [PROSPERITY,ENGINEERING,COMMUNICATION,MAX_AGE] columns [1,2,4,3]
    expect(techCardSelection.determineTech(DraftingRowCards.get(2), DraftingPriorityCards.get(3), prosperityTechs)).to.eq(Tech.COMMUNICATION)

    // rows [2,1,4,3], priority [PROSPERITY,ENGINEERING,COMMUNICATION,MAX_AGE] columns [1,3,2,4]
    expect(techCardSelection.determineTech(DraftingRowCards.get(3), DraftingPriorityCards.get(3), prosperityTechs)).to.eq(Tech.SCIENCE)
  })
})
