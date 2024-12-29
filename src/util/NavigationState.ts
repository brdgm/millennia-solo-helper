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

  private roundData : Round

  constructor(route: RouteLocation, state: State) {    
    this.round = getIntRouteParam(route, 'round')

    const roundData = state.rounds.find(item => item.round === this.round)
    if (!roundData) {
      throw new Error(`Round ${this.round} not found`)
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
