import Tech from '@/services/enum/Tech'

/**
 * Get tech card color.
 * @param tech Tech card
 * @returns Color code
 */
export default function(tech: Tech) : string {
  switch (tech) {
    case Tech.AGRICULTURE:    return '#47914d'
    case Tech.ARMY:           return '#ce372f'
    case Tech.ARTS:           return '#e37d96'
    case Tech.COMMUNICATION:  return '#d88c34'
    case Tech.ECONOMICS:      return '#f0ba1d'
    case Tech.ENERGY:         return '#02586a'
    case Tech.ENGINEERING:    return '#6a4e3a'
    case Tech.GOVERNMENT:     return '#0382a0'
    case Tech.MEDICINE:       return '#d9d9d9'
    case Tech.MILITARY:       return '#ce372f'
    case Tech.SCIENCE:        return '#246d47'
    case Tech.SOCIAL_SCIENCE: return '#2a9e9e'
    case Tech.TRANSPORTATION: return '#7f7f7f'
    case Tech.WEAPONRY:       return '#ce372f'
    default:
      throw new Error(`Invalid tech ${tech}.`)
  }
}
