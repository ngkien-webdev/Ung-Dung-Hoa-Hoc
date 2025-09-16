
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Atom, 
  BookOpen,
  ExternalLink, 
  Layers, 
  Lightbulb, 
  Brain,
  X as XIcon,
  FlaskConical,
  Beaker,
  Droplet,
  Network,
  Zap,
  Youtube,
  GraduationCap,
  Globe,
  Video,
  Download,
  FileDown,
  Share2,
  Settings,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Element } from "@/lib/constants";
import { useLanguage } from '@/contexts/LanguageContext';
import { Separator } from "@/components/ui/separator";
import { elements } from "@/lib/elements-data";
import WikiElementDetails from "@/components/WikiElementDetails";
import LearnBasicsSection from "@/components/LearnBasicsSection";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ELEMENT_CATEGORIES, { ElementCategory } from "@/lib/element-data/element-categories";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LearnResourceCard from "@/components/LearnResourceCard";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { exportLanguageData, syncTranslationsWithServer } from "@/utils/languageSync";

export default function Learn() {
  const { t, language, setLanguage } = useLanguage();
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();
  
  const getText = (key: string, fallback: string) => {
    const translation = t(key);
    return translation === key ? fallback : translation;
  };

  const sections = [
    {
      id: "basics",
      title: getText('learn.basics.title', "Basics of Chemistry"),
      icon: <Atom className="h-5 w-5" />,
      content: <LearnBasicsSection />
    },
    {
      id: "element-categories",
      title: getText('learn.categories.title', "Element Categories"),
      icon: <Layers className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <p>{t('learn.categories.description')}</p>
          
          <Accordion type="multiple" className="w-full">
            {Object.entries(ELEMENT_CATEGORIES).map(([key, label]) => (
              <AccordionItem key={key} value={key} className={`border rounded-md mb-3 border-${key} border-opacity-30`}>
                <AccordionTrigger className={`px-4 py-2 bg-${key} bg-opacity-10 hover:no-underline hover:bg-opacity-20 rounded-t-md`}>
                  <span className="font-medium">{t(`category.${key}`) || label}</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-3 pb-4">
                  <div className="mb-3">
                    <CategoryDescription category={key as ElementCategory} />
                  </div>
                  <h4 className="text-sm font-medium mb-2">{t('learn.categories.examples') || "Examples"}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {elements
                      .filter(element => element.category === key)
                      .slice(0, 3)
                      .map(element => (
                        <Card 
                          key={element.atomicNumber} 
                          className={`bg-${key} cursor-pointer bg-opacity-5 hover:bg-opacity-10`}
                          onClick={() => setSelectedElement(element)}
                        >
                          <CardHeader className="p-3 pb-1">
                            <div className="flex justify-between">
                              <div className="text-xs text-muted-foreground">{element.atomicNumber}</div>
                              <div className="font-medium">{element.symbol}</div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-3 pt-0">
                            <div className="text-sm font-medium">{element.name}</div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="bg-muted p-4 rounded-lg mt-6">
            <h4 className="font-medium mb-2">{t('learn.categories.funFacts')}</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="font-medium">Alkali Metals:</span> {t('learn.categories.alkaliFact')}</li>
              <li><span className="font-medium">Noble Gases:</span> {t('learn.categories.nobleFact')}</li>
              <li><span className="font-medium">Transition Metals:</span> {t('learn.categories.transitionFact')}</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "properties",
      title: getText('learn.properties.title', "Element Properties"),
      icon: <FlaskConical className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <p>{t('learn.properties.description')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="h-5 w-5 text-red-500" />
                  {t('learn.properties.physical') || "Physical Properties"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="melting-points">
                    <AccordionTrigger className="hover:no-underline py-2">
                      <span className="font-medium">{t('learn.properties.meltingPoints') || "Melting & Boiling Points"}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm mb-2">
                        {t('learn.properties.meltingPointsDesc') || "Temperatures at which elements change between solid, liquid, and gas states."}
                      </p>
                      <div className="bg-muted p-3 rounded-md text-sm">
                        <ul className="space-y-1">
                          <li><span className="font-medium">Mercury:</span> -38.83°C melting, 356.73°C boiling</li>
                          <li><span className="font-medium">Iron:</span> 1538°C melting, 2862°C boiling</li>
                          <li><span className="font-medium">Helium:</span> -272.2°C melting (at high pressure), -268.9°C boiling</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="density">
                    <AccordionTrigger className="hover:no-underline py-2">
                      <span className="font-medium">{t('learn.properties.density') || "Density"}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm mb-2">
                        {t('learn.properties.densityDesc') || "Mass per unit volume, determining how heavy an element feels."}
                      </p>
                      <div className="bg-muted p-3 rounded-md text-sm">
                        <ul className="space-y-1">
                          <li><span className="font-medium">Osmium:</span> 22.59 g/cm³ (densest natural element)</li>
                          <li><span className="font-medium">Lithium:</span> 0.534 g/cm³ (lightest metal)</li>
                          <li><span className="font-medium">Hydrogen:</span> 0.00009 g/cm³ (gas at room temperature)</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="state">
                    <AccordionTrigger className="hover:no-underline py-2">
                      <span className="font-medium">{t('learn.properties.state') || "State of Matter"}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm mb-2">
                        {t('learn.properties.stateDesc') || "Whether an element is a solid, liquid, or gas at room temperature."}
                      </p>
                      <div className="bg-muted p-3 rounded-md text-sm">
                        <ul className="space-y-1">
                          <li><span className="font-medium">Solids:</span> Most metals, carbon, silicon</li>
                          <li><span className="font-medium">Liquids:</span> Mercury, bromine</li>
                          <li><span className="font-medium">Gases:</span> Hydrogen, oxygen, noble gases</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="h-5 w-5 text-blue-500" />
                  {t('learn.properties.chemical') || "Chemical Properties"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="electronegativity">
                    <AccordionTrigger className="hover:no-underline py-2">
                      <span className="font-medium">{t('learn.properties.electronegativity') || "Electronegativity"}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm mb-2">
                        {t('learn.properties.electronegativityDesc') || "An element's ability to attract electrons in a chemical bond."}
                      </p>
                      <div className="bg-muted p-3 rounded-md text-sm">
                        <ul className="space-y-1">
                          <li><span className="font-medium">Fluorine:</span> 3.98 (highest)</li>
                          <li><span className="font-medium">Oxygen:</span> 3.44</li>
                          <li><span className="font-medium">Francium:</span> 0.7 (lowest)</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="ionization">
                    <AccordionTrigger className="hover:no-underline py-2">
                      <span className="font-medium">{t('learn.properties.ionization') || "Ionization Energy"}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm mb-2">
                        {t('learn.properties.ionizationDesc') || "Energy required to remove an electron from an atom."}
                      </p>
                      <div className="bg-muted p-3 rounded-md text-sm">
                        <ul className="space-y-1">
                          <li><span className="font-medium">Helium:</span> 2372 kJ/mol (very high)</li>
                          <li><span className="font-medium">Carbon:</span> 1086 kJ/mol</li>
                          <li><span className="font-medium">Cesium:</span> 376 kJ/mol (very low)</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="electron-config">
                    <AccordionTrigger className="hover:no-underline py-2">
                      <span className="font-medium">{t('learn.properties.electronConfig') || "Electron Configuration"}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm mb-2">
                        {t('learn.properties.electronConfigDesc') || "The arrangement of electrons in an atom's shells."}
                      </p>
                      <div className="bg-muted p-3 rounded-md text-sm">
                        <ul className="space-y-1">
                          <li><span className="font-medium">Hydrogen (H):</span> 1s¹</li>
                          <li><span className="font-medium">Carbon (C):</span> 1s² 2s² 2p²</li>
                          <li><span className="font-medium">Iron (Fe):</span> 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-4 rounded-lg mt-4">
            <h4 className="font-medium mb-2">{t('learn.properties.periodicTrends')}</h4>
            <p className="text-sm mb-3">{t('learn.properties.trendsDescription')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-white/80 dark:bg-gray-800/80 p-3 rounded-md">
                <h5 className="font-medium">Atomic Radius</h5>
                <p>Decreases across a period, increases down a group.</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 p-3 rounded-md">
                <h5 className="font-medium">Electronegativity</h5>
                <p>Increases across a period, decreases down a group.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "advanced",
      title: getText('learn.advanced.title', "Advanced Topics"),
      icon: <Brain className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <p>{t('learn.advanced.description')}</p>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="quantum">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">{t('learn.advanced.quantum') || "Quantum Mechanics"}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <p>{t('learn.advanced.quantumDesc') || "Quantum mechanics provides a mathematical description of the wave-like behavior of particles at the atomic scale. It explains how electrons exist as probability clouds rather than definite orbits around the nucleus."}</p>
                <h4 className="font-medium text-sm mt-2">{t('learn.advanced.keyPoints') || "Key Concepts:"}</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>{t('learn.advanced.uncertainty') || "Heisenberg's Uncertainty Principle"}</li>
                  <li>{t('learn.advanced.waveFunctions') || "Wave Functions"}</li>
                  <li>{t('learn.advanced.quantization') || "Quantization of Energy"}</li>
                </ul>
                
                <div className="bg-purple-50 dark:bg-purple-950 p-3 mt-2 rounded-md">
                  <h5 className="font-medium text-sm mb-1">{t('learn.advanced.deepDive') || "Deep Dive: Quantum Numbers"}</h5>
                  <p className="text-sm">
                    {t('learn.advanced.quantumNumbersDesc') || "Four quantum numbers describe each electron in an atom:"}
                  </p>
                  <ul className="text-xs space-y-1 mt-2">
                    <li><span className="font-medium">Principal (n):</span> Energy level (1, 2, 3...)</li>
                    <li><span className="font-medium">Angular Momentum (l):</span> Shape of orbital (s, p, d, f)</li>
                    <li><span className="font-medium">Magnetic (m<sub>l</sub>):</span> Orientation in space</li>
                    <li><span className="font-medium">Spin (m<sub>s</sub>):</span> Direction of electron spin (±½)</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="bonding">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Network className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{t('learn.advanced.bonding') || "Chemical Bonding"}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <p>{t('learn.advanced.bondingDesc') || "Chemical bonds are the forces that hold atoms together in molecules and compounds. The type of bond formed depends on the properties of the participating atoms."}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                  <Card className="bg-blue-50 dark:bg-blue-950">
                    <CardHeader className="py-2 px-3">
                      <CardTitle className="text-sm">{t('learn.advanced.ionic') || "Ionic Bonds"}</CardTitle>
                    </CardHeader>
                    <CardContent className="py-1 px-3 text-xs">
                      {t('learn.advanced.ionicDesc') || "Formed when electrons transfer between atoms, creating oppositely charged ions."}
                    </CardContent>
                    <CardFooter className="py-1 px-3 text-xs text-muted-foreground">
                      Example: NaCl (table salt)
                    </CardFooter>
                  </Card>
                  <Card className="bg-green-50 dark:bg-green-950">
                    <CardHeader className="py-2 px-3">
                      <CardTitle className="text-sm">{t('learn.advanced.covalent') || "Covalent Bonds"}</CardTitle>
                    </CardHeader>
                    <CardContent className="py-1 px-3 text-xs">
                      {t('learn.advanced.covalentDesc') || "Formed when atoms share electrons to complete their outer shells."}
                    </CardContent>
                    <CardFooter className="py-1 px-3 text-xs text-muted-foreground">
                      Example: H₂O (water)
                    </CardFooter>
                  </Card>
                  <Card className="bg-yellow-50 dark:bg-yellow-950">
                    <CardHeader className="py-2 px-3">
                      <CardTitle className="text-sm">{t('learn.advanced.metallic') || "Metallic Bonds"}</CardTitle>
                    </CardHeader>
                    <CardContent className="py-1 px-3 text-xs">
                      {t('learn.advanced.metallicDesc') || "Formed in metals, with electrons freely moving between atoms."}
                    </CardContent>
                    <CardFooter className="py-1 px-3 text-xs text-muted-foreground">
                      Example: Cu (copper)
                    </CardFooter>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="periodicity">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-green-500" />
                  <span className="font-medium">{t('learn.advanced.periodicity') || "Periodic Trends"}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <p>{t('learn.advanced.periodicityDesc') || "The periodic table is arranged so that elements with similar properties appear in the same column. This arrangement reveals patterns in element properties across periods and groups."}</p>
                <h4 className="font-medium text-sm mt-2">{t('learn.advanced.trends') || "Major Trends:"}</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li><span className="font-medium">{t('learn.advanced.atomicRadius') || "Atomic Radius:"}</span> {t('learn.advanced.atomicRadiusDesc') || "Decreases across a period, increases down a group"}</li>
                  <li><span className="font-medium">{t('learn.advanced.ionizationEnergy') || "Ionization Energy:"}</span> {t('learn.advanced.ionizationEnergyDesc') || "Increases across a period, decreases down a group"}</li>
                  <li><span className="font-medium">{t('learn.advanced.electronAffinity') || "Electron Affinity:"}</span> {t('learn.advanced.electronAffinityDesc') || "Generally increases across a period"}</li>
                </ul>
                
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded-md mt-3">
                  <h5 className="font-medium text-sm mb-1">{t('learn.advanced.interactiveNote') || "Historical Note"}</h5>
                  <p className="text-xs">
                    {t('learn.advanced.periodicHistory') || "Dmitri Mendeleev created the first widely recognized periodic table in 1869. He arranged the elements by increasing atomic weight and noticed a periodic pattern in their properties. Impressively, he left gaps for elements that hadn't been discovered yet and successfully predicted their properties."}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="isotopes">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Atom className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">{t('learn.advanced.isotopes') || "Isotopes & Nuclear Chemistry"}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <p>{t('learn.advanced.isotopesDesc') || "Isotopes are atoms of the same element with different numbers of neutrons, resulting in different atomic masses but identical chemical properties."}</p>
                
                <div className="bg-muted p-3 rounded-md">
                  <h5 className="font-medium text-sm mb-2">{t('learn.advanced.commonIsotopes') || "Common Isotopes"}</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Hydrogen:</span> ¹H (protium), ²H (deuterium), ³H (tritium)
                    </div>
                    <div>
                      <span className="font-medium">Carbon:</span> ¹²C, ¹³C, ¹⁴C (radioactive, used in dating)
                    </div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <h5 className="font-medium text-sm mb-1">{t('learn.advanced.nuclearReactions') || "Nuclear Reactions"}</h5>
                  <p className="text-sm">{t('learn.advanced.nuclearDesc') || "Nuclear reactions involve changes to the nucleus of an atom and can release enormous amounts of energy."}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    <Card className="bg-orange-50 dark:bg-orange-950">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-sm">Fission</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 px-3 pb-2 text-xs">
                        Splitting a heavy nucleus into lighter nuclei, releasing energy. Powers nuclear power plants.
                      </CardContent>
                    </Card>
                    <Card className="bg-red-50 dark:bg-red-950">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-sm">Fusion</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 px-3 pb-2 text-xs">
                        Combining light nuclei to form heavier ones, releasing energy. Powers stars like our sun.
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )
    }
  ];

  // Resources data with images and detailed information
  const learningResources = [
    {
      id: "interactive-models",
      title: getText('learn.resources.interactiveModels', 'Interactive Atomic Models'),
      description: getText('learn.resources.modelsDesc', 'Explore interactive 3D models of atoms and molecules to better understand chemical structures.'),
      icon: <Atom className="h-5 w-5 text-blue-500" />,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      buttonText: getText('learn.resources.explore', 'Explore Models'),
      features: [
        getText('learn.resources.models.feature1', '3D visualization of electron orbitals'),
        getText('learn.resources.models.feature2', 'Interactive bonding demonstrations'),
        getText('learn.resources.models.feature3', 'Customizable element exploration'),
      ],
      difficulty: "beginner",
      format: "interactive",
      url: "/reactions"
    },
    {
      id: "virtual-lab",
      title: getText('learn.resources.experiments', 'Virtual Lab Experiments'),
      description: getText('learn.resources.experimentsDesc', 'Conduct virtual chemistry experiments safely from your computer to see reactions in action.'),
      icon: <Beaker className="h-5 w-5 text-green-500" />,
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d",
      buttonText: getText('learn.resources.tryLab', 'Try Lab Experiments'),
      features: [
        getText('learn.resources.lab.feature1', 'Safe experimentation with dangerous chemicals'),
        getText('learn.resources.lab.feature2', 'Real-time reaction visualization'),
        getText('learn.resources.lab.feature3', 'Downloadable lab reports'),
      ],
      difficulty: "intermediate",
      format: "simulation",
      url: "/reactions"
    },
    {
      id: "online-courses",
      title: getText('learn.resources.courses', 'Online Chemistry Courses'),
      description: getText('learn.resources.coursesDesc', 'Access free online courses from top universities and educational platforms.'),
      icon: <GraduationCap className="h-5 w-5 text-amber-500" />,
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      buttonText: getText('learn.resources.browseCourses', 'Browse Courses'),
      features: [
        getText('learn.resources.courses.feature1', 'Courses from MIT, Harvard and Stanford'),
        getText('learn.resources.courses.feature2', 'Self-paced learning options'),
        getText('learn.resources.courses.feature3', 'Certification opportunities'),
      ],
      difficulty: "all-levels",
      format: "educational",
      url: "https://www.edx.org/learn/chemistry"
    },
    {
      id: "educational-videos",
      title: getText('learn.resources.videos', 'Educational Videos'),
      description: getText('learn.resources.videosDesc', 'Watch educational videos explaining complex chemistry concepts in simple terms.'),
      icon: <Video className="h-5 w-5 text-red-500" />,
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      buttonText: getText('learn.resources.watchVideos', 'Watch Videos'),
      features: [
        getText('learn.resources.videos.feature1', 'Visualized explanations of complex topics'),
        getText('learn.resources.videos.feature2', 'Step-by-step reaction walkthroughs'),
        getText('learn.resources.videos.feature3', 'Interviews with leading chemists'),
      ],
      difficulty: "beginner",
      format: "video",
      url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtPHzzYuWy6fYEaX9mQQ8oGr"
    },
    {
      id: "interactive-quizzes",
      title: getText('learn.resources.quizzes', 'Interactive Quizzes'),
      description: getText('learn.resources.quizzesDesc', 'Test your knowledge with interactive quizzes covering various chemistry topics.'),
      icon: <Brain className="h-5 w-5 text-purple-500" />,
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
      buttonText: getText('learn.resources.takeQuiz', 'Take a Quiz'),
      features: [
        getText('learn.resources.quizzes.feature1', 'Adaptive difficulty based on performance'),
        getText('learn.resources.quizzes.feature2', 'Instant feedback with explanations'),
        getText('learn.resources.quizzes.feature3', 'Track your progress over time'),
      ],
      difficulty: "all-levels",
      format: "interactive",
      url: "/quiz"
    },
    {
      id: "scientific-articles",
      title: getText('learn.resources.articles', 'Scientific Articles'),
      description: getText('learn.resources.articlesDesc', 'Access simplified scientific articles about recent discoveries in chemistry.'),
      icon: <BookOpen className="h-5 w-5 text-blue-600" />,
      image: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0",
      buttonText: getText('learn.resources.readArticles', 'Read Articles'),
      features: [
        getText('learn.resources.articles.feature1', 'Curated articles from scientific journals'),
        getText('learn.resources.articles.feature2', 'Explanations of recent breakthroughs'),
        getText('learn.resources.articles.feature3', 'Referenced and peer-reviewed content'),
      ],
      difficulty: "advanced",
      format: "reading",
      url: "https://cen.acs.org/"
    },
    // Thêm tài nguyên mới
    {
      id: "chemistry-tools",
      title: getText('learn.resources.tools', 'Chemistry Tools & Calculators'),
      description: getText('learn.resources.toolsDesc', 'Access specialized tools and calculators for solving chemistry problems.'),
      icon: <Settings className="h-5 w-5 text-gray-500" />,
      image: "https://images.unsplash.com/photo-1576086213369-97a306d36557",
      buttonText: getText('learn.resources.useTools', 'Use Tools'),
      features: [
        getText('learn.resources.tools.feature1', 'Balancing chemical equations'),
        getText('learn.resources.tools.feature2', 'Molar mass calculator'),
        getText('learn.resources.tools.feature3', 'pH and concentration tools'),
      ],
      difficulty: "intermediate",
      format: "interactive",
      url: "/tools"
    },
    {
      id: "chemical-database",
      title: getText('learn.resources.database', 'Chemical Compound Database'),
      description: getText('learn.resources.databaseDesc', 'Search and explore a comprehensive database of chemical compounds.'),
      icon: <Search className="h-5 w-5 text-indigo-500" />,
      image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb",
      buttonText: getText('learn.resources.exploreDatabase', 'Explore Database'),
      features: [
        getText('learn.resources.database.feature1', 'Detailed compound properties'),
        getText('learn.resources.database.feature2', 'Structure visualization'),
        getText('learn.resources.database.feature3', 'Search by formula or name'),
      ],
      difficulty: "all-levels",
      format: "interactive",
      url: "/search"
    }
  ];

  // Filter functions for resources
  const [resourceFilters, setResourceFilters] = useState({
    difficulty: "all", // "all", "beginner", "intermediate", "advanced", "all-levels"
    format: "all", // "all", "interactive", "video", "reading", "simulation", "educational"
    searchQuery: ""
  });

  const filteredResources = learningResources.filter(resource => {
    // Filter by difficulty
    if (resourceFilters.difficulty !== "all" && resource.difficulty !== resourceFilters.difficulty && resource.difficulty !== "all-levels") {
      return false;
    }

    // Filter by format
    if (resourceFilters.format !== "all" && resource.format !== resourceFilters.format) {
      return false;
    }

    // Filter by search query
    if (resourceFilters.searchQuery && !resource.title.toLowerCase().includes(resourceFilters.searchQuery.toLowerCase()) && 
        !resource.description.toLowerCase().includes(resourceFilters.searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Handle resource download for offline use
  const handleDownloadResource = (resourceId: string) => {
    toast.success(getText('learn.resources.downloadSuccess', 'Resource downloaded for offline use'));
  };

  // Navigate to online resources or local app pages
  const handleResourceAccess = (resource: typeof learningResources[0]) => {
    if (resource.url.startsWith('http')) {
      window.open(resource.url, '_blank');
    } else {
      navigate(resource.url);
    }
  };

  // Mô phỏng tải xuống tất cả tài nguyên
  const handleBulkDownload = () => {
    setShowDownloadDialog(true);
    setIsDownloading(true);
    setDownloadProgress(0);
    
    // Mô phỏng tiến trình tải xuống
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDownloading(false);
            toast.success(getText('learn.resources.allDownloaded', 'All resources have been downloaded for offline use'));
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  // Đồng bộ hóa ngôn ngữ
  const handleSyncLanguage = async () => {
    try {
      const success = await syncTranslationsWithServer(true);
      if (success) {
        toast.success(getText('language.syncSuccess', 'Language data synchronized successfully'));
      }
    } catch (error) {
      toast.error(getText('language.syncError', 'Failed to synchronize language data'));
    }
  };

  // Xuất dữ liệu ngôn ngữ để sử dụng ngoại tuyến
  const handleExportLanguage = async () => {
    try {
      const blob = await exportLanguageData();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chemistry-explorer-language-${language}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(getText('language.exportSuccess', 'Language data exported successfully'));
    } catch (error) {
      toast.error(getText('language.exportError', 'Failed to export language data'));
    }
  };

  return (
    <div className="container py-6 px-4 lg:px-8 space-y-8 max-w-4xl mx-auto mb-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          {getText('learn.title', 'Learn Chemistry')}
        </h1>
        <p className="text-muted-foreground">
          {getText('learn.description', 'Explore the fundamentals of chemistry and the periodic table')}
        </p>
        
        {/* Thêm các nút hành động mới */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <Button variant="outline" size="sm" className="gap-1" onClick={handleSyncLanguage}>
            <Globe className="h-4 w-4" />
            {getText('language.syncNow', 'Sync Language Data')}
          </Button>
          
          <Button variant="outline" size="sm" className="gap-1" onClick={handleExportLanguage}>
            <FileDown className="h-4 w-4" />
            {getText('language.export', 'Export Language Data')}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          {sections.map(section => (
            <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-2">
              {section.icon}
              <span className="hidden sm:inline">{section.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {sections.map(section => (
          <TabsContent key={section.id} value={section.id} className="animate-fade-in">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  {section.title}
                </CardTitle>
                <CardDescription>
                  {getText('learn.understanding', 'Understanding the fundamentals')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {section.content}
              </CardContent>
              {section.id === "element-categories" && (
                <CardFooter className="flex justify-center pt-0 pb-6">
                  <Button variant="outline" className="gap-1" asChild>
                    <a href="/" className="flex items-center">
                      <Atom className="h-4 w-4" />
                      {getText('learn.exploreTable', 'Explore Periodic Table')}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      
      {selectedElement && (
        <Card className="mt-8 border-t-4 border-primary animate-fade-in">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2">
                {selectedElement.name}
                <span className="text-lg font-normal text-muted-foreground">({selectedElement.symbol})</span>
              </CardTitle>
              <CardDescription>
                {t('element.atomicNumber')}: {selectedElement.atomicNumber} · {t(`category.${selectedElement.category}`)}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setSelectedElement(null)}
            >
              <span className="sr-only">Close</span>
              <XIcon className="h-4 w-4" />
            </Button>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <WikiElementDetails element={selectedElement} />
          </CardContent>
        </Card>
      )}
      
      {/* Enhanced Learning Resources Section */}
      <Card className="border shadow-sm bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 mt-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            {getText('learn.additionalResources', 'Supplemental Learning Resources')}
          </CardTitle>
          <CardDescription>
            {getText('learn.resourcesDesc', 'Explore these resources to deepen your understanding of chemistry')}
          </CardDescription>
          
          {/* Resource filters */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">{getText('learn.resources.filterDifficulty', 'Difficulty Level')}</label>
              <select 
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={resourceFilters.difficulty}
                onChange={(e) => setResourceFilters(prev => ({...prev, difficulty: e.target.value}))}
              >
                <option value="all">{getText('learn.resources.all', 'All Levels')}</option>
                <option value="beginner">{getText('learn.resources.beginner', 'Beginner')}</option>
                <option value="intermediate">{getText('learn.resources.intermediate', 'Intermediate')}</option>
                <option value="advanced">{getText('learn.resources.advanced', 'Advanced')}</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{getText('learn.resources.filterFormat', 'Resource Format')}</label>
              <select 
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={resourceFilters.format}
                onChange={(e) => setResourceFilters(prev => ({...prev, format: e.target.value}))}
              >
                <option value="all">{getText('learn.resources.allFormats', 'All Formats')}</option>
                <option value="interactive">{getText('learn.resources.interactive', 'Interactive')}</option>
                <option value="video">{getText('learn.resources.video', 'Videos')}</option>
                <option value="reading">{getText('learn.resources.reading', 'Reading')}</option>
                <option value="simulation">{getText('learn.resources.simulation', 'Simulations')}</option>
                <option value="educational">{getText('learn.resources.educational', 'Courses')}</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{getText('learn.resources.search', 'Search Resources')}</label>
              <Input
                type="text"
                placeholder={getText('learn.resources.searchPlaceholder', 'Type to search...')}
                value={resourceFilters.searchQuery}
                onChange={(e) => setResourceFilters(prev => ({...prev, searchQuery: e.target.value}))}
                className="w-full"
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.length > 0 ? (
              filteredResources.map(resource => (
                <LearnResourceCard
                  key={resource.id}
                  resource={resource}
                  onAccess={() => handleResourceAccess(resource)}
                  onDownload={() => handleDownloadResource(resource.id)}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <p className="text-muted-foreground">
                  {getText('learn.resources.noResults', 'No resources match your current filters. Try adjusting your criteria.')}
                </p>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <Button variant="default" className="gap-2" onClick={() => setResourceFilters({
            difficulty: "all",
            format: "all",
            searchQuery: ""
          })}>
            <BookOpen className="h-4 w-4" />
            {getText('learn.resources.allResources', 'View All Resources')}
          </Button>
          
          <Button variant="outline" className="gap-2" onClick={handleBulkDownload}>
            <Download className="h-4 w-4" />
            {getText('learn.resources.downloadOffline', 'Download for Offline Use')}
          </Button>
          
          {/* Thêm nút chia sẻ */}
          <Button variant="secondary" className="gap-2" onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success(getText('learn.resources.linkCopied', 'Link copied to clipboard'));
          }}>
            <Share2 className="h-4 w-4" />
            {getText('learn.resources.share', 'Share Resources')}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Hộp thoại tải xuống tài nguyên */}
      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{getText('learn.resources.downloadingResources', 'Downloading Learning Resources')}</DialogTitle>
            <DialogDescription>
              {getText('learn.resources.downloadDesc', 'Resources are being prepared for offline use. This may take a moment.')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-300 ease-in-out" 
                style={{ width: `${downloadProgress}%` }}
              ></div>
            </div>
            <p className="text-center mt-2 text-sm text-muted-foreground">
              {isDownloading ? 
                `${downloadProgress}% ${getText('learn.resources.downloaded', 'downloaded')}` : 
                getText('learn.resources.downloadComplete', 'Download complete')}
            </p>
            
            {!isDownloading && (
              <div className="mt-4 space-y-2">
                <p className="text-sm">
                  {getText('learn.resources.offlineAccess', 'These resources can now be accessed offline through the app.')}
                </p>
                <p className="text-sm font-medium">
                  {getText('learn.resources.storage', 'Storage location')}:
                </p>
                <div className="bg-muted/50 p-2 rounded text-xs font-mono">
                  C:\Users\[Username]\AppData\Local\ChemistryExplorer\OfflineResources
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setShowDownloadDialog(false)} disabled={isDownloading}>
              {isDownloading ? 
                getText('learn.resources.downloading', 'Downloading...') : 
                getText('learn.resources.close', 'Close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CategoryDescription({ category }: { category: ElementCategory }) {
  const { t } = useLanguage();
  
  switch (category) {
    case "alkali-metal":
      return <p>{t('learn.categories.alkaliDesc')}</p>;
    case "alkaline-earth":
      return <p>{t('learn.categories.alkalineDesc')}</p>;
    case "transition-metal":
      return <p>{t('learn.categories.transitionDesc')}</p>;
    case "post-transition":
      return <p>{t('learn.categories.postDesc')}</p>;
    case "metalloid":
      return <p>{t('learn.categories.metalloidDesc')}</p>;
    case "nonmetal":
      return <p>{t('learn.categories.nonmetalDesc')}</p>;
    case "noble-gas":
      return <p>{t('learn.categories.nobleDesc')}</p>;
    case "lanthanide":
      return <p>{t('learn.categories.lanthanideDesc')}</p>;
    case "actinide":
      return <p>{t('learn.categories.actinideDesc')}</p>;
    default:
      return <p>{t('learn.categories.unknownDesc')}</p>;
  }
}
