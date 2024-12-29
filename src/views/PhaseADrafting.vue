<template>
  <SideBar :navigationState="navigationState"/>

  <h1 class="mb-3">{{t('phaseADrafting.title')}}</h1>

  <TechCardDraft :navigationState="navigationState" :nextButtonRouteTo="nextButtonRouteTo"/>

  <DebugInfo :navigationState="navigationState"/>

  <FooterButtons :backButtonRouteTo="backButtonRouteTo" endGameButtonType="abortGame"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import FooterButtons from '@/components/structure/FooterButtons.vue'
import { useRoute } from 'vue-router'
import { useStateStore } from '@/store/state'
import SideBar from '@/components/round/SideBar.vue'
import NavigationState from '@/util/NavigationState'
import TechCardDraft from '@/components/round/TechCardDraft.vue'
import DebugInfo from '@/components/round/DebugInfo.vue'

export default defineComponent({
  name: 'PhaseADrafting',
  components: {
    FooterButtons,
    SideBar,
    TechCardDraft,
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
    nextButtonRouteTo() : string {
      return `/round/${this.round}/prosperity`
    },
    backButtonRouteTo() : string {
      if (this.round > 1) {
        return `/round/${this.round-1}/upkeep`
      }
      return ''
    }
  }
})
</script>
