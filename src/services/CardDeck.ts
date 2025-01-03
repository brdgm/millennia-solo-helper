import { shuffle } from 'lodash'
import { CardDeckPersistence } from '@/store/state'
import { ref } from 'vue'
import Card from './Card'

/**
 * Manages the Automa cards.
 */
export default class CardDeck<T extends Card> {

  private readonly _pile
  private readonly _discard
  private readonly _initialPile : T[]
  private readonly _initialDiscard : T[]

  private constructor(pile : T[], discard : T[]) {
    this._pile = ref(pile)
    this._discard = ref(discard)
    this._initialPile = [...pile]
    this._initialDiscard = [...discard]
  }

  public get currentCard() : T|undefined {
    return this._discard.value[0] as T|undefined
  }

  public get pile() : readonly T[] {
    return this._pile.value as T[]
  }

  public get discard() : readonly T[] {
    return this._discard.value as T[]
  }

  /**
   * Draws next card.
   * If not sufficient cards are left, the discard pile is shuffled back into the pile.
   * @returns Next action card
   */
  public draw() : T {
    if (this._pile.value.length === 0) {
      this.shuffle()
    }
    const card = this._pile.value.shift()
    if (!card) {
      throw new Error('Pile is empty.')
    }
    this._discard.value.unshift(card)
    return card as T
  }

  /**
   * Shuffles the discard pile back into the pile.
   */
  public shuffle() : void {
    const allCards = this._pile.value.concat(this._discard.value)
    this._pile.value = shuffle(allCards)
    this._discard.value = []
  }

  /**
   * Reset card deck to initial state.
   */
  public reset() : void {
    this._pile.value = [...this._initialPile]
    this._discard.value = [...this._initialDiscard]
  }

  /**
   * Gets persistence view of card deck.
   */
  public toPersistence() : CardDeckPersistence {
    return {
      pile: this._pile.value.map(card => card.id),
      discard: this._discard.value.map(card => card.id),
    }
  }

  /**
   * Creates a shuffled new card deck.
   */
  public static new<T extends Card>(allCards : T[]) : CardDeck<T> {
    const cards = shuffle(allCards)
    return new CardDeck<T>(cards, [])
  }

  /**
   * Re-creates card deck from persistence.
   */
  public static fromPersistence<T extends Card>(persistence : CardDeckPersistence, getter : (id: number) => T) : CardDeck<T> {
    return new CardDeck(
      persistence.pile.map(getter),
      persistence.discard.map(getter)
    )
  }

}
