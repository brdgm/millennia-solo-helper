import { defineStore } from 'pinia'
import { name } from '@/../package.json'
import DifficultyLevel from '@/services/enum/DifficultyLevel'
import Player from '@/services/enum/Player'
import Tech from '@/services/enum/Tech'

export const useStateStore = defineStore(`${name}.state`, {
  state: () => {
    return {
      language: 'en',
      baseFontSize: 1.0,
      setup: {
        difficultyLevel: DifficultyLevel.NORMAL
      },
      rounds: []
    } as State
  },
  actions: {
    resetGame() {
      this.rounds = []
    },
    storeRound(round : Round) {
      this.rounds = this.rounds.filter(item => item.round < round.round)
      this.rounds.push(round)
    },
    storeDraftingTurn(turn : DraftingTurn) {
      const round = this.rounds.find(item => item.round == turn.round)
      if (!round) {
        throw new Error(`Round ${turn.round} not found.`)
      }
      round.draftingTurns = round.draftingTurns.filter(item => (item.turn < turn.turn))
      round.draftingTurns.push(turn)
    },
    storeConstructionTurn(turn : ConstructionTurn) {
      const round = this.rounds.find(item => item.round == turn.round)
      if (!round) {
        throw new Error(`Round ${turn.round} not found.`)
      }
      round.constructionTurns = round.constructionTurns.filter(item => (item.turn < turn.turn))
      round.constructionTurns.push(turn)
    }
  },
  persist: true
})

export interface State {
  language: string
  baseFontSize: number
  setup: Setup
  rounds: Round[]
}
export interface Setup {
  difficultyLevel: DifficultyLevel
  startPlayer?: Player
  debugMode?: boolean
}

export interface Round {
  round: number
  startPlayer: Player
  prosperityCards: ProsperityCardsPersistence
  botCards: BotCardsPersistence
  draftingTurns: DraftingTurn[]
  constructionTurns: ConstructionTurn[]
}
export interface DraftingTurn {
  round: number
  turn: number
}
export interface ConstructionTurn {
  round: number
  turn: number
}

export interface BotCardsPersistence {
  draftingRow: CardDeckPersistence
  draftingPriority: CardDeckPersistence
  construction: CardDeckPersistence
  war: CardDeckPersistence
}
export interface CardDeckPersistence {
  pile: number[]
  discard: number[]
}
export interface ProsperityCardsPersistence {
  pile: Tech[]
  current: Tech[][]
  discard: Tech[]
}
export interface RowPlaceholdersPersistence {
  rows: number[]
}
