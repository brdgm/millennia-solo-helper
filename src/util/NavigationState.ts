import { Round, State, TechCardSelectionPersistence, TechDraftStep } from '@/store/state'
import { RouteLocation } from 'vue-router'
import getIntRouteParam from '@brdgm/brdgm-commons/src/util/router/getIntRouteParam'
import Player from '@/services/enum/Player'
import ProsperityCards from '@/services/ProsperityCards'
import BotCards from '@/services/BotCards'
import RowPlaceholders from '@/services/RowPlaceholders'
import TechCardSelection from '@/services/TechCardSelection'

export default class NavigationState {

  readonly round : number
  readonly draftingStep: number
  readonly prosperityCards : ProsperityCards
  readonly botCards : BotCards
  readonly rowPlaceholders : RowPlaceholders
  readonly techCardSelection : TechCardSelection

  private readonly roundData : Round
  readonly lastDraftStep? : TechDraftStep

  constructor(route: RouteLocation, state: State) {    
    this.round = getIntRouteParam(route, 'round')
    this.draftingStep = getIntRouteParam(route, 'step')

    let roundData = state.rounds.find(item => item.round === this.round)
    if (!roundData) {
      // should never happen
      const rowPlaceholders = RowPlaceholders.new()
      roundData = {
        round: this.round,
        startPlayer: Player.PLAYER,
        architectPlayer: Player.BOT,
        prosperityCards: ProsperityCards.new().toPersistence(),
        botCards: BotCards.new(state.setup.difficultyLevel).toPersistence(),
        rowPlaceholders: rowPlaceholders.toPersistence(),
      }
    }
    this.roundData = roundData
    this.lastDraftStep = this.getLastDraftStep()
    this.prosperityCards = ProsperityCards.fromPersistence(roundData.prosperityCards)
    this.botCards = BotCards.fromPersistence(roundData.botCards)
    this.rowPlaceholders = RowPlaceholders.fromPersistence(roundData.rowPlaceholders)
    this.techCardSelection = TechCardSelection.fromPersistence(this.getTechCardSelectionPersistence(), this.round)
  }

  public get startPlayer() : Player {
    return this.lastDraftStep?.nextStartPlayer ?? this.roundData.nextStartPlayer ?? this.roundData.startPlayer
  }

  public get architectPlayer() : Player {
    return this.lastDraftStep?.nextArchitectPlayer ?? this.roundData.nextArchitectPlayer ?? this.roundData.architectPlayer
  }

  private getLastDraftStep() : TechDraftStep | undefined {
    const techDraftSteps = (this.roundData.techDraftSteps?.toSorted((a, b) => a.step - b.step) ?? [])
        .filter(item => item.step < this.draftingStep || this.draftingStep == 0)
    return techDraftSteps[techDraftSteps.length - 1]
  }

  private getTechCardSelectionPersistence() : TechCardSelectionPersistence {
    if (this.lastDraftStep?.techCardSelection) {
      return this.lastDraftStep?.techCardSelection
    }
    if (this.roundData.initialTechCardSelection) {
      return this.roundData.initialTechCardSelection
    }
    if (this.roundData.techCardSelection) {
      // backward compatibility with old implementation; reset selection to restart draft
      return { techs: this.roundData.techCardSelection.techs, removedTechs: [] }
    }
    // should never happen
    return TechCardSelection.new(this.rowPlaceholders.rows, this.round).toPersistence()
  }

}
