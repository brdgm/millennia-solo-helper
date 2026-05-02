<template>
  <div class="techs mb-3">
    <div class="techRow" v-for="(techs,row) in techCardSelection.techs" :key="row">
      <div class="income">
        <AppIcon :name="row==3 ? 'income-lock' : 'income'" class="icon"/>
        <div class="number">{{row+2}}</div>
      </div>
      <template v-for="(tech,col) in techs" :key="col">
        <div v-if="isEmpty(tech)" class="techCard empty"></div>
        <div v-else-if="isBlank(tech)" class="techCard blank"></div>
        <TechCard v-else :navigationState="navigationState" :tech="tech as Tech"
            :data-tech="tech"
            class="techCard"
            :class="{disabled:hasTwoEmpty(techs) || draftingCompleted}"
            @click="hasTwoEmpty(techs) || draftingCompleted ? () => {} : playerDraftTech(tech)"/>
      </template>
    </div>
  </div>

  <div class="row" style="width:fit-content" v-if="botRound8Army">
    <div class="col">
      <div class="alert alert-warning" v-html="t('phaseADrafting.botRound8Army')"></div>
    </div>
  </div>

  <div class="row" style="width:fit-content" v-if="playerTurn">
    <div class="col">
      <div class="alert alert-primary" v-html="t('phaseADrafting.playerTurnSelect')"></div>
    </div>
  </div>

  <button class="btn btn-primary btn-lg me-3 mt-2" @click="next()">
    {{t('action.next')}}
  </button>

  <div class="draftedCards">
    <div v-if="techDraftStep.playerTechs.length > 0" class="mt-3">
      <TechCardsPlayerDraft :navigationState="navigationState" :playerTechs="techDraftStep.playerTechs"/>
    </div>

    <div v-if="techDraftStep.botTechs.length > 0" class="mt-3">
      <h5>{{t('phaseADrafting.botDraft')}}</h5>
      <div class="techs">
        <div class="techRow">
          <TechCard v-for="tech of techDraftStep.botTechs" :key="tech" :navigationState="navigationState" :tech="tech" class="techCard disabled"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { TechDraftStep, useStateStore } from '@/store/state'
import NavigationState from '@/util/NavigationState'
import TechCardSelection from '@/services/TechCardSelection'
import Tech from '@/services/enum/Tech'
import TechPlaceholder from '@/services/enum/TechPlaceholder'
import toTech from '@/util/toTech'
import Player from '@/services/enum/Player'
import TechCard from './TechCard.vue'
import AppIcon from '../structure/AppIcon.vue'
import TechCardsPlayerDraft from './TechCardsPlayerDraft.vue'
import { useRouter } from 'vue-router'
import { cloneDeep } from 'lodash'

export default defineComponent({
  name: 'TechCardDraft',
  components: {
    TechCard,
    TechCardsPlayerDraft,
    AppIcon
  },
  setup(props) {
    const { t } = useI18n()
    const state = useStateStore()
    const router = useRouter()

    const roundData = state.rounds.find(item => item.round == props.navigationState.round)!
    const lastTechDraftStep = props.navigationState.lastDraftStep
    const techDraftStep = ref({
      round: props.navigationState.round,
      step: props.navigationState.draftingStep,
      nextStartPlayer: lastTechDraftStep?.nextStartPlayer,
      nextArchitectPlayer: lastTechDraftStep?.nextArchitectPlayer,
      botTechs: cloneDeep(lastTechDraftStep?.botTechs ?? []),
      playerTechs: cloneDeep(lastTechDraftStep?.playerTechs ?? []),
      playerSpecialActions: lastTechDraftStep?.playerSpecialActions ?? 0
    } as TechDraftStep)

    return { t, state, router, roundData, techDraftStep }
  },
  props: {
    navigationState: {
      type: NavigationState,
      required: true
    },
    nextButtonRouteTo: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      removeAnimation: false,
      playerTurn: false
    }
  },
  computed: {
    techCardSelection() : TechCardSelection {
      return this.navigationState.techCardSelection
    },
    botMarkerPlaced() : number {
      return this.techDraftStep.botTechs.length
    },
    playerMarkerPlaced() : number {
      return this.techDraftStep.playerTechs.length + this.techDraftStep.playerSpecialActions
    },
    draftingCompleted() : boolean {
      return this.botMarkerPlaced == 4 && this.playerMarkerPlaced == 4
    },
    playerIncomeTotal() : number {
      return this.techDraftStep.playerTechs.map(tech => this.techCardSelection.getIncome(tech)).filter(value => value < 5).reduce((a,b) => a+b, 0)
    },
    playerIncomeLockedTotal() : number {
      return this.techDraftStep.playerTechs.map(tech => this.techCardSelection.getIncome(tech)).filter(value => value == 5).reduce((a,b) => a+b, 0)
    },
    botRound8Army() : boolean {
      return this.navigationState.round == 8 && this.techDraftStep.botTechs.includes(Tech.ARMY)
    }
  },
  methods: {
    isEmpty(tech: (Tech|TechPlaceholder)) : boolean {
      return tech == TechPlaceholder.EMPTY
    },
    isBlank(tech: (Tech|TechPlaceholder)) : boolean {
      return tech == TechPlaceholder.BLANK
    },
    hasTwoEmpty(techs: (Tech|TechPlaceholder)[]) : boolean {
      return techs.filter(tech => tech == TechPlaceholder.EMPTY).length >= 2
    },
    async remove(tech: Tech) {
      if (this.removeAnimation) {
        return
      }
      document.querySelector(`.techCard[data-tech="${tech}"]`)?.classList.add('remove')
      this.removeAnimation = true
      await new Promise(resolve => setTimeout(resolve, 400))
      this.removeAnimation = false
      this.navigationState.techCardSelection.remove(tech)
    },
    async nextTurn() {
      if (this.draftingCompleted) {
        return
      }
      if (this.roundData.startPlayer == Player.BOT) {
        await this.nextTurnBot()
        await this.nextTurnPlayer()
      }
      else {
        await this.nextTurnPlayer()
      }
    },
    async nextTurnBot() {
      const { techCardSelection, botCards, prosperityCards } = this.navigationState
      const draftingRowCard = botCards.draftingRow.draw()
      const draftingPriorityCard = botCards.draftingPriority.draw()
      const tech = techCardSelection.determineTech(draftingRowCard, draftingPriorityCard, prosperityCards.current.flat())
      this.techDraftStep.botTechs.push(tech)
      if (tech == Tech.ARMY) {
        this.techDraftStep.nextStartPlayer = Player.BOT
      }
      if (tech == Tech.ENGINEERING) {
        this.techDraftStep.nextArchitectPlayer = Player.BOT
      }
      await this.remove(tech)
    },
    async nextTurnPlayer() {
      this.playerTurn = true
    },
    async playerDraftTech(tech: (Tech|TechPlaceholder)) {
      if (this.removeAnimation) {
        return
      }
      const t = toTech(tech)
      if (!t) {
        return
      }
      this.playerTurn = false
      this.techDraftStep.playerTechs.push(t)
      this.techDraftStep.playerTechs = this.techDraftStep.playerTechs
      if (t == Tech.ARMY) {
        this.techDraftStep.nextStartPlayer = Player.PLAYER
      }
      if (t == Tech.ENGINEERING) {
        this.techDraftStep.nextArchitectPlayer = Player.PLAYER
      }
      await this.remove(t)
      await this.playerTurnCompleted()
    },
    async next() {
      if (this.draftingCompleted) {
        this.router.push(this.nextButtonRouteTo)
      }
      else {
        this.techDraftStep.playerSpecialActions++
        this.playerTurn = false
        await this.playerTurnCompleted()
      }
    },
    async playerTurnCompleted() {
      // if player was first player, execute bot turn before going to next step
      if (this.roundData.startPlayer == Player.PLAYER) {
        await this.nextTurnBot()
      }
      this.persistAndNextStep()
    },
    persistAndNextStep() : void {
      this.techDraftStep.techCardSelection = this.techCardSelection.toPersistence()
      this.state.storeTechDraftStep(this.techDraftStep)
      this.router.push(`/round/${this.navigationState.round}/drafting/${this.techDraftStep.step+1}`)
    }
  },
  mounted() {
    setTimeout(() => this.nextTurn(), 10)
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
  .income {
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
  &.empty {
    border: 2px dashed #aaa;
    border-radius: 6px;
    background-color: #f0f0f0;
    opacity: 0.5;
  }
}
.draftedCards {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  @media (min-width: 1100px) {
    display: block;
    position: absolute;
    right: 180px;
    top: 40px;
  }
}
</style>
