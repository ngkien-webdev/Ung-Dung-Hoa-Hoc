
import { Element } from '../constants';

interface ElementPosition {
  id: number;
  row: number;
  col: number;
}

// Positions for elements in the periodic table grid
export const elementPositions: ElementPosition[] = [
  // Period 1
  { id: 1, row: 1, col: 1 },  // H
  { id: 2, row: 1, col: 18 }, // He
  
  // Period 2
  { id: 3, row: 2, col: 1 },  // Li
  { id: 4, row: 2, col: 2 },  // Be
  { id: 5, row: 2, col: 13 }, // B
  { id: 6, row: 2, col: 14 }, // C
  { id: 7, row: 2, col: 15 }, // N
  { id: 8, row: 2, col: 16 }, // O
  { id: 9, row: 2, col: 17 }, // F
  { id: 10, row: 2, col: 18 }, // Ne
  
  // Period 3
  { id: 11, row: 3, col: 1 },  // Na
  { id: 12, row: 3, col: 2 },  // Mg
  { id: 13, row: 3, col: 13 }, // Al
  { id: 14, row: 3, col: 14 }, // Si
  { id: 15, row: 3, col: 15 }, // P
  { id: 16, row: 3, col: 16 }, // S
  { id: 17, row: 3, col: 17 }, // Cl
  { id: 18, row: 3, col: 18 }, // Ar
  
  // Period 4
  { id: 19, row: 4, col: 1 },  // K
  { id: 20, row: 4, col: 2 },  // Ca
  { id: 21, row: 4, col: 3 },  // Sc
  { id: 22, row: 4, col: 4 },  // Ti
  { id: 23, row: 4, col: 5 },  // V
  { id: 24, row: 4, col: 6 },  // Cr
  { id: 25, row: 4, col: 7 },  // Mn
  { id: 26, row: 4, col: 8 },  // Fe
  { id: 27, row: 4, col: 9 },  // Co
  { id: 28, row: 4, col: 10 }, // Ni
  { id: 29, row: 4, col: 11 }, // Cu
  { id: 30, row: 4, col: 12 }, // Zn
  { id: 31, row: 4, col: 13 }, // Ga
  { id: 32, row: 4, col: 14 }, // Ge
  { id: 33, row: 4, col: 15 }, // As
  { id: 34, row: 4, col: 16 }, // Se
  { id: 35, row: 4, col: 17 }, // Br
  { id: 36, row: 4, col: 18 }, // Kr
  
  // Period 5
  { id: 37, row: 5, col: 1 },  // Rb
  { id: 38, row: 5, col: 2 },  // Sr
  { id: 39, row: 5, col: 3 },  // Y
  { id: 40, row: 5, col: 4 },  // Zr
  { id: 41, row: 5, col: 5 },  // Nb
  { id: 42, row: 5, col: 6 },  // Mo
  { id: 43, row: 5, col: 7 },  // Tc
  { id: 44, row: 5, col: 8 },  // Ru
  { id: 45, row: 5, col: 9 },  // Rh
  { id: 46, row: 5, col: 10 }, // Pd
  { id: 47, row: 5, col: 11 }, // Ag
  { id: 48, row: 5, col: 12 }, // Cd
  { id: 49, row: 5, col: 13 }, // In
  { id: 50, row: 5, col: 14 }, // Sn
  { id: 51, row: 5, col: 15 }, // Sb
  { id: 52, row: 5, col: 16 }, // Te
  { id: 53, row: 5, col: 17 }, // I
  { id: 54, row: 5, col: 18 }, // Xe
  
  // Period 6
  { id: 55, row: 6, col: 1 },  // Cs
  { id: 56, row: 6, col: 2 },  // Ba
  
  // Lanthanides (placed in row 8 for display purposes)
  { id: 57, row: 8, col: 3 },  // La
  { id: 58, row: 8, col: 4 },  // Ce
  { id: 59, row: 8, col: 5 },  // Pr
  { id: 60, row: 8, col: 6 },  // Nd
  { id: 61, row: 8, col: 7 },  // Pm
  { id: 62, row: 8, col: 8 },  // Sm
  { id: 63, row: 8, col: 9 },  // Eu
  { id: 64, row: 8, col: 10 }, // Gd
  { id: 65, row: 8, col: 11 }, // Tb
  { id: 66, row: 8, col: 12 }, // Dy
  { id: 67, row: 8, col: 13 }, // Ho
  { id: 68, row: 8, col: 14 }, // Er
  { id: 69, row: 8, col: 15 }, // Tm
  { id: 70, row: 8, col: 16 }, // Yb
  { id: 71, row: 8, col: 17 }, // Lu
  
  // Period 6 (continued)
  { id: 72, row: 6, col: 4 },  // Hf
  { id: 73, row: 6, col: 5 },  // Ta
  { id: 74, row: 6, col: 6 },  // W
  { id: 75, row: 6, col: 7 },  // Re
  { id: 76, row: 6, col: 8 },  // Os
  { id: 77, row: 6, col: 9 },  // Ir
  { id: 78, row: 6, col: 10 }, // Pt
  { id: 79, row: 6, col: 11 }, // Au
  { id: 80, row: 6, col: 12 }, // Hg
  { id: 81, row: 6, col: 13 }, // Tl
  { id: 82, row: 6, col: 14 }, // Pb
  { id: 83, row: 6, col: 15 }, // Bi
  { id: 84, row: 6, col: 16 }, // Po
  { id: 85, row: 6, col: 17 }, // At
  { id: 86, row: 6, col: 18 }, // Rn
  
  // Period 7
  { id: 87, row: 7, col: 1 },  // Fr
  { id: 88, row: 7, col: 2 },  // Ra
  
  // Actinides (placed in row 9 for display purposes)
  { id: 89, row: 9, col: 3 },  // Ac
  { id: 90, row: 9, col: 4 },  // Th
  { id: 91, row: 9, col: 5 },  // Pa
  { id: 92, row: 9, col: 6 },  // U
  { id: 93, row: 9, col: 7 },  // Np
  { id: 94, row: 9, col: 8 },  // Pu
  { id: 95, row: 9, col: 9 },  // Am
  { id: 96, row: 9, col: 10 }, // Cm
  { id: 97, row: 9, col: 11 }, // Bk
  { id: 98, row: 9, col: 12 }, // Cf
  { id: 99, row: 9, col: 13 }, // Es
  { id: 100, row: 9, col: 14 }, // Fm
  { id: 101, row: 9, col: 15 }, // Md
  { id: 102, row: 9, col: 16 }, // No
  { id: 103, row: 9, col: 17 }, // Lr
  
  // Period 7 (continued)
  { id: 104, row: 7, col: 4 },  // Rf
  { id: 105, row: 7, col: 5 },  // Db
  { id: 106, row: 7, col: 6 },  // Sg
  { id: 107, row: 7, col: 7 },  // Bh
  { id: 108, row: 7, col: 8 },  // Hs
  { id: 109, row: 7, col: 9 },  // Mt
  { id: 110, row: 7, col: 10 }, // Ds
  { id: 111, row: 7, col: 11 }, // Rg
  { id: 112, row: 7, col: 12 }, // Cn
  { id: 113, row: 7, col: 13 }, // Nh
  { id: 114, row: 7, col: 14 }, // Fl
  { id: 115, row: 7, col: 15 }, // Mc
  { id: 116, row: 7, col: 16 }, // Lv
  { id: 117, row: 7, col: 17 }, // Ts
  { id: 118, row: 7, col: 18 }  // Og
];
