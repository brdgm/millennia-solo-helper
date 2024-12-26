<template>
  <div class="techs">
    <div class="techRow" v-for="(techs,row) in techCardSelection.techs" :key="row">
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
      <div class="alert alert-primary mt-3" v-html="t('phaseADrafting.playerTurnSelect')"></div>
    </div>
  </div>

  <button class="btn btn-primary btn-lg mt-4 me-3" @click="next()">
    {{t('action.next')}}
  </button>
  <button class="btn btn-outline-secondary btn-sm mt-4" @click="reset()">
    {{t('action.reset')}}
  </button>

  <div v-if="playerTechs.length > 0" class="mt-3">
    <h5>{{t('phaseADrafting.playerDraft')}}</h5>
    <div class="techs">
      <div class="techRow">
        <TechCard v-for="tech of playerTechs" :key="tech" :navigationState="navigationState" :tech="tech" class="techCard"/>
      </div>
    </div>
  </div>

  <div v-if="botTechs.length > 0" class="mt-3">
    <h5>{{t('phaseADrafting.botDraft')}}</h5>
    <div class="techs">
      <div class="techRow">
        <TechCard v-for="tech of botTechs" :key="tech" :navigationState="navigationState" :tech="tech" class="techCard disabled"/>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { Round, useStateStore } from '@/store/state'
import NavigationState from '@/util/NavigationState'
import TechCardSelection from '@/services/TechCardSelection'
import Tech from '@/services/enum/Tech'
import TechPlaceholder from '@/services/enum/TechPlaceholder'
import toTech from '@/util/toTech'
import Player from '@/services/enum/Player'
import TechCard from './TechCard.vue'

export default defineComponent({
  name: 'TechCardDraft',
  components: {
    TechCard
  },
  setup() {
    const { t } = useI18n()
    const state = useStateStore()
    return { t, state }
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
      botTechs: [] as Tech[],
      playerTechs: [] as Tech[],
      playerSpecialActions: 0,
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
    roundData() : Round {
      return this.state.rounds.find(item => item.round == this.navigationState.round)!
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
      await this.remove(tech)
      this.botTechs.push(tech)
      if (tech == Tech.ARMY) {
        this.roundData.nextStartPlayer = Player.BOT
      }
      if (tech == Tech.ENGINEERING) {
        this.roundData.nextArchitectPlayer = Player.BOT
      }
      await this.nextTurn()
    },
    async nextTurnPlayer() {
      this.playerTurn = true
    },
    async playerDraftTech(tech: (Tech|TechPlaceholder)) {
      const t = toTech(tech)
      if (!t) {
        return
      }
      this.playerTurn = false
      await this.remove(t)
      this.playerTechs.push(t)
      if (t == Tech.ARMY) {
        this.roundData.nextStartPlayer = Player.PLAYER
      }
      if (t == Tech.ENGINEERING) {
        this.roundData.nextArchitectPlayer = Player.PLAYER
      }
      await this.nextTurn()
    },
    async reset() {
      this.navigationState.techCardSelection.reset()
      this.navigationState.botCards.draftingRow.reset()
      this.navigationState.botCards.draftingPriority.reset()
      this.roundData.nextStartPlayer = undefined
      this.roundData.nextArchitectPlayer = undefined

      this.botTechs = []
      this.playerTechs = []
      this.playerSpecialActions = 0

      await this.nextTurn()
    },
    async next() {
      if (this.draftingCompleted) {
        this.$router.push(this.nextButtonRouteTo)
      }
      else {
        this.playerSpecialActions++
        this.playerTurn = false
        await this.nextTurn()
      }
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
  width: calc(4 * (80px + 10px));
}
.techCard {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 120px;
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
