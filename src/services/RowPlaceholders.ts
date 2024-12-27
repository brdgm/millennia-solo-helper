import { RowPlaceholdersPersistence } from '@/store/state'
import { ref } from 'vue'
import { cloneDeep } from 'lodash'
import rollDiceMultiDifferentValue from '@brdgm/brdgm-commons/src/util/random/rollDiceMultiDifferentValue'

/**
 * Manages the placeholders for tech card drafting.
 */
export default class RowPlaceholders {

  private readonly _rows

  private constructor(rows : number[]) {
    this._rows = ref(rows)
  }

  public get rows() : readonly number[] {
    return this._rows.value
  }

  /**
   * Prepares placeholders for next round.
   */
  public prepareForNextRound() : void {
    this._rows.value = this._rows.value.map(row => {
      if (row == 4) {
        return 1
      }
      else {
        return row + 1
      }
    })
  }

  /**
   * Gets persistence view.
   */
  public toPersistence() : RowPlaceholdersPersistence {
    return {
      rows: this._rows.value
    }
  }

  /**
   * Determines two random rows.
   */
  public static new() : RowPlaceholders {
    const rows = rollDiceMultiDifferentValue(4, 2)
    return new RowPlaceholders(rows)
  }

  /**
   * Re-creates from persistence.
   */
  public static fromPersistence(persistence : RowPlaceholdersPersistence) : RowPlaceholders {
    return new RowPlaceholders(
      cloneDeep(persistence.rows)
    )
  }

}
