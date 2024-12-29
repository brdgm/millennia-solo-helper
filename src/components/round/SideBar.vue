<template>
  <div class="sidebar">
    <div>
      <span class="fw-bold">{{t('sideBar.round', {round})}}</span><br/>
      <span class="small fst-italic">{{t(`age.${round}`)}}</span>
    </div>

    <div class="prosperityCard" v-for="(techs,index) in navigationState.prosperityCards.current" :key="index">
      <div class="cardTop">
        <AppIcon name="prosperity-card" class="icon"/>
      </div>
      <div class="tech" v-for="tech in techs" :key="tech" :style="{'background-color':getColor(tech)}">
        <AppIcon type="tech" :name="tech" class="icon"/>
      </div>
    </div>

    <div class="mt-2" v-if="botStartPlayer || botArchitectPlayer">
      <span class="fw-bold">{{t('player.bot')}}</span><br/>
      <AppIcon v-if="botStartPlayer" name="first-player-token" class="marker me-1"/>
      <AppIcon v-if="botArchitectPlayer" name="architect-token" class="marker"/>
    </div>
    <div class="mt-2" v-if="playerStartPlayer || playerArchitectPlayer">
      <span class="fw-bold">{{t('player.player')}}</span><br/>
      <AppIcon v-if="playerStartPlayer" name="first-player-token" class="marker me-1"/>
      <AppIcon v-if="playerArchitectPlayer" name="architect-token" class="marker"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { Round, useStateStore } from '@/store/state'
import NavigationState from '@/util/NavigationState'
import AppIcon from '../structure/AppIcon.vue'
import Tech from '@/services/enum/Tech'
import TechPlaceholder from '@/services/enum/TechPlaceholder'
import getTechColor from '@/util/getTechColor'
import Player from '@/services/enum/Player'
import toTech from '@/util/toTech'

export default defineComponent({
  name: 'SideBar',
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
  computed: {
    round() : number {
      return this.navigationState.round
    },
    roundData() : Round|undefined {
      return this.state.rounds.find(item => item.round == this.round)
    },
    nextStartPlayer() : Player {
      return this.roundData?.nextStartPlayer ?? this.navigationState.startPlayer
    },
    nextArchitectPlayer() : Player {
      return this.roundData?.nextArchitectPlayer ?? this.navigationState.architectPlayer
    },
    botStartPlayer() : boolean {
      return this.nextStartPlayer == Player.BOT
    },
    botArchitectPlayer() : boolean {
      return this.nextArchitectPlayer == Player.BOT
    },
    playerStartPlayer() : boolean {
      return this.nextStartPlayer == Player.PLAYER
    },
    playerArchitectPlayer() : boolean {
      return this.nextArchitectPlayer == Player.PLAYER
    }
  },
  methods: {
    getColor(tech: (Tech|TechPlaceholder)) : string {
      const t = toTech(tech)
      return t ? getTechColor(t) : ''
    }
  }
})
</script>

<style lang="scss" scoped>
.sidebar {
  float: right;
  width: 145px;
  margin-left: 15px;
  margin-bottom: 10px;
  margin-right: -12px;
  padding: 15px 10px 15px 15px;
  background-color: #ddd;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  .prosperityCard {
    width: 100px;
    margin-top: 10px;
    border-radius: 5px;
    border: 1px solid black;
    filter: drop-shadow(2px 2px 2px #888);
    .cardTop {
      display: flex;
      width: 100%;
      padding: 1px;
      justify-content: center;
      background-color: #ee994a;
      .icon {
        width: 50px;
      }
    }
    .tech {
      display: inline-flex;
      width: 50%;
      align-items: center;
      justify-content: center;
      padding: 5px;
      .icon {
        width: 100%;
      }
    }
  }
  .marker {
    width: 30px;
  }
  @media (max-width: 600px) {
    float: none;
    display: flex;
    gap: 5px;
    justify-content: space-evenly;
    align-items: center;
    border-top-left-radius: 0;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    margin-top: -15px;
    margin-left: 0px;
    margin-right: 0px;
    padding: 5px 5px 10px 5px;
    width: 100%;
    font-size: 0.8rem;
    .prosperityCard {
      width: 80px;
      .cardTop {
        .icon {
          width: 40px;
        }
      }
    }
    .marker {
      width: 25px;
    }
  }
}
</style>
