import findMandatory from '@brdgm/brdgm-commons/src/util/map/findMandatory'
import DraftingRowCard from './DraftingRowCard'

/**
 * Drafting row cards.
 */
const cards : DraftingRowCard[] = [
  {
    id: 1,
    rows: [4,3,2,1],
    columns: [1,2,3,4]
  },
  {
    id: 2,
    rows: [1,4,3,2],
    columns: [1,2,4,3]
  },
  {
    id: 3,
    rows: [2,1,4,3],
    columns: [1,3,2,4]
  },
  {
    id: 4,
    rows: [3,2,1,4],
    columns: [1,4,3,2]
  },
  {
    id: 5,
    rows: [3,2,1,4],
    columns: [2,1,4,3]
  },
  {
    id: 6,
    rows: [4,3,2,1],
    columns: [2,3,4,1]
  },
  {
    id: 7,
    rows: [2,1,4,3],
    columns: [2,4,1,3]
  },
  {
    id: 8,
    rows: [3,2,1,4],
    columns: [3,2,1,4]
  },
  {
    id: 9,
    rows: [3,2,1,4],
    columns: [3,2,4,1]
  },
  {
    id: 10,
    rows: [4,3,2,1],
    columns: [3,4,1,2]
  },
  {
    id: 11,
    rows: [4,3,2,1],
    columns: [4,1,2,3]
  },
  {
    id: 12,
    rows: [2,1,4,3],
    columns: [4,1,3,2]
  },
  {
    id: 13,
    rows: [1,4,3,2],
    columns: [4,3,1,2]
  },
  {
    id: 14,
    rows: [4,3,2,1],
    columns: [4,3,2,1]
  },
]

const cardsMap = new Map<number,DraftingRowCard>()
cards.forEach(card => cardsMap.set(card.id, card))

export default {

  /**
   * Get card by ID
   * @param id ID
   * @returns DraftingRowCard
   */
  get(id: number) : DraftingRowCard {
    return findMandatory(cardsMap, id)
  },

  /**
   * Get all cards
   * @returns DraftingRowCards
   */
  getAll() : DraftingRowCard[] {
    return cards
  }

}
