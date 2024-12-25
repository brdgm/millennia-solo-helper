import { expect } from 'chai'
import RowPlaceholders from '@/services/RowPlaceholders'

describe('services/RowPlaceholders', () => {
  it('new', () => {
    const rowPlaceholders = RowPlaceholders.new()

    expect(rowPlaceholders.rows.length).to.eq(2)
    rowPlaceholders.rows.forEach(row => {
      expect(row).to.greaterThanOrEqual(1)
      expect(row).to.lessThanOrEqual(4)
    })

    const persistence = rowPlaceholders.toPersistence()
    expect(persistence.rows.length).to.eq(2)
  })

  it('fromPersistence', () => {
    const rowPlaceholders = RowPlaceholders.fromPersistence({rows: [1, 3]})
    expect(rowPlaceholders.rows).to.eql([1, 3])

    rowPlaceholders.prepareForNextRound()
    expect(rowPlaceholders.rows).to.eql([2, 4])

    rowPlaceholders.prepareForNextRound()
    expect(rowPlaceholders.rows).to.eql([3, 1])

    rowPlaceholders.prepareForNextRound()
    expect(rowPlaceholders.rows).to.eql([4, 2])

    rowPlaceholders.prepareForNextRound()
    expect(rowPlaceholders.rows).to.eql([1, 3])
  })
})
