import { TechCardSelectionPersistence } from '@/store/state'
import Tech from './enum/Tech'
import TechPlaceholder from './enum/TechPlaceholder'
import { ref } from 'vue'
import { cloneDeep, shuffle } from 'lodash'
import getAllEnumValues from '@brdgm/brdgm-commons/src/util/enum/getAllEnumValues'
import DraftingRowCard from './DraftingRowCard'
import DraftingPriorityCard from './DraftingPriorityCard'
import TechMatch from './enum/TechMatch'
import getTechDuration from '@/util/getTechDuration'

/**
 * Manages the drafting of tech cards.
 */
export default class TechCardSelection {

  private readonly _techs
  private readonly _round : number

  private constructor(techs: (Tech|TechPlaceholder)[][], round: number) {
    this._techs = ref(techs)
    this._round = round
  }

  public get techs() : readonly (Tech|TechPlaceholder)[][] {
    return this._techs.value
  }

  /**
   * Gets persistence view.
   */
  public toPersistence() : TechCardSelectionPersistence {
    return {
      techs: this._techs.value
    }
  }

  /**
   * Determines the tech card to be drafted by Automa.
   * @param row Row selection
   * @param priority Priority selection
   * @param prosperityTechs Prosperity techs
   */
  public determineTech(rowCard: DraftingRowCard, priorityCard: DraftingPriorityCard, prosperityTechs: Tech[]) : Tech {
    for (const row of rowCard.rows) {
      const rowTechs = this._techs.value[row - 1]
      if (this.getOnlyTechs(rowTechs).length > 2) {
        for (const priority of priorityCard.priority) {
          const matchingIndexes = this.findMatchingIndexes(rowTechs, priority, prosperityTechs)
          for (const column of rowCard.columns) {
            if (matchingIndexes.includes(column - 1)) {
              return rowTechs[column - 1] as Tech
            }
          }
        }
      }
    }
    throw new Error('Not matching tech card found.')
  }
  
  private getOnlyTechs(techs: (Tech|TechPlaceholder)[]) : Tech[] {
    return techs.filter(tech => tech != TechPlaceholder.BLANK && tech != TechPlaceholder.EMPTY) as Tech[]
  }

  private findMatchingIndexes(techs: (Tech|TechPlaceholder)[], priority: (Tech|TechMatch), prosperityTechs: Tech[]) : number[] {
    const onlyTechs = this.getOnlyTechs(techs)
    const maxAge = onlyTechs.map(tech => getTechDuration(tech, this._round)).reduce((a,b) => Math.max(a,b), 0)
    let matchingTechs
    if (priority == TechMatch.MAX_AGE) {
      matchingTechs = onlyTechs.filter(tech => getTechDuration(tech, this._round) == maxAge)
    }
    else if (priority == TechMatch.PROSPERITY) {
      matchingTechs = onlyTechs.filter(tech => prosperityTechs.includes(tech))
    }
    else {
      matchingTechs = onlyTechs.filter(tech => tech == priority)
    }
    return matchingTechs.map(tech => techs.indexOf(tech))
  }

  /**
   * Removes a tech card.
   * @param tech Tech card.
   */
  public remove(tech: Tech) : void {
    this._techs.value.forEach((row,index) => {
      this._techs.value[index] = row.map(item => item == tech ? TechPlaceholder.EMPTY : item)
    })
  }

  /**
   * Creates a selection of techs in 4 ros respecting the placeholder rows.
   */
  public static new(placeholderRows: number[], round: number) : TechCardSelection {
    const allTechs = shuffle(getAllEnumValues(Tech))
    const techs : (Tech|TechPlaceholder)[][] = []
    for (let row = 1; row <= 4; row++) {
      if (placeholderRows.includes(row)) {
        techs.push([...allTechs.splice(0, 3), TechPlaceholder.BLANK])
      }
      else {
        techs.push(allTechs.splice(0, 4))
      }
    }
    return new TechCardSelection(techs, round)
  }

  /**
   * Re-creates from persistence.
   */
  public static fromPersistence(persistence : TechCardSelectionPersistence, round: number) : TechCardSelection {
    return new TechCardSelection(cloneDeep(persistence.techs), round)
  }

}
