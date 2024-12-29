import { Round, State } from '@/store/state'
import { RouteLocation } from 'vue-router'
import getIntRouteParam from '@brdgm/brdgm-commons/src/util/router/getIntRouteParam'
import Player from '@/services/enum/Player'
import ProsperityCards from '@/services/ProsperityCards'
import BotCards from '@/services/BotCards'
import RowPlaceholders from '@/services/RowPlaceholders'
import TechCardSelection from '@/services/TechCardSelection'

export default class NavigationState {

  readonly round : number
  readonly prosperityCards : ProsperityCards
  readonly botCards : BotCards
  readonly rowPlaceholders : RowPlaceholders
  readonly techCardSelection : TechCardSelection

  private readonly roundData : Round

  constructor(route: RouteLocation, state: State) {    
    this.round = getIntRouteParam(route, 'round')

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
        techCardSelection: TechCardSelection.new(rowPlaceholders.rows, this.round).toPersistence()
      }
    }
    this.roundData = roundData
    this.prosperityCards = ProsperityCards.fromPersistence(roundData.prosperityCards)
    this.botCards = BotCards.fromPersistence(roundData.botCards)
    this.rowPlaceholders = RowPlaceholders.fromPersistence(roundData.rowPlaceholders)
    this.techCardSelection = TechCardSelection.fromPersistence(roundData.techCardSelection, this.round)
  }

  public get startPlayer() : Player {
    return this.roundData.nextStartPlayer ?? this.roundData.startPlayer
  }

  public get architectPlayer() : Player {
    return this.roundData.nextArchitectPlayer ?? this.roundData.architectPlayer
  }

}
