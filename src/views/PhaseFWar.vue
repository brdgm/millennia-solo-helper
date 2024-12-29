<template>
  <SideBar :navigationState="navigationState"/>

  <h1 class="mb-3">{{t('phaseFWar.title')}}</h1>

  <div class="warTrack mb-3">
    <div class="number">{{ warTrackAdvanceSteps }}</div>
    <AppIcon name="war-track-advance" class="icon advance"/>
    <AppIcon name="war-track-unlock" class="icon lock"/>
  </div>

  <ul>
    <li v-html="t('phaseFWar.advance', {steps:warTrackAdvanceSteps})"></li>
    <li v-html="t('phaseFWar.outmax')"></li>
    <li v-html="t('phaseFWar.resolve')"></li>
    <li v-html="t('phaseFWar.trackVP')"></li>
  </ul>

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
import { useStateStore } from '@/store/state'
import SideBar from '@/components/round/SideBar.vue'
import NavigationState from '@/util/NavigationState'
import AppIcon from '@/components/structure/AppIcon.vue'
import DebugInfo from '@/components/round/DebugInfo.vue'

export default defineComponent({
  name: 'PhaseFWar',
  components: {
    FooterButtons,
    SideBar,
    AppIcon,
    DebugInfo
  },
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const state = useStateStore()

    const navigationState = new NavigationState(route, state)
    const { round } = navigationState

    const warTrackAdvanceSteps = navigationState.botCards.war.currentCard?.warAdvance ?? 0

    return { t, state, navigationState, round, warTrackAdvanceSteps }
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

<style lang="scss" scoped>
.warTrack {
  display: flex;
  .number {
    font-size: 30px;
    font-weight: bold;
    margin-left: 10px;
  }
  .icon {
    width: 50px;
    margin-left: 10px;
    object-fit: contain;
    filter: drop-shadow(2px 2px 2px #888);
    &.lock {
      width: 35px;
    }
  }
}
</style>