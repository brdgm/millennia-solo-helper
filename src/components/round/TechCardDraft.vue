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
      removeAnimation: false
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
      if (tech == TechPlaceholder.BLANK || tech == TechPlaceholder.EMPTY) {
        return false
      }
      return this.navigationState.prosperityCards.current.flat().includes(tech)
    },
    getDuration(tech: (Tech|TechPlaceholder)) : number {
      if (tech == TechPlaceholder.BLANK || tech == TechPlaceholder.EMPTY) {
        return 0
      }
      return getTechDuration(tech, this.navigationState.round)
    },
    getColor(tech: (Tech|TechPlaceholder)) : string {
      if (tech == TechPlaceholder.BLANK || tech == TechPlaceholder.EMPTY) {
        return ''
      }
      return getTechColor(tech)
    },
    hasTwoEmpty(techs: (Tech|TechPlaceholder)[]) : boolean {
      return techs.filter(tech => tech == TechPlaceholder.EMPTY).length >= 2
    },
    remove(tech: (Tech|TechPlaceholder)) {
      if (this.removeAnimation || tech == TechPlaceholder.BLANK || tech == TechPlaceholder.EMPTY) {
        return
      }
      document.querySelector(`.techCard[data-tech="${tech}"]`)?.classList.add('remove')
      this.removeAnimation = true
      setTimeout(() => {
        this.removeAnimation = false
        this.navigationState.techCardSelection.remove(tech)
      }, 400)
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
