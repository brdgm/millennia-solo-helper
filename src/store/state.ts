import { defineStore } from 'pinia'
import { name } from '@/../package.json'
import DifficultyLevel from '@/services/enum/DifficultyLevel'
import Player from '@/services/enum/Player'
import Tech from '@/services/enum/Tech'
import TechPlaceholder from '@/services/enum/TechPlaceholder'

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
      this.finalScoringAmount = undefined
    },
    storeRound(round : Round) {
      this.rounds = this.rounds.filter(item => item.round < round.round)
      this.rounds.push(round)
    }
  },
  persist: true
})

export interface State {
  language: string
  baseFontSize: number
  setup: Setup
  rounds: Round[]
  finalScoringAmount?: FinalScoringAmount
}
export interface Setup {
  difficultyLevel: DifficultyLevel
  startPlayer?: Player
  debugMode?: boolean
}

export interface Round {
  round: number
  startPlayer: Player
  architectPlayer: Player
  prosperityCards: ProsperityCardsPersistence
  botCards: BotCardsPersistence
  rowPlaceholders: RowPlaceholdersPersistence
  techCardSelection: TechCardSelectionPersistence
  nextStartPlayer?: Player
  nextArchitectPlayer?: Player
  botTechs?: Tech[]
  playerTechs?: Tech[]
  playerSpecialActions?: number
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
export interface TechCardSelectionPersistence {
  techs: (Tech|TechPlaceholder)[][]
  removedTechs: (Tech|TechPlaceholder)[]
}

export interface FinalScoringAmount {
  scoringTrackVP: number[]
  prosperityVP: number[]
  populationVP: number[]
  cultureVP: number[]
  influenceSteps: number[]
  politicsSteps: number[]
  warSteps: number[]
  wonderVPs: number[]
  yellowBuildingVPs: number[]
  diplomacyCardCount: number[]
  money: number[]
}
