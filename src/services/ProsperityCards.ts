import { ProsperityCardsPersistence } from '@/store/state'
import Tech from './enum/Tech'
import { ref } from 'vue'
import { cloneDeep, shuffle } from 'lodash'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'

/**
 * Manages the prosperity card deck.
 */
export default class ProsperityCards {

  private readonly _pile
  private readonly _current
  private readonly _discard

  private constructor(pile : Tech[], current : Tech[][], discard : Tech[]) {
    this._pile = ref(pile)
    this._current = ref(current)
    this._discard = ref(discard)
  }

  public get pile() : readonly Tech[] {
    return this._pile.value
  }

  public get current() : readonly Tech[][] {
    return this._current.value
  }

  public get discard() : readonly Tech[] {
    return this._discard.value
  }

  /**
   * Prepares next two pars of prosperity cards.
   */
  public prepareForNextRound() : void {
    this._discard.value.push(...this._current.value.flat())

    const candidates = this._pile.value.splice(0, 4)
    if (candidates.length < 4) {
      this._pile.value.push(...this._discard.value)
      this._discard.value = []
      candidates.push(...this._pile.value.splice(0, 4 - candidates.length))
      shuffle(candidates)
    }

    this._current.value = [[candidates[0],candidates[1]],[candidates[2],candidates[3]]]
  }

  /**
   * Gets persistence view.
   */
  public toPersistence() : ProsperityCardsPersistence {
    return {
      pile: this._pile.value,
      current: this._current.value,
      discard: this._discard.value
    }
  }

  /**
   * Creates shuffled new prosperity cards with first two pairs selected.
   */
  public static new() : ProsperityCards {
    const pile = shuffle(getAllEnumValues(Tech))
    const prosperityCards = new ProsperityCards(pile, [], [])
    prosperityCards.prepareForNextRound()
    return prosperityCards
  }

  /**
   * Re-creates from persistence.
   */
  public static fromPersistence(persistence : ProsperityCardsPersistence) : ProsperityCards {
    return new ProsperityCards(
      cloneDeep(persistence.pile),
      cloneDeep(persistence.current),
      cloneDeep(persistence.discard)
    )
  }

}
