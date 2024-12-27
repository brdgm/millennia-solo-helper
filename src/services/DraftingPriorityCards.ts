import findMandatory from '@brdgm/brdgm-commons/src/util/map/findMandatory'
import DraftingPriorityCard from './DraftingPriorityCard'
import TechMatch from './enum/TechMatch'
import Tech from './enum/Tech'

/**
 * Drafting priority cards
 */
const cards : DraftingPriorityCard[] = [
  {
    id: 1,
    priority: [TechMatch.MAX_AGE,TechMatch.PROSPERITY,Tech.ENGINEERING,Tech.ARMY]
  },
  {
    id: 2,
    priority: [TechMatch.MAX_AGE,TechMatch.PROSPERITY,Tech.ARMY,Tech.ENGINEERING]
  },
  {
    id: 3,
    priority: [TechMatch.PROSPERITY,Tech.ENGINEERING,Tech.COMMUNICATION,TechMatch.MAX_AGE]
  },
  {
    id: 4,
    priority: [TechMatch.PROSPERITY,TechMatch.MAX_AGE,Tech.ENERGY,Tech.COMMUNICATION]
  },
  {
    id: 5,
    priority: [Tech.ARMY,TechMatch.MAX_AGE,TechMatch.PROSPERITY,Tech.ENGINEERING]
  },
  {
    id: 6,
    priority: [Tech.ENERGY,TechMatch.MAX_AGE,TechMatch.PROSPERITY,Tech.COMMUNICATION]
  },
  {
    id: 7,
    priority: [Tech.ENGINEERING,TechMatch.MAX_AGE,TechMatch.PROSPERITY,Tech.ENERGY]
  },
  {
    id: 8,
    priority: [Tech.COMMUNICATION,TechMatch.PROSPERITY,TechMatch.MAX_AGE,Tech.ENERGY]
  },
]

const cardsMap = new Map<number,DraftingPriorityCard>()
cards.forEach(card => cardsMap.set(card.id, card))

export default {

  /**
   * Get card by ID
   * @param id ID
   * @returns DraftingPriorityCard
   */
  get(id: number) : DraftingPriorityCard {
    return findMandatory(cardsMap, id)
  },

  /**
   * Get all cards
   * @returns DraftingPriorityCards
   */
  getAll() : DraftingPriorityCard[] {
    return cards
  }

}
