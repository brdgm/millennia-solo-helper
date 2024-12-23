import NavigationState from '@/util/NavigationState'
import { expect } from 'chai'
import mockRouteLocation from '../helper/mockRouteLocation'
import mockState from '../helper/mockState'

describe('util/NavigationState', () => {
  it('round-turn', () => {
    const route = mockRouteLocation({params:{round:'1',turn:'3'}})
    const state = mockState()
    const navigationState = new NavigationState(route, state)

    expect(navigationState.round).to.eq(1)
    expect(navigationState.turn).to.eq(3)
  })
})
