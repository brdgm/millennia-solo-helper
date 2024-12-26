<template>
  <div class="techs">
    <div class="techRow" v-for="(techs,row) in techCardSelection.techs" :key="row">
      <template v-for="(tech,col) in techs" :key="col">
        <div v-if="isEmpty(tech)" class="techCard empty"></div>
        <div v-else-if="isBlank(tech)" class="techCard blank"></div>
        <div v-else class="techCard tech"
            :data-tech="tech"
            :class="{disabled:hasTwoEmpty(techs)}"
            :style="{backgroundColor:getColor(tech)}" 
            @click="hasTwoEmpty(techs) ? () => {} : remove(tech)">
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
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStateStore } from '@/store/state'
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
    }
  },
  data() {
    return {
      removeAnimation: false,
      botTechs: [] as Tech[],
      playerTechs: [] as Tech[],
      playerSpecialActions: 0
    }
  },
  computed: {
    techCardSelection() : TechCardSelection {
      return this.navigationState.techCardSelection
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
    remove(tech: (Tech|TechPlaceholder)) : void {
      const t = toTech(tech)
      if (this.removeAnimation || !t) {
        return
      }
      document.querySelector(`.techCard[data-tech="${t}"]`)?.classList.add('remove')
      this.removeAnimation = true
      setTimeout(() => {
        this.removeAnimation = false
        this.navigationState.techCardSelection.remove(t)
      }, 400)
    },
    nextTurn() : void {
      if (this.botTechs.length < this.playerTechs.length) {
        this.nextTurnBot()
      }
      else if (this.playerTechs.length < this.botTechs.length) {
        this.nextTurnPlayer()
      }
      else if (this.navigationState.startPlayer == Player.BOT) {
        this.nextTurnBot()
      }
      else {
        this.nextTurnPlayer()
      }
    },
    nextTurnBot() : void {
      const { techCardSelection, botCards, prosperityCards } = this.navigationState
      const draftingRowCard = botCards.draftingRow.draw()
      const draftingPriorityCard = botCards.draftingPriority.draw()
      const tech = techCardSelection.determineTech(draftingRowCard, draftingPriorityCard, prosperityCards.current.flat())
      this.remove(tech)
    },
    nextTurnPlayer() : void {
      alert('Player turn')
    },
    reset() : void {
      alert('Player turn')
      this.botTechs = []
      this.playerTechs = []
      this.playerSpecialActions = 0
      this.nextTurn()
    }
  },
  mounted() {
    this.nextTurn()
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
