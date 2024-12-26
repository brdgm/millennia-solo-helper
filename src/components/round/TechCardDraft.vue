<template>
  <div class="techs">
    <div class="techRow" v-for="(techs,row) in techCardSelection.techs" :key="row">
      <template v-for="(tech,col) in techs" :key="col">
        <div v-if="isEmpty(tech)" class="techCard empty"></div>
        <div v-else-if="isBlank(tech)" class="techCard blank"></div>
        <div v-else class="techCard tech"
            :data-tech="tech"
            :class="{disabled:hasTwoEmpty(techs) || draftingCompleted}"
            :style="{backgroundColor:getColor(tech)}" 
            @click="hasTwoEmpty(techs) || draftingCompleted ? () => {} : playerDraftTech(tech)">
          <AppIcon type="tech" :name="tech" class="icon"/>
          <div class="prosperity" v-if="isProsperity(tech)">
            <AppIcon name="prosperity" class="icon"/>
          </div>
          <div class="marker" v-if="isArmy(tech)">
            <AppIcon name="first-player-token" class="icon"/>
          </div>
          <div class="marker" v-if="isEngineering(tech)">
            <AppIcon name="architect-token" class="icon"/>
          </div>
          <div class="marker" v-if="isEnergy(tech)">
            <AppIcon name="unlock-income" class="icon"/>
          </div>
          <div class="marker" v-if="isCommunication(tech)">
            <AppIcon name="prosperity-money" class="icon"/>
          </div>
          <div class="durations">
            <div class="duration" v-for="age of getDuration(tech)" :key="age" :style="{'z-index':100-age}"><div>{{age}}</div></div>
          </div>
        </div>
      </template>
    </div>
  </div>

  <button class="btn btn-primary btn-lg mt-4 me-3" @click="next()">
    {{t('action.next')}}
  </button>
  <button class="btn btn-outline-secondary btn-sm mt-4" @click="reset()">
    {{t('action.reset')}}
  </button>

  <div class="row" v-if="playerTurn || draftingCompleted">
    <div class="col">
      <div class="alert alert-primary mt-3" v-if="playerTurn">
        Please place your drafting marker on the board and select a tech card, or click on "Next" if you selected a special action.
      </div>
      <div class="alert alert-primary mt-3" v-if="draftingCompleted">
        Drafting completed.
      </div>
    </div>
  </div>

  <h5>Player techs</h5>
  <div class="techs">
    <div class="techRow">
      <div v-for="tech of playerTechs" class="techCard tech"
          :style="{backgroundColor:getColor(tech)}">
        <AppIcon type="tech" :name="tech" class="icon"/>
        <div class="prosperity" v-if="isProsperity(tech)">
          <AppIcon name="prosperity" class="icon"/>
        </div>
        <div class="marker" v-if="isArmy(tech)">
          <AppIcon name="first-player-token" class="icon"/>
        </div>
        <div class="marker" v-if="isEngineering(tech)">
          <AppIcon name="architect-token" class="icon"/>
        </div>
        <div class="marker" v-if="isEnergy(tech)">
          <AppIcon name="unlock-income" class="icon"/>
        </div>
        <div class="marker" v-if="isCommunication(tech)">
          <AppIcon name="prosperity-money" class="icon"/>
        </div>
        <div class="durations">
          <div class="duration" v-for="age of getDuration(tech)" :key="age" :style="{'z-index':100-age}"><div>{{age}}</div></div>
        </div>
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
import AppIcon from '../structure/AppIcon.vue'
import getTechDuration from '@/util/getTechDuration'
import getTechColor from '@/util/getTechColor'
import toTech from '@/util/toTech'
import Player from '@/services/enum/Player'

export default defineComponent({
  name: 'TechCardDraft',
  components: {
    AppIcon
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
    isArmy(tech: (Tech|TechPlaceholder)) : boolean {
      return tech == Tech.ARMY
    },
    isEngineering(tech: (Tech|TechPlaceholder)) : boolean {
      return tech == Tech.ENGINEERING
    },
    isEnergy(tech: (Tech|TechPlaceholder)) : boolean {
      return tech == Tech.ENERGY
    },
    isCommunication(tech: (Tech|TechPlaceholder)) : boolean {
      return tech == Tech.COMMUNICATION
    },
    isProsperity(tech: (Tech|TechPlaceholder)) : boolean {
      const t = toTech(tech)
      return t ? this.navigationState.prosperityCards.current.flat().includes(t) : false
    },
    getDuration(tech: (Tech|TechPlaceholder)) : number {
      const t = toTech(tech)
      return t ? getTechDuration(t, this.navigationState.round) : 0
    },
    getColor(tech: (Tech|TechPlaceholder)) : string {
      const t = toTech(tech)
      return t ? getTechColor(t) : ''
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
}
.techCard {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 120px;
  margin-right: 10px;
  margin-bottom: 10px;
  &.tech {
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
    filter: drop-shadow(2px 2px 2px #888);
    transition: transform 0.8s;
    transform-style: preserve-3d;
    backface-visibility: hidden;
    &.disabled {
      cursor: not-allowed;
      filter: grayscale(1);
      opacity: 0.3;
    }
    &.remove {
      transform: rotateY(180deg);
    }
  }
  > .icon {
    width: 75px;
    margin-top: 10px;
  }
  .prosperity {
    position: absolute;
    left: 5px;
    top: 5px;
    > .icon {
      width: 25px;
      filter: drop-shadow(1px 1px 1px #444);
    }
  }
  .marker {
    position: absolute;
    left: 5px;
    bottom: 5px;
    > .icon {
      max-width: 35px;
      max-height: 30px;
      filter: drop-shadow(1px 1px 1px #444);
    }
  }
  .durations {
    position: absolute;
    right: 0;
    bottom: 0;
    margin-right: 5px;
    margin-bottom: 5px;
    .duration {
      position: relative;
      display: flex;
      width: 24px;
      height: 24px;
      border: 2px solid black;
      border-radius: 12px;
      background-color: #fff;
      font-weight: bold;
      align-items: center;
      justify-content: center;
      margin-top: -4px;
      filter: drop-shadow(1px 1px 1px #444);
    }
  }
}
</style>
