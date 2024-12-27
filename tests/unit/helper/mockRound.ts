import Player from '@/services/enum/Player'
import { BotCardsPersistence, ProsperityCardsPersistence, Round, RowPlaceholdersPersistence, TechCardSelectionPersistence } from '@/store/state'

export default function (params?: MockRoundParams) : Round {
  const round : Round = {
    round: params?.round ?? 1,
    startPlayer: params?.startPlayer ?? Player.PLAYER,
    architectPlayer: params?.architectPlayer ?? Player.BOT,
    prosperityCards: params?.prosperityCards ?? { pile:[], current: [], discard: [] },
    botCards: params?.botCards ?? {
      draftingRow: { pile: [], discard: [] },
      draftingPriority: { pile: [], discard: [] },
      construction: { pile: [], discard: [] },
      war: { pile: [], discard: [] }
    },
    rowPlaceholders: params?.rowPlaceholders ?? { rows: [] },
    techCardSelection: params?.techCardSelection ?? { techs: [], removedTechs: [] },
    nextStartPlayer: params?.nextStartPlayer,
    nextArchitectPlayer: params?.nextArchitectPlayer
  }
  return round
}

export interface MockRoundParams {
  round? : number,
  startPlayer?: Player,
  architectPlayer?: Player
  prosperityCards?: ProsperityCardsPersistence
  botCards?: BotCardsPersistence
  rowPlaceholders?: RowPlaceholdersPersistence
  techCardSelection?: TechCardSelectionPersistence
  nextStartPlayer?: Player,
  nextArchitectPlayer?: Player,
}
