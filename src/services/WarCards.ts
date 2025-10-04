import findMandatory from '@brdgm/brdgm-commons/src/util/map/findMandatory'
import WarCard from './WarCard'

/**
 * Solo cards.
 */
const cards : WarCard[] = [
  {
    id: 1,
    warAdvance: 0
  },
  {
    id: 2,
    warAdvance: 0
  },
  {
    id: 3,
    warAdvance: 1
  },
  {
    id: 4,
    warAdvance: 1
  },
  {
    id: 5,
    warAdvance: 2
  },
  {
    id: 6,
    warAdvance: 2
  },
  {
    id: 7,
    warAdvance: 3
  },
  {
    id: 8,
    warAdvance: 3
  },
  {
    id: 9,
    warAdvance: 4
  },
  {
    id: 10,
    warAdvance: 4
  },
  {
    id: 11,
    warAdvance: 5
  },
  {
    id: 12,
    warAdvance: 5
  },
]

const cardsMap = new Map<number,WarCard>()
for (const card of cards) {
  cardsMap.set(card.id, card)
}

export default {

  /**
   * Get card by ID
   * @param id ID
   * @returns WarCard
   */
  get(id: number) : WarCard {
    return findMandatory(cardsMap, id)
  },

  /**
   * Get all cards
   * @returns WarCards
   */
  getAll() : WarCard[] {
    return cards
  }

}
