<template>
  <SideBar :navigationState="navigationState"/>

  <h1 class="mb-3">{{t('phaseBProsperity.title')}}</h1>

  <p class="mt-4" v-html="t('phaseBProsperity.skip')"></p>

  <div v-if="playerTechs.length > 0" class="mt-3">
    <TechCardsPlayerDraft :navigationState="navigationState" :playerTechs="playerTechs"/>
  </div>

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
import DebugInfo from '@/components/round/DebugInfo.vue'
import TechCardsPlayerDraft from '@/components/round/TechCardsPlayerDraft.vue'
import Tech from '@/services/enum/Tech'

export default defineComponent({
  name: 'PhaseBProsperity',
  components: {
    FooterButtons,
    SideBar,
    TechCardsPlayerDraft,
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
      return `/round/${this.round}/drafting`
    },
    roundData() : Round|undefined {
      return this.state.rounds.find(item => item.round == this.navigationState.round)
    },
    playerTechs() : Tech[] {
      return this.roundData?.playerTechs ?? []
    }
  },
  methods: {
    next() : void {
      this.$router.push(`/round/${this.round}/income`)
    }
  }
})
</script>
