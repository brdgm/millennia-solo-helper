import Tech from '@/services/enum/Tech'
import TechPlaceholder from '@/services/enum/TechPlaceholder'

/**
 * Converts tech placeholder to undefined, keeps tech as is.
 * @returns Tech or undefined
 */
export default function toTech(tech: (Tech|TechPlaceholder)) : Tech|undefined {
  if (tech == TechPlaceholder.BLANK || tech == TechPlaceholder.EMPTY) {
    return undefined
  }
  return tech
}
