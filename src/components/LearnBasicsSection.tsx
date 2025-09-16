
import React from "react";
import { Card } from "@/components/ui/card";
import { Atom, Flame, BookOpen, Lightbulb } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import LearnInteractiveCard from "./LearnInteractiveCard";

const LearnBasicsSection: React.FC = () => {
  const { t } = useLanguage();

  // Helper function to handle translation fallbacks
  const getText = (key: string, fallback: string) => {
    const translation = t(key);
    return translation === key ? fallback : translation;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">{getText('learn.basics.atomTitle', 'What is an Atom?')}</h3>
      <p>{getText('learn.basics.atomDescription', 'Atoms are the basic units of matter and the defining structure of elements. They consist of three particles: protons, neutrons, and electrons.')}</p>
      
      <h3 className="text-lg font-medium">{getText('learn.basics.structureTitle', 'Atomic Structure')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <LearnInteractiveCard
          title={getText('learn.basics.nucleus', 'Nucleus')}
          icon={<Atom className="h-4 w-4 text-blue-500" />}
          detailsContent={
            <div className="space-y-4">
              <p>The nucleus is the central part of an atom. It contains positively charged protons and electrically neutral neutrons bound together by the strong nuclear force. It accounts for almost all of the atom's mass but occupies only a tiny fraction of its volume.</p>
              
              <h4 className="text-lg font-medium">Key Facts</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Discovered by Ernest Rutherford in 1911 through his famous gold foil experiment</li>
                <li>Typically about 10<sup>-15</sup> meters in diameter - about 100,000 times smaller than the atom itself</li>
                <li>Contains nearly all of the atom's mass (over 99.9%)</li>
                <li>Positively charged due to the presence of protons</li>
              </ul>
              
              <h4 className="text-lg font-medium">Protons and Neutrons</h4>
              <p>Protons and neutrons (collectively called nucleons) have nearly identical masses, approximately 1,836 times the mass of an electron. Protons carry a positive charge (+1), while neutrons have no charge.</p>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mt-2">
                <h5 className="font-medium mb-2">Nuclear Stability</h5>
                <p>The stability of a nucleus depends on the ratio of neutrons to protons. Too many or too few neutrons relative to the number of protons can make a nucleus unstable, leading to radioactive decay.</p>
              </div>
            </div>
          }
        >
          <p className="text-sm">{getText('learn.basics.nucleusDescription', 'Contains protons and neutrons, makes up most of the atom\'s mass.')}</p>
        </LearnInteractiveCard>
        
        <LearnInteractiveCard
          title={getText('learn.basics.electrons', 'Electrons')}
          icon={<Flame className="h-4 w-4 text-red-500" />}
          detailsContent={
            <div className="space-y-4">
              <p>Electrons are fundamental subatomic particles that orbit the nucleus of an atom. They have a negative electric charge and are involved in chemical bonding between atoms.</p>
              
              <h4 className="text-lg font-medium">Properties of Electrons</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Discovered by J.J. Thomson in 1897</li>
                <li>Mass is approximately 9.11 × 10<sup>-31</sup> kg - about 1/1836 the mass of a proton</li>
                <li>Carry a negative electric charge of 1.602 × 10<sup>-19</sup> coulombs</li>
                <li>Behave as both particles and waves (wave-particle duality)</li>
                <li>Located in probability clouds or "orbitals" around the nucleus</li>
              </ul>
              
              <h4 className="text-lg font-medium">Electron Configuration</h4>
              <p>Electrons are arranged in energy levels or shells around the nucleus. Each shell can contain a specific maximum number of electrons. The distribution of electrons in these shells is called the electron configuration.</p>
              
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md mt-2">
                <h5 className="font-medium mb-2">Chemical Reactivity</h5>
                <p>The electrons in the outermost shell (valence electrons) determine the chemical properties of an element. Elements with similar electron configurations in their outermost shells have similar chemical properties, which is the basis for the arrangement of the periodic table.</p>
              </div>
            </div>
          }
        >
          <p className="text-sm">{getText('learn.basics.electronsDescription', 'Negatively charged particles that orbit the nucleus in shells.')}</p>
        </LearnInteractiveCard>
        
        <LearnInteractiveCard
          title={getText('learn.basics.shells', 'Electron Shells')}
          icon={<BookOpen className="h-4 w-4 text-green-500" />}
          detailsContent={
            <div className="space-y-4">
              <p>Electron shells (also called energy levels) are regions around an atom's nucleus where electrons are most likely to be found. These shells are arranged in concentric spheres around the nucleus, with each shell having a specific energy level.</p>
              
              <h4 className="text-lg font-medium">Shell Structure</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Shells are labeled with numbers (1, 2, 3...) or letters (K, L, M...)</li>
                <li>The maximum number of electrons in each shell follows the 2n² rule, where n is the shell number</li>
                <li>Shell 1 (K): maximum 2 electrons</li>
                <li>Shell 2 (L): maximum 8 electrons</li>
                <li>Shell 3 (M): maximum 18 electrons</li>
                <li>Shell 4 (N): maximum 32 electrons</li>
              </ul>
              
              <h4 className="text-lg font-medium">Subshells</h4>
              <p>Each shell is composed of subshells (s, p, d, f), which represent different orbital shapes. These subshells fill in a specific order based on their energy levels.</p>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md mt-2">
                <h5 className="font-medium mb-2">The Octet Rule</h5>
                <p>Atoms tend to gain, lose, or share electrons to achieve a full outer shell (usually 8 electrons, called an octet). This tendency drives chemical bonding and explains why elements in the same group of the periodic table have similar chemical properties.</p>
              </div>
            </div>
          }
        >
          <p className="text-sm">{getText('learn.basics.shellsDescription', 'Energy levels where electrons are found around the nucleus.')}</p>
        </LearnInteractiveCard>
      </div>
      
      <h3 className="text-lg font-medium">{getText('learn.basics.tableTitle', 'The Periodic Table')}</h3>
      <p>{getText('learn.basics.tableDescription', 'The periodic table organizes all known elements based on their atomic number, electron configurations, and recurring chemical properties.')}</p>
      
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <h4 className="font-medium mb-2">{getText('learn.basics.didYouKnow', 'Did you know?')}</h4>
        <p className="text-sm">{getText('learn.basics.fact1', 'If you could see atoms, you would know that everything is mostly empty space.')}</p>
        <p className="text-sm mt-2">{getText('learn.basics.fact2', 'There are 118 known elements on the periodic table, but only about 90 occur naturally.')}</p>
      </div>
    </div>
  );
};

export default LearnBasicsSection;
