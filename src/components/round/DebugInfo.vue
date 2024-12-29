<template>
  <div class="mt-4" v-if="state.setup.debugMode">
    <hr/>
    <p class="debug">
      <b>draftingRow</b>: <span v-html="getCardDeckInfo(draftingRow)"></span><br/>
      <b>draftingPriority</b>: <span v-html="getCardDeckInfo(draftingPriority)"></span><br/>
      <b>construction</b>: <span v-html="getCardDeckInfo(construction)"></span><br/>
      <b>war</b>: <span v-html="getCardDeckInfo(war)"></span><br/>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStateStore } from '@/store/state'
import CardDeck from '@/services/CardDeck'
import NavigationState from '@/util/NavigationState'
import DraftingRowCard from '@/services/DraftingRowCard'
import DraftingPriorityCard from '@/services/DraftingPriorityCard'
import ConstructionCard from '@/services/ConstructionCard'
import WarCard from '@/services/WarCard'
import Card from '@/services/Card'

export default defineComponent({
  name: 'DebugInfo',
  setup() {
    const state = useStateStore()
    return { state }
  },
  props: {
    navigationState: {
      type: NavigationState,
      required: true
    }
  },
  computed: {
    draftingRow() : CardDeck<DraftingRowCard> {
      return this.navigationState.botCards.draftingRow
    },
    draftingPriority() : CardDeck<DraftingPriorityCard> {
      return this.navigationState.botCards.draftingPriority
    },
    construction() : CardDeck<ConstructionCard> {
      return this.navigationState.botCards.construction
    },
    war() : CardDeck<WarCard> {
      return this.navigationState.botCards.war
    }
  },
  methods: {
    getCardDeckInfo(deck: CardDeck<Card>) : string {
      return `<i>pile</i>: ${deck.pile.map(this.getCardInfo)}, <i>discard</i>: ${deck.discard.map(this.getCardInfo)}`
    },
    getCardInfo(card: any) : string {
      return '{' + Object.keys(card)
          .filter(key => key !== 'id')
          .map(key => `${key}: ${card[key]}`)
          .join(',') + '}'
    }
  }
})
</script>

<style lang="scss" scoped>
.debug {
  font-size: small;
}
p.debug, ul.debug {
  margin: 0;
}
</style>
