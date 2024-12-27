import Card from './Card'
import Tech from './enum/Tech'
import TechMatch from './enum/TechMatch'

export default interface DraftingPriorityCard extends Card {
  priority: (Tech|TechMatch)[]
}
