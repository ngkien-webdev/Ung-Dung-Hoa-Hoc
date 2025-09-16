
import { Element, ElementCategory, ELEMENT_CATEGORIES } from './constants';
import { alkaliMetals } from './element-data/alkali-metals';
import { alkalineEarthMetals } from './element-data/alkaline-earth-metals';
import { transitionMetals } from './element-data/transition-metals';
import { postTransitionMetals } from './element-data/post-transition-metals';
import { metalloids } from './element-data/metalloids';
import { nonmetals } from './element-data/nonmetals';
import { nobleGases } from './element-data/noble-gases';
import { lanthanides } from './element-data/lanthanides';
import { actinides } from './element-data/actinides';
import { elementPositions } from './element-data/element-positions';

// Combine all element groups into a single array
export const elements: Element[] = [
  ...alkaliMetals,
  ...alkalineEarthMetals,
  ...transitionMetals,
  ...postTransitionMetals,
  ...metalloids,
  ...nonmetals,
  ...nobleGases,
  ...lanthanides,
  ...actinides,
].sort((a, b) => a.atomicNumber - b.atomicNumber);

// Export element positions for the periodic table grid
export { elementPositions };

// Search elements by name, symbol, or atomic number
export const searchElements = (query: string): Element[] => {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Return empty array for empty queries
  if (!normalizedQuery) return [];
  
  // Check if the query is a number (atomic number)
  const isNumeric = /^\d+$/.test(normalizedQuery);
  
  return elements.filter(element => {
    // Search by atomic number
    if (isNumeric && element.atomicNumber.toString() === normalizedQuery) {
      return true;
    }
    
    // Search by symbol (case insensitive)
    if (element.symbol.toLowerCase() === normalizedQuery) {
      return true;
    }
    
    // Search by name (partial match)
    if (element.name.toLowerCase().includes(normalizedQuery)) {
      return true;
    }
    
    // Search by category
    if (element.category.toLowerCase().includes(normalizedQuery)) {
      return true;
    }
    
    return false;
  });
};

// Group elements by their category
export const groupElementsByCategory = () => {
  const grouped: Record<ElementCategory, Element[]> = {
    "alkali-metal": [],
    "alkaline-earth": [],
    "transition-metal": [],
    "post-transition": [],
    "metalloid": [],
    "nonmetal": [],
    "noble-gas": [],
    "lanthanide": [],
    "actinide": [],
    "unknown": []
  };
  
  elements.forEach(element => {
    grouped[element.category].push(element);
  });
  
  return grouped;
};
