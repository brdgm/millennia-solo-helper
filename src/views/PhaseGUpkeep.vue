<template>
  <SideBar :navigationState="navigationState"/>

  <h1 class="mb-3">{{t('phaseGUpkeep.title')}}</h1>

  <p class="mt-4" v-html="t('phaseGUpkeep.skip')"></p>

  <button class="btn btn-primary btn-lg mt-4" @click="next()">
    {{t('action.next')}}
  </button>

  <DebugInfo :navigationState="navigationState"/>

  <FooterButtons :backButtonRouteTo="backButtonRouteTo" endGameButtonType="abortGame"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import FooterButtons from '@/components/structure/FooterButtons.vue'
import { useRoute } from 'vue-router'
import { Round, useStateStore } from '@/store/state'
import SideBar from '@/components/round/SideBar.vue'
import NavigationState from '@/util/NavigationState'
import TechCardSelection from '@/services/TechCardSelection'
import DebugInfo from '@/components/round/DebugInfo.vue'

export default defineComponent({
  name: 'PhaseGUpkeep',
  components: {
    FooterButtons,
    SideBar,
    DebugInfo
  },
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const state = useStateStore()

    const navigationState = new NavigationState(route, state)
    const { round } = navigationState

    return { t, state, navigationState, round }
  },
  computed: {
    backButtonRouteTo() : string {
      return `/round/${this.round}/war`
    }
  },
  methods: {
    next() : void {
      const nextRound = this.round + 1
      const { startPlayer, architectPlayer, prosperityCards, botCards, rowPlaceholders } = this.navigationState
      prosperityCards.prepareForNextRound()
      botCards.prepareForNextRound()
      rowPlaceholders.prepareForNextRound()
      const round : Round = {
        round: nextRound,
        startPlayer,
        architectPlayer,
        prosperityCards: prosperityCards.toPersistence(),
        botCards: botCards.toPersistence(),
        rowPlaceholders: rowPlaceholders.toPersistence(),
        techCardSelection: TechCardSelection.new(rowPlaceholders.rows, nextRound).toPersistence()
      }
      this.state.storeRound(round)
      this.$router.push(`/round/${nextRound}/drafting`)
    }
  }
})
</script>
