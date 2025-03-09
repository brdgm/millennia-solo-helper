<template>
  <div class="row" style="width:fit-content" v-if="playerTurn">
    <div class="col">
      <div class="alert alert-primary" v-html="t('phaseDConstruction.playerAction')"></div>
    </div>
  </div>

  <div v-if="botTurn">
    <p v-html="t('phaseDConstruction.remove')"></p>
    <div class="buildings">
      <div v-for="row in 3" :key="row">
        <div class="buildingBox">
          <AppIcon name="red-x" extension="svg" class="cross-out" v-if="wonderBuildingIndex == ((row-1) * 2) + 1"/>
          <AppIcon :name="row==1 ? 'wonder' : 'building-any'" class="icon"/>
        </div>
        <div class="buildingBox">
          <AppIcon name="red-x" extension="svg" class="cross-out" v-if="wonderBuildingIndex == ((row-1) * 2) + 2"/>
          <AppIcon :name="row==1 ? 'wonder' : 'building-any'" class="icon"/>
        </div>
      </div>
    </div>
  </div>

  <button class="btn btn-primary btn-lg mt-4 me-2" @click="next()">
    {{t('action.next')}}
  </button>
  <button class="btn btn-danger btn-lg mt-4" @click="notAvailable()" v-if="botTurn">
    {{t('phaseDConstruction.notAvailable')}}
  </button>
  <button class="btn btn-secondary btn-lg mt-4" @click="pass()" v-if="playerTurn">
    {{t('phaseDConstruction.pass')}}
  </button>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStateStore } from '@/store/state'
import NavigationState from '@/util/NavigationState'
import AppIcon from '../structure/AppIcon.vue'
import Player from '@/services/enum/Player'
import ConstructionCard from '@/services/ConstructionCard'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'ConstructionDraft',
  components: {
    AppIcon
  },
  setup(props) {
    const { t } = useI18n()
    const state = useStateStore()
    const router = useRouter()

    const architectPlayer = props.navigationState.architectPlayer
    const botTurn = ref(architectPlayer == Player.BOT)
    const playerTurn = ref(architectPlayer == Player.PLAYER)
    const constructionCard = ref(undefined as ConstructionCard|undefined)

    if (botTurn.value) {
      constructionCard.value = props.navigationState.botCards.construction.draw()
    }

    return { t, router, state, botTurn, playerTurn, constructionCard }
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
  computed: {
    wonderBuildingIndex() : number {
      return this.constructionCard?.wonderBuildingIndex ?? 0
    }
  },
  methods: {
    next() : void {
      if (this.playerTurn) {
        this.nextTurnBot()
      } else {
        this.nextTurnPlayer()
      }
    },
    nextTurnPlayer() : void {
      this.playerTurn = true
      this.botTurn = false
    },
    nextTurnBot() : void {
      this.constructionCard = this.navigationState.botCards.construction.draw()
      this.botTurn = true
      this.playerTurn = false
    },
    notAvailable() : void {
      this.nextTurnBot()
    },
    pass() : void {
      this.router.push(this.nextButtonRouteTo)
    }
  }
})
</script>

<style lang="scss" scoped>
.buildingBox {
  position: relative;
  display: inline-block;
}
.icon {
  width: 40px;
  margin: 5px;
}
.cross-out {
  position: absolute;
  width: 45px;
  left: 2px;
  top: 10px;
}
</style>
