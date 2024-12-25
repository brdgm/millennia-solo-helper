import { BotCardsPersistence } from '@/store/state'
import CardDeck from './CardDeck'
import DraftingRowCard from './DraftingRowCard'
import DraftingPriorityCard from './DraftingPriorityCard'
import ConstructionCard from './ConstructionCard'
import WarCard from './WarCard'
import DifficultyLevel from './enum/DifficultyLevel'
import DraftingRowCards from './DraftingRowCards'
import DraftingPriorityCards from './DraftingPriorityCards'
import ConstructionCards from './ConstructionCards'
import WarCards from './WarCards'

/**
 * Manages the Automa card decks.
 */
export default class BotCards {

  public readonly draftingRow : CardDeck<DraftingRowCard>
  public readonly draftingPriority : CardDeck<DraftingPriorityCard>
  public readonly construction : CardDeck<ConstructionCard>
  public readonly war : CardDeck<WarCard>

  private constructor(draftingRow : CardDeck<DraftingRowCard>, draftingPriority : CardDeck<DraftingPriorityCard>,
      construction : CardDeck<ConstructionCard>, war : CardDeck<WarCard>) {
    this.draftingRow = draftingRow
    this.draftingPriority = draftingPriority
    this.construction = construction
    this.war = war
  }

  /**
   * Reshuffle all decks except the war deck.
   */
  public prepareForNextRound() : void {
    this.draftingRow.shuffle()
    this.draftingPriority.shuffle()
    this.construction.shuffle()
  }

  /**
   * Gets persistence view.
   */
  public toPersistence() : BotCardsPersistence {
    return {
      draftingRow: this.draftingRow.toPersistence(),
      draftingPriority: this.draftingPriority.toPersistence(),
      construction: this.construction.toPersistence(),
      war: this.war.toPersistence()
    }
  }

  /**
   * Creates shuffled new card decks.
   * @param difficultyLevel DifficultyLevel
   */
  public static new(difficultyLevel: DifficultyLevel) : BotCards {
    const draftingRow = CardDeck.new(DraftingRowCards.getAll())
    const draftingPriority = CardDeck.new(DraftingPriorityCards.getAll())
    const construction = CardDeck.new(ConstructionCards.getAll())

    // prepare war deck based on difficulty level
    const warCards = WarCards.getAll()
      .filter(card => difficultyLevel == DifficultyLevel.HARD || card.warAdvance < 5)
    const war = CardDeck.new(warCards)

    return new BotCards(draftingRow, draftingPriority, construction, war)
  }

  /**
   * Re-creates card deck from persistence.
   */
  public static fromPersistence(persistence : BotCardsPersistence) : BotCards {
    return new BotCards(
      CardDeck.fromPersistence(persistence.draftingRow, DraftingRowCards.get),
      CardDeck.fromPersistence(persistence.draftingPriority, DraftingPriorityCards.get),
      CardDeck.fromPersistence(persistence.construction, ConstructionCards.get),
      CardDeck.fromPersistence(persistence.war, WarCards.get)
    )
  }

}
