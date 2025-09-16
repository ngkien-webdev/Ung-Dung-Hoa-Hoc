
export const ELEMENT_CATEGORIES = {
  "alkali-metal": "Alkali Metal",
  "alkaline-earth": "Alkaline Earth Metal",
  "transition-metal": "Transition Metal",
  "post-transition": "Post-Transition Metal",
  "metalloid": "Metalloid",
  "nonmetal": "Nonmetal",
  "noble-gas": "Noble Gas",
  "lanthanide": "Lanthanide",
  "actinide": "Actinide",
  "unknown": "Unknown"
};

export type ElementCategory = keyof typeof ELEMENT_CATEGORIES;

export interface Element {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: number;
  category: ElementCategory;
  group: number | null;
  period: number;
  block: string;
  electronConfiguration: string;
  electronegativity: number | null;
  atomicRadius: number | null;
  ionizationEnergy: number | null;
  meltingPoint: number | null;
  boilingPoint: number | null;
  density: number | null;
  state: "solid" | "liquid" | "gas" | "unknown";
  discoveryYear: number | null;
  description: string;
  uses: string[];
  // Wiki-related fields
  wikiThumbnail?: string;
  wikiDescription?: string;
  viDescription?: string; // Vietnamese description from Wikipedia
  arDescription?: string; // Arabic description from Wikipedia
}

// Import from element-categories.ts
import { getCategoryColorClass as getColorClass, getCategoryTextClass as getTextClass } from './element-data/element-categories';

// Helper function to get the category color class - wrapper for backward compatibility
export const getCategoryColorClass = (category: ElementCategory) => {
  return getColorClass(category);
};

// Helper function to get the category text color class - wrapper for backward compatibility
export const getCategoryTextClass = (category: ElementCategory) => {
  return getTextClass(category);
};
