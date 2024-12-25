import { State } from '@/store/state'
import { RouteLocation } from 'vue-router'
import getIntRouteParam from '@brdgm/brdgm-commons/src/util/router/getIntRouteParam'
import Player from '@/services/enum/Player'
import ProsperityCards from '@/services/ProsperityCards'
import BotCards from '@/services/BotCards'
import RowPlaceholders from '@/services/RowPlaceholders'
import TechCardSelection from '@/services/TechCardSelection'

export default class NavigationState {

  readonly round : number

  readonly startPlayer : Player
  readonly architectPlayer : Player
  readonly prosperityCards : ProsperityCards
  readonly botCards : BotCards
  readonly rowPlaceholders : RowPlaceholders
  readonly techCardSelection : TechCardSelection

  constructor(route: RouteLocation, state: State) {    
    this.round = getIntRouteParam(route, 'round')

    const roundData = state.rounds.find(item => item.round === this.round)
    if (!roundData) {
      throw new Error(`Round ${this.round} not found`)
    }
    this.startPlayer = roundData.startPlayer
    this.architectPlayer = roundData.architectPlayer
    this.prosperityCards = ProsperityCards.fromPersistence(roundData.prosperityCards)
    this.botCards = BotCards.fromPersistence(roundData.botCards)
    this.rowPlaceholders = RowPlaceholders.fromPersistence(roundData.rowPlaceholders)
    this.techCardSelection = TechCardSelection.fromPersistence(roundData.techCardSelection, this.round)
  }

}
