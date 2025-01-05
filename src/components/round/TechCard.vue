<template>
  <div class="tech"
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
      <AppIcon name="prosperity-money" class="icon communication"/>
    </div>
    <div class="durations">
      <div class="duration" v-for="duration of getDuration(tech)" :key="duration" :style="{'z-index':100-duration}"><div>{{duration + round - 1}}</div></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import NavigationState from '@/util/NavigationState'
import Tech from '@/services/enum/Tech'
import AppIcon from '../structure/AppIcon.vue'
import getTechDuration from '@/util/getTechDuration'
import getTechColor from '@/util/getTechColor'

export default defineComponent({
  name: 'TechCard',
  components: {
    AppIcon
  },
  props: {
    navigationState: {
      type: NavigationState,
      required: true
    },
    tech: {
      type: String as PropType<Tech>,
      required: true
    }
  },
  computed: {
    round() : number {
      return this.navigationState.round
    }
  },
  methods: {
    isArmy(tech: Tech) : boolean {
      return tech == Tech.ARMY
    },
    isEngineering(tech: Tech) : boolean {
      return tech == Tech.ENGINEERING
    },
    isEnergy(tech: Tech) : boolean {
      return tech == Tech.ENERGY
    },
    isCommunication(tech: Tech) : boolean {
      return tech == Tech.COMMUNICATION
    },
    isProsperity(tech: Tech) : boolean {
      return this.navigationState.prosperityCards.current.flat().includes(tech)
    },
    getDuration(tech: Tech) : number {
      return  getTechDuration(tech, this.navigationState.round)
    },
    getColor(tech: Tech) : string {
      return getTechColor(tech)
    }
  }
})
</script>

<style lang="scss" scoped>
.tech {
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
  > .icon {
    width: 75px;
    margin-top: 10px;
    @media (max-width: 600px) {
      width: 65px;
    }
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
      &.communication {
        max-width: 42px;
        @media (max-width: 600px) {
          max-width: 34px;
        }
      }
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
