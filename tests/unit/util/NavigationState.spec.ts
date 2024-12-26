import NavigationState from '@/util/NavigationState'
import { expect } from 'chai'
import mockRouteLocation from '../helper/mockRouteLocation'
import mockState from '../helper/mockState'
import mockRound from '../helper/mockRound'
import Player from '@/services/enum/Player'

describe('util/NavigationState', () => {
  it('roundTurn', () => {
    const route = mockRouteLocation({params:{round:'1',turn:'3'}})
    const state = mockState({startPlayer:Player.BOT,rounds:[
      mockRound({round:1,startPlayer:Player.BOT,architectPlayer:Player.PLAYER}),
    ]})
    const navigationState = new NavigationState(route, state)

    expect(navigationState.round).to.eq(1)
    expect(navigationState.startPlayer).to.eq(Player.BOT)
    expect(navigationState.architectPlayer).to.eq(Player.PLAYER)
  })

  it('nextStartArchitectPlayer', () => {
    const route = mockRouteLocation({params:{round:'1',turn:'3'}})
    const state = mockState({startPlayer:Player.BOT,rounds:[
      mockRound({round:1,startPlayer:Player.BOT,architectPlayer:Player.PLAYER,
        nextStartPlayer:Player.PLAYER,nextArchitectPlayer:Player.BOT}),
    ]})
    const navigationState = new NavigationState(route, state)

    expect(navigationState.round).to.eq(1)
    expect(navigationState.startPlayer).to.eq(Player.PLAYER)
    expect(navigationState.architectPlayer).to.eq(Player.BOT)
  })
})
