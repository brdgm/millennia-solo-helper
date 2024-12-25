import { RouteRecordRaw } from 'vue-router'
import createRouterMatomoTracking from '@brdgm/brdgm-commons/src/util/router/createRouterMatomoTracking'
import { name, version, appDeployName } from '@/../package.json'
import AppHome from '@/views/AppHome.vue'
import NotFound from '@/views/NotFound.vue'
import SetupGame from '@/views/SetupGame.vue'
import SetupBot from '@/views/SetupBot.vue'
import PhaseADrafting from '@/views/PhaseADrafting.vue'
import PhaseBProsperity from '@/views/PhaseBProsperity.vue'
import PhaseCIncome from '@/views/PhaseCIncome.vue'
import PhaseDConstruction from '@/views/PhaseDConstruction.vue'
import PhaseEActions from '@/views/PhaseEActions.vue'
import PhaseFWar from '@/views/PhaseFWar.vue'
import PhaseGUpkeep from '@/views/PhaseGUpkeep.vue'
import EndOfGame from '@/views/EndOfGame.vue'

const LOCALSTORAGE_KEY = `${name}.route`

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'AppHome',
    component: AppHome
  },
  {
    path: '/setupGame',
    name: 'SetupGame',
    component: SetupGame
  },
  {
    path: '/setupBot',
    name: 'SetupBot',
    component: SetupBot
  },
  {
    path: '/round/:round/drafting',
    name: 'PhaseADrafting',
    component: PhaseADrafting
  },
  {
    path: '/round/:round/prosperity',
    name: 'PhaseBProsperity',
    component: PhaseBProsperity
  },
  {
    path: '/round/:round/income',
    name: 'PhaseCIncome',
    component: PhaseCIncome
  },
  {
    path: '/round/:round/construction',
    name: 'PhaseDConstruction',
    component: PhaseDConstruction
  },
  {
    path: '/round/:round/actions',
    name: 'PhaseEActions',
    component: PhaseEActions
  },
  {
    path: '/round/:round/war',
    name: 'PhaseFWar',
    component: PhaseFWar
  },
  {
    path: '/round/:round/upkeep',
    name: 'PhaseGUpkeep',
    component: PhaseGUpkeep
  },
  {
    path: '/endOfGame',
    name: 'EndOfGame',
    component: EndOfGame
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

export default createRouterMatomoTracking(routes, LOCALSTORAGE_KEY, appDeployName, version, 'AppHome')