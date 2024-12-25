<template>
  <SideBar :navigationState="navigationState"/>

  <h1 class="mb-3">{{t('phaseFWar.title')}}</h1>

  <button class="btn btn-primary btn-lg mt-4" @click="next()">
    {{t('action.next')}}
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

export default defineComponent({
  name: 'PhaseFWar',
  components: {
    FooterButtons,
    SideBar
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
      return `/round/${this.round}/actions`
    }
  },
  methods: {
    next() : void {
      if (this.round == 8) {
        this.$router.push(`/endOfGame`)
      }
      else {
        this.$router.push(`/round/${this.round}/upkeep`)
      }
    }
  }
})
</script>
