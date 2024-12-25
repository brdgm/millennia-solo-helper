<template>
  <div class="sidebar">
    <span class="fw-bold">{{t('sideBar.round', {round})}}</span><br/>
    <span class="small fst-italic">{{t(`age.${round}`)}}</span>

    <div class="prosperityCard" v-for="(techs,index) in navigationState.prosperityCards.current" :key="index">
      <AppIcon name="prosperity-card" class="cardTop"/>
      <div class="tech" v-for="tech in techs" :key="tech" :style="{'background-color':getColor(tech)}">
        <AppIcon type="tech" :name="tech" class="icon"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStateStore } from '@/store/state'
import NavigationState from '@/util/NavigationState'
import AppIcon from '../structure/AppIcon.vue'
import Tech from '@/services/enum/Tech'
import TechPlaceholder from '@/services/enum/TechPlaceholder'
import getTechColor from '@/util/getTechColor'

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
    }
  },
  methods: {
    getColor(tech: (Tech|TechPlaceholder)) : string {
      if (tech == TechPlaceholder.BLANK || tech == TechPlaceholder.EMPTY) {
        return ''
      }
      return getTechColor(tech)
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
    width: 80px;
    margin-top: 10px;
    border-radius: 5px;
    border: 1px solid black;
    filter: drop-shadow(2px 2px 2px #888);
    .cardTop {
      width: 100%;
    }
    .tech {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: center;
      padding: 5px;
      .icon {
        width: 50%;
      }
    }
  }
  @media (max-width: 600px) {
    font-size: 0.8rem;
    width: 120px;
    .prosperityCard {
      width: 60px;
    }
  }
}
</style>
