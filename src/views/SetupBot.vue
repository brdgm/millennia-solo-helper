<template>
  <h1>
    {{t('setupBot.title')}}
  </h1>

  <div class="instructions mt-3">
    <ul>
      <li v-html="t('setupBot.setup.gameBoard')"></li>
      <ul>
        <li v-html="t('setupBot.setup.techCards')"></li>
        <li v-html="t('setupBot.setup.prosperityCards')"></li>
      </ul>
      <li v-html="t('setupBot.setup.playerColor')"></li>
      <li v-html="t('setupBot.setup.trackTokens')"></li>
      <li v-html="t(`setupBot.setup.startPlayer.${startPlayer}`)"></li>
      <li v-html="t(`setupBot.setup.secondPlayer.${secondPlayer}`)"></li>
    </ul>
  </div>

  <div class="row mt-4">
    <div class="col">
      <div class="alert alert-secondary">
        <span v-html="t('setupBot.botRules.intro')"></span>
        <ul>
          <li v-html="t('setupBot.botRules.noGold')"></li>
          <li v-html="t('setupBot.botRules.noActions')"></li>
          <li v-html="t('setupBot.botRules.onlyWarTrack')"></li>
          <li v-html="t('setupBot.botRules.noVP')"></li>
        </ul>
      </div>
    </div>
  </div>

  <button class="btn btn-primary btn-lg mt-4" @click="startGame()">
    {{t('action.startGame')}}
  </button>

  <FooterButtons endGameButtonType="abortGame"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import FooterButtons from '@/components/structure/FooterButtons.vue'
import { useStateStore, Round } from '@/store/state'
import Player from '@/services/enum/Player'
import BotCards from '@/services/BotCards'
import randomEnum from '@brdgm/brdgm-commons/src/util/random/randomEnum'
import ProsperityCards from '@/services/ProsperityCards'
import RowPlaceholders from '@/services/RowPlaceholders'
import TechCardSelection from '@/services/TechCardSelection'

export default defineComponent({
  name: 'SetupBot',
  components: {
    FooterButtons
  },
  setup() {
    const { t } = useI18n()
    const state = useStateStore()

    // determine start player
    let startPlayer = state.setup.startPlayer
    if (startPlayer === undefined) {
      startPlayer = randomEnum(Player)
    }

    return { t, state, startPlayer }
  },
  computed: {
    secondPlayer() : Player {
      if (this.startPlayer === Player.PLAYER) {
        return Player.BOT
      }
      else {
        return Player.PLAYER
      }
    }
  },
  methods: {
    startGame() : void {
      const rowPlaceholders = RowPlaceholders.new()
      const round : Round = {
        round: 1,
        startPlayer: this.startPlayer,
        architectPlayer: this.secondPlayer,
        prosperityCards: ProsperityCards.new().toPersistence(),
        botCards: BotCards.new(this.state.setup.difficultyLevel).toPersistence(),
        rowPlaceholders: rowPlaceholders.toPersistence(),
        techCardSelection: TechCardSelection.new(rowPlaceholders.rows, 1).toPersistence()
      }
      this.state.storeRound(round)
      this.$router.push('/round/1/drafting')
    }
  }
})
</script>

<style lang="scss" scoped>
.instructions {
  & > ul > li {
    margin-top: 0.5rem;
  }
}
</style>
