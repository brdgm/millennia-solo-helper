<template>
  <h5>{{t('phaseADrafting.playerDraft')}}</h5>
  <div class="techs">
    <div class="techRow">
      <div class="income1">
        <AppIcon name="income" class="icon"/>
        <div class="number">{{playerIncomeTotal}}</div>
      </div>
      <div class="income2" v-if="playerIncomeLockedTotal > 0">
        <AppIcon name="income-lock" class="icon"/>
        <div class="number">{{playerIncomeLockedTotal}}</div>
      </div>
      <TechCard v-for="tech of playerTechs" :key="tech" :navigationState="navigationState" :tech="tech" class="techCard"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import NavigationState from '@/util/NavigationState'
import TechCardSelection from '@/services/TechCardSelection'
import Tech from '@/services/enum/Tech'
import TechCard from './TechCard.vue'
import AppIcon from '../structure/AppIcon.vue'

export default defineComponent({
  name: 'TechCardsPlayerDraft',
  components: {
    TechCard,
    AppIcon
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  props: {
    navigationState: {
      type: NavigationState,
      required: true
    },
    playerTechs: {
      type: Array as PropType<Tech[]>,
      required: true
    }
  },
  computed: {
    techCardSelection() : TechCardSelection {
      return this.navigationState.techCardSelection
    },
    playerIncomeTotal() : number {
      return this.playerTechs.map(tech => this.techCardSelection.getIncome(tech)).filter(value => value < 5).reduce((a,b) => a+b, 0)
    },
    playerIncomeLockedTotal() : number {
      return this.playerTechs.map(tech => this.techCardSelection.getIncome(tech)).filter(value => value == 5).reduce((a,b) => a+b, 0)
    }
  }
})
</script>

<style lang="scss" scoped>
.techs {
  overflow-x: auto;
  overflow-y: hidden;
}
.techRow {
  display: flex;
  width: calc(4 * (80px + 10px) + 40px);
  .income1, .income2 {
    position: relative;
    width: 40px;
    .icon {
      position: absolute;
      bottom: 45px;
      width: 35px;
    }
    .number {
      position: absolute;
      bottom: 62px;
      text-align: center;
      width: 34px;
      font-weight: bold;
    }
  }
  .income1 {
    .icon {
      bottom: 80px;
    }
    .number {
      bottom: 97px;
    }
    @media (max-width: 600px) {
      .icon {
        bottom: 65px;
      }
      .number {
        bottom: 82px;
      }
    }
  }
  .income2 {
    margin-left: -40px;
    .icon {
      bottom: 10px;
    }
    .number {
      bottom: 27px;
    }
    @media (max-width: 600px) {
      .icon {
        bottom: 0px;
      }
      .number {
        bottom: 17px;
      }
    }
  }
  @media (max-width: 600px) {
    width: calc(4 * (70px + 10px) + 40px);
  }
}
.techCard {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 120px;
  margin-right: 10px;
  margin-bottom: 10px;
  @media (max-width: 600px) {
    width: 70px;
    height: 100px;
  }
}
</style>
