<template>
  <SideBar :navigationState="navigationState"/>

  <h1 class="mb-3">{{t('phaseADrafting.title')}}</h1>

  <TechCardDraft :navigationState="navigationState"/>

  <button class="btn btn-primary btn-lg mt-4" @click="next()">
    {{t('action.next')}}
  </button>
  <button class="btn btn-outline-secondary btn-sm mt-4 ms-3" @click="navigationState.techCardSelection.reset()">
    {{t('action.reset')}}
  </button>

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

export default defineComponent({
  name: 'PhaseADrafting',
  components: {
    FooterButtons,
    SideBar,
    TechCardDraft
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
      if (this.round > 1) {
        return `/round/${this.round-1}/upkeep`
      }
      return ''
    }
  },
  methods: {
    next() : void {
      this.$router.push(`/round/${this.round}/prosperity`)
    }
  }
})
</script>
