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

  <div class="row" v-if="playerTurn">
    <div class="col">
      <div class="alert alert-primary" v-html="t('phaseADrafting.playerTurnSelect')"></div>
    </div>
  </div>

  <button class="btn btn-primary btn-lg me-3 mt-2" @click="next()">
    {{t('action.next')}}
  </button>
  <button class="btn btn-outline-secondary btn-sm mt-2" @click="reset()">
    {{t('action.reset')}}
  </button>

  <div class="draftedCards">
    <div v-if="playerTechs.length > 0" class="mt-3">
      <TechCardsPlayerDraft :navigationState="navigationState" :playerTechs="playerTechs"/>
    </div>

    <div v-if="botTechs.length > 0" class="mt-3">
      <h5>{{t('phaseADrafting.botDraft')}}</h5>
      <div class="techs">
        <div class="techRow">
          <TechCard v-for="tech of botTechs" :key="tech" :navigationState="navigationState" :tech="tech" class="techCard disabled"/>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStateStore } from '@/store/state'
import NavigationState from '@/util/NavigationState'
import TechCardSelection from '@/services/TechCardSelection'
import Tech from '@/services/enum/Tech'
import TechPlaceholder from '@/services/enum/TechPlaceholder'
import toTech from '@/util/toTech'
import Player from '@/services/enum/Player'
import TechCard from './TechCard.vue'
import AppIcon from '../structure/AppIcon.vue'
import TechCardsPlayerDraft from './TechCardsPlayerDraft.vue'

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

    const roundData = state.rounds.find(item => item.round == props.navigationState.round)!
    const botTechs = ref(roundData.botTechs ?? [])
    const playerTechs = ref(roundData.playerTechs ?? [])
    const playerSpecialActions = ref(roundData.playerSpecialActions ?? 0)

    return { t, state, roundData, botTechs, playerTechs, playerSpecialActions }
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
      return this.botTechs.length
    },
    playerMarkerPlaced() : number {
      return this.playerTechs.length + this.playerSpecialActions
    },
    draftingCompleted() : boolean {
      return this.botMarkerPlaced == 4 && this.playerMarkerPlaced == 4
    },
    playerIncomeTotal() : number {
      return this.playerTechs.map(tech => this.techCardSelection.getIncome(tech)).filter(value => value < 5).reduce((a,b) => a+b, 0)
    },
    playerIncomeLockedTotal() : number {
      return this.playerTechs.map(tech => this.techCardSelection.getIncome(tech)).filter(value => value == 5).reduce((a,b) => a+b, 0)
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
      await new Promise(resolve => setTimeout(resolve, 400));
      this.removeAnimation = false
      this.navigationState.techCardSelection.remove(tech)
      this.persist()
    },
    async nextTurn() {
      if (this.draftingCompleted) {
        return
      }
      if (this.botMarkerPlaced < this.playerMarkerPlaced) {
        await this.nextTurnBot()
      }
      else if (this.playerMarkerPlaced < this.botMarkerPlaced) {
        await this.nextTurnPlayer()
      }
      else if (this.navigationState.startPlayer == Player.BOT) {
        await this.nextTurnBot()
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
      this.botTechs.push(tech)
      if (tech == Tech.ARMY) {
        this.roundData.nextStartPlayer = Player.BOT
      }
      if (tech == Tech.ENGINEERING) {
        this.roundData.nextArchitectPlayer = Player.BOT
      }
      await this.remove(tech)
      await this.nextTurn()
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
      this.playerTechs.push(t)
      this.roundData.playerTechs = this.playerTechs
      if (t == Tech.ARMY) {
        this.roundData.nextStartPlayer = Player.PLAYER
      }
      if (t == Tech.ENGINEERING) {
        this.roundData.nextArchitectPlayer = Player.PLAYER
      }
      await this.remove(t)
      await this.nextTurn()
    },
    async reset() {
      this.techCardSelection.reset()
      this.navigationState.botCards.draftingRow.reset()
      this.navigationState.botCards.draftingPriority.reset()
      this.roundData.nextStartPlayer = undefined
      this.roundData.nextArchitectPlayer = undefined
      this.roundData.playerTechs = undefined

      this.botTechs = []
      this.playerTechs = []
      this.playerSpecialActions = 0

      this.persist()
      await this.nextTurn()
    },
    async next() {
      if (this.draftingCompleted) {
        this.$router.push(this.nextButtonRouteTo)
      }
      else {
        this.playerSpecialActions++
        this.playerTurn = false
        this.persist()
        await this.nextTurn()
      }
    },
    persist() : void {
      this.roundData.techCardSelection = this.techCardSelection.toPersistence()
      this.roundData.botTechs = this.botTechs
      this.roundData.playerTechs = this.playerTechs
      this.roundData.playerSpecialActions = this.playerSpecialActions
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
