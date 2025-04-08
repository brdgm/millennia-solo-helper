<template>
  <table>
    <tbody>
      <tr>
        <th scope="col">
        </th>
        <th scope="col">
          <span>{{t('player.player')}}</span>
        </th>
        <th scope="col">
          <span>{{t('player.bot')}}</span>
        </th>
      </tr>
      <tr>
        <th scope="row">
          <AppIcon type="final-scoring" name="scoring-track" class="icon"/>
          <span v-html="t('endOfGameAmounts.vp')"></span>
        </th>
        <td v-for="index in playerCount" :key="index">
          <ScoringTextInput v-model="amount.scoringTrackVP[index-1]"/>
        </td>
      </tr>
      <tr>
        <th scope="row">
          <AppIcon type="final-scoring" name="prosperity-max" class="icon"/>
          <span v-html="t('endOfGameAmounts.vp')"></span>
        </th>
        <td>
          <ScoringTextInput v-model="amount.prosperityVP[0]"/>
        </td>
        <td></td>
      </tr>
      <tr>
        <th scope="row">
          <AppIcon type="final-scoring" name="population-max" class="icon"/>
          <span v-html="t('endOfGameAmounts.vp')"></span>
        </th>
        <td>
          <ScoringTextInput v-model="amount.populationVP[0]"/>
        </td>
        <td></td>
      </tr>
      <tr>
        <th scope="row">
          <AppIcon type="final-scoring" name="culture-max" class="icon"/>
          <span v-html="t('endOfGameAmounts.vp')"></span>
        </th>
        <td>
          <ScoringTextInput v-model="amount.cultureVP[0]"/>
        </td>
        <td></td>
      </tr>
      <tr>
        <th scope="row">
          <AppIcon type="final-scoring" name="influence" class="icon small"/>
          <span v-html="t('endOfGameAmounts.steps')"></span>
        </th>
        <td>
          <ScoringTextInput v-model="amount.influenceSteps[0]"/>
        </td>
        <td></td>
      </tr>
      <tr>
        <th scope="row">
          <AppIcon type="final-scoring" name="politics" class="icon small"/>
          <span v-html="t('endOfGameAmounts.steps')"></span>
        </th>
        <td>
          <ScoringTextInput v-model="amount.politicsSteps[0]"/>
        </td>
        <td></td>
      </tr>
      <tr>
        <th scope="row">
          <AppIcon type="final-scoring" name="war" class="icon small"/>
          <span v-html="t('endOfGameAmounts.steps')"></span>
        </th>
        <td v-for="index in playerCount" :key="index">
          <ScoringTextInput v-model="amount.warSteps[index-1]"/>
        </td>
      </tr>
      <tr>
        <th scope="row">
          <AppIcon type="final-scoring" name="wonder" class="icon small"/>
          <span v-html="t('endOfGameAmounts.vp')"></span>
        </th>
        <td>
          <ScoringTextInput v-model="amount.wonderVPs[0]"/>
        </td>
        <td></td>
      </tr>
      <tr>
        <th scope="row">
          <AppIcon type="final-scoring" name="yellow-building" class="icon small"/>
          <span v-html="t('endOfGameAmounts.vp')"></span>
        </th>
        <td>
          <ScoringTextInput v-model="amount.yellowBuildingVPs[0]"/>
        </td>
        <td></td>
      </tr>
      <tr>
        <th scope="row">
          <AppIcon type="final-scoring" name="diplomacy-card" class="icon"/>
          <span v-html="t('endOfGameAmounts.count')"></span>
        </th>
        <td>
          <ScoringTextInput v-model="amount.diplomacyCardCount[0]"/>
        </td>
        <td></td>
      </tr>
    </tbody>
  </table>

  <button class="btn btn-primary btn-lg mt-4" @click="next()">
    {{t('action.next')}}
  </button>

</template>

<script lang="ts">
import { useStateStore, FinalScoringAmount } from '@/store/state'
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from '../structure/AppIcon.vue'
import { useRouter } from 'vue-router'
import ScoringTextInput from '@brdgm/brdgm-commons/src/components/form/ScoringTextInput.vue'

export default defineComponent({
  name: 'FinalAmounts',
  components: {
    AppIcon,
    ScoringTextInput
  },
  setup() {
    const { t } = useI18n()
    const state = useStateStore()
    const router = useRouter()

    const amount = state.finalScoringAmount ?? 
      {
        scoringTrackVP: [],
        prosperityVP: [],
        populationVP: [],
        cultureVP: [],
        influenceSteps: [],
        politicsSteps: [],
        warSteps: [],
        wonderVPs: [],
        yellowBuildingVPs: [],
        diplomacyCardCount: []
      } as FinalScoringAmount

    const playerCount = 2

    return { t, state, router, amount, playerCount }
  },
  methods: {
    toNumber(value? : number) {
      if (typeof value == 'string') {
        return 0
      }
      else {
        return value ?? 0
      }
    },
    next() : void {
      this.state.finalScoringAmount = this.amount
      this.router.push('/endOfGame')
    }
  }
})
</script>

<style lang="scss" scoped>
.icon {
  height: 2.5rem;
  margin-right: 0.25rem;
  object-fit: contain;
  &.small {
    width: 2rem;
    height: 2rem;
  }
}
th, td {
  text-align: center;
  padding: 0.5rem;
}
tr:nth-child(even) {
  background-color: #f2f2f2;
}
th {
  white-space: nowrap;
  vertical-align: middle;
}
input {
  width: 5rem;
}
</style>
