import findMandatory from '@brdgm/brdgm-commons/src/util/map/findMandatory'
import ConstructionCard from './ConstructionCard'

/**
 * Solo cards.
 */
const cards : ConstructionCard[] = [
  {
    id: 1,
    wonderBuildingIndex: 1
  },
  {
    id: 2,
    wonderBuildingIndex: 2
  },
  {
    id: 3,
    wonderBuildingIndex: 3
  },
  {
    id: 4,
    wonderBuildingIndex: 4
  },
  {
    id: 5,
    wonderBuildingIndex: 5
  },
  {
    id: 6,
    wonderBuildingIndex: 6
  },
]

const cardsMap = new Map<number,ConstructionCard>()
cards.forEach(card => cardsMap.set(card.id, card))

export default {

  /**
   * Get card by ID
   * @param id ID
   * @returns ConstructionCard
   */
  get(id: number) : ConstructionCard {
    return findMandatory(cardsMap, id)
  },

  /**
   * Get all cards
   * @returns ConstructionCards
   */
  getAll() : ConstructionCard[] {
    return cards
  }

}
