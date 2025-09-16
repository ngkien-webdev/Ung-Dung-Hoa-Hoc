
export type ElementCategory = 
  | 'alkali-metal'
  | 'alkaline-earth'
  | 'transition-metal'
  | 'post-transition'
  | 'metalloid'
  | 'nonmetal'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide'
  | 'unknown';

export const ELEMENT_CATEGORIES: Record<ElementCategory, string> = {
  'alkali-metal': 'Alkali Metals',
  'alkaline-earth': 'Alkaline Earth Metals',
  'transition-metal': 'Transition Metals',
  'post-transition': 'Post-Transition Metals',
  'metalloid': 'Metalloids',
  'nonmetal': 'Nonmetals',
  'noble-gas': 'Noble Gases',
  'lanthanide': 'Lanthanides',
  'actinide': 'Actinides',
  'unknown': 'Unknown'
};

// Vietnamese translations for categories - these will be used in the LanguageContext
export const VI_ELEMENT_CATEGORIES: Record<ElementCategory, string> = {
  'alkali-metal': 'Kim Loại Kiềm',
  'alkaline-earth': 'Kim Loại Kiềm Thổ',
  'transition-metal': 'Kim Loại Chuyển Tiếp',
  'post-transition': 'Kim Loại Sau Chuyển Tiếp',
  'metalloid': 'Á Kim',
  'nonmetal': 'Phi Kim',
  'noble-gas': 'Khí Hiếm',
  'lanthanide': 'Lantan',
  'actinide': 'Actini',
  'unknown': 'Không Xác Định'
};

// Category color class mapping
export const getCategoryColorClass = (category: ElementCategory): string => {
  switch (category) {
    case 'alkali-metal':
      return 'bg-red-500';
    case 'alkaline-earth':
      return 'bg-orange-500';
    case 'transition-metal':
      return 'bg-yellow-500';
    case 'post-transition':
      return 'bg-green-500';
    case 'metalloid':
      return 'bg-teal-500';
    case 'nonmetal':
      return 'bg-blue-500';
    case 'noble-gas':
      return 'bg-purple-500';
    case 'lanthanide':
      return 'bg-pink-500';
    case 'actinide':
      return 'bg-rose-500';
    case 'unknown':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
};

// Category text color class mapping
export const getCategoryTextClass = (category: ElementCategory): string => {
  switch (category) {
    case 'alkali-metal':
      return 'text-red-500';
    case 'alkaline-earth':
      return 'text-orange-500';
    case 'transition-metal':
      return 'text-yellow-700'; // Make yellow darker for better visibility
    case 'post-transition':
      return 'text-green-600';
    case 'metalloid':
      return 'text-teal-600';
    case 'nonmetal':
      return 'text-blue-600';
    case 'noble-gas':
      return 'text-purple-600';
    case 'lanthanide':
      return 'text-pink-600';
    case 'actinide':
      return 'text-rose-600';
    case 'unknown':
      return 'text-gray-600';
    default:
      return 'text-gray-600';
  }
};

export default ELEMENT_CATEGORIES;
