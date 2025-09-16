
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define supported languages
export type Language = 'en' | 'vi';

// Content type for translations
type TranslationContent = Record<string, string>;

// Structure for all translations
type Translations = Record<Language, TranslationContent>;

// Create translation dictionary
const translations: Translations = {
  'en': {
    // App
    'app.title': 'Periodic Table of Elements',
    'app.description': 'Explore the elements and their properties',
    
    // UI
    'ui.searchPlaceholder': 'Search for elements...',
    'ui.searchResults': 'Search Results',
    'ui.filterByCategory': 'Filter by Category',
    'ui.advancedFilters': 'Advanced Filters',
    'ui.elementsInCategory': 'Elements in this category',
    'ui.filteredElements': 'Filtered Elements',
    'ui.showAll': 'Show All',
    'ui.compareElements': 'Compare Elements',
    'ui.suggestions': 'Suggested Elements',
    'ui.gridView': 'Grid View',
    'ui.listView': 'List View',
    'ui.elementAlreadyInComparison': 'Element already added to comparison',
    'ui.comparisonModeEnabled': 'Comparison mode enabled. Select up to 3 elements to compare.',
    'ui.filteredElementsCount': '{{count}} elements match your filters',
    'ui.noElementsMatchFilters': 'No elements match your filters',
    'ui.share': 'Share',
    'ui.shareError': 'Could not share element',
    'ui.copiedToClipboard': 'Element information copied to clipboard',
    'ui.copyError': 'Could not copy to clipboard',
    'ui.resetFilters': 'Reset Filters',
    'ui.filterElementsDescription': 'Refine your element search with multiple criteria',
    'ui.categories': 'Categories',
    'ui.states': 'States of Matter',
    'ui.atomicNumberRange': 'Atomic Number Range',
    'ui.atomicMassRange': 'Atomic Mass Range',
    'ui.elementsSelected': 'elements selected',
    'ui.newComparisonElementSelected': 'Now comparing with {{name}}',
    'ui.newComparison': 'New Comparison',
    'ui.loadingComparison': 'Loading comparison data...',
    'tab.compare': 'Compare',
    
    // Element categories
    'category.alkali-metal': 'Alkali Metal',
    'category.alkaline-earth': 'Alkaline Earth Metal',
    'category.transition-metal': 'Transition Metal',
    'category.post-transition': 'Post-Transition Metal',
    'category.metalloid': 'Metalloid',
    'category.nonmetal': 'Nonmetal',
    'category.noble-gas': 'Noble Gas',
    'category.lanthanide': 'Lanthanide',
    'category.actinide': 'Actinide',
    'category.unknown': 'Unknown',
    
    // Element names
    'element.name.flerovium': 'Flerovium',
    'element.name.radon': 'Radon',
    'element.name.samarium': 'Samarium',
    'element.name.neptunium': 'Neptunium',
    'element.name.lawrencium': 'Lawrencium',
    'element.name.mendelevium': 'Mendelevium',
    'element.name.hydrogen': 'Hydrogen',
    
    // UI and Navigation
    'tab.table': 'Periodic Table',
    'category.title': 'Categories',
    'nav.home': 'Periodic Table',
    'nav.search': 'Search',
    'nav.learn': 'Learn',
    'nav.reactions': 'Reactions',
    'nav.quiz': 'Quiz',
    
    // Search page
    'search.title': 'Search Elements',
    'search.description': 'Explore the periodic table and learn about the elements',
    'search.placeholder': 'Enter element name, symbol, or atomic number',
    'search.noResults': 'No elements found',
    'search.recentSearches': 'Recent Searches',
    'search.clearRecent': 'Clear',
    'search.suggestedElements': 'Suggested Elements',
    'search.results': 'Search Results',
    'search.voiceSearch': 'Voice Search',
    'search.listening': 'Listening...',
    'search.voiceDetected': 'Voice detected',
    'search.voiceError': 'Error recognizing voice',
    'search.voiceNotSupported': 'Voice search is not supported in your browser',
    'language.current': 'en-US',
    
    // Navigation
    'navbar.home': 'Periodic Table',
    'navbar.search': 'Search',
    'navbar.learn': 'Learn',
    'navbar.reactions': 'Reactions',
    'navbar.quiz': 'Quiz',
    
    // Element details
    'element.details': 'Element Details',
    'element.atomicNumber': 'Atomic Number',
    'element.atomicMass': 'Atomic Mass',
    'element.category': 'Category',
    'element.group': 'Group',
    'element.period': 'Period',
    'element.block': 'Block',
    'element.electronConfiguration': 'Electron Configuration',
    'element.electronegativity': 'Electronegativity',
    'element.atomicRadius': 'Atomic Radius',
    'element.ionizationEnergy': 'Ionization Energy',
    'element.meltingPoint': 'Melting Point',
    'element.boilingPoint': 'Boiling Point',
    'element.density': 'Density',
    'element.yearDiscovered': 'Year Discovered',
    'element.discoveredBy': 'Discovered By',
    'element.summary': 'Summary',
    'element.facts': 'Interesting Facts',
    'element.uses': 'Common Uses',
    
    // Element states
    'element.state.gas': 'Gas',
    'element.state.liquid': 'Liquid',
    'element.state.solid': 'Solid',
    'element.state.unknown': 'Unknown',
    
    // Common element properties
    'property.state': 'State',
    'property.group': 'Group',
    'property.period': 'Period',
    'property.block': 'Block',
    'property.discovery': 'Discovery Year',
    'property.electronConfig': 'Electron Configuration',
    'property.electronegativity': 'Electronegativity',
    'property.atomicRadius': 'Atomic Radius',
    'property.ionizationEnergy': 'Ionization Energy',
    'property.density': 'Density',
    
    // Tabs
    'tab.details': 'Details',
    'tab.visualization': 'Visualization',
    'tab.data': 'Data',
    'tab.information': 'Information',
    'tab.visual3D': '3D Visual',
    
    // Sections
    'section.basicInfo': 'Basic Information',
    'section.atomicProperties': 'Atomic Properties',
    'section.physicalProperties': 'Physical Properties',
    'section.description': 'Description',
    'section.commonUses': 'Common Uses',
    
    // UI elements
    'ui.elementInformation': 'Element Information',
    'ui.detailedInfo': 'Detailed information about',
    'ui.viewFullDetails': 'View Full Details',
    
    // Common messages
    'common.unknown': 'Unknown',
    'common.loading': 'Loading...',
    'common.viewOnWikipedia': 'View on Wikipedia',
    'common.noDescription': 'No description available',
    'common.noInformation': 'No information available',
    'common.failedToLoad': 'Failed to load information',
    
    // Reactions
    'reactions.title': 'Chemical Reactions',
    'reactions.description': 'Explore different types of chemical reactions and how elements interact',
    'reactions.search': 'Search for reactions',
    'reactions.popularReactions': 'Popular Reactions',
    'reactions.reactionTypes': 'Reaction Types',
    'reactions.waterFormation': 'Water Formation',
    'reactions.waterDescription': 'Hydrogen reacts with oxygen to form water',
    'reactions.synthesis': 'Synthesis',
    'reactions.decomposition': 'Decomposition',
    'reactions.singleReplacement': 'Single Replacement',
    'reactions.doubleReplacement': 'Double Replacement',
    'reactions.combustion': 'Combustion',
    'reactions.acidBase': 'Acid-Base',
    'reactions.redox': 'Redox',
    'reactions.precipitation': 'Precipitation',
    'reaction.visualization': 'Reaction Visualization',
    'reaction.progress': 'Reaction Progress',
    'reaction.speed': 'Speed',
    'reaction.temperature': 'Temperature',
    'reaction.currentPhase': 'Current Phase',
    'reaction.explanation': 'Explanation',
    'reaction.reactants': 'Reactants',
    'reaction.transitionState': 'Transition State',
    'reaction.products': 'Products',
    'reaction.reactantsExplanation': 'Reactants are approaching each other to begin the reaction',
    'reaction.transitionExplanation': 'Elements are interacting at the atomic level forming a transition state',
    'reaction.productsExplanation': 'The reaction is complete, forming stable products',
    'reaction.highTempEffect': 'High temperature increases the reaction rate',
    'reaction.lowTempEffect': 'Low temperature decreases the reaction rate',
    'reaction.product': 'Product',
    'atom.dragToRotate': 'Drag to rotate',
    
    // Additional reactions translations
    'reactions.explore': 'Explore Reactions',
    'reactions.create': 'Create Reaction',
    'reactions.visualization': 'Reaction Visualization',
    'reactions.customReaction': 'Custom Reaction',
    'reactions.customDescription': 'Create your own chemical reaction by adding reactants and products',
    'reactions.name': 'Reaction Name',
    'reactions.reactants': 'Reactants',
    'reactions.products': 'Products',
    'reactions.add': 'Add',
    'reactions.save': 'Save Reaction',
    'reactions.preview': 'Preview',
    'reactions.saved': 'Reaction saved successfully!',
    'reactions.3dView': '3D View',
    'reactions.2dView': '2D View',
    'reactions.animationSpeed': 'Animation Speed',
    'reactions.slow': 'Slow',
    'reactions.medium': 'Medium',
    'reactions.fast': 'Fast',
    'reactions.resetView': 'Reset View',
    'reactions.shareReaction': 'Share Reaction',
    'reactions.copied': 'Reaction copied to clipboard',
    'reactions.temperature': 'Temperature',
    'reactions.increaseTemp': 'Increase Temperature',
    'reactions.decreaseTemp': 'Decrease Temperature',
    'reactions.downloadImage': 'Download Image',
    'reactions.fullscreen': 'Fullscreen',
    'reactions.showBonds': 'Show Bonds',
    'reactions.hideBonds': 'Hide Bonds',
    'reactions.atomicView': 'Atomic View',
    'reactions.molecularView': 'Molecular View',
    'reactions.report': 'Report',
    'reactions.showReport': 'Show Report',
    'reactions.appReport': 'Interactive Chemistry Application Report',
    'reactions.reportDescription': 'Comprehensive analysis of features and functionality',
    'reactions.reportOverview': 'Application Overview',
    'reactions.reportOverviewText': 'This interactive chemistry application is designed to provide an engaging and educational platform for exploring the periodic table of elements and chemical reactions. With a focus on visual learning and interactivity, the application aims to make chemistry more accessible and enjoyable for users of all levels.',
    'reactions.reportMainFeatures': 'Main Features',
    'reactions.featurePeriodicTable': 'Interactive Periodic Table',
    'reactions.featureReactions': '3D Chemical Reaction Visualizations',
    'reactions.featureSearch': 'Advanced Element Search & Filtering',
    'reactions.featureComparison': 'Element Comparison Tools',
    'reactions.featureQuiz': 'Knowledge Assessment Quizzes',
    'reactions.featureMultilingual': 'Multilingual Support (English, Vietnamese)',
    'reactions.reportTargetAudience': 'Target Audience',
    'reactions.audienceStudents': 'Chemistry Students (Secondary & Higher Education)',
    'reactions.audienceEducators': 'Science Educators & Teachers',
    'reactions.audienceEnthusiasts': 'Chemistry Enthusiasts & Hobbyists',
    'reactions.audienceProfessionals': 'Chemistry Professionals & Researchers',
    'reactions.audienceGeneral': 'General Public with Interest in Science',
    'reactions.reportTechnical': 'Technical Highlights',
    'reactions.reportFrontend': 'Frontend Technology',
    'reactions.reportVisualization': 'Visualization Technology',
    'reactions.reportPerformance': 'Performance Optimization',
    'reactions.reportImpact': 'Educational Impact',
    'reactions.reportImpactText': 'This application aims to transform chemistry education by providing:',
    'reactions.reportLearningEnhancement': 'Learning Enhancement',
    'reactions.reportLearningText': 'Visual representations of abstract concepts make learning more intuitive and memorable. The interactive nature of the application promotes active learning and deeper understanding of chemical principles.',
    'reactions.reportAccessibility': 'Accessibility',
    'reactions.reportAccessibilityText': 'By providing multilingual support and designing with accessibility in mind, the application makes chemistry education more inclusive and available to diverse learners worldwide.',
    'reactions.reportRoadmap': 'Future Development Roadmap',
    'reactions.reportExpansionTitle': 'Content Expansion',
    'reactions.reportExpansionText': 'Add more complex reactions, organic chemistry visualizations, and detailed element information.',
    'reactions.reportAR': 'AR/VR Integration',
    'reactions.reportARText': 'Implement augmented and virtual reality features for immersive learning experiences.',
    'reactions.reportCollaboration': 'Collaborative Features',
    'reactions.reportCollaborationText': 'Add real-time collaboration tools for classroom use and group learning.',
    'reactions.reportVersion': 'Current Version: 1.5.0',
    'reactions.closeReport': 'Close Report',
    
    // Learn page
    'learn.title': 'Learn Chemistry',
    'learn.description': 'Explore the fundamentals of chemistry and the periodic table',
    'learn.understanding': 'Understanding the fundamentals',
    'learn.clickBoxes': 'Click for details',
    'learn.closeDetails': 'Close',
    'learn.exploreTable': 'Explore Periodic Table',
    'learn.additionalResources': 'Additional Learning Resources',
    'learn.resourcesDesc': 'Explore these resources to deepen your understanding of chemistry',
    'learn.exploring': 'Exploring the',
    
    // Learn sections
    'learn.basics.title': 'Basics of Chemistry',
    'learn.categories.title': 'Element Categories',
    'learn.properties.title': 'Element Properties',
    'learn.advanced.title': 'Advanced Topics',
    
    // Learn basics
    'learn.basics.atomTitle': 'What is an Atom?',
    'learn.basics.atomDescription': 'Atoms are the basic units of matter and the defining structure of elements. They consist of three particles: protons, neutrons, and electrons.',
    'learn.basics.structureTitle': 'Atomic Structure',
    'learn.basics.nucleus': 'Nucleus',
    'learn.basics.nucleusDescription': 'Contains protons and neutrons, makes up most of the atom\'s mass.',
    'learn.basics.electrons': 'Electrons',
    'learn.basics.electronsDescription': 'Negatively charged particles that orbit the nucleus in shells.',
    'learn.basics.shells': 'Electron Shells',
    'learn.basics.shellsDescription': 'Energy levels where electrons are found around the nucleus.',
    'learn.basics.tableTitle': 'The Periodic Table',
    'learn.basics.tableDescription': 'The periodic table organizes all known elements based on their atomic number, electron configurations, and recurring chemical properties.',
    'learn.basics.didYouKnow': 'Did you know?',
    'learn.basics.fact1': 'If you could see atoms, you would know that everything is mostly empty space.',
    'learn.basics.fact2': 'There are 118 known elements on the periodic table, but only about 90 occur naturally.',
    
    // Learn categories
    'learn.categories.description': 'Elements in the periodic table are organized into categories based on their properties and electron configurations.',
    'learn.categories.examples': 'Examples',
    'learn.categories.funFacts': 'Fun Facts About Categories',
    'learn.categories.alkaliFact': 'They are so reactive that they must be stored in oil to prevent them from reacting with air.',
    'learn.categories.nobleFact': 'They were once called "inert gases" because scientists thought they couldn\'t form compounds.',
    'learn.categories.transitionFact': 'Almost all transition metals can form multiple ions with different charges.',
    
    // Category descriptions
    'learn.categories.alkaliDesc': 'Highly reactive metals that have one electron in their outer shell. They react vigorously with water.',
    'learn.categories.alkalineDesc': 'Reactive metals with two electrons in their outer shell. They are harder and denser than alkali metals.',
    'learn.categories.transitionDesc': 'Metals with partially filled d-orbitals. They often form colorful compounds and can have multiple oxidation states.',
    'learn.categories.postDesc': 'Metals that are typically soft with lower melting points. They have completed d-orbitals but incompletely filled p-orbitals.',
    'learn.categories.metalloidDesc': 'Elements with properties of both metals and nonmetals. They are typically semiconductors.',
    'learn.categories.nonmetalDesc': 'Elements that are poor conductors of heat and electricity. They typically gain electrons in reactions.',
    'learn.categories.nobleDesc': 'Extremely stable elements with full outer electron shells. They rarely form compounds.',
    'learn.categories.lanthanideDesc': 'Rare earth elements with filled 4f orbitals. They have similar properties and are often found together.',
    'learn.categories.actinideDesc': 'Radioactive elements with partially filled 5f orbitals. All are unstable and decay over time.',
    'learn.categories.unknownDesc': 'Information about this category is not available.',
    
    // Learn properties
    'learn.properties.description': 'Elements have various physical and chemical properties that determine how they behave and interact with other elements.',
    'learn.properties.physical': 'Physical Properties',
    'learn.properties.chemical': 'Chemical Properties',
    'learn.properties.meltingPoints': 'Melting & Boiling Points',
    'learn.properties.meltingPointsDesc': 'Temperatures at which elements change between solid, liquid, and gas states.',
    'learn.properties.density': 'Density',
    'learn.properties.densityDesc': 'Mass per unit volume, determining how heavy an element feels.',
    'learn.properties.state': 'State of Matter',
    'learn.properties.stateDesc': 'Whether an element is a solid, liquid, or gas at room temperature.',
    'learn.properties.electronegativity': 'Electronegativity',
    'learn.properties.electronegativityDesc': 'An element\'s ability to attract electrons in a chemical bond.',
    'learn.properties.ionization': 'Ionization Energy',
    'learn.properties.ionizationDesc': 'Energy required to remove an electron from an atom.',
    'learn.properties.electronConfig': 'Electron Configuration',
    'learn.properties.electronConfigDesc': 'The arrangement of electrons in an atom\'s shells.',
    'learn.properties.periodicTrends': 'Periodic Trends',
    'learn.properties.trendsDescription': 'Patterns in element properties that can be observed across the periodic table.',
    
    // Learn advanced
    'learn.advanced.description': 'Explore more advanced concepts in chemistry that build upon the fundamental principles.',
    'learn.advanced.quantum': 'Quantum Mechanics',
    'learn.advanced.quantumDesc': 'Quantum mechanics provides a mathematical description of the wave-like behavior of particles at the atomic scale. It explains how electrons exist as probability clouds rather than definite orbits around the nucleus.',
    'learn.advanced.keyPoints': 'Key Concepts:',
    'learn.advanced.uncertainty': 'Heisenberg\'s Uncertainty Principle',
    'learn.advanced.waveFunctions': 'Wave Functions',
    'learn.advanced.quantization': 'Quantization of Energy',
    'learn.advanced.deepDive': 'Deep Dive: Quantum Numbers',
    'learn.advanced.quantumNumbersDesc': 'Four quantum numbers describe each electron in an atom:',
    'learn.advanced.bonding': 'Chemical Bonding',
    'learn.advanced.bondingDesc': 'Chemical bonds are the forces that hold atoms together in molecules and compounds. The type of bond formed depends on the properties of the participating atoms.',
    'learn.advanced.ionic': 'Ionic Bonds',
    'learn.advanced.ionicDesc': 'Formed when electrons transfer between atoms, creating oppositely charged ions.',
    'learn.advanced.covalent': 'Covalent Bonds',
    'learn.advanced.covalentDesc': 'Formed when atoms share electrons to complete their outer shells.',
    'learn.advanced.metallic': 'Metallic Bonds',
    'learn.advanced.metallicDesc': 'Formed in metals, with electrons freely moving between atoms.',
    'learn.advanced.periodicity': 'Periodic Trends',
    'learn.advanced.periodicityDesc': 'The periodic table is arranged so that elements with similar properties appear in the same column. This arrangement reveals patterns in element properties across periods and groups.',
    'learn.advanced.trends': 'Major Trends:',
    'learn.advanced.atomicRadius': 'Atomic Radius:',
    'learn.advanced.atomicRadiusDesc': 'Decreases across a period, increases down a group',
    'learn.advanced.ionizationEnergy': 'Ionization Energy:',
    'learn.advanced.ionizationEnergyDesc': 'Increases across a period, decreases down a group',
    'learn.advanced.electronAffinity': 'Electron Affinity:',
    'learn.advanced.electronAffinityDesc': 'Generally increases across a period',
    'learn.advanced.interactiveNote': 'Historical Note',
    'learn.advanced.periodicHistory': 'Dmitri Mendeleev created the first widely recognized periodic table in 1869. He arranged the elements by increasing atomic weight and noticed a periodic pattern in their properties. Impressively, he left gaps for elements that hadn\'t been discovered yet and successfully predicted their properties.',
    'learn.advanced.isotopes': 'Isotopes & Nuclear Chemistry',
    'learn.advanced.isotopesDesc': 'Isotopes are atoms of the same element with different numbers of neutrons, resulting in different atomic masses but identical chemical properties.',
    'learn.advanced.commonIsotopes': 'Common Isotopes',
    'learn.advanced.nuclearReactions': 'Nuclear Reactions',
    'learn.advanced.nuclearDesc': 'Nuclear reactions involve changes to the nucleus of an atom and can release enormous amounts of energy.',
    
    // Resources
    'learn.resources.interactiveModels': 'Interactive Atomic Models',
    'learn.resources.modelsDesc': 'Explore interactive 3D models of atoms and molecules to better understand chemical structures.',
    'learn.resources.explore': 'Explore Models',
    'learn.resources.experiments': 'Virtual Lab Experiments',
    'learn.resources.experimentsDesc': 'Conduct virtual chemistry experiments safely from your computer to see reactions in action.',
    'learn.resources.tryLab': 'Try Lab Experiments',
    'learn.resources.courses': 'Online Chemistry Courses',
    'learn.resources.coursesDesc': 'Access free online courses from top universities and educational platforms.',
    'learn.resources.browseCourses': 'Browse Courses',
    'learn.resources.videos': 'Educational Videos',
    'learn.resources.videosDesc': 'Watch educational videos explaining complex chemistry concepts in simple terms.',
    'learn.resources.watchVideos': 'Watch Videos',
    'learn.resources.allResources': 'View All Resources',
    
    // Language
    'language.select': 'Select Language',
    'language.en': 'English',
    'language.vi': 'Vietnamese',
    'language.changed': 'Language changed',
    
    // Quiz
    'quiz.title': 'Test Your Knowledge',
    'quiz.description': 'Challenge yourself with quizzes on elements and chemistry concepts',
    'quiz.startQuiz': 'Start Quiz',
    'quiz.settings': 'Settings',
    'quiz.questionCount': 'Number of Questions',
    'quiz.questionTypes': 'Question Types',
    'quiz.elementSymbols': 'Element Symbols',
    'quiz.elementCategories': 'Element Categories',
    'quiz.elementProperties': 'Element Properties',
    'quiz.timeLimit': 'Time Limit',
    'quiz.selectTimeLimit': 'Select time limit',
    'quiz.noTimeLimit': 'No time limit',
    'quiz.minute': '1 minute',
    'quiz.minutes': '{{count}} minutes',
    'quiz.elementSymbolsDesc': 'Identify chemical symbols for elements across the periodic table.',
    'quiz.elementCategoriesDesc': 'Test your knowledge of which category different elements belong to.',
    'quiz.elementPropertiesDesc': 'Answer questions about properties like melting points, density, and more.',
    'quiz.instructions': 'Instructions',
    'quiz.instructionsItem1': 'Select an answer for each question',
    'quiz.instructionsItem2': 'Submit your answer to see if you\'re correct',
    'quiz.instructionsItem3': 'Track your progress and improve your score',
    'quiz.question': 'Question',
    'quiz.of': 'of',
    'quiz.submit': 'Submit Answer',
    'quiz.next': 'Next Question',
    'quiz.finish': 'Finish Quiz',
    'quiz.correct': 'Correct!',
    'quiz.incorrect': 'Incorrect!',
    'quiz.correctAnswer': 'The correct answer is',
    'quiz.results': 'Quiz Results',
    'quiz.score': 'Your Score',
    'quiz.tryAgain': 'Try Again',
    'quiz.selectOption': 'Please select an option',
    'quiz.history': 'Quiz History',
    'quiz.lastScore': 'Last Score',
    'quiz.bestScore': 'Best Score',
    'quiz.accuracy': 'accuracy',
    'quiz.totalQuizzes': 'Total Quizzes Taken'
  },
  'vi': {
    // App
    'app.title': 'Bảng Tuần Hoàn Các Nguyên Tố',
    'app.description': 'Khám phá các nguyên tố và tính chất của chúng',
    
    // UI
    'ui.searchPlaceholder': 'Tìm kiếm nguyên tố...',
    'ui.searchResults': 'Kết Quả Tìm Kiếm',
    'ui.filterByCategory': 'Lọc theo Danh Mục',
    'ui.advancedFilters': 'Bộ Lọc Nâng Cao',
    'ui.elementsInCategory': 'Các nguyên tố trong danh mục này',
    'ui.filteredElements': 'Các Nguyên Tố Đã Lọc',
    'ui.showAll': 'Hiển Thị Tất Cả',
    'ui.compareElements': 'So Sánh Các Nguyên Tố',
    'ui.suggestions': 'Nguyên Tố Gợi Ý',
    'ui.gridView': 'Xem Dạng Lưới',
    'ui.listView': 'Xem Dạng Danh Sách',
    'ui.elementAlreadyInComparison': 'Nguyên tố đã được thêm vào so sánh',
    'ui.comparisonModeEnabled': 'Đã bật chế độ so sánh. Chọn tối đa 3 nguyên tố để so sánh.',
    'ui.filteredElementsCount': '{{count}} nguyên tố phù hợp với bộ lọc của bạn',
    'ui.noElementsMatchFilters': 'Không có nguyên tố nào phù hợp với bộ lọc của bạn',
    'ui.share': 'Chia Sẻ',
    'ui.shareError': 'Không thể chia sẻ nguyên tố',
    'ui.copiedToClipboard': 'Thông tin nguyên tố đã được sao chép vào bộ nhớ tạm',
    'ui.copyError': 'Không thể sao chép vào bộ nhớ tạm',
    'ui.resetFilters': 'Đặt Lại Bộ Lọc',
    'ui.filterElementsDescription': 'Tinh chỉnh tìm kiếm nguyên tố với nhiều tiêu chí',
    'ui.categories': 'Danh Mục',
    'ui.states': 'Trạng Thái Vật Chất',
    'ui.atomicNumberRange': 'Phạm Vi Số Nguyên Tử',
    'ui.atomicMassRange': 'Phạm Vi Khối Lượng Nguyên Tử',
    'ui.elementsSelected': 'đã chọn nguyên tố',
    'ui.newComparisonElementSelected': 'Đang so sánh với {{name}}',
    'ui.newComparison': 'So Sánh Mới',
    'ui.loadingComparison': 'Đang tải dữ liệu so sánh...',
    'tab.compare': 'So Sánh',
    
    // Element categories
    'category.alkali-metal': 'Kim Loại Kiềm',
    'category.alkaline-earth': 'Kim Loại Kiềm Thổ',
    'category.transition-metal': 'Kim Loại Chuyển Tiếp',
    'category.post-transition': 'Kim Loại Sau Chuyển Tiếp',
    'category.metalloid': 'Á Kim',
    'category.nonmetal': 'Phi Kim',
    'category.noble-gas': 'Khí Hiếm',
    'category.lanthanide': 'Lantan',
    'category.actinide': 'Actini',
    'category.unknown': 'Không xác định',
    
    // Element names
    'element.name.flerovium': 'Flerovi',
    'element.name.radon': 'Radon',
    'element.name.samarium': 'Samari',
    'element.name.neptunium': 'Neptuni',
    'element.name.lawrencium': 'Lorenxi',
    'element.name.mendelevium': 'Mendelevi',
    'element.name.hydrogen': 'Hiđrô',
    
    // UI and Navigation
    'tab.table': 'Bảng Tuần Hoàn',
    'category.title': 'Danh Mục',
    'nav.home': 'Bảng Tuần Hoàn',
    'nav.search': 'Tìm Kiếm',
    'nav.learn': 'Học Tập',
    'nav.reactions': 'Phản Ứng',
    'nav.quiz': 'Trắc Nghiệm',
    
    // Search page
    'search.title': 'Tìm Kiếm Nguyên Tố',
    'search.description': 'Khám phá bảng tuần hoàn và tìm hiểu về các nguyên tố',
    'search.placeholder': 'Nhập tên, ký hiệu hoặc số nguyên tử',
    'search.noResults': 'Không tìm thấy nguyên tố nào',
    'search.recentSearches': 'Tìm Kiếm Gần Đây',
    'search.clearRecent': 'Xóa',
    'search.suggestedElements': 'Nguyên Tố Gợi Ý',
    'search.results': 'Kết Quả Tìm Kiếm',
    'search.voiceSearch': 'Tìm Kiếm Bằng Giọng Nói',
    'search.listening': 'Đang lắng nghe...',
    'search.voiceDetected': 'Đã nhận dạng giọng nói',
    'search.voiceError': 'Lỗi nhận dạng giọng nói',
    'search.voiceNotSupported': 'Trình duyệt của bạn không hỗ trợ tính năng tìm kiếm bằng giọng nói',
    'language.current': 'vi-VN',
    
    // Navigation
    'navbar.home': 'Bảng Tuần Hoàn',
    'navbar.search': 'Tìm Kiếm',
    'navbar.learn': 'Học Tập',
    'navbar.reactions': 'Phản Ứng',
    'navbar.quiz': 'Trắc Nghiệm',
    
    // Element details
    'element.details': 'Chi Tiết Nguyên Tố',
    'element.atomicNumber': 'Số Nguyên Tử',
    'element.atomicMass': 'Khối Lượng Nguyên Tử',
    'element.category': 'Danh Mục',
    'element.group': 'Nhóm',
    'element.period': 'Chu Kỳ',
    'element.block': 'Khối',
    'element.electronConfiguration': 'Cấu Hình Electron',
    'element.electronegativity': 'Độ Âm Điện',
    'element.atomicRadius': 'Bán Kính Nguyên Tử',
    'element.ionizationEnergy': 'Năng Lượng Ion Hóa',
    'element.meltingPoint': 'Điểm Nóng Chảy',
    'element.boilingPoint': 'Điểm Sôi',
    'element.density': 'Mật Độ',
    'element.yearDiscovered': 'Năm Phát Hiện',
    'element.discoveredBy': 'Người Phát Hiện',
    'element.summary': 'Tóm Tắt',
    'element.facts': 'Sự Thật Thú Vị',
    'element.uses': 'Công Dụng Phổ Biến',
    
    // Element states
    'element.state.gas': 'Khí',
    'element.state.liquid': 'Lỏng',
    'element.state.solid': 'Rắn',
    'element.state.unknown': 'Không rõ',
    
    // Common element properties  
    'property.state': 'Trạng Thái',
    'property.group': 'Nhóm',
    'property.period': 'Chu Kỳ',
    'property.block': 'Khối',
    'property.discovery': 'Năm Phát Hiện',
    'property.electronConfig': 'Cấu Hình Electron',
    'property.electronegativity': 'Độ Âm Điện',
    'property.atomicRadius': 'Bán Kính Nguyên Tử',
    'property.ionizationEnergy': 'Năng Lượng Ion Hóa',
    'property.density': 'Mật Độ',
    
    // Tabs
    'tab.details': 'Chi Tiết',
    'tab.visualization': 'Hình Ảnh',
    'tab.data': 'Dữ Liệu',
    'tab.information': 'Thông Tin',
    'tab.visual3D': 'Hình Ảnh 3D',
    
    // Sections
    'section.basicInfo': 'Thông Tin Cơ Bản',
    'section.atomicProperties': 'Thuộc Tính Nguyên Tử',
    'section.physicalProperties': 'Thuộc Tính Vật Lý',
    'section.description': 'Mô Tả',
    'section.commonUses': 'Ứng Dụng Phổ Biến',
    
    // UI elements
    'ui.elementInformation': 'Thông Tin Nguyên Tố',
    'ui.detailedInfo': 'Thông tin chi tiết về',
    'ui.viewFullDetails': 'Xem Chi Tiết Đầy Đủ',
    
    // Common messages
    'common.unknown': 'Không rõ',
    'common.loading': 'Đang tải...',
    'common.viewOnWikipedia': 'Xem trên Wikipedia',
    'common.noDescription': 'Không có mô tả',
    'common.noInformation': 'Không có thông tin',
    'common.failedToLoad': 'Không thể tải thông tin',
    
    // Reactions
    'reactions.title': 'Phản Ứng Hóa Học',
    'reactions.description': 'Khám phá các loại phản ứng hóa học khác nhau và cách các nguyên tố tương tác',
    'reactions.search': 'Tìm kiếm phản ứng',
    'reactions.popularReactions': 'Phản Ứng Phổ Biến',
    'reactions.reactionTypes': 'Loại Phản Ứng',
    'reactions.waterFormation': 'Sự Hình Thành Nước',
    'reactions.waterDescription': 'Hydro phản ứng với oxy để tạo thành nước',
    'reactions.synthesis': 'Tổng Hợp',
    'reactions.decomposition': 'Phân Hủy',
    'reactions.singleReplacement': 'Thay Thế Đơn',
    'reactions.doubleReplacement': 'Thay Thế Kép',
    'reactions.combustion': 'Đốt Cháy',
    'reactions.acidBase': 'Axit-Bazơ',
    'reactions.redox': 'Oxi Hóa Khử',
    'reactions.precipitation': 'Kết Tủa',
    'reaction.visualization': 'Hình Ảnh Phản Ứng',
    'reaction.progress': 'Tiến Trình Phản Ứng',
    'reaction.speed': 'Tốc Độ',
    'reaction.temperature': 'Nhiệt Độ',
    'reaction.currentPhase': 'Pha Hiện Tại',
    'reaction.explanation': 'Giải Thích',
    'reaction.reactants': 'Chất Phản Ứng',
    'reaction.transitionState': 'Trạng Thái Chuyển Tiếp',
    'reaction.products': 'Sản Phẩm',
    'reaction.reactantsExplanation': 'Các chất phản ứng đang tiếp cận nhau để bắt đầu phản ứng',
    'reaction.transitionExplanation': 'Các nguyên tố đang tương tác ở cấp độ nguyên tử tạo thành trạng thái chuyển tiếp',
    'reaction.productsExplanation': 'Phản ứng đã hoàn thành, tạo thành các sản phẩm ổn định',
    'reaction.highTempEffect': 'Nhiệt độ cao làm tăng tốc độ phản ứng',
    'reaction.lowTempEffect': 'Nhiệt độ thấp làm giảm tốc độ phản ứng',
    'reaction.product': 'Sản Phẩm',
    'atom.dragToRotate': 'Kéo để xoay',
    
    // Additional reactions translations
    'reactions.explore': 'Khám Phá Phản Ứng',
    'reactions.create': 'Tạo Phản Ứng',
    'reactions.visualization': 'Trực Quan Hóa Phản Ứng',
    'reactions.customReaction': 'Phản Ứng Tùy Chỉnh',
    'reactions.customDescription': 'Tạo phản ứng hóa học của riêng bạn bằng cách thêm chất phản ứng và sản phẩm',
    'reactions.name': 'Tên Phản Ứng',
    'reactions.reactants': 'Chất Phản Ứng',
    'reactions.products': 'Sản Phẩm',
    'reactions.add': 'Thêm',
    'reactions.save': 'Lưu Phản Ứng',
    'reactions.preview': 'Xem Trước',
    'reactions.saved': 'Đã lưu phản ứng thành công!',
    'reactions.3dView': 'Xem 3D',
    'reactions.2dView': 'Xem 2D',
    'reactions.animationSpeed': 'Tốc Độ Hoạt Ảnh',
    'reactions.slow': 'Chậm',
    'reactions.medium': 'Vừa',
    'reactions.fast': 'Nhanh',
    'reactions.resetView': 'Đặt Lại Góc Nhìn',
    'reactions.shareReaction': 'Chia Sẻ',
    'reactions.copied': 'Đã sao chép phản ứng vào bộ nhớ tạm',
    'reactions.temperature': 'Nhiệt Độ',
    'reactions.increaseTemp': 'Tăng Nhiệt Độ',
    'reactions.decreaseTemp': 'Giảm Nhiệt Độ',
    'reactions.downloadImage': 'Tải Xuống',
    'reactions.fullscreen': 'Toàn Màn Hình',
    'reactions.showBonds': 'Hiện Liên Kết',
    'reactions.hideBonds': 'Ẩn Liên Kết',
    'reactions.atomicView': 'Xem Nguyên Tử',
    'reactions.molecularView': 'Xem Phân Tử',
    'reactions.report': 'Báo Cáo',
    'reactions.showReport': 'Xem Báo Cáo',
    'reactions.appReport': 'Báo Cáo Ứng Dụng Hóa Học Tương Tác',
    'reactions.reportDescription': 'Phân tích toàn diện về tính năng và chức năng',
    'reactions.reportOverview': 'Tổng Quan Ứng Dụng',
    'reactions.reportOverviewText': 'Ứng dụng hóa học tương tác này được thiết kế để cung cấp một nền tảng hấp dẫn và giáo dục cho việc khám phá bảng tuần hoàn các nguyên tố và phản ứng hóa học. Với trọng tâm vào học tập trực quan và tương tác, ứng dụng nhằm mục đích làm cho hóa học dễ tiếp cận và thú vị hơn cho người dùng ở mọi trình độ.',
    'reactions.reportMainFeatures': 'Tính Năng Chính',
    'reactions.featurePeriodicTable': 'Bảng Tuần Hoàn Tương Tác',
    'reactions.featureReactions': 'Trực Quan Hóa Phản Ứng Hóa Học 3D',
    'reactions.featureSearch': 'Tìm Kiếm Và Lọc Nguyên Tố Nâng Cao',
    'reactions.featureComparison': 'Công Cụ So Sánh Nguyên Tố',
    'reactions.featureQuiz': 'Bài Kiểm Tra Đánh Giá Kiến Thức',
    'reactions.featureMultilingual': 'Hỗ Trợ Đa Ngôn Ngữ (Tiếng Anh, Tiếng Việt)',
    'reactions.reportTargetAudience': 'Đối Tượng Mục Tiêu',
    'reactions.audienceStudents': 'Học Sinh, Sinh Viên Hóa Học (Trung Học & Đại Học)',
    'reactions.audienceEducators': 'Giáo Viên Và Giảng Viên Khoa Học',
    'reactions.audienceEnthusiasts': 'Người Đam Mê Và Sở Thích Hóa Học',
    'reactions.audienceProfessionals': 'Chuyên Gia Và Nhà Nghiên Cứu Hóa Học',
    'reactions.audienceGeneral': 'Công Chúng Quan Tâm Đến Khoa Học',
    'reactions.reportTechnical': 'Điểm Nổi Bật Kỹ Thuật',
    'reactions.reportFrontend': 'Công Nghệ Frontend',
    'reactions.reportVisualization': 'Công Nghệ Trực Quan Hóa',
    'reactions.reportPerformance': 'Tối Ưu Hóa Hiệu Suất',
    'reactions.reportImpact': 'Tác Động Giáo Dục',
    'reactions.reportImpactText': 'Ứng dụng này nhằm mục đích chuyển đổi giáo dục hóa học bằng cách cung cấp:',
    'reactions.reportLearningEnhancement': 'Nâng Cao Học Tập',
    'reactions.reportLearningText': 'Biểu diễn trực quan của các khái niệm trừu tượng giúp việc học trở nên trực quan và dễ nhớ hơn. Tính chất tương tác của ứng dụng thúc đẩy học tập chủ động và hiểu sâu hơn về các nguyên tắc hóa học.',
    'reactions.reportAccessibility': 'Khả Năng Tiếp Cận',
    'reactions.reportAccessibilityText': 'Bằng cách cung cấp hỗ trợ đa ngôn ngữ và thiết kế với khả năng tiếp cận, ứng dụng làm cho giáo dục hóa học toàn diện hơn và khả dụng cho nhiều người học trên toàn thế giới.',
    'reactions.reportRoadmap': 'Lộ Trình Phát Triển Tương Lai',
    'reactions.reportExpansionTitle': 'Mở Rộng Nội Dung',
    'reactions.reportExpansionText': 'Thêm các phản ứng phức tạp hơn, trực quan hóa hóa học hữu cơ và thông tin chi tiết về nguyên tố.',
    'reactions.reportAR': 'Tích Hợp AR/VR',
    'reactions.reportARText': 'Triển khai các tính năng thực tế tăng cường và thực tế ảo cho trải nghiệm học tập sống động.',
    'reactions.reportCollaboration': 'Tính Năng Hợp Tác',
    'reactions.reportCollaborationText': 'Thêm công cụ hợp tác thời gian thực cho sử dụng trong lớp học và học nhóm.',
    'reactions.reportVersion': 'Phiên Bản Hiện Tại: 1.5.0',
    'reactions.closeReport': 'Đóng Báo Cáo',
    
    // Learn page
    'learn.title': 'Học Hóa Học',
    'learn.description': 'Khám phá các nguyên lý cơ bản của hóa học và bảng tuần hoàn',
    'learn.understanding': 'Hiểu biết cơ bản',
    'learn.clickBoxes': 'Nhấp để xem chi tiết',
    'learn.closeDetails': 'Đóng',
    'learn.exploreTable': 'Khám Phá Bảng Tuần Hoàn',
    'learn.additionalResources': 'Tài Nguyên Học Tập Bổ Sung',
    'learn.resourcesDesc': 'Khám phá các tài nguyên này để hiểu sâu hơn về hóa học',
    'learn.exploring': 'Khám phá',
    
    // Learn sections
    'learn.basics.title': 'Cơ Bản Về Hóa Học',
    'learn.categories.title': 'Danh Mục Nguyên Tố',
    'learn.properties.title': 'Tính Chất Nguyên Tố',
    'learn.advanced.title': 'Chủ Đề Nâng Cao',
    
    // Learn basics
    'learn.basics.atomTitle': 'Nguyên Tử Là Gì?',
    'learn.basics.atomDescription': 'Nguyên tử là đơn vị cơ bản của vật chất và cấu trúc định nghĩa của các nguyên tố. Chúng bao gồm ba hạt: proton, neutron và electron.',
    'learn.basics.structureTitle': 'Cấu Trúc Nguyên Tử',
    'learn.basics.nucleus': 'Hạt Nhân',
    'learn.basics.nucleusDescription': 'Chứa proton và neutron, chiếm phần lớn khối lượng của nguyên tử.',
    'learn.basics.electrons': 'Electron',
    'learn.basics.electronsDescription': 'Các hạt mang điện tích âm quay quanh hạt nhân trong các lớp vỏ.',
    'learn.basics.shells': 'Lớp Vỏ Electron',
    'learn.basics.shellsDescription': 'Các mức năng lượng nơi electron được tìm thấy xung quanh hạt nhân.',
    'learn.basics.tableTitle': 'Bảng Tuần Hoàn',
    'learn.basics.tableDescription': 'Bảng tuần hoàn sắp xếp tất cả các nguyên tố đã biết dựa trên số nguyên tử, cấu hình electron và các tính chất hóa học định kỳ.',
    'learn.basics.didYouKnow': 'Bạn có biết?',
    'learn.basics.fact1': 'Nếu bạn có thể nhìn thấy nguyên tử, bạn sẽ biết rằng mọi thứ hầu hết là khoảng trống.',
    'learn.basics.fact2': 'Có 118 nguyên tố đã biết trên bảng tuần hoàn, nhưng chỉ khoảng 90 nguyên tố xuất hiện tự nhiên.',
    
    // Learn categories
    'learn.categories.description': 'Các nguyên tố trong bảng tuần hoàn được tổ chức thành các danh mục dựa trên tính chất và cấu hình electron của chúng.',
    'learn.categories.examples': 'Ví dụ',
    'learn.categories.funFacts': 'Sự Thật Thú Vị Về Các Danh Mục',
    'learn.categories.alkaliFact': 'Chúng phản ứng mạnh đến nỗi phải được bảo quản trong dầu để ngăn chúng phản ứng với không khí.',
    'learn.categories.nobleFact': 'Chúng từng được gọi là "khí trơ" vì các nhà khoa học nghĩ rằng chúng không thể tạo thành hợp chất.',
    'learn.categories.transitionFact': 'Hầu hết tất cả các kim loại chuyển tiếp có thể tạo thành nhiều ion với các điện tích khác nhau.',
    
    // Category descriptions
    'learn.categories.alkaliDesc': 'Kim loại có tính phản ứng cao với một electron ở lớp vỏ ngoài cùng. Chúng phản ứng mạnh với nước.',
    'learn.categories.alkalineDesc': 'Kim loại có tính phản ứng với hai electron ở lớp vỏ ngoài cùng. Chúng cứng và đặc hơn kim loại kiềm.',
    'learn.categories.transitionDesc': 'Kim loại có các orbital d được lấp đầy một phần. Chúng thường tạo ra các hợp chất đầy màu sắc và có thể có nhiều trạng thái oxi hóa.',
    'learn.categories.postDesc': 'Kim loại thường mềm với điểm nóng chảy thấp hơn. Chúng có các orbital d đã được lấp đầy nhưng các orbital p chưa lấp đầy hoàn toàn.',
    'learn.categories.metalloidDesc': 'Các nguyên tố có tính chất của cả kim loại và phi kim. Chúng thường là các chất bán dẫn.',
    'learn.categories.nonmetalDesc': 'Các nguyên tố là chất dẫn nhiệt và điện kém. Chúng thường nhận electron trong các phản ứng.',
    'learn.categories.nobleDesc': 'Các nguyên tố cực kỳ ổn định với lớp vỏ electron ngoài cùng đầy đủ. Chúng hiếm khi tạo thành hợp chất.',
    'learn.categories.lanthanideDesc': 'Các nguyên tố đất hiếm với các orbital 4f được lấp đầy. Chúng có tính chất tương tự và thường được tìm thấy cùng nhau.',
    'learn.categories.actinideDesc': 'Các nguyên tố phóng xạ với các orbital 5f được lấp đầy một phần. Tất cả đều không ổn định và phân rã theo thời gian.',
    'learn.categories.unknownDesc': 'Thông tin về danh mục này không có sẵn.',
    
    // Learn properties
    'learn.properties.description': 'Các nguyên tố có nhiều tính chất vật lý và hóa học khác nhau xác định cách chúng hoạt động và tương tác với các nguyên tố khác.',
    'learn.properties.physical': 'Tính Chất Vật Lý',
    'learn.properties.chemical': 'Tính Chất Hóa Học',
    'learn.properties.meltingPoints': 'Điểm Nóng Chảy & Điểm Sôi',
    'learn.properties.meltingPointsDesc': 'Nhiệt độ mà tại đó các nguyên tố chuyển đổi giữa trạng thái rắn, lỏng và khí.',
    'learn.properties.density': 'Mật Độ',
    'learn.properties.densityDesc': 'Khối lượng trên đơn vị thể tích, xác định độ nặng của một nguyên tố.',
    'learn.properties.state': 'Trạng Thái Vật Chất',
    'learn.properties.stateDesc': 'Liệu một nguyên tố là chất rắn, lỏng hay khí ở nhiệt độ phòng.',
    'learn.properties.electronegativity': 'Độ Âm Điện',
    'learn.properties.electronegativityDesc': 'Khả năng của một nguyên tố thu hút electron trong một liên kết hóa học.',
    'learn.properties.ionization': 'Năng Lượng Ion Hóa',
    'learn.properties.ionizationDesc': 'Năng lượng cần thiết để loại bỏ một electron khỏi nguyên tử.',
    'learn.properties.electronConfig': 'Cấu Hình Electron',
    'learn.properties.electronConfigDesc': 'Sự sắp xếp của các electron trong các lớp vỏ của nguyên tử.',
    'learn.properties.periodicTrends': 'Xu Hướng Tuần Hoàn',
    'learn.properties.trendsDescription': 'Các mô hình trong tính chất nguyên tố có thể được quan sát trên bảng tuần hoàn.',
    
    // Learn advanced
    'learn.advanced.description': 'Khám phá các khái niệm nâng cao hơn trong hóa học dựa trên các nguyên tắc cơ bản.',
    'learn.advanced.quantum': 'Cơ Học Lượng Tử',
    'learn.advanced.quantumDesc': 'Cơ học lượng tử cung cấp mô tả toán học về hành vi sóng của các hạt ở quy mô nguyên tử. Nó giải thích cách electron tồn tại như các đám mây xác suất thay vì các quỹ đạo xác định xung quanh hạt nh��n.',
    'learn.advanced.keyPoints': 'Khái Niệm Chính:',
    'learn.advanced.uncertainty': 'Nguyên Lý Bất Định Heisenberg',
    'learn.advanced.waveFunctions': 'Hàm Sóng',
    'learn.advanced.quantization': 'Lượng Tử Hóa Năng Lượng',
    'learn.advanced.deepDive': 'Đi Sâu: Số Lượng Tử',
    'learn.advanced.quantumNumbersDesc': 'Bốn số lượng tử mô tả mỗi electron trong một nguyên tử:',
    'learn.advanced.bonding': 'Liên Kết Hóa Học',
    'learn.advanced.bondingDesc': 'Liên kết hóa học là lực giữ các nguyên tử lại với nhau trong phân tử và hợp chất. Loại liên kết được hình thành phụ thuộc vào tính chất của các nguyên tử tham gia.',
    'learn.advanced.ionic': 'Liên Kết Ion',
    'learn.advanced.ionicDesc': 'Được hình thành khi electron chuyển giữa các nguyên tử, tạo ra các ion mang điện tích đối lập.',
    'learn.advanced.covalent': 'Liên Kết Cộng Hóa Trị',
    'learn.advanced.covalentDesc': 'Được hình thành khi các nguyên tử chia sẻ electron để hoàn thành lớp vỏ ngoài của chúng.',
    'learn.advanced.metallic': 'Liên Kết Kim Loại',
    'learn.advanced.metallicDesc': 'Được hình thành trong kim loại, với các electron tự do di chuyển giữa các nguyên tử.',
    'learn.advanced.periodicity': 'Xu Hướng Tuần Hoàn',
    'learn.advanced.periodicityDesc': 'Bảng tuần hoàn được sắp xếp sao cho các nguyên tố có tính chất tương tự xuất hiện trong cùng một cột. Sự sắp xếp này cho thấy các mô hình trong tính chất nguyên tố qua các chu kỳ và nhóm.',
    'learn.advanced.trends': 'Xu Hướng Chính:',
    'learn.advanced.atomicRadius': 'Bán Kính Nguyên Tử:',
    'learn.advanced.atomicRadiusDesc': 'Giảm qua một chu kỳ, tăng xuống một nhóm',
    'learn.advanced.ionizationEnergy': 'Năng Lượng Ion Hóa:',
    'learn.advanced.ionizationEnergyDesc': 'Tăng qua một chu kỳ, giảm xuống một nhóm',
    'learn.advanced.electronAffinity': 'Ái Lực Electron:',
    'learn.advanced.electronAffinityDesc': 'Nhìn chung tăng qua một chu kỳ',
    'learn.advanced.interactiveNote': 'Ghi Chú Lịch Sử',
    'learn.advanced.periodicHistory': 'Dmitri Mendeleev đã tạo ra bảng tuần hoàn được công nhận rộng rãi đầu tiên vào năm 1869. Ông sắp xếp các nguyên tố theo khối lượng nguyên tử tăng dần và nhận thấy một mô hình định kỳ trong tính chất của chúng. Ấn tượng là ông đã để lại khoảng trống cho các nguyên tố chưa được phát hiện và dự đoán thành công tính chất của chúng.',
    'learn.advanced.isotopes': 'Đồng Vị & Hóa Học Hạt Nhân',
    'learn.advanced.isotopesDesc': 'Đồng vị là các nguyên tử của cùng một nguyên tố với số neutron khác nhau, dẫn đến khối lượng nguyên tử khác nhau nhưng tính chất hóa học giống nhau.',
    'learn.advanced.commonIsotopes': 'Đồng Vị Phổ Biến',
    'learn.advanced.nuclearReactions': 'Phản Ứng Hạt Nhân',
    'learn.advanced.nuclearDesc': 'Phản ứng hạt nhân liên quan đến sự thay đổi đối với hạt nhân của nguyên tử và có thể giải phóng một lượng năng lượng khổng lồ.',
    
    // Resources
    'learn.resources.interactiveModels': 'Mô Hình Nguyên Tử Tương Tác',
    'learn.resources.modelsDesc': 'Khám phá các mô hình 3D tương tác của nguyên tử và phân tử để hiểu rõ hơn về cấu trúc hóa học.',
    'learn.resources.explore': 'Khám Phá Mô Hình',
    'learn.resources.experiments': 'Thí Nghiệm Phòng Thí Nghiệm Ảo',
    'learn.resources.experimentsDesc': 'Tiến hành các thí nghiệm hóa học ảo an toàn từ máy tính của bạn để thấy các phản ứng trong hành động.',
    'learn.resources.tryLab': 'Thử Nghiệm Phòng Thí Nghiệm',
    'learn.resources.courses': 'Khóa Học Hóa Học Trực Tuyến',
    'learn.resources.coursesDesc': 'Truy cập các khóa học trực tuyến miễn phí từ các trường đại học và nền tảng giáo dục hàng đầu.',
    'learn.resources.browseCourses': 'Duyệt Khóa Học',
    'learn.resources.videos': 'Video Giáo Dục',
    'learn.resources.videosDesc': 'Xem các video giáo dục giải thích các khái niệm hóa học phức tạp bằng ngôn ngữ đơn giản.',
    'learn.resources.watchVideos': 'Xem Video',
    'learn.resources.allResources': 'Xem Tất Cả Tài Nguyên',
    
    // Language
    'language.select': 'Chọn Ngôn Ngữ',
    'language.en': 'Tiếng Anh',
    'language.vi': 'Tiếng Việt',
    'language.changed': 'Đã thay đổi ngôn ngữ',
    
    // Quiz
    'quiz.title': 'Kiểm Tra Kiến Thức',
    'quiz.description': 'Thử thách bản thân với các câu đố về nguyên tố và khái niệm hóa học',
    'quiz.startQuiz': 'Bắt Đầu Trắc Nghiệm',
    'quiz.settings': 'Cài Đặt',
    'quiz.questionCount': 'Số Lượng Câu Hỏi',
    'quiz.questionTypes': 'Loại Câu Hỏi',
    'quiz.elementSymbols': 'Ký Hiệu Nguyên Tố',
    'quiz.elementCategories': 'Danh Mục Nguyên Tố',
    'quiz.elementProperties': 'Tính Chất Nguyên Tố',
    'quiz.timeLimit': 'Giới Hạn Thời Gian',
    'quiz.selectTimeLimit': 'Chọn giới hạn thời gian',
    'quiz.noTimeLimit': 'Không giới hạn thời gian',
    'quiz.minute': '1 phút',
    'quiz.minutes': '{{count}} phút',
    'quiz.elementSymbolsDesc': 'Nhận biết ký hiệu hóa học cho các nguyên tố trong bảng tuần hoàn.',
    'quiz.elementCategoriesDesc': 'Kiểm tra kiến thức của bạn về danh mục mà các nguyên tố khác nhau thuộc về.',
    'quiz.elementPropertiesDesc': 'Trả lời câu hỏi về các tính chất như điểm nóng chảy, mật độ, và nhiều hơn nữa.',
    'quiz.instructions': 'Hướng Dẫn',
    'quiz.instructionsItem1': 'Chọn câu trả lời cho mỗi câu hỏi',
    'quiz.instructionsItem2': 'Gửi câu trả lời của bạn để xem bạn có đúng không',
    'quiz.instructionsItem3': 'Theo dõi tiến trình và cải thiện điểm số của bạn',
    'quiz.question': 'Câu Hỏi',
    'quiz.of': 'của',
    'quiz.submit': 'Gửi Câu Trả Lời',
    'quiz.next': 'Câu Hỏi Tiếp Theo',
    'quiz.finish': 'Kết Thúc Trắc Nghiệm',
    'quiz.correct': 'Đúng!',
    'quiz.incorrect': 'Sai!',
    'quiz.correctAnswer': 'Câu trả lời đúng là',
    'quiz.results': 'Kết Quả Trắc Nghiệm',
    'quiz.score': 'Điểm Của Bạn',
    'quiz.tryAgain': 'Thử Lại',
    'quiz.selectOption': 'Vui lòng chọn một phương án',
    'quiz.history': 'Lịch Sử Trắc Nghiệm',
    'quiz.lastScore': 'Điểm Gần Đây',
    'quiz.bestScore': 'Điểm Cao Nhất',
    'quiz.accuracy': 'độ chính xác',
    'quiz.totalQuizzes': 'Tổng Số Bài Trắc Nghiệm Đã Làm'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: { defaultValue?: string, count?: number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Set initial language based on browser settings
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    const browserLanguage = navigator.language.split('-')[0] as Language;
    
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'vi')) {
      setLanguage(savedLanguage);
    } else if (browserLanguage === 'vi') {
      setLanguage('vi');
    }
  }, []);

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const translate = (key: string, options?: { defaultValue?: string, count?: number }): string => {
    const translation = translations[language][key];
    
    if (translation) {
      // Handle count interpolation if needed
      if (options?.count !== undefined && translation.includes('{{count}}')) {
        return translation.replace('{{count}}', options.count.toString());
      }
      
      // Handle name interpolation if needed
      if (translation.includes('{{name}}') && options && 'defaultValue' in options) {
        const defaultValue = options.defaultValue || '';
        // Extract the name from the default value if it contains "with NAME"
        const match = defaultValue.match(/with\s+(.+)$/);
        if (match && match[1]) {
          return translation.replace('{{name}}', match[1]);
        }
      }
      
      return translation;
    }
    
    // Use default value if provided, or the key itself as fallback
    return options?.defaultValue || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
