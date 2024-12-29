import Card from './Card'

export default interface DraftingRowCard extends Card {
  rows: number[],
  columns: number[]
}
