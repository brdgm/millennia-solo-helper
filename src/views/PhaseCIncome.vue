<template>
  <SideBar :navigationState="navigationState"/>

  <h1 class="mb-3">{{t('phaseCIncome.title')}}</h1>

  <p class="mt-4" v-html="t('phaseCIncome.skip')"></p>

  <div v-if="playerTechs.length > 0" class="mt-3">
    <h5>{{t('phaseADrafting.playerDraft')}}</h5>
    <div class="income1">
      <AppIcon name="income" class="icon"/>
      <div class="number">{{playerIncomeTotal}}</div>
    </div>
    <div class="income2" v-if="playerIncomeLockedTotal > 0">
      <AppIcon name="income-lock" class="icon"/>
      <div class="number">{{playerIncomeLockedTotal}}</div>
    </div>
  </div>

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
import { Round, useStateStore } from '@/store/state'
import SideBar from '@/components/round/SideBar.vue'
import NavigationState from '@/util/NavigationState'
import Tech from '@/services/enum/Tech'
import AppIcon from '@/components/structure/AppIcon.vue'

export default defineComponent({
  name: 'PhaseCIncome',
  components: {
    FooterButtons,
    SideBar,
    AppIcon
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
      return `/round/${this.round}/prosperity`
    },
    roundData() : Round {
      return this.state.rounds.find(item => item.round == this.navigationState.round)!
    },
    playerTechs() : Tech[] {
      return this.roundData.playerTechs ?? []
    },
    playerIncomeTotal() : number {
      return this.playerTechs.map(tech => this.navigationState.techCardSelection.getIncome(tech)).filter(value => value < 5).reduce((a,b) => a+b, 0)
    },
    playerIncomeLockedTotal() : number {
      return this.playerTechs.map(tech => this.navigationState.techCardSelection.getIncome(tech)).filter(value => value == 5).reduce((a,b) => a+b, 0)
    }
  },
  methods: {
    next() : void {
      this.$router.push(`/round/${this.round}/construction`)
    }
  }
})
</script>

<style lang="scss" scoped>
.income1, .income2 {
  position: relative;
  width: 40px;
  .icon {
    width: 35px;
    margin-bottom: 10px;
  }
  .number {
    position: absolute;
    bottom: 27px;
    text-align: center;
    width: 34px;
    font-weight: bold;
  }
}
</style>
