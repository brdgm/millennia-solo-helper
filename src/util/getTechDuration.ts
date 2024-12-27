import Tech from '@/services/enum/Tech'

/**
 * Get tech card duration for given age.
 * @param tech Tech card
 * @param round Age
 * @returns Tech duration
 */
export default function(tech: Tech, round: number) : number {
  const index = round - 1
  switch (tech) {
    case Tech.AGRICULTURE:    return [2,3,1,2,1,1,2,1][index]
    case Tech.ARMY:           return [1,1,1,2,2,3,2,1][index]
    case Tech.ARTS:           return [3,2,1,2,1,1,2,1][index]
    case Tech.COMMUNICATION:  return [2,2,2,1,2,2,1,1][index]
    case Tech.ECONOMICS:      return [2,2,2,2,2,2,1,1][index]
    case Tech.ENERGY:         return [2,2,1,1,2,2,2,1][index]
    case Tech.ENGINEERING:    return [2,2,2,2,2,2,2,1][index]
    case Tech.GOVERNMENT:     return [1,1,2,3,2,2,1,1][index]
    case Tech.MEDICINE:       return [2,1,3,1,2,2,1,1][index]
    case Tech.MILITARY:       return [2,2,1,3,2,1,1,1][index]
    case Tech.SCIENCE:        return [1,2,2,2,3,2,1,1][index]
    case Tech.SOCIAL_SCIENCE: return [2,2,1,1,2,3,2,1][index]
    case Tech.TRANSPORTATION: return [2,3,2,1,2,1,2,1][index]
    case Tech.WEAPONRY:       return [3,2,1,2,2,1,1,1][index]
    default:
      throw new Error(`Invalid tech ${tech}.`)
  }
}
