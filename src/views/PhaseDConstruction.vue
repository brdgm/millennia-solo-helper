<template>
  <SideBar :navigationState="navigationState"/>

  <h1 class="mb-3">{{t('phaseDConstruction.title')}}</h1>

  <ConstructionDraft :navigationState="navigationState" :nextButtonRouteTo="nextButtonRouteTo"/>

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
import ConstructionDraft from '@/components/round/ConstructionDraft.vue'
import DebugInfo from '@/components/round/DebugInfo.vue'

export default defineComponent({
  name: 'PhaseDConstruction',
  components: {
    FooterButtons,
    SideBar,
    ConstructionDraft,
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
      return `/round/${this.round}/income`
    },
    nextButtonRouteTo() : string {
      return `/round/${this.round}/actions`
    }
  }
})
</script>
